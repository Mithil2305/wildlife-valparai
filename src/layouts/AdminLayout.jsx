import { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import LoadingSpinner from "../components/common/LoadingSpinner";

const AdminLayout = () => {
	const { user, logout, loading } = useAuth();
	const location = useLocation();
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => setScrolled(window.scrollY > 20);
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	if (loading) return <LoadingSpinner />;

	const adminNavLinks = [
		{ to: "/admin", label: "Dashboard", icon: "📊" },
		{ to: "/admin/sightings", label: "Sightings", icon: "�" },
		{ to: "/admin/users", label: "Users", icon: "👥" },
		{ to: "/admin/blogs", label: "Blogs", icon: "📝" },
		{ to: "/admin/payments", label: "Payments", icon: "💰" },
		{ to: "/admin/performance", label: "Performance", icon: "📈" },
		{ to: "/admin/ads", label: "Ads", icon: "📢" },
	];

	const isActive = (path) => {
		if (path === "/admin") return location.pathname === "/admin";
		return location.pathname.startsWith(path);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-[#EDF1D6] via-[#EDF1D6] to-[#9DC08B] flex">
			{/* Sidebar */}
			<aside
				className={`${sidebarOpen ? "w-64" : "w-20"} transition-all duration-300 bg-gradient-to-br from-[#40513B] to-[#609966] text-white fixed h-full z-50 shadow-2xl`}
			>
				<div className="flex flex-col h-full">
					<div className="p-6 border-b border-white/10">
						<div
							className={`flex items-center ${sidebarOpen ? "space-x-3" : "justify-center"}`}
						>
							<div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
								<span className="text-2xl">🦁</span>
							</div>
							{sidebarOpen && (
								<div>
									<h1 className="text-lg font-bold">Wildlife Valparai</h1>
									<p className="text-xs text-white/70">Admin Panel</p>
								</div>
							)}
						</div>
					</div>

					<nav className="flex-1 p-4 space-y-2 overflow-y-auto">
						{adminNavLinks.map((link) => (
							<Link
								key={link.to}
								to={link.to}
								className={`flex items-center ${sidebarOpen ? "space-x-3 px-4" : "justify-center px-2"} py-3 rounded-xl transition-all duration-300 ${isActive(link.to) ? "bg-white/20 text-white shadow-lg scale-105" : "text-white/70 hover:bg-white/10 hover:text-white"}`}
								title={!sidebarOpen ? link.label : ""}
							>
								<span className="text-xl">{link.icon}</span>
								{sidebarOpen && (
									<span className="font-medium">{link.label}</span>
								)}
							</Link>
						))}
					</nav>

					<div className="p-4 border-t border-white/10">
						<button
							onClick={() => setSidebarOpen(!sidebarOpen)}
							className="w-full flex items-center justify-center px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
						>
							<span className="text-xl">{sidebarOpen ? "←" : "→"}</span>
						</button>
						{sidebarOpen && (
							<button
								onClick={logout}
								className="w-full mt-2 flex items-center space-x-2 px-4 py-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-white transition-colors"
							>
								<span>🚪</span>
								<span>Logout</span>
							</button>
						)}
					</div>
				</div>
			</aside>

			{/* Main Content */}
			<div
				className={`flex-1 ${sidebarOpen ? "ml-64" : "ml-20"} transition-all duration-300`}
			>
				<header
					className={`sticky top-0 z-40 transition-all duration-500 ${scrolled ? "bg-white/95 backdrop-blur-lg shadow-lg" : "bg-white/80 backdrop-blur-sm"}`}
				>
					<div className="flex items-center justify-between px-6 py-4">
						<h1 className="text-2xl font-bold bg-gradient-to-r from-[#40513B] to-[#609966] bg-clip-text text-transparent">
							{adminNavLinks.find((link) => isActive(link.to))?.label ||
								"Dashboard"}
						</h1>
						<div className="flex items-center space-x-4">
							<div className="text-sm text-[#609966] font-medium hidden md:block">
								{user?.displayName || user?.email || "Admin"}
							</div>
							<button className="relative p-2 text-[#609966] hover:text-[#40513B] hover:scale-110 transition-transform">
								<span className="text-xl">🔔</span>
								<span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
							</button>
						</div>
					</div>
				</header>

				<main className="p-6">
					<div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 min-h-[600px] border border-[#9DC08B]/20">
						<Outlet />
					</div>
				</main>
			</div>
		</div>
	);
};

export default AdminLayout;
