import { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { usePoints } from "../hooks/usePoints";
import LoadingSpinner from "../components/common/LoadingSpinner";
import AdsContainer from "../components/common/AdsContainer";

const MainLayout = () => {
	const { user, logout, loading } = useAuth();
	const { points, currentBadge } = usePoints();
	const location = useLocation();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const [userMenuOpen, setUserMenuOpen] = useState(false);

	useEffect(() => {
		const handleScroll = () => setScrolled(window.scrollY > 20);
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	useEffect(() => {
		setMobileMenuOpen(false);
		setUserMenuOpen(false);
	}, [location.pathname]);

	if (loading) return <LoadingSpinner />;

	const navLinks = [
		{ to: "/", label: "Home", icon: "🏠" },
		{ to: "/sightings", label: "Sightings", icon: "📸" },
		{ to: "/blogs", label: "Blogs", icon: "📝" },
		{ to: "/leaderboard", label: "Leaderboard", icon: "🏆" },
		{ to: "/about", label: "About", icon: "ℹ️" },
	];

	const isActive = (path) => {
		if (path === "/") return location.pathname === "/";
		return location.pathname.startsWith(path);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-[#EDF1D6] via-[#EDF1D6] to-[#9DC08B] relative overflow-x-hidden">
			<header
				className={`sticky top-0 z-50 transition-all duration-500 ${scrolled ? "bg-white/90 backdrop-blur-lg shadow-lg" : "bg-white/70 backdrop-blur-sm"}`}
			>
				<nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between h-16 md:h-20">
						<Link to="/" className="flex items-center space-x-3 group">
							<div className="relative">
								<div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#609966] to-[#40513B] rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300">
									<span className="text-white text-xl md:text-2xl">🦁</span>
								</div>
							</div>
							<div className="hidden sm:block">
								<h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-[#40513B] to-[#609966] bg-clip-text text-transparent">
									Wildlife Valparai
								</h1>
								<p className="text-xs text-[#609966]">
									Citizen Science Platform
								</p>
							</div>
						</Link>

						<div className="hidden lg:flex items-center space-x-1">
							{navLinks.map((link) => (
								<Link
									key={link.to}
									to={link.to}
									className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 ${isActive(link.to) ? "bg-gradient-to-r from-[#609966] to-[#40513B] text-white shadow-lg" : "text-[#40513B] hover:bg-[#9DC08B]/30"}`}
								>
									<span className="mr-2">{link.icon}</span>
									{link.label}
								</Link>
							))}
						</div>

						<div className="flex items-center space-x-3">
							{user ? (
								<div className="relative">
									<button
										onClick={() => setUserMenuOpen(!userMenuOpen)}
										className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-gradient-to-r from-[#609966] to-[#40513B] text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
									>
										<div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
											<span className="text-sm font-bold">
												{user.displayName?.[0] || user.email?.[0] || "U"}
											</span>
										</div>
										<span className="hidden md:block font-medium">
											{user.displayName || "User"}
										</span>
									</button>

									{userMenuOpen && (
										<div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl overflow-hidden">
											<div className="bg-gradient-to-r from-[#609966] to-[#40513B] p-4 text-white">
												<p className="font-semibold">
													{user.displayName || "User"}
												</p>
												<p className="text-xs text-white/80">{user.email}</p>
											</div>
											<div className="p-2">
												<Link
													to="/profile"
													className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-[#EDF1D6] transition-colors"
												>
													<span>👤</span>
													<span>Profile</span>
												</Link>
												<button
													onClick={logout}
													className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-600 transition-colors"
												>
													<span>🚪</span>
													<span>Logout</span>
												</button>
											</div>
										</div>
									)}
								</div>
							) : (
								<div className="flex items-center space-x-2">
									<Link
										to="/login"
										className="px-4 py-2 rounded-xl font-medium text-[#40513B] hover:bg-[#9DC08B]/30 transition-all duration-300 hover:scale-105"
									>
										Login
									</Link>
									<Link
										to="/register"
										className="px-4 py-2 rounded-xl font-medium bg-gradient-to-r from-[#609966] to-[#40513B] text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
									>
										Sign Up
									</Link>
								</div>
							)}

							<button
								onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
								className="lg:hidden p-2 rounded-xl bg-[#609966]/10 hover:bg-[#609966]/20 transition-colors"
							>
								<svg
									className="w-6 h-6 text-[#40513B]"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									{mobileMenuOpen ? (
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M6 18L18 6M6 6l12 12"
										/>
									) : (
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M4 6h16M4 12h16M4 18h16"
										/>
									)}
								</svg>
							</button>
						</div>
					</div>

					{mobileMenuOpen && (
						<div className="lg:hidden py-4">
							<div className="space-y-2">
								{navLinks.map((link) => (
									<Link
										key={link.to}
										to={link.to}
										className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${isActive(link.to) ? "bg-gradient-to-r from-[#609966] to-[#40513B] text-white" : "text-[#40513B] hover:bg-[#9DC08B]/30"}`}
									>
										<span className="text-xl">{link.icon}</span>
										<span className="font-medium">{link.label}</span>
									</Link>
								))}
							</div>
						</div>
					)}
				</nav>
			</header>

			<main className="flex-1 relative z-10">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
					<div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
						{user && (
							<aside className="lg:col-span-3 space-y-4">
								<div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-[#9DC08B]/20">
									<div className="flex items-center space-x-3 mb-4">
										<div className="w-12 h-12 bg-gradient-to-br from-[#609966] to-[#40513B] rounded-2xl flex items-center justify-center">
											<span className="text-2xl">⭐</span>
										</div>
										<div>
											<p className="text-sm text-[#609966]">Your Points</p>
											<p className="text-2xl font-bold text-[#40513B]">
												{points || 0}
											</p>
										</div>
									</div>
									{currentBadge && (
										<div className="bg-gradient-to-r from-[#EDF1D6] to-[#9DC08B]/20 rounded-2xl p-3">
											<p className="text-xs text-[#609966] mb-1">
												Current Badge
											</p>
											<div className="flex items-center space-x-2">
												<span className="text-3xl">{currentBadge.icon}</span>
												<div>
													<p className="font-semibold text-[#40513B]">
														{currentBadge.name}
													</p>
													<p className="text-xs text-[#609966]">
														{currentBadge.description}
													</p>
												</div>
											</div>
										</div>
									)}
								</div>

								<div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 border border-[#9DC08B]/20">
									<h3 className="font-bold text-[#40513B] mb-4 flex items-center">
										<span className="text-xl mr-2">⚡</span>Quick Actions
									</h3>
									<div className="space-y-2">
										<Link
											to="/submit-sighting"
											className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-[#609966] to-[#40513B] text-white hover:shadow-lg hover:scale-105 transition-all duration-300"
										>
											<span>📸</span>
											<span className="font-medium">New Sighting</span>
										</Link>
										<Link
											to="/create-blog"
											className="flex items-center space-x-3 p-3 rounded-xl bg-[#9DC08B]/30 text-[#40513B] hover:bg-[#9DC08B]/50 hover:scale-105 transition-all duration-300"
										>
											<span>✍️</span>
											<span className="font-medium">Write Blog</span>
										</Link>
									</div>
								</div>

								<div className="bg-white/60 backdrop-blur-sm rounded-3xl p-4 shadow-lg">
									<AdsContainer placement="sidebar" adFormat="vertical" />
								</div>
							</aside>
						)}

						<div
							className={`${user ? "lg:col-span-9" : "lg:col-span-12"} space-y-6`}
						>
							<div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-8 min-h-[400px] border border-[#9DC08B]/20">
								<Outlet />
							</div>
							<div className="bg-white/60 backdrop-blur-sm rounded-3xl p-4 shadow-lg">
								<AdsContainer placement="content-bottom" adFormat="banner" />
							</div>
						</div>
					</div>
				</div>
			</main>

			<footer className="relative z-10 bg-gradient-to-r from-[#40513B] to-[#609966] text-white mt-12">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
						<div className="space-y-4">
							<div className="flex items-center space-x-2">
								<span className="text-3xl">🦁</span>
								<h3 className="text-xl font-bold">Wildlife Valparai</h3>
							</div>
							<p className="text-sm text-white/80">
								Citizen science platform for wildlife conservation
							</p>
						</div>
						<div>
							<h4 className="font-bold mb-4">Explore</h4>
							<ul className="space-y-2 text-sm">
								<li>
									<Link
										to="/sightings"
										className="text-white/80 hover:text-white transition-colors"
									>
										Sightings Gallery
									</Link>
								</li>
								<li>
									<Link
										to="/blogs"
										className="text-white/80 hover:text-white transition-colors"
									>
										Blog Posts
									</Link>
								</li>
							</ul>
						</div>
						<div>
							<h4 className="font-bold mb-4">Community</h4>
							<ul className="space-y-2 text-sm">
								<li>
									<Link
										to="/about"
										className="text-white/80 hover:text-white transition-colors"
									>
										About Us
									</Link>
								</li>
							</ul>
						</div>
						<div>
							<h4 className="font-bold mb-4">Stay Updated</h4>
							<p className="text-sm text-white/80 mb-3">Get wildlife updates</p>
						</div>
					</div>
					<div className="border-t border-white/20 mt-8 pt-8 text-center text-sm text-white/80">
						<p>© 2025 Wildlife Valparai. All rights reserved.</p>
					</div>
				</div>
			</footer>
		</div>
	);
};

export default MainLayout;
