import axios from 'axios';

export const usersApi = axios.create({
  baseURL: import.meta.env.VITE_USERS_API_URL || 'http://localhost:5001/api',
});

export const projectsApi = axios.create({
  baseURL: import.meta.env.VITE_PROJECTS_API_URL || 'http://localhost:5002/api',
});

export default projectsApi; // mantenemos un export default por compatibilidad, pero mejor usar los nombrados