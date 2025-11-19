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

// Variants for the main grid container (staggers its children)
const gridContainerVariants = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1, // Each child will animate 0.1s after the previous one
		},
	},
};

// Variants for each box inside the grid
const gridItemVariants = {
	hidden: { opacity: 0, y: 20 },
	show: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.4,
			ease: "easeOut",
		},
	},
};

// Variants for the list of posts (staggers its children)
const listContainerVariants = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: {
			staggerChildren: 0.08,
			delayChildren: 0.2,
		},
	},
};

// Variants for each item in the post list
const listItemVariants = {
	hidden: { opacity: 0, x: -20 },
	show: {
		opacity: 1,
		x: 0,
		transition: {
			duration: 0.3,
			ease: "easeOut",
		},
	},
};

// Bento Box Component for styling
const BentoBox = ({ children, className = "", variants }) => (
	<motion.div
		variants={variants}
		className={`bg-white p-6 rounded-2xl shadow-lg border border-gray-100 ${className}`}
	>
		{children}
	</motion.div>
);

// Stat Box Component
const StatBox = ({ icon, title, value, color, variants }) => (
	<BentoBox variants={variants} className="flex flex-col justify-between">
		<div
			className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}
		>
			{icon}
		</div>
		<div>
			<p className="text-gray-500 text-sm font-medium">{title}</p>
			<p className="text-3xl font-bold text-gray-900">{value}</p>
		</div>
	</BentoBox>
);

