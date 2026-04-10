import { io } from 'socket.io-client';
import { API_BASE_URL } from './config';

const SOCKET_URL = import.meta.env.DEV
    ? 'http://localhost:5000'
    : API_BASE_URL;

const socket = io(SOCKET_URL, {
    autoConnect: true,
    withCredentials: true,
});

export default socket;
