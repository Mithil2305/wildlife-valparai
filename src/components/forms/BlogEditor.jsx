import { useState, useRef, useEffect } from "react";
import LoadingSpinner from "../common/LoadingSpinner";

const BlogEditor = ({ initialData, onSubmit, onCancel }) => {
	const [formData, setFormData] = useState({
		title: "",
		excerpt: "",
		content: "",
		category: "",
		tags: "",
		featuredImage: null,
		status: "draft",
		...initialData,
	});
	const [imagePreview, setImagePreview] = useState(
		initialData?.featuredImage || null
	);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");
	const [wordCount, setWordCount] = useState(0);
	const [activeTab, setActiveTab] = useState("write");
	const contentRef = useRef(null);

	useEffect(() => {
		const words = formData.content.trim().split(/\s+/).filter(Boolean).length;
		setWordCount(words);
	}, [formData.content]);

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			if (file.size > 5 * 1024 * 1024) {
				setError("Image should be less than 5MB");
				return;
			}
			setFormData({ ...formData, featuredImage: file });
			setImagePreview(URL.createObjectURL(file));
			setError("");
		}
	};

	const insertFormatting = (format) => {
		const textarea = contentRef.current;
		const start = textarea.selectionStart;
		const end = textarea.selectionEnd;
		const selectedText = formData.content.substring(start, end);
		let newText = "";

		switch (format) {
			case "bold":
				newText = `**${selectedText}**`;
				break;
			case "italic":
				newText = `*${selectedText}*`;
				break;
			case "heading":
				newText = `## ${selectedText}`;
				break;
			case "link":
				newText = `[${selectedText}](url)`;
				break;
			case "list":
				newText = `- ${selectedText}`;
				break;
			default:
				return;
		}

		const newContent =
			formData.content.substring(0, start) +
			newText +
			formData.content.substring(end);

		setFormData({ ...formData, content: newContent });
		setTimeout(() => {
			textarea.focus();
			textarea.setSelectionRange(
				start + newText.length,
				start + newText.length
			);
		}, 0);
	};

	const handleSubmit = async (e, status = formData.status) => {
		e.preventDefault();
		setError("");
		setSaving(true);

		try {
			const submissionData = {
				...formData,
				status,
				tags: formData.tags
					.split(",")
					.map((tag) => tag.trim())
					.filter(Boolean),
				updatedAt: new Date().toISOString(),
			};

			if (!initialData) {
				submissionData.createdAt = new Date().toISOString();
			}

			await onSubmit(submissionData);
		} catch (err) {
			setError(err.message || "Failed to save blog");
		} finally {
			setSaving(false);
		}
	};

	if (saving) {
		return <LoadingSpinner message="Saving your blog..." />;
	}

	return (
		<div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-2 border-[#9DC08B]/20">
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-3xl font-bold text-[#40513B] flex items-center">
					<span className="mr-3 text-4xl">✍️</span>
					{initialData ? "Edit Blog" : "Create New Blog"}
				</h2>
				<div className="flex items-center space-x-4 text-sm text-[#609966]">
					<span>📝 {wordCount} words</span>
					<span className="px-3 py-1 bg-[#EDF1D6] rounded-full">
						{formData.status === "draft" ? "📄 Draft" : "✅ Published"}
					</span>
				</div>
			</div>

			{error && (
				<div className="mb-6 p-4 bg-red-100 border-2 border-red-300 text-red-700 rounded-2xl">
					{error}
				</div>
			)}

			<form onSubmit={handleSubmit} className="space-y-6">
				{/* Featured Image */}
				<div>
					<label className="block text-sm font-bold text-[#40513B] mb-2">
						Featured Image
					</label>
					<div className="relative">
						<input
							type="file"
							accept="image/*"
							onChange={handleImageChange}
							className="hidden"
							id="featured-image"
						/>
						<label
							htmlFor="featured-image"
							className="block w-full px-6 py-4 border-2 border-dashed border-[#9DC08B] rounded-2xl text-center cursor-pointer hover:border-[#609966] hover:bg-[#EDF1D6]/50 transition-all"
						>
							{imagePreview ? (
								<div className="relative">
									<img
										src={imagePreview}
										alt="Preview"
										className="max-h-48 mx-auto rounded-xl"
									/>
									<div className="mt-4 text-sm text-[#609966]">
										Click to change image
									</div>
								</div>
							) : (
								<div>
									<div className="text-4xl mb-2">🖼️</div>
									<p className="text-[#609966] font-medium">
										Upload featured image
									</p>
								</div>
							)}
						</label>
					</div>
				</div>

				{/* Title */}
				<div>
					<label
						htmlFor="title"
						className="block text-sm font-bold text-[#40513B] mb-2"
					>
						Blog Title *
					</label>
					<input
						type="text"
						id="title"
						name="title"
						value={formData.title}
						onChange={handleChange}
						required
						className="w-full px-4 py-3 rounded-xl border-2 border-[#9DC08B]/30 focus:border-[#609966] focus:outline-none transition-colors bg-white/50 text-lg font-medium"
						placeholder="Enter your blog title..."
					/>
				</div>

				{/* Category & Tags */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<label
							htmlFor="category"
							className="block text-sm font-bold text-[#40513B] mb-2"
						>
							Category *
						</label>
						<select
							id="category"
							name="category"
							value={formData.category}
							onChange={handleChange}
							required
							className="w-full px-4 py-3 rounded-xl border-2 border-[#9DC08B]/30 focus:border-[#609966] focus:outline-none transition-colors bg-white/50"
						>
							<option value="">Select category</option>
							<option value="wildlife">🦁 Wildlife</option>
							<option value="conservation">🌍 Conservation</option>
							<option value="photography">📷 Photography</option>
							<option value="travel">✈️ Travel</option>
							<option value="education">📚 Education</option>
							<option value="research">🔬 Research</option>
						</select>
					</div>

					<div>
						<label
							htmlFor="tags"
							className="block text-sm font-bold text-[#40513B] mb-2"
						>
							Tags (comma-separated)
						</label>
						<input
							type="text"
							id="tags"
							name="tags"
							value={formData.tags}
							onChange={handleChange}
							className="w-full px-4 py-3 rounded-xl border-2 border-[#9DC08B]/30 focus:border-[#609966] focus:outline-none transition-colors bg-white/50"
							placeholder="wildlife, nature, valparai"
						/>
					</div>
				</div>

				{/* Excerpt */}
				<div>
					<label
						htmlFor="excerpt"
						className="block text-sm font-bold text-[#40513B] mb-2"
					>
						Excerpt (Short Summary) *
					</label>
					<textarea
						id="excerpt"
						name="excerpt"
						value={formData.excerpt}
						onChange={handleChange}
						required
						rows={2}
						className="w-full px-4 py-3 rounded-xl border-2 border-[#9DC08B]/30 focus:border-[#609966] focus:outline-none transition-colors bg-white/50 resize-none"
						placeholder="Brief description of your blog (max 200 characters)..."
						maxLength={200}
					/>
					<div className="text-xs text-[#609966]/60 mt-1 text-right">
						{formData.excerpt.length}/200
					</div>
				</div>

				{/* Content Editor */}
				<div>
					<label className="block text-sm font-bold text-[#40513B] mb-2">
						Content *
					</label>

					{/* Tabs */}
					<div className="flex space-x-2 mb-4">
						<button
							type="button"
							onClick={() => setActiveTab("write")}
							className={`px-6 py-2 rounded-xl font-medium transition-all ${
								activeTab === "write"
									? "bg-[#609966] text-white"
									: "bg-[#EDF1D6] text-[#609966] hover:bg-[#9DC08B]/30"
							}`}
						>
							✍️ Write
						</button>
						<button
							type="button"
							onClick={() => setActiveTab("preview")}
							className={`px-6 py-2 rounded-xl font-medium transition-all ${
								activeTab === "preview"
									? "bg-[#609966] text-white"
									: "bg-[#EDF1D6] text-[#609966] hover:bg-[#9DC08B]/30"
							}`}
						>
							👁️ Preview
						</button>
					</div>

					{activeTab === "write" ? (
						<>
							{/* Formatting Toolbar */}
							<div className="flex flex-wrap gap-2 mb-4 p-3 bg-[#EDF1D6] rounded-xl">
								<button
									type="button"
									onClick={() => insertFormatting("bold")}
									className="px-3 py-1 bg-white rounded-lg hover:bg-[#9DC08B]/30 transition-colors font-bold"
									title="Bold"
								>
									B
								</button>
								<button
									type="button"
									onClick={() => insertFormatting("italic")}
									className="px-3 py-1 bg-white rounded-lg hover:bg-[#9DC08B]/30 transition-colors italic"
									title="Italic"
								>
									I
								</button>
								<button
									type="button"
									onClick={() => insertFormatting("heading")}
									className="px-3 py-1 bg-white rounded-lg hover:bg-[#9DC08B]/30 transition-colors"
									title="Heading"
								>
									H
								</button>
								<button
									type="button"
									onClick={() => insertFormatting("link")}
									className="px-3 py-1 bg-white rounded-lg hover:bg-[#9DC08B]/30 transition-colors"
									title="Link"
								>
									🔗
								</button>
								<button
									type="button"
									onClick={() => insertFormatting("list")}
									className="px-3 py-1 bg-white rounded-lg hover:bg-[#9DC08B]/30 transition-colors"
									title="List"
								>
									📋
								</button>
							</div>

							<textarea
								ref={contentRef}
								id="content"
								name="content"
								value={formData.content}
								onChange={handleChange}
								required
								rows={15}
								className="w-full px-4 py-3 rounded-xl border-2 border-[#9DC08B]/30 focus:border-[#609966] focus:outline-none transition-colors bg-white/50 resize-none font-mono text-sm"
								placeholder="Write your blog content here... (Supports Markdown)"
							/>
						</>
					) : (
						<div className="prose max-w-none p-6 bg-white/50 rounded-xl border-2 border-[#9DC08B]/30 min-h-[400px]">
							{formData.content ? (
								<div className="whitespace-pre-wrap">{formData.content}</div>
							) : (
								<p className="text-[#609966]/60 italic">
									No content to preview...
								</p>
							)}
						</div>
					)}
				</div>

				{/* Action Buttons */}
				<div className="flex space-x-4 pt-4">
					<button
						type="button"
						onClick={(e) => handleSubmit(e, "draft")}
						disabled={saving}
						className="px-8 py-4 bg-white border-2 border-[#9DC08B] text-[#609966] rounded-2xl font-bold text-lg hover:bg-[#EDF1D6] transition-all"
					>
						💾 Save as Draft
					</button>
					<button
						type="button"
						onClick={(e) => handleSubmit(e, "published")}
						disabled={saving}
						className="flex-1 px-8 py-4 bg-gradient-to-r from-[#609966] to-[#40513B] text-white rounded-2xl font-bold text-lg hover:scale-105 hover:shadow-2xl transition-all duration-300 disabled:opacity-50"
					>
						{initialData ? "📤 Update & Publish" : "🚀 Publish Blog"}
					</button>
					{onCancel && (
						<button
							type="button"
							onClick={onCancel}
							className="px-8 py-4 bg-white border-2 border-[#9DC08B]/30 text-[#609966] rounded-2xl font-bold text-lg hover:bg-[#EDF1D6] transition-all"
						>
							Cancel
						</button>
					)}
				</div>
			</form>
		</div>
	);
};

export default BlogEditor;
