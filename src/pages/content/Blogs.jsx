import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { SearchBar, FilterBar } from "../../components/content/ContentSwitcher";

const Blogs = () => {
	const [blogs, setBlogs] = useState([]);
	const [loading, setLoading] = useState(true);
	const [filters, setFilters] = useState({
		category: "all",
		author: "all",
		sort: "latest",
	});

	useEffect(() => {
		const loadBlogs = () => {
			setLoading(true);
			// Simulate API call
			setTimeout(() => {
				setBlogs([
					{
						id: 1,
						title: "Conservation Efforts in Valparai",
						category: "conservation",
						excerpt:
							"Exploring the ongoing conservation initiatives protecting Valparai's unique wildlife ecosystem and forest corridors.",
						author: "Dr. Priya Sharma",
						authorAvatar: "👩‍🔬",
						publishedAt: "2024-01-20",
						readTime: "8 min read",
						likes: 234,
						comments: 42,
						views: 1523,
					},
					{
						id: 2,
						title: "Photography Tips for Wildlife Enthusiasts",
						category: "photography",
						excerpt:
							"Master the art of wildlife photography with expert tips on lighting, composition, and capturing perfect moments in nature.",
						author: "Arun Menon",
						authorAvatar: "📷",
						publishedAt: "2024-01-18",
						readTime: "6 min read",
						likes: 189,
						comments: 28,
						views: 1102,
					},
					{
						id: 3,
						title: "Understanding Elephant Behavior",
						category: "wildlife",
						excerpt:
							"Deep dive into elephant social structures, communication patterns, and migration behaviors in the Anamalai region.",
						author: "Rajesh Kumar",
						authorAvatar: "🐘",
						publishedAt: "2024-01-15",
						readTime: "10 min read",
						likes: 312,
						comments: 56,
						views: 2145,
					},
					{
						id: 4,
						title: "Best Trekking Routes Around Valparai",
						category: "travel",
						excerpt:
							"Discover the most scenic and wildlife-rich trekking trails perfect for nature lovers and adventure enthusiasts.",
						author: "Meera Iyer",
						authorAvatar: "🥾",
						publishedAt: "2024-01-12",
						readTime: "7 min read",
						likes: 156,
						comments: 34,
						views: 892,
					},
				]);
				setLoading(false);
			}, 1000);
		};
		loadBlogs();
	}, [filters]);

	const [searchQuery, setSearchQuery] = useState("");
	const [activeFilters, setActiveFilters] = useState({});

	const handleSearch = (query) => {
		setSearchQuery(query);
		console.log("Searching for:", query);
	};

	const handleFilterChange = (newFilters) => {
		setActiveFilters(newFilters);
		console.log("Filters changed:", newFilters);
	};

	const filterConfig = [
		{
			key: "category",
			label: "Category",
			icon: "📁",
			options: [
				{ value: "wildlife", label: "Wildlife" },
				{ value: "conservation", label: "Conservation" },
				{ value: "photography", label: "Photography" },
				{ value: "travel", label: "Travel" },
				{ value: "education", label: "Education" },
			],
		},
	];

	const getCategoryColor = (category) => {
		const colors = {
			wildlife: "bg-[#609966]",
			conservation: "bg-[#40513B]",
			photography: "bg-[#9DC08B]",
			travel: "bg-[#609966]",
			education: "bg-[#40513B]",
		};
		return colors[category] || "bg-[#609966]";
	};

	if (loading) {
		return <LoadingSpinner message="Loading blogs..." />;
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-[#EDF1D6] via-white to-[#9DC08B]/20 py-8">
			<div className="max-w-7xl mx-auto px-4">
				{/* Header */}
				<div className="text-center mb-8">
					<h1 className="text-5xl font-bold text-[#40513B] mb-4">
						✍️ Wildlife Blogs
					</h1>
					<p className="text-[#609966] text-lg max-w-2xl mx-auto">
						Explore stories, insights, and knowledge from wildlife enthusiasts
						and conservationists
					</p>
				</div>

				{/* Stats Cards */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
					{[
						{ icon: "📝", label: "Total Blogs", value: "247" },
						{ icon: "👥", label: "Authors", value: "52" },
						{ icon: "👁️", label: "Total Views", value: "45.2K" },
						{ icon: "🔥", label: "Featured", value: "12" },
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

				{/* Filters and Search */}
				<div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-[#9DC08B]/20 p-6 mb-8">
					<div className="mb-4">
						<SearchBar
							value={searchQuery}
							onChange={handleSearch}
							placeholder="Search blogs..."
						/>
					</div>
					<FilterBar
						filters={filterConfig}
						activeFilters={activeFilters}
						onFilterChange={handleFilterChange}
					/>
					<div className="flex items-center space-x-2 mt-4">
						<span className="text-sm text-[#609966]">Sort by:</span>
						{["latest", "popular", "trending"].map((sort) => (
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

				{/* Featured Blog */}
				{blogs.length > 0 && (
					<Link
						to={`/blogs/${blogs[0].id}`}
						className="block bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border-2 border-[#9DC08B]/20 overflow-hidden mb-8 hover:scale-[1.02] transition-transform"
					>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="h-80 bg-gradient-to-r from-[#EDF1D6] to-[#9DC08B]/30 flex items-center justify-center">
								<div className="text-9xl">✍️</div>
							</div>
							<div className="p-8 flex flex-col justify-center">
								<div
									className={`inline-block px-4 py-2 ${getCategoryColor(
										blogs[0].category
									)} text-white rounded-full text-xs font-bold mb-3 w-fit`}
								>
									⭐ FEATURED • {blogs[0].category.toUpperCase()}
								</div>
								<h2 className="text-3xl font-bold text-[#40513B] mb-4">
									{blogs[0].title}
								</h2>
								<p className="text-[#609966] mb-6">{blogs[0].excerpt}</p>
								<div className="flex items-center justify-between text-sm text-[#609966]">
									<div className="flex items-center space-x-2">
										<span className="text-2xl">{blogs[0].authorAvatar}</span>
										<span className="font-medium">{blogs[0].author}</span>
									</div>
									<div className="flex items-center space-x-3">
										<span>📅 {blogs[0].publishedAt}</span>
										<span>⏱️ {blogs[0].readTime}</span>
									</div>
								</div>
							</div>
						</div>
					</Link>
				)}

				{/* Blog Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
					{blogs.slice(1).map((blog) => (
						<Link
							key={blog.id}
							to={`/blogs/${blog.id}`}
							className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-[#9DC08B]/20 overflow-hidden hover:scale-105 transition-transform"
						>
							<div className="h-48 bg-gradient-to-r from-[#EDF1D6] to-[#9DC08B]/30 flex items-center justify-center text-6xl">
								✍️
							</div>
							<div className="p-6">
								<div
									className={`inline-block px-3 py-1 ${getCategoryColor(
										blog.category
									)} text-white rounded-full text-xs font-bold mb-3`}
								>
									{blog.category.toUpperCase()}
								</div>
								<h3 className="text-xl font-bold text-[#40513B] mb-2">
									{blog.title}
								</h3>
								<p className="text-sm text-[#609966] mb-4 line-clamp-2">
									{blog.excerpt}
								</p>
								<div className="flex items-center space-x-2 mb-4 text-sm text-[#609966]">
									<span className="text-xl">{blog.authorAvatar}</span>
									<span>{blog.author}</span>
								</div>
								<div className="flex items-center justify-between text-xs text-[#609966]">
									<div className="flex items-center space-x-2">
										<span>📅 {blog.publishedAt}</span>
										<span>⏱️ {blog.readTime}</span>
									</div>
									<div className="flex items-center space-x-2">
										<span>❤️ {blog.likes}</span>
										<span>💬 {blog.comments}</span>
									</div>
								</div>
							</div>
						</Link>
					))}
				</div>

				{/* Load More */}
				<div className="text-center">
					<button className="px-8 py-4 bg-gradient-to-r from-[#609966] to-[#40513B] text-white rounded-2xl font-bold hover:scale-105 transition-transform shadow-lg">
						📚 Load More Blogs
					</button>
				</div>

				{/* CTA Banner */}
				<div className="mt-12 bg-gradient-to-r from-[#609966] to-[#40513B] rounded-3xl p-8 text-center text-white shadow-2xl">
					<h2 className="text-3xl font-bold mb-4">✍️ Share Your Story</h2>
					<p className="mb-6 text-lg">
						Have insights about wildlife? Write a blog and inspire others!
					</p>
					<Link
						to="/creator/create-blog"
						className="inline-block px-8 py-4 bg-white text-[#609966] rounded-2xl font-bold hover:scale-105 transition-transform"
					>
						Start Writing
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Blogs;
