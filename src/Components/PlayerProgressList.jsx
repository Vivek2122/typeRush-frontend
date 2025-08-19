import React from "react";

function PlayerProgressList({ playersProgress }) {
	const sortedPlayers = Object.entries(playersProgress).sort(
		([, a], [, b]) => b.progress - a.progress // sort descending
	);

	return (
		<div className="w-full max-w-3xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
			{sortedPlayers.map(([userId, { name, progress }]) => (
				<div
					key={userId}
					className="bg-white/10 rounded-xl px-4 py-3 shadow flex flex-col gap-2"
				>
					<span className="text-white font-semibold text-sm truncate">
						{name || userId}
					</span>
					<div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
						<div
							className="bg-green-400 h-full rounded-full transition-all duration-300"
							style={{ width: `${progress}%` }}
						></div>
					</div>
					<span className="text-xs text-gray-300 text-right">
						{Math.round(progress)}%
					</span>
				</div>
			))}
		</div>
	);
}

export default PlayerProgressList;
