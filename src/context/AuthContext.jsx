import { createContext, useState, useEffect, useContext, useMemo } from "react";
import Cookies from "js-cookie";
import { get_COOKIE_EXPIRES_DAYS } from "@utils/helpers/settings";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const USER_TOKEN_KEY = "user-token";
  const COOKIE_EXPIRES_DAYS = get_COOKIE_EXPIRES_DAYS();

  const [isUpdating, setIsUpdating] = useState(false);
  const [userToken, setUserToken] = useState(() => {
    return Cookies.get(USER_TOKEN_KEY) || null;
  });

  const headers = useMemo(
    () => ({
      "Content-Type": "application/json",
      ...(userToken && { Authorization: `Token ${userToken}` }),
    }),
    [userToken]
  );

  useEffect(() => {
    const token = Cookies.get(USER_TOKEN_KEY);
    if (token) setUserToken(token);
  }, []);

  const login = (token) => {
    Cookies.set(USER_TOKEN_KEY, token, {
      expires: COOKIE_EXPIRES_DAYS,
      path: "/",
      sameSite: "strict",
    });
    setUserToken(token);
  };

  const logout = () => {
    Cookies.remove(USER_TOKEN_KEY, { path: "/" });
    setUserToken(null);
  };

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === USER_TOKEN_KEY) {
        const token = Cookies.get(USER_TOKEN_KEY);
        setUserToken(token || null);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const value = {
    userToken,
    isAuthenticated: !!userToken,
    headers,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
