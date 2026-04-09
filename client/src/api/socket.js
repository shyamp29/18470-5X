import { io } from 'socket.io-client';
import { API_BASE_URL } from './config';

// Single shared socket connection for the entire app.
// Falls back to localhost in dev when VITE_API_URL is not set.
const SOCKET_URL = API_BASE_URL || 'http://localhost:5000';

const socket = io(SOCKET_URL, {
    autoConnect: true,
    withCredentials: true,
});

export default socket;
