import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth, userDoc, getDoc } from "../services/firebase.js";
import { getAllPosts } from "../services/socialApi.js";
import { calculateLeaderboard } from "../services/leaderboard.js"; // Import leaderboard logic
import SocialCard from "./SocialCard.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import toast from "react-hot-toast";
import {
	AiOutlineHome,
	AiOutlineTrophy,
	AiOutlineHeart,
	AiOutlinePlus,
	AiFillCrown,
} from "react-icons/ai";
import { HiSparkles } from "react-icons/hi";

// --- Left Sidebar Navigation Item ---
const NavItem = ({ icon: Icon, label, active, onClick }) => (
	<button
		onClick={onClick}
		className={`w-full flex items-center gap-4 px-6 py-4 text-base font-semibold rounded-2xl transition-all duration-200 ${
			active
				? "bg-[#335833] text-white shadow-md"
				: "text-gray-500 hover:bg-green-50 hover:text-[#335833]"
		}`}
	>
		<Icon size={22} />
		<span>{label}</span>
	</button>
);

// --- Right Sidebar: Top Creators Widget ---
const TopCreatorsWidget = () => {
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

// --- Right Sidebar: Challenge/CTA Widget ---
const ChallengeWidget = ({ onJoin }) => (
	<div className="bg-[#1A331A] rounded-[24px] p-6 text-white relative overflow-hidden mt-6">
		{/* Decorative Circles */}
		<div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10" />
		<div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full -ml-10 -mb-10" />

		<h3 className="text-lg font-bold mb-2 relative z-10">Share Wildlife</h3>
		<p className="text-gray-300 text-sm mb-6 leading-relaxed relative z-10">
			Captured a rare bird or a stunning landscape? Share your moment with the
			Valparai community today.
		</p>

		<button
			onClick={onJoin}
			className="w-full py-3 bg-white text-[#1A331A] font-bold rounded-xl hover:bg-gray-100 transition-colors shadow-lg relative z-10 flex items-center justify-center gap-2"
		>
			<AiOutlinePlus strokeWidth={20} />
			Upload Now
		</button>
	</div>
);

// --- Main Page Component ---
const Socials = () => {
	const [posts, setPosts] = useState([]);
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [activeTab, setActiveTab] = useState("feed"); // 'feed' | 'favorites'
	const [displayCount, setDisplayCount] = useState(5);
	const navigate = useNavigate();
	const currentUser = auth.currentUser;

	useEffect(() => {
		fetchUserAndPosts();
	}, [currentUser]);

	const fetchUserAndPosts = async () => {
		try {
			setLoading(true);
			if (currentUser) {
				const userRef = userDoc(currentUser.uid);
				const userSnap = await getDoc(userRef);
				if (userSnap.exists()) {
					setUser(userSnap.data());
				}
			}
			const allPosts = await getAllPosts();
			// Filter for social posts (photos/audio) specifically
			const socialPosts = allPosts.filter((post) => post.type === "photoAudio");
			// Sort by newest first
			socialPosts.sort(
				(a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis()
			);
			setPosts(socialPosts);
		} catch (error) {
			console.error("Error:", error);
			toast.error("Failed to load posts");
		} finally {
			setLoading(false);
		}
	};

	const loadMore = () => setDisplayCount((prev) => prev + 5);

	if (loading) return <LoadingSpinner />;

	return (
		<div className="min-h-screen bg-[#FAFAFA] pt-6 pb-12 px-4 md:px-6">
			<div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
				{/* --- Left Sidebar (Navigation) --- */}
				<div className="hidden lg:block lg:col-span-3 xl:col-span-2 sticky top-24 h-fit">
					<div className="space-y-2">
						<NavItem
							icon={AiOutlineHome}
							label="Home"
							active={activeTab === "feed"}
							onClick={() => setActiveTab("feed")}
						/>
						<NavItem
							icon={AiOutlineHeart}
							label="Favorites"
							active={activeTab === "favorites"}
							onClick={() => navigate("/socials/favorites")}
						/>
						<NavItem
							icon={AiOutlineTrophy}
							label="Leaderboard"
							active={false}
							onClick={() => navigate("/leaderboard")}
						/>
					</div>
				</div>

				{/* --- Center Column (Feed) --- */}
				<div className="col-span-1 lg:col-span-6 xl:col-span-7">
					{/* Welcome Header (Mobile Only) */}
					<div className="lg:hidden mb-6 flex justify-between items-center">
						<h1 className="text-2xl font-bold text-gray-900">Social Feed</h1>
						{user?.accountType === "creator" && (
							<button
								onClick={() => navigate("/upload/content")}
								className="bg-[#335833] text-white p-2 rounded-full shadow-lg"
							>
								<AiOutlinePlus size={24} />
							</button>
						)}
					</div>

					{/* Posts Feed */}
					<div className="space-y-6">
						{posts.length === 0 ? (
							<div className="text-center py-20 bg-white rounded-[24px] shadow-sm border border-gray-100">
								<p className="text-gray-500">No posts yet.</p>
							</div>
						) : (
							posts
								.slice(0, displayCount)
								.map((post) => (
									<SocialCard
										key={post.id}
										post={post}
										onUpdate={fetchUserAndPosts}
									/>
								))
						)}

						{/* Load More */}
						{displayCount < posts.length && (
							<div className="flex justify-center pt-4">
								<button
									onClick={loadMore}
									className="bg-white border border-gray-200 text-gray-600 px-6 py-2 rounded-full text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm"
								>
									Load More
								</button>
							</div>
						)}
					</div>
				</div>

				{/* --- Right Sidebar (Widgets) --- */}
				<div className="hidden lg:block lg:col-span-3 sticky top-24 h-fit">
					<TopCreatorsWidget />

					<ChallengeWidget
						onJoin={() =>
							user?.accountType === "creator"
								? navigate("/upload/content")
								: toast("Only creators can upload content!")
						}
					/>
				</div>
			</div>
		</div>
	);
};

export default Socials;
