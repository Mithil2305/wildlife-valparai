import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
	FaChevronRight,
	FaFacebookF,
	FaFire,
	FaInstagram,
	FaLeaf,
	FaTwitter,
	FaWhatsapp,
	FaYoutube,
} from "react-icons/fa";
import { getLatestPosts } from "../services/uploadPost.js";
import Leaderboard from "./Leaderboard.jsx";
import AdContainer from "./AdContainer.jsx";
import BreakingNewsCard from "./BreakingNewsCard.jsx";
import BlogCard from "./BlogCard.jsx";
import PopularPosts from "./PopularPosts.jsx";
import LoadingSpinner from "./LoadingSpinner.jsx";

const Home = () => {
	const [blogPosts, setBlogPosts] = useState([]);
	const [latestBlogs, setLatestBlogs] = useState([]);
	const [loading, setLoading] = useState(true);
	const [displayCount, setDisplayCount] = useState(6);

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
	useEffect(() => {
		fetchBlogPosts();
	}, []);

	const fetchBlogPosts = async () => {
		try {
			setLoading(true);
			const allPosts = await getLatestPosts(50);
			// Filter ONLY blog type posts
			const onlyBlogs = allPosts.filter((post) => post.type === "blog");
			setBlogPosts(onlyBlogs);
			setLatestBlogs(onlyBlogs.slice(0, 4)); // Get top 4 for features
		} catch (error) {
			console.error("Error fetching blog posts:", error);
		} finally {
			setLoading(false);
		}
	};

	const loadMore = () => {
		setDisplayCount((prev) => prev + 6);
	};

	if (loading) {
		return <LoadingSpinner />;
	}

	// Logic for "Breaking News" (Most liked recent post or first post)
	const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
	const breakingNews =
		blogPosts
			.filter((post) => (post.createdAt?.toMillis() || 0) > sevenDaysAgo)
			.sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0))[0] ||
		blogPosts[0];

	// Filter out the breaking news item from the main feed to avoid duplicates
	const mainFeedPosts = blogPosts.filter(
		(post) => post.id !== breakingNews?.id
	);

	return (
		<div className="min-h-screen bg-[#FAFAFA]">
			{/* --- Hero / Breaking News Section --- */}
			{breakingNews && (
				<section className="bg-white border-b border-gray-100 py-8 md:py-12">
					<div className="container mx-auto max-w-7xl px-4 md:px-6">
						<div className="flex items-center gap-2 mb-6">
							<span className="bg-red-50 text-red-600 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 animate-pulse">
								<FaFire /> BREAKING
							</span>
							<h2 className="text-gray-500 text-sm font-medium uppercase tracking-wide">
								Top Story of the Week
							</h2>
						</div>
						<BreakingNewsCard post={breakingNews} />
					</div>
				</section>
			)}

			<div className="container mx-auto max-w-7xl px-4 md:px-6 py-12">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12">
					{/* --- Main Content Column (Left) --- */}
					<main className="lg:col-span-8 space-y-10">
						{/* Section Header */}
						<div className="flex items-center justify-between border-b border-gray-200 pb-4">
							<h2 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
								Latest from the Wild
							</h2>
						</div>

						{/* Blog Grid */}
						{mainFeedPosts.length > 0 ? (
							<>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-10">
									{mainFeedPosts.slice(0, displayCount).map((post) => (
										<BlogCard key={post.id} post={post} />
									))}
								</div>

								{/* Load More Button */}
								{displayCount < mainFeedPosts.length && (
									<div className="pt-8 flex justify-center">
										<button
											onClick={loadMore}
											className="group relative px-8 py-3 bg-white border-2 border-[#335833] text-[#335833] font-bold rounded-full overflow-hidden transition-all hover:bg-[#335833] hover:text-white"
										>
											<span className="relative z-10 flex items-center gap-2">
												Load More Stories <FaChevronRight size={12} />
											</span>
										</button>
									</div>
								)}
							</>
						) : (
							<div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
								<div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
									<FaLeaf className="text-gray-300 text-2xl" />
								</div>
								<p className="text-gray-500 font-medium">
									No stories published yet.
								</p>
								<Link
									to="/upload/blog"
									className="text-[#335833] font-bold hover:underline mt-2 inline-block"
								>
									Be the first to write one!
								</Link>
							</div>
						)}
					</main>

					{/* --- Sidebar Column (Right) --- */}
					<aside className="lg:col-span-4 space-y-8">
						{/* Sticky Wrapper to keep sidebar in view */}
						<div className="sticky top-24 space-y-8">
							{/* Leaderboard Widget */}
							<Leaderboard />

							{/* Popular Posts Widget */}
							<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
								<PopularPosts posts={blogPosts} />
							</div>
							<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
								{/* Social Media Links */}

								<h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
									<span className="w-2 h-2 rounded-full bg-green-500"></span>
									Follow Us
								</h3>
								<div className="flex flex-wrap gap-3">
									<SocialLink
										icon={FaInstagram}
										href="https://instagram.com"
										color="text-pink-600 bg-pink-50 hover:bg-pink-100"
									/>
									<SocialLink
										icon={FaFacebookF}
										href="https://facebook.com"
										color="text-blue-600 bg-blue-50 hover:bg-blue-100"
									/>
									<SocialLink
										icon={FaYoutube}
										href="https://youtube.com"
										color="text-red-600 bg-red-50 hover:bg-red-100"
									/>
									<SocialLink
										icon={FaTwitter}
										href="https://twitter.com"
										color="text-sky-500 bg-sky-50 hover:bg-sky-100"
									/>
									<SocialLink
										icon={FaWhatsapp}
										href="https://whatsapp.com"
										color="text-green-600 bg-green-50 hover:bg-green-100"
									/>
								</div>
							</div>
							{/* Advertisement / Sponsor Slot */}
							{/* <div className="space-y-6">
								<AdContainer />
							</div> */}

							{/* Newsletter / CTA */}
							<div className="bg-[#1A331A] rounded-2xl p-6 text-center text-white relative overflow-hidden">
								<div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-16 -mt-16"></div>
								<h3 className="text-lg font-bold mb-2 relative z-10">
									Join the Community
								</h3>
								<p className="text-gray-300 text-sm mb-4 relative z-10">
									Share your wildlife moments and compete with others.
								</p>
								<Link
									to="/register"
									className="block w-full py-2 bg-white text-[#1A331A] font-bold rounded-lg hover:bg-gray-100 transition-colors relative z-10"
								>
									Get Started
								</Link>
							</div>
						</div>
					</aside>
				</div>
			</div>
		</div>
	);
};

export default Home;
