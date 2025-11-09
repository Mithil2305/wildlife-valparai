import { useState, useEffect } from "react";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { SearchBar, FilterBar } from "../../components/content/ContentSwitcher";

const AdminBlogs = () => {
	const [blogs, setBlogs] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedBlog, setSelectedBlog] = useState(null);
	const [showModal, setShowModal] = useState(false);
	const [filters, setFilters] = useState({
		status: "all",
		category: "all",
		sort: "recent",
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
							"Exploring conservation initiatives protecting wildlife ecosystem",
						author: "Dr. Priya Sharma",
						status: "published",
						publishedAt: "2024-01-20",
						views: 1523,
						likes: 234,
						comments: 42,
						featured: true,
					},
					{
						id: 2,
						title: "Photography Tips for Wildlife",
						category: "photography",
						excerpt: "Master wildlife photography with expert techniques",
						author: "Arun Menon",
						status: "published",
						publishedAt: "2024-01-18",
						views: 1102,
						likes: 189,
						comments: 28,
						featured: false,
					},
					{
						id: 3,
						title: "Understanding Elephant Behavior",
						category: "wildlife",
						excerpt: "Deep dive into elephant social structures and behaviors",
						author: "Rajesh Kumar",
						status: "draft",
						publishedAt: null,
						views: 0,
						likes: 0,
						comments: 0,
						featured: false,
					},
					{
						id: 4,
						title: "Best Trekking Routes",
						category: "travel",
						excerpt: "Discover scenic trekking trails around Valparai",
						author: "Meera Iyer",
						status: "pending",
						publishedAt: null,
						views: 0,
						likes: 0,
						comments: 0,
						featured: false,
					},
				]);
				setLoading(false);
			}, 1000);
		};
		loadBlogs();
	}, [filters]);

	const handleSearch = (query) => {
		console.log("Searching for:", query);
	};

	const handleFilter = (newFilters) => {
		setFilters({ ...filters, ...newFilters });
	};

	const handleViewBlog = (blog) => {
		setSelectedBlog(blog);
		setShowModal(true);
	};

	const handlePublish = (id) => {
		setBlogs(
			blogs.map((b) =>
				b.id === id
					? {
							...b,
							status: "published",
							publishedAt: new Date().toISOString().split("T")[0],
						}
					: b
			)
		);
		setShowModal(false);
	};

	const handleUnpublish = (id) => {
		setBlogs(blogs.map((b) => (b.id === id ? { ...b, status: "draft" } : b)));
		setShowModal(false);
	};

	const handleToggleFeatured = (id) => {
		setBlogs(
			blogs.map((b) => (b.id === id ? { ...b, featured: !b.featured } : b))
		);
	};

	const handleDelete = (id) => {
		if (window.confirm("Are you sure you want to delete this blog?")) {
			setBlogs(blogs.filter((b) => b.id !== id));
			setShowModal(false);
		}
	};

	const getStatusBadge = (status) => {
		const badges = {
			published: "bg-green-100 text-green-700",
			draft: "bg-gray-100 text-gray-700",
			pending: "bg-yellow-100 text-yellow-700",
		};
		return badges[status] || "bg-gray-100 text-gray-700";
	};

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
				<div className="mb-8">
					<h1 className="text-5xl font-bold text-[#40513B] mb-2">
						✍️ Blog Management
					</h1>
					<p className="text-[#609966] text-lg">
						Manage and moderate blog posts
					</p>
				</div>

				{/* Stats Cards */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
					{[
						{ icon: "📝", label: "Total Blogs", value: blogs.length },
						{
							icon: "✅",
							label: "Published",
							value: blogs.filter((b) => b.status === "published").length,
						},
						{
							icon: "⏳",
							label: "Pending",
							value: blogs.filter((b) => b.status === "pending").length,
						},
						{
							icon: "⭐",
							label: "Featured",
							value: blogs.filter((b) => b.featured).length,
						},
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

				{/* Filters */}
				<div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-[#9DC08B]/20 p-6 mb-8">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
						<SearchBar onSearch={handleSearch} placeholder="Search blogs..." />
						<FilterBar
							onFilter={handleFilter}
							filters={[
								{ value: "all", label: "All Categories" },
								{ value: "wildlife", label: "Wildlife" },
								{ value: "conservation", label: "Conservation" },
								{ value: "photography", label: "Photography" },
								{ value: "travel", label: "Travel" },
							]}
						/>
					</div>
					<div className="flex items-center space-x-2">
						<span className="text-sm text-[#609966]">Status:</span>
						{["all", "published", "draft", "pending"].map((status) => (
							<button
								key={status}
								onClick={() => handleFilter({ status })}
								className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
									filters.status === status
										? "bg-[#609966] text-white"
										: "bg-[#EDF1D6] text-[#609966] hover:bg-[#9DC08B]/30"
								}`}
							>
								{status.charAt(0).toUpperCase() + status.slice(1)}
							</button>
						))}
					</div>
				</div>

				{/* Blogs Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{blogs.map((blog) => (
						<div
							key={blog.id}
							className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-[#9DC08B]/20 overflow-hidden hover:scale-105 transition-transform"
						>
							<div className="h-48 bg-gradient-to-r from-[#EDF1D6] to-[#9DC08B]/30 flex items-center justify-center text-6xl relative">
								✍️
								{blog.featured && (
									<span className="absolute top-3 right-3 px-3 py-1 bg-yellow-400 text-yellow-900 rounded-full text-xs font-bold">
										⭐ Featured
									</span>
								)}
							</div>
							<div className="p-6">
								<div className="flex items-center justify-between mb-3">
									<span
										className={`px-3 py-1 rounded-full text-xs font-bold ${getCategoryColor(
											blog.category
										)} text-white`}
									>
										{blog.category.toUpperCase()}
									</span>
									<span
										className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(
											blog.status
										)}`}
									>
										{blog.status}
									</span>
								</div>
								<h3 className="text-xl font-bold text-[#40513B] mb-2">
									{blog.title}
								</h3>
								<p className="text-sm text-[#609966] mb-4 line-clamp-2">
									{blog.excerpt}
								</p>
								<div className="text-sm text-[#609966] mb-4">
									👤 {blog.author}
									{blog.publishedAt && (
										<div className="text-xs">📅 {blog.publishedAt}</div>
									)}
								</div>
								{blog.status === "published" && (
									<div className="flex items-center justify-between text-xs text-[#609966] mb-4">
										<span>👁️ {blog.views}</span>
										<span>❤️ {blog.likes}</span>
										<span>💬 {blog.comments}</span>
									</div>
								)}
								<div className="flex space-x-2">
									<button
										onClick={() => handleViewBlog(blog)}
										className="flex-1 px-4 py-2 bg-[#609966] text-white rounded-xl font-bold hover:bg-[#40513B] transition-colors text-sm"
									>
										Manage
									</button>
									<button
										onClick={() => handleToggleFeatured(blog.id)}
										className={`px-4 py-2 rounded-xl font-bold transition-colors text-sm ${
											blog.featured
												? "bg-yellow-400 text-yellow-900"
												: "bg-[#EDF1D6] text-[#609966] hover:bg-[#9DC08B]/30"
										}`}
									>
										⭐
									</button>
								</div>
							</div>
						</div>
					))}
				</div>

				{/* Blog Detail Modal */}
				{showModal && selectedBlog && (
					<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
						<div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
							<div className="p-8">
								<div className="flex items-center justify-between mb-6">
									<h2 className="text-3xl font-bold text-[#40513B]">
										Manage Blog
									</h2>
									<button
										onClick={() => setShowModal(false)}
										className="text-3xl text-[#609966] hover:text-[#40513B]"
									>
										×
									</button>
								</div>

								<div className="space-y-6">
									{/* Header Image */}
									<div className="h-64 bg-gradient-to-r from-[#EDF1D6] to-[#9DC08B]/30 rounded-2xl flex items-center justify-center text-9xl">
										✍️
									</div>

									{/* Info Grid */}
									<div className="grid grid-cols-2 gap-4">
										<div className="col-span-2 p-4 bg-[#EDF1D6] rounded-xl">
											<div className="text-sm text-[#609966] mb-1">Title</div>
											<div className="font-bold text-[#40513B] text-xl">
												{selectedBlog.title}
											</div>
										</div>
										<div className="p-4 bg-[#EDF1D6] rounded-xl">
											<div className="text-sm text-[#609966] mb-1">
												Category
											</div>
											<div className="font-bold text-[#40513B]">
												{selectedBlog.category}
											</div>
										</div>
										<div className="p-4 bg-[#EDF1D6] rounded-xl">
											<div className="text-sm text-[#609966] mb-1">Author</div>
											<div className="font-bold text-[#40513B]">
												{selectedBlog.author}
											</div>
										</div>
										<div className="p-4 bg-[#EDF1D6] rounded-xl">
											<div className="text-sm text-[#609966] mb-1">Status</div>
											<span
												className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(
													selectedBlog.status
												)}`}
											>
												{selectedBlog.status.toUpperCase()}
											</span>
										</div>
										<div className="p-4 bg-[#EDF1D6] rounded-xl">
											<div className="text-sm text-[#609966] mb-1">
												Featured
											</div>
											<div className="font-bold text-[#40513B]">
												{selectedBlog.featured ? "⭐ Yes" : "No"}
											</div>
										</div>
									</div>

									{/* Excerpt */}
									<div className="p-4 bg-[#EDF1D6] rounded-xl">
										<div className="text-sm text-[#609966] mb-2">Excerpt</div>
										<p className="text-[#40513B]">{selectedBlog.excerpt}</p>
									</div>

									{/* Stats */}
									{selectedBlog.status === "published" && (
										<div className="grid grid-cols-3 gap-4">
											<div className="p-4 bg-[#EDF1D6] rounded-xl text-center">
												<div className="text-2xl mb-1">👁️</div>
												<div className="text-xl font-bold text-[#40513B]">
													{selectedBlog.views}
												</div>
												<div className="text-xs text-[#609966]">Views</div>
											</div>
											<div className="p-4 bg-[#EDF1D6] rounded-xl text-center">
												<div className="text-2xl mb-1">❤️</div>
												<div className="text-xl font-bold text-[#40513B]">
													{selectedBlog.likes}
												</div>
												<div className="text-xs text-[#609966]">Likes</div>
											</div>
											<div className="p-4 bg-[#EDF1D6] rounded-xl text-center">
												<div className="text-2xl mb-1">💬</div>
												<div className="text-xl font-bold text-[#40513B]">
													{selectedBlog.comments}
												</div>
												<div className="text-xs text-[#609966]">Comments</div>
											</div>
										</div>
									)}

									{/* Action Buttons */}
									<div className="space-y-3">
										{selectedBlog.status !== "published" && (
											<button
												onClick={() => handlePublish(selectedBlog.id)}
												className="w-full px-6 py-4 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-colors"
											>
												✅ Publish Blog
											</button>
										)}
										{selectedBlog.status === "published" && (
											<button
												onClick={() => handleUnpublish(selectedBlog.id)}
												className="w-full px-6 py-4 bg-yellow-500 text-white rounded-xl font-bold hover:bg-yellow-600 transition-colors"
											>
												📝 Unpublish to Draft
											</button>
										)}
										<button
											onClick={() => handleToggleFeatured(selectedBlog.id)}
											className="w-full px-6 py-4 bg-[#609966] text-white rounded-xl font-bold hover:bg-[#40513B] transition-colors"
										>
											{selectedBlog.featured
												? "⭐ Remove from Featured"
												: "⭐ Mark as Featured"}
										</button>
										<button
											onClick={() => handleDelete(selectedBlog.id)}
											className="w-full px-6 py-4 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors"
										>
											🗑️ Delete Blog
										</button>
										<button
											onClick={() => setShowModal(false)}
											className="w-full px-6 py-3 bg-[#EDF1D6] text-[#609966] rounded-xl font-bold hover:bg-[#9DC08B]/30 transition-colors"
										>
											Close
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default AdminBlogs;
