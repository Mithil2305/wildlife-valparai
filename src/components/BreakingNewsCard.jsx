import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

// Helper function to strip HTML tags
const stripHtml = (html) => {
	if (!html) return "";
	const tmp = document.createElement("DIV");
	tmp.innerHTML = html;
	return tmp.textContent || tmp.innerText || "";
};

// Helper function to extract first image from blog content
const extractFirstImage = (content) => {
	if (!content) return null;

	// Try to find HTML img tag first
	const htmlMatch = content.match(/<img[^>]+src="([^">]+)"/);
	if (htmlMatch) return htmlMatch[1];

	// Try markdown
	const markdownMatch = content.match(/!\[.*?\]\((.*?)\)/);
	if (markdownMatch) return markdownMatch[1];

	// Try plain URL
	const urlMatch = content.match(
		/(https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp))/i
	);
	if (urlMatch) return urlMatch[0];

	return null;
};

const createExcerpt = (content, maxLength = 200) => {
	if (!content) return "";

	// Strip HTML and clean up
	const plainText = stripHtml(content);
	const cleaned = plainText.replace(/\s+/g, " ").trim();

	if (cleaned.length <= maxLength) return cleaned;
	return cleaned.substring(0, maxLength) + "...";
};

const BreakingNewsCard = ({ post }) => {
	const thumbnailUrl =
		extractFirstImage(post.blogContent) ||
		"https://placehold.co/800x600/335833/FFF?text=Breaking+News";

	const excerpt = createExcerpt(post.blogContent, 200);

	const formattedDate = post.createdAt
		? new Date(post.createdAt.toDate()).toLocaleDateString("en-US", {
				year: "numeric",
				month: "long",
				day: "numeric",
		  })
		: "Unknown date";

	return (
		<div className="group overflow-hidden rounded-lg shadow-lg bg-white border border-gray-100">
			<div className="grid grid-cols-1 md:grid-cols-2">
				{/* Image */}
				<div className="overflow-hidden">
					<img
						src={thumbnailUrl}
						alt={post.title || "Breaking news"}
						className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
						onError={(e) => {
							e.target.src =
								"https://placehold.co/800x600/335833/FFF?text=No+Image";
						}}
					/>
				</div>
				{/* Content */}
				<div className="p-6 flex flex-col justify-center">
					<h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 leading-tight line-clamp-3">
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
					<p className="text-gray-700 mb-5 line-clamp-4">{excerpt}</p>
					<Link
						to={`/blog/${post.id}`}
						className="inline-flex items-center font-semibold text-[#335833] hover:text-black transition-colors"
					>
						Read More <FaArrowRight className="ml-2 w-3 h-3" />
					</Link>
				</div>
			</div>
		</div>
	);
};

export default BreakingNewsCard;
