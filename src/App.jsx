import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Test from './pages/Test';

function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Главная</Link>
        <Link to="/test">Тест</Link>
      </nav>

      <Routes>
        <Route path="/test" element={<Test />} />
        <Route path="*" element={<h1>404: Страница не найдена</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
