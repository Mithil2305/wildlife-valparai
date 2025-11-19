import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { getAllPosts } from "../services/socialApi.js";
import { getLatestPosts } from "../services/uploadPost.js";
import Leaderboard from "./Leaderboard.jsx";
import AdContainer from "./AdContainer.jsx";
import BreakingNewsCard from "./BreakingNewsCard.jsx";
import BlogCard from "./BlogCard.jsx";
import PopularPosts from "./PopularPosts.jsx";
import LoadingSpinner from "./LoadingSpinner.jsx";

const Home = () => {
	const [allPosts, setAllPosts] = useState([]);
	const [latestPosts, setLatestPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [latestIndex, setLatestIndex] = useState(0);
	const [displayCount, setDisplayCount] = useState(5);

	useEffect(() => {
		fetchAllData();
	}, []);

	const fetchAllData = async () => {
		try {
			setLoading(true);
			// Fetch both blog posts and social posts
			const [blogPosts, socialPosts] = await Promise.all([
				getLatestPosts(20), // Get latest 20 blog posts
				getAllPosts(), // Get all social posts
			]);

			// Combine and sort by creation date
			const combined = [...blogPosts, ...socialPosts].sort((a, b) => {
				const timeA = a.createdAt?.toMillis() || 0;
				const timeB = b.createdAt?.toMillis() || 0;
				return timeB - timeA;
			});

			setAllPosts(combined);
			setLatestPosts(combined.slice(0, 5)); // Latest 5 for carousel
		} catch (error) {
			console.error("Error fetching posts:", error);
		} finally {
			setLoading(false);
		}
	};

	const nextLatest = () => {
		setLatestIndex((prev) => (prev === latestPosts.length - 1 ? 0 : prev + 1));
	};

	const prevLatest = () => {
		setLatestIndex((prev) => (prev === 0 ? latestPosts.length - 1 : prev - 1));
	};

	const loadMore = () => {
		setDisplayCount((prev) => prev + 5);
	};

	if (loading) {
		return <LoadingSpinner />;
	}

	// Get breaking news (most liked post from last 7 days)
	const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
	const breakingNews = allPosts
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
			{latestPosts.length > 0 && (
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
					<BlogCard post={latestPosts[latestIndex]} />
				</section>
			)}

			{/* Main Content Grid */}
			<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
				{/* Left Column: Top Picks */}
				<main className="md:col-span-2 lg:col-span-3 space-y-6">
					<h2 className="text-2xl font-bold text-gray-900 mb-4">
						Top picks of the Day!
					</h2>
					{allPosts.length > 0 ? (
						<>
							{allPosts.slice(0, displayCount).map((post) => (
								<BlogCard key={post.id} post={post} />
							))}

							{/* Load More Button */}
							{displayCount < allPosts.length && (
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
								No posts available yet. Be the first to create one!
							</p>
						</div>
					)}
				</main>

				{/* Right Column: Sidebar */}
				<aside className="md:col-span-1 lg:col-span-1 space-y-8">
					<Leaderboard />
					<PopularPosts posts={allPosts} />
					<AdContainer />
					<AdContainer />
				</aside>
			</div>
		</div>
	);
};

export default Home;
