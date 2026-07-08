import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Proyectos</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Projects />} />
        <Route path="/proyectos/:id" element={<ProjectDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;