import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import {
	HiCheckCircle,
	HiXCircle,
	HiUser,
	HiMail,
	HiPhone,
	HiLockClosed,
	HiIdentification,
	HiCamera,
	HiArrowRight,
} from "react-icons/hi";
import { getDoc } from "firebase/firestore";
import { registerUser, signInWithGoogle } from "../services/authApi";
import {
	getAuthInstance,
	getUsernameDoc,
	onAuthStateChanged,
} from "../services/firebase";
import { verifyCaptcha } from "../services/workerApi.js";
import CloudflareTurnstile from "./CloudflareTurnstile.jsx";

const Register = () => {
	const [name, setName] = useState("");
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [accountType, setAccountType] = useState("viewer");
	const [upiId, setUpiId] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const [error, setError] = useState(null);
	const [usernameStatus, setUsernameStatus] = useState("idle"); // idle, checking, available, taken
	const [loading, setLoading] = useState(false);
	const [captchaToken, setCaptchaToken] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		const auth = getAuthInstance();
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) navigate("/");
		});
		return () => unsubscribe();
	}, [navigate]);

	// Reset status when typing
	useEffect(() => {
		if (usernameStatus !== "idle") setUsernameStatus("idle");
	}, [username]);

	const checkUsername = async () => {
		if (username.length < 3) return;
		setUsernameStatus("checking");
		try {
			const usernameRef = await getUsernameDoc(username.toLowerCase());
			const usernameSnap = await getDoc(usernameRef);
			if (usernameSnap.exists()) {
				setUsernameStatus("taken");
			} else {
				setUsernameStatus("available");
			}
		} catch (err) {
			console.error("Error checking username:", err);
			setUsernameStatus("idle");
		}
	};

	const handleRegister = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		if (!captchaToken) {
			setError("Please complete the CAPTCHA verification.");
			setLoading(false);
			return;
		}

		if (password !== confirmPassword) {
			setError("Passwords do not match.");
			setLoading(false);
			return;
		}

		// Force check if not verified yet
		if (usernameStatus !== "available") {
			const usernameRef = await getUsernameDoc(username.toLowerCase());
			const usernameSnap = await getDoc(usernameRef);
			if (usernameSnap.exists()) {
				setError("Username is taken. Please choose another.");
				setUsernameStatus("taken");
				setLoading(false);
				return;
			}
		}

		try {
			await verifyCaptcha(captchaToken);
			await registerUser(
				email,
				password,
				username,
				name,
				phone,
				accountType,
				upiId,
			);
			navigate("/");
		} catch (err) {
			setError(err.message.replace("Firebase: ", ""));
			setLoading(false);
		}
	};

	const handleGoogleLogin = async () => {
		if (!captchaToken) {
			setError("Please complete the CAPTCHA verification.");
			return;
		}
		setLoading(true);
		setError(null);
		try {
			await verifyCaptcha(captchaToken);
			await signInWithGoogle();
			navigate("/");
		} catch (err) {
			setError(err.message.replace("Firebase: ", ""));
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center p-4 lg:p-8">
			<div className="bg-white w-full max-w-5xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[600px]">
				{/* --- Left Side: Visuals --- */}
				<div className="hidden lg:flex lg:w-5/12 bg-[#1A331A] relative flex-col justify-between p-12 text-white overflow-hidden">
					{/* Background Pattern */}
					<div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
					<div className="absolute top-0 right-0 w-64 h-64 bg-[#335833] rounded-full blur-3xl -mr-20 -mt-20 opacity-50"></div>
					<div className="absolute bottom-0 left-0 w-64 h-64 bg-[#4A7A4A] rounded-full blur-3xl -ml-20 -mb-20 opacity-50"></div>

					<div className="relative z-10">
						<div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center mb-6">
							<HiCamera size={24} className="text-green-300" />
						</div>
						<h2 className="text-4xl font-extrabold tracking-tight leading-tight mb-4">
							Capture the <br />
							<span className="text-green-300">Untamed.</span>
						</h2>
						<p className="text-green-100/80 text-lg leading-relaxed">
							Join a community of 5,000+ creators documenting the wildlife of
							Valparai.
						</p>
					</div>

					<div className="relative z-10 space-y-4">
						<div className="flex items-center gap-3 text-sm font-medium text-green-100/70">
							<div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
								<HiCheckCircle />
							</div>
							<span>Earn cash prizes monthly</span>
						</div>
						<div className="flex items-center gap-3 text-sm font-medium text-green-100/70">
							<div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
								<HiCheckCircle />
							</div>
							<span>Connect with nature experts</span>
						</div>
						<div className="flex items-center gap-3 text-sm font-medium text-green-100/70">
							<div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
								<HiCheckCircle />
							</div>
							<span>Contribute to conservation</span>
						</div>
					</div>
				</div>

				{/* --- Right Side: Form --- */}
				<div className="w-full lg:w-7/12 p-8 md:p-12 lg:p-16 overflow-y-auto">
					<div className="max-w-md mx-auto">
						<h2 className="text-3xl font-bold text-gray-900 mb-2">
							Get Started
						</h2>
						<p className="text-gray-500 mb-8">
							Create your account to start your journey.
						</p>

						<button
							onClick={handleGoogleLogin}
							disabled={loading}
							className="w-full py-3 px-4 flex justify-center items-center gap-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm mb-6"
						>
							<FcGoogle className="w-6 h-6" />
							<span>Continue with Google</span>
						</button>

						<div className="relative flex py-2 items-center mb-6">
							<div className="flex-grow border-t border-gray-200"></div>
							<span className="flex-shrink-0 mx-4 text-gray-400 text-xs uppercase tracking-widest font-bold">
								Or register with email
							</span>
							<div className="flex-grow border-t border-gray-200"></div>
						</div>

						{error && (
							<motion.div
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium mb-6 flex items-center gap-2"
							>
								<HiXCircle size={20} />
								{error}
							</motion.div>
						)}

						<form onSubmit={handleRegister} className="space-y-5">
							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">
										Account Type
									</label>
									<div className="relative">
										<select
											value={accountType}
											onChange={(e) => setAccountType(e.target.value)}
											className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#335833] focus:bg-white outline-none appearance-none font-medium text-gray-700"
										>
											<option value="viewer">Viewer</option>
											<option value="creator">Creator</option>
										</select>
										<div className="absolute right-3 top-3.5 pointer-events-none text-gray-400">
											<svg
												className="w-4 h-4"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth="2"
													d="M19 9l-7 7-7-7"
												></path>
											</svg>
										</div>
									</div>
								</div>
								<div>
									<label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">
										Full Name
									</label>
									<div className="relative">
										<HiUser
											className="absolute left-4 top-3.5 text-gray-400"
											size={18}
										/>
										<input
											type="text"
											value={name}
											onChange={(e) => setName(e.target.value)}
											required
											placeholder="John Doe"
											className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#335833] focus:bg-white outline-none font-medium"
										/>
									</div>
								</div>
							</div>

							<div>
								<label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">
									Username
								</label>
								<div className="flex gap-2">
									<div className="relative flex-1">
										<span className="absolute left-4 top-3.5 text-gray-400 font-bold">
											@
										</span>
										<input
											type="text"
											value={username}
											onChange={(e) => {
												setUsername(
													e.target.value
														.toLowerCase()
														.replace(/[^a-z0-9_]/g, ""),
												);
											}}
											required
											placeholder="username"
											className={`w-full pl-9 pr-4 py-3 bg-gray-50 border rounded-xl focus:ring-2 outline-none font-medium ${
												usernameStatus === "taken"
													? "border-red-300 focus:ring-red-200"
													: usernameStatus === "available"
														? "border-green-300 focus:ring-green-200"
														: "border-gray-200 focus:ring-[#335833]"
											}`}
										/>
									</div>
									<button
										type="button"
										onClick={checkUsername}
										disabled={
											username.length < 3 || usernameStatus === "checking"
										}
										className={`px-4 rounded-xl font-bold text-sm transition-all ${
											usernameStatus === "available"
												? "bg-green-100 text-green-700"
												: usernameStatus === "taken"
													? "bg-red-100 text-red-700"
													: "bg-gray-200 text-gray-600 hover:bg-gray-300"
										}`}
									>
										{usernameStatus === "checking"
											? "..."
											: usernameStatus === "available"
												? "Available"
												: usernameStatus === "taken"
													? "Taken"
													: "Verify"}
									</button>
								</div>
							</div>

							<div>
								<label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">
									Email Address
								</label>
								<div className="relative">
									<HiMail
										className="absolute left-4 top-3.5 text-gray-400"
										size={18}
									/>
									<input
										type="email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										required
										placeholder="you@example.com"
										className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#335833] focus:bg-white outline-none font-medium"
									/>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">
										Phone (Optional)
									</label>
									<div className="relative">
										<HiPhone
											className="absolute left-4 top-3.5 text-gray-400"
											size={18}
										/>
										<input
											type="tel"
											value={phone}
											onChange={(e) => setPhone(e.target.value)}
											placeholder="9876543210"
											className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#335833] focus:bg-white outline-none font-medium"
										/>
									</div>
								</div>
								<div>
									<label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">
										UPI ID (Optional)
									</label>
									<div className="relative">
										<HiIdentification
											className="absolute left-4 top-3.5 text-gray-400"
											size={18}
										/>
										<input
											type="text"
											value={upiId}
											onChange={(e) => setUpiId(e.target.value)}
											placeholder="user@bank"
											className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#335833] focus:bg-white outline-none font-medium"
										/>
									</div>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">
										Password
									</label>
									<div className="relative">
										<HiLockClosed
											className="absolute left-4 top-3.5 text-gray-400"
											size={18}
										/>
										<input
											type="password"
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											required
											placeholder="••••••••"
											className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#335833] focus:bg-white outline-none font-medium"
										/>
									</div>
								</div>
								<div>
									<label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">
										Confirm
									</label>
									<div className="relative">
										<HiLockClosed
											className="absolute left-4 top-3.5 text-gray-400"
											size={18}
										/>
										<input
											type="password"
											value={confirmPassword}
											onChange={(e) => setConfirmPassword(e.target.value)}
											required
											placeholder="••••••••"
											className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#335833] focus:bg-white outline-none font-medium"
										/>
									</div>
								</div>
							</div>

							<CloudflareTurnstile
								onVerify={setCaptchaToken}
								theme="light"
								className="flex justify-center"
							/>

							<motion.button
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								type="submit"
								disabled={loading || !captchaToken}
								className="w-full py-4 mt-4 bg-[#335833] text-white font-bold rounded-xl shadow-lg hover:bg-[#2a4a2a] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
							>
								{loading ? (
									"Creating Profile..."
								) : (
									<>
										Create Account <HiArrowRight />
									</>
								)}
							</motion.button>

							<p className="text-center text-sm text-gray-500 mt-6">
								Already a member?{" "}
								<Link
									to="/login"
									className="text-[#335833] font-bold hover:underline"
								>
									Sign In
								</Link>
							</p>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Register;
