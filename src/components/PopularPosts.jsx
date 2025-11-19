import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Helper to extract image
const extractFirstImage = (content) => {
	if (!content) return null;
	const markdownMatch = content.match(/!\[.*?\]\((.*?)\)/);
	if (markdownMatch) return markdownMatch[1];
	const htmlMatch = content.match(/<img[^>]+src="([^">]+)"/);
	if (htmlMatch) return htmlMatch[1];
	return null;
};

const PopularPosts = ({ posts = [] }) => {
	const [popularPosts, setPopularPosts] = useState([]);

	useEffect(() => {
		// Sort by engagement (likes + comments)
		const sorted = [...posts]
			.map((post) => ({
				...post,
				engagement: (post.likeCount || 0) + (post.commentCount || 0) * 2,
			}))
			.sort((a, b) => b.engagement - a.engagement)
			.slice(0, 5);

		setPopularPosts(sorted);
	}, [posts]);

	if (popularPosts.length === 0) {
		return (
			<div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
				<h3 className="text-lg font-bold text-gray-900 mb-4">Popular Posts</h3>
				<p className="text-sm text-gray-500 text-center py-4">
					No posts available yet
				</p>
			</div>
		);
	}

	return (
		<div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
			<h3 className="text-lg font-bold text-gray-900 mb-4">Popular Posts</h3>
			<div className="space-y-4">
				{popularPosts.map((post) => {
					const thumbnailUrl =
						post.photoUrl ||
						extractFirstImage(post.blogContent) ||
						"https://placehold.co/100x70/335833/FFF?text=Post";

					const formattedDate = post.createdAt
						? new Date(post.createdAt.toDate()).toLocaleDateString("en-US", {
								month: "short",
								day: "numeric",
						  })
						: "";

					return (
						<Link
							key={post.id}
							to={`/blog/${post.id}`}
							className="flex items-center space-x-3 group"
						>
							<img
								src={thumbnailUrl}
								alt={post.title}
								className="w-24 h-16 object-cover rounded-md flex-shrink-0 group-hover:opacity-80 transition-opacity"
								onError={(e) => {
									e.target.src =
										"https://placehold.co/100x70/335833/FFF?text=No+Image";
								}}
							/>
							<div className="flex-1 min-w-0">
								<h4 className="text-sm font-semibold text-gray-800 group-hover:text-[#335833] transition-colors line-clamp-2">
									{post.title || "Untitled Post"}
								</h4>
								<div className="flex items-center gap-2 mt-1">
									<p className="text-xs text-gray-500">{formattedDate}</p>
									<span className="text-xs text-gray-400">•</span>
									<p className="text-xs text-gray-500">
										{post.likeCount || 0} likes
									</p>
								</div>
							</div>
						</Link>
					);
				})}
			</div>
		</div>
	);
};

export default PopularPosts;
