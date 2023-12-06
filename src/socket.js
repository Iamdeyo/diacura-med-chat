import { io } from "socket.io-client";
const BASE_URL = "https://diacura-med.onrender.com";
const socket = io(`${BASE_URL}`, {
  autoConnect: false,
});
export default socket;
