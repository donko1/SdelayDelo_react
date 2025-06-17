import { useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { getUser, removeUser } from "../utils/auth";
import { chooseTextByLang, getOrSetLang } from "../utils/locale";

export default function HomeNotRegistered() {
  const [isAuthenticated, setIsAuthenticated] = useState(getUser() != null);
  const { refreshUser } = useUser();
  const lang = getOrSetLang();

  return (
    <div>
    <nav>
      <Link to="/">Главная</Link>

      {!isAuthenticated && <Link to="/login">{chooseTextByLang("Войти", "login", lang)}</Link>}
      {isAuthenticated && (
        <button
          onClick={() => {
            removeUser();
            setIsAuthenticated(false);
            refreshUser();
          }}
        >
          {chooseTextByLang("Выйти", 'Logout', lang)}
        </button>
      )}
    </nav>
          <div className="home-content">
        
        <div className="buttons-container">
          <Link to="/login" className="start-button">
            <button>{chooseTextByLang("Начать", "Get started", lang)}</button>
          </Link>
          <Link to="/demo" className="demo-button">
            <button>{chooseTextByLang("Демо", "Demo", lang)}</button>
          </Link>
        </div>
      </div>

  </div>
  );
}
