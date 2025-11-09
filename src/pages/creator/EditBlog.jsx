import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BlogEditor from "../../components/forms/BlogEditor";

const EditBlog = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [blogData, setBlogData] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		loadBlogData();
	}, [id]);

	const loadBlogData = async () => {
		setLoading(true);
		// Simulate API call to fetch blog data
		setTimeout(() => {
			setBlogData({
				title: "Elephant Migration Patterns in Valparai",
				excerpt:
					"Understanding the seasonal movements of elephants through tea estates",
				content: "The elephants of Valparai follow ancient migration routes...",
				category: "wildlife",
				tags: "elephants, valparai, migration",
				featuredImage: "/path/to/image.jpg",
				status: "published",
			});
			setLoading(false);
		}, 1000);
	};

	const handleSubmit = async (updatedData) => {
		try {
			console.log("Updating blog:", id, updatedData);
			// API call to update blog
			await new Promise((resolve) => setTimeout(resolve, 1500));

			navigate("/creator/my-content", {
				state: { message: "Blog updated successfully!" },
			});
		} catch (error) {
			console.error("Failed to update blog:", error);
			throw error;
		}
	};

	const handleCancel = () => {
		navigate("/creator/my-content");
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-[#EDF1D6] via-white to-[#9DC08B]/20 flex items-center justify-center">
				<div className="text-center">
					<div className="text-6xl mb-4 animate-pulse">📝</div>
					<div className="text-xl text-[#609966]">Loading blog...</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-[#EDF1D6] via-white to-[#9DC08B]/20 py-8">
			<div className="max-w-6xl mx-auto px-4">
				{/* Breadcrumb */}
				<div className="mb-6 flex items-center space-x-2 text-sm text-[#609966]">
					<a href="/creator/dashboard" className="hover:text-[#40513B]">
						Dashboard
					</a>
					<span>›</span>
					<a href="/creator/my-content" className="hover:text-[#40513B]">
						My Content
					</a>
					<span>›</span>
					<span className="text-[#40513B] font-medium">Edit Blog</span>
				</div>

				{/* Blog Editor with Initial Data */}
				<BlogEditor
					initialData={blogData}
					onSubmit={handleSubmit}
					onCancel={handleCancel}
				/>
			</div>
		</div>
	);
};

export default EditBlog;
