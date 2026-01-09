import React, { useState, useRef, useEffect } from "react";
import { auth } from "../services/firebase.js";
import {
	toggleLike,
	getUserLikeStatus,
	recordShare,
} from "../services/socialApi.js";
import { getPostComments, addPostComment } from "../services/uploadPost.js";
import toast from "react-hot-toast";
import {
	AiFillPlayCircle,
	AiFillPauseCircle,
	AiFillHeart,
	AiOutlineHeart,
	AiOutlineMessage,
	AiOutlineSend,
} from "react-icons/ai";
import { HiDotsHorizontal } from "react-icons/hi";

// Waveform Animation Component
const Waveform = ({ isPlaying }) => {
	const bars = Array.from(
		{ length: 40 }, // Increased bar count for full width
		() => Math.floor(Math.random() * 60) + 20
	);

	return (
		<div className="flex items-center justify-center gap-[3px] h-8 w-full px-2">
			{bars.map((height, index) => (
				<div
					key={index}
					className={`w-[3px] bg-white rounded-full transition-all duration-200 ${
						isPlaying ? "animate-wave" : ""
					}`}
					style={{
						height: `${height}%`,
						animationDelay: `${index * 0.05}s`,
					}}
				/>
			))}
			<style jsx>{`
				@keyframes wave {
					0%,
					100% {
						transform: scaleY(1);
						opacity: 0.8;
					}
					50% {
						transform: scaleY(1.5);
						opacity: 1;
					}
				}
				.animate-wave {
					animation: wave 0.8s ease-in-out infinite;
				}
			`}</style>
		</div>
	);
};

