import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
	FaPlus,
	FaFileAlt,
	FaHeart,
	FaComment,
	FaEdit,
	FaTrash,
	FaEye,
} from "react-icons/fa";
import { auth, userDoc, getDoc } from "../services/firebase.js";
import { getCreatorPosts, deleteBlogPost } from "../services/uploadPost.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import toast from "react-hot-toast";

// --- Animation Variants ---
const gridContainerVariants = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: { staggerChildren: 0.1 },
	},
};

const gridItemVariants = {
	hidden: { opacity: 0, y: 20 },
	show: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.4, ease: "easeOut" },
	},
};

// Bento Box Component
const BentoBox = ({ children, className = "", variants }) => (
	<motion.div
		variants={variants}
		className={`bg-white p-6 rounded-2xl shadow-sm border border-gray-200 ${className}`}
	>
		{children}
	</motion.div>
);

// Stat Box Component
const StatBox = ({ icon, title, value, colorClass, variants }) => (
	<BentoBox
		variants={variants}
		className="flex flex-col justify-between h-full"
	>
		<div
			className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${colorClass}`}
		>
			{icon}
		</div>
		<div>
			<p className="text-gray-500 text-sm font-medium">{title}</p>
			<p className="text-2xl font-bold text-gray-900">{value}</p>
		</div>
	</BentoBox>
);

const CreatorDashboard = () => {
	const [posts, setPosts] = useState([]);
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			const currentUser = auth.currentUser;
			if (currentUser) {
				const userRef = userDoc(currentUser.uid);
				const userSnap = await getDoc(userRef);
				if (userSnap.exists()) {
					setUser(userSnap.data());
				}
				const creatorPosts = await getCreatorPosts(currentUser.uid);
				setPosts(creatorPosts);
			}
			setLoading(false);
		};
		fetchData();
	}, []);

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
			const deletePromise = deleteBlogPost(postId);
			toast.promise(deletePromise, {
				loading: "Deleting...",
				success: () => {
					setPosts(posts.filter((post) => post.id !== postId));
					return "Deleted!";
				},
				error: "Failed to delete.",
			});
		}
	};

	if (loading) return <LoadingSpinner />;
	if (!user) return <div className="p-10 text-center">Please log in.</div>;

	return (
		<div className="bg-gray-50 min-h-screen p-4 md:p-8">
			<div className="container mx-auto max-w-7xl">
				<header className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
					<p className="text-gray-500">Welcome back, {user.name}</p>
				</header>

				<motion.div
					className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-auto"
					variants={gridContainerVariants}
					initial="hidden"
					animate="show"
				>
					{/* 1. Create Actions (Large Box) */}
					<BentoBox
						variants={gridItemVariants}
						className="md:col-span-2 md:row-span-2 bg-gradient-to-br from-[#335833] to-[#4a7d4a] text-white flex flex-col justify-center items-start"
					>
						<h2 className="text-2xl font-bold mb-2">Create Content</h2>
						<p className="text-green-100 mb-6 max-w-md">
							Share your wildlife experiences with the world. Write a blog or
							upload a photo with audio.
						</p>
						<div className="flex flex-wrap gap-3">
							<Link
								to="/upload/blog"
								className="flex items-center bg-white text-[#335833] px-4 py-2 rounded-lg font-semibold shadow hover:bg-gray-50 transition-colors"
							>
								<FaFileAlt className="mr-2" /> Write Blog
							</Link>
							<Link
								to="/upload/content"
								className="flex items-center bg-[#223d22] text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-[#1a301a] transition-colors"
							>
								<FaPlus className="mr-2" /> Upload Social
							</Link>
						</div>
					</BentoBox>

					{/* 2. Stats */}
					<StatBox
						variants={gridItemVariants}
						icon={<FaFileAlt className="text-blue-600" />}
						title="Total Posts"
						value={posts.length}
						colorClass="bg-blue-100"
					/>
					<StatBox
						variants={gridItemVariants}
						icon={<FaHeart className="text-red-600" />}
						title="Total Likes"
						value={totalLikes}
						colorClass="bg-red-100"
					/>
					<StatBox
						variants={gridItemVariants}
						icon={<FaComment className="text-purple-600" />}
						title="Total Comments"
						value={totalComments}
						colorClass="bg-purple-100"
					/>
					<BentoBox
						variants={gridItemVariants}
						className="flex flex-col justify-center items-center text-center"
					>
						<p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">
							Current Rank
						</p>
						<div className="text-3xl font-black text-[#335833]">
							#{user.rank || "-"}
						</div>
						<p className="text-sm text-gray-400 mt-1">{user.points} Points</p>
					</BentoBox>

					{/* 3. Recent Posts Grid (Wide) */}
					<BentoBox
						variants={gridItemVariants}
						className="md:col-span-4 bg-gray-50/50 border-none shadow-none p-0"
					>
						<div className="flex justify-between items-center mb-4 px-2">
							<h2 className="text-lg font-bold text-gray-900">
								Recent Uploads
							</h2>
							<Link
								to="/blogs/manage"
								className="text-sm text-[#335833] font-medium hover:underline"
							>
								View All
							</Link>
						</div>

						{posts.length > 0 ? (
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
								{posts.slice(0, 3).map((post) => (
									<motion.div
										key={post.id}
										whileHover={{ y: -2 }}
										className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col"
									>
										<div className="flex items-start justify-between mb-3">
											<span
												className={`px-2 py-1 rounded text-xs font-semibold ${
													post.type === "blog"
														? "bg-blue-100 text-blue-700"
														: "bg-green-100 text-green-700"
												}`}
											>
												{post.type === "blog" ? "Blog Post" : "Social"}
											</span>
											<div className="flex gap-2">
												{/* Edit button only for blogs for now */}
												{post.type === "blog" && (
													<button
														onClick={() => navigate(`/blog/edit/${post.id}`)}
														className="text-gray-400 hover:text-blue-600"
														title="Edit"
													>
														<FaEdit />
													</button>
												)}
												<button
													onClick={() => handleDelete(post.id)}
													className="text-gray-400 hover:text-red-600"
													title="Delete"
												>
													<FaTrash />
												</button>
											</div>
										</div>
										<h3 className="font-bold text-gray-800 mb-1 truncate">
											{post.title}
										</h3>
										<p className="text-xs text-gray-500 mb-4">
											Posted{" "}
											{new Date(post.createdAt?.toDate()).toLocaleDateString()}
										</p>

										{post.type === "photoAudio" && post.photoUrl && (
											<div className="mt-auto h-32 rounded-lg bg-gray-100 overflow-hidden">
												<img
													src={post.photoUrl}
													alt=""
													className="w-full h-full object-cover"
												/>
											</div>
										)}
										{post.type === "blog" && (
											<p className="mt-auto text-sm text-gray-600 line-clamp-3">
												{post.blogContent?.substring(0, 100)}...
											</p>
										)}
									</motion.div>
								))}
							</div>
						) : (
							<div className="text-center py-10 text-gray-400 bg-white rounded-xl border border-dashed border-gray-300">
								No posts yet. Create one above!
							</div>
						)}
					</BentoBox>
				</motion.div>
			</div>
		</div>
	);
};

export default CreatorDashboard;
