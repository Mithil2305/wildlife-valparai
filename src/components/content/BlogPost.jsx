import { useState } from "react";
import { formatDate } from "../../utils/formatDate";
import { useAuth } from "../../hooks/useAuth";
import AudioPlayer from "../common/AudioPlayer";

const BlogPost = ({ blog, onLike, onComment }) => {
	const [isLiked, setIsLiked] = useState(false);
	const [showComments, setShowComments] = useState(false);
	const [commentText, setCommentText] = useState("");
	const { user } = useAuth();

	const handleLike = () => {
		setIsLiked(!isLiked);
		if (onLike) onLike(blog.id);
	};

	const handleCommentSubmit = (e) => {
		e.preventDefault();
		if (commentText.trim() && onComment) {
			onComment(blog.id, commentText);
			setCommentText("");
		}
	};

	return (
		<article className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border-2 border-[#9DC08B]/20 overflow-hidden">
			{/* Header Image */}
			{blog.imageUrl && (
				<div className="relative h-64 md:h-96 overflow-hidden">
					<img
						src={blog.imageUrl}
						alt={blog.title}
						className="w-full h-full object-cover"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-[#40513B]/80 via-transparent to-transparent"></div>

					{/* Title Overlay */}
					<div className="absolute bottom-0 left-0 right-0 p-8 text-white">
						<div className="flex flex-wrap gap-2 mb-4">
							{blog.tags?.map((tag, index) => (
								<span
									key={index}
									className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium"
								>
									{tag}
								</span>
							))}
						</div>
						<h1 className="text-3xl md:text-4xl font-bold mb-2">
							{blog.title}
						</h1>
					</div>
				</div>
			)}

			{/* Content */}
			<div className="p-6 md:p-8">
				{/* Author and Meta Info */}
				<div className="flex items-center justify-between mb-6 pb-6 border-b border-[#9DC08B]/20">
					<div className="flex items-center space-x-3">
						<div className="w-12 h-12 bg-gradient-to-r from-[#9DC08B] to-[#609966] rounded-full flex items-center justify-center text-lg font-bold text-white">
							{blog.authorPhoto ? (
								<img
									src={blog.authorPhoto}
									alt={blog.author}
									className="w-12 h-12 rounded-full"
								/>
							) : (
								blog.author?.charAt(0).toUpperCase() || "?"
							)}
						</div>
						<div>
							<p className="font-bold text-[#40513B]">{blog.author}</p>
							<p className="text-sm text-[#609966]">
								{formatDate(blog.createdAt)}
							</p>
						</div>
					</div>

					<div className="flex items-center space-x-4 text-[#609966]">
						<div className="flex items-center space-x-1" title="Reading time">
							<span>⏱️</span>
							<span className="text-sm">{blog.readTime || "5"} min</span>
						</div>
						<div className="flex items-center space-x-1" title="Views">
							<span>👁️</span>
							<span className="text-sm">{blog.views || 0}</span>
						</div>
					</div>
				</div>

				{/* Blog Content */}
				<div className="prose prose-lg max-w-none mb-8">
					<div className="text-[#40513B] leading-relaxed whitespace-pre-wrap">
						{blog.content}
					</div>
				</div>

				{/* Audio Player (if available) */}
				{blog.audioUrl && (
					<div className="mb-8">
						<AudioPlayer audioUrl={blog.audioUrl} title="Listen to this blog" />
					</div>
				)}

				{/* Action Bar */}
				<div className="flex items-center justify-between py-4 border-t border-b border-[#9DC08B]/20">
					<div className="flex items-center space-x-4">
						{/* Like Button */}
						<button
							onClick={handleLike}
							className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all ${
								isLiked
									? "bg-gradient-to-r from-[#609966] to-[#40513B] text-white scale-105"
									: "bg-[#EDF1D6] text-[#609966] hover:bg-[#9DC08B]/30"
							}`}
						>
							<span className="text-lg">{isLiked ? "❤️" : "🤍"}</span>
							<span>{(blog.likes || 0) + (isLiked ? 1 : 0)}</span>
						</button>

						{/* Comment Button */}
						<button
							onClick={() => setShowComments(!showComments)}
							className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#EDF1D6] text-[#609966] hover:bg-[#9DC08B]/30 font-medium transition-all"
						>
							<span className="text-lg">💬</span>
							<span>{blog.comments?.length || 0}</span>
						</button>

						{/* Share Button */}
						<button className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#EDF1D6] text-[#609966] hover:bg-[#9DC08B]/30 font-medium transition-all">
							<span className="text-lg">📤</span>
							<span>Share</span>
						</button>
					</div>

					{/* Bookmark */}
					<button className="p-2 rounded-xl bg-[#EDF1D6] text-[#609966] hover:bg-[#9DC08B]/30 transition-all">
						<span className="text-xl">🔖</span>
					</button>
				</div>

				{/* Comments Section */}
				{showComments && (
					<div className="mt-6">
						<h3 className="text-xl font-bold text-[#40513B] mb-4 flex items-center">
							<span className="mr-2">💬</span>
							Comments ({blog.comments?.length || 0})
						</h3>

						{/* Comment Form */}
						{user ? (
							<form onSubmit={handleCommentSubmit} className="mb-6">
								<div className="flex space-x-3">
									<div className="w-10 h-10 bg-gradient-to-r from-[#9DC08B] to-[#609966] rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
										{user.photoURL ? (
											<img
												src={user.photoURL}
												alt="You"
												className="w-10 h-10 rounded-full"
											/>
										) : (
											user.displayName?.charAt(0).toUpperCase() || "?"
										)}
									</div>
									<div className="flex-1">
										<textarea
											value={commentText}
											onChange={(e) => setCommentText(e.target.value)}
											placeholder="Share your thoughts..."
											className="w-full px-4 py-3 rounded-xl border-2 border-[#9DC08B]/30 focus:border-[#609966] focus:outline-none transition-colors bg-white/50 resize-none"
											rows={3}
										/>
										<button
											type="submit"
											disabled={!commentText.trim()}
											className="mt-2 px-6 py-2 bg-gradient-to-r from-[#609966] to-[#40513B] text-white rounded-xl font-bold hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
										>
											Post Comment
										</button>
									</div>
								</div>
							</form>
						) : (
							<div className="mb-6 p-4 bg-[#EDF1D6] rounded-xl text-center">
								<p className="text-[#609966] mb-2">Please login to comment</p>
								<a
									href="/login"
									className="text-[#40513B] font-bold hover:underline"
								>
									Login here
								</a>
							</div>
						)}

						{/* Comments List */}
						<div className="space-y-4">
							{blog.comments?.map((comment, index) => (
								<div
									key={index}
									className="flex space-x-3 p-4 bg-[#EDF1D6]/50 rounded-xl"
								>
									<div className="w-10 h-10 bg-gradient-to-r from-[#9DC08B] to-[#609966] rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
										{comment.authorPhoto ? (
											<img
												src={comment.authorPhoto}
												alt={comment.author}
												className="w-10 h-10 rounded-full"
											/>
										) : (
											comment.author?.charAt(0).toUpperCase() || "?"
										)}
									</div>
									<div className="flex-1">
										<div className="flex items-center justify-between mb-1">
											<p className="font-bold text-[#40513B]">
												{comment.author}
											</p>
											<p className="text-xs text-[#609966]">
												{formatDate(comment.createdAt)}
											</p>
										</div>
										<p className="text-[#609966]">{comment.text}</p>
									</div>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</article>
	);
};

export default BlogPost;
