import React from "react";
import { Link } from "react-router-dom";

// Mock data
const popularPosts = [
	{
		id: 1,
		title: "கதை அல்ல நிஜம் “ரோலக்ஸ்”...",
		date: "October 18, 2025",
		imageUrl: "https://placehold.co/100x70/335833/FFF?text=Post",
	},
	{
		id: 2,
		title: "Another Popular Post...",
		date: "October 17, 2025",
		imageUrl: "https://placehold.co/100x70/335833/FFF?text=Post",
	},
	{
		id: 3,
		title: "Third Most Read Article...",
		date: "October 16, 2025",
		imageUrl: "https://placehold.co/100x70/335833/FFF?text=Post",
	},
];

const PopularPosts = () => {
	return (
		<div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
			<h3 className="text-lg font-bold text-gray-900 mb-4">Popular Posts</h3>
			<div className="space-y-4">
				{popularPosts.map((post) => (
					<Link
						key={post.id}
						to={`/blog/${post.id}`}
						className="flex items-center space-x-3 group"
					>
						<img
							src={post.imageUrl}
							alt={post.title}
							className="w-24 h-16 object-cover rounded-md flex-shrink-0"
						/>
						<div>
							<h4 className="text-sm font-semibold text-gray-800 group-hover:text-[#335833] transition-colors">
								{post.title}
							</h4>
							<p className="text-xs text-gray-500">{post.date}</p>
						</div>
					</Link>
				))}
			</div>
		</div>
	);
};

export default PopularPosts;