const CreatorDashboard = () => {
	const [posts, setPosts] = useState([]);
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	// Fetch user and their posts
	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			const currentUser = auth.currentUser;
			if (currentUser) {
				// Fetch user profile
				const userRef = userDoc(currentUser.uid);
				const userSnap = await getDoc(userRef);
				if (userSnap.exists()) {
					setUser(userSnap.data());
				}

				// Fetch creator's posts
				const creatorPosts = await getCreatorPosts(currentUser.uid);
				setPosts(creatorPosts);
			}
			setLoading(false);
		};
		fetchData();
	}, []);

	// Calculate stats
	const totalPosts = posts.length;
	const totalLikes = posts.reduce(
		(sum, post) => sum + (post.likeCount || 0),
		0
	);
	const totalComments = posts.reduce(
		(sum, post) => sum + (post.commentCount || 0),
		0
	);

	// Handle Post Deletion
	const handleDelete = async (postId) => {
		if (window.confirm("Are you sure you want to delete this post?")) {
			const deletePromise = deleteBlogPost(postId);
			toast.promise(deletePromise, {
				loading: "Deleting post...",
				success: () => {
					// Refresh list
					setPosts(posts.filter((post) => post.id !== postId));
					return <b>Post deleted!</b>;
				},
				error: <b>Could not delete post.</b>,
			});
		}
	};

	if (loading) {
		return <LoadingSpinner />;
	}

	if (!user) {
		return (
			<div className="text-center p-10">
				<h2 className="text-2xl font-bold">Error</h2>
				<p>Could not load user data. Please try logging in again.</p>
			</div>
		);
	}

	return (
		<div className="bg-gray-50 min-h-screen p-4 md:p-8">
			<div className="container mx-auto max-w-7xl">
				<motion.h1
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="text-3xl font-bold text-gray-900 mb-2"
				>
					Welcome, {user.name}!
				</motion.h1>
				<motion.p
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.1 }}
					className="text-gray-600 mb-8"
				>
					Here's an overview of your creator content.
				</motion.p>

				{/* --- Bento Grid --- */}
				<motion.div
					className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6"
					variants={gridContainerVariants}
					initial="hidden"
					animate="show"
				>
					{/* Create New Post */}
					<BentoBox
						variants={gridItemVariants}
						className="md:col-span-2 lg:col-span-2 flex flex-col items-center justify-center text-center bg-linear-to-br from-[#335833] to-[#4a7d4a] text-white"
					>
						<h2 className="text-2xl font-bold mb-4">Ready to post again?</h2>
						<p className="text-gray-200 mb-6">
							Create a new blog post or photo/audio content.
						</p>
						<div className="flex space-x-4">
							<Link
								to="/upload/blog"
								className="flex items-center justify-center bg-white text-[#335833] font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-gray-100 transition-all"
							>
								<FaFileAlt className="mr-2" /> New Blog Post
							</Link>
							<Link
								to="/upload/content"
								className="flex items-center justify-center bg-white text-black font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-gray-100 transition-all"
							>
								<FaPlus className="mr-2" /> New Social Post
							</Link>
						</div>
					</BentoBox>

					{/* Stats Boxes */}
					<StatBox
						variants={gridItemVariants}
						icon={<FaFileAlt className="w-5 h-5 text-white" />}
						title="Total Posts"
						value={totalPosts}
						color="bg-blue-500"
					/>
					<StatBox
						variants={gridItemVariants}
						icon={<FaHeart className="w-5 h-5 text-white" />}
						title="Total Likes"
						value={totalLikes}
						color="bg-red-500"
					/>
					<StatBox
						variants={gridItemVariants}
						icon={<FaComment className="w-5 h-5 text-white" />}
						title="Total Comments"
						value={totalComments}
						color="bg-green-500"
					/>
					<BentoBox
						variants={gridItemVariants}
						className="flex flex-col justify-center"
					>
						<p className="text-gray-500 text-sm font-medium">Your Points</p>
						<p className="text-3xl font-bold text-gray-900">{user.points}</p>
					</BentoBox>

					{/* Post Management List */}
					<BentoBox
						variants={gridItemVariants}
						className="md:col-span-3 lg:col-span-4"
					>
						<h2 className="text-xl font-bold text-gray-900 mb-4">
							Manage Your Posts
						</h2>
						<motion.div
							className="space-y-4"
							variants={listContainerVariants}
							initial="hidden"
							animate="show"
						>
							{posts.length > 0 ? (
								posts.map((post) => (
									<motion.div
										key={post.id}
										variants={listItemVariants}
										whileHover={{
											scale: 1.02,
											transition: { duration: 0.2 },
										}}
										className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-lg border border-gray-200 bg-gray-50"
									>
										<div>
											<span
												className={`text-xs font-semibold px-2 py-0.5 rounded ${
													post.type === "blog"
														? "bg-blue-100 text-blue-800"
														: "bg-green-100 text-green-800"
												}`}
											>
												{post.type === "blog" ? "Blog" : "Social"}
											</span>
											<h3 className="text-lg font-semibold text-gray-800 mt-1">
												{post.title || "Untitled Post"}
											</h3>
											<p className="text-sm text-gray-500">
												{new Date(
													post.createdAt?.toDate()
												).toLocaleDateString()}
											</p>
										</div>
										<div className="flex space-x-2 mt-4 md:mt-0">
											<motion.button
												whileHover={{ scale: 1.1 }}
												whileTap={{ scale: 0.95 }}
												onClick={() => navigate(`/blog/${post.id}`)}
												className="p-2 text-sm text-gray-600 bg-white border rounded-lg hover:bg-gray-100 transition-colors"
												title="View Post"
											>
												<FaEye />
											</motion.button>
											<motion.button
												whileHover={{ scale: 1.1 }}
												whileTap={{ scale: 0.95 }}
												onClick={() => navigate(`/blog/edit/${post.id}`)}
												className="p-2 text-sm text-blue-600 bg-white border rounded-lg hover:bg-gray-100 transition-colors"
												title="Edit Post"
											>
												<FaEdit />
											</motion.button>
											<motion.button
												whileHover={{ scale: 1.1 }}
												whileTap={{ scale: 0.95 }}
												onClick={() => handleDelete(post.id)}
												className="p-2 text-sm text-red-600 bg-white border rounded-lg hover:bg-gray-100 transition-colors"
												title="Delete Post"
											>
												<FaTrash />
											</motion.button>
										</div>
									</motion.div>
								))
							) : (
								<motion.p
									variants={listItemVariants}
									className="text-gray-500 text-center py-8"
								>
									You haven't created any posts yet.
								</motion.p>
							)}
						</motion.div>
					</BentoBox>
				</motion.div>
			</div>
		</div>
	);
};

export default CreatorDashboard;
