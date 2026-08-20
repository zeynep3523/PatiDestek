import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
  const savedUser = localStorage.getItem("user");
  return savedUser ? JSON.parse(savedUser) : null;
});

useEffect(() => {
  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
  }
}, [user]);
  const login = (newToken, userData) => {
  localStorage.setItem("token", newToken);
  localStorage.setItem("user", JSON.stringify(userData));

  setToken(newToken);
  setUser(userData);
};

  const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");

  setToken(null);
  setUser(null);
};

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}