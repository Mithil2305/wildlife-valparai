import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthInstance } from "../services/firebase.js";
import { getUserLikedPosts } from "../services/socialApi.js";
import SocialCard from "./SocialCard.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import toast from "react-hot-toast";
import { HiHeart, HiArrowLeft } from "react-icons/hi";

const Favorites = () => {
	const [likedPosts, setLikedPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();
	const auth = getAuthInstance();
	const currentUser = auth?.currentUser;

	useEffect(() => {
		if (!currentUser) {
			toast.error("Please login to view favorites");
			navigate("/login");
			return;
		}
		fetchLikedPosts();
	}, [currentUser]);

	const fetchLikedPosts = async () => {
		try {
			setLoading(true);
			const posts = await getUserLikedPosts(currentUser.uid);
			setLikedPosts(posts);
		} catch (error) {
			console.error("Error fetching liked posts:", error);
			toast.error("Failed to load favorites");
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return <LoadingSpinner />;
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-gray-50 py-8">
			<div className="container mx-auto max-w-7xl px-4">
				{/* Header */}
				<div className="mb-8">
					<button
						onClick={() => navigate("/socials")}
						className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 font-medium"
					>
						<HiArrowLeft size={20} />
						Back to Feed
					</button>

					<div className="flex items-center gap-3">
						<div className="p-3 bg-red-100 rounded-xl">
							<HiHeart className="text-red-500 text-3xl" />
						</div>
						<div>
							<h1 className="text-3xl font-bold text-gray-900">
								Your Favorites
							</h1>
							<p className="text-gray-600 mt-1">
								{likedPosts.length} post{likedPosts.length !== 1 ? "s" : ""} you
								loved
							</p>
						</div>
					</div>
				</div>

				{/* Posts Grid */}
				{likedPosts.length === 0 ? (
					<div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-300">
						<HiHeart className="text-6xl text-gray-400 mx-auto mb-4" />
						<p className="text-gray-900 text-lg font-semibold mb-2">
							No favorites yet
						</p>
						<p className="text-gray-500 mb-6">
							Start liking posts to build your collection!
						</p>
						<button
							onClick={() => navigate("/socials")}
							className="bg-[#335833] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#2a4729] transition-all shadow-md"
						>
							Explore Posts
						</button>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{likedPosts.map((post) => (
							<SocialCard
								key={post.id}
								post={post}
								onUpdate={fetchLikedPosts}
								gridView={true}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default Favorites;
