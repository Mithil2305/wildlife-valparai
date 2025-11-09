import { Link } from "react-router-dom";
import { formatDate } from "../../utils/formatDate";

const PostCard = ({ post, type = "sighting", className = "" }) => {
	// type can be 'sighting' or 'blog'

	const getTags = () => {
		if (type === "sighting") {
			return [post.species, post.location].filter(Boolean);
		}
		return post.tags || [];
	};

	const getLink = () => {
		return type === "blog" ? `/blogs/${post.id}` : `/sightings/${post.id}`;
	};

	return (
		<Link to={getLink()} className={`group ${className}`}>
			<div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 border-2 border-[#9DC08B]/20 overflow-hidden h-full flex flex-col">
				{/* Image Section */}
				<div className="relative h-48 overflow-hidden">
					<img
						src={post.imageUrl || "/placeholder-wildlife.jpg"}
						alt={post.title}
						className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
					/>

					{/* Gradient Overlay */}
					<div className="absolute inset-0 bg-gradient-to-t from-[#40513B]/60 to-transparent"></div>

					{/* Status Badge */}
					{post.status && (
						<div
							className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm ${
								post.status === "approved"
									? "bg-green-500/80 text-white"
									: post.status === "pending"
										? "bg-yellow-500/80 text-white"
										: "bg-red-500/80 text-white"
							}`}
						>
							{post.status.charAt(0).toUpperCase() + post.status.slice(1)}
						</div>
					)}

					{/* Points Badge (for sightings) */}
					{type === "sighting" && post.points && (
						<div className="absolute top-3 left-3 px-3 py-1 bg-gradient-to-r from-[#609966] to-[#40513B] rounded-full text-white text-xs font-bold backdrop-blur-sm flex items-center space-x-1">
							<span>⭐</span>
							<span>{post.points}</span>
						</div>
					)}

					{/* Audio Indicator */}
					{post.hasAudio && (
						<div className="absolute bottom-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-lg backdrop-blur-sm">
							🎵
						</div>
					)}
				</div>

				{/* Content Section */}
				<div className="p-4 flex-1 flex flex-col">
					{/* Title */}
					<h3 className="text-lg font-bold text-[#40513B] mb-2 group-hover:text-[#609966] transition-colors line-clamp-2">
						{post.title}
					</h3>

					{/* Description */}
					{post.description && (
						<p className="text-[#609966] text-sm mb-3 line-clamp-3 flex-1">
							{post.description}
						</p>
					)}

					{/* Tags */}
					{getTags().length > 0 && (
						<div className="flex flex-wrap gap-2 mb-3">
							{getTags()
								.slice(0, 3)
								.map((tag, index) => (
									<span
										key={index}
										className="px-2 py-1 bg-gradient-to-r from-[#EDF1D6] to-[#9DC08B]/30 text-[#40513B] text-xs rounded-lg font-medium border border-[#9DC08B]/30"
									>
										{tag}
									</span>
								))}
							{getTags().length > 3 && (
								<span className="px-2 py-1 text-[#609966] text-xs font-medium">
									+{getTags().length - 3}
								</span>
							)}
						</div>
					)}

					{/* Footer */}
					<div className="flex items-center justify-between pt-3 border-t border-[#9DC08B]/20 mt-auto">
						{/* Author Info */}
						<div className="flex items-center space-x-2">
							<div className="w-8 h-8 bg-gradient-to-r from-[#9DC08B] to-[#609966] rounded-full flex items-center justify-center text-sm font-bold text-white">
								{post.authorPhoto ? (
									<img
										src={post.authorPhoto}
										alt={post.author}
										className="w-8 h-8 rounded-full"
									/>
								) : (
									post.author?.charAt(0).toUpperCase() || "?"
								)}
							</div>
							<div className="min-w-0 flex-1">
								<p className="text-xs font-medium text-[#40513B] truncate">
									{post.author || "Anonymous"}
								</p>
								<p className="text-xs text-[#609966]">
									{formatDate(post.createdAt)}
								</p>
							</div>
						</div>

						{/* Stats */}
						<div className="flex items-center space-x-3 text-[#609966]">
							{post.views && (
								<div className="flex items-center space-x-1" title="Views">
									<span className="text-sm">👁️</span>
									<span className="text-xs font-medium">{post.views}</span>
								</div>
							)}
							{post.likes && (
								<div className="flex items-center space-x-1" title="Likes">
									<span className="text-sm">❤️</span>
									<span className="text-xs font-medium">{post.likes}</span>
								</div>
							)}
							{post.comments && (
								<div className="flex items-center space-x-1" title="Comments">
									<span className="text-sm">💬</span>
									<span className="text-xs font-medium">{post.comments}</span>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</Link>
	);
};

export default PostCard;
