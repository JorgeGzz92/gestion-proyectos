import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Users from './pages/Users';

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Proyectos</Link>
        <Link to="/usuarios">Usuarios</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Projects />} />
        <Route path="/proyectos/:id" element={<ProjectDetail />} />
        <Route path="/usuarios" element={<Users />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;