import React, { useState } from "react";
import { FaChevronLeft, FaChevronRight, FaArrowRight } from "react-icons/fa";

// Import all the components we will build
import Leaderboard from "./Leaderboard.jsx";
import AdContainer from "./AdContainer.jsx";
import BreakingNewsCard from "./BreakingNewsCard.jsx";
import BlogCard from "./BlogCard.jsx";
import PopularPosts from "./PopularPosts.jsx";

// --- Mock Data to fill the page ---
const mockPosts = [
	{
		id: 1,
		title: "கதை அல்ல நிஜம் “ரோலக்ஸ்” - அடங்காத யானையின் பயணம்”",
		author: "VadiVel Admin",
		date: "October 18, 2025",
		excerpt:
			"கோவை கோனியம்மன்!? எனப் புகழ்பெற்ற தடகள வீரர் ஆனந்த், ஒரு வனவிலங்கு ஆர்வலர். அவர் எடுத்த...",
		imageUrl: "https://placehold.co/600x400/335833/FFF?text=WV+Image",
	},
	{
		id: 2,
		title: "Another Top Pick for the Day",
		author: "Admin",
		date: "October 17, 2025",
		excerpt:
			"This is another example of a top pick card, showing how the feed would look with multiple items.",
		imageUrl: "https://placehold.co/600x400/335833/FFF?text=WV+Image",
	},
	{
		id: 3,
		title: "Valparai's Hidden Waterfalls",
		author: "Traveler",
		date: "October 16, 2025",
		excerpt:
			"Discover the serene beauty of Valparai's less-known waterfalls. A must-visit for nature lovers.",
		imageUrl: "https://placehold.co/600x400/335833/FFF?text=WV+Image",
	},
];
// --- End Mock Data ---

const Home = () => {
	// State for "Latest on Wildlife" carousel
	const [latestIndex, setLatestIndex] = useState(0);

	const nextLatest = () => {
		setLatestIndex((prev) => (prev === mockPosts.length - 1 ? 0 : prev + 1));
	};

	const prevLatest = () => {
		setLatestIndex((prev) => (prev === 0 ? mockPosts.length - 1 : prev - 1));
	};

	return (
		<div className="container mx-auto max-w-7xl p-4 md:p-6 bg-white">
			{/* --- 1. Breaking News Section --- */}
			<section className="mb-8">
				<h2 className="text-2xl font-bold text-gray-900 mb-4">Breaking News</h2>
				<BreakingNewsCard post={mockPosts[0]} />
			</section>

			{/* --- 2. Latest on Wildlife Section (Carousel) --- */}
			<section className="mb-8">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-2xl font-bold text-gray-900">
						Latest on Wildlife
					</h2>
					{/* Carousel Arrows */}
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
				{/* The actual card will slide in a real implementation */}
				<BlogCard post={mockPosts[latestIndex]} />
			</section>

			{/* --- 3. Main Content Grid (2 Columns) --- */}
			<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
				{/* Left Column: Top Picks */}
				<main className="md:col-span-2 lg:col-span-3 space-y-6">
					<h2 className="text-2xl font-bold text-gray-900 mb-4">
						Top picks of the Day!
					</h2>
					{mockPosts.map((post) => (
						<BlogCard key={post.id} post={post} />
					))}

					{/* Load More Button */}
					<div className="text-center pt-4">
						<button className="bg-[#335833] text-white font-semibold py-2 px-6 rounded-lg hover:bg-opacity-90 transition-all shadow">
							Load More
						</button>
					</div>
				</main>

				{/* Right Column: Sidebar */}
				<aside className="md:col-span-1 lg:col-span-1 space-y-8">
					{/* Leaderboard Component */}
					<Leaderboard />

					{/* Popular Posts Component */}
					<PopularPosts />

					{/* Ad Container 1 Component */}
					<AdContainer />

					{/* Ad Container 2 Component */}
					<AdContainer />
				</aside>
			</div>
		</div>
	);
};

export default Home;
