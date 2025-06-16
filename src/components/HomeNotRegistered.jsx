import { useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { getUser, removeUser } from "../utils/auth";

export default function HomeNotRegistered() {
  const [isAuthenticated, setIsAuthenticated] = useState(getUser() != null);
  const { refreshUser } = useUser();


  return (
    <nav>
      <Link to="/">Главная</Link>

      {!isAuthenticated && <Link to="/login">Войти</Link>}
      {isAuthenticated && (
        <button
          onClick={() => {
            removeUser();
            setIsAuthenticated(false);
            refreshUser();
          }}
        >
          Выйти
        </button>
      )}
    </nav>
  );
}
