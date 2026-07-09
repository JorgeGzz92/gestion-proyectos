import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Card from '../components/Card';

function Projects() {
  const [projects, setProjects] = useState([]);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [error, setError] = useState('');

  // Cargar proyectos cuando el componente aparece en pantalla
  useEffect(() => {
    cargarProyectos();
  }, []);

  async function cargarProyectos() {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (err) {
      setError('No se pudieron cargar los proyectos');
    }
  }

  async function handleSubmit(e) {
    e.preventDefault(); // evita que el formulario recargue la pagina

    // Validacion simple
    if (!nombre.trim()) {
      setError('El nombre del proyecto es obligatorio');
      return;
    }

    try {
      await api.post('/projects', { nombre, descripcion });
      setNombre('');
      setDescripcion('');
      setError('');
      cargarProyectos(); // refresca la lista
    } catch (err) {
      setError('Error al crear el proyecto');
    }
  }

  async function handleDelete(id) {
    if (!confirm('¿Eliminar este proyecto?')) return;
    try {
      await api.delete(`/projects/${id}`);
      cargarProyectos();
    } catch (err) {
      setError('Error al eliminar el proyecto');
    }
  }

  return (
    <div className="container">
      <h1>Proyectos</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre del proyecto"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <textarea
          placeholder="Descripción (opcional)"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
        {error && <span className="error">{error}</span>}
        <button type="submit">Crear proyecto</button>
      </form>

      {projects.map((p) => (
        <Card key={p._id}>
          <h3>{p.nombre}</h3>
          <p>{p.descripcion}</p>
          <p>Estado: {p.estado}</p>
          <Link to={`/proyectos/${p._id}`}>Ver tareas</Link>
          {' | '}
          <button onClick={() => handleDelete(p._id)}>Eliminar</button>
        </Card>
      ))}
    </div>
  );
}

export default Projects;