import { useState, useEffect } from "react";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const AdminAds = () => {
	const [ads, setAds] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedAd, setSelectedAd] = useState(null);
	const [showModal, setShowModal] = useState(false);
	const [showCreateModal, setShowCreateModal] = useState(false);

	useEffect(() => {
		const loadAds = () => {
			setLoading(true);
			// Simulate API call
			setTimeout(() => {
				setAds([
					{
						id: 1,
						title: "Wildlife Conservation Banner",
						type: "banner",
						placement: "homepage",
						status: "active",
						clicks: 1245,
						impressions: 45230,
						ctr: 2.75,
						startDate: "2024-01-01",
						endDate: "2024-12-31",
					},
					{
						id: 2,
						title: "Eco Tourism Promo",
						type: "sidebar",
						placement: "sightings",
						status: "active",
						clicks: 892,
						impressions: 32145,
						ctr: 2.77,
						startDate: "2024-01-15",
						endDate: "2024-06-30",
					},
					{
						id: 3,
						title: "Photography Workshop",
						type: "popup",
						placement: "blogs",
						status: "paused",
						clicks: 456,
						impressions: 18920,
						ctr: 2.41,
						startDate: "2024-02-01",
						endDate: "2024-03-31",
					},
					{
						id: 4,
						title: "Donation Campaign",
						type: "banner",
						placement: "all-pages",
						status: "active",
						clicks: 2134,
						impressions: 67890,
						ctr: 3.14,
						startDate: "2024-01-10",
						endDate: "2024-12-31",
					},
				]);
				setLoading(false);
			}, 1000);
		};
		loadAds();
	}, []);

	const handleViewAd = (ad) => {
		setSelectedAd(ad);
		setShowModal(true);
	};

	const handleToggleStatus = (id) => {
		setAds(
			ads.map((ad) =>
				ad.id === id
					? { ...ad, status: ad.status === "active" ? "paused" : "active" }
					: ad
			)
		);
	};

	const handleDeleteAd = (id) => {
		if (window.confirm("Are you sure you want to delete this ad?")) {
			setAds(ads.filter((ad) => ad.id !== id));
			setShowModal(false);
		}
	};

	const getStatusBadge = (status) => {
		const badges = {
			active: "bg-green-100 text-green-700",
			paused: "bg-yellow-100 text-yellow-700",
			expired: "bg-red-100 text-red-700",
		};
		return badges[status] || "bg-gray-100 text-gray-700";
	};

	const getTypeIcon = (type) => {
		const icons = {
			banner: "🎯",
			sidebar: "📌",
			popup: "💬",
		};
		return icons[type] || "📢";
	};

	const totalClicks = ads.reduce((sum, ad) => sum + ad.clicks, 0);
	const totalImpressions = ads.reduce((sum, ad) => sum + ad.impressions, 0);
	const avgCTR = (totalClicks / totalImpressions) * 100;

	if (loading) {
		return <LoadingSpinner message="Loading ads..." />;
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-[#EDF1D6] via-white to-[#9DC08B]/20 py-8">
			<div className="max-w-7xl mx-auto px-4">
				{/* Header */}
				<div className="flex items-center justify-between mb-8">
					<div>
						<h1 className="text-5xl font-bold text-[#40513B] mb-2">
							🎯 Ads Management
						</h1>
						<p className="text-[#609966] text-lg">
							Manage advertisements and campaigns
						</p>
					</div>
					<button
						onClick={() => setShowCreateModal(true)}
						className="px-6 py-3 bg-gradient-to-r from-[#609966] to-[#40513B] text-white rounded-xl font-bold hover:scale-105 transition-transform shadow-lg"
					>
						➕ Create New Ad
					</button>
				</div>

				{/* Stats Cards */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
					<div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-[#9DC08B]/20 p-6 hover:scale-105 transition-transform">
						<div className="text-4xl mb-2">📢</div>
						<div className="text-2xl font-bold text-[#40513B]">
							{ads.length}
						</div>
						<div className="text-sm text-[#609966]">Total Ads</div>
					</div>
					<div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-[#9DC08B]/20 p-6 hover:scale-105 transition-transform">
						<div className="text-4xl mb-2">👆</div>
						<div className="text-2xl font-bold text-[#40513B]">
							{totalClicks.toLocaleString()}
						</div>
						<div className="text-sm text-[#609966]">Total Clicks</div>
					</div>
					<div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-[#9DC08B]/20 p-6 hover:scale-105 transition-transform">
						<div className="text-4xl mb-2">👁️</div>
						<div className="text-2xl font-bold text-[#40513B]">
							{(totalImpressions / 1000).toFixed(1)}K
						</div>
						<div className="text-sm text-[#609966]">Impressions</div>
					</div>
					<div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-[#9DC08B]/20 p-6 hover:scale-105 transition-transform">
						<div className="text-4xl mb-2">📊</div>
						<div className="text-2xl font-bold text-[#40513B]">
							{avgCTR.toFixed(2)}%
						</div>
						<div className="text-sm text-[#609966]">Avg CTR</div>
					</div>
				</div>

				{/* Ads Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{ads.map((ad) => (
						<div
							key={ad.id}
							className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-[#9DC08B]/20 overflow-hidden hover:scale-105 transition-transform"
						>
							<div className="h-48 bg-gradient-to-r from-[#EDF1D6] to-[#9DC08B]/30 flex items-center justify-center text-6xl relative">
								{getTypeIcon(ad.type)}
								<span
									className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(
										ad.status
									)}`}
								>
									{ad.status.toUpperCase()}
								</span>
							</div>
							<div className="p-6">
								<h3 className="text-xl font-bold text-[#40513B] mb-2">
									{ad.title}
								</h3>
								<div className="space-y-2 text-sm text-[#609966] mb-4">
									<div className="flex items-center justify-between">
										<span>Type:</span>
										<span className="font-bold text-[#40513B]">
											{ad.type.charAt(0).toUpperCase() + ad.type.slice(1)}
										</span>
									</div>
									<div className="flex items-center justify-between">
										<span>Placement:</span>
										<span className="font-bold text-[#40513B]">
											{ad.placement}
										</span>
									</div>
									<div className="flex items-center justify-between">
										<span>Duration:</span>
										<span className="font-bold text-[#40513B]">
											{ad.startDate} - {ad.endDate}
										</span>
									</div>
								</div>

								{/* Performance Metrics */}
								<div className="grid grid-cols-3 gap-3 mb-4">
									<div className="p-3 bg-[#EDF1D6] rounded-xl text-center">
										<div className="text-sm text-[#609966] mb-1">Clicks</div>
										<div className="font-bold text-[#40513B]">{ad.clicks}</div>
									</div>
									<div className="p-3 bg-[#EDF1D6] rounded-xl text-center">
										<div className="text-sm text-[#609966] mb-1">Views</div>
										<div className="font-bold text-[#40513B]">
											{(ad.impressions / 1000).toFixed(1)}K
										</div>
									</div>
									<div className="p-3 bg-[#EDF1D6] rounded-xl text-center">
										<div className="text-sm text-[#609966] mb-1">CTR</div>
										<div className="font-bold text-[#40513B]">
											{ad.ctr.toFixed(2)}%
										</div>
									</div>
								</div>

								{/* Action Buttons */}
								<div className="flex space-x-2">
									<button
										onClick={() => handleViewAd(ad)}
										className="flex-1 px-4 py-2 bg-[#609966] text-white rounded-xl font-bold hover:bg-[#40513B] transition-colors text-sm"
									>
										Manage
									</button>
									<button
										onClick={() => handleToggleStatus(ad.id)}
										className={`px-4 py-2 rounded-xl font-bold transition-colors text-sm ${
											ad.status === "active"
												? "bg-yellow-400 text-yellow-900"
												: "bg-green-500 text-white"
										}`}
									>
										{ad.status === "active" ? "⏸️" : "▶️"}
									</button>
								</div>
							</div>
						</div>
					))}
				</div>

				{/* Ad Detail Modal */}
				{showModal && selectedAd && (
					<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
						<div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
							<div className="p-8">
								<div className="flex items-center justify-between mb-6">
									<h2 className="text-3xl font-bold text-[#40513B]">
										Manage Advertisement
									</h2>
									<button
										onClick={() => setShowModal(false)}
										className="text-3xl text-[#609966] hover:text-[#40513B]"
									>
										×
									</button>
								</div>

								<div className="space-y-6">
									{/* Ad Preview */}
									<div className="h-64 bg-gradient-to-r from-[#EDF1D6] to-[#9DC08B]/30 rounded-2xl flex items-center justify-center text-9xl">
										{getTypeIcon(selectedAd.type)}
									</div>

									{/* Info Grid */}
									<div className="grid grid-cols-2 gap-4">
										<div className="col-span-2 p-4 bg-[#EDF1D6] rounded-xl">
											<div className="text-sm text-[#609966] mb-1">Title</div>
											<div className="font-bold text-[#40513B] text-xl">
												{selectedAd.title}
											</div>
										</div>
										<div className="p-4 bg-[#EDF1D6] rounded-xl">
											<div className="text-sm text-[#609966] mb-1">Type</div>
											<div className="font-bold text-[#40513B]">
												{selectedAd.type.charAt(0).toUpperCase() +
													selectedAd.type.slice(1)}
											</div>
										</div>
										<div className="p-4 bg-[#EDF1D6] rounded-xl">
											<div className="text-sm text-[#609966] mb-1">
												Placement
											</div>
											<div className="font-bold text-[#40513B]">
												{selectedAd.placement}
											</div>
										</div>
										<div className="p-4 bg-[#EDF1D6] rounded-xl">
											<div className="text-sm text-[#609966] mb-1">
												Start Date
											</div>
											<div className="font-bold text-[#40513B]">
												{selectedAd.startDate}
											</div>
										</div>
										<div className="p-4 bg-[#EDF1D6] rounded-xl">
											<div className="text-sm text-[#609966] mb-1">
												End Date
											</div>
											<div className="font-bold text-[#40513B]">
												{selectedAd.endDate}
											</div>
										</div>
									</div>

									{/* Performance Stats */}
									<div>
										<h3 className="font-bold text-[#40513B] mb-3">
											Performance Metrics
										</h3>
										<div className="grid grid-cols-3 gap-4">
											<div className="p-4 bg-[#EDF1D6] rounded-xl text-center">
												<div className="text-3xl mb-2">👆</div>
												<div className="text-2xl font-bold text-[#40513B]">
													{selectedAd.clicks}
												</div>
												<div className="text-xs text-[#609966]">Clicks</div>
											</div>
											<div className="p-4 bg-[#EDF1D6] rounded-xl text-center">
												<div className="text-3xl mb-2">👁️</div>
												<div className="text-2xl font-bold text-[#40513B]">
													{selectedAd.impressions.toLocaleString()}
												</div>
												<div className="text-xs text-[#609966]">
													Impressions
												</div>
											</div>
											<div className="p-4 bg-[#EDF1D6] rounded-xl text-center">
												<div className="text-3xl mb-2">📊</div>
												<div className="text-2xl font-bold text-[#40513B]">
													{selectedAd.ctr.toFixed(2)}%
												</div>
												<div className="text-xs text-[#609966]">CTR</div>
											</div>
										</div>
									</div>

									{/* Action Buttons */}
									<div className="space-y-3">
										<button
											onClick={() => handleToggleStatus(selectedAd.id)}
											className={`w-full px-6 py-4 rounded-xl font-bold transition-colors ${
												selectedAd.status === "active"
													? "bg-yellow-500 text-white hover:bg-yellow-600"
													: "bg-green-500 text-white hover:bg-green-600"
											}`}
										>
											{selectedAd.status === "active"
												? "⏸️ Pause Ad"
												: "▶️ Activate Ad"}
										</button>
										<button
											onClick={() => handleDeleteAd(selectedAd.id)}
											className="w-full px-6 py-4 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors"
										>
											🗑️ Delete Ad
										</button>
										<button
											onClick={() => setShowModal(false)}
											className="w-full px-6 py-3 bg-[#EDF1D6] text-[#609966] rounded-xl font-bold hover:bg-[#9DC08B]/30 transition-colors"
										>
											Close
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}

				{/* Create Ad Modal */}
				{showCreateModal && (
					<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
						<div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
							<div className="p-8">
								<div className="flex items-center justify-between mb-6">
									<h2 className="text-3xl font-bold text-[#40513B]">
										Create New Advertisement
									</h2>
									<button
										onClick={() => setShowCreateModal(false)}
										className="text-3xl text-[#609966] hover:text-[#40513B]"
									>
										×
									</button>
								</div>
								<div className="text-center py-12">
									<div className="text-8xl mb-4">🎯</div>
									<h3 className="text-2xl font-bold text-[#40513B] mb-4">
										Ad Creation Form
									</h3>
									<p className="text-[#609966] mb-6">
										This feature will allow you to create new advertisements
										<br />
										with customizable settings and targeting options.
									</p>
									<button
										onClick={() => setShowCreateModal(false)}
										className="px-8 py-3 bg-gradient-to-r from-[#609966] to-[#40513B] text-white rounded-xl font-bold hover:scale-105 transition-transform"
									>
										Coming Soon
									</button>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default AdminAds;
