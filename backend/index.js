require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoute = require("./routes/userRoutes");
const cookieParser = require("cookie-parser");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const OAuth2Strategy = require("passport-google-oauth2");
const User = require("./models/userModel");

const app = express();
const PORT = 8000;

// connection

mongoose
  .connect("mongodb://127.0.0.1:27017/auth")
  .then(() => console.log("connected mongodb...."))
  .catch((err) => console.log("mongo error:", err));

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/user", userRoute);

//setup session
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// setup passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new OAuth2Strategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("profile", profile);
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            photo: profile.photos[0].value,
          });
        }
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// initial google oauth  login
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "http://localhost:3000/",
    failureRedirect: "http://localhost:3000/login",
  })
);

app.get("/login/success", async (req, res) => {
  console.log("reqq", req.user);
  if (req.user) {
    res.status(200).json({ message: "user login", user: req.user });
  } else {
    res.status(400).json({ message: "not authorized" });
  }
});

app.get("/api/clear-session", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error clearing session:", err);
      res.status(500).json({ error: "Failed to clear session" });
    } else {
      res.clearCookie("connect.sid"); // Clear the session cookie
      res.status(200).json({ message: "Session cleared successfully" });
    }
  });
});

app.listen(PORT, function (err) {
  if (err) console.log("Error in server setup");
  console.log("Server listening on Port", PORT);
});

// npm i jsonwebtoken
// npm i cors
// npm install cookie-parser
// npm i passport
// npm i passport-google-oauth2
// npm i express-session
