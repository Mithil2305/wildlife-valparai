import { useState } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "../components/common/LoadingSpinner";

const AdminLayout = () => {
	const { currentUser, loading } = useAuth();
	const location = useLocation();
	const [sidebarOpen, setSidebarOpen] = useState(false);

	if (loading) {
		return <LoadingSpinner />;
	}

	// Admin navigation items
	const navItems = [
		{ path: "/admin", label: "Dashboard", icon: "📊" },
		{ path: "/admin/sightings", label: "Sightings", icon: "🐾" },
		{ path: "/admin/users", label: "Users", icon: "👥" },
		{ path: "/admin/blogs", label: "Blogs", icon: "📝" },
		{ path: "/admin/payments", label: "Payments", icon: "💰" },
		{ path: "/admin/performance", label: "Performance", icon: "📈" },
		{ path: "/admin/ads", label: "Ads Management", icon: "📢" },
	];

	const isActivePath = (path) => {
		if (path === "/admin") {
			return location.pathname === "/admin";
		}
		return location.pathname.startsWith(path);
	};

	return (
		<div className="min-h-screen bg-gray-100 flex">
			{/* Sidebar */}
			<div
				className={`${sidebarOpen ? "block" : "hidden"} lg:block lg:w-64 bg-gray-800 text-white`}
			>
				<div className="p-4">
					{/* Logo and Title */}
					<div className="flex items-center space-x-3 mb-8">
						<div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
							<span className="text-white font-bold">WV</span>
						</div>
						<div>
							<h1 className="text-lg font-bold">Wildlife Valparai</h1>
							<p className="text-xs text-gray-400">Admin Panel</p>
						</div>
					</div>

					{/* User Info */}
					{currentUser && (
						<div className="mb-6 p-3 bg-gray-700 rounded-lg">
							<p className="font-medium truncate">
								{currentUser.displayName || currentUser.email}
							</p>
							<p className="text-xs text-gray-400 truncate">
								{currentUser.email}
							</p>
							<p className="text-xs text-green-400 mt-1">● Admin</p>
						</div>
					)}

					{/* Navigation */}
					<nav className="space-y-1">
						{navItems.map((item) => (
							<NavLink
								key={item.path}
								to={item.path}
								className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
									isActivePath(item.path)
										? "bg-blue-600 text-white"
										: "text-gray-300 hover:bg-gray-700 hover:text-white"
								}`}
							>
								<span className="text-lg">{item.icon}</span>
								<span>{item.label}</span>
							</NavLink>
						))}
					</nav>

					{/* Quick Stats */}
					<div className="mt-8 p-4 bg-gray-700 rounded-lg">
						<h3 className="text-sm font-semibold mb-3">Quick Stats</h3>
						<div className="space-y-2 text-xs">
							<div className="flex justify-between">
								<span>Pending Sightings:</span>
								<span className="text-yellow-400">12</span>
							</div>
							<div className="flex justify-between">
								<span>Total Users:</span>
								<span className="text-green-400">1,234</span>
							</div>
							<div className="flex justify-between">
								<span>This Month:</span>
								<span className="text-blue-400">$245</span>
							</div>
						</div>
					</div>

					{/* Back to Site */}
					<div className="mt-6">
						<a
							href="/"
							className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
						>
							<span>←</span>
							<span>Back to Site</span>
						</a>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="flex-1 flex flex-col overflow-hidden">
				{/* Top Bar */}
				<header className="bg-white shadow-sm border-b border-gray-200">
					<div className="flex items-center justify-between px-6 py-4">
						<div className="flex items-center">
							<button
								onClick={() => setSidebarOpen(!sidebarOpen)}
								className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
							>
								<span className="text-lg">☰</span>
							</button>
							<h1 className="ml-4 text-xl font-semibold text-gray-900">
								{navItems.find((item) => isActivePath(item.path))?.label ||
									"Admin Dashboard"}
							</h1>
						</div>

						<div className="flex items-center space-x-4">
							<div className="text-sm text-gray-600">
								{new Date().toLocaleDateString("en-US", {
									weekday: "long",
									year: "numeric",
									month: "long",
									day: "numeric",
								})}
							</div>

							{/* Notifications */}
							<button className="p-2 text-gray-600 hover:text-gray-900 relative">
								<span className="text-lg">🔔</span>
								<span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
							</button>

							{/* User Menu */}
							<div className="relative">
								<button className="flex items-center space-x-2 text-sm text-gray-700 hover:text-gray-900">
									<div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
										{currentUser?.displayName?.charAt(0) ||
											currentUser?.email?.charAt(0) ||
											"A"}
									</div>
									<span className="hidden md:block">
										{currentUser?.displayName || "Admin"}
									</span>
								</button>
							</div>
						</div>
					</div>
				</header>

				{/* Main Content Area */}
				<main className="flex-1 overflow-auto p-6">
					<div className="max-w-7xl mx-auto">
						<Outlet />
					</div>
				</main>

				{/* Footer */}
				<footer className="bg-white border-t border-gray-200 py-4 px-6">
					<div className="flex items-center justify-between text-sm text-gray-600">
						<div>
							© {new Date().getFullYear()} Wildlife Valparai. All rights
							reserved.
						</div>
						<div className="flex items-center space-x-4">
							<span>Admin Panel v1.0</span>
							<span className="text-green-500">● System Online</span>
						</div>
					</div>
				</footer>
			</div>

			{/* Mobile Sidebar Overlay */}
			{sidebarOpen && (
				<div
					className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
					onClick={() => setSidebarOpen(false)}
				/>
			)}
		</div>
	);
};

export default AdminLayout;
