import { useState } from "react";
import { useStorage } from "../../hooks/useStorage";
import LoadingSpinner from "../common/LoadingSpinner";

const PhotoUploadForm = ({ onSubmit, onCancel }) => {
	const [formData, setFormData] = useState({
		title: "",
		species: "",
		location: "",
		date: "",
		time: "",
		weather: "",
		description: "",
		tags: "",
	});
	const [imageFile, setImageFile] = useState(null);
	const [imagePreview, setImagePreview] = useState(null);
	const [uploading, setUploading] = useState(false);
	const [error, setError] = useState("");
	const { uploadImage } = useStorage();

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			if (file.size > 10 * 1024 * 1024) {
				setError("Image size should be less than 10MB");
				return;
			}
			if (!file.type.startsWith("image/")) {
				setError("Please select a valid image file");
				return;
			}
			setImageFile(file);
			setImagePreview(URL.createObjectURL(file));
			setError("");
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		if (!imageFile) {
			setError("Please select an image");
			return;
		}

		setUploading(true);
		try {
			// Upload image
			const imageUrl = await uploadImage(imageFile, "sightings");

			// Prepare submission data
			const submissionData = {
				...formData,
				imageUrl,
				tags: formData.tags
					.split(",")
					.map((tag) => tag.trim())
					.filter(Boolean),
				status: "pending",
				createdAt: new Date().toISOString(),
			};

			await onSubmit(submissionData);
		} catch (err) {
			setError(err.message || "Failed to upload photo");
		} finally {
			setUploading(false);
		}
	};

	if (uploading) {
		return <LoadingSpinner message="Uploading your photo..." />;
	}

	return (
		<div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-2 border-[#9DC08B]/20">
			<h2 className="text-3xl font-bold text-[#40513B] mb-6 flex items-center">
				<span className="mr-3 text-4xl">📸</span>
				Upload Wildlife Photo
			</h2>

			{error && (
				<div className="mb-6 p-4 bg-red-100 border-2 border-red-300 text-red-700 rounded-2xl">
					{error}
				</div>
			)}

			<form onSubmit={handleSubmit} className="space-y-6">
				{/* Image Upload */}
				<div>
					<label className="block text-sm font-bold text-[#40513B] mb-2">
						Wildlife Photo *
					</label>
					<div className="relative">
						<input
							type="file"
							accept="image/*"
							onChange={handleImageChange}
							className="hidden"
							id="photo-upload"
							required
						/>
						<label
							htmlFor="photo-upload"
							className="block w-full px-6 py-4 border-2 border-dashed border-[#9DC08B] rounded-2xl text-center cursor-pointer hover:border-[#609966] hover:bg-[#EDF1D6]/50 transition-all"
						>
							{imagePreview ? (
								<div className="relative">
									<img
										src={imagePreview}
										alt="Preview"
										className="max-h-64 mx-auto rounded-xl"
									/>
									<div className="mt-4 text-sm text-[#609966]">
										Click to change image
									</div>
								</div>
							) : (
								<div>
									<div className="text-6xl mb-2">📷</div>
									<p className="text-[#609966] font-medium">
										Click to upload or drag and drop
									</p>
									<p className="text-xs text-[#609966]/60 mt-1">
										PNG, JPG up to 10MB
									</p>
								</div>
							)}
						</label>
					</div>
				</div>

				{/* Two Column Layout */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<label
							htmlFor="title"
							className="block text-sm font-bold text-[#40513B] mb-2"
						>
							Title *
						</label>
						<input
							type="text"
							id="title"
							name="title"
							value={formData.title}
							onChange={handleChange}
							required
							className="w-full px-4 py-3 rounded-xl border-2 border-[#9DC08B]/30 focus:border-[#609966] focus:outline-none transition-colors bg-white/50"
							placeholder="e.g., Elephant in Tea Estate"
						/>
					</div>

					<div>
						<label
							htmlFor="species"
							className="block text-sm font-bold text-[#40513B] mb-2"
						>
							Species *
						</label>
						<input
							type="text"
							id="species"
							name="species"
							value={formData.species}
							onChange={handleChange}
							required
							className="w-full px-4 py-3 rounded-xl border-2 border-[#9DC08B]/30 focus:border-[#609966] focus:outline-none transition-colors bg-white/50"
							placeholder="e.g., Asian Elephant"
						/>
					</div>

					<div>
						<label
							htmlFor="location"
							className="block text-sm font-bold text-[#40513B] mb-2"
						>
							Location *
						</label>
						<input
							type="text"
							id="location"
							name="location"
							value={formData.location}
							onChange={handleChange}
							required
							className="w-full px-4 py-3 rounded-xl border-2 border-[#9DC08B]/30 focus:border-[#609966] focus:outline-none transition-colors bg-white/50"
							placeholder="e.g., Valparai Tea Estate"
						/>
					</div>

					<div>
						<label
							htmlFor="date"
							className="block text-sm font-bold text-[#40513B] mb-2"
						>
							Date *
						</label>
						<input
							type="date"
							id="date"
							name="date"
							value={formData.date}
							onChange={handleChange}
							required
							max={new Date().toISOString().split("T")[0]}
							className="w-full px-4 py-3 rounded-xl border-2 border-[#9DC08B]/30 focus:border-[#609966] focus:outline-none transition-colors bg-white/50"
						/>
					</div>

					<div>
						<label
							htmlFor="time"
							className="block text-sm font-bold text-[#40513B] mb-2"
						>
							Time
						</label>
						<input
							type="time"
							id="time"
							name="time"
							value={formData.time}
							onChange={handleChange}
							className="w-full px-4 py-3 rounded-xl border-2 border-[#9DC08B]/30 focus:border-[#609966] focus:outline-none transition-colors bg-white/50"
						/>
					</div>

					<div>
						<label
							htmlFor="weather"
							className="block text-sm font-bold text-[#40513B] mb-2"
						>
							Weather
						</label>
						<select
							id="weather"
							name="weather"
							value={formData.weather}
							onChange={handleChange}
							className="w-full px-4 py-3 rounded-xl border-2 border-[#9DC08B]/30 focus:border-[#609966] focus:outline-none transition-colors bg-white/50"
						>
							<option value="">Select weather</option>
							<option value="sunny">☀️ Sunny</option>
							<option value="cloudy">☁️ Cloudy</option>
							<option value="rainy">🌧️ Rainy</option>
							<option value="foggy">🌫️ Foggy</option>
						</select>
					</div>
				</div>

				{/* Description */}
				<div>
					<label
						htmlFor="description"
						className="block text-sm font-bold text-[#40513B] mb-2"
					>
						Description *
					</label>
					<textarea
						id="description"
						name="description"
						value={formData.description}
						onChange={handleChange}
						required
						rows={4}
						className="w-full px-4 py-3 rounded-xl border-2 border-[#9DC08B]/30 focus:border-[#609966] focus:outline-none transition-colors bg-white/50 resize-none"
						placeholder="Describe what you observed..."
					/>
				</div>

				{/* Tags */}
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
						placeholder="wildlife, elephant, valparai"
					/>
				</div>

				{/* Action Buttons */}
				<div className="flex space-x-4 pt-4">
					<button
						type="submit"
						disabled={uploading}
						className="flex-1 px-8 py-4 bg-gradient-to-r from-[#609966] to-[#40513B] text-white rounded-2xl font-bold text-lg hover:scale-105 hover:shadow-2xl transition-all duration-300 disabled:opacity-50"
					>
						{uploading ? "Uploading..." : "Submit Photo"}
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

export default PhotoUploadForm;
