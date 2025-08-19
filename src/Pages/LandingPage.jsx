import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import typingImg from "../assets/Typing-bro.svg";

export default function LandingPage() {
	const navigate = useNavigate();

	return (
		<div className="relative min-h-screen bg-gradient-to-br from-indigo-900 to-black text-white px-6 py-10 overflow-hidden">
			{/* Background SVG Image */}
			<img
				src={typingImg}
				alt="Typing background"
				className="absolute opacity-10 w-[800px] lg:w-[1000px] right-[-100px] top-1/2 -translate-y-1/2 z-0 pointer-events-none select-none"
			/>

			<div className="absolute w-[400px] h-[400px] bg-indigo-500 opacity-30 blur-3xl rounded-full top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 z-0" />

			{/* Main Content */}
			<div className="relative z-10 max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12">
				{/* Text Content */}
				<div className="flex-1 space-y-6 text-center lg:text-left">
					<motion.h1
						initial={{ opacity: 0, y: -40 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						className="text-5xl lg:text-6xl font-extrabold leading-tight"
					>
						Speed Typing, <br /> Reimagined.
					</motion.h1>
					<p className="text-lg text-gray-300 max-w-xl mx-auto lg:mx-0">
						Battle friends or test yourself solo. Real-time multiplayer typing
						game that sharpens your speed and accuracy.
					</p>

					{/* CTA Button */}
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={() => navigate("/signup")}
						className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-semibold shadow-xl flex items-center gap-2 mx-auto lg:mx-0"
					>
						Get Started <ArrowRight size={20} />
					</motion.button>
				</div>
			</div>

			{/* Features */}
			<div className="relative z-10 max-w-4xl mx-auto mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
				{[
					{
						title: "⚡ Real-Time Multiplayer",
						desc: "Race others instantly in high-speed typing battles.",
					},
					{
						title: "📊 Live WPM & Accuracy",
						desc: "Track every keystroke with precision metrics.",
					},
					{
						title: "🎯 Learn While Having Fun",
						desc: "Practice typing with engaging content that keeps learning enjoyable.",
					},
				].map((feat, i) => (
					<motion.div
						key={i}
						initial={{ opacity: 0, y: 40 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: i * 0.2, duration: 0.5 }}
						className="bg-white/5 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/10"
					>
						<h3 className="text-xl font-semibold mb-2">{feat.title}</h3>
						<p className="text-gray-300">{feat.desc}</p>
					</motion.div>
				))}
			</div>
		</div>
	);
}
