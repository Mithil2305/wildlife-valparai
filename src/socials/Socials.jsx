import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, userDoc, getDoc } from "../services/firebase.js";
import { getAllPosts } from "../services/socialApi.js";
import SocialCard from "./SocialCard.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import Leaderboard from "../components/Leaderboard.jsx";
import toast from "react-hot-toast";
import { HiPlus, HiTrophy, HiHeart } from "react-icons/hi2";

const Socials = () => {
	const [posts, setPosts] = useState([]);
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [displayCount, setDisplayCount] = useState(12); // 3 columns x 4 rows
	const navigate = useNavigate();
	const currentUser = auth.currentUser;

	useEffect(() => {
		fetchUserAndPosts();
	}, [currentUser]);

	const fetchUserAndPosts = async () => {
		try {
			setLoading(true);

			// Fetch user profile
			if (currentUser) {
				const userRef = userDoc(currentUser.uid);
				const userSnap = await getDoc(userRef);
				if (userSnap.exists()) {
					setUser(userSnap.data());
				}
			}

			// Fetch all posts and filter only social posts
			const allPosts = await getAllPosts();
			const socialPosts = allPosts.filter((post) => post.type === "photoAudio");

			// Shuffle posts for variety
			const shuffled = socialPosts.sort(() => Math.random() - 0.5);
			setPosts(shuffled);
		} catch (error) {
			console.error("Error fetching data:", error);
			toast.error("Failed to load posts");
		} finally {
			setLoading(false);
		}
	};

	const loadMore = () => {
		setDisplayCount((prev) => prev + 12);
	};

	if (loading) {
		return <LoadingSpinner />;
	}

	return (
		<div className="min-h-screen bg-linear-to-br from-gray-50 via-green-50/30 to-gray-50 py-8">
			<div className="container mx-auto max-w-7xl px-4">
				{/* Header */}
				<div className="mb-8">
					<div className="flex items-center justify-between mb-6">
						<div>
							<h1 className="text-3xl font-bold text-gray-900">
								Wildlife Moments
							</h1>
							<p className="text-gray-600 mt-1">
								Welcome back, {user?.name || "Guest"}
							</p>
						</div>

						{/* Action Buttons */}
						<div className="flex items-center gap-3">
							{/* Create Post */}
							<button
								onClick={() => navigate("/upload/content")}
								className="flex items-center gap-2 px-5 py-2.5 bg-[#335833] text-white font-semibold rounded-xl hover:bg-[#2a4729] transition-all shadow-md"
								title="Create Post"
							>
								<HiPlus size={20} />
								<span className="hidden md:inline">Create</span>
							</button>

							{/* Leaderboard */}
							<button
								onClick={() => navigate("/leaderboard")}
								className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
								title="Leaderboard"
							>
								<HiTrophy size={20} className="text-yellow-500" />
								<span className="hidden md:inline">Leaderboard</span>
							</button>

							{/* Favorites */}
							<button
								onClick={() => navigate("/socials/favorites")}
								className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
								title="Favorites"
							>
								<HiHeart size={20} className="text-red-500" />
								<span className="hidden md:inline">Favorites</span>
							</button>
						</div>
					</div>
				</div>

				{/* Main Content Grid */}
				<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
					{/* Posts Feed - 3 columns */}
					<div className="lg:col-span-3">
						{posts.length === 0 ? (
							<div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-300">
								<HiPlus className="text-6xl text-gray-400 mx-auto mb-4" />
								<p className="text-gray-900 text-lg font-semibold mb-2">
									No posts available yet
								</p>
								<p className="text-gray-500 mb-6">
									Be the first to share your wildlife moment!
								</p>
								<button
									onClick={() => navigate("/upload/content")}
									className="bg-[#335833] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#2a4729] transition-all shadow-md"
								>
									Create First Post
								</button>
							</div>
						) : (
							<>
								{/* Bento Grid - 3 columns */}
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
									{posts.slice(0, displayCount).map((post) => (
										<SocialCard
											key={post.id}
											post={post}
											onUpdate={fetchUserAndPosts}
											gridView={true}
										/>
									))}
								</div>

								{/* Load More Button */}
								{displayCount < posts.length && (
									<div className="flex justify-center pt-8">
										<button
											onClick={loadMore}
											className="bg-[#335833] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#2a4729] transition-all shadow-lg"
										>
											Load More ({posts.length - displayCount} more)
										</button>
									</div>
								)}
							</>
						)}
					</div>

					{/* Sidebar - 1 column */}
					<div className="lg:col-span-1 space-y-6">
						<Leaderboard />

						{/* Stats Card */}
						<div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
							<h3 className="text-lg font-bold text-gray-900 mb-4">
								Community Stats
							</h3>
							<div className="space-y-3">
								<div className="flex items-center justify-between">
									<span className="text-gray-600 text-sm">Total Posts</span>
									<span className="font-bold text-gray-900">
										{posts.length}
									</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-gray-600 text-sm">Active Creators</span>
									<span className="font-bold text-gray-900">
										{new Set(posts.map((p) => p.creatorId)).size}
									</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-gray-600 text-sm">Total Likes</span>
									<span className="font-bold text-gray-900">
										{posts.reduce((sum, p) => sum + (p.likeCount || 0), 0)}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Socials;
