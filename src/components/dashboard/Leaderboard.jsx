import { useState, useEffect } from "react";
import { getLeaderboard } from "../../api/pointsApi";
import LoadingSpinner from "../common/LoadingSpinner";

const Leaderboard = ({ limit = 10, showTitle = true }) => {
	const [leaderboard, setLeaderboard] = useState([]);
	const [loading, setLoading] = useState(true);
	const [timeRange, setTimeRange] = useState("all-time"); // all-time, monthly, weekly

	useEffect(() => {
		loadLeaderboard();
	}, [timeRange]);

	const loadLeaderboard = async () => {
		setLoading(true);
		const result = await getLeaderboard(limit);
		if (result.success) {
			// Simulate time-based filtering (in real app, this would be API-based)
			const filteredData = result.data.map((user, index) => ({
				...user,
				rank: index + 1,
				monthlyPoints: Math.floor(Math.random() * 1000) + 500,
				weeklyPoints: Math.floor(Math.random() * 300) + 100,
			}));
			setLeaderboard(filteredData);
		}
		setLoading(false);
	};

	const getPointsByTimeRange = (user) => {
		switch (timeRange) {
			case "monthly":
				return user.monthlyPoints;
			case "weekly":
				return user.weeklyPoints;
			default:
				return user.points || 0;
		}
	};

	const getRankColor = (rank) => {
		if (rank === 1) return "bg-yellow-100 border-yellow-300";
		if (rank === 2) return "bg-gray-100 border-gray-300";
		if (rank === 3) return "bg-orange-100 border-orange-300";
		return "bg-[#EDF1D6] border-[#9DC08B]";
	};

	const getRankIcon = (rank) => {
		if (rank === 1) return "🥇";
		if (rank === 2) return "🥈";
		if (rank === 3) return "🥉";
		return `#${rank}`;
	};

	if (loading) return <LoadingSpinner />;

	return (
		<div className="bg-white rounded-2xl shadow-lg border border-[#9DC08B] overflow-hidden">
			{showTitle && (
				<div className="bg-[#40513B] p-6">
					<div className="flex items-center justify-between">
						<div>
							<h2 className="text-2xl font-bold text-white">🏆 Leaderboard</h2>
							<p className="text-[#9DC08B] mt-1">Top wildlife contributors</p>
						</div>
						<div className="flex space-x-2">
							{["all-time", "monthly", "weekly"].map((range) => (
								<button
									key={range}
									onClick={() => setTimeRange(range)}
									className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-all ${
										timeRange === range
											? "bg-[#609966] text-white"
											: "bg-[#EDF1D6] text-[#40513B] hover:bg-[#9DC08B]"
									}`}
								>
									{range.replace("-", " ")}
								</button>
							))}
						</div>
					</div>
				</div>
			)}

			<div className="p-6">
				<div className="space-y-3">
					{leaderboard.map((user) => (
						<div
							key={user.id}
							className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all hover:scale-[1.02] hover:shadow-md ${getRankColor(
								user.rank
							)}`}
						>
							<div className="flex items-center space-x-4">
								<div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#40513B] text-white font-bold text-sm">
									{getRankIcon(user.rank)}
								</div>
								<div className="flex items-center space-x-3">
									<div className="w-10 h-10 bg-gradient-to-r from-[#609966] to-[#40513B] rounded-full flex items-center justify-center text-white font-semibold">
										{user.displayName?.charAt(0) ||
											user.email?.charAt(0) ||
											"U"}
									</div>
									<div>
										<h3 className="font-semibold text-[#40513B]">
											{user.displayName || "Anonymous User"}
										</h3>
										<p className="text-sm text-[#609966]">
											{user.speciesSpotted || 12} species spotted
										</p>
									</div>
								</div>
							</div>

							<div className="text-right">
								<div className="text-2xl font-bold text-[#40513B]">
									{getPointsByTimeRange(user).toLocaleString()}
								</div>
								<div className="text-sm text-[#609966] font-medium">points</div>
							</div>
						</div>
					))}
				</div>

				{leaderboard.length === 0 && (
					<div className="text-center py-8">
						<div className="text-6xl mb-4">🌿</div>
						<h3 className="text-lg font-semibold text-[#40513B] mb-2">
							No contributors yet
						</h3>
						<p className="text-[#609966]">
							Be the first to share your wildlife sightings!
						</p>
					</div>
				)}

				<div className="mt-6 pt-4 border-t border-[#EDF1D6]">
					<div className="flex items-center justify-between text-sm text-[#40513B]">
						<span>Your rank: #24</span>
						<span>128 points to next rank</span>
					</div>
					<div className="mt-2 w-full bg-[#EDF1D6] rounded-full h-2">
						<div
							className="bg-gradient-to-r from-[#9DC08B] to-[#609966] h-2 rounded-full transition-all"
							style={{ width: "65%" }}
						></div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Leaderboard;
