import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace('/api', '') // quitamos el /api porque el socket no lo usa
  : 'http://localhost:5000';

const socket = io(SOCKET_URL);

export default socket;