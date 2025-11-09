import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PostCard from "../../components/content/PostCard";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { FilterBar, SearchBar } from "../../components/content/ContentSwitcher";

const Sightings = () => {
	const [sightings, setSightings] = useState([]);
	const [loading, setLoading] = useState(true);
	const [filters, setFilters] = useState({
		sort: "recent",
	});
	const [searchQuery, setSearchQuery] = useState("");
	const [activeFilters, setActiveFilters] = useState({});

	useEffect(() => {
		loadSightings();
	}, [filters, activeFilters, searchQuery]);

	const loadSightings = () => {
		setLoading(true);
		// Simulate API call
		setTimeout(() => {
			const mockSightings = [
				{
					id: "1",
					type: "sighting",
					title: "Elephant Herd Crossing",
					species: "Asian Elephant",
					location: "Valparai Tea Estate",
					date: "2024-01-15",
					imageUrl: "/placeholder.jpg",
					author: "Rajesh Kumar",
					likes: 124,
					comments: 18,
					views: 542,
					description:
						"A magnificent herd of elephants crossing the tea estate...",
				},
				{
					id: "2",
					type: "sighting",
					title: "Malabar Grey Hornbill",
					species: "Malabar Grey Hornbill",
					location: "Shola Forest",
					date: "2024-01-14",
					imageUrl: "/placeholder.jpg",
					author: "Priya Sharma",
					likes: 98,
					comments: 12,
					views: 423,
					description: "Rare sighting of the endemic hornbill species...",
				},
				{
					id: "3",
					type: "sighting",
					title: "Tiger Pug Marks",
					species: "Bengal Tiger",
					location: "Forest Edge",
					date: "2024-01-13",
					imageUrl: "/placeholder.jpg",
					author: "Arjun Menon",
					likes: 156,
					comments: 24,
					views: 678,
					description: "Fresh tiger tracks found near the forest boundary...",
				},
			];
			setSightings(mockSightings);
			setLoading(false);
		}, 1000);
	};

	const handleSearch = (query) => {
		setSearchQuery(query);
		console.log("Searching for:", query);
		// Implement search logic
	};

	const handleFilterChange = (newFilters) => {
		setActiveFilters(newFilters);
		console.log("Filters changed:", newFilters);
	};

	const filterConfig = [
		{
			key: "species",
			label: "Species",
			icon: "🦁",
			options: [
				{ value: "elephant", label: "Elephant" },
				{ value: "tiger", label: "Tiger" },
				{ value: "leopard", label: "Leopard" },
				{ value: "bird", label: "Birds" },
				{ value: "other", label: "Other" },
			],
		},
		{
			key: "location",
			label: "Location",
			icon: "📍",
			options: [
				{ value: "tea-estate", label: "Tea Estate" },
				{ value: "shola-forest", label: "Shola Forest" },
				{ value: "forest-edge", label: "Forest Edge" },
			],
		},
	];

	if (loading) {
		return <LoadingSpinner message="Loading sightings..." />;
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-[#EDF1D6] via-white to-[#9DC08B]/20 py-8">
			<div className="max-w-7xl mx-auto px-4">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-4xl font-bold text-[#40513B] mb-2 flex items-center">
						<span className="mr-3 text-5xl">📸</span>
						Wildlife Sightings
					</h1>
					<p className="text-lg text-[#609966]">
						Discover amazing wildlife encounters from our community
					</p>
				</div>

				{/* Stats */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
					<div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-2 border-[#9DC08B]/20">
						<div className="text-3xl mb-2">📊</div>
						<div className="text-2xl font-bold text-[#40513B]">
							{sightings.length}
						</div>
						<div className="text-sm text-[#609966]">Total Sightings</div>
					</div>
					<div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-2 border-[#9DC08B]/20">
						<div className="text-3xl mb-2">🦁</div>
						<div className="text-2xl font-bold text-[#40513B]">45</div>
						<div className="text-sm text-[#609966]">Species Spotted</div>
					</div>
					<div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-2 border-[#9DC08B]/20">
						<div className="text-3xl mb-2">👥</div>
						<div className="text-2xl font-bold text-[#40513B]">120</div>
						<div className="text-sm text-[#609966]">Contributors</div>
					</div>
					<div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-2 border-[#9DC08B]/20">
						<div className="text-3xl mb-2">📅</div>
						<div className="text-2xl font-bold text-[#40513B]">Today</div>
						<div className="text-sm text-[#609966]">Last Updated</div>
					</div>
				</div>

				{/* Search and Filters */}
				<div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-[#9DC08B]/20 p-6 mb-8">
					<div className="mb-4">
						<SearchBar
							value={searchQuery}
							onChange={handleSearch}
							placeholder="Search sightings..."
						/>
					</div>
					<FilterBar
						filters={filterConfig}
						activeFilters={activeFilters}
						onFilterChange={handleFilterChange}
					/>
					<div className="flex items-center space-x-2 mt-4">
						<span className="text-sm text-[#609966]">Sort by:</span>
						{["recent", "popular", "oldest"].map((sort) => (
							<button
								key={sort}
								onClick={() => setFilters({ ...filters, sort })}
								className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
									filters.sort === sort
										? "bg-[#609966] text-white"
										: "bg-[#EDF1D6] text-[#609966] hover:bg-[#9DC08B]/30"
								}`}
							>
								{sort.charAt(0).toUpperCase() + sort.slice(1)}
							</button>
						))}
					</div>
				</div>

				{/* Sightings Grid */}
				{sightings.length === 0 ? (
					<div className="text-center py-16 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-[#9DC08B]/20">
						<div className="text-6xl mb-4">🔍</div>
						<h3 className="text-2xl font-bold text-[#40513B] mb-2">
							No sightings found
						</h3>
						<p className="text-[#609966] mb-6">
							Be the first to share a wildlife sighting!
						</p>
						<Link
							to="/creator/submit-sighting"
							className="inline-block px-6 py-3 bg-gradient-to-r from-[#609966] to-[#40513B] text-white rounded-xl font-bold hover:scale-105 transition-transform"
						>
							Submit Sighting
						</Link>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{sightings.map((sighting) => (
							<PostCard key={sighting.id} post={sighting} type="sighting" />
						))}
					</div>
				)}

				{/* Load More */}
				{sightings.length > 0 && (
					<div className="mt-8 text-center">
						<button className="px-8 py-4 bg-gradient-to-r from-[#609966] to-[#40513B] text-white rounded-2xl font-bold hover:scale-105 transition-transform">
							Load More Sightings
						</button>
					</div>
				)}

				{/* CTA Banner */}
				<div className="mt-12 bg-gradient-to-r from-[#609966] to-[#40513B] rounded-2xl p-8 shadow-xl text-white text-center">
					<h2 className="text-3xl font-bold mb-3">Share Your Sightings!</h2>
					<p className="text-lg opacity-90 mb-6">
						Help us document wildlife in Valparai and earn rewards
					</p>
					<Link
						to="/creator/submit-sighting"
						className="inline-block px-8 py-4 bg-white text-[#609966] rounded-xl font-bold hover:scale-105 transition-transform"
					>
						Submit a Sighting
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Sightings;
