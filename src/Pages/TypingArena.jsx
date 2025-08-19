import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import socket from "../socket";
import Leaderboard from "../Components/Leaderboard";
import PlayerProgressList from "../Components/PlayerProgressList";
import { motion, AnimatePresence, progress } from "framer-motion";

function TypingArena() {
	const [name, setName] = useState("");
	const [targetText, setTargetText] = useState([]);
	const [renderedText, setRenderedText] = useState("");
	const [countdown, setCountdown] = useState(3);
	const [showTypingScreen, setShowTypingScreen] = useState(false);
	const [showStats, setShowStats] = useState(false);
	const [playersProgress, setPlayersProgress] = useState({});
	const [playerStats, setPlayerStats] = useState([]);
	const [showLeaderBoard, setShowLeaderBoard] = useState(false);
	const inputRef = useRef(null);
	const typedRef = useRef("");
	const timerRef = useRef(null);
	const startTimeRef = useRef(null);
	const wrongCountRef = useRef(0);
	const gameEndRef = useRef(false);
	const nameRef = useRef("");
	let wpmRef = useRef(null);
	let progressRef = useRef(null);

	// Fetch user info & paragraph
	useEffect(() => {
		const getUserInfo = async () => {
			try {
				const res = await axios.get(
					"https://type-rush-backend.vercel.app/api/getUserInfo",
					{
						withCredentials: true,
					}
				);
				setName(res.data.user.name);
				nameRef.current = res.data.user.name;
			} catch (err) {
				console.log(err);
			}
		};

		socket.on("set-text", (text) => {
			setTargetText(text);
			console.log("New Text", text);
		});

		socket.on("update-progress", ({ name, userId, progress, roomId }) => {
			setPlayersProgress((prev) => ({
				...prev,
				[userId]: { name, progress, roomId },
			}));
		});

		socket.on("game-ended", () => {
			const stats = {
				name: nameRef.current,
				userId: socket.id,
				progress: progressRef.current,
				wpm: wpmRef.current,
			};
			setTimeout(() => {
				const roomId = window.location.pathname.split("/").pop();
				socket.emit("personal-stats", { stats, roomId });
				console.log("Emitted stats", stats);
			}, 5000); // adjust delay if needed
		});

		socket.on("player-stats", (stats) => {
			console.log(stats);
			setPlayerStats(stats);
		});

		getUserInfo();

		return () => {
			socket.off("set-text");
			socket.off("update-progress");
			socket.off("game-ended");
			socket.off("player-stats");
		};
	}, []);

	// Cleanup timeout on unmount
	useEffect(() => {
		return () => clearTimeout(timerRef.current);
	}, []);

	// Countdown logic
	useEffect(() => {
		if (countdown === 0) {
			setShowTypingScreen(true);
			setTimeout(() => {
				inputRef.current?.focus();
			}, 50);
			startTimeRef.current = Date.now();
			timerRef.current = setTimeout(() => {
				setShowStats(true);
				const roomId = window.location.pathname.split("/").pop();
				socket.emit("game-end-request", roomId);
				// setShowTypingScreen(false);
				setTimeout(() => {
					setShowTypingScreen(false);
					setShowStats(false);
					setShowLeaderBoard(true);
				}, 15000);
			}, 30000);
			return;
		}

		const timer = setTimeout(() => {
			setCountdown((prev) => prev - 1);
		}, 1000);

		return () => clearTimeout(timer);
	}, [countdown]);

	const handleKeyDown = (e) => {
		if (!showTypingScreen || showStats) return;
		e.preventDefault();
		if (e.key === "Backspace") {
			typedRef.current = typedRef.current.slice(0, -1);
		} else if (e.key.length === 1) {
			const nextCharIndex = typedRef.current.length;
			if (e.key !== targetText[nextCharIndex]) {
				wrongCountRef.current += 1;
			}
			typedRef.current += e.key;
		}
		setRenderedText(typedRef.current);
		socket.emit("player-progress", {
			userId: socket.id,
			name,
			progress: getCorrectCharsCount(),
			roomId: window.location.pathname.split("/").pop(),
		});

		// Check if user completed early
		if (typedRef.current.length >= targetText.length) {
			if (calculateAccuracy() >= 85 && gameEndRef.current === false) {
				gameEndRef.current = true;
				clearTimeout(timerRef.current);
				setShowStats(true);
				// setShowTypingScreen(false);
				const roomId = window.location.pathname.split("/").pop();
				socket.emit("game-end-request", roomId);
				setTimeout(() => {
					setShowTypingScreen(false);
					setShowStats(false);
					setShowLeaderBoard(true);
				}, 5000);
				// return () => {
				// 	clearTimeout(timeout);
				// };
			} else {
				alert("Accuracy too low.");
			}
		}
	};

	const getCharClass = (char, i) => {
		if (!renderedText[i]) return "text-gray-500";
		if (renderedText[i] === targetText[i]) return "text-green-400";
		else {
			return "text-red-400 bg-red-700/20 rounded";
		}
	};
	// check how many words match exactly
	const calculateWPM = () => {
		if (!typedRef.current || !startTimeRef.current) {
			console.warn("Required refs are missing or reset");
		}
		if (typedRef.current.length === 0) return 0;
		const elapsed = (Date.now() - startTimeRef.current) / 1000 / 60;
		if (elapsed === 0) return 0;
		let correct = 0;
		for (let i = 0; i < typedRef.current.length; i++) {
			if (typedRef.current[i] === targetText[i]) correct++;
		}
		const words = Math.floor(correct / 5);
		wpmRef.current = Math.round(words / elapsed);
		return Math.round(words / elapsed);
	};

	const calculateAccuracy = () => {
		if (typedRef.current.length === 0) return 100;
		let correct = 0;
		for (let i = 0; i < typedRef.current.length; i++) {
			if (typedRef.current[i] === targetText[i]) correct++;
		}
		return Math.round((correct / typedRef.current.length) * 100);
	};

	const getCorrectCharsCount = () => {
		let cnt = 0;
		for (let i = 0; i < typedRef.current.length; i++) {
			if (typedRef.current[i] === targetText[i]) cnt++;
			else break;
		}
		progressRef.current = Math.round((cnt / targetText.length) * 100);
		return (cnt / targetText.length) * 100;
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white font-mono flex flex-col items-center px-4 py-6 relative overflow-hidden">
			{/* Countdown Overlay */}
			<AnimatePresence mode="wait">
				{countdown > 0 && (
					<motion.div
						key="backdrop"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
					>
						<motion.div
							key={countdown}
							initial={{ scale: 0.5, opacity: 0 }}
							animate={{ scale: 1.2, opacity: 1 }}
							exit={{ scale: 0.5, opacity: 0 }}
							transition={{ duration: 0.6 }}
							className="text-6xl sm:text-8xl font-bold text-white"
						>
							{countdown}
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Top nav */}
			<nav className="w-full max-w-5xl flex justify-between items-center mb-6">
				{showTypingScreen && (
					<div>
						<h1 className="text-2xl sm:text-3xl font-extrabold text-indigo-400">
							TypeRush
						</h1>
						<span className="text-sm sm:text-xl text-gray-300">
							Welcome, <span className="text-white font-bold">{name}</span>
						</span>
					</div>
				)}
			</nav>

			{/* Typing Box */}
			{showTypingScreen && (
				<section
					ref={inputRef}
					tabIndex={0}
					onKeyDown={handleKeyDown}
					className="w-full max-w-5xl bg-white/5 border border-white/10 backdrop-blur-sm p-6 sm:p-8 rounded-xl shadow-lg outline-none cursor-text min-h-[200px]"
				>
					<div className="flex flex-wrap gap-1 text-lg sm:text-xl leading-relaxed break-words">
						{targetText.map((char, i) => (
							<span
								key={i}
								className={`${getCharClass(char, i)} ${
									char === " " ? "inline-block w-2" : ""
								}`}
							>
								{char === " " ? "\u00A0" : char}
							</span>
						))}
					</div>
				</section>
			)}

			{/* Progress bars below */}
			{showTypingScreen && (
				<div className="w-full max-w-5xl">
					<h3 className="text-xl font-bold text-white my-4">Live Progress</h3>
					<PlayerProgressList playersProgress={playersProgress} />
				</div>
			)}

			{/*Personaal Stats*/}
			{showStats && (
				<div className="mt-10 text-center">
					<h2 className="text-3xl font-bold mb-4 text-indigo-400">
						Your Results
					</h2>
					<p className="text-lg">
						WPM: <span className="font-semibold">{calculateWPM()}</span>
					</p>
					<p className="text-lg">
						Characters Typed:{" "}
						<span className="font-semibold">{renderedText.length}</span>
					</p>
					<p className="text-lg">
						Accuracy:{" "}
						<span className="font-semibold">{calculateAccuracy()}%</span>
					</p>
				</div>
			)}

			{/*Leaderboard*/}
			{showLeaderBoard && playerStats.length > 0 && (
				<Leaderboard stats={playerStats} userId={socket.id} />
			)}
		</div>
	);
}

export default TypingArena;
