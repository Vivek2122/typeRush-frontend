import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../socket";
import axios from "axios";
import PlayersJoined from "../Components/PlayersJoined";
import toast from "react-hot-toast";

function CreateRoom() {
	const [roomId, setRoomId] = useState("");
	const [players, setPlayers] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		const getUserInfo = async () => {
			try {
				const res = await axios.get(
					"https://type-rush-backend.vercel.app/api/getUserInfo",
					{
						withCredentials: true,
					}
				);
				const userName = res.data.user.name;
				socket.emit("create-room", userName);
			} catch (err) {
				console.log(err);
			}
		};
		getUserInfo();

		socket.on("room-created", (roomId) => {
			setRoomId(roomId);
			toast.success("Room created successfully!");
		});

		socket.on("player-list", (playerlist) => {
			setPlayers(playerlist);
		});

		socket.on("room-closed", () => {
			navigate("/play/squad");
			alert("The host left. Room closed.");
		});

		return () => {
			socket.off("room-created");
			socket.off("player-list");
			socket.off("room-closed");
		};
	}, [navigate]);

	const startGame = () => {
		socket.emit("start-game", roomId);
		navigate(`/squad/arena/${roomId}`);
	};
	return (
		<div className="min-h-screen bg-gray-900 text-white flex flex-col items-center pt-12 font-mono px-4">
			<h1 className="text-2xl sm:text-3xl font-bold text-indigo-400 mb-6">
				Room Created
			</h1>

			<p className="text-base sm:text-lg mb-2">
				Share this Room ID with your friends:
			</p>

			<div className="bg-gray-800 px-4 py-2 rounded text-xl text-indigo-300 mb-6 select-all break-all">
				{roomId || "Creating..."}
			</div>

			<PlayersJoined players={players} />

			<button
				onClick={startGame}
				disabled={!roomId}
				className={`px-6 py-3 rounded text-lg transition ${
					roomId
						? "bg-indigo-500 hover:bg-indigo-600 cursor-pointer"
						: "bg-indigo-500/50 cursor-not-allowed"
				}`}
			>
				Start Game
			</button>
		</div>
	);
}

export default CreateRoom;
