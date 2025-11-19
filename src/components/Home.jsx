import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
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
	const [latestIndex, setLatestIndex] = useState(0);
	const [displayCount, setDisplayCount] = useState(5);

	useEffect(() => {
		fetchBlogPosts();
	}, []);

	const fetchBlogPosts = async () => {
		try {
			setLoading(true);
			// Fetch all latest posts
			const allPosts = await getLatestPosts(50);

			// Filter ONLY blog type posts
			const onlyBlogs = allPosts.filter((post) => post.type === "blog");

			setBlogPosts(onlyBlogs);
			setLatestBlogs(onlyBlogs.slice(0, 5)); // Latest 5 blogs for carousel
		} catch (error) {
			console.error("Error fetching blog posts:", error);
		} finally {
			setLoading(false);
		}
	};

	const nextLatest = () => {
		setLatestIndex((prev) => (prev === latestBlogs.length - 1 ? 0 : prev + 1));
	};

	const prevLatest = () => {
		setLatestIndex((prev) => (prev === 0 ? latestBlogs.length - 1 : prev - 1));
	};

	const loadMore = () => {
		setDisplayCount((prev) => prev + 5);
	};

	if (loading) {
		return <LoadingSpinner />;
	}

	// Get breaking news (most liked blog post from last 7 days)
	const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
	const breakingNews = blogPosts
		.filter((post) => (post.createdAt?.toMillis() || 0) > sevenDaysAgo)
		.sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0))[0];

	return (
		<div className="container mx-auto max-w-7xl p-4 md:p-6 bg-white">
			{/* Breaking News Section */}
			{breakingNews && (
				<section className="mb-8">
					<h2 className="text-2xl font-bold text-gray-900 mb-4">
						Breaking News
					</h2>
					<BreakingNewsCard post={breakingNews} />
				</section>
			)}

			{/* Latest on Wildlife Section (Carousel) */}
			{latestBlogs.length > 0 && (
				<section className="mb-8">
					<div className="flex justify-between items-center mb-4">
						<h2 className="text-2xl font-bold text-gray-900">
							Latest on Wildlife
						</h2>
						<div className="flex space-x-2">
							<button
								onClick={prevLatest}
								className="bg-gray-200 p-2 rounded-full hover:bg-gray-300 transition-colors"
								aria-label="Previous"
							>
								<FaChevronLeft className="text-gray-700" />
							</button>
							<button
								onClick={nextLatest}
								className="bg-gray-200 p-2 rounded-full hover:bg-gray-300 transition-colors"
								aria-label="Next"
							>
								<FaChevronRight className="text-gray-700" />
							</button>
						</div>
					</div>
					<BlogCard post={latestBlogs[latestIndex]} />
				</section>
			)}

			{/* Main Content Grid */}
			<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
				{/* Left Column: Top Picks */}
				<main className="md:col-span-2 lg:col-span-3 space-y-6">
					<h2 className="text-2xl font-bold text-gray-900 mb-4">
						Top picks of the Day!
					</h2>
					{blogPosts.length > 0 ? (
						<>
							{blogPosts.slice(0, displayCount).map((post) => (
								<BlogCard key={post.id} post={post} />
							))}

							{/* Load More Button */}
							{displayCount < blogPosts.length && (
								<div className="text-center pt-4">
									<button
										onClick={loadMore}
										className="bg-[#335833] text-white font-semibold py-2 px-6 rounded-lg hover:bg-opacity-90 transition-all shadow"
									>
										Load More
									</button>
								</div>
							)}
						</>
					) : (
						<div className="text-center py-12">
							<p className="text-gray-500 text-lg">
								No blog posts available yet. Be the first to create one!
							</p>
						</div>
					)}
				</main>

				{/* Right Column: Sidebar */}
				<aside className="md:col-span-1 lg:col-span-1 space-y-8">
					<Leaderboard />
					<PopularPosts posts={blogPosts} />
					<AdContainer />
					<AdContainer />
				</aside>
			</div>
		</div>
	);
};

export default Home;
