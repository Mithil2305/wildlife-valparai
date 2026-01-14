import React, { useState, useEffect, useRef, useMemo } from "react";
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
	Zap,
	TrendingUp,
	Clock,
	Calendar,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { calculateLeaderboard, PRIZES } from "../services/leaderboard.js";
import { auth } from "../services/firebase.js";

// --- CONFETTI UTILITY (Internal lightweight implementation) ---
const fireConfetti = (x, y) => {
	const canvas = document.createElement("canvas");
	canvas.style.position = "fixed";
	canvas.style.pointerEvents = "none";
	canvas.style.left = "0";
	canvas.style.top = "0";
	canvas.style.width = "100%";
	canvas.style.height = "100%";
	canvas.style.zIndex = "100";
	document.body.appendChild(canvas);

	const ctx = canvas.getContext("2d");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	const particles = [];
	const colors = ["#FFD700", "#FF4500", "#335833", "#00BFFF", "#FF69B4"];

	for (let i = 0; i < 50; i++) {
		particles.push({
			x: x || window.innerWidth / 2,
			y: y || window.innerHeight / 2,
			vx: (Math.random() - 0.5) * 10,
			vy: (Math.random() - 1) * 10 - 5,
			color: colors[Math.floor(Math.random() * colors.length)],
			size: Math.random() * 5 + 2,
			life: 100,
		});
	}

	const animate = () => {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		let active = false;
		particles.forEach((p) => {
			if (p.life > 0) {
				active = true;
				p.x += p.vx;
				p.y += p.vy;
				p.vy += 0.2; // Gravity
				p.life -= 1;
				ctx.fillStyle = p.color;
				ctx.beginPath();
				ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
				ctx.fill();
			}
		});
		if (active) requestAnimationFrame(animate);
		else document.body.removeChild(canvas);
	};
	animate();
};

/**
 * COMPONENT: Skeleton Loader
 */
const LeaderboardSkeleton = () => (
	<div className="space-y-4 w-full">
		{[1, 2, 3, 4, 5].map((i) => (
			<div
				key={i}
				className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm animate-pulse"
			>
				<div className="w-10 h-10 bg-gray-200 rounded-xl" />
				<div className="w-12 h-12 bg-gray-200 rounded-full" />
				<div className="flex-1 space-y-2">
					<div className="h-4 bg-gray-200 rounded w-1/3" />
					<div className="h-3 bg-gray-100 rounded w-1/4" />
				</div>
				<div className="w-16 h-8 bg-gray-100 rounded-full" />
			</div>
		))}
	</div>
);

/**
 * COMPONENT: Bento Grid Item Wrapper
 */
const BentoBox = ({
	title,
	icon: Icon,
	children,
	className = "",
	accentColor = "text-gray-900",
	iconBgClass = "",
}) => {
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
 * COMPONENT: Point Item Row (Updated for Vibrancy)
 */
const PointItem = ({ label, points, icon: Icon, gradient }) => (
	<div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group">
		<div className="flex items-center gap-3">
			<div
				className={`p-2 rounded-lg bg-gradient-to-br ${gradient} text-white shadow-sm`}
			>
				<Icon size={16} />
			</div>
			<span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
				{label}
			</span>
		</div>
		<div className="flex items-center gap-1">
			<span className="text-sm font-bold text-gray-900">+{points}</span>
			<Zap className="w-3 h-3 text-yellow-500 fill-yellow-500" />
		</div>
	</div>
);

/**
 * COMPONENT: Leaderboard Item (With Motion)
 */
const LeaderboardItem = ({ user, isCurrentUser, rank, prevRank }) => {
	const isRising = prevRank && rank < prevRank;

	useEffect(() => {
		if (isCurrentUser && isRising) {
			fireConfetti();
		}
	}, [rank, prevRank, isCurrentUser, isRising]);

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
		<motion.div
			layout
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, scale: 0.95 }}
			transition={{ type: "spring", stiffness: 500, damping: 30 }}
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
				className={`flex items-center justify-center w-10 h-10 rounded-xl font-bold text-sm shadow-sm transition-transform group-hover:scale-110 relative ${rankStyle}`}
			>
				{rankIcon || <span>#{rank}</span>}
				{isRising && (
					<motion.div
						initial={{ scale: 0, opacity: 0 }}
						animate={{ scale: 1.5, opacity: 0 }}
						transition={{ duration: 0.8 }}
						className="absolute inset-0 rounded-xl bg-green-400 z-[-1]"
					/>
				)}
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
				<div className="flex items-center gap-2">
					<p className="text-xs text-gray-500 truncate font-medium">
						@{user.username}
					</p>
					{isRising && (
						<span className="text-[10px] font-bold text-green-600 flex items-center bg-green-100 px-1 rounded">
							<TrendingUp className="w-3 h-3 mr-0.5" /> Rising
						</span>
					)}
				</div>
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
		</motion.div>
	);
};

