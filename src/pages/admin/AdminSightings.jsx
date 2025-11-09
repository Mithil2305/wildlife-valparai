import { useState, useEffect } from "react";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { SearchBar, FilterBar } from "../../components/content/ContentSwitcher";

const AdminSightings = () => {
	const [sightings, setSightings] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedSighting, setSelectedSighting] = useState(null);
	const [showModal, setShowModal] = useState(false);
	const [filters, setFilters] = useState({
		status: "all",
		species: "all",
		sort: "recent",
	});

	useEffect(() => {
		const loadSightings = () => {
			setLoading(true);
			// Simulate API call
			setTimeout(() => {
				setSightings([
					{
						id: 1,
						title: "Elephant Herd Crossing",
						species: "Asian Elephant",
						location: "Valparai Tea Estate",
						date: "2024-01-20",
						time: "06:30 AM",
						submittedBy: "Rajesh Kumar",
						status: "pending",
						views: 0,
						likes: 0,
						quality: 95,
					},
					{
						id: 2,
						title: "Leopard at Dusk",
						species: "Indian Leopard",
						location: "Grass Hills",
						date: "2024-01-19",
						time: "06:45 PM",
						submittedBy: "Arun Menon",
						status: "approved",
						views: 542,
						likes: 124,
						quality: 98,
					},
					{
						id: 3,
						title: "Malabar Giant Squirrel",
						species: "Malabar Giant Squirrel",
						location: "Forest Trail",
						date: "2024-01-18",
						time: "08:15 AM",
						submittedBy: "Priya Sharma",
						status: "approved",
						views: 324,
						likes: 89,
						quality: 92,
					},
					{
						id: 4,
						title: "Blurry Bird Photo",
						species: "Unknown Bird",
						location: "Tea Garden",
						date: "2024-01-17",
						time: "05:30 PM",
						submittedBy: "New User",
						status: "rejected",
						views: 0,
						likes: 0,
						quality: 45,
					},
					{
						id: 5,
						title: "Gaur Herd",
						species: "Indian Gaur",
						location: "Forest Edge",
						date: "2024-01-16",
						time: "07:00 AM",
						submittedBy: "Meera Iyer",
						status: "pending",
						views: 0,
						likes: 0,
						quality: 88,
					},
				]);
				setLoading(false);
			}, 1000);
		};
		loadSightings();
	}, [filters]);

	const handleSearch = (query) => {
		console.log("Searching for:", query);
	};

	const handleFilter = (newFilters) => {
		setFilters({ ...filters, ...newFilters });
	};

	const handleViewSighting = (sighting) => {
		setSelectedSighting(sighting);
		setShowModal(true);
	};

	const handleApprove = (id) => {
		setSightings(
			sightings.map((s) => (s.id === id ? { ...s, status: "approved" } : s))
		);
		setShowModal(false);
	};

	const handleReject = (id) => {
		setSightings(
			sightings.map((s) => (s.id === id ? { ...s, status: "rejected" } : s))
		);
		setShowModal(false);
	};

	const getStatusBadge = (status) => {
		const badges = {
			approved: "bg-green-100 text-green-700",
			pending: "bg-yellow-100 text-yellow-700",
			rejected: "bg-red-100 text-red-700",
		};
		return badges[status] || "bg-gray-100 text-gray-700";
	};

	const getQualityColor = (quality) => {
		if (quality >= 90) return "text-green-600";
		if (quality >= 70) return "text-yellow-600";
		return "text-red-600";
	};

	if (loading) {
		return <LoadingSpinner message="Loading sightings..." />;
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-[#EDF1D6] via-white to-[#9DC08B]/20 py-8">
			<div className="max-w-7xl mx-auto px-4">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-5xl font-bold text-[#40513B] mb-2">
						📸 Sightings Management
					</h1>
					<p className="text-[#609966] text-lg">
						Review and moderate wildlife sighting submissions
					</p>
				</div>

				{/* Stats Cards */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
					{[
						{
							icon: "📝",
							label: "Total Submissions",
							value: sightings.length,
						},
						{
							icon: "⏳",
							label: "Pending Review",
							value: sightings.filter((s) => s.status === "pending").length,
						},
						{
							icon: "✅",
							label: "Approved",
							value: sightings.filter((s) => s.status === "approved").length,
						},
						{
							icon: "❌",
							label: "Rejected",
							value: sightings.filter((s) => s.status === "rejected").length,
						},
					].map((stat, index) => (
						<div
							key={index}
							className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-[#9DC08B]/20 p-6 hover:scale-105 transition-transform"
						>
							<div className="text-4xl mb-2">{stat.icon}</div>
							<div className="text-2xl font-bold text-[#40513B]">
								{stat.value}
							</div>
							<div className="text-sm text-[#609966]">{stat.label}</div>
						</div>
					))}
				</div>

				{/* Filters */}
				<div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-[#9DC08B]/20 p-6 mb-8">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
						<SearchBar
							onSearch={handleSearch}
							placeholder="Search sightings..."
						/>
						<FilterBar
							onFilter={handleFilter}
							filters={[
								{ value: "all", label: "All Species" },
								{ value: "elephant", label: "Elephants" },
								{ value: "leopard", label: "Leopards" },
								{ value: "gaur", label: "Gaur" },
								{ value: "birds", label: "Birds" },
							]}
						/>
					</div>
					<div className="flex items-center space-x-2">
						<span className="text-sm text-[#609966]">Status:</span>
						{["all", "pending", "approved", "rejected"].map((status) => (
							<button
								key={status}
								onClick={() => handleFilter({ status })}
								className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
									filters.status === status
										? "bg-[#609966] text-white"
										: "bg-[#EDF1D6] text-[#609966] hover:bg-[#9DC08B]/30"
								}`}
							>
								{status.charAt(0).toUpperCase() + status.slice(1)}
							</button>
						))}
					</div>
				</div>

				{/* Sightings Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{sightings.map((sighting) => (
						<div
							key={sighting.id}
							className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-[#9DC08B]/20 overflow-hidden hover:scale-105 transition-transform"
						>
							<div className="h-48 bg-gradient-to-r from-[#EDF1D6] to-[#9DC08B]/30 flex items-center justify-center text-6xl">
								📸
							</div>
							<div className="p-6">
								<div className="flex items-center justify-between mb-3">
									<span
										className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(
											sighting.status
										)}`}
									>
										{sighting.status.toUpperCase()}
									</span>
									<span
										className={`text-sm font-bold ${getQualityColor(
											sighting.quality
										)}`}
									>
										Q: {sighting.quality}%
									</span>
								</div>
								<h3 className="text-xl font-bold text-[#40513B] mb-2">
									{sighting.title}
								</h3>
								<div className="space-y-1 text-sm text-[#609966] mb-4">
									<div>🦁 {sighting.species}</div>
									<div>📍 {sighting.location}</div>
									<div>
										📅 {sighting.date} • {sighting.time}
									</div>
									<div>👤 {sighting.submittedBy}</div>
								</div>
								{sighting.status === "approved" && (
									<div className="flex items-center justify-between text-xs text-[#609966] mb-4">
										<span>👁️ {sighting.views}</span>
										<span>❤️ {sighting.likes}</span>
									</div>
								)}
								<button
									onClick={() => handleViewSighting(sighting)}
									className="w-full px-4 py-2 bg-[#609966] text-white rounded-xl font-bold hover:bg-[#40513B] transition-colors"
								>
									Review
								</button>
							</div>
						</div>
					))}
				</div>

				{/* Review Modal */}
				{showModal && selectedSighting && (
					<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
						<div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
							<div className="p-8">
								<div className="flex items-center justify-between mb-6">
									<h2 className="text-3xl font-bold text-[#40513B]">
										Review Sighting
									</h2>
									<button
										onClick={() => setShowModal(false)}
										className="text-3xl text-[#609966] hover:text-[#40513B]"
									>
										×
									</button>
								</div>

								<div className="space-y-6">
									{/* Image */}
									<div className="h-96 bg-gradient-to-r from-[#EDF1D6] to-[#9DC08B]/30 rounded-2xl flex items-center justify-center text-9xl">
										📸
									</div>

									{/* Info Grid */}
									<div className="grid grid-cols-2 gap-4">
										<div className="p-4 bg-[#EDF1D6] rounded-xl">
											<div className="text-sm text-[#609966] mb-1">Title</div>
											<div className="font-bold text-[#40513B]">
												{selectedSighting.title}
											</div>
										</div>
										<div className="p-4 bg-[#EDF1D6] rounded-xl">
											<div className="text-sm text-[#609966] mb-1">Species</div>
											<div className="font-bold text-[#40513B]">
												{selectedSighting.species}
											</div>
										</div>
										<div className="p-4 bg-[#EDF1D6] rounded-xl">
											<div className="text-sm text-[#609966] mb-1">
												Location
											</div>
											<div className="font-bold text-[#40513B]">
												{selectedSighting.location}
											</div>
										</div>
										<div className="p-4 bg-[#EDF1D6] rounded-xl">
											<div className="text-sm text-[#609966] mb-1">
												Date & Time
											</div>
											<div className="font-bold text-[#40513B]">
												{selectedSighting.date}
												<div className="text-xs">{selectedSighting.time}</div>
											</div>
										</div>
										<div className="p-4 bg-[#EDF1D6] rounded-xl">
											<div className="text-sm text-[#609966] mb-1">
												Submitted By
											</div>
											<div className="font-bold text-[#40513B]">
												{selectedSighting.submittedBy}
											</div>
										</div>
										<div className="p-4 bg-[#EDF1D6] rounded-xl">
											<div className="text-sm text-[#609966] mb-1">
												Quality Score
											</div>
											<div
												className={`font-bold ${getQualityColor(
													selectedSighting.quality
												)}`}
											>
												{selectedSighting.quality}%
											</div>
										</div>
									</div>

									{/* Status */}
									<div className="p-6 bg-[#EDF1D6] rounded-2xl">
										<div className="flex items-center justify-between">
											<div>
												<div className="text-sm text-[#609966] mb-1">
													Current Status
												</div>
												<span
													className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusBadge(
														selectedSighting.status
													)}`}
												>
													{selectedSighting.status.toUpperCase()}
												</span>
											</div>
											{selectedSighting.status === "approved" && (
												<div>
													<div className="text-sm text-[#609966] mb-1">
														Engagement
													</div>
													<div className="flex space-x-4">
														<span className="font-bold text-[#40513B]">
															👁️ {selectedSighting.views}
														</span>
														<span className="font-bold text-[#40513B]">
															❤️ {selectedSighting.likes}
														</span>
													</div>
												</div>
											)}
										</div>
									</div>

									{/* Action Buttons */}
									{selectedSighting.status === "pending" && (
										<div className="flex space-x-3">
											<button
												onClick={() => handleApprove(selectedSighting.id)}
												className="flex-1 px-6 py-4 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-colors"
											>
												✅ Approve
											</button>
											<button
												onClick={() => handleReject(selectedSighting.id)}
												className="flex-1 px-6 py-4 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors"
											>
												❌ Reject
											</button>
										</div>
									)}
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
				)}
			</div>
		</div>
	);
};

export default AdminSightings;
