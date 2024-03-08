require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoute = require("./routes/userRoutes");
const cookieParser = require("cookie-parser");
const path = require("path");

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

app.listen(PORT, function (err) {
  if (err) console.log("Error in server setup");
  console.log("Server listening on Port", PORT);
});

// npm i jsonwebtoken
// npm i cors
// npm install cookie-parser
