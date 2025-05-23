import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Test from './pages/Test';
import Getsettings from "./pages/Settings"
import LoginPage from "./pages/Login"
import { isProduct } from './utils/settings';
import { WhoamI } from './pages/Whoami';
import { removeUser } from './utils/auth';
import { getUser } from './utils/auth';
import { useState, useEffect } from 'react';
import HomePage from './pages/home';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(getUser() != null);

  return (
    <Router>
      <nav>
        <Link to="/">Главная</Link>
        
        {!isAuthenticated && (<Link to="/login">Войти</Link>)}
        {isAuthenticated && (
          <button onClick={() => {
            removeUser();
            setIsAuthenticated(false); 
          }}>Выйти</button>
        )}
      </nav>

      <Routes>
        <Route path="*" element={<h1>404: Страница не найдена</h1>} />
        {!isProduct() && (
        <>
          <Route path="" element={<HomePage />} />
          <Route path="/test/test" element={<Test />} />
          <Route path='/test/settings' element={<Getsettings />}/>
          <Route path="/test/whoami" element={<WhoamI />} />
          <Route path='/login' element={<LoginPage onLogin={() => setIsAuthenticated(true)} />}/>
        </>
      )}

      </Routes>
    </Router>
  );
}

export default App;
