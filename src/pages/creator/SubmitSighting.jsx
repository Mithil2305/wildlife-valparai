import { useNavigate } from "react-router-dom";
import PhotoUploadForm from "../../components/forms/PhotoUploadForm";

const SubmitSighting = () => {
	const navigate = useNavigate();

	const handleSubmit = async (sightingData) => {
		try {
			console.log("Submitting sighting:", sightingData);
			// API call to submit sighting
			await new Promise((resolve) => setTimeout(resolve, 1500));

			navigate("/creator/my-content", {
				state: { message: "Sighting submitted for review!" },
			});
		} catch (error) {
			console.error("Failed to submit sighting:", error);
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
					<span className="text-[#40513B] font-medium">Submit Sighting</span>
				</div>

				{/* Header */}
				<div className="mb-8 text-center">
					<h1 className="text-4xl font-bold text-[#40513B] mb-3 flex items-center justify-center">
						<span className="mr-3 text-5xl">🦁</span>
						Submit Wildlife Sighting
					</h1>
					<p className="text-lg text-[#609966]">
						Share your wildlife encounters with the community
					</p>
				</div>

				{/* Photo Upload Form */}
				<PhotoUploadForm onSubmit={handleSubmit} onCancel={handleCancel} />

				{/* Guidelines */}
				<div className="mt-6 bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-2 border-[#9DC08B]/20">
					<h3 className="text-xl font-bold text-[#40513B] mb-4 flex items-center">
						<span className="mr-2">📋</span>
						Submission Guidelines
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-3">
							<h4 className="font-bold text-[#609966]">✅ Do's</h4>
							<ul className="space-y-2 text-sm text-[#40513B]">
								<li className="flex items-start">
									<span className="mr-2">•</span>
									<span>Use clear, high-quality photos</span>
								</li>
								<li className="flex items-start">
									<span className="mr-2">•</span>
									<span>Provide accurate location details</span>
								</li>
								<li className="flex items-start">
									<span className="mr-2">•</span>
									<span>Include date and time of sighting</span>
								</li>
								<li className="flex items-start">
									<span className="mr-2">•</span>
									<span>Add detailed descriptions</span>
								</li>
							</ul>
						</div>
						<div className="space-y-3">
							<h4 className="font-bold text-red-600">❌ Don'ts</h4>
							<ul className="space-y-2 text-sm text-[#40513B]">
								<li className="flex items-start">
									<span className="mr-2">•</span>
									<span>Don't submit blurry or low-quality images</span>
								</li>
								<li className="flex items-start">
									<span className="mr-2">•</span>
									<span>Don't include personal information in photos</span>
								</li>
								<li className="flex items-start">
									<span className="mr-2">•</span>
									<span>Don't disturb wildlife for photos</span>
								</li>
								<li className="flex items-start">
									<span className="mr-2">•</span>
									<span>Don't submit copyrighted content</span>
								</li>
							</ul>
						</div>
					</div>
				</div>

				{/* Points Info */}
				<div className="mt-6 bg-gradient-to-r from-[#609966] to-[#40513B] rounded-2xl p-6 shadow-xl text-white">
					<h3 className="text-xl font-bold mb-3 flex items-center">
						<span className="mr-2">⭐</span>
						Earn Points!
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
							<div className="text-2xl font-bold mb-1">+50</div>
							<div className="text-sm opacity-90">Submission</div>
						</div>
						<div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
							<div className="text-2xl font-bold mb-1">+100</div>
							<div className="text-sm opacity-90">Approval</div>
						</div>
						<div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
							<div className="text-2xl font-bold mb-1">+10</div>
							<div className="text-sm opacity-90">Per Like</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SubmitSighting;
