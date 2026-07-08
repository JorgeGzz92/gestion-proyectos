import { useState, useEffect } from 'react';
import api from '../services/api';

function Users() {
  const [users, setUsers] = useState([]);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('miembro');
  const [error, setError] = useState('');

  useEffect(() => {
    cargarUsuarios();
  }, []);

  async function cargarUsuarios() {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (err) {
      setError('No se pudieron cargar los usuarios');
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Validaciones basicas
    if (!nombre.trim() || !email.trim() || !password.trim()) {
      setError('Nombre, email y contraseña son obligatorios');
      return;
    }
    if (!email.includes('@')) {
      setError('El email no es válido');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      await api.post('/users', { nombre, email, password, rol });
      setNombre('');
      setEmail('');
      setPassword('');
      setRol('miembro');
      setError('');
      cargarUsuarios();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear el usuario');
    }
  }

  async function handleDelete(id) {
    if (!confirm('¿Eliminar este usuario?')) return;
    try {
      await api.delete(`/users/${id}`);
      cargarUsuarios();
    } catch (err) {
      setError('Error al eliminar el usuario');
    }
  }

  return (
    <div className="container">
      <h1>Usuarios</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre completo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña (mín. 6 caracteres)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <select value={rol} onChange={(e) => setRol(e.target.value)}>
          <option value="miembro">Miembro</option>
          <option value="admin">Admin</option>
        </select>
        {error && <span className="error">{error}</span>}
        <button type="submit">Crear usuario</button>
      </form>

      {users.map((u) => (
        <div className="card" key={u._id}>
          <h3>{u.nombre}</h3>
          <p>{u.email}</p>
          <p>Rol: {u.rol}</p>
          <button onClick={() => handleDelete(u._id)}>Eliminar</button>
        </div>
      ))}
    </div>
  );
}

export default Users;