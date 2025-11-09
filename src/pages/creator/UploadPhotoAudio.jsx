import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PhotoUploadForm from "../../components/forms/PhotoUploadForm";
import AudioUploadForm from "../../components/forms/AudioUploadForm";

const UploadPhotoAudio = () => {
	const navigate = useNavigate();
	const [uploadType, setUploadType] = useState("photo");

	const handlePhotoSubmit = async (photoData) => {
		try {
			console.log("Uploading photo:", photoData);
			await new Promise((resolve) => setTimeout(resolve, 1500));

			navigate("/creator/my-content", {
				state: { message: "Photo uploaded successfully!" },
			});
		} catch (error) {
			console.error("Failed to upload photo:", error);
			throw error;
		}
	};

	const handleAudioSubmit = async (audioData) => {
		try {
			console.log("Uploading audio:", audioData);
			await new Promise((resolve) => setTimeout(resolve, 1500));

			navigate("/creator/my-content", {
				state: { message: "Audio uploaded successfully!" },
			});
		} catch (error) {
			console.error("Failed to upload audio:", error);
			throw error;
		}
	};

	const handleCancel = () => {
		navigate("/creator/dashboard");
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-[#EDF1D6] via-white to-[#9DC08B]/20 py-8">
			<div className="max-w-4xl mx-auto px-4">
				{/* Breadcrumb */}
				<div className="mb-6 flex items-center space-x-2 text-sm text-[#609966]">
					<a href="/creator/dashboard" className="hover:text-[#40513B]">
						Dashboard
					</a>
					<span>›</span>
					<span className="text-[#40513B] font-medium">Upload Media</span>
				</div>

				{/* Header */}
				<div className="mb-8 text-center">
					<h1 className="text-4xl font-bold text-[#40513B] mb-3 flex items-center justify-center">
						<span className="mr-3 text-5xl">📤</span>
						Upload Photo & Audio
					</h1>
					<p className="text-lg text-[#609966]">
						Share your wildlife photos and audio experiences
					</p>
				</div>

				{/* Upload Type Selector */}
				<div className="mb-8 flex justify-center">
					<div className="bg-white/90 backdrop-blur-sm rounded-2xl p-2 shadow-lg border-2 border-[#9DC08B]/20">
						<button
							onClick={() => setUploadType("photo")}
							className={`px-8 py-3 rounded-xl font-bold transition-all ${
								uploadType === "photo"
									? "bg-gradient-to-r from-[#609966] to-[#40513B] text-white"
									: "text-[#609966] hover:bg-[#EDF1D6]"
							}`}
						>
							<span className="mr-2">📸</span>
							Photo
						</button>
						<button
							onClick={() => setUploadType("audio")}
							className={`px-8 py-3 rounded-xl font-bold transition-all ${
								uploadType === "audio"
									? "bg-gradient-to-r from-[#609966] to-[#40513B] text-white"
									: "text-[#609966] hover:bg-[#EDF1D6]"
							}`}
						>
							<span className="mr-2">🎵</span>
							Audio
						</button>
					</div>
				</div>

				{/* Upload Forms */}
				{uploadType === "photo" ? (
					<PhotoUploadForm
						onSubmit={handlePhotoSubmit}
						onCancel={handleCancel}
					/>
				) : (
					<AudioUploadForm
						onSubmit={handleAudioSubmit}
						onCancel={handleCancel}
					/>
				)}

				{/* Info Cards */}
				<div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-2 border-[#9DC08B]/20">
						<h3 className="text-xl font-bold text-[#40513B] mb-4 flex items-center">
							<span className="mr-2">📸</span>
							Photo Guidelines
						</h3>
						<ul className="space-y-2 text-sm text-[#609966]">
							<li className="flex items-start">
								<span className="mr-2">✓</span>
								<span>Upload high-resolution images (min. 1920x1080)</span>
							</li>
							<li className="flex items-start">
								<span className="mr-2">✓</span>
								<span>Supported formats: JPG, PNG (max 10MB)</span>
							</li>
							<li className="flex items-start">
								<span className="mr-2">✓</span>
								<span>Focus on clear wildlife subjects</span>
							</li>
							<li className="flex items-start">
								<span className="mr-2">✓</span>
								<span>Include relevant metadata</span>
							</li>
						</ul>
					</div>

					<div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-2 border-[#9DC08B]/20">
						<h3 className="text-xl font-bold text-[#40513B] mb-4 flex items-center">
							<span className="mr-2">🎵</span>
							Audio Guidelines
						</h3>
						<ul className="space-y-2 text-sm text-[#609966]">
							<li className="flex items-start">
								<span className="mr-2">✓</span>
								<span>Clear audio with minimal background noise</span>
							</li>
							<li className="flex items-start">
								<span className="mr-2">✓</span>
								<span>Supported formats: MP3, WAV, M4A (max 50MB)</span>
							</li>
							<li className="flex items-start">
								<span className="mr-2">✓</span>
								<span>Duration: 30 seconds to 10 minutes</span>
							</li>
							<li className="flex items-start">
								<span className="mr-2">✓</span>
								<span>Add descriptive titles and tags</span>
							</li>
						</ul>
					</div>
				</div>

				{/* Best Practices */}
				<div className="mt-6 bg-gradient-to-r from-[#EDF1D6] to-[#9DC08B]/20 rounded-2xl p-6 border-2 border-[#9DC08B]/20">
					<h3 className="text-xl font-bold text-[#40513B] mb-4 flex items-center">
						<span className="mr-2">💡</span>
						Best Practices
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div className="flex items-start space-x-3">
							<span className="text-2xl">🌅</span>
							<div>
								<h4 className="font-bold text-[#40513B]">Golden Hours</h4>
								<p className="text-sm text-[#609966]">
									Capture photos during sunrise/sunset for best lighting
								</p>
							</div>
						</div>
						<div className="flex items-start space-x-3">
							<span className="text-2xl">🎙️</span>
							<div>
								<h4 className="font-bold text-[#40513B]">Clean Audio</h4>
								<p className="text-sm text-[#609966]">
									Record in quiet environments with good equipment
								</p>
							</div>
						</div>
						<div className="flex items-start space-x-3">
							<span className="text-2xl">🏷️</span>
							<div>
								<h4 className="font-bold text-[#40513B]">Tagging</h4>
								<p className="text-sm text-[#609966]">
									Use relevant tags for better discoverability
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default UploadPhotoAudio;
