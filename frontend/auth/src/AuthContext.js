import React, { createContext, useState } from "react";
import Cookies from "js-cookie";

// Create the context
const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(
    !!Cookies.get("authorization")
  );

  console.log("tokennn:", Cookies.get("myCookie"));

  const login = () => {
    setAuthenticated(true);
  };

  const logout = () => {
    Cookies.remove("authorization");
    setAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ authenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
