import React from "react";
import { useNavigate } from "react-router-dom";

function SquadHome() {
	const navigate = useNavigate();

	return (
		<div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center gap-8 font-mono">
			<h1 className="text-4xl font-bold text-indigo-400">Squad Play</h1>
			<div className="flex gap-4">
				<button
					onClick={() => navigate("/squad/create")}
					className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 rounded text-lg"
				>
					Create Room
				</button>
				<button
					onClick={() => navigate("/squad/join")}
					className="px-6 py-3 bg-gray-700 hover:bg-gray-800 rounded text-lg"
				>
					Join Room
				</button>
			</div>
		</div>
	);
}

export default SquadHome;
