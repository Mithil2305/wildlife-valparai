import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getPost, getLatestPosts } from "../services/uploadPost.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import Comments from "./Comments.jsx";
import NotFound from "../components/NotFound.jsx";
import PopularPosts from "../components/PopularPosts.jsx";
import AdContainer from "../components/AdContainer.jsx";
import SocialShareButtons from "./SocialShareButtons.jsx";
import BlogCard from "../components/BlogCard.jsx";
import {
	FaChevronLeft,
	FaChevronRight,
	FaFacebookF,
	FaInstagram,
	FaWhatsapp,
	FaYoutube,
} from "react-icons/fa";
import toast from "react-hot-toast";

// Component to render blog content with HTML and YouTube embeds
const PostContent = ({ content }) => {
	if (!content) return null;

	// Replace YouTube URLs with embeds
	const youtubeRegex =
		/(https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11}))/g;

	let processedContent = content;

	// Find all YouTube URLs and replace with iframe embeds
	processedContent = processedContent.replace(youtubeRegex, (match) => {
		const videoId = match.includes("v=")
			? match.split("v=")[1]?.substring(0, 11)
			: match.split("youtu.be/")[1]?.substring(0, 11);

		if (videoId) {
			return `<div class="relative w-full overflow-hidden rounded-lg shadow-lg my-6" style="padding-top: 56.25%;">
				<iframe 
					class="absolute top-0 left-0 w-full h-full" 
					src="https://www.youtube.com/embed/${videoId}" 
					title="YouTube video player" 
					frameborder="0" 
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
					allowfullscreen>
				</iframe>
			</div>`;
		}
		return match;
	});

	return (
		<div
			className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
			dangerouslySetInnerHTML={{ __html: processedContent }}
		/>
	);
};

const BlogDetail = () => {
	const [post, setPost] = useState(null);
	const [latestPosts, setLatestPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [currentIndex, setCurrentIndex] = useState(0);
	const { postId } = useParams();
	const postUrl = window.location.href;

	useEffect(() => {
		const fetchPost = async () => {
			setLoading(true);
			try {
				const postData = await getPost(postId);
				setPost(postData);

				// Fetch latest posts for the carousel
				const latestData = await getLatestPosts(10);
				// Filter out current post and only get blogs
				const filteredLatest = latestData
					.filter((p) => p.id !== postId && p.type === "blog")
					.slice(0, 3);
				setLatestPosts(filteredLatest);
			} catch (err) {
				console.error("Error loading post:", err);
				toast.error("Could not load post.");
			}
			setLoading(false);
		};
		if (postId) {
			fetchPost();
		}
	}, [postId]);

	const SocialLink = ({ icon: Icon, href, color }) => (
		<a
			href={href}
			target="_blank"
			rel="noopener noreferrer"
			className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-300 hover:scale-110 ${color}`}
		>
			<Icon size={20} />
		</a>
	);
	const nextPost = () => {
		setCurrentIndex((prev) => (prev === latestPosts.length - 1 ? 0 : prev + 1));
	};

	const prevPost = () => {
		setCurrentIndex((prev) => (prev === 0 ? latestPosts.length - 1 : prev - 1));
	};

	if (loading) {
		return <LoadingSpinner />;
	}

	if (!post) {
		return <NotFound />;
	}

	const formattedDate = post.createdAt
		? new Date(post.createdAt.toDate()).toLocaleDateString("en-US", {
				year: "numeric",
				month: "long",
				day: "numeric",
		  })
		: "Unknown date";

	return (
		<div className="bg-white py-12 px-4">
			<div className="container mx-auto max-w-7xl">
				<div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
					{/* Main Content Area */}
					<main className="lg:col-span-3">
						{/* Blog Header */}
						<article className="bg-white rounded-lg">
							<h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
								{post.title || "Untitled Post"}
							</h1>

							{/* Meta Info */}
							<div className="flex items-center text-sm text-gray-600 mb-6 pb-6 border-b border-gray-200">
								<span>By {post.creatorUsername || "Anonymous"}</span>
								<span className="mx-2">•</span>
								<span>{formattedDate}</span>
							</div>

							{/* Social Share Buttons */}
							<SocialShareButtons
								url={postUrl}
								title={post.title || "Check out this post"}
							/>

							{/* Blog Content */}
							<div className="mt-8">
								<PostContent content={post.blogContent} />
							</div>
						</article>

						{/* Comments Section */}
						<Comments postId={postId} />

						{/* Related Posts Section */}
						{latestPosts.length > 0 && (
							<div className="mt-12 pt-8 border-t border-gray-200">
								<div className="flex justify-between items-center mb-6">
									<h2 className="text-2xl font-bold text-gray-900">
										Related Posts
									</h2>
									<div className="flex space-x-2">
										<button
											onClick={prevPost}
											className="bg-gray-200 p-2 rounded-full hover:bg-gray-300 transition-colors"
											aria-label="Previous"
										>
											<FaChevronLeft className="text-gray-700" />
										</button>
										<button
											onClick={nextPost}
											className="bg-gray-200 p-2 rounded-full hover:bg-gray-300 transition-colors"
											aria-label="Next"
										>
											<FaChevronRight className="text-gray-700" />
										</button>
									</div>
								</div>
								<BlogCard post={latestPosts[currentIndex]} />
							</div>
						)}
					</main>

					{/* Sidebar */}
					<aside className="lg:col-span-1 space-y-6">
						<PopularPosts posts={latestPosts} />
						{/* <AdContainer />
						<AdContainer /> */}
						<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
							{/* Social Media Links */}

							<h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
								<span className="w-2 h-2 rounded-full bg-green-500"></span>
								Follow Us
							</h3>
							<div className="flex flex-wrap gap-3">
								<SocialLink
									icon={FaInstagram}
									href="https://www.instagram.com/wildlife_valparai"
									color="text-pink-600 bg-pink-50 hover:bg-pink-100"
								/>
								<SocialLink
									icon={FaFacebookF}
									href="https://www.facebook.com/profile.php?id=100070562311839"
									color="text-blue-600 bg-blue-50 hover:bg-blue-100"
								/>
								<SocialLink
									icon={FaYoutube}
									href="https://www.youtube.com/@wildlife.valparai"
									color="text-red-600 bg-red-50 hover:bg-red-100"
								/>

								<SocialLink
									icon={FaWhatsapp}
									href="https://whatsapp.com"
									color="text-green-600 bg-green-50 hover:bg-green-100"
								/>
							</div>
						</div>
					</aside>
				</div>
			</div>
		</div>
	);
};

export default BlogDetail;
