import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Getsettings from "@pages/SettingsPage"
import LoginPage from "@pages/LoginPage"
import { isProduct } from '@utils/helpers/settings';
import { WhoamI } from '@pages/WhoamiPage';
import HomePage from '@pages/HomePage';
import { UserProvider } from '@context/UserContext.jsx';

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="*" element={<h1>404: Страница не найдена</h1>} />
          {!isProduct() && (
            <>
              <Route path="" element={<HomePage />} />
              <Route path='/test/settings' element={<Getsettings />}/>
              <Route path="/test/whoami" element={<WhoamI />} />
              <Route path='/login' element={<LoginPage />} />
            </>
          )}
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
