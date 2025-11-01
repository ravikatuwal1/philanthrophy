import React, { createContext, useState, useEffect } from "react";
import API from "../api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const fetchMe = async () => {
    const { data } = await API.get("/users/me");
    setUser(data.user || data);
    return data.user || data;
  };


  const login = async (identifier, password) => {
    const { data } = await API.post("/users/login", { identifier, password });
    localStorage.setItem("token", data.token);
    // Immediately fetch profile so UI updates without refresh
    return fetchMe();
  };

  const register = async (formData) => {
    const { data } = await API.post("/users/register", formData);
    localStorage.setItem("token", data.token);
    return fetchMe();
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

useEffect(() => {
    // Bootstrap session on first load
    const token = localStorage.getItem("token");
    if (!token) return;
    fetchMe().catch(() => logout());
  }, []);


  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
