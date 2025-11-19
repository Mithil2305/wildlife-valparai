import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaFire } from "react-icons/fa";

// Helper function to extract first image from blog content
const extractFirstImage = (content) => {
	if (!content) return null;
	const markdownMatch = content.match(/!\[.*?\]\((.*?)\)/);
	if (markdownMatch) return markdownMatch[1];
	const htmlMatch = content.match(/<img[^>]+src="([^">]+)"/);
	if (htmlMatch) return htmlMatch[1];
	const urlMatch = content.match(
		/(https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp))/i
	);
	if (urlMatch) return urlMatch[0];
	return null;
};

const createExcerpt = (content, maxLength = 200) => {
	if (!content) return "";
	const cleaned = content
		.replace(/!\[.*?\]\(.*?\)/g, "")
		.replace(/<[^>]*>/g, "")
		.replace(/[#*_`]/g, "")
		.trim();
	if (cleaned.length <= maxLength) return cleaned;
	return cleaned.substring(0, maxLength) + "...";
};

const BreakingNewsCard = ({ post }) => {
	const thumbnailUrl =
		post.photoUrl ||
		extractFirstImage(post.blogContent) ||
		"https://placehold.co/800x600/335833/FFF?text=Breaking+News";

	const excerpt =
		post.type === "blog"
			? createExcerpt(post.blogContent, 200)
			: post.title || "";

	const formattedDate = post.createdAt
		? new Date(post.createdAt.toDate()).toLocaleDateString("en-US", {
				year: "numeric",
				month: "long",
				day: "numeric",
		  })
		: "Unknown date";

	return (
		<div className="group overflow-hidden rounded-lg shadow-lg bg-white border-2 border-red-500">
			{/* Breaking News Badge */}
			<div className="bg-red-500 text-white px-4 py-2 flex items-center gap-2">
				<FaFire className="animate-pulse" />
				<span className="font-bold text-sm uppercase tracking-wide">
					Breaking News - Trending Now
				</span>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2">
				{/* Image */}
				<div className="overflow-hidden">
					<img
						src={thumbnailUrl}
						alt={post.title}
						className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
						onError={(e) => {
							e.target.src =
								"https://placehold.co/800x600/335833/FFF?text=No+Image";
						}}
					/>
				</div>
				{/* Content */}
				<div className="p-6 flex flex-col justify-center">
					<span
						className={`text-xs font-semibold px-2 py-1 rounded w-fit mb-3 ${
							post.type === "blog"
								? "bg-blue-100 text-blue-800"
								: "bg-green-100 text-green-800"
						}`}
					>
						{post.type === "blog" ? "Blog" : "Photo/Audio"}
					</span>

					<h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 leading-tight">
						<Link
							to={`/blog/${post.id}`}
							className="hover:text-[#335833] transition-colors"
						>
							{post.title || "Untitled Post"}
						</Link>
					</h2>
					<p className="text-sm text-gray-500 mb-4">
						By {post.creatorUsername || "Anonymous"} | {formattedDate}
					</p>
					<p className="text-gray-700 mb-5 line-clamp-3">{excerpt}</p>

					{/* Engagement Stats */}
					<div className="flex items-center gap-6 text-sm text-gray-600 mb-5">
						<span className="flex items-center gap-2">
							<svg
								className="w-5 h-5 text-red-500"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path
									fillRule="evenodd"
									d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
									clipRule="evenodd"
								/>
							</svg>
							<span className="font-semibold">{post.likeCount || 0} Likes</span>
						</span>
						<span className="flex items-center gap-2">
							<svg
								className="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
								/>
							</svg>
							<span className="font-semibold">
								{post.commentCount || 0} Comments
							</span>
						</span>
					</div>

					<Link
						to={`/blog/${post.id}`}
						className="inline-flex items-center font-semibold text-[#335833] hover:text-black transition-colors"
					>
						Read Full Story <FaArrowRight className="ml-2 w-4 h-4" />
					</Link>
				</div>
			</div>
		</div>
	);
};

export default BreakingNewsCard;
