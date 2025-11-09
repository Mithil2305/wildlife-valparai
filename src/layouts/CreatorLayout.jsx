import { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { usePoints } from "../hooks/usePoints";
import LoadingSpinner from "../components/common/LoadingSpinner";
import PointsDisplay from "../components/dashboard/PointsDisplay";

const CreatorLayout = () => {
	const { logout, loading } = useAuth();
	const { points, currentBadge } = usePoints();
	const location = useLocation();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => setScrolled(window.scrollY > 20);
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	if (loading) return <LoadingSpinner />;

	const creatorNavLinks = [
		{ to: "/creator/dashboard", label: "Dashboard", icon: "📊" },
		{ to: "/submit-sighting", label: "Submit Sighting", icon: "🐾" },
		{ to: "/create-blog", label: "Write Blog", icon: "📝" },
		{ to: "/my-content", label: "My Content", icon: "📚" },
		{ to: "/profile", label: "Profile", icon: "👤" },
		{ to: "/leaderboard", label: "Leaderboard", icon: "🏆" },
	];

	const isActive = (path) => {
		return (
			location.pathname === path || location.pathname.startsWith(path + "/")
		);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-[#EDF1D6] via-[#EDF1D6] to-[#9DC08B] relative overflow-x-hidden">
			{/* Animated Background */}
			<div className="fixed inset-0 overflow-hidden pointer-events-none">
				<div className="absolute top-0 -left-4 w-72 h-72 bg-[#609966] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
				<div
					className="absolute top-0 -right-4 w-72 h-72 bg-[#9DC08B] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"
					style={{ animationDelay: "2s" }}
				></div>
			</div>

			{/* Header */}
			<header
				className={`sticky top-0 z-50 transition-all duration-500 ${scrolled ? "bg-white/95 backdrop-blur-lg shadow-lg" : "bg-white/80 backdrop-blur-sm"}`}
			>
				<nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between h-16 md:h-20">
						{/* Logo */}
						<Link to="/" className="flex items-center space-x-3 group">
							<div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#609966] to-[#40513B] rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300">
								<span className="text-white text-xl md:text-2xl">🦁</span>
							</div>
							<div className="hidden sm:block">
								<h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-[#40513B] to-[#609966] bg-clip-text text-transparent">
									Wildlife Valparai
								</h1>
								<p className="text-xs text-[#609966]">Creator Dashboard</p>
							</div>
						</Link>

						{/* Desktop Nav */}
						<div className="hidden lg:flex items-center space-x-1">
							{creatorNavLinks.map((link) => (
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

						{/* Points & User */}
						<div className="flex items-center space-x-3">
							<div className="hidden md:block">
								<PointsDisplay />
							</div>
							<button
								onClick={logout}
								className="px-4 py-2 rounded-xl font-medium text-[#40513B] hover:bg-red-50 hover:text-red-600 transition-all duration-300"
							>
								Logout
							</button>
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

					{/* Mobile Menu */}
					{mobileMenuOpen && (
						<div className="lg:hidden py-4">
							<div className="space-y-2">
								{creatorNavLinks.map((link) => (
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

			{/* Main Content - Bento Grid */}
			<main className="flex-1 relative z-10">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
					<div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
						{/* Sidebar */}
						<aside className="lg:col-span-3 space-y-4">
							{/* Creator Stats */}
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
										<p className="text-xs text-[#609966] mb-1">Current Badge</p>
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

							{/* Quick Actions */}
							<div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 border border-[#9DC08B]/20">
								<h3 className="font-bold text-[#40513B] mb-4 flex items-center">
									<span className="text-xl mr-2">⚡</span>Creator Tools
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
									<Link
										to="/my-content"
										className="flex items-center space-x-3 p-3 rounded-xl bg-[#EDF1D6] text-[#40513B] hover:bg-[#9DC08B]/30 hover:scale-105 transition-all duration-300"
									>
										<span>📚</span>
										<span className="font-medium">My Content</span>
									</Link>
								</div>
							</div>
						</aside>

						{/* Content */}
						<div className="lg:col-span-9 space-y-6">
							<div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-8 min-h-[500px] border border-[#9DC08B]/20">
								<Outlet />
							</div>
						</div>
					</div>
				</div>
			</main>

			{/* Footer */}
			<footer className="relative z-10 bg-gradient-to-r from-[#40513B] to-[#609966] text-white mt-12">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<div className="flex flex-col md:flex-row items-center justify-between">
						<div className="flex items-center space-x-2 mb-4 md:mb-0">
							<span className="text-2xl">🦁</span>
							<span className="font-bold">Wildlife Valparai</span>
						</div>
						<p className="text-sm text-white/80">
							© 2025 Wildlife Valparai. All rights reserved.
						</p>
					</div>
				</div>
			</footer>
		</div>
	);
};

export default CreatorLayout;
