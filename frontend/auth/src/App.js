import React, { useContext } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Homepage from "./pages/Homepage";
import Signup from "./pages/Signup";
import AuthContext from "./AuthContext";

function App() {
  const { authenticated } = useContext(AuthContext);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route
          path="login"
          element={authenticated ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="signup"
          element={authenticated ? <Navigate to="/" /> : <Signup />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
