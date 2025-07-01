import { useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "@context/UserContext";
import { useAuth } from "@context/AuthContext";
import { chooseTextByLang } from "@utils/helpers/locale";
import { useLang } from "@context/LangContext";

export default function HomeNotRegistered() {
  const { userToken, logout } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(userToken != null);
  const { refreshUser } = useUser();
  const { lang } = useLang();

  return (
    <div>
      <nav>
        <Link to="/">Главная</Link>

        {!isAuthenticated && (
          <Link to="/login">{chooseTextByLang("Войти", "login", lang)}</Link>
        )}
        {isAuthenticated && (
          <button
            onClick={() => {
              logout();
              setIsAuthenticated(false);
              refreshUser();
            }}
          >
            {chooseTextByLang("Выйти", "Logout", lang)}
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
