import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { User, Users } from "lucide-react";
import backgroundSvg from "../assets/Typing-bro.svg";

export default function PlayPage() {
	const navigate = useNavigate();
	const [name, setName] = useState("");

	const greetings = [
		`Welcome back, ${name}!`,
		`Ready to race, ${name}?`,
		`Let’s type like lightning, ${name}!`,
		`Time to crush some keys, ${name}!`,
	];
	const randomGreeting =
		greetings[Math.floor(Math.random() * greetings.length)];

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
		getUserInfo();
	}, []);

	const modes = [
		{
			title: "Solo Play",
			description: "Practice your typing skills at your own pace.",
			icon: <User size={40} />,
			link: "/play/solo",
		},
		{
			title: "Squad Play",
			description: "Compete with friends in real-time battles.",
			icon: <Users size={40} />,
			link: "/play/squad",
		},
	];

	return (
		<div className="relative min-h-screen bg-gradient-to-br from-indigo-900 to-black text-white px-4 py-10 flex items-center justify-center overflow-hidden">
			{/* Background Image */}
			<img
				src={backgroundSvg}
				alt="Background"
				className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none opacity-20 w-[90vw] max-w-6xl blur-sm"
			/>

			{/* Greeting */}
			<motion.h2
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				className="absolute top-6 right-6 text-end max-w-[90vw] sm:max-w-md text-xl sm:text-3xl font-extrabold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-transparent bg-clip-text break-words"
			>
				{randomGreeting}
			</motion.h2>

			{/* Main Content */}
			<motion.div
				initial={{ opacity: 0, y: 40 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				className="max-w-4xl w-full text-center relative z-10"
			>
				<h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
					Choose Your Mode
				</h1>
				<p className="text-gray-300 text-lg mb-12">
					Ready your fingers. Whether you're training or challenging friends —
					it's game time.
				</p>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					{modes.map((mode, i) => (
						<motion.div
							key={i}
							whileHover={{ scale: 1.03 }}
							whileTap={{ scale: 0.97 }}
							className="bg-white/5 backdrop-blur-md border border-white/10 shadow-xl rounded-2xl p-6 cursor-pointer transition"
							onClick={() => navigate(mode.link)}
						>
							<div className="flex flex-col items-center space-y-4">
								<div className="text-pink-500">{mode.icon}</div>
								<h2 className="text-2xl font-semibold">{mode.title}</h2>
								<p className="text-gray-300">{mode.description}</p>
							</div>
						</motion.div>
					))}
				</div>
			</motion.div>
		</div>
	);
}
