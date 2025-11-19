import React, { useState, useEffect } from "react";
import { getAllPosts } from "../services/socialApi.js";
import SocialCard from "./SocialCard.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";

const ContentFeed = () => {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [filter, setFilter] = useState("all");

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
		} finally {
			setLoading(false);
		}
	};

	const filteredPosts = posts.filter((post) => {
		if (filter === "all") return true;
		if (filter === "photos") return post.type === "photoAudio";
		if (filter === "blogs") return post.type === "blog";
		return true;
	});

	if (loading) {
		return <LoadingSpinner />;
	}

	return (
		<div className="max-w-3xl mx-auto px-4 py-8">
			<div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
				<h2 className="text-2xl font-bold text-gray-900">Social Feed</h2>

				<div className="flex bg-gray-100 p-1 rounded-xl">
					<button
						onClick={() => setFilter("all")}
						className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
							filter === "all"
								? "bg-white text-[#335833] shadow-sm"
								: "text-gray-500 hover:text-gray-700"
						}`}
					>
						All
					</button>
					<button
						onClick={() => setFilter("photos")}
						className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
							filter === "photos"
								? "bg-white text-[#335833] shadow-sm"
								: "text-gray-500 hover:text-gray-700"
						}`}
					>
						Photos & Audio
					</button>
					<button
						onClick={() => setFilter("blogs")}
						className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
							filter === "blogs"
								? "bg-white text-[#335833] shadow-sm"
								: "text-gray-500 hover:text-gray-700"
						}`}
					>
						Blogs
					</button>
				</div>
			</div>

			<div className="space-y-6">
				{filteredPosts.length > 0 ? (
					filteredPosts.map((post) => <SocialCard key={post.id} post={post} />)
				) : (
					<div className="text-center py-12 bg-gray-50 rounded-2xl">
						<p className="text-gray-500">
							No posts found matching your filter.
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default ContentFeed;
