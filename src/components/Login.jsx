import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast"; // Import toast

// Import the login functions from your authApi service
import { loginUser, signInWithGoogle } from "../services/authApi.js";
// Import auth state to redirect if already logged in
import { auth, onAuthStateChanged } from "../services/firebase.js";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState(null); // Keep local error for inline message
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	// Effect to redirect user if they are already logged in
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				// User is already logged in, redirect to homepage or dashboard
				navigate("/");
			}
		});
		// Cleanup subscription on unmount
		return () => unsubscribe();
	}, [navigate]);

	/**
	 * Handles the standard email/password login.
	 */
	const handleLogin = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		const loginPromise = loginUser(email, password);

		toast.promise(loginPromise, {
			loading: "Logging in...",
			success: () => {
				setLoading(false);
				navigate("/"); // Navigate on success
				return <b>Successfully logged in!</b>;
			},
			error: (err) => {
				const message = err.message.replace("Firebase: ", "");
				setError(message); // Set inline error
				setLoading(false);
				return <b>Login failed:</b>; // Toast message
			},
		});
	};

	/**
	 * Handles the Google Sign-In popup.
	 */
	const handleGoogleLogin = async () => {
		setLoading(true);
		setError(null);
		const googlePromise = signInWithGoogle();

		toast.promise(googlePromise, {
			loading: "Opening Google Sign-In...",
			success: () => {
				setLoading(false);
				navigate("/"); // Navigate on success
				return <b>Successfully logged in!</b>;
			},
			error: (err) => {
				const message = err.message.replace("Firebase: ", "");
				setError(message); // Set inline error
				setLoading(false);
				return <b>Login failed.</b>; // Toast message
			},
		});
	};

	// Animation variants for the main card
	const cardVariants = {
		hidden: { opacity: 0, y: -20 },
		visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
	};

	// Animation variants for the buttons
	const buttonVariants = {
		hover: { scale: 1.03 },
		tap: { scale: 0.98 },
	};

	return (
		<section className="min-h-[calc(100vh-150px)] flex items-center justify-center bg-gray-50 p-4">
			<motion.div
				variants={cardVariants}
				initial="hidden"
				animate="visible"
				className="w-full max-w-md p-8 bg-white rounded-xl shadow-xl space-y-6"
			>
				{/* Logo has been removed as requested */}
				<h2 className="text-2xl font-semibold text-center text-gray-800">
					Welcome Back
				</h2>

				{/* Error Message Display */}
				{error && (
					<p className="text-sm text-center text-red-600 bg-red-50 p-3 rounded-lg">
						{error}
					</p>
				)}

				{/* Login Form */}
				<form onSubmit={handleLogin} className="space-y-4">
					<div>
						<label
							htmlFor="email"
							className="block text-sm font-medium text-gray-700"
						>
							Email Address
						</label>
						<input
							id="email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#335833] focus:border-[#335833]"
							placeholder="you@example.com"
						/>
					</div>

					<div>
						<label
							htmlFor="password"
							className="block text-sm font-medium text-gray-700"
						>
							Password
						</label>
						<input
							id="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#335833] focus:border-[#335833]"
							placeholder="••••••••"
						/>
					</div>

					<div className="text-right">
						<Link
							to="/forgot-password" // You'll need to create this route
							className="text-sm font-medium text-[#335833] hover:underline"
						>
							Forgot Password?
						</Link>
					</div>

					{/* Main Login Button */}
					<motion.button
						variants={buttonVariants}
						whileHover="hover"
						whileTap="tap"
						type="submit"
						disabled={loading}
						className=" cursor-pointer w-full py-3 px-4 bg-[#335833] text-white font-semibold rounded-lg shadow-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-[#335833] focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{loading ? "Logging in..." : "Login"}
					</motion.button>
				</form>

				{/* "Or" Separator */}
				<div className="flex items-center my-6">
					<div className="flex-grow border-t border-gray-300"></div>
					<span className="mx-4 text-sm font-medium text-gray-500">or</span>
					<div className="flex-grow border-t border-gray-300"></div>
				</div>

				{/* Google Login Button */}
				<motion.button
					variants={buttonVariants}
					whileHover="hover"
					whileTap="tap"
					onClick={handleGoogleLogin}
					disabled={loading}
					className="cursor-pointer w-full py-3 px-4 flex justify-center items-center gap-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-200"
				>
					<FcGoogle className="w-6 h-6" />
					<span>Login with Google</span>
				</motion.button>

				{/* Sign Up Link */}
				<p className="text-sm text-center text-gray-600">
					Don't have an account yet?{" "}
					<Link
						to="/register"
						className="font-medium text-[#335833] hover:underline"
					>
						Register an Account!
					</Link>
				</p>
			</motion.div>
		</section>
	);
};

export default Login;
