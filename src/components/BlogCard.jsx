import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

// Helper function to extract first image from blog content
const extractFirstImage = (content) => {
	if (!content) return null;

	// Try to find image in markdown format ![alt](url)
	const markdownMatch = content.match(/!\[.*?\]\((.*?)\)/);
	if (markdownMatch) return markdownMatch[1];

	// Try to find HTML img tag
	const htmlMatch = content.match(/<img[^>]+src="([^">]+)"/);
	if (htmlMatch) return htmlMatch[1];

	// Try to find plain URL
	const urlMatch = content.match(
		/(https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp))/i
	);
	if (urlMatch) return urlMatch[0];

	return null;
};

// Helper function to create excerpt from blog content
const createExcerpt = (content, maxLength = 150) => {
	if (!content) return "";

	// Remove markdown/HTML tags
	const cleaned = content
		.replace(/!\[.*?\]\(.*?\)/g, "") // Remove markdown images
		.replace(/<[^>]*>/g, "") // Remove HTML tags
		.replace(/[#*_`]/g, "") // Remove markdown formatting
		.trim();

	if (cleaned.length <= maxLength) return cleaned;
	return cleaned.substring(0, maxLength) + "...";
};

const BlogCard = ({ post }) => {
	// Determine thumbnail image
	const thumbnailUrl =
		post.photoUrl || // Social posts have photoUrl
		extractFirstImage(post.blogContent) || // Extract from blog content
		"https://placehold.co/600x400/335833/FFF?text=Wildlife+Valparai";

	// Create excerpt
	const excerpt =
		post.type === "blog"
			? createExcerpt(post.blogContent, 150)
			: post.title || "";

	// Format date
	const formattedDate = post.createdAt
		? new Date(post.createdAt.toDate()).toLocaleDateString("en-US", {
				year: "numeric",
				month: "long",
				day: "numeric",
		  })
		: "Unknown date";

	return (
		<div className="group overflow-hidden rounded-lg shadow-md bg-white border border-gray-100 transition-shadow hover:shadow-xl">
			<div className="grid grid-cols-1 md:grid-cols-3">
				{/* Image */}
				<div className="md:col-span-1 overflow-hidden">
					<img
						src={thumbnailUrl}
						alt={post.title}
						className="h-48 md:h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
						onError={(e) => {
							e.target.src =
								"https://placehold.co/600x400/335833/FFF?text=No+Image";
						}}
					/>
				</div>
				{/* Content */}
				<div className="md:col-span-2 p-5 flex flex-col justify-center">
					{/* Post Type Badge */}
					<span
						className={`text-xs font-semibold px-2 py-1 rounded w-fit mb-2 ${
							post.type === "blog"
								? "bg-blue-100 text-blue-800"
								: "bg-green-100 text-green-800"
						}`}
					>
						{post.type === "blog" ? "Blog" : "Photo/Audio"}
					</span>

					<h2 className="text-lg font-bold text-gray-900 mb-2 leading-tight">
						<Link
							to={`/blog/${post.id}`}
							className="hover:text-[#335833] transition-colors"
						>
							{post.title || "Untitled Post"}
						</Link>
					</h2>
					<p className="text-xs text-gray-500 mb-3">
						By {post.creatorUsername || "Anonymous"} | {formattedDate}
					</p>
					<p className="text-gray-700 text-sm mb-4 line-clamp-2">{excerpt}</p>

					{/* Engagement Stats */}
					<div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
						<span className="flex items-center gap-1">
							<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
								<path
									fillRule="evenodd"
									d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
									clipRule="evenodd"
								/>
							</svg>
							{post.likeCount || 0}
						</span>
						<span className="flex items-center gap-1">
							<svg
								className="w-4 h-4"
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
							{post.commentCount || 0}
						</span>
					</div>

					<Link
						to={`/blog/${post.id}`}
						className="inline-flex items-center text-sm font-semibold text-[#335833] hover:text-black transition-colors"
					>
						Read More <FaArrowRight className="ml-1 w-3 h-3" />
					</Link>
				</div>
			</div>
		</div>
	);
};

export default BlogCard;
