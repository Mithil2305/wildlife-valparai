import { useState, useEffect } from "react";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const AdminPerformance = () => {
	const [stats, setStats] = useState(null);
	const [loading, setLoading] = useState(true);
	const [timeRange, setTimeRange] = useState("month");

	useEffect(() => {
		const loadPerformanceData = () => {
			setLoading(true);
			// Simulate API call
			setTimeout(() => {
				setStats({
					overview: {
						totalUsers: 2845,
						activeUsers: 1892,
						totalContent: 8456,
						totalRevenue: 425000,
					},
					growth: {
						users: 12.5,
						content: 8.3,
						revenue: 18.2,
						engagement: 15.7,
					},
					engagement: {
						avgSessionTime: "8m 45s",
						bounceRate: "32%",
						pageViews: 145230,
						uniqueVisitors: 45892,
					},
					contentPerformance: {
						sightings: { total: 5234, approved: 4892, pending: 342 },
						blogs: { total: 2156, published: 2034, draft: 122 },
						audio: { total: 1066, published: 1015, pending: 51 },
					},
					topContributors: [
						{ name: "Dr. Priya Sharma", points: 8540, contributions: 65 },
						{ name: "Rajesh Kumar", points: 5420, contributions: 40 },
						{ name: "Arun Menon", points: 4230, contributions: 35 },
						{ name: "Meera Iyer", points: 3890, contributions: 38 },
						{ name: "Vikram Singh", points: 3250, contributions: 28 },
					],
					traffic: {
						direct: 35,
						search: 28,
						social: 22,
						referral: 15,
					},
					popularPages: [
						{ page: "Home", views: 45230, uniqueVisitors: 32145 },
						{ page: "Sightings", views: 38920, uniqueVisitors: 28456 },
						{ page: "Blogs", views: 32145, uniqueVisitors: 24892 },
						{ page: "About", views: 18456, uniqueVisitors: 15234 },
						{ page: "Contact", views: 12345, uniqueVisitors: 10234 },
					],
				});
				setLoading(false);
			}, 1000);
		};
		loadPerformanceData();
	}, [timeRange]);

	if (loading) {
		return <LoadingSpinner message="Loading performance data..." />;
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-[#EDF1D6] via-white to-[#9DC08B]/20 py-8">
			<div className="max-w-7xl mx-auto px-4">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-5xl font-bold text-[#40513B] mb-2">
						📈 Performance Analytics
					</h1>
					<p className="text-[#609966] text-lg">
						Detailed insights and analytics
					</p>
				</div>

				{/* Time Range Filter */}
				<div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-[#9DC08B]/20 p-6 mb-8">
					<div className="flex items-center justify-between">
						<h3 className="text-xl font-bold text-[#40513B]">Time Range</h3>
						<div className="flex space-x-2">
							{["today", "week", "month", "year"].map((range) => (
								<button
									key={range}
									onClick={() => setTimeRange(range)}
									className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
										timeRange === range
											? "bg-[#609966] text-white"
											: "bg-[#EDF1D6] text-[#609966] hover:bg-[#9DC08B]/30"
									}`}
								>
									{range.charAt(0).toUpperCase() + range.slice(1)}
								</button>
							))}
						</div>
					</div>
				</div>

				{/* Overview Stats */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
					<div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-[#9DC08B]/20 p-6">
						<div className="flex items-center justify-between mb-3">
							<div className="text-4xl">👥</div>
							<span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
								+{stats.growth.users}%
							</span>
						</div>
						<div className="text-2xl font-bold text-[#40513B]">
							{stats.overview.totalUsers.toLocaleString()}
						</div>
						<div className="text-sm text-[#609966]">Total Users</div>
						<div className="text-xs text-[#609966] mt-2">
							Active: {stats.overview.activeUsers.toLocaleString()}
						</div>
					</div>

					<div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-[#9DC08B]/20 p-6">
						<div className="flex items-center justify-between mb-3">
							<div className="text-4xl">📝</div>
							<span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
								+{stats.growth.content}%
							</span>
						</div>
						<div className="text-2xl font-bold text-[#40513B]">
							{stats.overview.totalContent.toLocaleString()}
						</div>
						<div className="text-sm text-[#609966]">Total Content</div>
					</div>

					<div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-[#9DC08B]/20 p-6">
						<div className="flex items-center justify-between mb-3">
							<div className="text-4xl">💰</div>
							<span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
								+{stats.growth.revenue}%
							</span>
						</div>
						<div className="text-2xl font-bold text-[#40513B]">
							₹{(stats.overview.totalRevenue / 1000).toFixed(0)}K
						</div>
						<div className="text-sm text-[#609966]">Total Revenue</div>
					</div>

					<div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-[#9DC08B]/20 p-6">
						<div className="flex items-center justify-between mb-3">
							<div className="text-4xl">📊</div>
							<span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
								+{stats.growth.engagement}%
							</span>
						</div>
						<div className="text-2xl font-bold text-[#40513B]">
							{(stats.engagement.pageViews / 1000).toFixed(1)}K
						</div>
						<div className="text-sm text-[#609966]">Page Views</div>
					</div>
				</div>

				{/* Main Analytics Grid */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
					{/* Engagement Metrics */}
					<div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border-2 border-[#9DC08B]/20 p-6">
						<h2 className="text-2xl font-bold text-[#40513B] mb-6">
							📊 Engagement Metrics
						</h2>
						<div className="space-y-4">
							<div className="p-4 bg-[#EDF1D6] rounded-xl">
								<div className="flex items-center justify-between mb-2">
									<span className="text-sm text-[#609966]">
										Avg. Session Time
									</span>
									<span className="font-bold text-[#40513B]">
										{stats.engagement.avgSessionTime}
									</span>
								</div>
								<div className="w-full bg-white rounded-full h-2">
									<div className="bg-gradient-to-r from-[#609966] to-[#40513B] h-2 rounded-full w-[75%]"></div>
								</div>
							</div>
							<div className="p-4 bg-[#EDF1D6] rounded-xl">
								<div className="flex items-center justify-between mb-2">
									<span className="text-sm text-[#609966]">Bounce Rate</span>
									<span className="font-bold text-[#40513B]">
										{stats.engagement.bounceRate}
									</span>
								</div>
								<div className="w-full bg-white rounded-full h-2">
									<div className="bg-gradient-to-r from-[#609966] to-[#40513B] h-2 rounded-full w-[32%]"></div>
								</div>
							</div>
							<div className="p-4 bg-[#EDF1D6] rounded-xl">
								<div className="flex items-center justify-between mb-2">
									<span className="text-sm text-[#609966]">
										Unique Visitors
									</span>
									<span className="font-bold text-[#40513B]">
										{stats.engagement.uniqueVisitors.toLocaleString()}
									</span>
								</div>
								<div className="w-full bg-white rounded-full h-2">
									<div className="bg-gradient-to-r from-[#609966] to-[#40513B] h-2 rounded-full w-[68%]"></div>
								</div>
							</div>
						</div>
					</div>

					{/* Content Performance */}
					<div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border-2 border-[#9DC08B]/20 p-6">
						<h2 className="text-2xl font-bold text-[#40513B] mb-6">
							📝 Content Performance
						</h2>
						<div className="space-y-4">
							<div className="p-4 bg-[#EDF1D6] rounded-xl">
								<div className="flex items-center justify-between mb-3">
									<div className="flex items-center space-x-2">
										<span className="text-2xl">📸</span>
										<span className="font-bold text-[#40513B]">Sightings</span>
									</div>
									<span className="text-2xl font-bold text-[#609966]">
										{stats.contentPerformance.sightings.total}
									</span>
								</div>
								<div className="flex items-center justify-between text-xs text-[#609966]">
									<span>
										✅ Approved: {stats.contentPerformance.sightings.approved}
									</span>
									<span>
										⏳ Pending: {stats.contentPerformance.sightings.pending}
									</span>
								</div>
							</div>
							<div className="p-4 bg-[#EDF1D6] rounded-xl">
								<div className="flex items-center justify-between mb-3">
									<div className="flex items-center space-x-2">
										<span className="text-2xl">✍️</span>
										<span className="font-bold text-[#40513B]">Blogs</span>
									</div>
									<span className="text-2xl font-bold text-[#609966]">
										{stats.contentPerformance.blogs.total}
									</span>
								</div>
								<div className="flex items-center justify-between text-xs text-[#609966]">
									<span>
										✅ Published: {stats.contentPerformance.blogs.published}
									</span>
									<span>📝 Draft: {stats.contentPerformance.blogs.draft}</span>
								</div>
							</div>
							<div className="p-4 bg-[#EDF1D6] rounded-xl">
								<div className="flex items-center justify-between mb-3">
									<div className="flex items-center space-x-2">
										<span className="text-2xl">🎵</span>
										<span className="font-bold text-[#40513B]">Audio</span>
									</div>
									<span className="text-2xl font-bold text-[#609966]">
										{stats.contentPerformance.audio.total}
									</span>
								</div>
								<div className="flex items-center justify-between text-xs text-[#609966]">
									<span>
										✅ Published: {stats.contentPerformance.audio.published}
									</span>
									<span>
										⏳ Pending: {stats.contentPerformance.audio.pending}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Traffic Sources & Top Contributors */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
					{/* Traffic Sources */}
					<div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border-2 border-[#9DC08B]/20 p-6">
						<h2 className="text-2xl font-bold text-[#40513B] mb-6">
							🌐 Traffic Sources
						</h2>
						<div className="space-y-4">
							{Object.entries(stats.traffic).map(([source, percentage]) => (
								<div key={source}>
									<div className="flex items-center justify-between mb-2">
										<span className="text-sm text-[#609966] capitalize">
											{source}
										</span>
										<span className="font-bold text-[#40513B]">
											{percentage}%
										</span>
									</div>
									<div className="w-full bg-[#EDF1D6] rounded-full h-3">
										<div
											className="bg-gradient-to-r from-[#609966] to-[#40513B] h-3 rounded-full transition-all"
											style={{ width: `${percentage}%` }}
										></div>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Top Contributors */}
					<div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border-2 border-[#9DC08B]/20 p-6">
						<h2 className="text-2xl font-bold text-[#40513B] mb-6">
							🏆 Top Contributors
						</h2>
						<div className="space-y-3">
							{stats.topContributors.map((contributor, index) => (
								<div
									key={index}
									className="flex items-center justify-between p-4 bg-[#EDF1D6] rounded-xl hover:bg-[#9DC08B]/20 transition-colors"
								>
									<div className="flex items-center space-x-3">
										<span className="text-2xl">
											{index === 0
												? "🥇"
												: index === 1
													? "🥈"
													: index === 2
														? "🥉"
														: "🏅"}
										</span>
										<div>
											<div className="font-bold text-[#40513B]">
												{contributor.name}
											</div>
											<div className="text-xs text-[#609966]">
												{contributor.contributions} contributions
											</div>
										</div>
									</div>
									<div className="text-right">
										<div className="font-bold text-[#609966]">
											⭐ {contributor.points}
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Popular Pages */}
				<div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border-2 border-[#9DC08B]/20 p-6">
					<h2 className="text-2xl font-bold text-[#40513B] mb-6">
						📄 Popular Pages
					</h2>
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-[#EDF1D6]">
								<tr>
									<th className="px-6 py-3 text-left text-sm font-bold text-[#40513B]">
										Page
									</th>
									<th className="px-6 py-3 text-left text-sm font-bold text-[#40513B]">
										Total Views
									</th>
									<th className="px-6 py-3 text-left text-sm font-bold text-[#40513B]">
										Unique Visitors
									</th>
									<th className="px-6 py-3 text-left text-sm font-bold text-[#40513B]">
										Engagement
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-[#EDF1D6]">
								{stats.popularPages.map((page, index) => (
									<tr
										key={index}
										className="hover:bg-[#EDF1D6]/50 transition-colors"
									>
										<td className="px-6 py-4">
											<div className="font-bold text-[#40513B]">
												{page.page}
											</div>
										</td>
										<td className="px-6 py-4">
											<div className="font-bold text-[#609966]">
												{page.views.toLocaleString()}
											</div>
										</td>
										<td className="px-6 py-4">
											<div className="text-[#609966]">
												{page.uniqueVisitors.toLocaleString()}
											</div>
										</td>
										<td className="px-6 py-4">
											<div className="w-full bg-[#EDF1D6] rounded-full h-2">
												<div
													className="bg-gradient-to-r from-[#609966] to-[#40513B] h-2 rounded-full"
													style={{
														width: `${(page.uniqueVisitors / page.views) * 100}%`,
													}}
												></div>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdminPerformance;
