import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
	HiDocumentText,
	HiHeart,
	HiChatAlt,
	HiTrendingUp,
	HiStar,
	HiPhotograph,
	HiPencilAlt,
	HiTrash,
	HiEye,
	HiSparkles,
	HiLightningBolt,
	HiFire,
	HiChartBar,
} from "react-icons/hi";
import { getAuthInstance, getUserDoc, getDoc } from "../services/firebase.js";
import { getCreatorPosts, deleteBlogPost } from "../services/uploadPost.js";
import { calculateLeaderboard } from "../services/leaderboardService.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import toast from "react-hot-toast";

// Animation Variants
const containerVariants = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: { staggerChildren: 0.08 },
	},
};

const itemVariants = {
	hidden: { opacity: 0, y: 30 },
	show: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.5, ease: "easeOut" },
	},
};

// Helper to strip HTML
const stripHtml = (html) => {
	if (!html) return "";
	const tmp = document.createElement("DIV");
	tmp.innerHTML = html;
	return tmp.textContent || tmp.innerText || "";
};

// Modern Stat Card Component
const StatCard = ({ icon: Icon, title, value, subtitle, gradient, iconBg }) => (
	<motion.div
		variants={itemVariants}
		whileHover={{ y: -5, scale: 1.02 }}
		className="relative bg-white rounded-2xl p-6 shadow-lg border border-gray-100 overflow-hidden group"
	>
		{/* Gradient Background */}
		<div
			className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity ${gradient}`}
		/>

		{/* Content */}
		<div className="relative z-10">
			<div className="flex items-start justify-between mb-4">
				<div className={`p-3 rounded-xl ${iconBg} shadow-lg`}>
					<Icon className="text-white text-2xl" />
				</div>
			</div>
			<p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
			<p className="text-4xl font-bold text-gray-900 mb-1">{value}</p>
			{subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
		</div>

		{/* Decorative Element */}
		<div className="absolute -right-4 -bottom-4 w-24 h-24 bg-gradient-to-br from-gray-100 to-transparent rounded-full opacity-50" />
	</motion.div>
);

// Large Feature Card Component
const FeatureCard = ({ children, className = "" }) => (
	<motion.div
		variants={itemVariants}
		className={`bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden ${className}`}
	>
		{children}
	</motion.div>
);

const CreatorDashboard = () => {
	const [posts, setPosts] = useState([]);
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [userRank, setUserRank] = useState(null);
	const [engagementScore, setEngagementScore] = useState(0);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			const auth = getAuthInstance();
			const currentUser = auth?.currentUser;
			if (currentUser) {
				try {
					const userRef = await getUserDoc(currentUser.uid);
					const userSnap = await getDoc(userRef);
					if (userSnap.exists()) {
						const userData = userSnap.data();
						setUser(userData);

						if (userData.accountType === "admin") {
							navigate("/dashboard/admin");
							return;
						}

						if (userData.accountType !== "creator") {
							toast.error("You need to be a creator to access this page");
							navigate("/profile");
							return;
						}
					}

					const creatorPosts = await getCreatorPosts(currentUser.uid);
					setPosts(creatorPosts);

					const totalLikes = creatorPosts.reduce(
						(sum, post) => sum + (post.likeCount || 0),
						0
					);
					const totalComments = creatorPosts.reduce(
						(sum, post) => sum + (post.commentCount || 0),
						0
					);
					const score =
						creatorPosts.length * 10 + totalLikes * 2 + totalComments * 3;
					setEngagementScore(score);

					const leaderboard = await calculateLeaderboard();
					const rankIndex = leaderboard.findIndex(
						(u) => u.userId === currentUser.uid
					);
					if (rankIndex !== -1) {
						setUserRank(rankIndex + 1);
					}
				} catch (error) {
					console.error("Error fetching data:", error);
					toast.error("Failed to load dashboard data");
				}
			}
			setLoading(false);
		};
		fetchData();
	}, [navigate]);

	const totalLikes = posts.reduce(
		(sum, post) => sum + (post.likeCount || 0),
		0
	);
	const totalComments = posts.reduce(
		(sum, post) => sum + (post.commentCount || 0),
		0
	);

	const handleDelete = async (postId) => {
		if (window.confirm("Are you sure you want to delete this post?")) {
			try {
				await deleteBlogPost(postId);
				setPosts(posts.filter((post) => post.id !== postId));
				toast.success("Post deleted successfully");
			} catch (error) {
				toast.error("Failed to delete post");
			}
		}
	};

	if (loading) return <LoadingSpinner />;
	if (!user)
		return <div className="p-10 text-center">Please log in to continue.</div>;

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-gray-50 p-4 md:p-8">
			<div className="container mx-auto max-w-7xl">
				{/* Header */}
				<motion.header
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					className="mb-8"
				>
					<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
						<div>
							<h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
								Creator Dashboard
							</h1>
							<p className="text-gray-600 flex items-center gap-2">
								<HiSparkles className="text-[#335833]" />
								Welcome back,{" "}
								<span className="font-semibold text-[#335833]">
									{user.name}
								</span>
							</p>
						</div>
						<Link
							to="/profile"
							className="px-6 py-3 bg-[#335833] text-white font-semibold rounded-xl hover:bg-[#2a4729] transition-all shadow-lg hover:shadow-xl"
						>
							View Profile
						</Link>
					</div>
				</motion.header>

				{/* Bento Grid Layout */}
				<motion.div
					variants={containerVariants}
					initial="hidden"
					animate="show"
					className="grid grid-cols-1 md:grid-cols-6 gap-4 md:gap-6"
				>
					{/* Row 1: Stats - 4 columns */}
					<div className="md:col-span-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
						<StatCard
							icon={HiDocumentText}
							title="Total Posts"
							value={posts.length}
							gradient="bg-gradient-to-br from-blue-400 to-blue-600"
							iconBg="bg-gradient-to-br from-blue-500 to-blue-600"
						/>
						<StatCard
							icon={HiHeart}
							title="Total Likes"
							value={totalLikes}
							gradient="bg-gradient-to-br from-red-400 to-red-600"
							iconBg="bg-gradient-to-br from-red-500 to-red-600"
						/>
						<StatCard
							icon={HiChatAlt}
							title="Comments"
							value={totalComments}
							gradient="bg-gradient-to-br from-purple-400 to-purple-600"
							iconBg="bg-gradient-to-br from-purple-500 to-purple-600"
						/>
						<StatCard
							icon={HiTrendingUp}
							title="Engagement"
							value={engagementScore}
							gradient="bg-gradient-to-br from-green-400 to-green-600"
							iconBg="bg-gradient-to-br from-[#335833] to-[#4a7d4a]"
						/>
					</div>

					{/* Row 2: Rank & Points - Large Cards */}
					<FeatureCard className="md:col-span-3 p-8 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
						<div className="flex items-center gap-6">
							<div className="p-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-2xl">
								<HiChartBar className="text-white text-5xl" />
							</div>
							<div className="flex-1">
								<p className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
									Your Rank
								</p>
								<p className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-orange-600">
									#{userRank || "-"}
								</p>
								<p className="text-sm text-gray-600 mt-2">
									Out of all creators
								</p>
							</div>
						</div>
					</FeatureCard>

					<FeatureCard className="md:col-span-3 p-8 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
						<div className="flex items-center gap-6">
							<div className="p-6 bg-gradient-to-br from-[#335833] to-[#4a7d4a] rounded-2xl shadow-2xl">
								<HiStar className="text-yellow-300 text-5xl" />
							</div>
							<div className="flex-1">
								<p className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
									Total Points
								</p>
								<p className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#335833] to-[#4a7d4a]">
									{user.points || 0}
								</p>
								<p className="text-sm text-gray-600 mt-2">
									Keep creating to earn more
								</p>
							</div>
						</div>
					</FeatureCard>

					{/* Row 3: Create Content - Spans 4 columns */}
					<FeatureCard className="md:col-span-4 p-8 relative overflow-hidden">
						{/* Decorative Background */}
						<div className="absolute inset-0 bg-linear-to-br from-[#335833] to-[#4a7d4a] opacity-5" />
						<div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-br from-[#335833]/10 to-transparent rounded-full -mr-32 -mt-32" />
						<div className="absolute bottom-0 left-0 w-48 h-48 bg-linear-to-tr from-[#4a7d4a]/10 to-transparent rounded-full -ml-24 -mb-24" />

						<div className="relative z-10">
							<div className="flex items-center gap-3 mb-4">
								<HiLightningBolt className="text-[#335833] text-3xl" />
								<h2 className="text-2xl font-bold text-gray-900">
									Create New Content
								</h2>
							</div>
							<p className="text-gray-600 mb-6 max-w-2xl">
								Share your wildlife experiences, stories, and moments with the
								community. Start creating and climb the leaderboard!
							</p>
							<div className="flex flex-wrap gap-4">
								<Link
									to="/upload/blog"
									className="flex items-center gap-3 px-6 py-4 bg-linear-to-r from-[#335833] to-[#4a7d4a] text-white font-semibold rounded-xl hover:shadow-xl transition-all group"
								>
									<div className="p-2 bg-white/20 rounded-lg group-hover:bg-white/30 transition-all">
										<HiDocumentText className="text-xl" />
									</div>
									<div className="text-left">
										<p className="font-bold">Write Blog Post</p>
										<p className="text-xs text-green-100">Share your story</p>
									</div>
								</Link>
								<Link
									to="/upload/content"
									className="flex items-center gap-3 px-6 py-4 bg-white border-2 border-[#335833] text-[#335833] font-semibold rounded-xl hover:bg-[#335833] hover:text-white transition-all group"
								>
									<div className="p-2 bg-[#335833]/10 rounded-lg group-hover:bg-white/20 transition-all">
										<HiPhotograph className="text-xl" />
									</div>
									<div className="text-left">
										<p className="font-bold">Upload Social</p>
										<p className="text-xs opacity-70">Photo & Audio</p>
									</div>
								</Link>
							</div>
						</div>
					</FeatureCard>

					{/* Row 3: Quick Stats - Spans 2 columns */}
					<FeatureCard className="md:col-span-2 p-6">
						<div className="flex items-center gap-3 mb-4">
							<h3 className="text-lg font-bold text-gray-900">Quick Stats</h3>
						</div>
						<div className="space-y-4">
							<div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
								<span className="text-sm font-medium text-gray-600">
									Blog Posts
								</span>
								<span className="text-lg font-bold text-gray-900">
									{posts.filter((p) => p.type === "blog").length}
								</span>
							</div>
							<div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
								<span className="text-sm font-medium text-gray-600">
									Social Posts
								</span>
								<span className="text-lg font-bold text-gray-900">
									{posts.filter((p) => p.type === "photoAudio").length}
								</span>
							</div>
							<div className="flex items-center justify-between p-3 bg-linear-to-r from-[#335833] to-[#4a7d4a] rounded-lg">
								<span className="text-sm font-semibold text-white">
									Avg. Engagement
								</span>
								<span className="text-lg font-bold text-white">
									{posts.length > 0
										? Math.round((totalLikes + totalComments) / posts.length)
										: 0}
								</span>
							</div>
						</div>
					</FeatureCard>

					{/* Row 4: Recent Posts - Full Width */}
					<FeatureCard className="md:col-span-6 p-8">
						<div className="flex items-center justify-between mb-6">
							<div className="flex items-center gap-3">
								<h2 className="text-2xl font-bold text-gray-900">
									Recent Posts
								</h2>
							</div>
							<Link
								to="/blogs/manage"
								className="text-[#335833] font-semibold hover:underline flex items-center gap-2"
							>
								View All
								<HiSparkles />
							</Link>
						</div>

						{posts.length > 0 ? (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{posts.slice(0, 6).map((post) => (
									<motion.div
										key={post.id}
										whileHover={{ y: -8, scale: 1.02 }}
										transition={{ type: "spring", stiffness: 300 }}
										className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden hover:border-[#335833] hover:shadow-xl transition-all group"
									>
										{/* Post Image/Thumbnail */}
										{post.type === "photoAudio" && post.photoUrl ? (
											<div className="h-48 overflow-hidden bg-gray-100">
												<img
													src={post.photoUrl}
													alt={post.title}
													className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
												/>
											</div>
										) : (
											<div className="h-48 bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center">
												<HiDocumentText className="text-6xl text-gray-400" />
											</div>
										)}

										{/* Post Content */}
										<div className="p-5">
											<div className="flex items-center justify-between mb-3">
												<span
													className={`px-3 py-1 rounded-full text-xs font-bold ${
														post.type === "blog"
															? "bg-blue-100 text-blue-700"
															: "bg-green-100 text-green-700"
													}`}
												>
													{post.type === "blog" ? "Blog" : "Social"}
												</span>
												<div className="flex gap-2">
													<button
														onClick={() => navigate(`/blog/${post.id}`)}
														className="p-2 text-gray-400 hover:text-[#335833] transition-colors"
														title="View"
													>
														<HiEye size={18} />
													</button>
													{post.type === "blog" && (
														<button
															onClick={() => navigate(`/blog/edit/${post.id}`)}
															className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
															title="Edit"
														>
															<HiPencilAlt size={18} />
														</button>
													)}
													<button
														onClick={() => handleDelete(post.id)}
														className="p-2 text-gray-400 hover:text-red-600 transition-colors"
														title="Delete"
													>
														<HiTrash size={18} />
													</button>
												</div>
											</div>
											<h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-lg leading-tight">
												{post.title || "Untitled Post"}
											</h3>
											<p className="text-xs text-gray-500 mb-3">
												{new Date(post.createdAt?.toDate()).toLocaleDateString(
													"en-US",
													{
														month: "short",
														day: "numeric",
														year: "numeric",
													}
												)}
											</p>
											{post.type === "blog" && (
												<p className="text-sm text-gray-600 line-clamp-2 mb-4">
													{stripHtml(post.blogContent)?.substring(0, 100)}...
												</p>
											)}
											<div className="flex items-center gap-4 text-sm text-gray-500">
												<span className="flex items-center gap-1">
													<HiHeart className="text-red-400" />
													{post.likeCount || 0}
												</span>
												<span className="flex items-center gap-1">
													<HiChatAlt className="text-blue-400" />
													{post.commentCount || 0}
												</span>
											</div>
										</div>
									</motion.div>
								))}
							</div>
						) : (
							<div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
								<HiDocumentText className="text-6xl text-gray-400 mx-auto mb-4" />
								<p className="text-lg font-semibold text-gray-900 mb-2">
									No posts yet
								</p>
								<p className="text-gray-600 mb-6">
									Create your first post to start building your portfolio
								</p>
								<Link
									to="/upload/blog"
									className="inline-flex items-center gap-2 px-6 py-3 bg-[#335833] text-white font-semibold rounded-lg hover:bg-[#2a4729] transition-all"
								>
									<HiDocumentText />
									Create First Post
								</Link>
							</div>
						)}
					</FeatureCard>
				</motion.div>
			</div>
		</div>
	);
};

export default CreatorDashboard;
