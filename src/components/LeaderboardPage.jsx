import React, { useState, useEffect } from "react";
import {
	Trophy,
	Star,
	DollarSign,
	ChevronLeft,
	Crown,
	Medal,
	Heart,
	MessageCircle,
	Share2,
	Edit3,
	Image as ImageIcon,
	User,
} from "lucide-react";
import { calculateLeaderboard, PRIZES } from "../services/leaderboard.js";
import { auth } from "../services/firebase.js";

/**
 * COMPONENT: Loading Spinner
 */
const LoadingSpinner = () => (
	<div className="flex justify-center items-center p-12">
		<div className="relative w-12 h-12">
			<div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 rounded-full opacity-25"></div>
			<div className="absolute top-0 left-0 w-full h-full border-4 border-[#335833] rounded-full border-t-transparent animate-spin"></div>
		</div>
	</div>
);

/**
 * COMPONENT: Bento Grid Item Wrapper
 * Updated to accept explicit icon background class
 */
const BentoBox = ({
	title,
	icon: Icon,
	children,
	className = "",
	accentColor = "text-gray-900",
	iconBgClass = "", // Optional explicit background class
}) => {
	// Fallback logic for background if not provided
	const bgClass =
		iconBgClass || `bg-opacity-10 ${accentColor.replace("text-", "bg-")}`;

	return (
		<div
			className={`bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300 ${className}`}
		>
			{title && (
				<div className="px-6 pt-6 pb-2 flex items-center gap-3">
					{Icon && (
						<div className={`p-2 rounded-xl ${bgClass}`}>
							<Icon className={`w-5 h-5 ${accentColor}`} />
						</div>
					)}
					<h3 className="font-bold text-lg text-gray-900">{title}</h3>
				</div>
			)}
			<div className="p-6">{children}</div>
		</div>
	);
};

/**
 * COMPONENT: Point Item Row
 * Updated to use separate color props for better opacity handling
 */
const PointItem = ({ label, points, icon: Icon, iconColor, iconBg }) => (
	<div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group">
		<div className="flex items-center gap-3">
			<div className={`p-2 rounded-lg ${iconBg} ${iconColor}`}>
				<Icon size={16} />
			</div>
			<span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
				{label}
			</span>
		</div>
		<span className={`text-sm font-bold ${iconColor}`}>+{points} pts</span>
	</div>
);

/**
 * COMPONENT: Leaderboard Item
 */
