import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { formatDate } from "../../utils/formatDate";

const CommentBox = ({
	postId,
	comments = [],
	onAddComment,
	onDeleteComment,
}) => {
	const [commentText, setCommentText] = useState("");
	const [replyingTo, setReplyingTo] = useState(null);
	const [replyText, setReplyText] = useState("");
	const { user } = useAuth();

	const handleSubmitComment = (e) => {
		e.preventDefault();
		if (commentText.trim() && onAddComment) {
			onAddComment(postId, commentText);
			setCommentText("");
		}
	};

	const handleSubmitReply = (commentId) => {
		if (replyText.trim() && onAddComment) {
			onAddComment(postId, replyText, commentId);
			setReplyText("");
			setReplyingTo(null);
		}
	};

	const handleDelete = (commentId) => {
		if (window.confirm("Are you sure you want to delete this comment?")) {
			onDeleteComment(commentId);
		}
	};

	return (
		<div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-2 border-[#9DC08B]/20">
			<h3 className="text-xl font-bold text-[#40513B] mb-6 flex items-center">
				<span className="mr-2">💬</span>
				Comments ({comments.length})
			</h3>

			{/* Comment Form */}
			{user ? (
				<form onSubmit={handleSubmitComment} className="mb-6">
					<div className="flex space-x-3">
						<div className="w-10 h-10 bg-gradient-to-r from-[#9DC08B] to-[#609966] rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
							{user.photoURL ? (
								<img
									src={user.photoURL}
									alt="You"
									className="w-10 h-10 rounded-full object-cover"
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
							<div className="flex justify-between items-center mt-2">
								<p className="text-xs text-[#609966]">
									{commentText.length}/500 characters
								</p>
								<button
									type="submit"
									disabled={!commentText.trim() || commentText.length > 500}
									className="px-6 py-2 bg-gradient-to-r from-[#609966] to-[#40513B] text-white rounded-xl font-bold hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
								>
									Post Comment
								</button>
							</div>
						</div>
					</div>
				</form>
			) : (
				<div className="mb-6 p-4 bg-gradient-to-r from-[#EDF1D6] to-[#9DC08B]/30 rounded-xl text-center border-2 border-[#9DC08B]/30">
					<p className="text-[#609966] mb-2">
						Please login to join the conversation
					</p>
					<a
						href="/login"
						className="inline-block px-6 py-2 bg-gradient-to-r from-[#609966] to-[#40513B] text-white rounded-xl font-bold hover:scale-105 transition-all"
					>
						Login
					</a>
				</div>
			)}

			{/* Comments List */}
			{comments.length === 0 ? (
				<div className="text-center py-8">
					<div className="text-6xl mb-4">💭</div>
					<p className="text-[#609966]">
						No comments yet. Be the first to comment!
					</p>
				</div>
			) : (
				<div className="space-y-4">
					{comments.map((comment) => (
						<div key={comment.id} className="group">
							<div className="flex space-x-3 p-4 bg-gradient-to-r from-[#EDF1D6] to-[#9DC08B]/20 rounded-xl hover:shadow-lg transition-all border border-[#9DC08B]/30">
								{/* Avatar */}
								<div className="w-10 h-10 bg-gradient-to-r from-[#9DC08B] to-[#609966] rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
									{comment.authorPhoto ? (
										<img
											src={comment.authorPhoto}
											alt={comment.author}
											className="w-10 h-10 rounded-full object-cover"
										/>
									) : (
										comment.author?.charAt(0).toUpperCase() || "?"
									)}
								</div>

								{/* Comment Content */}
								<div className="flex-1 min-w-0">
									<div className="flex items-start justify-between mb-2">
										<div>
											<p className="font-bold text-[#40513B]">
												{comment.author}
											</p>
											<p className="text-xs text-[#609966]">
												{formatDate(comment.createdAt)}
											</p>
										</div>

										{/* Actions */}
										<div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
											{user && (
												<>
													<button
														onClick={() => setReplyingTo(comment.id)}
														className="text-xs px-3 py-1 bg-white/50 hover:bg-white text-[#609966] rounded-lg transition-all"
													>
														Reply
													</button>
													{user.uid === comment.authorId && (
														<button
															onClick={() => handleDelete(comment.id)}
															className="text-xs px-3 py-1 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-all"
														>
															Delete
														</button>
													)}
												</>
											)}
										</div>
									</div>

									<p className="text-[#40513B] leading-relaxed whitespace-pre-wrap">
										{comment.text}
									</p>

									{/* Like/React */}
									<div className="flex items-center space-x-4 mt-3">
										<button className="flex items-center space-x-1 text-sm text-[#609966] hover:text-[#40513B] transition-colors">
											<span>{comment.liked ? "❤️" : "🤍"}</span>
											<span>{comment.likes || 0}</span>
										</button>
										<button
											onClick={() => setReplyingTo(comment.id)}
											className="text-sm text-[#609966] hover:text-[#40513B] transition-colors"
										>
											💬 Reply
										</button>
									</div>

									{/* Reply Form */}
									{replyingTo === comment.id && user && (
										<div className="mt-4 pl-4 border-l-2 border-[#9DC08B]/30">
											<div className="flex space-x-2">
												<textarea
													value={replyText}
													onChange={(e) => setReplyText(e.target.value)}
													placeholder={`Reply to ${comment.author}...`}
													className="flex-1 px-3 py-2 rounded-lg border-2 border-[#9DC08B]/30 focus:border-[#609966] focus:outline-none transition-colors bg-white/50 text-sm resize-none"
													rows={2}
												/>
											</div>
											<div className="flex justify-end space-x-2 mt-2">
												<button
													onClick={() => {
														setReplyingTo(null);
														setReplyText("");
													}}
													className="px-4 py-1 bg-white text-[#609966] rounded-lg text-sm hover:bg-[#EDF1D6] transition-all"
												>
													Cancel
												</button>
												<button
													onClick={() => handleSubmitReply(comment.id)}
													disabled={!replyText.trim()}
													className="px-4 py-1 bg-gradient-to-r from-[#609966] to-[#40513B] text-white rounded-lg text-sm hover:scale-105 transition-all disabled:opacity-50"
												>
													Reply
												</button>
											</div>
										</div>
									)}

									{/* Nested Replies */}
									{comment.replies && comment.replies.length > 0 && (
										<div className="mt-4 space-y-3 pl-4 border-l-2 border-[#9DC08B]/30">
											{comment.replies.map((reply) => (
												<div key={reply.id} className="flex space-x-2">
													<div className="w-8 h-8 bg-gradient-to-r from-[#9DC08B] to-[#609966] rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
														{reply.authorPhoto ? (
															<img
																src={reply.authorPhoto}
																alt={reply.author}
																className="w-8 h-8 rounded-full object-cover"
															/>
														) : (
															reply.author?.charAt(0).toUpperCase() || "?"
														)}
													</div>
													<div className="flex-1 bg-white/50 rounded-lg p-3">
														<div className="flex items-center justify-between mb-1">
															<p className="font-bold text-[#40513B] text-sm">
																{reply.author}
															</p>
															<p className="text-xs text-[#609966]">
																{formatDate(reply.createdAt)}
															</p>
														</div>
														<p className="text-[#40513B] text-sm">
															{reply.text}
														</p>
													</div>
												</div>
											))}
										</div>
									)}
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default CommentBox;
