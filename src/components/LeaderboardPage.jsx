import React from "react";
import Leaderboard from "../components/Leaderboard.jsx";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const LeaderboardPage = () => {
	const navigate = useNavigate();

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-gray-50 py-8">
			<div className="container mx-auto max-w-4xl px-4">
				<button
					onClick={() => navigate(-1)}
					className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 font-medium"
				>
					<AiOutlineArrowLeft size={20} />
					Back
				</button>

				<div className="mb-8">
					<h1 className="text-4xl font-bold text-gray-900 mb-2">
						Community Leaderboard
					</h1>
					<p className="text-gray-600">
						Compete with creators and viewers to win amazing cash prizes!
					</p>
				</div>

				<Leaderboard showFull={true} />

				{/* Points Guide */}
				<div className="mt-8 bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
					<h3 className="text-lg font-bold text-gray-900 mb-4">
						How to Earn Points
					</h3>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{/* Creator Points */}
						<div>
							<h4 className="font-semibold text-[#335833] mb-3 flex items-center gap-2">
								<span className="w-2 h-2 bg-[#335833] rounded-full"></span>
								As a Creator
							</h4>
							<ul className="space-y-2 text-sm text-gray-700">
								<li className="flex justify-between">
									<span>Create social post</span>
									<span className="font-bold text-[#335833]">+100 pts</span>
								</li>
								<li className="flex justify-between">
									<span>Create blog post</span>
									<span className="font-bold text-[#335833]">+150 pts</span>
								</li>
								<li className="flex justify-between">
									<span>Receive like</span>
									<span className="font-bold text-[#335833]">+10 pts</span>
								</li>
								<li className="flex justify-between">
									<span>Receive comment</span>
									<span className="font-bold text-[#335833]">+10 pts</span>
								</li>
								<li className="flex justify-between">
									<span>Post shared</span>
									<span className="font-bold text-[#335833]">+10 pts</span>
								</li>
							</ul>
						</div>

						{/* Viewer Points */}
						<div>
							<h4 className="font-semibold text-blue-600 mb-3 flex items-center gap-2">
								<span className="w-2 h-2 bg-blue-600 rounded-full"></span>
								As a Viewer
							</h4>
							<ul className="space-y-2 text-sm text-gray-700">
								<li className="flex justify-between">
									<span>Like a post</span>
									<span className="font-bold text-blue-600">+10 pts</span>
								</li>
								<li className="flex justify-between">
									<span>Comment on post</span>
									<span className="font-bold text-blue-600">+10 pts</span>
								</li>
								<li className="flex justify-between">
									<span>Share a post</span>
									<span className="font-bold text-blue-600">+30 pts</span>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LeaderboardPage;
