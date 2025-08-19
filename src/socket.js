import { io } from "socket.io-client";

const socket = io("https://type-rush-backend.vercel.app", {
	withCredentials: true,
});

export default socket;
