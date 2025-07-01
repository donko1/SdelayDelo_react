import { createContext, useState, useEffect, useContext } from "react";
import { isParallel } from "@utils/helpers/settings";
import { useAuth } from "@context/AuthContext";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [username, setUsername] = useState(null);
  const { headers, userToken } = useAuth();
  const [refreshCount, setRefreshCount] = useState(0);
  const [isRegistered, setIsRegistered] = useState(!!userToken);

  const refreshUser = () => {
    setIsRegistered(!!userToken);
    setRefreshCount((prev) => prev + 1);
  };

  useEffect(() => {
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
  }, [refreshCount]);

  const contextValue = {
    username,
    refreshUser,
    isRegistered,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
