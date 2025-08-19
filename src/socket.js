import { io } from "socket.io-client";

const socket = io("https://typerush-backend.onrender.com", {
	withCredentials: true,
});

export default socket;
