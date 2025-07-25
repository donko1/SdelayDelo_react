import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Getsettings from "@pages/SettingsPage";
import LoginPage from "@pages/LoginPage";
import { isProduct } from "@utils/helpers/settings";
import { WhoamI } from "@pages/WhoamiPage";
import HomePage from "@pages/HomePage";
import TestToastsPage from "@pages/TestToastPage";
import { UserProvider } from "@context/UserContext.jsx";
import { ActElemContextProvider } from "@context/ActElemContext";
import { LangProvider } from "@context/LangContext";
import { TimezoneProvider } from "@context/TimezoneContext";
import { AuthProvider } from "@context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <LangProvider>
          <TimezoneProvider>
            <ActElemContextProvider>
              <Router>
                <Routes>
                  <Route path="*" element={<h1>404: Страница не найдена</h1>} />
                  {!isProduct() && (
                    <>
                      <Route path="/test/settings" element={<Getsettings />} />
                      <Route path="/test/whoami" element={<WhoamI />} />
                      <Route path="/test/toast" element={<TestToastsPage />} />
                    </>
                  )}
                  <Route path="" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                </Routes>
              </Router>
            </ActElemContextProvider>
          </TimezoneProvider>
        </LangProvider>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