/**
 * COMPONENT: Leaderboard (Logic Wrapper + List UI)
 */
const Leaderboard = ({ showFull = false, timeFrame }) => {
	const [rankings, setRankings] = useState([]);
	const [prevRankings, setPrevRankings] = useState({});
	const [loading, setLoading] = useState(true);
	const [currentUserRank, setCurrentUserRank] = useState(null);
	const currentUser = auth.currentUser;

	// Store previous ranks to detect changes
	const updateRankings = (newRankings) => {
		const prevMap = {};
		// If we have existing rankings, map them by userId -> rank
		if (rankings.length > 0) {
			rankings.forEach((r) => {
				prevMap[r.userId] = r.rank;
			});
			setPrevRankings(prevMap);
		}
		setRankings(newRankings);
	};

	useEffect(() => {
		let isMounted = true;

		const fetchData = async () => {
			// Don't show loading spinner on background refreshes if we already have data
			if (rankings.length === 0) setLoading(true);

			try {
				// We pass timeFrame to the service, though the mock service might ignore it
				// This sets up the frontend for the feature
				const rankedUsers = await calculateLeaderboard(
					showFull ? 100 : 10,
					timeFrame
				);
				if (isMounted) {
					updateRankings(rankedUsers);

					if (currentUser) {
						const userRankIndex = rankedUsers.findIndex(
							(u) => u.userId === currentUser.uid
						);
						if (userRankIndex !== -1) {
							setCurrentUserRank(rankedUsers[userRankIndex]);
						}
					}
				}
			} catch (error) {
				console.error("Error fetching leaderboard:", error);
			} finally {
				if (isMounted) setLoading(false);
			}
		};

		fetchData();

		// Live Auto-Refresh every 30 seconds
		const interval = setInterval(fetchData, 30000);

		return () => {
			isMounted = false;
			clearInterval(interval);
		};
	}, [currentUser, showFull, timeFrame]);

	if (loading && rankings.length === 0) return <LeaderboardSkeleton />;

	const hasPodium = showFull && rankings.length >= 3;
	const topThree = rankings.slice(0, 3);
	const listToRender = hasPodium ? rankings.slice(3) : rankings;

	return (
		<div className="space-y-6">
			{/* Podium View */}
			{hasPodium && (
				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					className="grid grid-cols-3 gap-4 mb-8 items-end"
				>
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
				</motion.div>
			)}

			{/* List View with AnimatePresence for smooth transitions */}
			<div className="flex flex-col gap-2 relative">
				<AnimatePresence mode="popLayout">
					{listToRender.length > 0 ? (
						listToRender.map((user) => (
							<LeaderboardItem
								key={user.userId}
								user={user}
								rank={user.rank}
								prevRank={prevRankings[user.userId]}
								isCurrentUser={currentUser && user.userId === currentUser.uid}
							/>
						))
					) : (
						<div className="text-center py-10 text-gray-500">
							No participants yet. Be the first!
						</div>
					)}
				</AnimatePresence>
			</div>

			{/* Sticky User Stat */}
			{!showFull && currentUserRank && currentUserRank.rank > 10 && (
				<motion.div
					initial={{ y: 50, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					className="sticky bottom-4 mt-4"
				>
					<div className="bg-white/90 backdrop-blur-md shadow-lg border border-gray-200 rounded-2xl p-2">
						<p className="text-xs text-gray-500 ml-2 mb-1">Your Ranking</p>
						<LeaderboardItem
							user={currentUserRank}
							rank={currentUserRank.rank}
							prevRank={prevRankings[currentUserRank.userId]}
							isCurrentUser={true}
						/>
					</div>
				</motion.div>
			)}

			{!showFull && (
				<div className="pt-2 text-center">
					<a
						href="/leaderboard"
						className="inline-flex items-center gap-2 text-sm font-semibold text-[#335833] hover:text-[#2a482a] transition-colors group"
					>
						View Full Leaderboard{" "}
						<ChevronLeft className="w-4 h-4 rotate-180 transition-transform group-hover:translate-x-1" />
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
	const [timeFrame, setTimeFrame] = useState("weekly"); // 'weekly' | 'monthly'

	return (
		<div className="min-h-screen bg-[#F5F7F5] text-gray-900 font-sans selection:bg-[#335833] selection:text-white pb-12">
			{/* Background Decor */}
			<div className="fixed top-0 left-0 w-full h-96 bg-gradient-to-b from-[#335833]/10 to-transparent pointer-events-none" />

			<div className="container mx-auto max-w-6xl px-4 py-8 relative z-10">
				{/* Header & Toggle */}
				<div className="flex flex-col md:flex-row justify-between items-center mb-10 mt-8 gap-6">
					<div className="text-center md:text-left">
						<h5 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-3">
							Community <span className="text-[#335833]">Leaderboard</span>
						</h5>
						<p className="text-lg text-gray-600 max-w-2xl">
							Climb the ranks and win exclusive cash prizes.
						</p>
					</div>

					{/* Time Frame Toggle */}
					<div className="bg-white p-1.5 rounded-2xl shadow-sm border border-gray-200 flex items-center">
						<button
							onClick={() => setTimeFrame("weekly")}
							className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
								timeFrame === "weekly"
									? "bg-[#335833] text-white shadow-md"
									: "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
							}`}
						>
							<Clock className="w-4 h-4" /> Weekly
						</button>
						<button
							onClick={() => setTimeFrame("monthly")}
							className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
								timeFrame === "monthly"
									? "bg-[#335833] text-white shadow-md"
									: "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
							}`}
						>
							<Calendar className="w-4 h-4" /> Monthly
						</button>
					</div>
				</div>

				{/* BENTO GRID LAYOUT */}
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
					{/* LEFT COLUMN: Leaderboard List (Span 8) */}
					<div className="lg:col-span-7 xl:col-span-8 space-y-6">
						<div className="bg-white rounded-[2.5rem] shadow-sm border border-white/50 p-6 md:p-8 backdrop-blur-xl relative overflow-hidden">
							{/* Background accent for card */}
							<div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#335833]/5 to-transparent rounded-bl-[100%] pointer-events-none" />

							<Leaderboard showFull={true} timeFrame={timeFrame} />
						</div>
					</div>

					{/* RIGHT COLUMN: Info & Stats (Span 4) */}
					<div className="lg:col-span-5 xl:col-span-4 space-y-6 flex flex-col">
						{/* Prize Pool Teaser */}
						<BentoBox
							className="bg-gradient-to-br from-yellow-50 via-white to-white border-yellow-100"
							title="This Week's Pool"
							icon={Trophy}
							accentColor="text-yellow-600"
						>
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-gray-500 font-medium">
										Total Prizes
									</p>
									<p className="text-3xl font-black text-gray-900 tracking-tight">
										₹25,000
									</p>
								</div>
								<div className="bg-yellow-100 p-3 rounded-full animate-pulse">
									<DollarSign className="w-6 h-6 text-yellow-600" />
								</div>
							</div>
						</BentoBox>

						{/* Creator Points Rules - VIBRANT REDESIGN */}
						<BentoBox
							title="Creator Rewards"
							icon={Zap}
							accentColor="text-indigo-600"
							iconBgClass="bg-indigo-50"
						>
							<div className="space-y-2">
								<PointItem
									label="Create Blog Post"
									points={150}
									icon={Edit3}
									gradient="from-violet-500 to-indigo-500"
								/>
								<PointItem
									label="Create Social Post"
									points={100}
									icon={ImageIcon}
									gradient="from-pink-500 to-rose-500"
								/>
								<PointItem
									label="Get a Like"
									points={10}
									icon={Heart}
									gradient="from-red-400 to-red-600"
								/>
								<PointItem
									label="Get a Comment"
									points={10}
									icon={MessageCircle}
									gradient="from-blue-400 to-blue-600"
								/>
								<PointItem
									label="Post Shared"
									points={10}
									icon={Share2}
									gradient="from-emerald-400 to-emerald-600"
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
									label="Like a Post"
									points={10}
									icon={Heart}
									gradient="from-blue-400 to-cyan-400"
								/>
								<PointItem
									label="Comment"
									points={10}
									icon={MessageCircle}
									gradient="from-cyan-500 to-teal-500"
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
