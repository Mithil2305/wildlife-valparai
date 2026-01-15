import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import {
	HiMail,
	HiLockClosed,
	HiArrowRight,
	HiFingerPrint,
	HiLogin,
} from "react-icons/hi";
import toast from "react-hot-toast";

// Import the login functions from your authApi service
import { loginUser, signInWithGoogle } from "../services/authApi.js";
// Import auth state to redirect if already logged in
import { getAuthInstance, onAuthStateChanged } from "../services/firebase.js";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		const auth = getAuthInstance();
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				navigate("/");
			}
		});
		return () => unsubscribe();
	}, [navigate]);

	const handleLogin = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		const loginPromise = loginUser(email, password);

		toast.promise(loginPromise, {
			loading: "Accessing secure channel...",
			success: () => {
				setLoading(false);
				navigate("/");
				return <b>Welcome back!</b>;
			},
			error: (err) => {
				const message = err.message.replace("Firebase: ", "");
				setError(message);
				setLoading(false);
				return <b>Authentication failed</b>;
			},
		});
	};

	const handleGoogleLogin = async () => {
		setLoading(true);
		setError(null);
		const googlePromise = signInWithGoogle();

		toast.promise(googlePromise, {
			loading: "Connecting to Google...",
			success: () => {
				setLoading(false);
				navigate("/");
				return <b>Successfully logged in!</b>;
			},
			error: (err) => {
				const message = err.message.replace("Firebase: ", "");
				setError(message);
				setLoading(false);
				return <b>Login failed.</b>;
			},
		});
	};

	return (
		<div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center p-4 lg:p-8">
			<div className="bg-white w-full max-w-5xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[600px]">
				{/* --- Left Side: Visuals --- */}
				<div className="hidden lg:flex lg:w-5/12 bg-[#335833] relative flex-col justify-between p-12 text-white overflow-hidden">
					{/* Background Pattern */}
					<div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
					<div className="absolute top-0 left-0 w-64 h-64 bg-[#4A7A4A] rounded-full blur-3xl -ml-20 -mt-20 opacity-50"></div>
					<div className="absolute bottom-0 right-0 w-64 h-64 bg-[#1A331A] rounded-full blur-3xl -mr-20 -mb-20 opacity-50"></div>

					<div className="relative z-10">
						<div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center mb-6">
							<HiFingerPrint size={24} className="text-green-300" />
						</div>
						<h2 className="text-4xl font-extrabold tracking-tight leading-tight mb-4">
							Welcome <br />
							<span className="text-green-300">Back.</span>
						</h2>
						<p className="text-green-100/80 text-lg leading-relaxed">
							Your dashboard, stats, and community are waiting for you.
						</p>
					</div>

					<div className="relative z-10 space-y-4">
						<div className="p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
							<p className="text-sm font-medium text-green-100 italic">
								"The clearest way into the Universe is through a forest
								wilderness."
							</p>
							<p className="text-xs text-green-300 mt-2 font-bold uppercase tracking-widest">
								— John Muir
							</p>
						</div>
					</div>
				</div>

				{/* --- Right Side: Form --- */}
				<div className="w-full lg:w-7/12 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
					<div className="max-w-md mx-auto w-full">
						<div className="text-center mb-10">
							<div className="inline-flex lg:hidden w-12 h-12 bg-[#335833] rounded-xl items-center justify-center mb-4 text-white shadow-lg shadow-green-900/20">
								<HiLogin size={24} />
							</div>
							<h2 className="text-3xl font-bold text-gray-900">Sign In</h2>
						</div>

						{error && (
							<motion.div
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium mb-6 flex items-center gap-2 border border-red-100"
							>
								<span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
								{error}
							</motion.div>
						)}

						<form onSubmit={handleLogin} className="space-y-5">
							<div>
								<label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">
									Email Address
								</label>
								<div className="relative group">
									<HiMail
										className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-[#335833] transition-colors"
										size={18}
									/>
									<input
										type="email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										required
										placeholder="you@example.com"
										className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#335833] focus:bg-white focus:border-[#335833] outline-none font-medium transition-all"
									/>
								</div>
							</div>

							<div>
								<div className="flex justify-between items-center mb-1 ml-1">
									<label className="block text-xs font-bold text-gray-500 uppercase">
										Password
									</label>
									<Link
										to="/forgot-password"
										className="text-xs font-bold text-[#335833] hover:underline"
									>
										Forgot Password?
									</Link>
								</div>
								<div className="relative group">
									<HiLockClosed
										className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-[#335833] transition-colors"
										size={18}
									/>
									<input
										type="password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										required
										placeholder="••••••••"
										className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#335833] focus:bg-white focus:border-[#335833] outline-none font-medium transition-all"
									/>
								</div>
							</div>

							<motion.button
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								type="submit"
								disabled={loading}
								className="w-full py-4 bg-[#335833] text-white font-bold rounded-xl shadow-lg hover:bg-[#2a4a2a] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
							>
								{loading ? (
									"Authenticating..."
								) : (
									<>
										Sign In <HiArrowRight />
									</>
								)}
							</motion.button>
						</form>

						<div className="relative flex py-8 items-center">
							<div className="flex-grow border-t border-gray-200"></div>
							<span className="flex-shrink-0 mx-4 text-gray-400 text-xs uppercase tracking-widest font-bold">
								Or continue with
							</span>
							<div className="flex-grow border-t border-gray-200"></div>
						</div>

						<button
							onClick={handleGoogleLogin}
							disabled={loading}
							className="w-full py-3 px-4 flex justify-center items-center gap-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
						>
							<FcGoogle className="w-6 h-6" />
							<span>Google Account</span>
						</button>

						<p className="text-center text-sm text-gray-500 mt-8">
							New to the platform?{" "}
							<Link
								to="/register"
								className="text-[#335833] font-bold hover:underline"
							>
								Create an Account
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
