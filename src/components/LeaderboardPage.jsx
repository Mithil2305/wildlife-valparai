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
	Users,
	Zap,
	TrendingUp,
	Clock,
	Calendar,
	ArrowUpRight,
	ArrowDownRight,
	Info,
	Camera,
	PenLine,
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
 * COMPONENT: Bento Grid Item Wrapper (with motion)
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
		<motion.div
			initial={{ opacity: 0, y: 16 }}
			animate={{ opacity: 1, y: 0 }}
			whileHover={{ y: -2, scale: 1.002 }}
			transition={{ duration: 0.3, ease: "easeOut" }}
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
		</motion.div>
	);
};

/**
 * COMPONENT: PointsRow (compact for Ecosystem section)
 */
const PointsRow = ({ action, points, icon: Icon, color }) => (
	<div className="flex items-center justify-between p-3 rounded-2xl bg-white border border-gray-100 shadow-sm">
		<div className="flex items-center gap-3">
			<span
				className={`w-9 h-9 rounded-xl ${color} text-white flex items-center justify-center`}
			>
				<Icon size={16} />
			</span>
			<span className="text-sm font-semibold text-gray-900">{action}</span>
		</div>
		<span className="text-sm font-bold text-emerald-700">{points} pts</span>
	</div>
);

/**
 * COMPONENT: Points Rule Row (for compact Points Flow in bento)
 */
const PointsRuleRow = ({ item, tone }) => {
	const chipBg =
		tone === "viewer"
			? "bg-blue-50 text-blue-600"
			: "bg-emerald-50 text-emerald-600";
	return (
		<div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 border border-gray-100">
			<div className="flex items-center gap-2">
				<div className={`p-2 rounded-lg ${chipBg}`}>
					<item.icon className="w-4 h-4" />
				</div>
				<div className="min-w-0">
					<p className="text-sm font-semibold text-gray-900">{item.label}</p>
					<p className="text-[11px] text-gray-500">{item.trigger}</p>
				</div>
			</div>
			<div className="text-right text-[12px] font-bold space-y-0.5">
				<div className="text-emerald-700">{item.earn} pts</div>
				<div className="text-rose-600">{item.loss} pts</div>
			</div>
		</div>
	);
};

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

	const updateRankings = (newRankings) => {
		const prevMap = {};
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
			if (rankings.length === 0) setLoading(true);

			try {
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
			{hasPodium && (
				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					className="grid grid-cols-3 gap-4 mb-8 items-end"
				>
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
		<div className="min-h-screen bg-[#F5F7F5] text-gray-900 font-sans selection:bg-[#335833] selection:text-white pb-0">
			<div className="fixed top-0 left-0 w-full h-96 bg-gradient-to-b from-[#335833]/10 to-transparent pointer-events-none" />

			<div className="container mx-auto max-w-6xl px-4 py-8 relative z-10">
				<div className="flex flex-col md:flex-row justify-between items-center mb-10 mt-8 gap-6">
					<div className="text-center md:text-left space-y-3">
						<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-[#335833] text-xs font-bold uppercase tracking-wider">
							<span className="relative flex h-2 w-2">
								<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
								<span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
							</span>
							Live, auto-refreshing
						</div>
						<h5 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
							Community <span className="text-[#335833]">Leaderboard</span>
						</h5>
						<p className="text-lg text-gray-600 max-w-2xl">
							Climb the ranks, track your momentum, and win cash prizes.
						</p>
					</div>

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

				<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
					<div className="lg:col-span-7 xl:col-span-8 space-y-6">
						<div className="bg-white rounded-[2.5rem] shadow-sm border border-white/50 p-6 md:p-8 backdrop-blur-xl relative overflow-hidden">
							<div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#335833]/5 to-transparent rounded-bl-[100%] pointer-events-none" />
							<Leaderboard showFull={true} timeFrame={timeFrame} />
						</div>
					</div>

					<div className="lg:col-span-5 xl:col-span-4 space-y-6 flex flex-col">
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
							<div className="grid grid-cols-2 gap-3 mt-5 text-sm">
								{[1, 2, 3, 4].map((r) => (
									<div
										key={r}
										className="flex items-center justify-between bg-white rounded-2xl border border-yellow-100 px-3 py-2"
									>
										<span className="font-bold text-gray-700">{r}ᵗʰ</span>
										<span className="text-yellow-700 font-semibold">
											{PRIZES[r]?.label || "-"}
										</span>
									</div>
								))}
							</div>
						</BentoBox>

						<BentoBox
							title="Quick Tips"
							icon={User}
							accentColor="text-blue-600"
							iconBgClass="bg-blue-600/10"
						>
							<ul className="space-y-2 text-sm text-gray-600">
								<li>🚀 Stay active weekly to hold your spot.</li>
								<li>✨ Likes and comments both earn and can be reversed.</li>
								<li>🔔 Shares only add points—no loss on removal.</li>
								<li>
									📈 Check the badge beside your name to see if you’re rising.
								</li>
							</ul>
						</BentoBox>
					</div>
				</div>
			</div>

			{/* --- Points Ecosystem Section --- */}
			<section className="py-16 bg-white">
				<div className="container mx-auto max-w-6xl px-4">
					<div className="text-center mb-12">
						<h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
							The <span className="text-[#335833]">Points Ecosystem</span>
						</h2>
						<p className="text-gray-600 max-w-2xl mx-auto">
							Every interaction helps you climb the leaderboard. We believe in
							fair play, so actions like deleting content will reverse the
							points earned.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						{/* Creator Column */}
						<div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100">
							<h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
								<span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
									<Camera size={16} />
								</span>
								Earn as a Creator
							</h3>
							<div className="space-y-3">
								<PointsRow
									action="Publish a Blog"
									points="+150"
									icon={PenLine}
									color="bg-purple-500"
								/>
								<PointsRow
									action="Upload Photo + Audio"
									points="+100"
									icon={Camera}
									color="bg-blue-500"
								/>
								<PointsRow
									action="Receive a Like"
									points="+10"
									icon={Heart}
									color="bg-red-500"
								/>
								<PointsRow
									action="Receive a Comment"
									points="+10"
									icon={MessageCircle}
									color="bg-orange-500"
								/>
								<PointsRow
									action="Post gets Shared"
									points="+10"
									icon={Share2}
									color="bg-indigo-500"
								/>
							</div>
						</div>

						{/* Viewer Column */}
						<div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100">
							<h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
								<span className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
									<Users size={16} />
								</span>
								Earn as a Viewer
							</h3>
							<div className="space-y-3">
								<PointsRow
									action="Like a Post"
									points="+10"
									icon={Heart}
									color="bg-red-500"
								/>
								<PointsRow
									action="Comment on a Post"
									points="+10"
									icon={MessageCircle}
									color="bg-orange-500"
								/>
							</div>
							<div className="mt-8 p-4 bg-red-50 rounded-xl border border-red-100">
								<p className="text-sm text-red-600 font-semibold mb-1">
									Warning: Points Reversal
								</p>
								<p className="text-sm text-red-500 leading-relaxed">
									Deleting a post removes all points earned from it (including
									engagement points). Unliking or deleting a comment also
									deducts the points originally awarded.
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};

export default LeaderboardPage;
