import { useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { getUser, removeUser } from "../utils/auth";

export default function HomeNotRegistered() {
  const [isAuthenticated, setIsAuthenticated] = useState(getUser() != null);
  const { refreshUser } = useUser();


  return (
    <div>
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
          <div className="home-content">
        <h1>Добро пожаловать!</h1>
        <p>Начните использовать наше приложение прямо сейчас</p>
        
        <div className="buttons-container">
          <Link to="/login" className="start-button">
            <button>Начать</button>
          </Link>
          <Link to="/demo" className="demo-button">
            <button>Демо</button>
          </Link>
        </div>
      </div>

  </div>
  );
}
