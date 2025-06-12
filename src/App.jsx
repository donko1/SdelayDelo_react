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
import { UserProvider } from './context/UserContext.jsx';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(getUser() != null);

  return (

    <UserProvider>
      <Router>
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

    </UserProvider>
  );
}

export default App;