const LeaderboardItem = ({ user, isCurrentUser, rank }) => {
	let rankIcon = null;
	let rankStyle = "text-gray-500 bg-gray-100";

	if (rank === 1) {
		rankIcon = (
			<Crown className="w-5 h-5 text-yellow-600" fill="currentColor" />
		);
		rankStyle = "bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200";
	} else if (rank === 2) {
		rankIcon = <Medal className="w-5 h-5 text-gray-500" />;
		rankStyle = "bg-gray-100 text-gray-700 ring-1 ring-gray-200";
	} else if (rank === 3) {
		rankIcon = <Medal className="w-5 h-5 text-orange-600" />;
		rankStyle = "bg-orange-100 text-orange-700 ring-1 ring-orange-200";
	}

	return (
		<div
			className={`group relative flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ease-out
        ${
					isCurrentUser
						? "bg-[#335833]/5 ring-1 ring-[#335833] shadow-sm z-10"
						: "hover:bg-white hover:shadow-md hover:scale-[1.01] bg-transparent"
				}
      `}
		>
			{/* Rank Indicator */}
			<div
				className={`flex items-center justify-center w-10 h-10 rounded-xl font-bold text-sm shadow-sm transition-transform group-hover:scale-110 ${rankStyle}`}
			>
				{rankIcon || <span>#{rank}</span>}
			</div>

			{/* Avatar */}
			<div className="relative">
				<img
					src={
						user.profilePhotoUrl ||
						`https://ui-avatars.com/api/?name=${encodeURIComponent(
							user.name
						)}&background=335833&color=fff`
					}
					alt={user.name}
					className="w-12 h-12 rounded-full border-2 border-white shadow-sm object-cover"
				/>
				{isCurrentUser && (
					<div className="absolute -bottom-1 -right-1 bg-[#335833] text-white text-[10px] px-1.5 py-0.5 rounded-full border border-white font-bold">
						YOU
					</div>
				)}
			</div>

			{/* User Info */}
			<div className="flex-1 min-w-0">
				<h4
					className={`font-bold truncate ${
						isCurrentUser ? "text-[#335833]" : "text-gray-900"
					}`}
				>
					{user.name}
				</h4>
				<p className="text-xs text-gray-500 truncate font-medium">
					@{user.username}
				</p>
			</div>

			{/* Stats */}
			<div className="text-right">
				<div className="flex items-center justify-end gap-1.5 mb-0.5">
					<div className="bg-yellow-100 p-1 rounded-full">
						<Star className="w-3 h-3 text-yellow-600 fill-yellow-600" />
					</div>
					<span className="font-bold text-gray-900 tabular-nums">
						{user.points?.toLocaleString()}
					</span>
				</div>
				{user.prize && (
					<div className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
						<DollarSign className="w-3 h-3" />
						{user.prize.label}
					</div>
				)}
			</div>
		</div>
	);
};

/**
 * COMPONENT: Leaderboard (Logic Wrapper + List UI)
 */
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

	if (loading) return <LoadingSpinner />;

	const hasPodium = showFull && rankings.length >= 3;
	const topThree = rankings.slice(0, 3);
	const listToRender = hasPodium ? rankings.slice(3) : rankings;

	return (
		<div className="space-y-6">
			{/* Podium View */}
			{hasPodium && (
				<div className="grid grid-cols-3 gap-4 mb-8 items-end">
					{/* 2nd Place */}
					<div className="order-1 flex flex-col items-center">
						<div className="relative mb-2">
							<img
								src={
									topThree[1].profilePhotoUrl ||
									`https://ui-avatars.com/api/?name=${encodeURIComponent(
										topThree[1].name
									)}&background=94a3b8&color=fff`
								}
								className="w-16 h-16 rounded-full border-4 border-gray-200 shadow-lg object-cover"
								alt=""
							/>
							<div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gray-200 text-gray-700 font-bold text-xs px-2 py-1 rounded-full shadow-sm">
								#2
							</div>
						</div>
						<div className="text-center">
							<p className="font-bold text-gray-900 text-sm truncate w-24">
								{topThree[1].name}
							</p>
							<p className="text-xs text-[#335833] font-bold">
								{topThree[1].points} pts
							</p>
						</div>
					</div>

					{/* 1st Place */}
					<div className="order-2 flex flex-col items-center -mt-8">
						<div className="relative mb-3">
							<Crown className="absolute -top-8 left-1/2 -translate-x-1/2 w-8 h-8 text-yellow-500 fill-yellow-500 animate-bounce" />
							<img
								src={
									topThree[0].profilePhotoUrl ||
									`https://ui-avatars.com/api/?name=${encodeURIComponent(
										topThree[0].name
									)}&background=eab308&color=fff`
								}
								className="w-24 h-24 rounded-full border-4 border-yellow-400 shadow-xl object-cover"
								alt=""
							/>
							<div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 font-bold text-sm px-3 py-1 rounded-full shadow-md">
								#1
							</div>
						</div>
						<div className="text-center">
							<p className="font-bold text-gray-900 truncate w-32">
								{topThree[0].name}
							</p>
							<p className="text-sm text-[#335833] font-extrabold">
								{topThree[0].points} pts
							</p>
							{topThree[0].prize && (
								<div className="mt-1 text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full inline-block">
									{topThree[0].prize.label}
								</div>
							)}
						</div>
					</div>

					{/* 3rd Place */}
					<div className="order-3 flex flex-col items-center">
						<div className="relative mb-2">
							<img
								src={
									topThree[2].profilePhotoUrl ||
									`https://ui-avatars.com/api/?name=${encodeURIComponent(
										topThree[2].name
									)}&background=ca8a04&color=fff`
								}
								className="w-16 h-16 rounded-full border-4 border-orange-200 shadow-lg object-cover"
								alt=""
							/>
							<div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-orange-200 text-orange-800 font-bold text-xs px-2 py-1 rounded-full shadow-sm">
								#3
							</div>
						</div>
						<div className="text-center">
							<p className="font-bold text-gray-900 text-sm truncate w-24">
								{topThree[2].name}
							</p>
							<p className="text-xs text-[#335833] font-bold">
								{topThree[2].points} pts
							</p>
						</div>
					</div>
				</div>
			)}

			{/* List View */}
			<div className="flex flex-col gap-2">
				{listToRender.length > 0 ? (
					listToRender.map((user) => (
						<LeaderboardItem
							key={user.userId}
							user={user}
							rank={user.rank}
							isCurrentUser={currentUser && user.userId === currentUser.uid}
						/>
					))
				) : (
					<div className="text-center py-10 text-gray-500">
						No participants yet. Be the first!
					</div>
				)}
			</div>

			{/* Sticky User Stat */}
			{!showFull && currentUserRank && currentUserRank.rank > 10 && (
				<div className="sticky bottom-4 mt-4">
					<div className="bg-white/90 backdrop-blur-md shadow-lg border border-gray-200 rounded-2xl p-2">
						<p className="text-xs text-gray-500 ml-2 mb-1">Your Ranking</p>
						<LeaderboardItem
							user={currentUserRank}
							rank={currentUserRank.rank}
							isCurrentUser={true}
						/>
					</div>
				</div>
			)}

			{!showFull && (
				<div className="pt-2 text-center">
					<a
						href="/leaderboard"
						className="inline-flex items-center gap-2 text-sm font-semibold text-[#335833] hover:text-[#2a482a] transition-colors"
					>
						View Full Leaderboard <ChevronLeft className="w-4 h-4 rotate-180" />
					</a>
				</div>
			)}
		</div>
	);
};

