import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { auth } from "../services/firebase.js";
import { calculateLeaderboard, PRIZES } from "../services/leaderboard.js";
import LoadingSpinner from "./LoadingSpinner.jsx";
import { AiFillTrophy, AiFillStar, AiFillDollarCircle } from "react-icons/ai";

const Leaderboard = ({ showFull = false }) => {
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
			const rankedUsers = await calculateLeaderboard(showFull ? 100 : 10);
			setRankings(rankedUsers);

			// Find current user's rank
			if (currentUser) {
				const userRankIndex = rankedUsers.findIndex(
					(u) => u.userId === currentUser.uid
				);
				if (userRankIndex !== -1) {
					setCurrentUserRank(rankedUsers[userRankIndex]);
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
			<div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4">
				<h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
					<AiFillTrophy className="text-yellow-500" />
					Leaderboard
				</h3>
				<LoadingSpinner />
			</div>
		);
	}

	const getRankIcon = (rank) => {
		if (rank === 1) return <AiFillTrophy className="text-yellow-500 w-6 h-6" />;
		if (rank === 2) return <AiFillTrophy className="text-gray-400 w-6 h-6" />;
		if (rank === 3) return <AiFillTrophy className="text-orange-600 w-6 h-6" />;
		if (rank === 4) return <AiFillTrophy className="text-orange-400 w-5 h-5" />;
		return null;
	};

	return (
		<div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
			{/* Header */}
			<div className="p-4 bg-gradient-to-r from-[#335833] to-[#4a7d4a] text-white">
				<div className="flex items-center gap-2 mb-2">
					<AiFillTrophy className="text-2xl" />
					<h3 className="text-lg font-bold">Leaderboard</h3>
				</div>
				<div className="flex items-center gap-2 text-sm bg-white/20 rounded-lg px-3 py-2">
					<AiFillDollarCircle className="text-yellow-300 text-lg" />
					<p className="text-white/90">
						Top 4 win cash prizes up to{" "}
						<span className="font-bold">₹25,000</span>
					</p>
				</div>
			</div>

			{/* Prize Pool Banner */}
			{showFull && (
				<div className="p-4 bg-yellow-50 border-b border-yellow-200">
					<h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
						<AiFillDollarCircle className="text-yellow-600 text-xl" />
						Cash Prize Pool
					</h4>
					<div className="grid grid-cols-2 gap-2 text-sm">
						{Object.entries(PRIZES).map(([rank, prize]) => (
							<div
								key={rank}
								className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-yellow-200"
							>
								<span className="font-semibold text-gray-700 flex items-center gap-2">
									{rank === "1" && <AiFillTrophy className="text-yellow-500" />}
									{rank === "2" && <AiFillTrophy className="text-gray-400" />}
									{rank === "3" && <AiFillTrophy className="text-orange-600" />}
									{rank === "4" && <AiFillTrophy className="text-orange-400" />}
									{rank}
									{rank === "1"
										? "st"
										: rank === "2"
										? "nd"
										: rank === "3"
										? "rd"
										: "th"}{" "}
									Place
								</span>
								<span className="font-bold text-green-600">{prize.label}</span>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Rankings */}
			<div className="p-4 space-y-2 max-h-96 overflow-y-auto">
				{rankings.map((user) => {
					const isCurrentUser = currentUser && user.userId === currentUser.uid;
					const hasPrize = user.rank <= 4;

					return (
						<div
							key={user.userId}
							className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
								isCurrentUser
									? "bg-green-50 border-2 border-[#335833] shadow-md"
									: hasPrize
									? "bg-yellow-50 border border-yellow-200"
									: "hover:bg-gray-50 border border-transparent"
							}`}
						>
							{/* Rank */}
							<div className="flex items-center justify-center w-10">
								{getRankIcon(user.rank) || (
									<span className="font-bold text-gray-600">#{user.rank}</span>
								)}
							</div>

							{/* Avatar */}
							<img
								src={
									user.profilePhotoUrl ||
									`https://ui-avatars.com/api/?name=${encodeURIComponent(
										user.name
									)}&size=40&background=335833&color=fff`
								}
								alt={user.name}
								className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
							/>

							{/* User Info */}
							<div className="flex-1 min-w-0">
								<p
									className={`font-semibold text-sm truncate ${
										isCurrentUser ? "text-[#335833]" : "text-gray-900"
									}`}
								>
									{user.name}
									{isCurrentUser && (
										<span className="ml-2 text-xs bg-[#335833] text-white px-2 py-0.5 rounded-full">
											You
										</span>
									)}
								</p>
								<p className="text-xs text-gray-500">@{user.username}</p>
							</div>

							{/* Points & Prize */}
							<div className="text-right">
								<div className="flex items-center gap-1 justify-end mb-1">
									<AiFillStar className="text-yellow-500 text-sm" />
									<span className="font-bold text-[#335833]">
										{user.points?.toLocaleString() || 0}
									</span>
								</div>
								{user.prize && (
									<div className="text-xs font-bold text-green-600">
										{user.prize.label}
									</div>
								)}
							</div>
						</div>
					);
				})}
			</div>

			{/* Current User Rank (if not in top 10) */}
			{!showFull && currentUserRank && currentUserRank.rank > 10 && (
				<div className="p-4 border-t border-gray-200 bg-gray-50">
					<p className="text-xs text-gray-500 mb-2">Your Rank:</p>
					<div className="flex items-center gap-3 p-3 rounded-xl bg-green-50 border-2 border-[#335833]">
						<div className="flex items-center justify-center w-10">
							<span className="font-bold text-[#335833]">
								#{currentUserRank.rank}
							</span>
						</div>
						<img
							src={
								currentUserRank.profilePhotoUrl ||
								`https://ui-avatars.com/api/?name=${encodeURIComponent(
									currentUserRank.name
								)}&size=40&background=335833&color=fff`
							}
							alt={currentUserRank.name}
							className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
						/>
						<div className="flex-1">
							<p className="font-semibold text-sm text-[#335833]">
								{currentUserRank.name}
							</p>
						</div>
						<div className="flex items-center gap-1">
							<AiFillStar className="text-yellow-500" />
							<span className="font-bold text-[#335833]">
								{currentUserRank.points?.toLocaleString() || 0}
							</span>
						</div>
					</div>
				</div>
			)}

			{/* View Full Button */}
			{!showFull && (
				<div className="p-4 border-t border-gray-200">
					<Link
						to="/leaderboard"
						className="block text-center text-sm font-semibold text-[#335833] hover:underline"
					>
						View Full Leaderboard →
					</Link>
				</div>
			)}
		</div>
	);
};

export default Leaderboard;
