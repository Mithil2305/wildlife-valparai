import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useLanguage } from "../../contexts/LanguageContext";

const Navbar = () => {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
	const { user, logout } = useAuth();
	const { language, setLanguage } = useLanguage();
	const location = useLocation();

	const isActive = (path) => location.pathname === path;

	const publicLinks = [
		{ name: "Home", path: "/", icon: "🏠" },
		{ name: "Sightings", path: "/sightings", icon: "📸" },
		{ name: "Blogs", path: "/blogs", icon: "📝" },
		{ name: "Leaderboard", path: "/leaderboard", icon: "🏆" },
		{ name: "About", path: "/about", icon: "🌿" },
		{ name: "Contact", path: "/contact", icon: "💬" },
	];

	const userLinks = [
		{ name: "Dashboard", path: "/dashboard", icon: "📊" },
		{ name: "Profile", path: "/profile", icon: "👤" },
		{ name: "My Sightings", path: "/my-sightings", icon: "📷" },
		{ name: "Points", path: "/points-history", icon: "⭐" },
	];

	const languages = [
		{ code: "en", name: "English", flag: "🇬🇧" },
		{ code: "ta", name: "தமிழ்", flag: "🇮🇳" },
		{ code: "hi", name: "हिन्दी", flag: "🇮🇳" },
	];

	const handleLogout = async () => {
		await logout();
		setIsUserMenuOpen(false);
		setIsMobileMenuOpen(false);
	};

	return (
		<nav className="bg-gradient-to-r from-[#40513B] via-[#609966] to-[#40513B] text-white shadow-2xl sticky top-0 z-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					{/* Logo */}
					<Link to="/" className="flex items-center space-x-2 group">
						<div className="text-3xl group-hover:scale-110 transition-transform">
							🌳
						</div>
						<div>
							<span className="text-xl font-bold text-white">Wildlife</span>
							<span className="text-xl font-bold text-[#EDF1D6]">
								{" "}
								Valparai
							</span>
						</div>
					</Link>

					{/* Desktop Navigation */}
					<div className="hidden md:flex items-center space-x-1">
						{publicLinks.map((link) => (
							<Link
								key={link.path}
								to={link.path}
								className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center space-x-1 ${
									isActive(link.path)
										? "bg-white/20 backdrop-blur-sm scale-105"
										: "hover:bg-white/10 hover:scale-105"
								}`}
							>
								<span>{link.icon}</span>
								<span>{link.name}</span>
							</Link>
						))}
					</div>

					{/* Right Side Actions */}
					<div className="hidden md:flex items-center space-x-4">
						{/* Language Selector */}
						<div className="relative group">
							<button className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-sm font-medium flex items-center space-x-1">
								<span>
									{languages.find((l) => l.code === language)?.flag || "🌐"}
								</span>
								<span>
									{languages
										.find((l) => l.code === language)
										?.code.toUpperCase()}
								</span>
							</button>
							<div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 overflow-hidden">
								{languages.map((lang) => (
									<button
										key={lang.code}
										onClick={() => setLanguage(lang.code)}
										className={`w-full px-4 py-2 text-left hover:bg-[#EDF1D6] transition-colors flex items-center space-x-2 ${
											language === lang.code
												? "bg-[#9DC08B]/20 text-[#40513B] font-bold"
												: "text-[#609966]"
										}`}
									>
										<span>{lang.flag}</span>
										<span>{lang.name}</span>
									</button>
								))}
							</div>
						</div>

						{/* User Menu or Auth Buttons */}
						{user ? (
							<div className="relative">
								<button
									onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
									className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all"
								>
									<div className="w-8 h-8 bg-gradient-to-r from-[#9DC08B] to-[#609966] rounded-full flex items-center justify-center text-lg">
										{user.photoURL ? (
											<img
												src={user.photoURL}
												alt="Profile"
												className="w-8 h-8 rounded-full"
											/>
										) : (
											"👤"
										)}
									</div>
									<span className="text-sm font-medium">
										{user.displayName || "User"}
									</span>
									<span className="text-xs">{isUserMenuOpen ? "▲" : "▼"}</span>
								</button>

								{isUserMenuOpen && (
									<div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-[#9DC08B]/20">
										{userLinks.map((link) => (
											<Link
												key={link.path}
												to={link.path}
												onClick={() => setIsUserMenuOpen(false)}
												className="flex items-center space-x-2 px-4 py-3 text-[#609966] hover:bg-[#EDF1D6] transition-colors"
											>
												<span>{link.icon}</span>
												<span className="font-medium">{link.name}</span>
											</Link>
										))}
										<hr className="border-[#9DC08B]/20" />
										<button
											onClick={handleLogout}
											className="w-full flex items-center space-x-2 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
										>
											<span>🚪</span>
											<span className="font-medium">Logout</span>
										</button>
									</div>
								)}
							</div>
						) : (
							<div className="flex items-center space-x-2">
								<Link
									to="/login"
									className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-sm font-medium"
								>
									Login
								</Link>
								<Link
									to="/register"
									className="px-4 py-2 rounded-xl bg-white text-[#40513B] hover:scale-105 transition-all text-sm font-bold shadow-lg"
								>
									Sign Up
								</Link>
							</div>
						)}
					</div>

					{/* Mobile Menu Button */}
					<button
						onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
						className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-all"
					>
						<div className="w-6 h-5 flex flex-col justify-between">
							<span
								className={`w-full h-0.5 bg-white transition-all ${isMobileMenuOpen ? "rotate-45 translate-y-2" : ""}`}
							></span>
							<span
								className={`w-full h-0.5 bg-white transition-all ${isMobileMenuOpen ? "opacity-0" : ""}`}
							></span>
							<span
								className={`w-full h-0.5 bg-white transition-all ${isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}
							></span>
						</div>
					</button>
				</div>
			</div>

			{/* Mobile Menu */}
			{isMobileMenuOpen && (
				<div className="md:hidden bg-[#40513B] border-t border-white/10">
					<div className="px-4 py-4 space-y-2">
						{publicLinks.map((link) => (
							<Link
								key={link.path}
								to={link.path}
								onClick={() => setIsMobileMenuOpen(false)}
								className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-all ${
									isActive(link.path)
										? "bg-white/20 backdrop-blur-sm"
										: "hover:bg-white/10"
								}`}
							>
								<span>{link.icon}</span>
								<span className="font-medium">{link.name}</span>
							</Link>
						))}

						{user ? (
							<>
								<hr className="border-white/10 my-2" />
								{userLinks.map((link) => (
									<Link
										key={link.path}
										to={link.path}
										onClick={() => setIsMobileMenuOpen(false)}
										className="flex items-center space-x-2 px-4 py-3 rounded-xl hover:bg-white/10 transition-all"
									>
										<span>{link.icon}</span>
										<span className="font-medium">{link.name}</span>
									</Link>
								))}
								<button
									onClick={handleLogout}
									className="w-full flex items-center space-x-2 px-4 py-3 rounded-xl bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-all"
								>
									<span>🚪</span>
									<span className="font-medium">Logout</span>
								</button>
							</>
						) : (
							<>
								<Link
									to="/login"
									onClick={() => setIsMobileMenuOpen(false)}
									className="block px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-center font-medium"
								>
									Login
								</Link>
								<Link
									to="/register"
									onClick={() => setIsMobileMenuOpen(false)}
									className="block px-4 py-3 rounded-xl bg-white text-[#40513B] hover:scale-105 transition-all text-center font-bold"
								>
									Sign Up
								</Link>
							</>
						)}
					</div>
				</div>
			)}
		</nav>
	);
};

export default Navbar;
