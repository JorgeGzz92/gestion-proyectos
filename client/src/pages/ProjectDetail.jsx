import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

function ProjectDetail() {
  const { id } = useParams();
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [asignadoNombre, setAsignadoNombre] = useState(''); // lo que el usuario escribe
  const [error, setError] = useState('');

  useEffect(() => {
    cargarTareas();
    cargarUsuarios();
  }, []);

  async function cargarTareas() {
    try {
      const res = await api.get('/tasks');
      const tareasDelProyecto = res.data.filter(
        (t) => t.proyecto === id || t.proyecto?._id === id
      );
      setTasks(tareasDelProyecto);
    } catch (err) {
      setError('No se pudieron cargar las tareas');
    }
  }

  async function cargarUsuarios() {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (err) {
      console.error('No se pudieron cargar los usuarios');
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!titulo.trim()) {
      setError('El título de la tarea es obligatorio');
      return;
    }

    // Buscamos si lo que escribio coincide con un usuario real (autocompletado)
    const usuarioEncontrado = users.find(
      (u) => u.nombre.toLowerCase() === asignadoNombre.toLowerCase()
    );

    if (asignadoNombre.trim() && !usuarioEncontrado) {
      setError('Ese usuario no existe. Elige uno de las sugerencias.');
      return;
    }

    try {
      await api.post('/tasks', {
        titulo,
        proyecto: id,
        asignadoA: usuarioEncontrado ? usuarioEncontrado._id : undefined,
      });
      setTitulo('');
      setAsignadoNombre('');
      setError('');
      cargarTareas();
    } catch (err) {
      setError('Error al crear la tarea');
    }
  }

  async function cambiarEstado(taskId, nuevoEstado) {
    try {
      await api.put(`/tasks/${taskId}`, { estado: nuevoEstado });
      cargarTareas();
    } catch (err) {
      setError('Error al actualizar la tarea');
    }
  }

  async function handleDelete(taskId) {
    if (!confirm('¿Eliminar esta tarea?')) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      cargarTareas();
    } catch (err) {
      setError('Error al eliminar la tarea');
    }
  }

  return (
    <div className="container">
      <Link to="/">← Volver a proyectos</Link>
      <h1>Tareas del proyecto</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Título de la tarea"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />

        {/* Autocompletado nativo con datalist */}
        <input
          type="text"
          placeholder="Asignar a... (opcional, empieza a escribir)"
          value={asignadoNombre}
          onChange={(e) => setAsignadoNombre(e.target.value)}
          list="lista-usuarios"
        />
        <datalist id="lista-usuarios">
          {users.map((u) => (
            <option key={u._id} value={u.nombre} />
          ))}
        </datalist>

        {error && <span className="error">{error}</span>}
        <button type="submit">Agregar tarea</button>
      </form>

      {tasks.length === 0 && <p>No hay tareas todavía.</p>}

      {tasks.map((t) => (
        <div className="card" key={t._id}>
          <h3>{t.titulo}</h3>
          <span className={`badge ${t.estado.replace(' ', '-')}`}>{t.estado}</span>
          {t.asignadoA && (
            <p style={{ marginTop: '6px', fontSize: '13px', opacity: 0.8 }}>
              Asignado a: {t.asignadoA.nombre || 'Usuario'}
            </p>
          )}
          <div style={{ marginTop: '10px', display: 'flex', gap: '8px' }}>
            <select
              value={t.estado}
              onChange={(e) => cambiarEstado(t._id, e.target.value)}
            >
              <option value="pendiente">Pendiente</option>
              <option value="en progreso">En progreso</option>
              <option value="completada">Completada</option>
            </select>
            <button onClick={() => handleDelete(t._id)}>Eliminar</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProjectDetail;