import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import LoadingSpinner from "../components/common/LoadingSpinner";
import AdsContainer from "../components/common/AdsContainer";

const MainLayout = () => {
	const { currentUser, loading } = useAuth();
	const [sidebarOpen, setSidebarOpen] = useState(false);

	if (loading) {
		return <LoadingSpinner />;
	}

	return (
		<div className="min-h-screen bg-gray-50 flex flex-col">
			{/* Header */}
			<header className="bg-white shadow-sm sticky top-0 z-50">
				<Navbar
					currentUser={currentUser}
					sidebarOpen={sidebarOpen}
					setSidebarOpen={setSidebarOpen}
				/>
			</header>

			{/* Top Banner Ad */}
			<div className="bg-white border-b">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<AdsContainer placement="header" adFormat="banner" className="py-2" />
				</div>
			</div>

			{/* Main Content */}
			<main className="flex-1">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
					<div className="flex flex-col lg:flex-row gap-6">
						{/* Sidebar Ads */}
						<aside className="lg:w-1/4 space-y-6">
							<div className="sticky top-20 space-y-6">
								<AdsContainer
									placement="sidebar"
									adFormat="vertical"
									className="bg-white rounded-lg shadow-sm p-4"
								/>

								{/* Quick Stats for logged-in users */}
								{currentUser && (
									<div className="bg-white rounded-lg shadow-sm p-4">
										<h3 className="text-lg font-semibold text-gray-900 mb-3">
											Quick Stats
										</h3>
										<div className="space-y-2 text-sm text-gray-600">
											<p>📸 Sightings: 12</p>
											<p>📝 Blogs: 3</p>
											<p>⭐ Points: 450</p>
										</div>
									</div>
								)}
							</div>
						</aside>

						{/* Main Content Area */}
						<div className="lg:w-3/4">
							<div className="bg-white rounded-lg shadow-sm">
								<Outlet />
							</div>

							{/* In-content Ads */}
							<div className="mt-6">
								<AdsContainer
									placement="content"
									adFormat="rectangle"
									className="bg-white rounded-lg shadow-sm p-4 text-center"
								/>
							</div>
						</div>
					</div>
				</div>
			</main>

			{/* Footer */}
			<footer className="bg-gray-800 text-white mt-12">
				<Footer />
			</footer>

			{/* Mobile Sidebar */}
			{sidebarOpen && (
				<div className="lg:hidden">
					<div
						className="fixed inset-0 bg-black bg-opacity-50 z-40"
						onClick={() => setSidebarOpen(false)}
					/>
					<div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-50 p-4">
						<div className="flex items-center justify-between mb-6">
							<h2 className="text-lg font-semibold">Menu</h2>
							<button
								onClick={() => setSidebarOpen(false)}
								className="p-2 rounded-md text-gray-400 hover:text-gray-600"
							>
								✕
							</button>
						</div>

						{/* Mobile Navigation */}
						<nav className="space-y-2">
							<a
								href="/sightings"
								className="block py-2 px-3 rounded hover:bg-gray-100"
							>
								🐾 Sightings
							</a>
							<a
								href="/blogs"
								className="block py-2 px-3 rounded hover:bg-gray-100"
							>
								📝 Blogs
							</a>
							<a
								href="/leaderboard"
								className="block py-2 px-3 rounded hover:bg-gray-100"
							>
								🏆 Leaderboard
							</a>
							{currentUser && (
								<>
									<a
										href="/profile"
										className="block py-2 px-3 rounded hover:bg-gray-100"
									>
										👤 Profile
									</a>
									<a
										href="/submit-sighting"
										className="block py-2 px-3 rounded hover:bg-gray-100"
									>
										➕ Submit Sighting
									</a>
								</>
							)}
						</nav>
					</div>
				</div>
			)}
		</div>
	);
};

export default MainLayout;