/**
 * PAGE: Main Leaderboard Page
 */
const LeaderboardPage = () => {
	return (
		<div className="min-h-screen bg-[#F5F7F5] text-gray-900 font-sans selection:bg-[#335833] selection:text-white pb-12">
			{/* Background Decor */}
			<div className="fixed top-0 left-0 w-full h-96 bg-gradient-to-b from-[#335833]/10 to-transparent pointer-events-none" />

			<div className="container mx-auto max-w-6xl px-4 py-8 relative z-10">
				{/* Hero Section */}
				<div className="mb-10 text-center md:text-left mt-8">
					<h5 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-3">
						Community <span className="text-[#335833]">Leaderboard</span>
					</h5>
					<p className="text-lg text-gray-600 max-w-2xl">
						Climb the ranks and win exclusive cash prizes up to{" "}
						<span className="font-bold text-gray-900">₹25,000</span> every
						month.
					</p>
				</div>

				{/* BENTO GRID LAYOUT */}
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
					{/* LEFT COLUMN: Leaderboard List (Span 8) */}
					<div className="lg:col-span-7 xl:col-span-8 space-y-6">
						<div className="bg-white rounded-[2.5rem] shadow-sm border border-white/50 p-6 md:p-8 backdrop-blur-xl">
							<Leaderboard showFull={true} />
						</div>
					</div>

					{/* RIGHT COLUMN: Info & Stats (Span 4) */}
					<div className="lg:col-span-5 xl:col-span-4 space-y-6 flex flex-col">
						{/* Prize Pool Card */}
						<BentoBox
							title="Prize Pool"
							icon={Trophy}
							accentColor="text-yellow-600"
							className="bg-gradient-to-br from-yellow-50 to-white border-yellow-100"
						>
							<div className="space-y-3">
								{Object.entries(PRIZES).map(([rank, prize]) => (
									<div
										key={rank}
										className="flex items-center justify-between bg-white/60 p-3 rounded-xl border border-yellow-100 shadow-sm"
									>
										<div className="flex items-center gap-3">
											<div
												className={`
                        w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                        ${
													rank === "1"
														? "bg-yellow-500 text-white shadow-yellow-200"
														: rank === "2"
														? "bg-gray-400 text-white"
														: rank === "3"
														? "bg-orange-500 text-white"
														: "bg-orange-300 text-white"
												}
                      `}
											>
												{rank}
											</div>
											<span className="text-gray-600 font-medium">Place</span>
										</div>
										<span className="font-bold text-gray-900 text-lg">
											{prize.label}
										</span>
									</div>
								))}
							</div>
						</BentoBox>

						{/* Creator Points Rules */}
						<BentoBox
							title="Creator Rewards"
							icon={Edit3}
							accentColor="text-[#335833]"
							iconBgClass="bg-[#335833]/10"
						>
							<div className="space-y-2">
								<PointItem
									label="Create Blog Post"
									points={150}
									icon={Edit3}
									iconColor="text-[#335833]"
									iconBg="bg-[#335833]/10"
								/>
								<PointItem
									label="Create Social Post"
									points={100}
									icon={ImageIcon}
									iconColor="text-[#335833]"
									iconBg="bg-[#335833]/10"
								/>
								<PointItem
									label="Get a Like"
									points={10}
									icon={Heart}
									iconColor="text-[#335833]"
									iconBg="bg-[#335833]/10"
								/>
								<PointItem
									label="Get a Comment"
									points={10}
									icon={MessageCircle}
									iconColor="text-[#335833]"
									iconBg="bg-[#335833]/10"
								/>
								<PointItem
									label="Post Shared"
									points={10}
									icon={Share2}
									iconColor="text-[#335833]"
									iconBg="bg-[#335833]/10"
								/>
							</div>
						</BentoBox>

						{/* Viewer Points Rules */}
						<BentoBox
							title="Viewer Rewards"
							icon={User}
							accentColor="text-blue-600"
							iconBgClass="bg-blue-600/10"
						>
							<div className="space-y-2">
								<PointItem
									label="Share a Post"
									points={30}
									icon={Share2}
									iconColor="text-blue-600"
									iconBg="bg-blue-600/10"
								/>
								<PointItem
									label="Like a Post"
									points={10}
									icon={Heart}
									iconColor="text-blue-600"
									iconBg="bg-blue-600/10"
								/>
								<PointItem
									label="Comment"
									points={10}
									icon={MessageCircle}
									iconColor="text-blue-600"
									iconBg="bg-blue-600/10"
								/>
							</div>
						</BentoBox>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LeaderboardPage;
