import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Test from './pages/Test';
import Getsettings from "./pages/Settings"
import { isProduct } from './utils/settings';

function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Главная</Link>
      </nav>

      <Routes>
        <Route path="*" element={<h1>404: Страница не найдена</h1>} />
        {!isProduct() && (
        <>
          <Route path="/test/test" element={<Test />} />
          <Route path='/test/settings' element={<Getsettings />}/>
        </>
      )}

      </Routes>
    </Router>
  );
}

export default App;
