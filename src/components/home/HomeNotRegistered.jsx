import { useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "@context/UserContext";
import { useAuth } from "@context/AuthContext";
import { chooseTextByLang } from "@utils/helpers/locale";
import { useLang } from "@context/LangContext";
import { create_demo } from "@utils/api/auth";

export default function HomeNotRegistered() {
  const { userToken, logout, login } = useAuth();
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
          <div className="demo-button">
            <button
              onClick={async () => {
                let token = await create_demo();
                login(token);
              }}
            >
              {chooseTextByLang("Демо", "Demo", lang)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
