import { createContext, useState, useEffect, useContext } from "react";
import { isParallel } from "@utils/helpers/settings";
import { useAuth } from "@context/AuthContext";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [username, setUsername] = useState(null);
  const { headers, isAuthenticated } = useAuth();
  const [refreshCount, setRefreshCount] = useState(0);

  const refreshUser = () => {
    setRefreshCount((prev) => prev + 1);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      setUsername(null);
      return;
    }

    const fetchUser = () => {
      const url = isParallel()
        ? "/api/whoami"
        : "http://localhost:8000/api/whoami";

      fetch(url, {
        method: "GET",
        headers: headers,
      })
        .then((res) => {
          if (!res.ok) throw new Error("Ошибка запроса");
          return res.json();
        })
        .then((data) => setUsername(data.user.username))
        .catch((err) => {
          console.error("Ошибка получения username:", err);
          setUsername(null);
        });
    };

    fetchUser();
  }, [refreshCount, isAuthenticated, headers]);

  const contextValue = {
    username,
    refreshUser,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
