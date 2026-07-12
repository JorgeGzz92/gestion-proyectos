import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { projectsApi, usersApi } from '../services/api';
import socket from '../services/socket';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import Chat from '../components/Chat';

function ProjectDetail() {
  const { id } = useParams();
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [asignadoNombre, setAsignadoNombre] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    cargarTareas();
    cargarUsuarios();
  }, []);

  useEffect(() => {
    socket.on('notify', () => {
      cargarTareas();
    });
    return () => {
      socket.off('notify');
    };
  }, []);

  async function cargarTareas() {
    try {
      const res = await projectsApi.get('/tasks');
      const tareasDelProyecto = res.data.filter((t) => t.proyecto === id || t.proyecto?._id === id);
      setTasks(tareasDelProyecto);
    } catch (err) {
      setError('No se pudieron cargar las tareas');
    }
  }

  async function cargarUsuarios() {
    try {
      const res = await usersApi.get('/users'); // ahora viene de users-service, otro microservicio
      setUsers(res.data);
    } catch (err) {
      console.error('No se pudieron cargar los usuarios');
    }
  }

  function nombreDeUsuario(userId) {
    const u = users.find((u) => u._id === userId);
    return u ? u.nombre : null;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!titulo.trim()) {
      setError('El título de la tarea es obligatorio');
      return;
    }

    const usuarioEncontrado = users.find((u) => u.nombre.toLowerCase() === asignadoNombre.toLowerCase());

    if (asignadoNombre.trim() && !usuarioEncontrado) {
      setError('Ese usuario no existe. Elige uno de las sugerencias.');
      return;
    }

    try {
      await projectsApi.post('/tasks', {
        titulo,
        proyecto: id,
        asignadoA: usuarioEncontrado ? usuarioEncontrado._id : undefined,
      });
      setTitulo('');
      setAsignadoNombre('');
      setError('');
      cargarTareas();
      socket.emit('notify', { tipo: 'tarea-creada', proyecto: id }); // avisa a otros clientes
    } catch (err) {
      setError('Error al crear la tarea');
    }
  }

  async function cambiarEstado(taskId, nuevoEstado) {
    try {
      await projectsApi.put(`/tasks/${taskId}`, { estado: nuevoEstado });
      cargarTareas();
      socket.emit('notify', { tipo: 'tarea-actualizada', proyecto: id });
    } catch (err) {
      setError('Error al actualizar la tarea');
    }
  }

  async function handleDelete(taskId) {
    if (!confirm('¿Eliminar esta tarea?')) return;
    try {
      await projectsApi.delete(`/tasks/${taskId}`);
      cargarTareas();
      socket.emit('notify', { tipo: 'tarea-eliminada', proyecto: id });
    } catch (err) {
      setError('Error al eliminar la tarea');
    }
  }

  return (
    <div className="container">
      <Link to="/">← Volver a proyectos</Link>
      <h1>Tareas del proyecto</h1>

      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Título de la tarea" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
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
        <Card key={t._id}>
          <h3>{t.titulo}</h3>
          <StatusBadge estado={t.estado} />
          {t.asignadoA && nombreDeUsuario(t.asignadoA) && (
            <p style={{ marginTop: '6px', fontSize: '13px', opacity: 0.8 }}>
              Asignado a: {nombreDeUsuario(t.asignadoA)}
            </p>
          )}
          <div style={{ marginTop: '10px', display: 'flex', gap: '8px' }}>
            <select value={t.estado} onChange={(e) => cambiarEstado(t._id, e.target.value)}>
              <option value="pendiente">Pendiente</option>
              <option value="en progreso">En progreso</option>
              <option value="completada">Completada</option>
            </select>
            <button onClick={() => handleDelete(t._id)}>Eliminar</button>
          </div>
        </Card>
      ))}

      <Chat proyectoId={id} nombreUsuario="Jorge" />
    </div>
  );
}

export default ProjectDetail;