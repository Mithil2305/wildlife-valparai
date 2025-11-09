import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import CommentBox from "../../components/content/CommentBox";

const BlogDetail = () => {
	const { id } = useParams();
	const [blog, setBlog] = useState(null);
	const [loading, setLoading] = useState(true);
	const [liked, setLiked] = useState(false);

	useEffect(() => {
		const loadBlog = () => {
			setLoading(true);
			// Simulate API call
			setTimeout(() => {
				setBlog({
					id,
					title: "Conservation Efforts in Valparai: A Year of Progress",
					category: "conservation",
					author: {
						name: "Dr. Priya Sharma",
						avatar: "👩‍🔬",
						points: 8540,
						bio: "Wildlife conservationist and researcher specializing in human-wildlife conflict resolution",
					},
					publishedAt: "2024-01-20",
					readTime: "8 min read",
					featuredImage: "/placeholder.jpg",
					content: `# Introduction

The past year has marked significant progress in wildlife conservation efforts across the Valparai region. Our team has been working tirelessly to create sustainable solutions that benefit both wildlife and local communities.

## Key Achievements

### Elephant Corridor Restoration
We successfully restored three critical elephant corridors, reducing human-wildlife conflict incidents by 45%. This involved:
- Community engagement programs
- Habitat restoration initiatives  
- Early warning systems installation

### Community Participation
Over 500 local residents participated in our conservation workshops, learning about:
- Sustainable farming practices
- Wildlife behavior understanding
- Conflict mitigation strategies

## The Road Ahead

While we've made tremendous progress, there's still much work to be done. Our focus for the coming year includes expanding monitoring programs and strengthening community partnerships.

**Together, we can make a difference!**`,
					likes: 234,
					comments: 42,
					views: 1523,
					tags: ["conservation", "elephants", "community", "valparai"],
				});
				setLoading(false);
			}, 1000);
		};
		loadBlog();
	}, [id]);

	const handleLike = () => {
		setLiked(!liked);
		setBlog({
			...blog,
			likes: liked ? blog.likes - 1 : blog.likes + 1,
		});
	};

	const handleShare = () => {
		navigator.clipboard.writeText(window.location.href);
		alert("Link copied to clipboard!");
	};

	if (loading) {
		return <LoadingSpinner message="Loading blog post..." />;
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-[#EDF1D6] via-white to-[#9DC08B]/20 py-8">
			<div className="max-w-4xl mx-auto px-4">
				{/* Breadcrumb */}
				<div className="mb-6 flex items-center space-x-2 text-sm text-[#609966]">
					<Link to="/blogs" className="hover:text-[#40513B]">
						Blogs
					</Link>
					<span>›</span>
					<Link
						to={`/blogs?category=${blog.category}`}
						className="hover:text-[#40513B]"
					>
						{blog.category}
					</Link>
					<span>›</span>
					<span className="text-[#40513B] font-medium">{blog.title}</span>
				</div>

				{/* Main Article */}
				<article className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border-2 border-[#9DC08B]/20 overflow-hidden">
					{/* Featured Image */}
					<div className="w-full h-96 bg-gradient-to-r from-[#EDF1D6] to-[#9DC08B]/30 flex items-center justify-center">
						<div className="text-9xl">✍️</div>
					</div>

					{/* Article Header */}
					<div className="p-8">
						<div className="mb-6">
							<div className="inline-block px-4 py-2 bg-[#609966] text-white rounded-full text-sm font-bold mb-4">
								{blog.category.toUpperCase()}
							</div>
							<h1 className="text-4xl md:text-5xl font-bold text-[#40513B] mb-4">
								{blog.title}
							</h1>
							<div className="flex items-center justify-between text-[#609966]">
								<div className="flex items-center space-x-2">
									<span>📅 {blog.publishedAt}</span>
									<span>•</span>
									<span>⏱️ {blog.readTime}</span>
								</div>
								<div className="flex space-x-2">
									<span>👁️ {blog.views}</span>
									<span>•</span>
									<span>❤️ {blog.likes}</span>
									<span>•</span>
									<span>💬 {blog.comments}</span>
								</div>
							</div>
						</div>

						{/* Author Info */}
						<div className="flex items-center justify-between p-6 bg-[#EDF1D6] rounded-2xl mb-8">
							<div className="flex items-center space-x-4">
								<span className="text-5xl">{blog.author.avatar}</span>
								<div>
									<div className="font-bold text-[#40513B] text-lg">
										{blog.author.name}
									</div>
									<div className="text-sm text-[#609966]">
										⭐ {blog.author.points} points
									</div>
									<div className="text-sm text-[#609966] max-w-md">
										{blog.author.bio}
									</div>
								</div>
							</div>
							<div className="flex space-x-3">
								<button
									onClick={handleLike}
									className={`px-6 py-3 rounded-xl font-bold transition-all ${
										liked
											? "bg-red-500 text-white"
											: "bg-white text-[#609966] hover:bg-[#9DC08B]/30"
									}`}
								>
									❤️ Like
								</button>
								<button
									onClick={handleShare}
									className="px-6 py-3 bg-white text-[#609966] rounded-xl font-bold hover:bg-[#9DC08B]/30 transition-all"
								>
									🔗 Share
								</button>
							</div>
						</div>

						{/* Article Content */}
						<div className="prose prose-lg max-w-none mb-8">
							<div className="text-[#40513B] leading-relaxed whitespace-pre-line">
								{blog.content}
							</div>
						</div>

						{/* Tags */}
						<div className="mb-8 pb-8 border-b-2 border-[#EDF1D6]">
							<h3 className="text-xl font-bold text-[#40513B] mb-3">Tags</h3>
							<div className="flex flex-wrap gap-2">
								{blog.tags.map((tag) => (
									<span
										key={tag}
										className="px-4 py-2 bg-[#EDF1D6] text-[#609966] rounded-xl font-medium hover:bg-[#9DC08B]/30 transition-colors cursor-pointer"
									>
										#{tag}
									</span>
								))}
							</div>
						</div>

						{/* Comments Section */}
						<CommentBox postId={id} postType="blog" />
					</div>
				</article>

				{/* Related Blogs */}
				<div className="mt-8">
					<h2 className="text-2xl font-bold text-[#40513B] mb-4">
						Related Articles
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{[1, 2, 3].map((i) => (
							<Link
								key={i}
								to={`/blogs/${i}`}
								className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-[#9DC08B]/20 overflow-hidden hover:scale-105 transition-transform"
							>
								<div className="h-48 bg-gradient-to-r from-[#EDF1D6] to-[#9DC08B]/30 flex items-center justify-center text-6xl">
									✍️
								</div>
								<div className="p-4">
									<div className="text-xs text-[#609966] mb-2">
										CONSERVATION
									</div>
									<h3 className="font-bold text-[#40513B] mb-2">
										Related Article {i}
									</h3>
									<p className="text-sm text-[#609966]">
										Click to read more about conservation efforts...
									</p>
									<div className="flex items-center justify-between mt-3 text-xs text-[#609966]">
										<span>📅 Jan 15, 2024</span>
										<span>⏱️ 5 min read</span>
									</div>
								</div>
							</Link>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default BlogDetail;
