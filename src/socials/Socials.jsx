import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../services/firebase.js";
import { getAllPosts } from "../services/socialApi.js";
import SocialCard from "./SocialCard.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import toast from "react-hot-toast";

const Socials = () => {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [displayCount, setDisplayCount] = useState(4);
	const navigate = useNavigate();
	const currentUser = auth.currentUser;

	useEffect(() => {
		fetchPosts();
	}, []);

	const fetchPosts = async () => {
		try {
			setLoading(true);
			const allPosts = await getAllPosts();
			setPosts(allPosts);
		} catch (error) {
			console.error("Error fetching posts:", error);
			toast.error("Failed to load posts");
		} finally {
			setLoading(false);
		}
	};

	const loadMore = () => {
		setDisplayCount((prev) => prev + 4);
	};

	if (loading) {
		return <LoadingSpinner />;
	}

	return (
		<div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-8">
			<div className="max-w-2xl mx-auto px-4">
				{/* Header */}
				<div className="mb-8">
					<div className="flex items-center justify-between mb-6">
						<h1 className="text-2xl font-bold text-gray-800">
							Welcome Back, {currentUser?.displayName || "Guest"}
						</h1>
						<div className="flex items-center gap-3">
							<button
								onClick={() => navigate("/upload/content")}
								className="p-2 hover:bg-green-100 rounded-full transition-colors"
								title="Upload Content"
							>
								<svg
									className="w-6 h-6 text-gray-700"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 4v16m8-8H4"
									/>
								</svg>
							</button>
							<button
								onClick={() => navigate("/socials/manage")}
								className="p-2 hover:bg-green-100 rounded-full transition-colors"
								title="Favorites"
							>
								<svg
									className="w-6 h-6 text-gray-700"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
									/>
								</svg>
							</button>
							<button
								className="p-2 hover:bg-green-100 rounded-full transition-colors"
								title="Shopping"
							>
								<svg
									className="w-6 h-6 text-gray-700"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
									/>
								</svg>
							</button>
						</div>
					</div>
				</div>

				{/* Posts Feed */}
				<div className="space-y-6">
					{posts.length === 0 ? (
						<div className="text-center py-12">
							<p className="text-gray-500 text-lg mb-4">
								No posts available yet
							</p>
							<button
								onClick={() => navigate("/upload/content")}
								className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
							>
								Create First Post
							</button>
						</div>
					) : (
						<>
							{posts.slice(0, displayCount).map((post) => (
								<SocialCard key={post.id} post={post} onUpdate={fetchPosts} />
							))}

							{/* Load More Button */}
							{displayCount < posts.length && (
								<div className="flex justify-center pt-4">
									<button
										onClick={loadMore}
										className="bg-green-600 text-white px-8 py-2 rounded-full hover:bg-green-700 transition-colors shadow-md"
									>
										Load More
									</button>
								</div>
							)}
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default Socials;
