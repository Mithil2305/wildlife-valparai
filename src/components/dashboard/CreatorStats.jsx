import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import LoadingSpinner from "../common/LoadingSpinner";

const CreatorStats = () => {
	const { currentUser } = useAuth();
	const [stats, setStats] = useState({
		totalContent: 0,
		totalViews: 0,
		totalLikes: 0,
		totalComments: 0,
		totalPoints: 0,
		monthlyGrowth: 0,
		topContent: [],
		recentActivity: [],
	});
	const [loading, setLoading] = useState(true);
	const [timeRange, setTimeRange] = useState("month");

	useEffect(() => {
		if (currentUser) {
			loadCreatorStats();
		}
	}, [currentUser, timeRange]);

	const loadCreatorStats = async () => {
		setLoading(true);
		// Simulate API call
		setTimeout(() => {
			setStats({
				totalContent: 24,
				totalViews: 1542,
				totalLikes: 389,
				totalComments: 127,
				totalPoints: 3450,
				monthlyGrowth: 23,
				topContent: [
					{ title: "Elephant Migration Patterns", views: 245, likes: 67 },
					{ title: "Rare Bird Sighting", views: 198, likes: 52 },
					{ title: "Conservation Success Story", views: 176, likes: 48 },
				],
				recentActivity: [
					{ action: "New blog published", time: "2 hours ago" },
					{ action: "Comment received", time: "5 hours ago" },
					{ action: "Content approved", time: "1 day ago" },
				],
			});
			setLoading(false);
		}, 1000);
	};

	if (loading) {
		return <LoadingSpinner message="Loading your stats..." />;
	}

	const statCards = [
		{
			label: "Total Content",
			value: stats.totalContent,
			icon: "📝",
			color: "from-[#609966] to-[#40513B]",
			change: "+12%",
		},
		{
			label: "Total Views",
			value: stats.totalViews.toLocaleString(),
			icon: "👁️",
			color: "from-[#9DC08B] to-[#609966]",
			change: "+23%",
		},
		{
			label: "Total Likes",
			value: stats.totalLikes,
			icon: "❤️",
			color: "from-[#EDF1D6] to-[#9DC08B]",
			change: "+18%",
		},
		{
			label: "Comments",
			value: stats.totalComments,
			icon: "💬",
			color: "from-[#40513B] to-[#609966]",
			change: "+15%",
		},
	];

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border-2 border-[#9DC08B]/20">
				<div className="flex flex-col md:flex-row md:items-center md:justify-between">
					<div>
						<h2 className="text-3xl font-bold text-[#40513B] mb-2 flex items-center">
							<span className="mr-3 text-4xl">📊</span>
							Creator Statistics
						</h2>
						<p className="text-[#609966]">Track your content performance</p>
					</div>

					{/* Time Range Selector */}
					<div className="mt-4 md:mt-0 flex space-x-2">
						{["week", "month", "year"].map((range) => (
							<button
								key={range}
								onClick={() => setTimeRange(range)}
								className={`px-4 py-2 rounded-xl font-medium transition-all ${
									timeRange === range
										? "bg-gradient-to-r from-[#609966] to-[#40513B] text-white"
										: "bg-[#EDF1D6] text-[#609966] hover:bg-[#9DC08B]/30"
								}`}
							>
								{range.charAt(0).toUpperCase() + range.slice(1)}
							</button>
						))}
					</div>
				</div>
			</div>

			{/* Stats Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{statCards.map((stat, index) => (
					<div
						key={index}
						className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-2 border-[#9DC08B]/20 hover:scale-105 transition-transform"
					>
						<div className="flex items-start justify-between mb-4">
							<div className="text-4xl">{stat.icon}</div>
							<div className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold">
								{stat.change}
							</div>
						</div>
						<div className="text-3xl font-bold text-[#40513B] mb-1">
							{stat.value}
						</div>
						<div className="text-sm text-[#609966]">{stat.label}</div>
					</div>
				))}
			</div>

			{/* Main Content Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Top Performing Content */}
				<div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 border-[#9DC08B]/20">
					<h3 className="text-xl font-bold text-[#40513B] mb-4 flex items-center">
						<span className="mr-2">🏆</span>
						Top Performing Content
					</h3>
					<div className="space-y-3">
						{stats.topContent.map((content, index) => (
							<div
								key={index}
								className="flex items-center justify-between p-4 bg-[#EDF1D6] rounded-xl hover:bg-[#9DC08B]/30 transition-colors"
							>
								<div className="flex-1">
									<div className="flex items-center space-x-2 mb-2">
										<span className="text-xl font-bold text-[#609966]">
											#{index + 1}
										</span>
										<h4 className="font-medium text-[#40513B]">
											{content.title}
										</h4>
									</div>
									<div className="flex space-x-4 text-sm text-[#609966]">
										<span className="flex items-center">
											<span className="mr-1">👁️</span>
											{content.views}
										</span>
										<span className="flex items-center">
											<span className="mr-1">❤️</span>
											{content.likes}
										</span>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Recent Activity */}
				<div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 border-[#9DC08B]/20">
					<h3 className="text-xl font-bold text-[#40513B] mb-4 flex items-center">
						<span className="mr-2">⚡</span>
						Recent Activity
					</h3>
					<div className="space-y-3">
						{stats.recentActivity.map((activity, index) => (
							<div
								key={index}
								className="flex items-center space-x-4 p-4 bg-[#EDF1D6] rounded-xl"
							>
								<div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#609966] to-[#40513B] flex items-center justify-center text-white text-xl">
									{index === 0 ? "📝" : index === 1 ? "💬" : "✅"}
								</div>
								<div className="flex-1">
									<div className="font-medium text-[#40513B]">
										{activity.action}
									</div>
									<div className="text-sm text-[#609966]">{activity.time}</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Content Breakdown */}
			<div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 border-[#9DC08B]/20">
				<h3 className="text-xl font-bold text-[#40513B] mb-6 flex items-center">
					<span className="mr-2">📈</span>
					Content Breakdown
				</h3>
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					<div className="text-center p-4 bg-[#EDF1D6] rounded-xl">
						<div className="text-3xl mb-2">📸</div>
						<div className="text-2xl font-bold text-[#40513B]">12</div>
						<div className="text-sm text-[#609966]">Sightings</div>
					</div>
					<div className="text-center p-4 bg-[#EDF1D6] rounded-xl">
						<div className="text-3xl mb-2">📝</div>
						<div className="text-2xl font-bold text-[#40513B]">8</div>
						<div className="text-sm text-[#609966]">Blog Posts</div>
					</div>
					<div className="text-center p-4 bg-[#EDF1D6] rounded-xl">
						<div className="text-3xl mb-2">🎵</div>
						<div className="text-2xl font-bold text-[#40513B]">4</div>
						<div className="text-sm text-[#609966]">Audio</div>
					</div>
					<div className="text-center p-4 bg-[#EDF1D6] rounded-xl">
						<div className="text-3xl mb-2">⏳</div>
						<div className="text-2xl font-bold text-[#40513B]">3</div>
						<div className="text-sm text-[#609966]">Pending</div>
					</div>
				</div>
			</div>

			{/* Earnings Overview */}
			<div className="bg-gradient-to-r from-[#609966] to-[#40513B] rounded-2xl p-8 shadow-xl text-white">
				<h3 className="text-2xl font-bold mb-4 flex items-center">
					<span className="mr-2">💰</span>
					Earnings Overview
				</h3>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<div>
						<div className="text-sm opacity-90 mb-2">Current Points</div>
						<div className="text-3xl font-bold">{stats.totalPoints}</div>
					</div>
					<div>
						<div className="text-sm opacity-90 mb-2">Estimated Value</div>
						<div className="text-3xl font-bold">
							₹{((stats.totalPoints / 100) * 10).toFixed(2)}
						</div>
					</div>
					<div>
						<div className="text-sm opacity-90 mb-2">Monthly Growth</div>
						<div className="text-3xl font-bold flex items-center">
							+{stats.monthlyGrowth}%<span className="ml-2 text-xl">📈</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CreatorStats;
