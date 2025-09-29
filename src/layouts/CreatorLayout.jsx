import { useState } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "../components/common/LoadingSpinner";
import PointsDisplay from "../components/dashboard/PointsDisplay";

const CreatorLayout = () => {
	const { currentUser, loading } = useAuth();
	const location = useLocation();
	const [sidebarOpen, setSidebarOpen] = useState(false);

	if (loading) {
		return <LoadingSpinner />;
	}

	// Creator navigation items
	const navItems = [
		{ path: "/creator/dashboard", label: "Dashboard", icon: "📊" },
		{ path: "/submit-sighting", label: "Submit Sighting", icon: "🐾" },
		{ path: "/create-blog", label: "Write Blog", icon: "📝" },
		{ path: "/my-content", label: "My Content", icon: "📚" },
		{ path: "/profile", label: "Profile", icon: "👤" },
		{ path: "/leaderboard", label: "Leaderboard", icon: "🏆" },
	];

	const isActivePath = (path) => {
		return (
			location.pathname === path || location.pathname.startsWith(path + "/")
		);
	};

	return (
		<div className="min-h-screen bg-gray-50 flex flex-col">
			{/* Header */}
			<header className="bg-white shadow-sm border-b border-gray-200">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center py-4">
						{/* Logo and Brand */}
						<div className="flex items-center space-x-4">
							<button
								onClick={() => setSidebarOpen(!sidebarOpen)}
								className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
							>
								<span className="text-lg">☰</span>
							</button>

							<div className="flex items-center space-x-3">
								<div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
									<span className="text-white font-bold">WV</span>
								</div>
								<div>
									<h1 className="text-lg font-bold text-gray-900">
										Wildlife Valparai
									</h1>
									<p className="text-xs text-gray-500">Creator Hub</p>
								</div>
							</div>
						</div>

						{/* Points and User Info */}
						<div className="flex items-center space-x-4">
							<PointsDisplay />

							{/* Notifications */}
							<button className="p-2 text-gray-600 hover:text-gray-900 relative">
								<span className="text-lg">🔔</span>
								<span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
							</button>

							{/* User Menu */}
							<div className="flex items-center space-x-3">
								<div className="text-right hidden sm:block">
									<p className="text-sm font-medium text-gray-900">
										{currentUser?.displayName || "Creator"}
									</p>
									<p className="text-xs text-gray-500">Content Creator</p>
								</div>
								<div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
									{currentUser?.displayName?.charAt(0) ||
										currentUser?.email?.charAt(0) ||
										"C"}
								</div>
							</div>
						</div>
					</div>
				</div>
			</header>

			<div className="flex-1 flex">
				{/* Sidebar */}
				<div
					className={`${sidebarOpen ? "block" : "hidden"} lg:block lg:w-64 bg-white border-r border-gray-200`}
				>
					<div className="p-6">
						{/* Navigation */}
						<nav className="space-y-2">
							{navItems.map((item) => (
								<NavLink
									key={item.path}
									to={item.path}
									className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
										isActivePath(item.path)
											? "bg-blue-50 text-blue-700 border border-blue-200"
											: "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
									}`}
								>
									<span className="text-lg">{item.icon}</span>
									<span>{item.label}</span>
								</NavLink>
							))}
						</nav>

						{/* Quick Actions */}
						<div className="mt-8">
							<h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
								Quick Actions
							</h3>
							<div className="space-y-2">
								<button className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors">
									<span>📸</span>
									<span>Quick Photo Upload</span>
								</button>
								<button className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-purple-700 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors">
									<span>🎙️</span>
									<span>Record Audio</span>
								</button>
							</div>
						</div>

						{/* Stats Summary */}
						<div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
							<h3 className="text-sm font-semibold text-gray-900 mb-3">
								This Month
							</h3>
							<div className="space-y-2 text-xs">
								<div className="flex justify-between">
									<span className="text-gray-600">Sightings:</span>
									<span className="font-semibold">8</span>
								</div>
								<div className="flex justify-between">
									<span className="text-gray-600">Blogs:</span>
									<span className="font-semibold">3</span>
								</div>
								<div className="flex justify-between">
									<span className="text-gray-600">Points Earned:</span>
									<span className="font-semibold text-green-600">+245</span>
								</div>
								<div className="pt-2 border-t border-gray-200">
									<div className="flex justify-between text-green-700">
										<span>Estimated Earnings:</span>
										<span className="font-semibold">$2.45</span>
									</div>
								</div>
							</div>
						</div>

						{/* Back to Main Site */}
						<div className="mt-6">
							<a
								href="/"
								className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
							>
								<span>←</span>
								<span>Back to Main Site</span>
							</a>
						</div>
					</div>
				</div>

				{/* Main Content */}
				<div className="flex-1 flex flex-col">
					<main className="flex-1 overflow-auto">
						<div className="max-w-6xl mx-auto p-6">
							{/* Breadcrumb */}
							<div className="mb-6">
								<nav className="flex text-sm text-gray-600">
									<a href="/" className="hover:text-gray-900">
										Home
									</a>
									<span className="mx-2">/</span>
									<a href="/creator" className="hover:text-gray-900">
										Creator
									</a>
									<span className="mx-2">/</span>
									<span className="text-gray-900 font-medium">
										{navItems.find((item) => isActivePath(item.path))?.label ||
											"Dashboard"}
									</span>
								</nav>
							</div>

							{/* Page Content */}
							<Outlet />
						</div>
					</main>

					{/* Footer */}
					<footer className="bg-white border-t border-gray-200 py-4 px-6">
						<div className="flex items-center justify-between text-sm text-gray-600">
							<div>
								© {new Date().getFullYear()} Wildlife Valparai. Creator Hub.
							</div>
							<div className="flex items-center space-x-4">
								<span>Keep creating! 🎨</span>
							</div>
						</div>
					</footer>
				</div>
			</div>

			{/* Mobile Sidebar Overlay */}
			{sidebarOpen && (
				<div
					className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
					onClick={() => setSidebarOpen(false)}
				/>
			)}

			{/* Floating Action Button for Mobile */}
			<div className="lg:hidden fixed bottom-6 right-6 z-30">
				<button className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center text-xl hover:bg-blue-700 transition-colors">
					+
				</button>
			</div>
		</div>
	);
};

export default CreatorLayout;
