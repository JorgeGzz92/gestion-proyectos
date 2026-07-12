import { io } from 'socket.io-client';

const NOTIFICATIONS_URL = import.meta.env.VITE_NOTIFICATIONS_URL || 'http://localhost:5003';

const socket = io(NOTIFICATIONS_URL);

export default socket;