import React, { useState, useRef, useEffect } from "react";
import { auth } from "../services/firebase.js";
import {
	toggleLike,
	getUserLikeStatus,
	recordShare,
} from "../services/socialApi.js";
import toast from "react-hot-toast";
import {
	HiPlay,
	HiPause,
	HiHeart,
	HiOutlineHeart,
	HiChatAlt,
	HiShare,
} from "react-icons/hi";
import Comments from "../blogs/Comments.jsx";

const SocialCard = ({ post, onUpdate, gridView = false }) => {
	const [isPlaying, setIsPlaying] = useState(false);
	const [isLiked, setIsLiked] = useState(false);
	const [likeCount, setLikeCount] = useState(post.likeCount || 0);
	const [showComments, setShowComments] = useState(false);
	const [duration, setDuration] = useState("0:00");
	const [currentTime, setCurrentTime] = useState("0:00");
	const audioRef = useRef(null);
	const currentUser = auth.currentUser;

	useEffect(() => {
		checkLikeStatus();
	}, [post.id, currentUser]);

	const checkLikeStatus = async () => {
		if (!currentUser) return;
		try {
			const liked = await getUserLikeStatus(post.id, currentUser.uid);
			setIsLiked(liked);
		} catch (error) {
			console.error("Error checking like status:", error);
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
				// Pause all other audio elements
				document.querySelectorAll("audio").forEach((el) => {
					if (el !== audioRef.current) {
						el.pause();
					}
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
			toast.error("Please login to like posts");
			return;
		}

		const previousLiked = isLiked;
		const previousCount = likeCount;

		// Optimistic update
		setIsLiked(!isLiked);
		setLikeCount((prev) => (!isLiked ? prev + 1 : prev - 1));

		try {
			await toggleLike(
				post.id,
				currentUser.uid,
				currentUser.displayName || "Anonymous"
			);

			// Refresh data if onUpdate is provided
			if (onUpdate) {
				await onUpdate();
			}
		} catch (error) {
			console.error("Error toggling like:", error);
			// Revert on error
			setIsLiked(previousLiked);
			setLikeCount(previousCount);
			toast.error("Failed to update like");
		}
	};

	const handleShare = async () => {
		const shareUrl = `${window.location.origin}/socials/${post.id}`;

		try {
			if (navigator.share) {
				await navigator.share({
					title: post.title,
					text: post.title,
					url: shareUrl,
				});
			} else {
				await navigator.clipboard.writeText(shareUrl);
				toast.success("Link copied to clipboard!");
			}

			// Record share and award points
			if (currentUser) {
				try {
					await recordShare(post.id, currentUser.uid);

					// Refresh data if onUpdate is provided
					if (onUpdate) {
						await onUpdate();
					}
				} catch (error) {
					console.error("Error recording share:", error);
				}
			}
		} catch (error) {
			console.error("Error sharing:", error);
		}
	};

	// Grid View (Instagram-like)
	if (gridView) {
		return (
			<div className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all group">
				{/* Image Container */}
				<div className="relative aspect-square bg-gray-100 overflow-hidden">
					<img
						src={
							post.photoUrl ||
							"https://placehold.co/400x400/9ca3af/white?text=No+Image"
						}
						alt={post.title}
						className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
					/>

					{/* Overlay with Audio Player */}
					{post.audioUrl && (
						<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
							<div className="absolute bottom-0 left-0 right-0 p-4">
								<div className="flex items-center gap-3">
									<button
										onClick={handlePlayPause}
										className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#335833] shadow-lg hover:scale-110 transition-transform flex-shrink-0"
									>
										{isPlaying ? (
											<HiPause size={20} />
										) : (
											<HiPlay size={20} className="ml-1" />
										)}
									</button>
									<div className="flex-1 text-white text-sm font-medium">
										<div className="flex items-center justify-between">
											<span>{isPlaying ? currentTime : "0:00"}</span>
											<span>{duration}</span>
										</div>
									</div>
								</div>
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

					{/* Stats Overlay */}
					<div className="absolute top-3 right-3 flex gap-2">
						<div className="bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
							<HiHeart size={12} />
							{likeCount}
						</div>
						<div className="bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
							<HiChatAlt size={12} />
							{post.commentCount || 0}
						</div>
					</div>
				</div>

				{/* Content */}
				<div className="p-4">
					<div className="flex items-center gap-3 mb-2">
						<img
							src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
								post.creatorUsername || "Anonymous"
							)}&size=32&background=335833&color=fff`}
							alt={post.creatorUsername}
							className="w-8 h-8 rounded-full"
						/>
						<div className="flex-1 min-w-0">
							<p className="font-semibold text-gray-900 text-sm truncate">
								{post.creatorUsername || "Anonymous"}
							</p>
						</div>
					</div>

					<p className="text-gray-600 text-sm line-clamp-2 mb-3">
						{post.title || "No description"}
					</p>

					{/* Actions */}
					<div className="flex items-center gap-4 pt-3 border-t border-gray-100">
						<button
							onClick={handleLike}
							className="flex items-center gap-1.5 text-sm group/like"
						>
							{isLiked ? (
								<HiHeart className="text-red-500 text-lg" />
							) : (
								<HiOutlineHeart className="text-gray-600 group-hover/like:text-red-500 text-lg transition-colors" />
							)}
						</button>

						<button
							onClick={() => setShowComments(!showComments)}
							className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900"
						>
							<HiChatAlt size={18} />
						</button>

						<button
							onClick={handleShare}
							className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 ml-auto"
						>
							<HiShare size={18} />
						</button>
					</div>

					{/* Comments Section */}
					{showComments && (
						<div className="mt-4 pt-4 border-t border-gray-100">
							<Comments postId={post.id} />
						</div>
					)}
				</div>
			</div>
		);
	}

	// List View (Original Design)
	return (
		<div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow p-4 flex flex-col md:flex-row gap-6">
			{/* Image */}
			<div className="md:w-56 md:h-56 w-full h-64 shrink-0 relative rounded-2xl overflow-hidden bg-gray-100">
				<img
					src={
						post.photoUrl ||
						"https://placehold.co/400x400/9ca3af/white?text=No+Image"
					}
					alt={post.title}
					className="w-full h-full object-cover"
				/>
			</div>

			{/* Content */}
			<div className="grow flex flex-col justify-center min-w-0">
				{/* Audio Player */}
				{post.audioUrl && (
					<div className="bg-[#A3B18A] rounded-2xl p-3 flex items-center gap-4 mb-4 shadow-sm relative overflow-hidden">
						<button
							onClick={handlePlayPause}
							className="shrink-0 w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#588157] shadow-sm hover:scale-105 transition-transform z-10"
						>
							{isPlaying ? (
								<HiPause size={14} />
							) : (
								<HiPlay size={14} className="ml-1" />
							)}
						</button>

						<div className="grow flex flex-col z-10">
							<div className="flex items-center justify-between text-white text-xs mb-1">
								<span>{isPlaying ? currentTime : "0:00"}</span>
								<span>{duration}</span>
							</div>
							<div className="w-full bg-white/30 rounded-full h-1">
								<div
									className="bg-white h-1 rounded-full transition-all"
									style={{
										width: audioRef.current
											? `${
													(audioRef.current.currentTime /
														audioRef.current.duration) *
														100 || 0
											  }%`
											: "0%",
									}}
								/>
							</div>
						</div>

						<audio
							ref={audioRef}
							src={post.audioUrl}
							onEnded={handleAudioEnded}
							onTimeUpdate={handleTimeUpdate}
							onLoadedMetadata={handleLoadedMetadata}
						/>
					</div>
				)}

				{/* Post Info */}
				<div className="mb-4">
					<h3 className="font-bold text-gray-900 text-lg mb-1 truncate">
						{post.creatorUsername || "Anonymous"}
					</h3>
					<p className="text-gray-600 text-sm line-clamp-2">
						{post.title || "No description provided."}
					</p>
				</div>

				{/* Actions */}
				<div className="flex items-center gap-6">
					<button
						onClick={handleLike}
						className="flex items-center gap-2 group"
					>
						<div
							className={`p-2 rounded-full ${
								isLiked ? "bg-red-50" : "bg-gray-50 group-hover:bg-gray-100"
							}`}
						>
							{isLiked ? (
								<HiHeart className="text-red-500" />
							) : (
								<HiOutlineHeart className="text-gray-600" />
							)}
						</div>
						<span className="text-sm font-medium text-gray-600">
							{likeCount > 1000
								? `${(likeCount / 1000).toFixed(1)}k`
								: likeCount}
						</span>
					</button>

					<button
						className="flex items-center gap-2 group"
						onClick={() => setShowComments(!showComments)}
					>
						<div className="p-2 rounded-full bg-gray-50 group-hover:bg-gray-100">
							<HiChatAlt className="text-gray-600" />
						</div>
						<span className="text-sm font-medium text-gray-600">
							{post.commentCount || 0}
						</span>
					</button>

					<button
						onClick={handleShare}
						className="flex items-center gap-2 group"
					>
						<div className="p-2 rounded-full bg-gray-50 group-hover:bg-gray-100">
							<HiShare className="text-gray-600" />
						</div>
						<span className="text-sm font-medium text-gray-600">Share</span>
					</button>
				</div>

				{/* Comments Section */}
				{showComments && (
					<div className="mt-4 border-t border-gray-100 pt-4">
						<Comments postId={post.id} />
					</div>
				)}
			</div>
		</div>
	);
};

export default SocialCard;
