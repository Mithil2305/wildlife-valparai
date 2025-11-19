import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";

// Import the register functions from your authApi service
import { registerUser, signInWithGoogle } from "../services/authApi";
// Import auth state to redirect if already logged in
import { auth, onAuthStateChanged } from "../services/firebase";

const Register = () => {
	const [name, setName] = useState("");
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState(""); // <-- NEW: Phone number state
	const [accountType, setAccountType] = useState("viewer"); // <-- NEW: Account type state (defaults to "viewer" as per schema)
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	// Effect to redirect user if they are already logged in
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				// User is already logged in, redirect to homepage
				navigate("/");
			}
		});
		return () => unsubscribe();
	}, [navigate]);

	/**
	 * Handles the standard email/password registration.
	 */
	const handleRegister = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		// Client-side password check
		if (password !== confirmPassword) {
			setError("Passwords do not match.");
			setLoading(false);
			return;
		}

		try {
			// Call the registerUser function from authApi with all fields
			await registerUser(email, password, username, name, phone, accountType);
			// On success, onAuthStateChanged will trigger,
			// but we can also navigate immediately.
			navigate("/");
		} catch (err) {
			setError(err.message.replace("Firebase: ", "")); // Clean up Firebase errors
			setLoading(false);
		}
	};

	/**
	 * Handles the Google Sign-In popup.
	 * (Assumes your authApi.js handles new user creation on Google sign-in)
	 */
	const handleGoogleLogin = async () => {
		setLoading(true);
		setError(null);

		try {
			await signInWithGoogle();
			// On success, onAuthStateChanged will trigger the redirect.
			navigate("/");
		} catch (err) {
			setError(err.message.replace("Firebase: ", ""));
			setLoading(false);
		}
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
		<section className="min-h-[calc(100vh-150px)] flex items-center justify-center bg-gray-50 p-4 py-12">
			<motion.div
				variants={cardVariants}
				initial="hidden"
				animate="visible"
				className="w-full max-w-md p-8 bg-white rounded-xl shadow-xl space-y-6"
			>
				<h2 className="text-3xl font-bold text-center text-gray-800">
					Create Your Account
				</h2>

				{error && (
					<p className="text-sm text-center text-red-600 bg-red-50 p-3 rounded-lg">
						{error}
					</p>
				)}

				<form onSubmit={handleRegister} className="space-y-4">
					{/* Account Type */}
					<div>
						<label
							htmlFor="accountType"
							className="block text-sm font-medium text-gray-700"
						>
							I am a
						</label>
						<select
							id="accountType"
							value={accountType}
							onChange={(e) => setAccountType(e.target.value)}
							required
							className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#335833] focus:border-[#335833] bg-white"
						>
							<option value="viewer">User / Viewer</option>
							<option value="creator">Creator</option>
						</select>
					</div>

					{/* Full Name */}
					<div>
						<label
							htmlFor="name"
							className="block text-sm font-medium text-gray-700"
						>
							Full Name
						</label>
						<input
							id="name"
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
							className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#335833] focus:border-[#335833]"
							placeholder="John Doe"
						/>
					</div>

					{/* Username */}
					<div>
						<label
							htmlFor="username"
							className="block text-sm font-medium text-gray-700"
						>
							Username
						</label>
						<input
							id="username"
							type="text"
							value={username}
							onChange={(e) => setUsername(e.target.value.toLowerCase())}
							required
							className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#335833] focus:border-[#335833]"
							placeholder="johndoe"
						/>
					</div>

					{/* Email Address */}
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

					{/* Phone Number */}
					<div>
						<label
							htmlFor="phone"
							className="block text-sm font-medium text-gray-700"
						>
							Phone Number (Optional)
						</label>
						<input
							id="phone"
							type="tel"
							value={phone}
							onChange={(e) => setPhone(e.target.value)}
							className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#335833] focus:border-[#335833]"
							placeholder="+1 (555) 123-4567"
						/>
					</div>

					{/* Password */}
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

					{/* Confirm Password */}
					<div>
						<label
							htmlFor="confirmPassword"
							className="block text-sm font-medium text-gray-700"
						>
							Confirm Password
						</label>
						<input
							id="confirmPassword"
							type="password"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							required
							className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#335833] focus:border-[#335833]"
							placeholder="••••••••"
						/>
					</div>

					{/* Main Register Button */}
					<motion.button
						variants={buttonVariants}
						whileHover="hover"
						whileTap="tap"
						type="submit"
						disabled={loading}
						className="w-full py-3 px-4 bg-[#335833] text-white font-semibold rounded-lg shadow-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-[#335833] focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{loading ? "Creating Account..." : "Create Account"}
					</motion.button>
				</form>

				<div className="flex items-center my-6">
					<div className="flex-grow border-t border-gray-300"></div>
					<span className="mx-4 text-sm font-medium text-gray-500">or</span>
					<div className="flex-grow border-t border-gray-300"></div>
				</div>

				<motion.button
					variants={buttonVariants}
					whileHover="hover"
					whileTap="tap"
					onClick={handleGoogleLogin}
					disabled={loading}
					className="w-full py-3 px-4 flex justify-center items-center gap-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-200"
				>
					<FcGoogle className="w-6 h-6" />
					<span>Sign up with Google</span>
				</motion.button>

				<p className="text-sm text-center text-gray-600">
					Already have an account?{" "}
					<Link
						to="/login"
						className="font-medium text-[#335833] hover:underline"
					>
						Login
					</Link>
				</p>
			</motion.div>
		</section>
	);
};

export default Register;
