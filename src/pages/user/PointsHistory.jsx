import { useState, useEffect } from "react";
import { usePoints } from "../../hooks/usePoints";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const PointsHistory = () => {
	const { points, currentBadge } = usePoints();
	const [filteredHistory, setFilteredHistory] = useState([]);
	const [loading, setLoading] = useState(true);
	const [filter, setFilter] = useState("all");
	const [dateRange, setDateRange] = useState("all-time");

	useEffect(() => {
		const loadHistory = () => {
			setLoading(true);
			try {
				// Simulated data - replace with actual data from usePoints
				const mockHistory = [
					{
						id: 1,
						type: "sighting",
						description: "Tiger sighting documented",
						points: 50,
						timestamp: new Date(2025, 9, 14),
						status: "approved",
					},
					{
						id: 2,
						type: "blog",
						description: "Blog post published",
						points: 30,
						timestamp: new Date(2025, 9, 13),
						status: "approved",
					},
					{
						id: 3,
						type: "sighting",
						description: "Elephant herd sighting",
						points: 45,
						timestamp: new Date(2025, 9, 12),
						status: "approved",
					},
					{
						id: 4,
						type: "verification",
						description: "Sighting verified by expert",
						points: 20,
						timestamp: new Date(2025, 9, 11),
						status: "approved",
					},
					{
						id: 5,
						type: "blog",
						description: "Wildlife conservation article",
						points: 35,
						timestamp: new Date(2025, 9, 10),
						status: "approved",
					},
					{
						id: 6,
						type: "sighting",
						description: "Leopard spotted in forest",
						points: 55,
						timestamp: new Date(2025, 9, 9),
						status: "pending",
					},
					{
						id: 7,
						type: "comment",
						description: "Helpful comment on blog",
						points: 5,
						timestamp: new Date(2025, 9, 8),
						status: "approved",
					},
					{
						id: 8,
						type: "sighting",
						description: "Rare bird species identified",
						points: 60,
						timestamp: new Date(2025, 9, 7),
						status: "approved",
					},
					{
						id: 9,
						type: "blog",
						description: "Photography tips shared",
						points: 25,
						timestamp: new Date(2025, 9, 6),
						status: "approved",
					},
					{
						id: 10,
						type: "achievement",
						description: "First badge earned",
						points: 100,
						timestamp: new Date(2025, 9, 5),
						status: "approved",
					},
				];

				let filtered = mockHistory;

				// Filter by type
				if (filter !== "all") {
					filtered = filtered.filter((item) => item.type === filter);
				}

				// Filter by date range
				const now = new Date();
				if (dateRange === "week") {
					const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
					filtered = filtered.filter((item) => item.timestamp >= weekAgo);
				} else if (dateRange === "month") {
					const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
					filtered = filtered.filter((item) => item.timestamp >= monthAgo);
				}

				setFilteredHistory(filtered);
			} catch (error) {
				console.error("Error loading history:", error);
			} finally {
				setLoading(false);
			}
		};

		loadHistory();
	}, [filter, dateRange]);

	const activityTypes = [
		{
			value: "all",
			label: "All Activity",
			icon: "⭐",
			color: "from-[#609966] to-[#40513B]",
		},
		{
			value: "sighting",
			label: "Sightings",
			icon: "📸",
			color: "from-[#9DC08B] to-[#609966]",
		},
		{
			value: "blog",
			label: "Blogs",
			icon: "📝",
			color: "from-[#609966] to-[#40513B]",
		},
		{
			value: "verification",
			label: "Verifications",
			icon: "✅",
			color: "from-[#9DC08B] to-[#609966]",
		},
		{
			value: "achievement",
			label: "Achievements",
			icon: "🏆",
			color: "from-[#609966] to-[#40513B]",
		},
	];

	const dateRanges = [
		{ value: "all-time", label: "All Time" },
		{ value: "month", label: "This Month" },
		{ value: "week", label: "This Week" },
	];

	const getActivityIcon = (type) => {
		const icons = {
			sighting: "📸",
			blog: "📝",
			verification: "✅",
			comment: "💬",
			achievement: "🏆",
		};
		return icons[type] || "⭐";
	};

	const getActivityColor = (type) => {
		const colors = {
			sighting: "from-[#9DC08B] to-[#609966]",
			blog: "from-[#609966] to-[#40513B]",
			verification: "from-[#9DC08B] to-[#609966]",
			comment: "from-[#EDF1D6] to-[#9DC08B]",
			achievement: "from-[#609966] to-[#40513B]",
		};
		return colors[type] || "from-[#9DC08B] to-[#609966]";
	};

	const approvedPoints = filteredHistory
		.filter((item) => item.status === "approved")
		.reduce((sum, item) => sum + item.points, 0);
	const pendingPoints = filteredHistory
		.filter((item) => item.status === "pending")
		.reduce((sum, item) => sum + item.points, 0);

	if (loading) return <LoadingSpinner />;

	return (
		<div className="space-y-6">
			{/* Header with Stats */}
			<div className="bg-gradient-to-r from-[#40513B] to-[#609966] rounded-3xl p-8 text-white shadow-2xl">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<div>
						<h1 className="text-4xl font-bold mb-2 flex items-center">
							<span className="text-5xl mr-3">⭐</span>
							Points History
						</h1>
						<p className="text-white/80">Track your contribution journey</p>
					</div>
					<div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center hover:scale-105 transition-transform">
						<p className="text-sm text-white/70 mb-2">Total Points</p>
						<p className="text-4xl font-bold">{points || 0}</p>
					</div>
					<div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center hover:scale-105 transition-transform">
						<p className="text-sm text-white/70 mb-2">Current Badge</p>
						{currentBadge ? (
							<>
								<p className="text-4xl mb-1">{currentBadge.icon}</p>
								<p className="font-semibold">{currentBadge.name}</p>
							</>
						) : (
							<p className="text-2xl">🎯</p>
						)}
					</div>
				</div>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-[#9DC08B]/20 hover:scale-105 transition-transform">
					<div className="flex items-center justify-between mb-3">
						<div className="w-12 h-12 bg-gradient-to-r from-[#609966] to-[#40513B] rounded-xl flex items-center justify-center text-2xl">
							✅
						</div>
						<span className="text-2xl font-bold text-[#609966]">
							{approvedPoints}
						</span>
					</div>
					<p className="text-sm text-[#609966] font-medium">Approved Points</p>
					<p className="text-xs text-[#40513B]/60 mt-1">
						Points confirmed and added
					</p>
				</div>

				<div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-[#9DC08B]/20 hover:scale-105 transition-transform">
					<div className="flex items-center justify-between mb-3">
						<div className="w-12 h-12 bg-gradient-to-r from-[#9DC08B] to-[#609966] rounded-xl flex items-center justify-center text-2xl">
							⏳
						</div>
						<span className="text-2xl font-bold text-[#609966]">
							{pendingPoints}
						</span>
					</div>
					<p className="text-sm text-[#609966] font-medium">Pending Points</p>
					<p className="text-xs text-[#40513B]/60 mt-1">
						Awaiting verification
					</p>
				</div>

				<div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-[#9DC08B]/20 hover:scale-105 transition-transform">
					<div className="flex items-center justify-between mb-3">
						<div className="w-12 h-12 bg-gradient-to-r from-[#609966] to-[#40513B] rounded-xl flex items-center justify-center text-2xl">
							📊
						</div>
						<span className="text-2xl font-bold text-[#609966]">
							{filteredHistory.length}
						</span>
					</div>
					<p className="text-sm text-[#609966] font-medium">Total Activities</p>
					<p className="text-xs text-[#40513B]/60 mt-1">Contributions made</p>
				</div>
			</div>

			{/* Filters */}
			<div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-[#9DC08B]/20">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{/* Activity Type Filter */}
					<div>
						<p className="text-sm font-bold text-[#40513B] mb-3 flex items-center">
							<span className="text-xl mr-2">🎯</span>
							Activity Type
						</p>
						<div className="flex flex-wrap gap-2">
							{activityTypes.map((type) => (
								<button
									key={type.value}
									onClick={() => setFilter(type.value)}
									className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
										filter === type.value
											? `bg-gradient-to-r ${type.color} text-white shadow-lg scale-105`
											: "bg-[#EDF1D6] text-[#40513B] hover:bg-[#9DC08B]/30"
									}`}
								>
									<span>{type.icon}</span>
									<span className="text-sm">{type.label}</span>
								</button>
							))}
						</div>
					</div>

					{/* Date Range Filter */}
					<div>
						<p className="text-sm font-bold text-[#40513B] mb-3 flex items-center">
							<span className="text-xl mr-2">📅</span>
							Time Period
						</p>
						<div className="flex flex-wrap gap-2">
							{dateRanges.map((range) => (
								<button
									key={range.value}
									onClick={() => setDateRange(range.value)}
									className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
										dateRange === range.value
											? "bg-gradient-to-r from-[#609966] to-[#40513B] text-white shadow-lg scale-105"
											: "bg-[#EDF1D6] text-[#40513B] hover:bg-[#9DC08B]/30"
									}`}
								>
									{range.label}
								</button>
							))}
						</div>
					</div>
				</div>
			</div>

			{/* Timeline */}
			<div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-[#9DC08B]/20">
				<h2 className="text-2xl font-bold text-[#40513B] mb-6 flex items-center">
					<span className="text-3xl mr-3">📜</span>
					Activity Timeline
				</h2>

				{filteredHistory.length > 0 ? (
					<div className="space-y-4">
						{filteredHistory.map((activity, index) => (
							<div
								key={activity.id}
								className="group relative"
								style={{ animationDelay: `${index * 0.05}s` }}
							>
								{/* Timeline Line */}
								{index !== filteredHistory.length - 1 && (
									<div className="absolute left-6 top-16 w-0.5 h-full bg-gradient-to-b from-[#9DC08B] to-transparent"></div>
								)}

								<div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-[#EDF1D6] to-transparent rounded-2xl hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
									{/* Icon */}
									<div
										className={`relative z-10 w-12 h-12 bg-gradient-to-r ${getActivityColor(activity.type)} rounded-xl flex items-center justify-center text-2xl shadow-lg group-hover:rotate-12 transition-transform`}
									>
										{getActivityIcon(activity.type)}
									</div>

									{/* Content */}
									<div className="flex-1">
										<div className="flex items-start justify-between mb-2">
											<div>
												<h3 className="font-bold text-[#40513B] text-lg">
													{activity.description}
												</h3>
												<p className="text-sm text-[#609966] mt-1">
													{activity.timestamp.toLocaleDateString("en-US", {
														year: "numeric",
														month: "long",
														day: "numeric",
														hour: "2-digit",
														minute: "2-digit",
													})}
												</p>
											</div>
											<div className="text-right">
												<div className="flex items-center space-x-2">
													<span className="text-2xl font-bold text-[#609966]">
														+{activity.points}
													</span>
													{activity.status === "pending" && (
														<span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-xs font-medium">
															⏳ Pending
														</span>
													)}
													{activity.status === "approved" && (
														<span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium">
															✅ Approved
														</span>
													)}
												</div>
											</div>
										</div>

										{/* Activity Type Badge */}
										<div className="inline-flex items-center space-x-2 bg-white/50 px-3 py-1 rounded-lg mt-2">
											<span className="text-sm">
												{getActivityIcon(activity.type)}
											</span>
											<span className="text-xs font-medium text-[#40513B] capitalize">
												{activity.type}
											</span>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				) : (
					<div className="text-center py-16">
						<span className="text-8xl mb-4 block">📭</span>
						<h3 className="text-2xl font-bold text-[#40513B] mb-2">
							No Activity Yet
						</h3>
						<p className="text-[#609966] mb-6">
							Start contributing to earn points and build your history!
						</p>
						<div className="flex justify-center space-x-4">
							<a
								href="/submit-sighting"
								className="px-6 py-3 bg-gradient-to-r from-[#609966] to-[#40513B] text-white rounded-xl font-medium hover:shadow-xl hover:scale-105 transition-all duration-300"
							>
								📸 Submit Sighting
							</a>
							<a
								href="/create-blog"
								className="px-6 py-3 bg-[#9DC08B]/30 text-[#40513B] rounded-xl font-medium hover:bg-[#9DC08B]/50 hover:scale-105 transition-all duration-300"
							>
								📝 Write Blog
							</a>
						</div>
					</div>
				)}
			</div>

			{/* Points Breakdown */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-[#9DC08B]/20">
					<h3 className="text-xl font-bold text-[#40513B] mb-4 flex items-center">
						<span className="text-2xl mr-2">📊</span>
						Points by Activity
					</h3>
					<div className="space-y-3">
						{activityTypes.slice(1).map((type) => {
							const typePoints = filteredHistory
								.filter(
									(item) =>
										item.type === type.value && item.status === "approved"
								)
								.reduce((sum, item) => sum + item.points, 0);
							const percentage =
								approvedPoints > 0 ? (typePoints / approvedPoints) * 100 : 0;

							return (
								<div key={type.value}>
									<div className="flex items-center justify-between mb-2">
										<span className="text-sm font-medium text-[#40513B] flex items-center">
											<span className="mr-2">{type.icon}</span>
											{type.label}
										</span>
										<span className="text-sm font-bold text-[#609966]">
											{typePoints} pts
										</span>
									</div>
									<div className="w-full bg-[#EDF1D6] rounded-full h-2 overflow-hidden">
										<div
											className={`h-full bg-gradient-to-r ${type.color} rounded-full transition-all duration-500`}
											style={{ width: `${percentage}%` }}
										></div>
									</div>
								</div>
							);
						})}
					</div>
				</div>

				<div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-[#9DC08B]/20">
					<h3 className="text-xl font-bold text-[#40513B] mb-4 flex items-center">
						<span className="text-2xl mr-2">🎯</span>
						Recent Milestones
					</h3>
					<div className="space-y-3">
						<div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-[#EDF1D6] to-transparent rounded-xl">
							<div className="w-10 h-10 bg-gradient-to-r from-[#609966] to-[#40513B] rounded-xl flex items-center justify-center text-xl">
								🏆
							</div>
							<div>
								<p className="font-medium text-[#40513B]">First Badge Earned</p>
								<p className="text-xs text-[#609966]">
									Welcome to the community!
								</p>
							</div>
						</div>
						<div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-[#EDF1D6] to-transparent rounded-xl">
							<div className="w-10 h-10 bg-gradient-to-r from-[#9DC08B] to-[#609966] rounded-xl flex items-center justify-center text-xl">
								⭐
							</div>
							<div>
								<p className="font-medium text-[#40513B]">
									100 Points Milestone
								</p>
								<p className="text-xs text-[#609966]">
									Keep up the great work!
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PointsHistory;
