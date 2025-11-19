import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

const BlogCard = ({ post }) => {
	return (
		<div className="group overflow-hidden rounded-lg shadow-md bg-white border border-gray-100 transition-shadow hover:shadow-xl">
			<div className="grid grid-cols-1 md:grid-cols-3">
				{/* Image */}
				<div className="md:col-span-1 overflow-hidden">
					<img
						src={post.imageUrl}
						alt={post.title}
						className="h-48 md:h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
					/>
				</div>
				{/* Content */}
				<div className="md:col-span-2 p-5 flex flex-col justify-center">
					<h2 className="text-lg font-bold text-gray-900 mb-2 leading-tight">
						<Link
							to={`/blog/${post.id}`}
							className="hover:text-[#335833] transition-colors"
						>
							{post.title}
						</Link>
					</h2>
					<p className="text-xs text-gray-500 mb-3">
						By {post.author} | {post.date}
					</p>
					<p className="text-gray-700 text-sm mb-4">{post.excerpt}</p>
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
