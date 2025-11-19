import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

const BreakingNewsCard = ({ post }) => {
	return (
		<div className="group overflow-hidden rounded-lg shadow-lg bg-white border border-gray-100">
			<div className="grid grid-cols-1 md:grid-cols-2">
				{/* Image */}
				<div className="overflow-hidden">
					<img
						src={post.imageUrl}
						alt={post.title}
						className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
					/>
				</div>
				{/* Content */}
				<div className="p-6 flex flex-col justify-center">
					<h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 leading-tight">
						<Link
							to={`/blog/${post.id}`}
							className="hover:text-[#335833] transition-colors"
						>
							{post.title}
						</Link>
					</h2>
					<p className="text-sm text-gray-500 mb-4">
						By {post.author} | {post.date}
					</p>
					<p className="text-gray-700 mb-5">{post.excerpt}</p>
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
