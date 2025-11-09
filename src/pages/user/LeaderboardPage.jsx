import { useState, useEffect } from "react";
import { usePoints } from "../../hooks/usePoints";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const LeaderboardPage = () => {
	const [leaderboard, setLeaderboard] = useState([]);
	const [loading, setLoading] = useState(true);
	const [timeframe, setTimeframe] = useState("all-time");
	const [category, setCategory] = useState("overall");
	const { points: userPoints } = usePoints();

	useEffect(() => {
		fetchLeaderboard();
	}, [timeframe, category]);

	const fetchLeaderboard = async () => {
		setLoading(true);
		try {
			// Simulated data - replace with actual API call
			const mockData = [
				{
					id: 1,
					name: "Rajesh Kumar",
					points: 2450,
					sightings: 145,
					blogs: 23,
					avatar: "🦁",
					badge: "🏆",
					rank: 1,
				},
				{
					id: 2,
					name: "Priya Sharma",
					points: 2180,
					sightings: 132,
					blogs: 18,
					avatar: "🐯",
					badge: "🥈",
					rank: 2,
				},
				{
					id: 3,
					name: "Arjun Patel",
					points: 1950,
					sightings: 118,
					blogs: 15,
					avatar: "🐘",
					badge: "🥉",
					rank: 3,
				},
				{
					id: 4,
					name: "Lakshmi Iyer",
					points: 1720,
					sightings: 95,
					blogs: 22,
					avatar: "🦚",
					badge: "⭐",
					rank: 4,
				},
				{
					id: 5,
					name: "Vikram Singh",
					points: 1580,
					sightings: 89,
					blogs: 19,
					avatar: "🦅",
					badge: "⭐",
					rank: 5,
				},
				{
					id: 6,
					name: "Ananya Reddy",
					points: 1420,
					sightings: 76,
					blogs: 17,
					avatar: "🦋",
					badge: "⭐",
					rank: 6,
				},
				{
					id: 7,
					name: "Karthik Menon",
					points: 1290,
					sightings: 68,
					blogs: 14,
					avatar: "🐆",
					badge: "⭐",
					rank: 7,
				},
				{
					id: 8,
					name: "Divya Nair",
					points: 1150,
					sightings: 62,
					blogs: 12,
					avatar: "🦎",
					badge: "⭐",
					rank: 8,
				},
				{
					id: 9,
					name: "Ravi Krishnan",
					points: 1050,
					sightings: 58,
					blogs: 11,
					avatar: "🦜",
					badge: "⭐",
					rank: 9,
				},
				{
					id: 10,
					name: "Sneha Gupta",
					points: 980,
					sightings: 54,
					blogs: 10,
					avatar: "🐍",
					badge: "⭐",
					rank: 10,
				},
			];
			setLeaderboard(mockData);
		} catch (error) {
			console.error("Error fetching leaderboard:", error);
		} finally {
			setLoading(false);
		}
	};

	const timeframes = [
		{ value: "all-time", label: "All Time", icon: "🏆" },
		{ value: "monthly", label: "This Month", icon: "📅" },
		{ value: "weekly", label: "This Week", icon: "📆" },
	];

	const categories = [
		{ value: "overall", label: "Overall", icon: "⭐" },
		{ value: "sightings", label: "Sightings", icon: "📸" },
		{ value: "blogs", label: "Blogs", icon: "📝" },
	];

	if (loading) return <LoadingSpinner />;

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="bg-gradient-to-r from-[#40513B] to-[#609966] rounded-3xl p-8 text-white shadow-2xl">
				<div className="flex flex-col md:flex-row items-center justify-between">
					<div>
						<h1 className="text-4xl font-bold mb-2 flex items-center">
							<span className="text-5xl mr-3">🏆</span>
							Leaderboard
						</h1>
						<p className="text-white/80">Celebrating our top contributors</p>
					</div>
					<div className="mt-4 md:mt-0 bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center">
						<p className="text-sm text-white/70 mb-1">Your Rank</p>
						<p className="text-3xl font-bold">#--</p>
						<p className="text-sm text-white/70 mt-1">
							{userPoints || 0} points
						</p>
					</div>
				</div>
			</div>

			{/* Filters - Bento Style */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{/* Timeframe Filter */}
				<div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-[#9DC08B]/20">
					<p className="text-sm font-medium text-[#609966] mb-3">Timeframe</p>
					<div className="flex flex-wrap gap-2">
						{timeframes.map((tf) => (
							<button
								key={tf.value}
								onClick={() => setTimeframe(tf.value)}
								className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
									timeframe === tf.value
										? "bg-gradient-to-r from-[#609966] to-[#40513B] text-white shadow-lg scale-105"
										: "bg-[#EDF1D6] text-[#40513B] hover:bg-[#9DC08B]/30"
								}`}
							>
								<span>{tf.icon}</span>
								<span>{tf.label}</span>
							</button>
						))}
					</div>
				</div>

				{/* Category Filter */}
				<div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-[#9DC08B]/20">
					<p className="text-sm font-medium text-[#609966] mb-3">Category</p>
					<div className="flex flex-wrap gap-2">
						{categories.map((cat) => (
							<button
								key={cat.value}
								onClick={() => setCategory(cat.value)}
								className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
									category === cat.value
										? "bg-gradient-to-r from-[#609966] to-[#40513B] text-white shadow-lg scale-105"
										: "bg-[#EDF1D6] text-[#40513B] hover:bg-[#9DC08B]/30"
								}`}
							>
								<span>{cat.icon}</span>
								<span>{cat.label}</span>
							</button>
						))}
					</div>
				</div>
			</div>

			{/* Top 3 Podium - Special Bento Cards */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{leaderboard.slice(0, 3).map((user, index) => {
					const positions = [
						{
							bg: "from-yellow-400 to-yellow-600",
							height: "h-64",
							medal: "🥇",
							scale: "md:scale-110",
						},
						{
							bg: "from-gray-300 to-gray-500",
							height: "h-56",
							medal: "🥈",
							scale: "md:scale-100",
						},
						{
							bg: "from-orange-400 to-orange-600",
							height: "h-52",
							medal: "🥉",
							scale: "md:scale-95",
						},
					];
					const pos = positions[index];

					return (
						<div
							key={user.id}
							className={`${pos.scale} transition-all duration-500 hover:scale-105 ${index === 1 ? "md:order-first" : ""}`}
						>
							<div
								className={`bg-gradient-to-br ${pos.bg} ${pos.height} rounded-3xl p-6 text-white shadow-2xl flex flex-col items-center justify-center relative overflow-hidden`}
							>
								<div className="absolute top-0 left-0 right-0 h-1 bg-white/30"></div>
								<div className="text-6xl mb-3">{pos.medal}</div>
								<div className="w-20 h-20 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-4xl mb-3 shadow-lg">
									{user.avatar}
								</div>
								<h3 className="text-xl font-bold mb-2 text-center">
									{user.name}
								</h3>
								<div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 mb-3">
									<p className="text-3xl font-bold">{user.points}</p>
									<p className="text-xs">points</p>
								</div>
								<div className="flex space-x-4 text-sm">
									<div className="text-center">
										<p className="font-bold">{user.sightings}</p>
										<p className="text-xs text-white/80">Sightings</p>
									</div>
									<div className="text-center">
										<p className="font-bold">{user.blogs}</p>
										<p className="text-xs text-white/80">Blogs</p>
									</div>
								</div>
							</div>
						</div>
					);
				})}
			</div>

			{/* Rest of Leaderboard - Table Style Bento */}
			<div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-[#9DC08B]/20 overflow-hidden">
				<div className="p-6 bg-gradient-to-r from-[#EDF1D6] to-[#9DC08B]/20 border-b border-[#9DC08B]/20">
					<h2 className="text-2xl font-bold text-[#40513B] flex items-center">
						<span className="text-3xl mr-3">📊</span>
						Full Rankings
					</h2>
				</div>

				<div className="overflow-x-auto">
					<table className="w-full">
						<thead>
							<tr className="bg-[#EDF1D6] text-[#40513B]">
								<th className="px-6 py-4 text-left font-bold">Rank</th>
								<th className="px-6 py-4 text-left font-bold">Contributor</th>
								<th className="px-6 py-4 text-center font-bold">Points</th>
								<th className="px-6 py-4 text-center font-bold">Sightings</th>
								<th className="px-6 py-4 text-center font-bold">Blogs</th>
								<th className="px-6 py-4 text-center font-bold">Badge</th>
							</tr>
						</thead>
						<tbody>
							{leaderboard.map((user, index) => (
								<tr
									key={user.id}
									className="border-b border-[#9DC08B]/10 hover:bg-[#EDF1D6]/50 transition-colors"
								>
									<td className="px-6 py-4">
										<div className="flex items-center space-x-2">
											<div
												className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white ${
													index < 3
														? "bg-gradient-to-r from-[#609966] to-[#40513B]"
														: "bg-[#9DC08B]"
												}`}
											>
												#{user.rank}
											</div>
										</div>
									</td>
									<td className="px-6 py-4">
										<div className="flex items-center space-x-3">
											<div className="w-12 h-12 bg-gradient-to-br from-[#9DC08B] to-[#609966] rounded-xl flex items-center justify-center text-2xl shadow-md">
												{user.avatar}
											</div>
											<div>
												<p className="font-semibold text-[#40513B]">
													{user.name}
												</p>
												<p className="text-xs text-[#609966]">
													Active contributor
												</p>
											</div>
										</div>
									</td>
									<td className="px-6 py-4 text-center">
										<span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#EDF1D6] to-[#9DC08B]/30 rounded-xl font-bold text-[#40513B]">
											⭐ {user.points}
										</span>
									</td>
									<td className="px-6 py-4 text-center">
										<span className="text-[#40513B] font-medium">
											📸 {user.sightings}
										</span>
									</td>
									<td className="px-6 py-4 text-center">
										<span className="text-[#40513B] font-medium">
											📝 {user.blogs}
										</span>
									</td>
									<td className="px-6 py-4 text-center">
										<span className="text-3xl">{user.badge}</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{/* Achievement Cards */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-[#9DC08B]/20 hover:scale-105 transition-transform">
					<div className="flex items-center space-x-4">
						<div className="w-16 h-16 bg-gradient-to-r from-[#609966] to-[#40513B] rounded-2xl flex items-center justify-center text-3xl">
							👑
						</div>
						<div>
							<p className="text-sm text-[#609966]">Top Contributor</p>
							<p className="text-xl font-bold text-[#40513B]">
								{leaderboard[0]?.name}
							</p>
							<p className="text-sm text-[#609966]">
								{leaderboard[0]?.points} points
							</p>
						</div>
					</div>
				</div>

				<div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-[#9DC08B]/20 hover:scale-105 transition-transform">
					<div className="flex items-center space-x-4">
						<div className="w-16 h-16 bg-gradient-to-r from-[#9DC08B] to-[#609966] rounded-2xl flex items-center justify-center text-3xl">
							📸
						</div>
						<div>
							<p className="text-sm text-[#609966]">Most Sightings</p>
							<p className="text-xl font-bold text-[#40513B]">
								{leaderboard[0]?.sightings}
							</p>
							<p className="text-sm text-[#609966]">
								by {leaderboard[0]?.name}
							</p>
						</div>
					</div>
				</div>

				<div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-[#9DC08B]/20 hover:scale-105 transition-transform">
					<div className="flex items-center space-x-4">
						<div className="w-16 h-16 bg-gradient-to-r from-[#609966] to-[#40513B] rounded-2xl flex items-center justify-center text-3xl">
							📝
						</div>
						<div>
							<p className="text-sm text-[#609966]">Most Blogs</p>
							<p className="text-xl font-bold text-[#40513B]">
								{leaderboard[3]?.blogs}
							</p>
							<p className="text-sm text-[#609966]">
								by {leaderboard[3]?.name}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LeaderboardPage;
