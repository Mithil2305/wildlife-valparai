import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { auth } from "../services/firebase.js";
import { calculateLeaderboard } from "../services/leaderboardService.js";
import LoadingSpinner from "./LoadingSpinner.jsx";
import { FaTrophy, FaMedal } from "react-icons/fa";

const Leaderboard = () => {
	const [rankings, setRankings] = useState([]);
	const [loading, setLoading] = useState(true);
	const [currentUserRank, setCurrentUserRank] = useState(null);
	const currentUser = auth.currentUser;

	useEffect(() => {
		fetchLeaderboard();
	}, [currentUser]);

	const fetchLeaderboard = async () => {
		try {
			setLoading(true);
			const rankedUsers = await calculateLeaderboard();
			setRankings(rankedUsers.slice(0, 10)); // Top 10

			// Find current user's rank
			if (currentUser) {
				const userRankIndex = rankedUsers.findIndex(
					(u) => u.userId === currentUser.uid
				);
				if (userRankIndex !== -1) {
					setCurrentUserRank({
						rank: userRankIndex + 1,
						...rankedUsers[userRankIndex],
					});
				}
			}
		} catch (error) {
			console.error("Error fetching leaderboard:", error);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
				<h3 className="text-lg font-bold text-gray-900 mb-4">Leaderboard</h3>
				<LoadingSpinner />
			</div>
		);
	}

	const getRankIcon = (rank) => {
		if (rank === 1) return <FaTrophy className="text-yellow-500 w-5 h-5" />;
		if (rank === 2) return <FaMedal className="text-gray-400 w-5 h-5" />;
		if (rank === 3) return <FaMedal className="text-orange-600 w-5 h-5" />;
		return null;
	};

	return (
		<div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
			<h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
				<FaTrophy className="text-yellow-500" />
				Leaderboard
			</h3>
			<div className="space-y-3">
				{rankings.map((user, index) => {
					const rank = index + 1;
					const isCurrentUser = currentUser && user.userId === currentUser.uid;

					return (
						<div
							key={user.userId}
							className={`flex justify-between items-center p-2 rounded text-sm ${
								isCurrentUser
									? "bg-green-50 border border-green-200 font-bold"
									: "hover:bg-gray-50"
							}`}
						>
							<div className="flex items-center gap-2 flex-1">
								<span
									className={`w-8 text-center font-semibold ${
										rank <= 3 ? "text-lg" : ""
									}`}
								>
									{getRankIcon(rank) || `#${rank}`}
								</span>
								<div className="flex-1">
									<p
										className={`${
											isCurrentUser ? "text-green-700" : "text-gray-800"
										} font-medium truncate`}
									>
										{user.name}
									</p>
									<p className="text-xs text-gray-500">@{user.username}</p>
								</div>
							</div>
							<div className="text-right">
								<p className="font-bold text-[#335833]">
									{user.engagementScore}
								</p>
								<p className="text-xs text-gray-500">{user.posts} posts</p>
							</div>
						</div>
					);
				})}
			</div>

			{/* Current User Rank (if not in top 10) */}
			{currentUserRank && currentUserRank.rank > 10 && (
				<div className="mt-4 pt-4 border-t border-gray-200">
					<p className="text-xs text-gray-500 mb-2">Your Rank:</p>
					<div className="flex justify-between items-center p-2 rounded bg-green-50 border border-green-200 text-sm font-bold">
						<div className="flex items-center gap-2">
							<span className="w-8 text-center">#{currentUserRank.rank}</span>
							<span className="text-gray-800">{currentUserRank.name}</span>
						</div>
						<span className="text-[#335833]">
							{currentUserRank.engagementScore}
						</span>
					</div>
				</div>
			)}

			<Link
				to="/leaderboard"
				className="text-center block mt-4 text-sm font-medium text-[#335833] hover:underline"
			>
				View Full Leaderboard
			</Link>
		</div>
	);
};

export default Leaderboard;
