import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../socket";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import PlayersJoined from "../Components/PlayersJoined";

function JoinRoom() {
	const [roomId, setRoomId] = useState("");
	const [name, setName] = useState("");
	const [error, setError] = useState("");
	const [players, setPlayers] = useState([]);
	const [roomJoined, setRoomJoined] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const res = await axios.get(
					"https://type-rush-backend.vercel.app/api/getUserInfo",
					{
						withCredentials: true,
					}
				);
				setName(res.data.user.name);
			} catch (err) {
				console.log(err);
			}
		};
		fetchUser();

		socket.on("player-list", (playerlist) => {
			setPlayers(playerlist);
		});

		socket.on("room-error", (msg) => {
			setError(msg);
		});

		socket.on("start-game", (roomId) => {
			navigate(`/squad/arena/${roomId}`);
		});

		socket.on("room-closed", () => {
			alert("The host left. Room closed.");
			navigate("/play/squad");
		});

		return () => {
			socket.off("player-list");
			socket.off("room-error");
			socket.off("start-game");
			socket.off("room-closed");
		};
	}, []);

	const handleJoin = () => {
		if (!roomId.trim()) {
			setError("Room ID is required.");
			return;
		}
		setError("");
		socket.emit("join-room", { roomId: roomId.trim(), playerName: name });
		setRoomJoined(true);
	};

	return (
		<div className="min-h-screen bg-gray-900 text-white flex flex-col items-center pt-20 font-mono px-4">
			<AnimatePresence mode="wait">
				{roomJoined ? (
					<motion.div
						key="joined"
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						className="flex flex-col items-center text-center px-4"
					>
						<p className="text-lg text-indigo-300 mb-4 break-all">
							Room ID: <span className="font-bold">{roomId}</span>
						</p>
						<PlayersJoined players={players} />
					</motion.div>
				) : (
					<motion.div
						key="form"
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						className="w-full max-w-md text-center"
					>
						<h1 className="text-3xl font-bold text-indigo-400 mb-8">
							Join Room
						</h1>

						<input
							type="text"
							value={roomId}
							onChange={(e) => setRoomId(e.target.value)}
							placeholder="Enter Room ID"
							className="w-full px-4 py-2 text-lg rounded bg-gray-800 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4 text-center"
						/>

						{error && (
							<p className="text-red-400 mb-4 font-semibold">{error}</p>
						)}

						<button
							onClick={handleJoin}
							disabled={!roomId.trim()}
							className={`px-6 py-3 rounded text-lg transition 
							${
								roomId.trim()
									? "bg-indigo-500 hover:bg-indigo-600 cursor-pointer"
									: "bg-indigo-500/50 cursor-not-allowed"
							}`}
						>
							Join
						</button>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}

export default JoinRoom;
