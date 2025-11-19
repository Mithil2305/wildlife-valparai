import React from "react";
import { Link } from "react-router-dom";

// Mock data from the screenshot
const leaderboardData = [
	{ rank: 1, name: "Anand" },
	{ rank: 2, name: "Anand" },
	{ rank: 4, name: "Anand" },
	{ rank: 5, name: "Anand" },
	{ rank: "You", name: 87, isUser: true }, // Special case for "You"
	{ rank: 87, name: "Anand" },
];

const Leaderboard = () => {
	return (
		<div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
			<h3 className="text-lg font-bold text-gray-900 mb-4">Leaderboard</h3>
			<div className="space-y-3">
				{leaderboardData.map((item) => (
					<div
						key={item.rank}
						className={`flex justify-between items-center text-sm ${
							item.isUser ? "font-bold text-black" : "text-gray-600"
						}`}
					>
						<span
							className={`w-8 text-center ${
								item.isUser ? "text-black" : "text-gray-500"
							}`}
						>
							{item.rank}
						</span>
						{/* Swapped name and rank for "You" */}
						{item.isUser ? (
							<>
								<span className="flex-1">{item.rank}</span>
								<span>{item.name}</span>
							</>
						) : (
							<>
								<span className="flex-1">{item.name}</span>
								<span>{item.rank}</span>
							</>
						)}
					</div>
				))}
			</div>
			<Link
				to="/leaderboard"
				className="text-center block mt-4 text-sm font-medium text-[#335833] hover:underline"
			>
				View All
			</Link>
		</div>
	);
};

export default Leaderboard;
