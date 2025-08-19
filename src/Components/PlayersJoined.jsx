import { motion } from "framer-motion";

function PlayersJoined({ players }) {
	return (
		<div className="text-center">
			<h2 className="text-xl font-semibold mb-2">Players Joined:</h2>
			<ul className="mb-6 space-y-1">
				{players.map((player) => (
					<motion.li
						key={player.id}
						initial={{ opacity: 0, x: -10 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.3 }}
						className="text-white"
					>
						{player.name}
					</motion.li>
				))}
			</ul>
		</div>
	);
}
export default PlayersJoined;
