import React from "react";

function Leaderboard({ stats, userId }) {
	const sortedPlayers = [...stats].sort((a, b) => b.wpm - a.wpm);
	return (
		<div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
			<h1 className="text-4xl font-bold mb-8 text-center">🏆 Leaderboard</h1>

			<div className="w-full max-w-3xl overflow-x-auto">
				<table className="min-w-full bg-gray-800 rounded-xl shadow-md">
					<thead>
						<tr className="text-left border-b border-gray-600">
							<th className="py-3 px-4">Rank</th>
							<th className="py-3 px-4">Username</th>
							<th className="py-3 px-4">WPM</th>
							<th className="py-3 px-4">Progress (%)</th>
						</tr>
					</thead>
					<tbody>
						{sortedPlayers.map((player, index) => (
							<tr
								key={`${player.userId}-${player.name}`}
								className={`border-t border-gray-700 ${
									player.userId === userId ? "bg-blue-800" : "bg-gray-700"
								}`}
							>
								<td className="py-3 px-4">{index + 1}</td>
								<td className="py-3 px-4">{player.name}</td>
								<td className="py-3 px-4">{player.wpm}</td>
								<td className="py-3 px-4">{player.progress}%</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* <button
				onClick={() => window.location.reload()}
				className="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-xl shadow-lg transition"
			>
				🔁 Play Again
			</button> */}
		</div>
	);
}

export default Leaderboard;
