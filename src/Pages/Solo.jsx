import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

function Solo() {
	const [name, setName] = useState("");
	const [targetText, setTargetText] = useState([]);
	const [renderedText, setRenderedText] = useState("");
	const [countdown, setCountdown] = useState(3);
	const [showTypingScreen, setShowTypingScreen] = useState(false);
	const [showStats, setShowStats] = useState(false);
	const inputRef = useRef(null);
	const typedRef = useRef("");
	const timerRef = useRef(null);
	const startTimeRef = useRef(null);
	const wrongCountRef = useRef(0);

	// Fetch user info & paragraph
	useEffect(() => {
		const getUserInfo = async () => {
			try {
				const res = await axios.get("http://localhost:8080/api/getUserInfo", {
					withCredentials: true,
				});
				setName(res.data.user.name);
			} catch (err) {
				console.log(err);
			}
		};

		const getTargetText = async () => {
			const res = await axios.get(
				"https://random-word-api.vercel.app/api?words=50&length=5"
			);
			let text = res.data.join(" ");
			setTargetText(text.split(""));
		};

		getUserInfo();
		getTargetText();
		inputRef.current?.focus();
	}, []);

	// Cleanup timeout on unmount
	useEffect(() => {
		return () => clearTimeout(timerRef.current);
	}, []);

	// Countdown logic
	useEffect(() => {
		if (countdown === 0) {
			setShowTypingScreen(true);
			startTimeRef.current = Date.now();
			inputRef.current?.focus();
			timerRef.current = setTimeout(() => {
				setShowStats(true);
				// setShowTypingScreen(false);
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
		// Check if user completed early
		if (typedRef.current.length >= targetText.length) {
			clearTimeout(timerRef.current);
			setShowStats(true);
			// setShowTypingScreen(false);
		}
	};

	const getCharClass = (char, i) => {
		if (!renderedText[i]) return "text-gray-500";
		if (renderedText[i] === targetText[i]) return "text-green-400";
		else {
			return "text-red-400 bg-red-700/20 rounded";
		}
	};

	const calculateWPM = () => {
		if (typedRef.current.length === 0) return 0;
		const elapsed = (Date.now() - startTimeRef.current) / 1000 / 60;
		const words = renderedText.trim().split(" ").length;
		return Math.round(words / elapsed);
	};

	const calculateAccuracy = () => {
		if (typedRef.current.length === 0) return 100;
		const correctCount = typedRef.current.length - wrongCountRef.current;
		return Math.round((correctCount / typedRef.current.length) * 100);
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
				<h1 className="text-2xl sm:text-3xl font-extrabold text-indigo-400">
					TypeRush
				</h1>
				<span className="text-sm sm:text-xl text-gray-300">
					Welcome, <span className="text-white font-bold">{name}</span>
				</span>
			</nav>

			{/* Typing Box */}
			<section
				ref={inputRef}
				tabIndex={0}
				onKeyDown={handleKeyDown}
				className="w-full max-w-5xl bg-white/5 border border-white/10 backdrop-blur-sm p-6 sm:p-8 rounded-xl shadow-lg outline-none cursor-text min-h-[200px]"
			>
				{showTypingScreen && (
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
				)}
			</section>
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
		</div>
	);
}

export default Solo;
