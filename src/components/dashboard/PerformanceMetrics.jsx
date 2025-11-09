import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import LoadingSpinner from "../common/LoadingSpinner";

const PerformanceMetrics = ({ userId, timeRange = "month" }) => {
	const { currentUser } = useAuth();
	const [metrics, setMetrics] = useState({
		engagement: {
			views: 0,
			likes: 0,
			comments: 0,
			shares: 0,
		},
		growth: {
			viewsGrowth: 0,
			likesGrowth: 0,
			followersGrowth: 0,
		},
		quality: {
			approvalRate: 0,
			avgRating: 0,
			responseTime: 0,
		},
		timeline: [],
	});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (currentUser || userId) {
			loadMetrics();
		}
	}, [currentUser, userId, timeRange]);

	const loadMetrics = async () => {
		setLoading(true);
		// Simulate API call
		setTimeout(() => {
			setMetrics({
				engagement: {
					views: 1542,
					likes: 389,
					comments: 127,
					shares: 54,
				},
				growth: {
					viewsGrowth: 23,
					likesGrowth: 15,
					followersGrowth: 8,
				},
				quality: {
					approvalRate: 95,
					avgRating: 4.6,
					responseTime: 2.5,
				},
				timeline: [
					{ date: "Week 1", views: 280, likes: 65 },
					{ date: "Week 2", views: 340, likes: 78 },
					{ date: "Week 3", views: 420, likes: 95 },
					{ date: "Week 4", views: 502, likes: 151 },
				],
			});
			setLoading(false);
		}, 1000);
	};

	if (loading) {
		return <LoadingSpinner message="Loading performance metrics..." />;
	}

	const engagementMetrics = [
		{
			label: "Total Views",
			value: metrics.engagement.views,
			icon: "👁️",
			color: "from-blue-500 to-blue-600",
		},
		{
			label: "Total Likes",
			value: metrics.engagement.likes,
			icon: "❤️",
			color: "from-pink-500 to-pink-600",
		},
		{
			label: "Comments",
			value: metrics.engagement.comments,
			icon: "💬",
			color: "from-green-500 to-green-600",
		},
		{
			label: "Shares",
			value: metrics.engagement.shares,
			icon: "🔄",
			color: "from-purple-500 to-purple-600",
		},
	];

	const growthMetrics = [
		{ label: "Views Growth", value: metrics.growth.viewsGrowth, icon: "📈" },
		{ label: "Likes Growth", value: metrics.growth.likesGrowth, icon: "📊" },
		{
			label: "Followers Growth",
			value: metrics.growth.followersGrowth,
			icon: "👥",
		},
	];

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border-2 border-[#9DC08B]/20">
				<h2 className="text-3xl font-bold text-[#40513B] mb-2 flex items-center">
					<span className="mr-3 text-4xl">📊</span>
					Performance Metrics
				</h2>
				<p className="text-[#609966]">
					Comprehensive analysis of your content performance
				</p>
			</div>

			{/* Engagement Metrics Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{engagementMetrics.map((metric, index) => (
					<div
						key={index}
						className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-2 border-[#9DC08B]/20 hover:scale-105 transition-transform"
					>
						<div className="flex items-start justify-between mb-4">
							<div className="text-4xl">{metric.icon}</div>
						</div>
						<div className="text-3xl font-bold text-[#40513B] mb-1">
							{metric.value.toLocaleString()}
						</div>
						<div className="text-sm text-[#609966]">{metric.label}</div>
					</div>
				))}
			</div>

			{/* Growth & Quality Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Growth Metrics */}
				<div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 border-[#9DC08B]/20">
					<h3 className="text-xl font-bold text-[#40513B] mb-4 flex items-center">
						<span className="mr-2">📈</span>
						Growth Trends
					</h3>
					<div className="space-y-4">
						{growthMetrics.map((metric, index) => (
							<div key={index} className="flex items-center justify-between">
								<div className="flex items-center space-x-3">
									<span className="text-2xl">{metric.icon}</span>
									<span className="text-[#40513B] font-medium">
										{metric.label}
									</span>
								</div>
								<div className="flex items-center space-x-2">
									<div
										className={`text-2xl font-bold ${
											metric.value > 0 ? "text-green-600" : "text-red-600"
										}`}
									>
										{metric.value > 0 ? "+" : ""}
										{metric.value}%
									</div>
									<span className="text-xl">
										{metric.value > 0 ? "↗️" : "↘️"}
									</span>
								</div>
							</div>
						))}
					</div>

					{/* Growth Chart Visualization */}
					<div className="mt-6 pt-6 border-t-2 border-[#EDF1D6]">
						<h4 className="text-sm font-bold text-[#40513B] mb-3">
							Weekly Performance
						</h4>
						<div className="flex items-end justify-between h-32 space-x-2">
							{metrics.timeline.map((week, index) => (
								<div key={index} className="flex-1 flex flex-col items-center">
									<div className="w-full bg-[#EDF1D6] rounded-t-lg relative flex items-end">
										<div
											className="w-full bg-gradient-to-t from-[#609966] to-[#40513B] rounded-t-lg transition-all hover:opacity-80"
											style={{
												height: `${(week.views / 600) * 100}%`,
												minHeight: "20px",
											}}
										/>
									</div>
									<span className="text-xs text-[#609966] mt-2 font-medium">
										{week.date}
									</span>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Quality Metrics */}
				<div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 border-[#9DC08B]/20">
					<h3 className="text-xl font-bold text-[#40513B] mb-4 flex items-center">
						<span className="mr-2">⭐</span>
						Quality Scores
					</h3>

					{/* Approval Rate */}
					<div className="mb-6">
						<div className="flex items-center justify-between mb-2">
							<span className="text-[#40513B] font-medium">Approval Rate</span>
							<span className="text-2xl font-bold text-[#609966]">
								{metrics.quality.approvalRate}%
							</span>
						</div>
						<div className="w-full bg-[#EDF1D6] rounded-full h-3">
							<div
								className="bg-gradient-to-r from-[#609966] to-[#40513B] h-3 rounded-full transition-all"
								style={{ width: `${metrics.quality.approvalRate}%` }}
							/>
						</div>
					</div>

					{/* Average Rating */}
					<div className="mb-6">
						<div className="flex items-center justify-between mb-2">
							<span className="text-[#40513B] font-medium">Average Rating</span>
							<div className="flex items-center space-x-1">
								{[1, 2, 3, 4, 5].map((star) => (
									<span
										key={star}
										className={`text-xl ${
											star <= Math.floor(metrics.quality.avgRating)
												? "text-yellow-500"
												: "text-gray-300"
										}`}
									>
										⭐
									</span>
								))}
								<span className="ml-2 text-lg font-bold text-[#609966]">
									{metrics.quality.avgRating.toFixed(1)}
								</span>
							</div>
						</div>
					</div>

					{/* Response Time */}
					<div className="bg-[#EDF1D6] rounded-xl p-4">
						<div className="flex items-center justify-between">
							<div>
								<div className="text-sm text-[#609966] mb-1">
									Avg. Response Time
								</div>
								<div className="text-2xl font-bold text-[#40513B]">
									{metrics.quality.responseTime}h
								</div>
							</div>
							<div className="text-4xl">⚡</div>
						</div>
					</div>

					{/* Quality Badges */}
					<div className="mt-6 pt-6 border-t-2 border-[#EDF1D6]">
						<h4 className="text-sm font-bold text-[#40513B] mb-3">
							Earned Badges
						</h4>
						<div className="grid grid-cols-3 gap-2">
							<div className="text-center p-2 bg-[#EDF1D6] rounded-lg hover:scale-110 transition-transform cursor-pointer">
								<div className="text-2xl mb-1">🏆</div>
								<div className="text-xs text-[#609966]">Top Creator</div>
							</div>
							<div className="text-center p-2 bg-[#EDF1D6] rounded-lg hover:scale-110 transition-transform cursor-pointer">
								<div className="text-2xl mb-1">🌟</div>
								<div className="text-xs text-[#609966]">Quality</div>
							</div>
							<div className="text-center p-2 bg-[#EDF1D6] rounded-lg hover:scale-110 transition-transform cursor-pointer">
								<div className="text-2xl mb-1">🔥</div>
								<div className="text-xs text-[#609966]">Streak</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Detailed Timeline */}
			<div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 border-[#9DC08B]/20">
				<h3 className="text-xl font-bold text-[#40513B] mb-4 flex items-center">
					<span className="mr-2">📅</span>
					Performance Timeline
				</h3>
				<div className="space-y-3">
					{metrics.timeline.map((week, index) => (
						<div
							key={index}
							className="flex items-center justify-between p-4 bg-[#EDF1D6] rounded-xl hover:bg-[#9DC08B]/30 transition-colors"
						>
							<div className="flex-1">
								<div className="font-bold text-[#40513B] mb-2">{week.date}</div>
								<div className="flex space-x-6 text-sm text-[#609966]">
									<span>👁️ {week.views} views</span>
									<span>❤️ {week.likes} likes</span>
									<span>
										📊{" "}
										{index > 0
											? `+${Math.round(
													((week.views - metrics.timeline[index - 1].views) /
														metrics.timeline[index - 1].views) *
														100
												)}%`
											: "N/A"}
									</span>
								</div>
							</div>
							<div className="text-right">
								<div className="w-24 bg-white rounded-full h-2 mb-1">
									<div
										className="bg-gradient-to-r from-[#609966] to-[#40513B] h-2 rounded-full"
										style={{ width: `${(week.views / 600) * 100}%` }}
									/>
								</div>
								<span className="text-xs text-[#609966]">Performance</span>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Insights & Recommendations */}
			<div className="bg-gradient-to-r from-[#609966] to-[#40513B] rounded-2xl p-6 shadow-xl text-white">
				<h3 className="text-xl font-bold mb-4 flex items-center">
					<span className="mr-2">💡</span>
					Insights & Recommendations
				</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
						<div className="text-3xl mb-2">🎯</div>
						<h4 className="font-bold mb-1">Peak Engagement Time</h4>
						<p className="text-sm opacity-90">
							Your content performs best on weekends between 6-9 PM
						</p>
					</div>
					<div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
						<div className="text-3xl mb-2">📸</div>
						<h4 className="font-bold mb-1">Content Suggestion</h4>
						<p className="text-sm opacity-90">
							Wildlife sightings get 2x more engagement than blogs
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PerformanceMetrics;
