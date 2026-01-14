import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getPost } from "../services/uploadPost.js";
import SocialCard from "./SocialCard.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import { FaArrowLeft, FaShare, FaExclamationTriangle } from "react-icons/fa";
import toast from "react-hot-toast";

const PostDetail = () => {
	const { postId } = useParams();
	const navigate = useNavigate();
	const [post, setPost] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchPost = async () => {
			if (!postId) {
				setError("Invalid post ID");
				setLoading(false);
				return;
			}

			try {
				const fetchedPost = await getPost(postId);
				if (fetchedPost) {
					setPost(fetchedPost);
				} else {
					setError("Post not found");
				}
			} catch (err) {
				console.error("Error fetching post:", err);
				setError("Failed to load post");
			} finally {
				setLoading(false);
			}
		};

		fetchPost();
	}, [postId]);

	const handleShare = async () => {
		const shareUrl = window.location.href;
		try {
			if (navigator.share) {
				await navigator.share({
					title: post?.title || "Check out this post",
					text: `${
						post?.title || "Amazing wildlife content"
					} on Wildlife Valparai`,
					url: shareUrl,
				});
			} else {
				await navigator.clipboard.writeText(shareUrl);
				toast.success("Link copied to clipboard!");
			}
		} catch (err) {
			if (err.name !== "AbortError") {
				await navigator.clipboard.writeText(shareUrl);
				toast.success("Link copied to clipboard!");
			}
		}
	};

	const refreshPost = async () => {
		try {
			const updatedPost = await getPost(postId);
			if (updatedPost) {
				setPost(updatedPost);
			}
		} catch (err) {
			console.error("Error refreshing post:", err);
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<LoadingSpinner />
			</div>
		);
	}

	if (error || !post) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
				<div className="text-center max-w-md">
					<div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
						<FaExclamationTriangle className="w-10 h-10 text-red-500" />
					</div>
					<h1 className="text-2xl font-bold text-gray-900 mb-2">
						{error || "Post Not Found"}
					</h1>
					<p className="text-gray-600 mb-6">
						The post you're looking for might have been removed or doesn't
						exist.
					</p>
					<div className="flex flex-col sm:flex-row gap-3 justify-center">
						<button
							onClick={() => navigate("/socials")}
							className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
						>
							<FaArrowLeft size={16} />
							Go Back
						</button>
						<Link
							to="/socials"
							className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#335833] text-white rounded-xl font-medium hover:bg-[#2a4a2a] transition-colors"
						>
							Browse All Posts
						</Link>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<div className="bg-white border-b border-gray-200 sticky top-0 z-40">
				<div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
					<button
						onClick={() => navigate("/socials")}
						className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
					>
						<FaArrowLeft size={18} />
						<span className="font-medium">Back</span>
					</button>
					<h1 className="text-lg font-semibold text-gray-900">Post</h1>
					<button
						onClick={handleShare}
						className="flex items-center gap-2 text-gray-600 hover:text-[#335833] transition-colors"
					>
						<FaShare size={18} />
					</button>
				</div>
			</div>

			{/* Post Content */}
			<div className="max-w-2xl mx-auto px-4 py-6">
				<SocialCard post={post} onUpdate={refreshPost} />

				{/* Additional Info */}
				<div className="mt-6 bg-white rounded-xl border border-gray-200 p-4">
					<h3 className="text-sm font-semibold text-gray-900 mb-3">
						Share this post
					</h3>
					<div className="flex items-center gap-2">
						<input
							type="text"
							readOnly
							value={window.location.href}
							className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 truncate"
						/>
						<button
							onClick={handleShare}
							className="px-4 py-2 bg-[#335833] text-white rounded-lg text-sm font-medium hover:bg-[#2a4a2a] transition-colors whitespace-nowrap"
						>
							Copy Link
						</button>
					</div>
				</div>

				{/* Explore More */}
				<div className="mt-6 text-center">
					<Link
						to="/socials"
						className="inline-flex items-center gap-2 text-[#335833] font-medium hover:underline"
					>
						Explore more wildlife content →
					</Link>
				</div>
			</div>
		</div>
	);
};

export default PostDetail;