const SocialCard = ({ post, onUpdate }) => {
	const [isPlaying, setIsPlaying] = useState(false);
	const [isLiked, setIsLiked] = useState(false);

	// Stats State
	const [likeCount, setLikeCount] = useState(post.likeCount || 0);
	const [shareCount, setShareCount] = useState(post.shareCount || 0);
	const [comments, setComments] = useState([]);

	// Comment Input State
	const [newComment, setNewComment] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showComments, setShowComments] = useState(false); // Toggle comment section

	// Audio State
	const [duration, setDuration] = useState("0:00");
	const [currentTime, setCurrentTime] = useState("0:00");

	const audioRef = useRef(null);
	const inputRef = useRef(null);
	const currentUser = auth.currentUser;

	useEffect(() => {
		checkLikeStatus();
		if (showComments) {
			fetchComments();
		}
	}, [post.id, currentUser, showComments]);

	const checkLikeStatus = async () => {
		if (!currentUser) return;
		try {
			const liked = await getUserLikeStatus(post.id, currentUser.uid);
			setIsLiked(liked);
		} catch (error) {
			console.error(error);
		}
	};

	const fetchComments = async () => {
		try {
			const fetchedComments = await getPostComments(post.id);
			setComments(fetchedComments);
		} catch (error) {
			console.error("Error fetching comments:", error);
		}
	};

	const formatTime = (seconds) => {
		if (!isFinite(seconds)) return "0:00";
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60)
			.toString()
			.padStart(2, "0");
		return `${mins}:${secs}`;
	};

	const handlePlayPause = () => {
		if (audioRef.current) {
			if (isPlaying) {
				audioRef.current.pause();
			} else {
				document.querySelectorAll("audio").forEach((el) => {
					if (el !== audioRef.current) el.pause();
				});
				audioRef.current.play();
			}
			setIsPlaying(!isPlaying);
		}
	};

	const handleAudioEnded = () => {
		setIsPlaying(false);
		setCurrentTime("0:00");
	};

	const handleTimeUpdate = () => {
		if (audioRef.current) {
			setCurrentTime(formatTime(audioRef.current.currentTime));
		}
	};

	const handleLoadedMetadata = (e) => {
		if (isFinite(e.currentTarget.duration)) {
			setDuration(formatTime(e.currentTarget.duration));
		}
	};

	const handleLike = async () => {
		if (!currentUser) {
			toast.error("Please login to like");
			return;
		}
		setIsLiked(!isLiked);
		setLikeCount((prev) => (!isLiked ? prev + 1 : prev - 1));

		try {
			await toggleLike(
				post.id,
				currentUser.uid,
				currentUser.displayName || "Anonymous"
			);
			if (onUpdate) await onUpdate();
		} catch (error) {
			setIsLiked(!isLiked);
			setLikeCount((prev) => (isLiked ? prev + 1 : prev - 1));
			console.error(error);
		}
	};

	const handleShare = async () => {
		const shareUrl = `${window.location.origin}/socials/${post.id}`;
		await navigator.clipboard.writeText(shareUrl);
		toast.success("Link copied!");

		if (currentUser) {
			try {
				await recordShare(post.id, currentUser.uid);
				setShareCount((prev) => prev + 1);
				if (onUpdate) await onUpdate();
			} catch (error) {
				console.error("Error recording share:", error);
			}
		}
	};

	const handleCommentSubmit = async (e) => {
		e.preventDefault();
		if (!newComment.trim()) return;

		if (!currentUser) {
			toast.error("Please login to comment");
			return;
		}

		setIsSubmitting(true);
		try {
			await addPostComment(
				post.id,
				currentUser.uid,
				currentUser.displayName || "Anonymous",
				newComment.trim()
			);

			setNewComment("");
			fetchComments();
			if (onUpdate) onUpdate();
			toast.success("Comment posted!");
		} catch (error) {
			console.error("Error posting comment:", error);
			toast.error("Failed to post comment");
		} finally {
			setIsSubmitting(false);
		}
	};

	const toggleComments = () => {
		setShowComments(!showComments);
		if (!showComments) {
			setTimeout(() => {
				inputRef.current?.focus();
			}, 100);
		}
	};

	return (
		<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300 mb-6">
			{/* 1. Header: User Info */}
			<div className="p-4 flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border border-gray-100">
						<img
							src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
								post.creatorUsername || "User"
							)}&background=random`}
							alt={post.creatorUsername}
							className="w-full h-full object-cover"
						/>
					</div>
					<div>
						<h3 className="font-bold text-gray-900 text-sm leading-none mb-1">
							{post.creatorUsername || "Anonymous"}
						</h3>
						<p className="text-gray-500 text-xs">
							{post.createdAt?.toDate
								? new Date(post.createdAt.toDate()).toLocaleDateString(
										"en-US",
										{
											month: "short",
											day: "numeric",
											hour: "numeric",
											minute: "numeric",
										}
								  )
								: "Just now"}
						</p>
					</div>
				</div>
				<button className="text-gray-400 hover:text-gray-600">
					<HiDotsHorizontal size={20} />
				</button>
			</div>

			{/* 2. Caption */}
			{post.title && (
				<div className="px-4 pb-3">
					<p className="text-gray-800 text-sm leading-relaxed">{post.title}</p>
				</div>
			)}

			{/* 3. Media: Image (16:9 Aspect Ratio) */}
			<div className="w-full aspect-video bg-gray-100 relative overflow-hidden">
				<img
					src={post.photoUrl || "https://placehold.co/800x450?text=No+Image"}
					alt={post.title}
					className="w-full h-full object-cover"
				/>
			</div>

			{/* 4. Audio Player (If exists) */}
			{post.audioUrl && (
				<div className="px-4 pt-4">
					<div className="bg-[#A3B18A] rounded-xl p-3 flex items-center gap-3 relative overflow-hidden shadow-sm">
						<button
							onClick={handlePlayPause}
							className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#3F4F3A] shadow-sm hover:scale-105 transition-transform flex-shrink-0 z-10"
						>
							{isPlaying ? (
								<AiFillPauseCircle size={24} />
							) : (
								<AiFillPlayCircle size={24} className="ml-0.5" />
							)}
						</button>

						<div className="flex-1 h-8 flex items-center z-10 overflow-hidden">
							<Waveform isPlaying={isPlaying} />
						</div>

						<span className="text-white text-[10px] font-medium font-mono z-10 opacity-90 whitespace-nowrap min-w-[50px] text-right">
							{currentTime} / {duration}
						</span>

						<audio
							ref={audioRef}
							src={post.audioUrl}
							onEnded={handleAudioEnded}
							onTimeUpdate={handleTimeUpdate}
							onLoadedMetadata={handleLoadedMetadata}
						/>
					</div>
				</div>
			)}

			{/* 5. Action Bar */}
			<div className="p-4 flex items-center gap-6 border-b border-gray-50">
				<div className="flex items-center gap-2">
					<button onClick={handleLike} className="group focus:outline-none">
						{isLiked ? (
							<AiFillHeart size={26} className="text-red-500" />
						) : (
							<AiOutlineHeart
								size={26}
								className="text-gray-600 group-hover:text-red-500 group-hover:scale-110 transition-all"
							/>
						)}
					</button>
					<span className="text-sm font-semibold text-gray-700">
						{likeCount}
					</span>
				</div>

				<div className="flex items-center gap-2">
					<button onClick={toggleComments} className="group focus:outline-none">
						<AiOutlineMessage
							size={26}
							className="text-gray-600 group-hover:text-[#335833] group-hover:scale-110 transition-all"
						/>
					</button>
					<span className="text-sm font-semibold text-gray-700">
						{post.commentCount || 0}
					</span>
				</div>

				<div className="flex items-center gap-2 ml-auto">
					<button onClick={handleShare} className="group focus:outline-none">
						<AiOutlineSend
							size={24}
							className="text-gray-600 -rotate-45 mb-1 group-hover:text-[#335833] group-hover:scale-110 transition-all"
						/>
					</button>
				</div>
			</div>

			{/* 6. Comments Section */}
			{showComments && (
				<div className="bg-gray-50 p-4 animate-in fade-in slide-in-from-top-2 duration-200">
					{/* Comment List */}
					<div className="space-y-3 mb-4 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 pr-2">
						{comments.length > 0 ? (
							comments.map((comment, idx) => (
								<div key={comment.id || idx} className="flex gap-2.5">
									<div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden shrink-0 mt-0.5">
										<img
											src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
												comment.username || "User"
											)}&background=random`}
											alt="avatar"
											className="w-full h-full object-cover"
										/>
									</div>
									<div className="bg-white p-2 rounded-r-xl rounded-bl-xl shadow-sm text-sm">
										<span className="font-bold text-gray-900 block text-xs mb-0.5">
											{comment.username}
										</span>
										<p className="text-gray-700">{comment.text}</p>
									</div>
								</div>
							))
						) : (
							<p className="text-xs text-gray-400 text-center py-2">
								No comments yet. Be the first!
							</p>
						)}
					</div>

					{/* Input */}
					<form
						onSubmit={handleCommentSubmit}
						className="relative flex items-center"
					>
						<input
							ref={inputRef}
							type="text"
							value={newComment}
							onChange={(e) => setNewComment(e.target.value)}
							placeholder="Add a comment..."
							className="w-full bg-white border border-gray-300 rounded-full py-2.5 pl-4 pr-10 text-sm focus:outline-none focus:border-[#335833] focus:ring-1 focus:ring-[#335833] transition-all"
						/>
						<button
							type="submit"
							disabled={!newComment.trim() || isSubmitting}
							className="absolute right-2 p-1.5 text-[#335833] hover:bg-green-50 rounded-full transition-colors disabled:opacity-50"
						>
							<AiOutlineSend
								size={16}
								className={newComment.trim() ? "" : "opacity-50"}
							/>
						</button>
					</form>
				</div>
			)}
		</div>
	);
};

export default SocialCard;
