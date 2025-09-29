import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getUserPoints, getPointsHistory } from "../../api/pointsApi";
import LoadingSpinner from "../common/LoadingSpinner";

const PointsDisplay = ({ showHistory = false, compact = false }) => {
	const { currentUser } = useAuth();
	const [points, setPoints] = useState(0);
	const [history, setHistory] = useState([]);
	const [loading, setLoading] = useState(true);
	const [showFullHistory, setShowFullHistory] = useState(false);

	useEffect(() => {
		if (currentUser) {
			loadPointsData();
		}
	}, [currentUser]);

	const loadPointsData = async () => {
		setLoading(true);
		const pointsResult = await getUserPoints(currentUser.uid);
		if (pointsResult.success) {
			setPoints(pointsResult.points);
		}

		if (showHistory) {
			const historyResult = await getPointsHistory(currentUser.uid, 5);
			if (historyResult.success) {
				setHistory(historyResult.data);
			}
		}
		setLoading(false);
	};

	const getActionIcon = (action) => {
		const icons = {
			sighting_submission: "📸",
			sighting_approved: "✅",
			blog_published: "📝",
			blog_liked: "❤️",
			sighting_liked: "👍",
			daily_login: "🔔",
			profile_completion: "👤",
			content_shared: "🔄",
			comment_added: "💬",
		};
		return icons[action] || "⭐";
	};

	const getActionColor = (action) => {
		if (action.includes("approved") || action.includes("published"))
			return "text-green-600 bg-green-50";
		if (action.includes("liked")) return "text-pink-600 bg-pink-50";
		return "text-blue-600 bg-blue-50";
	};

	const formatAction = (action) => {
		return action
			.split("_")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ");
	};

	if (loading) return <LoadingSpinner />;

	if (compact) {
		return (
			<div className="bg-gradient-to-r from-[#9DC08B] to-[#609966] rounded-xl p-4 text-white shadow-lg">
				<div className="flex items-center justify-between">
					<div>
						<p className="text-sm opacity-90">Your Points</p>
						<p className="text-2xl font-bold">{points.toLocaleString()}</p>
					</div>
					<div className="text-3xl">⭐</div>
				</div>
			</div>
		);
	}

	return (
		<div className="bg-white rounded-2xl shadow-lg border border-[#9DC08B] overflow-hidden">
			{/* Points Summary */}
			<div className="bg-gradient-to-r from-[#40513B] to-[#609966] p-6 text-white">
				<div className="flex items-center justify-between">
					<div>
						<h2 className="text-2xl font-bold">🌟 Points Balance</h2>
						<p className="text-[#EDF1D6] opacity-90">
							Earn more by contributing content
						</p>
					</div>
					<div className="text-right">
						<div className="text-4xl font-bold">{points.toLocaleString()}</div>
						<div className="text-[#EDF1D6] opacity-90">total points</div>
					</div>
				</div>
			</div>

			{/* Estimated Earnings */}
			<div className="p-6 border-b border-[#EDF1D6]">
				<div className="grid grid-cols-3 gap-4 text-center">
					<div className="bg-[#EDF1D6] rounded-xl p-4">
						<div className="text-2xl text-[#40513B] font-bold">
							${(points / 1000).toFixed(2)}
						</div>
						<div className="text-sm text-[#609966]">Estimated Earnings</div>
					</div>
					<div className="bg-[#EDF1D6] rounded-xl p-4">
						<div className="text-2xl text-[#40513B] font-bold">12</div>
						<div className="text-sm text-[#609966]">This Month</div>
					</div>
					<div className="bg-[#EDF1D6] rounded-xl p-4">
						<div className="text-2xl text-[#40513B] font-bold">45</div>
						<div className="text-sm text-[#609966]">Total Posts</div>
					</div>
				</div>
			</div>

			{/* Recent Activity */}
			{showHistory && history.length > 0 && (
				<div className="p-6">
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-lg font-semibold text-[#40513B]">
							Recent Activity
						</h3>
						<button
							onClick={() => setShowFullHistory(!showFullHistory)}
							className="text-sm text-[#609966] hover:text-[#40513B] font-medium"
						>
							{showFullHistory ? "Show Less" : "View All"}
						</button>
					</div>

					<div className="space-y-3">
						{(showFullHistory ? history : history.slice(0, 3)).map(
							(transaction, index) => (
								<div
									key={index}
									className="flex items-center justify-between p-3 rounded-lg bg-[#EDF1D6] hover:bg-[#9DC08B] transition-colors"
								>
									<div className="flex items-center space-x-3">
										<div
											className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${getActionColor(transaction.action)}`}
										>
											{getActionIcon(transaction.action)}
										</div>
										<div>
											<div className="font-medium text-[#40513B]">
												{formatAction(transaction.action)}
											</div>
											<div className="text-xs text-[#609966]">
												{transaction.createdAt
													?.toDate?.()
													.toLocaleDateString() || "Recently"}
											</div>
										</div>
									</div>
									<div className="text-right">
										<div className="font-bold text-[#40513B]">
											+{transaction.points}
										</div>
										<div className="text-xs text-[#609966]">points</div>
									</div>
								</div>
							)
						)}
					</div>
				</div>
			)}

			{/* Progress to Next Goal */}
			<div className="p-6 bg-[#EDF1D6]">
				<div className="flex items-center justify-between text-sm text-[#40513B] mb-2">
					<span>Next Goal: 2,000 points</span>
					<span>{points}/2,000</span>
				</div>
				<div className="w-full bg-white rounded-full h-3">
					<div
						className="bg-gradient-to-r from-[#9DC08B] to-[#609966] h-3 rounded-full transition-all duration-500"
						style={{ width: `${(points / 2000) * 100}%` }}
					></div>
				</div>
				<div className="text-center mt-2">
					<span className="text-xs text-[#40513B]">
						{2000 - points} points to go! 🎯
					</span>
				</div>
			</div>
		</div>
	);
};

export default PointsDisplay;
