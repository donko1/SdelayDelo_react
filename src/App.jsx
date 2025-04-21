import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Test from './pages/Test';
import Getsettings from "./pages/Settings"
import LoginPage from "./pages/Login"
import { isProduct } from './utils/settings';
import { WhoamI } from './pages/Whoami';
import { removeUser } from './utils/auth';
import { getUser } from './utils/auth';
import { useState } from 'react';

function App() {
  const [reboot_data, reboot_func] = useState(0)
  return (
    <Router>
      <nav>
        <Link to="/">Главная</Link>
        
        {getUser() == undefined && (<Link to="/login">Войти</Link>)}
        {getUser() != undefined && (<button onClick={() => {
          removeUser();reboot_func(1)}}>Выйти</button>)}
      </nav>

      <Routes>
        <Route path="*" element={<h1>404: Страница не найдена</h1>} />
        {!isProduct() && (
        <>
          <Route path="/test/test" element={<Test />} />
          <Route path='/test/settings' element={<Getsettings />}/>
          <Route path="/test/whoami" element={<WhoamI />} />
          <Route path='/login' element={<LoginPage/>}/>
        </>
      )}

      </Routes>
    </Router>
  );
}

export default App;
