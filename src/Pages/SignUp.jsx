import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function SignUp() {
	const navigate = useNavigate();

	const [form, setForm] = useState({
		name: "",
		email: "",
		password: "",
	});

	useEffect(() => {
		const checkAuthStatus = async () => {
			try {
				const res = await axios.get(
					"https://typerush-backend.onrender.com/api/isAuthenticated",
					{
						withCredentials: true,
					}
				);
				if (res.status === 200 && res.data.msg === "Already logged in.") {
					toast.success("Already logged in!");
					navigate("/play");
				}
			} catch (err) {
				console.log("Error in auth", err);
			}
		};
		checkAuthStatus();
	}, [navigate]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const res = await axios.post(
				"https://typerush-backend.onrender.com/api/signup",
				form,
				{
					withCredentials: true,
				}
			);
			if (res.status === 201) {
				toast.success("Account created successfully! Please log in.");
				navigate("/login");
			}
		} catch (err) {
			if (err.response?.status === 409) toast.error("User already exists");
			else toast.error("Server error. Please try again later.");
		}
	};

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-200 flex items-center justify-center px-4">
			{/* Card */}
			<motion.div
				initial={{ opacity: 0, y: 30 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.75 }}
				className="bg-white/80 backdrop-blur-lg border border-white/30 shadow-xl rounded-2xl px-8 py-10 w-full max-w-md"
			>
				<h2 className="text-3xl font-bold text-center text-indigo-700 mb-8">
					Create Your Account
				</h2>

				<form className="space-y-5" onSubmit={handleSubmit}>
					<div>
						<label className="block text-sm text-gray-700 mb-1">
							Full Name
						</label>
						<input
							type="text"
							placeholder="John Doe"
							className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
							name="name"
							value={form.name}
							onChange={handleChange}
							required
						/>
					</div>

					<div>
						<label className="block text-sm text-gray-700 mb-1">
							Email Address
						</label>
						<input
							type="email"
							placeholder="you@example.com"
							className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
							name="email"
							value={form.email}
							onChange={handleChange}
							required
						/>
					</div>

					<div>
						<label className="block text-sm text-gray-700 mb-1">Password</label>
						<input
							type="password"
							placeholder="••••••••"
							minLength={8}
							className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
							name="password"
							value={form.password}
							onChange={handleChange}
							required
						/>
					</div>

					<button
						type="submit"
						className="w-full bg-indigo-600 hover:bg-indigo-700 hover:cursor-pointer text-white py-2 rounded-lg font-semibold transition duration-200"
					>
						Sign Up
					</button>

					<p className="text-center text-sm text-gray-600 mt-4">
						Already have an account?{" "}
						<Link
							to="/login"
							className="text-indigo-600 font-medium hover:underline hover:cursor-pointer"
						>
							Log in
						</Link>
					</p>
				</form>
				<button
					type="button"
					onClick={() =>
						(window.location.href =
							"https://typerush-backend.onrender.com/api/auth/google")
					}
					className="w-full mt-4 bg-gray-800 hover:bg-gray-900 hover:cursor-pointer text-white py-2 rounded-lg font-semibold transition duration-200 flex items-center justify-center"
				>
					<img
						src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
						alt="Google Logo"
						className="w-5 h-5 mr-2"
					/>
					Continue with Google
				</button>
			</motion.div>
		</div>
	);
}
