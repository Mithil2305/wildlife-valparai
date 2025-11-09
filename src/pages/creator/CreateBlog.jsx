import { useNavigate } from "react-router-dom";
import BlogEditor from "../../components/forms/BlogEditor";

const CreateBlog = () => {
	const navigate = useNavigate();

	const handleSubmit = async (blogData) => {
		try {
			// API call to create blog
			console.log("Creating blog:", blogData);

			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1500));

			// Navigate to dashboard on success
			navigate("/creator/my-content", {
				state: { message: "Blog created successfully!" },
			});
		} catch (error) {
			console.error("Failed to create blog:", error);
			throw error;
		}
	};

	const handleCancel = () => {
		navigate("/creator/dashboard");
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-[#EDF1D6] via-white to-[#9DC08B]/20 py-8">
			<div className="max-w-6xl mx-auto px-4">
				{/* Breadcrumb */}
				<div className="mb-6 flex items-center space-x-2 text-sm text-[#609966]">
					<a href="/creator/dashboard" className="hover:text-[#40513B]">
						Dashboard
					</a>
					<span>›</span>
					<span className="text-[#40513B] font-medium">Create Blog</span>
				</div>

				{/* Blog Editor */}
				<BlogEditor onSubmit={handleSubmit} onCancel={handleCancel} />

				{/* Tips Card */}
				<div className="mt-6 bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-2 border-[#9DC08B]/20">
					<h3 className="text-xl font-bold text-[#40513B] mb-4 flex items-center">
						<span className="mr-2">💡</span>
						Writing Tips
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="flex items-start space-x-3">
							<span className="text-2xl">📖</span>
							<div>
								<h4 className="font-bold text-[#40513B]">Tell a Story</h4>
								<p className="text-sm text-[#609966]">
									Share your personal wildlife experiences to connect with
									readers
								</p>
							</div>
						</div>
						<div className="flex items-start space-x-3">
							<span className="text-2xl">📸</span>
							<div>
								<h4 className="font-bold text-[#40513B]">Use Quality Images</h4>
								<p className="text-sm text-[#609966]">
									High-quality featured images get 3x more engagement
								</p>
							</div>
						</div>
						<div className="flex items-start space-x-3">
							<span className="text-2xl">🏷️</span>
							<div>
								<h4 className="font-bold text-[#40513B]">Add Relevant Tags</h4>
								<p className="text-sm text-[#609966]">
									Help readers discover your content through proper tagging
								</p>
							</div>
						</div>
						<div className="flex items-start space-x-3">
							<span className="text-2xl">✅</span>
							<div>
								<h4 className="font-bold text-[#40513B]">
									Review Before Publishing
								</h4>
								<p className="text-sm text-[#609966]">
									Check for spelling and grammar to maintain quality
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CreateBlog;
