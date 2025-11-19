import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Helper to strip HTML
const stripHtml = (html) => {
	if (!html) return "";
	const tmp = document.createElement("DIV");
	tmp.innerHTML = html;
	return tmp.textContent || tmp.innerText || "";
};

// Helper to extract image
const extractFirstImage = (content) => {
	if (!content) return null;
	const htmlMatch = content.match(/<img[^>]+src="([^">]+)"/);
	if (htmlMatch) return htmlMatch[1];
	const markdownMatch = content.match(/!\[.*?\]\((.*?)\)/);
	if (markdownMatch) return markdownMatch[1];
	return null;
};

// Create short title from content if title is missing
const getDisplayTitle = (post) => {
	if (post.title && post.title.trim()) {
		return post.title;
	}
	// Extract first line of content as title
	const plainText = stripHtml(post.blogContent);
	const firstLine = plainText.split("\n")[0].trim();
	if (firstLine.length > 60) {
		return firstLine.substring(0, 60) + "...";
	}
	return firstLine || "Untitled Post";
};

const PopularPosts = ({ posts = [] }) => {
	const [popularPosts, setPopularPosts] = useState([]);

	useEffect(() => {
		// Filter only blogs and sort by engagement (likes + comments)
		const blogPosts = posts.filter((post) => post.type === "blog");

		const sorted = [...blogPosts]
			.map((post) => ({
				...post,
				engagement: (post.likeCount || 0) + (post.commentCount || 0) * 2,
			}))
			.sort((a, b) => b.engagement - a.engagement)
			.slice(0, 3);

		setPopularPosts(sorted);
	}, [posts]);

	if (popularPosts.length === 0) {
		return (
			<div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
				<h3 className="text-lg font-bold text-gray-900 mb-4">Popular Posts</h3>
				<p className="text-sm text-gray-500 text-center py-4">
					No blog posts available yet
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
						extractFirstImage(post.blogContent) ||
						"https://placehold.co/100x70/335833/FFF?text=Post";

					const displayTitle = getDisplayTitle(post);

					const formattedDate = post.createdAt
						? new Date(post.createdAt.toDate()).toLocaleDateString("en-US", {
								month: "long",
								day: "numeric",
								year: "numeric",
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
								alt={displayTitle}
								className="w-24 h-16 object-cover rounded-md flex-shrink-0"
								onError={(e) => {
									e.target.src =
										"https://placehold.co/100x70/335833/FFF?text=No+Image";
								}}
							/>
							<div>
								<h4 className="text-sm font-semibold text-gray-800 group-hover:text-[#335833] transition-colors line-clamp-2">
									{displayTitle}
								</h4>
								<p className="text-xs text-gray-500">{formattedDate}</p>
							</div>
						</Link>
					);
				})}
			</div>
		</div>
	);
};

export default PopularPosts;
