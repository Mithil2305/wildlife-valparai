import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const Register = () => {
	const [formData, setFormData] = useState({
		displayName: "",
		email: "",
		password: "",
		confirmPassword: "",
		acceptTerms: false,
	});
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const { register, loginWithGoogle } = useAuth();
	const navigate = useNavigate();

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData({
			...formData,
			[name]: type === "checkbox" ? checked : value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		// Validation
		if (formData.password !== formData.confirmPassword) {
			setError("Passwords do not match");
			return;
		}

		if (formData.password.length < 6) {
			setError("Password must be at least 6 characters long");
			return;
		}

		if (!formData.acceptTerms) {
			setError("Please accept the Terms and Conditions");
			return;
		}

		setIsLoading(true);

		try {
			await register(formData.email, formData.password, formData.displayName);
			navigate("/dashboard");
		} catch (err) {
			setError(err.message || "Failed to create account. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleGoogleSignup = async () => {
		setError("");
		setIsLoading(true);

		try {
			await loginWithGoogle();
			navigate("/dashboard");
		} catch (err) {
			setError(err.message || "Failed to sign up with Google.");
		} finally {
			setIsLoading(false);
		}
	};

	if (isLoading) {
		return <LoadingSpinner />;
	}

	return (
		<div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12">
			<div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
				{/* Left Side - Hero */}
				<div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-[#40513B] via-[#609966] to-[#40513B] rounded-3xl p-12 text-white shadow-2xl relative overflow-hidden">
					<div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
					<div
						className="absolute bottom-0 left-0 w-64 h-64 bg-[#9DC08B]/10 rounded-full blur-3xl animate-pulse"
						style={{ animationDelay: "1s" }}
					></div>

					<div className="relative z-10">
						<div className="text-6xl mb-6">🌱</div>
						<h1 className="text-4xl font-bold mb-4">Join Our Community</h1>
						<p className="text-xl text-white/90 mb-8">
							Start documenting wildlife, earning rewards, and making a real
							impact on conservation efforts.
						</p>

						<div className="space-y-6">
							<div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
								<h3 className="font-bold mb-3 flex items-center">
									<span className="text-2xl mr-2">🎁</span>
									Welcome Rewards
								</h3>
								<ul className="space-y-2 text-sm text-white/90">
									<li className="flex items-center">
										<span className="text-[#9DC08B] mr-2">✓</span>
										100 bonus points to start
									</li>
									<li className="flex items-center">
										<span className="text-[#9DC08B] mr-2">✓</span>
										Access to all platform features
									</li>
									<li className="flex items-center">
										<span className="text-[#9DC08B] mr-2">✓</span>
										Join leaderboards and challenges
									</li>
								</ul>
							</div>

							<div className="flex items-center space-x-4">
								<div className="text-center">
									<p className="text-3xl font-bold">500+</p>
									<p className="text-sm text-white/80">Active Members</p>
								</div>
								<div className="w-px h-12 bg-white/20"></div>
								<div className="text-center">
									<p className="text-3xl font-bold">1000+</p>
									<p className="text-sm text-white/80">Sightings Shared</p>
								</div>
								<div className="w-px h-12 bg-white/20"></div>
								<div className="text-center">
									<p className="text-3xl font-bold">45</p>
									<p className="text-sm text-white/80">Species Tracked</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Right Side - Registration Form */}
				<div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-xl border border-[#9DC08B]/20">
					<div className="mb-8">
						<h2 className="text-3xl font-bold text-[#40513B] mb-2">
							Create Account
						</h2>
						<p className="text-[#609966]">
							Join Wildlife Valparai and start making a difference
						</p>
					</div>

					{error && (
						<div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-2xl">
							{error}
						</div>
					)}

					<form onSubmit={handleSubmit} className="space-y-6">
						<div>
							<label
								htmlFor="displayName"
								className="block text-sm font-bold text-[#40513B] mb-2"
							>
								Full Name
							</label>
							<input
								type="text"
								id="displayName"
								name="displayName"
								value={formData.displayName}
								onChange={handleChange}
								required
								className="w-full px-4 py-3 rounded-xl border-2 border-[#9DC08B]/30 focus:border-[#609966] focus:outline-none transition-colors bg-white/50"
								placeholder="John Doe"
							/>
						</div>

						<div>
							<label
								htmlFor="email"
								className="block text-sm font-bold text-[#40513B] mb-2"
							>
								Email Address
							</label>
							<input
								type="email"
								id="email"
								name="email"
								value={formData.email}
								onChange={handleChange}
								required
								className="w-full px-4 py-3 rounded-xl border-2 border-[#9DC08B]/30 focus:border-[#609966] focus:outline-none transition-colors bg-white/50"
								placeholder="your@email.com"
							/>
						</div>

						<div>
							<label
								htmlFor="password"
								className="block text-sm font-bold text-[#40513B] mb-2"
							>
								Password
							</label>
							<input
								type="password"
								id="password"
								name="password"
								value={formData.password}
								onChange={handleChange}
								required
								className="w-full px-4 py-3 rounded-xl border-2 border-[#9DC08B]/30 focus:border-[#609966] focus:outline-none transition-colors bg-white/50"
								placeholder="At least 6 characters"
							/>
						</div>

						<div>
							<label
								htmlFor="confirmPassword"
								className="block text-sm font-bold text-[#40513B] mb-2"
							>
								Confirm Password
							</label>
							<input
								type="password"
								id="confirmPassword"
								name="confirmPassword"
								value={formData.confirmPassword}
								onChange={handleChange}
								required
								className="w-full px-4 py-3 rounded-xl border-2 border-[#9DC08B]/30 focus:border-[#609966] focus:outline-none transition-colors bg-white/50"
								placeholder="Re-enter your password"
							/>
						</div>

						<div className="flex items-start space-x-2">
							<input
								type="checkbox"
								id="acceptTerms"
								name="acceptTerms"
								checked={formData.acceptTerms}
								onChange={handleChange}
								required
								className="mt-1 w-4 h-4 rounded border-[#9DC08B] text-[#609966] focus:ring-[#609966]"
							/>
							<label htmlFor="acceptTerms" className="text-sm text-[#609966]">
								I agree to the{" "}
								<Link
									to="/terms"
									className="text-[#40513B] font-medium hover:underline"
								>
									Terms and Conditions
								</Link>{" "}
								and{" "}
								<Link
									to="/privacy"
									className="text-[#40513B] font-medium hover:underline"
								>
									Privacy Policy
								</Link>
							</label>
						</div>

						<button
							type="submit"
							disabled={isLoading}
							className="w-full px-8 py-4 bg-gradient-to-r from-[#609966] to-[#40513B] text-white rounded-2xl font-bold text-lg hover:scale-105 hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isLoading ? "Creating account..." : "Create Account"}
						</button>
					</form>

					<div className="my-8 flex items-center">
						<div className="flex-1 h-px bg-[#9DC08B]/30"></div>
						<span className="px-4 text-sm text-[#609966]">Or sign up with</span>
						<div className="flex-1 h-px bg-[#9DC08B]/30"></div>
					</div>

					<button
						onClick={handleGoogleSignup}
						disabled={isLoading}
						className="w-full px-8 py-4 bg-white border-2 border-[#9DC08B]/30 text-[#40513B] rounded-2xl font-bold hover:scale-105 hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						<svg className="w-6 h-6" viewBox="0 0 24 24">
							<path
								fill="#4285F4"
								d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
							/>
							<path
								fill="#34A853"
								d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
							/>
							<path
								fill="#FBBC05"
								d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
							/>
							<path
								fill="#EA4335"
								d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
							/>
						</svg>
						<span>Sign up with Google</span>
					</button>

					<div className="mt-8 text-center">
						<p className="text-[#609966]">
							Already have an account?{" "}
							<Link
								to="/login"
								className="text-[#40513B] font-bold hover:underline"
							>
								Sign in
							</Link>
						</p>
					</div>

					{/* Features Preview */}
					<div className="mt-8 pt-8 border-t border-[#9DC08B]/20">
						<p className="text-sm font-bold text-[#40513B] mb-4">
							What you'll get:
						</p>
						<div className="grid grid-cols-2 gap-3">
							<div className="flex items-center space-x-2 text-sm text-[#609966]">
								<span className="text-lg">📸</span>
								<span>Upload sightings</span>
							</div>
							<div className="flex items-center space-x-2 text-sm text-[#609966]">
								<span className="text-lg">🏆</span>
								<span>Earn rewards</span>
							</div>
							<div className="flex items-center space-x-2 text-sm text-[#609966]">
								<span className="text-lg">📊</span>
								<span>Track progress</span>
							</div>
							<div className="flex items-center space-x-2 text-sm text-[#609966]">
								<span className="text-lg">🤝</span>
								<span>Join community</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Register;
