import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const MyContent = () => {
	const [content, setContent] = useState([]);
	const [loading, setLoading] = useState(true);
	const [filter, setFilter] = useState("all");
	const [viewMode, setViewMode] = useState("grid");

	useEffect(() => {
		const loadContent = () => {
			setLoading(true);
			// Simulate API call
			setTimeout(() => {
				const mockContent = [
					{
						id: "1",
						type: "blog",
						title: "Elephant Migration Patterns",
						excerpt: "Understanding seasonal movements...",
						status: "published",
						views: 245,
						likes: 67,
						comments: 12,
						createdAt: "2024-01-15",
						thumbnail: "/placeholder.jpg",
					},
					{
						id: "2",
						type: "sighting",
						title: "Rare Bird Sighting",
						species: "Malabar Grey Hornbill",
						status: "approved",
						views: 198,
						likes: 52,
						comments: 8,
						createdAt: "2024-01-14",
						thumbnail: "/placeholder.jpg",
					},
					{
						id: "3",
						type: "blog",
						title: "Conservation Success Story",
						excerpt: "How community efforts saved...",
						status: "draft",
						views: 0,
						likes: 0,
						comments: 0,
						createdAt: "2024-01-13",
						thumbnail: "/placeholder.jpg",
					},
					{
						id: "4",
						type: "sighting",
						title: "Tiger Footprints",
						species: "Bengal Tiger",
						status: "pending",
						views: 0,
						likes: 0,
						comments: 0,
						createdAt: "2024-01-12",
						thumbnail: "/placeholder.jpg",
					},
					{
						id: "5",
						type: "audio",
						title: "Morning Bird Calls",
						duration: "5:30",
						status: "published",
						views: 176,
						likes: 48,
						comments: 5,
						createdAt: "2024-01-11",
					},
				];

				const filtered =
					filter === "all"
						? mockContent
						: mockContent.filter((item) => item.type === filter);
				setContent(filtered);
				setLoading(false);
			}, 1000);
		};

		loadContent();
	}, [filter]);

	const getStatusColor = (status) => {
		switch (status) {
			case "published":
			case "approved":
				return "bg-green-100 text-green-700";
			case "pending":
				return "bg-yellow-100 text-yellow-700";
			case "draft":
				return "bg-gray-100 text-gray-700";
			case "rejected":
				return "bg-red-100 text-red-700";
			default:
				return "bg-blue-100 text-blue-700";
		}
	};

	const getTypeIcon = (type) => {
		switch (type) {
			case "blog":
				return "📝";
			case "sighting":
				return "📸";
			case "audio":
				return "🎵";
			default:
				return "📄";
		}
	};

	if (loading) {
		return <LoadingSpinner message="Loading your content..." />;
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-[#EDF1D6] via-white to-[#9DC08B]/20 py-8">
			<div className="max-w-7xl mx-auto px-4">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-4xl font-bold text-[#40513B] mb-2 flex items-center">
						<span className="mr-3 text-5xl">📂</span>
						My Content
					</h1>
					<p className="text-lg text-[#609966]">
						Manage all your contributions in one place
					</p>
				</div>

				{/* Stats Cards */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
					{[
						{ label: "Total Posts", value: content.length, icon: "📊" },
						{
							label: "Published",
							value: content.filter((c) =>
								["published", "approved"].includes(c.status)
							).length,
							icon: "✅",
						},
						{
							label: "Pending",
							value: content.filter((c) => c.status === "pending").length,
							icon: "⏳",
						},
						{
							label: "Drafts",
							value: content.filter((c) => c.status === "draft").length,
							icon: "📄",
						},
					].map((stat, index) => (
						<div
							key={index}
							className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-2 border-[#9DC08B]/20"
						>
							<div className="text-3xl mb-2">{stat.icon}</div>
							<div className="text-2xl font-bold text-[#40513B]">
								{stat.value}
							</div>
							<div className="text-sm text-[#609966]">{stat.label}</div>
						</div>
					))}
				</div>

				{/* Filters and View Toggle */}
				<div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border-2 border-[#9DC08B]/20 mb-6">
					<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
						{/* Filter Buttons */}
						<div className="flex flex-wrap gap-2">
							{["all", "blog", "sighting", "audio"].map((filterType) => (
								<button
									key={filterType}
									onClick={() => setFilter(filterType)}
									className={`px-4 py-2 rounded-xl font-medium transition-all capitalize ${
										filter === filterType
											? "bg-gradient-to-r from-[#609966] to-[#40513B] text-white"
											: "bg-[#EDF1D6] text-[#609966] hover:bg-[#9DC08B]/30"
									}`}
								>
									{filterType === "all" && "📋 All"}
									{filterType === "blog" && "📝 Blogs"}
									{filterType === "sighting" && "📸 Sightings"}
									{filterType === "audio" && "🎵 Audio"}
								</button>
							))}
						</div>

						{/* View Mode Toggle */}
						<div className="flex space-x-2">
							<button
								onClick={() => setViewMode("grid")}
								className={`px-4 py-2 rounded-xl transition-all ${
									viewMode === "grid"
										? "bg-[#609966] text-white"
										: "bg-[#EDF1D6] text-[#609966]"
								}`}
							>
								⊞ Grid
							</button>
							<button
								onClick={() => setViewMode("list")}
								className={`px-4 py-2 rounded-xl transition-all ${
									viewMode === "list"
										? "bg-[#609966] text-white"
										: "bg-[#EDF1D6] text-[#609966]"
								}`}
							>
								☰ List
							</button>
						</div>
					</div>
				</div>

				{/* Content Grid/List */}
				{content.length === 0 ? (
					<div className="text-center py-16 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-[#9DC08B]/20">
						<div className="text-6xl mb-4">📭</div>
						<h3 className="text-2xl font-bold text-[#40513B] mb-2">
							No content yet
						</h3>
						<p className="text-[#609966] mb-6">
							Start creating and sharing your wildlife experiences
						</p>
						<Link
							to="/creator/dashboard"
							className="inline-block px-6 py-3 bg-gradient-to-r from-[#609966] to-[#40513B] text-white rounded-xl font-bold hover:scale-105 transition-transform"
						>
							Create Content
						</Link>
					</div>
				) : viewMode === "grid" ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{content.map((item) => (
							<div
								key={item.id}
								className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-[#9DC08B]/20 overflow-hidden hover:scale-105 transition-transform"
							>
								{item.thumbnail && (
									<div className="h-48 bg-gradient-to-r from-[#EDF1D6] to-[#9DC08B]/30 flex items-center justify-center text-6xl">
										{getTypeIcon(item.type)}
									</div>
								)}
								<div className="p-6">
									<div className="flex items-start justify-between mb-3">
										<span
											className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(
												item.status
											)}`}
										>
											{item.status}
										</span>
										<span className="text-2xl">{getTypeIcon(item.type)}</span>
									</div>

									<h3 className="text-xl font-bold text-[#40513B] mb-2 line-clamp-2">
										{item.title}
									</h3>

									{item.excerpt && (
										<p className="text-sm text-[#609966] mb-4 line-clamp-2">
											{item.excerpt}
										</p>
									)}

									{item.species && (
										<p className="text-sm text-[#609966] mb-4">
											Species: {item.species}
										</p>
									)}

									<div className="flex items-center justify-between text-sm text-[#609966] mb-4">
										<span>👁️ {item.views}</span>
										<span>❤️ {item.likes}</span>
										<span>💬 {item.comments}</span>
									</div>

									<div className="flex space-x-2">
										{item.type === "blog" && (
											<Link
												to={`/creator/edit-blog/${item.id}`}
												className="flex-1 px-4 py-2 bg-[#609966] text-white rounded-xl text-center font-medium hover:bg-[#40513B] transition-colors"
											>
												Edit
											</Link>
										)}
										<button className="flex-1 px-4 py-2 border-2 border-[#9DC08B] text-[#609966] rounded-xl font-medium hover:bg-[#EDF1D6] transition-colors">
											View
										</button>
									</div>
								</div>
							</div>
						))}
					</div>
				) : (
					<div className="space-y-4">
						{content.map((item) => (
							<div
								key={item.id}
								className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-2 border-[#9DC08B]/20 hover:shadow-xl transition-shadow"
							>
								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-4 flex-1">
										<div className="text-4xl">{getTypeIcon(item.type)}</div>
										<div className="flex-1">
											<div className="flex items-center space-x-3 mb-2">
												<h3 className="text-xl font-bold text-[#40513B]">
													{item.title}
												</h3>
												<span
													className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(
														item.status
													)}`}
												>
													{item.status}
												</span>
											</div>
											{item.excerpt && (
												<p className="text-sm text-[#609966] mb-2">
													{item.excerpt}
												</p>
											)}
											<div className="flex items-center space-x-4 text-sm text-[#609966]">
												<span>👁️ {item.views} views</span>
												<span>❤️ {item.likes} likes</span>
												<span>💬 {item.comments} comments</span>
												<span>📅 {item.createdAt}</span>
											</div>
										</div>
									</div>
									<div className="flex space-x-2 ml-4">
										{item.type === "blog" && (
											<Link
												to={`/creator/edit-blog/${item.id}`}
												className="px-4 py-2 bg-[#609966] text-white rounded-xl font-medium hover:bg-[#40513B] transition-colors"
											>
												Edit
											</Link>
										)}
										<button className="px-4 py-2 border-2 border-[#9DC08B] text-[#609966] rounded-xl font-medium hover:bg-[#EDF1D6] transition-colors">
											View
										</button>
										<button className="px-4 py-2 border-2 border-red-300 text-red-600 rounded-xl font-medium hover:bg-red-50 transition-colors">
											Delete
										</button>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default MyContent;
