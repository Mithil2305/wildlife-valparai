import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { calculateLeaderboard } from "../services/leaderboard.js";
import { AiOutlineTrophy, AiFillCrown } from "react-icons/ai";
import { HiSparkles } from "react-icons/hi";

const Leaderboard = () => {
	const [topUsers, setTopUsers] = useState([]);

	useEffect(() => {
		const fetchTopCreators = async () => {
			// Fetch top 5 for the widget
			const users = await calculateLeaderboard(5);
			setTopUsers(users);
		};
		fetchTopCreators();
	}, []);

	return (
		<div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100">
			<div className="flex items-center justify-between mb-6">
				<h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
					<AiOutlineTrophy className="text-yellow-500" />
					Top Creators
				</h3>
			</div>

			<div className="space-y-4">
				{topUsers.map((user, index) => (
					<div key={user.userId} className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div
								className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${
									index === 0
										? "bg-yellow-400"
										: index === 1
										? "bg-gray-400"
										: index === 2
										? "bg-orange-400"
										: "bg-gray-200 text-gray-600"
								}`}
							>
								{index === 0 ? <AiFillCrown /> : `#${index + 1}`}
							</div>
							<div className="flex items-center gap-2">
								<div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
									<img
										src={
											user.profilePhotoUrl ||
											`https://ui-avatars.com/api/?name=${encodeURIComponent(
												user.name
											)}&background=random`
										}
										alt={user.name}
										className="w-full h-full object-cover"
									/>
								</div>
								<span className="font-semibold text-sm text-gray-800 truncate max-w-[100px]">
									{user.name}
								</span>
							</div>
						</div>
						<div className="flex items-center gap-1 text-xs font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded-lg">
							<HiSparkles className="text-yellow-500" />
							{user.points >= 1000
								? `${(user.points / 1000).toFixed(1)}k`
								: user.points}
						</div>
					</div>
				))}
			</div>

			<Link
				to="/leaderboard"
				className="block w-full text-center mt-6 py-3 bg-gray-50 text-sm font-bold text-gray-600 rounded-xl hover:bg-gray-100 transition-colors"
			>
				View Full Leaderboard
			</Link>
		</div>
	);
};

export default Leaderboard;
