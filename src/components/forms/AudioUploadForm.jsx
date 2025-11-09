import { useState, useRef } from "react";
import { useStorage } from "../../hooks/useStorage";
import LoadingSpinner from "../common/LoadingSpinner";

const AudioUploadForm = ({ onSubmit, onCancel }) => {
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		language: "en",
		category: "",
		tags: "",
	});
	const [audioFile, setAudioFile] = useState(null);
	const [audioPreview, setAudioPreview] = useState(null);
	const [duration, setDuration] = useState(0);
	const [uploading, setUploading] = useState(false);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [error, setError] = useState("");
	const audioRef = useRef(null);
	const { uploadAudio } = useStorage();

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleAudioChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			if (file.size > 50 * 1024 * 1024) {
				setError("Audio file should be less than 50MB");
				return;
			}
			if (!file.type.startsWith("audio/")) {
				setError("Please select a valid audio file");
				return;
			}

			setAudioFile(file);
			const url = URL.createObjectURL(file);
			setAudioPreview(url);

			// Get audio duration
			const audio = new Audio(url);
			audio.addEventListener("loadedmetadata", () => {
				setDuration(Math.floor(audio.duration));
			});

			setError("");
		}
	};

	const formatDuration = (seconds) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		if (!audioFile) {
			setError("Please select an audio file");
			return;
		}

		setUploading(true);
		try {
			// Simulate upload progress
			const progressInterval = setInterval(() => {
				setUploadProgress((prev) => Math.min(prev + 10, 90));
			}, 300);

			// Upload audio
			const audioUrl = await uploadAudio(audioFile, "audio-experiences");
			clearInterval(progressInterval);
			setUploadProgress(100);

			// Prepare submission data
			const submissionData = {
				...formData,
				audioUrl,
				duration,
				fileSize: audioFile.size,
				mimeType: audioFile.type,
				tags: formData.tags
					.split(",")
					.map((tag) => tag.trim())
					.filter(Boolean),
				status: "pending",
				createdAt: new Date().toISOString(),
			};

			await onSubmit(submissionData);
		} catch (err) {
			setError(err.message || "Failed to upload audio");
			setUploadProgress(0);
		} finally {
			setUploading(false);
		}
	};

	if (uploading) {
		return (
			<div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-2 border-[#9DC08B]/20">
				<LoadingSpinner message="Uploading your audio..." />
				<div className="mt-6">
					<div className="w-full bg-[#EDF1D6] rounded-full h-4 overflow-hidden">
						<div
							className="bg-gradient-to-r from-[#609966] to-[#40513B] h-full transition-all duration-300 rounded-full"
							style={{ width: `${uploadProgress}%` }}
						/>
					</div>
					<p className="text-center mt-2 text-[#609966] font-medium">
						{uploadProgress}% uploaded
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-2 border-[#9DC08B]/20">
			<h2 className="text-3xl font-bold text-[#40513B] mb-6 flex items-center">
				<span className="mr-3 text-4xl">🎵</span>
				Upload Audio Experience
			</h2>

			{error && (
				<div className="mb-6 p-4 bg-red-100 border-2 border-red-300 text-red-700 rounded-2xl">
					{error}
				</div>
			)}

			<form onSubmit={handleSubmit} className="space-y-6">
				{/* Audio Upload */}
				<div>
					<label className="block text-sm font-bold text-[#40513B] mb-2">
						Audio File *
					</label>
					<div className="relative">
						<input
							type="file"
							accept="audio/*"
							onChange={handleAudioChange}
							className="hidden"
							id="audio-upload"
							required
						/>
						<label
							htmlFor="audio-upload"
							className="block w-full px-6 py-8 border-2 border-dashed border-[#9DC08B] rounded-2xl text-center cursor-pointer hover:border-[#609966] hover:bg-[#EDF1D6]/50 transition-all"
						>
							{audioPreview ? (
								<div>
									<div className="text-6xl mb-4">🎧</div>
									<audio
										ref={audioRef}
										src={audioPreview}
										controls
										className="w-full mb-4"
									/>
									<div className="flex justify-center items-center space-x-4 text-sm text-[#609966]">
										<span>
											📊 {(audioFile.size / (1024 * 1024)).toFixed(2)} MB
										</span>
										<span>⏱️ {formatDuration(duration)}</span>
									</div>
									<p className="mt-4 text-sm text-[#609966]">
										Click to change audio
									</p>
								</div>
							) : (
								<div>
									<div className="text-6xl mb-2">🎤</div>
									<p className="text-[#609966] font-medium">
										Click to upload or drag and drop
									</p>
									<p className="text-xs text-[#609966]/60 mt-1">
										MP3, WAV, M4A up to 50MB
									</p>
								</div>
							)}
						</label>
					</div>
				</div>

				{/* Title & Category */}
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
							placeholder="e.g., Morning Birds in Valparai"
						/>
					</div>

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
							<option value="bird-calls">🦜 Bird Calls</option>
							<option value="animal-sounds">🐘 Animal Sounds</option>
							<option value="nature-ambience">🌿 Nature Ambience</option>
							<option value="educational">📚 Educational</option>
							<option value="story">📖 Story</option>
							<option value="guide">🗺️ Guide</option>
						</select>
					</div>
				</div>

				{/* Language Selection */}
				<div>
					<label
						htmlFor="language"
						className="block text-sm font-bold text-[#40513B] mb-2"
					>
						Language *
					</label>
					<div className="grid grid-cols-3 gap-4">
						{[
							{ code: "en", label: "English", flag: "🇬🇧" },
							{ code: "ta", label: "Tamil", flag: "🇮🇳" },
							{ code: "hi", label: "Hindi", flag: "🇮🇳" },
						].map((lang) => (
							<label
								key={lang.code}
								className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all ${
									formData.language === lang.code
										? "border-[#609966] bg-[#609966]/10"
										: "border-[#9DC08B]/30 hover:border-[#9DC08B]"
								}`}
							>
								<input
									type="radio"
									name="language"
									value={lang.code}
									checked={formData.language === lang.code}
									onChange={handleChange}
									className="hidden"
								/>
								<span className="text-2xl">{lang.flag}</span>
								<span className="font-medium text-[#40513B]">{lang.label}</span>
							</label>
						))}
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
						placeholder="Describe your audio experience..."
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
						placeholder="nature, birds, valparai, morning"
					/>
				</div>

				{/* Action Buttons */}
				<div className="flex space-x-4 pt-4">
					<button
						type="submit"
						disabled={uploading}
						className="flex-1 px-8 py-4 bg-gradient-to-r from-[#609966] to-[#40513B] text-white rounded-2xl font-bold text-lg hover:scale-105 hover:shadow-2xl transition-all duration-300 disabled:opacity-50"
					>
						{uploading ? "Uploading..." : "Submit Audio"}
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

export default AudioUploadForm;
