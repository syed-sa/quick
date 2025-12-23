import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (token, refreshToken,userName,userId,role) => {
    localStorage.setItem("token", token);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("userName", userName);
    localStorage.setItem("userId", userId);
    localStorage.setItem("role",role)
    const decoded = jwtDecode(token);
    setUser({ email: decoded.sub, name: userName , userId: userId ,role:role});
  };

  const logout = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  const accessToken = localStorage.getItem("token");
 try {
  const res = await fetch("http://localhost:8080/api/user/logout", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`, 
      "Content-Type": "application/json",
      "x-refresh-token": refreshToken,
    },
  });
    const data = await res.json();

    if (!res.ok) {
      console.error(data?.message || "Logout failed");
    } else {
      console.log(data?.message || "Logout successful");
    }
  } catch (err) {
    console.error("Error logging out:", err.message);
  }

  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  setUser(null);
};


  useEffect(() => {
    const token = localStorage.getItem("token");
    const userName = localStorage.getItem("userName");
    const userId = localStorage.getItem("userId");
    const role =  localStorage.getItem("role");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({ email: decoded.sub, name: userName, userId: userId , role:role});
      } catch (err) {
        logout(); // invalid token
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
