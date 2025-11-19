import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

// Helper function to strip HTML tags and get plain text
const stripHtml = (html) => {
	if (!html) return "";
	const tmp = document.createElement("DIV");
	tmp.innerHTML = html;
	return tmp.textContent || tmp.innerText || "";
};

// Helper function to extract first image from blog content
const extractFirstImage = (content) => {
	if (!content) return null;

	// Try to find HTML img tag
	const htmlMatch = content.match(/<img[^>]+src="([^">]+)"/);
	if (htmlMatch) return htmlMatch[1];

	// Try to find image in markdown format ![alt](url)
	const markdownMatch = content.match(/!\[.*?\]\((.*?)\)/);
	if (markdownMatch) return markdownMatch[1];

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

	// Strip all HTML tags and get plain text
	const plainText = stripHtml(content);

	// Remove extra whitespace
	const cleaned = plainText.replace(/\s+/g, " ").trim();

	if (cleaned.length <= maxLength) return cleaned;
	return cleaned.substring(0, maxLength) + "...";
};

const BlogCard = ({ post }) => {
	// Determine thumbnail image from blog content
	const thumbnailUrl =
		extractFirstImage(post.blogContent) ||
		"https://placehold.co/600x400/335833/FFF?text=Wildlife+Valparai";

	// Create excerpt from blog content
	const excerpt = createExcerpt(post.blogContent, 150);

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
						alt={post.title || "Blog post"}
						className="h-48 md:h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
						onError={(e) => {
							e.target.src =
								"https://placehold.co/600x400/335833/FFF?text=No+Image";
						}}
					/>
				</div>
				{/* Content */}
				<div className="md:col-span-2 p-5 flex flex-col justify-center">
					<h2 className="text-lg font-bold text-gray-900 mb-2 leading-tight line-clamp-2">
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
					<p className="text-gray-700 text-sm mb-4 line-clamp-3">{excerpt}</p>
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
