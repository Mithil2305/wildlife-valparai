import React, { useState, useRef, useEffect } from "react";
import { auth } from "../services/firebase.js";
import { toggleLike, getUserLikeStatus } from "../services/socialApi.js";
import toast from "react-hot-toast";
import {
	FaPlay,
	FaPause,
	FaHeart,
	FaRegHeart,
	FaRegComment,
	FaShareAlt,
} from "react-icons/fa";
import Comments from "../blogs/Comments.jsx";

const SocialCard = ({ post }) => {
	const [isPlaying, setIsPlaying] = useState(false);
	const [isLiked, setIsLiked] = useState(false);
	const [likeCount, setLikeCount] = useState(post.likeCount || 0);
	const [showComments, setShowComments] = useState(false);
	const [duration, setDuration] = useState("0:00");
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
	};

	const handleLike = async () => {
		if (!currentUser) {
			toast.error("Please login to like posts");
			return;
		}

		const previousLiked = isLiked;
		const previousCount = likeCount;

		setIsLiked(!isLiked);
		setLikeCount((prev) => (!isLiked ? prev + 1 : prev - 1));

		try {
			await toggleLike(
				post.id,
				currentUser.uid,
				currentUser.displayName || "Anonymous"
			);
		} catch (error) {
			console.error("Error toggling like:", error);
			setIsLiked(previousLiked);
			setLikeCount(previousCount);
			toast.error("Failed to update like");
		}
	};

	const handleShare = () => {
		const shareUrl = `${window.location.origin}/socials/${post.id}`;
		if (navigator.share) {
			navigator
				.share({
					title: post.title,
					text: post.title,
					url: shareUrl,
				})
				.catch((error) => console.log("Error sharing:", error));
		} else {
			navigator.clipboard.writeText(shareUrl);
			toast.success("Link copied to clipboard!");
		}
	};

	const Waveform = () => (
		<div className="flex items-center gap-[2px] h-8 w-full">
			{[...Array(40)].map((_, i) => {
				const height = Math.floor(Math.random() * 100) + 20 + "%";
				return (
					<div
						key={i}
						className={`w-1 rounded-full ${
							isPlaying ? "animate-pulse bg-white" : "bg-white/70"
						}`}
						style={{ height: height }}
					/>
				);
			})}
		</div>
	);

	return (
		<div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow p-4 flex flex-col md:flex-row gap-6">
			<div className="md:w-56 md:h-56 w-full h-64 flex-shrink-0 relative rounded-2xl overflow-hidden bg-gray-100">
				<img
					src={
						post.photoUrl ||
						"https://placehold.co/400x400/9ca3af/white?text=No+Image"
					}
					alt={post.title}
					className="w-full h-full object-cover"
				/>
			</div>

			<div className="flex-grow flex flex-col justify-center min-w-0">
				{post.audioUrl && (
					<div className="bg-[#A3B18A] rounded-2xl p-3 flex items-center gap-4 mb-4 shadow-sm relative overflow-hidden">
						<button
							onClick={handlePlayPause}
							className="flex-shrink-0 w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#588157] shadow-sm hover:scale-105 transition-transform z-10"
						>
							{isPlaying ? (
								<FaPause size={14} />
							) : (
								<FaPlay size={14} className="ml-1" />
							)}
						</button>

						<div className="flex-grow flex items-center justify-center h-10 z-10">
							<Waveform />
						</div>

						<span className="text-white text-xs font-medium w-8 text-right z-10">
							{duration}
						</span>

						<audio
							ref={audioRef}
							src={post.audioUrl}
							onEnded={handleAudioEnded}
							onLoadedMetadata={(e) => {
								if (isFinite(e.currentTarget.duration)) {
									const minutes = Math.floor(e.currentTarget.duration / 60);
									const seconds = Math.floor(e.currentTarget.duration % 60)
										.toString()
										.padStart(2, "0");
									setDuration(`${minutes}:${seconds}`);
								}
							}}
						/>
					</div>
				)}

				<div className="mb-4">
					<h3 className="font-bold text-gray-900 text-lg mb-1 truncate">
						{post.creatorUsername || "Anonymous"}
					</h3>
					<p className="text-gray-600 text-sm line-clamp-2">
						{post.title || "No description provided."}
					</p>
				</div>

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
								<FaHeart className="text-red-500" />
							) : (
								<FaRegHeart className="text-gray-600" />
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
							<FaRegComment className="text-gray-600" />
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
							<FaShareAlt className="text-gray-600" />
						</div>
						<span className="text-sm font-medium text-gray-600">Share</span>
					</button>
				</div>

				{showComments && (
					<div className="mt-4 border-t border-gray-100">
						<Comments postId={post.id} />
					</div>
				)}
			</div>
		</div>
	);
};

export default SocialCard;
