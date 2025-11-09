import { useState, useEffect } from "react";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ContentSwitcher from "../../components/content/ContentSwitcher";

const ContentFeed = () => {
	const [content, setContent] = useState([]);
	const [loading, setLoading] = useState(true);
	const [activeTab, setActiveTab] = useState("all");
	const [viewMode, setViewMode] = useState("grid");

	useEffect(() => {
		const loadContent = () => {
			setLoading(true);
			// Simulate API call
			setTimeout(() => {
				setContent([
					{
						id: 1,
						type: "sighting",
						title: "Elephant Herd Crossing",
						description: "A magnificent herd spotted crossing the tea estate",
						author: "Rajesh Kumar",
						authorAvatar: "👨",
						date: "2024-01-20",
						likes: 124,
						comments: 18,
						species: "Asian Elephant",
						location: "Valparai Tea Estate",
					},
					{
						id: 2,
						type: "blog",
						title: "Conservation Efforts in Valparai",
						description:
							"Exploring conservation initiatives protecting wildlife ecosystem",
						author: "Dr. Priya Sharma",
						authorAvatar: "👩‍🔬",
						date: "2024-01-19",
						likes: 234,
						comments: 42,
						readTime: "8 min read",
						category: "conservation",
					},
					{
						id: 3,
						type: "audio",
						title: "Morning Bird Calls",
						description: "Recorded at dawn featuring multiple species",
						author: "Meera Iyer",
						authorAvatar: "🎵",
						date: "2024-01-18",
						likes: 89,
						comments: 12,
						duration: "3:45",
						language: "English",
					},
					{
						id: 4,
						type: "sighting",
						title: "Leopard Spotted at Dusk",
						description: "Rare sighting captured during evening patrol",
						author: "Arun Menon",
						authorAvatar: "📷",
						date: "2024-01-17",
						likes: 298,
						comments: 45,
						species: "Indian Leopard",
						location: "Grass Hills",
					},
					{
						id: 5,
						type: "blog",
						title: "Photography Tips for Wildlife",
						description: "Master wildlife photography with expert techniques",
						author: "Arun Menon",
						authorAvatar: "📷",
						date: "2024-01-16",
						likes: 189,
						comments: 28,
						readTime: "6 min read",
						category: "photography",
					},
					{
						id: 6,
						type: "audio",
						title: "Forest Ambience",
						description: "Natural sounds from the heart of the forest",
						author: "Nature Sounds",
						authorAvatar: "🌲",
						date: "2024-01-15",
						likes: 156,
						comments: 21,
						duration: "10:00",
						language: "Ambient",
					},
				]);
				setLoading(false);
			}, 1000);
		};
		loadContent();
	}, [activeTab]);

	const getTypeIcon = (type) => {
		const icons = {
			sighting: "📸",
			blog: "✍️",
			audio: "🎵",
		};
		return icons[type] || "📄";
	};

	const getTypeColor = (type) => {
		const colors = {
			sighting: "bg-[#609966]",
			blog: "bg-[#40513B]",
			audio: "bg-[#9DC08B]",
		};
		return colors[type] || "bg-[#609966]";
	};

	const filteredContent =
		activeTab === "all"
			? content
			: content.filter((item) => item.type === activeTab);

	if (loading) {
		return <LoadingSpinner message="Loading content feed..." />;
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-[#EDF1D6] via-white to-[#9DC08B]/20 py-8">
			<div className="max-w-7xl mx-auto px-4">
				{/* Header */}
				<div className="text-center mb-8">
					<h1 className="text-5xl font-bold text-[#40513B] mb-4">
						🌿 Content Feed
					</h1>
					<p className="text-[#609966] text-lg max-w-2xl mx-auto">
						Discover the latest wildlife sightings, stories, and audio
						experiences
					</p>
				</div>

				{/* Stats Overview */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
					{[
						{
							icon: "📸",
							label: "Sightings",
							value: content.filter((c) => c.type === "sighting").length,
						},
						{
							icon: "✍️",
							label: "Blogs",
							value: content.filter((c) => c.type === "blog").length,
						},
						{
							icon: "🎵",
							label: "Audio",
							value: content.filter((c) => c.type === "audio").length,
						},
						{ icon: "🔥", label: "Total", value: content.length },
					].map((stat, index) => (
						<div
							key={index}
							className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-[#9DC08B]/20 p-6 hover:scale-105 transition-transform"
						>
							<div className="text-4xl mb-2">{stat.icon}</div>
							<div className="text-2xl font-bold text-[#40513B]">
								{stat.value}
							</div>
							<div className="text-sm text-[#609966]">{stat.label}</div>
						</div>
					))}
				</div>

				{/* Tab Navigation */}
				<div className="flex items-center justify-between mb-6">
					<div className="flex space-x-2">
						{["all", "sighting", "blog", "audio"].map((tab) => (
							<button
								key={tab}
								onClick={() => setActiveTab(tab)}
								className={`px-6 py-3 rounded-xl font-bold transition-all ${
									activeTab === tab
										? "bg-[#609966] text-white shadow-lg scale-105"
										: "bg-white/90 text-[#609966] hover:bg-[#EDF1D6]"
								}`}
							>
								{getTypeIcon(tab === "all" ? "sighting" : tab)}{" "}
								{tab.charAt(0).toUpperCase() + tab.slice(1)}
							</button>
						))}
					</div>
					<div className="flex space-x-2">
						<button
							onClick={() => setViewMode("grid")}
							className={`px-4 py-3 rounded-xl font-bold transition-all ${
								viewMode === "grid"
									? "bg-[#609966] text-white"
									: "bg-white/90 text-[#609966] hover:bg-[#EDF1D6]"
							}`}
						>
							▦
						</button>
						<button
							onClick={() => setViewMode("list")}
							className={`px-4 py-3 rounded-xl font-bold transition-all ${
								viewMode === "list"
									? "bg-[#609966] text-white"
									: "bg-white/90 text-[#609966] hover:bg-[#EDF1D6]"
							}`}
						>
							☰
						</button>
					</div>
				</div>

				{/* Content Display */}
				{filteredContent.length === 0 ? (
					<div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border-2 border-[#9DC08B]/20 p-16 text-center">
						<div className="text-8xl mb-6">🔍</div>
						<h2 className="text-3xl font-bold text-[#40513B] mb-4">
							No Content Found
						</h2>
						<p className="text-[#609966] mb-6">
							Try selecting a different content type
						</p>
					</div>
				) : (
					<ContentSwitcher
						content={filteredContent}
						viewMode={viewMode}
						onViewModeChange={setViewMode}
						getTypeColor={getTypeColor}
						getTypeIcon={getTypeIcon}
					/>
				)}

				{/* Load More */}
				<div className="text-center mt-8">
					<button className="px-8 py-4 bg-gradient-to-r from-[#609966] to-[#40513B] text-white rounded-2xl font-bold hover:scale-105 transition-transform shadow-lg">
						📥 Load More Content
					</button>
				</div>

				{/* Contribution CTA */}
				<div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
					<div className="bg-gradient-to-br from-[#609966] to-[#40513B] rounded-2xl p-6 text-white text-center hover:scale-105 transition-transform cursor-pointer">
						<div className="text-5xl mb-3">📸</div>
						<h3 className="text-xl font-bold mb-2">Submit Sighting</h3>
						<p className="text-sm opacity-90">Share your wildlife encounters</p>
					</div>
					<div className="bg-gradient-to-br from-[#609966] to-[#40513B] rounded-2xl p-6 text-white text-center hover:scale-105 transition-transform cursor-pointer">
						<div className="text-5xl mb-3">✍️</div>
						<h3 className="text-xl font-bold mb-2">Write Blog</h3>
						<p className="text-sm opacity-90">Share your knowledge & stories</p>
					</div>
					<div className="bg-gradient-to-br from-[#609966] to-[#40513B] rounded-2xl p-6 text-white text-center hover:scale-105 transition-transform cursor-pointer">
						<div className="text-5xl mb-3">🎵</div>
						<h3 className="text-xl font-bold mb-2">Upload Audio</h3>
						<p className="text-sm opacity-90">Contribute wildlife sounds</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ContentFeed;
