import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Test from './pages/Test';
import Getsettings from "./pages/Settings"
import LoginPage from "./pages/Login"
import { isProduct } from './utils/settings';
import { WhoamI } from './pages/Whoami';


function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Главная</Link>
        {
          // TODO: сделай здесь логику, что бы только незареганным пользователям была страница
        }
        <Link to="/login">Войти</Link>
      </nav>

      <Routes>
        <Route path="*" element={<h1>404: Страница не найдена</h1>} />
        {!isProduct() && (
        <>
          <Route path="/test/test" element={<Test />} />
          <Route path='/test/settings' element={<Getsettings />}/>
          <Route path="/test/whoami" element={<WhoamI />} />
          <Route path='/login' element={<LoginPage />}/>
        </>
      )}

      </Routes>
    </Router>
  );
}

export default App;
