import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getPost, getLatestPosts } from "../services/uploadPost.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import Comments from "./Comments.jsx";
import NotFound from "../components/NotFound.jsx";
import PopularPosts from "../components/PopularPosts.jsx";
import AdContainer from "../components/AdContainer.jsx";
import SocialShareButtons from "./SocialShareButtons.jsx";
import BlogCard from "../components/BlogCard.jsx";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import toast from "react-hot-toast";

// New Component: Renders blog content and replaces YouTube links with embeds
const PostContent = ({ content }) => {
	// Simple regex to find YouTube URLs
	const youtubeRegex =
		/(https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11}))/g;

	// Split content by YouTube URLs
	const parts = content.split(youtubeRegex);

	return (
		<div
			className="prose prose-lg max-w-none text-gray-800"
			style={{ whiteSpace: "pre-wrap" }}
		>
			{parts.map((part, index) => {
				if (youtubeRegex.test(part)) {
					// It's a YouTube URL, extract the video ID
					const videoId = part.split("v=")[1] || part.split("youtu.be/")[1];
					if (videoId) {
						return (
							<div
								key={index}
								className="relative w-full overflow-hidden rounded-lg shadow-lg my-6"
								style={{ paddingTop: "56.25%" }} // 16:9 Aspect Ratio
							>
								<iframe
									className="absolute top-0 left-0 w-full h-full"
									src={`https://www.youtube.com/embed/${videoId.substring(
										0,
										11
									)}`}
									title="YouTube video player"
									frameBorder="0"
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
									allowFullScreen
								></iframe>
							</div>
						);
					}
				}
				// It's regular text
				return <span key={index}>{part}</span>;
			})}
		</div>
	);
};

const BlogDetail = () => {
	const [post, setPost] = useState(null);
	const [latestPosts, setLatestPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const { postId } = useParams();
	const postUrl = window.location.href; // For social sharing

	useEffect(() => {
		const fetchPost = async () => {
			setLoading(true);
			try {
				const postData = await getPost(postId);
				setPost(postData);

				// Fetch latest posts for the bottom section
				const latestData = await getLatestPosts(3);
				// Filter out the current post
				setLatestPosts(latestData.filter((p) => p.id !== postId).slice(0, 2));
			} catch (err) {
				toast.error("Could not load post.", err);
			}
			setLoading(false);
		};
		if (postId) {
			fetchPost();
		}
	}, [postId]);

	if (loading) {
		return <LoadingSpinner />;
	}

	if (!post) {
		return <NotFound />;
	}

	return (
		<div className="bg-white py-12 px-4">
			<div className="container mx-auto max-w-7xl">
				{/* Two-column grid */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Main Content Column */}
					<main className="lg:col-span-2">
						<article>
							{/* Post Header */}
							<header className="mb-6">
								<h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
									{post.title}
								</h1>
							</header>

							{/* Main Image */}
							{post.type === "blog" && post.photoUrl && (
								<img
									src={post.photoUrl}
									alt={post.title}
									className="w-full h-auto rounded-lg shadow-lg mb-6"
								/>
							)}
							{post.type === "photoAudio" && (
								<img
									src={
										post.photoUrl ||
										"https://placehold.co/600x400/335833/FFF?text=Post+Image"
									}
									alt={post.title}
									className="w-full h-auto rounded-lg shadow-lg mb-6"
								/>
							)}

							{/* Post Content & Video */}
							{post.type === "blog" ? (
								<PostContent content={post.blogContent} />
							) : (
								<p className="prose prose-lg max-w-none text-gray-800">
									{post.blogContent}
								</p>
							)}

							{/* Audio Player (for photoAudio) */}
							{post.type === "photoAudio" && post.audioUrl && (
								<audio controls src={post.audioUrl} className="w-full mt-6">
									Your browser does not support the audio element.
								</audio>
							)}

							{/* Social Share Buttons */}
							<SocialShareButtons url={postUrl} title={post.title} />

							{/* Comments Section */}
							<Comments postId={postId} />
						</article>
					</main>

					{/* Sidebar Column */}
					<aside className="lg:col-span-1 space-y-8">
						<PopularPosts />
						<AdContainer />
						<AdContainer />
						<AdContainer />
					</aside>
				</div>

				{/* Latest on Wildlife (Bottom Section) */}
				<section className="mt-16 pt-12 border-t border-gray-200">
					<div className="flex justify-between items-center mb-6">
						<h2 className="text-2xl font-bold text-gray-900">
							Latest on Wildlife
						</h2>
						<div className="flex space-x-2">
							<button
								className="bg-gray-200 p-2 rounded-full hover:bg-gray-300 transition-colors"
								aria-label="Previous"
							>
								<FaChevronLeft className="text-gray-700" />
							</button>
							<button
								className="bg-gray-200 p-2 rounded-full hover:bg-gray-300 transition-colors"
								aria-label="Next"
							>
								<FaChevronRight className="text-gray-700" />
							</button>
						</div>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{latestPosts.map((latestPost) => (
							<BlogCard key={latestPost.id} post={latestPost} />
						))}
					</div>
				</section>
			</div>
		</div>
	);
};

export default BlogDetail;
