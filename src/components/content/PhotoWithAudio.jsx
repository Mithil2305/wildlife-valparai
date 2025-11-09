import { useState } from "react";
import AudioPlayer from "../common/AudioPlayer";

const PhotoWithAudio = ({ photo, className = "" }) => {
	const [showAudioPlayer, setShowAudioPlayer] = useState(false);
	const [imageLoaded, setImageLoaded] = useState(false);

	return (
		<div
			className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border-2 border-[#9DC08B]/20 ${className}`}
		>
			{/* Image Container */}
			<div className="relative">
				{/* Loading Skeleton */}
				{!imageLoaded && (
					<div className="absolute inset-0 bg-gradient-to-r from-[#EDF1D6] via-[#9DC08B]/30 to-[#EDF1D6] animate-pulse"></div>
				)}

				<img
					src={photo.imageUrl}
					alt={photo.title}
					className={`w-full h-auto transition-opacity duration-500 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
					onLoad={() => setImageLoaded(true)}
				/>

				{/* Gradient Overlay */}
				<div className="absolute inset-0 bg-gradient-to-t from-[#40513B]/60 via-transparent to-transparent"></div>

				{/* Audio Button Overlay */}
				{photo.audioUrl && (
					<button
						onClick={() => setShowAudioPlayer(!showAudioPlayer)}
						className={`absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center text-2xl backdrop-blur-sm transition-all duration-300 ${
							showAudioPlayer
								? "bg-gradient-to-r from-[#609966] to-[#40513B] text-white scale-110 rotate-180"
								: "bg-white/90 text-[#609966] hover:scale-110"
						}`}
						title={showAudioPlayer ? "Hide audio player" : "Play audio"}
					>
						{showAudioPlayer ? "🔊" : "🎵"}
					</button>
				)}

				{/* Info Overlay */}
				<div className="absolute bottom-0 left-0 right-0 p-4 text-white">
					<h3 className="text-lg font-bold mb-1">{photo.title}</h3>
					{photo.location && (
						<p className="text-sm text-white/90 flex items-center">
							<span className="mr-1">📍</span>
							{photo.location}
						</p>
					)}
					{photo.species && (
						<p className="text-sm text-white/90 flex items-center mt-1">
							<span className="mr-1">🦁</span>
							{photo.species}
						</p>
					)}
				</div>

				{/* Badge Indicators */}
				<div className="absolute top-4 left-4 flex flex-col space-y-2">
					{photo.verified && (
						<div className="px-3 py-1 bg-green-500/80 backdrop-blur-sm rounded-full text-white text-xs font-bold flex items-center space-x-1">
							<span>✓</span>
							<span>Verified</span>
						</div>
					)}
					{photo.rare && (
						<div className="px-3 py-1 bg-gradient-to-r from-[#609966] to-[#40513B] backdrop-blur-sm rounded-full text-white text-xs font-bold flex items-center space-x-1">
							<span>⭐</span>
							<span>Rare</span>
						</div>
					)}
				</div>
			</div>

			{/* Audio Player Section */}
			{photo.audioUrl && showAudioPlayer && (
				<div className="p-4 bg-gradient-to-r from-[#EDF1D6] to-[#9DC08B]/30 border-t-2 border-[#9DC08B]/30">
					<div className="mb-2 flex items-center justify-between">
						<h4 className="text-[#40513B] font-bold text-sm flex items-center">
							<span className="mr-2">🎧</span>
							Audio Description
						</h4>
						<button
							onClick={() => setShowAudioPlayer(false)}
							className="text-[#609966] hover:text-[#40513B] text-sm font-medium"
						>
							Close
						</button>
					</div>
					<AudioPlayer
						audioUrl={photo.audioUrl}
						title={photo.audioTitle || "Wildlife Sound"}
					/>
				</div>
			)}

			{/* Details Section */}
			{photo.description && (
				<div className="p-4 border-t-2 border-[#9DC08B]/20">
					<p className="text-[#609966] text-sm leading-relaxed">
						{photo.description}
					</p>

					{/* Metadata */}
					<div className="mt-4 flex flex-wrap gap-3 text-xs">
						{photo.date && (
							<div className="flex items-center space-x-1 text-[#609966]">
								<span>📅</span>
								<span>{new Date(photo.date).toLocaleDateString()}</span>
							</div>
						)}
						{photo.time && (
							<div className="flex items-center space-x-1 text-[#609966]">
								<span>🕐</span>
								<span>{photo.time}</span>
							</div>
						)}
						{photo.weather && (
							<div className="flex items-center space-x-1 text-[#609966]">
								<span>🌤️</span>
								<span>{photo.weather}</span>
							</div>
						)}
					</div>

					{/* Tags */}
					{photo.tags && photo.tags.length > 0 && (
						<div className="mt-3 flex flex-wrap gap-2">
							{photo.tags.map((tag, index) => (
								<span
									key={index}
									className="px-3 py-1 bg-gradient-to-r from-[#EDF1D6] to-[#9DC08B]/30 text-[#40513B] text-xs rounded-full font-medium border border-[#9DC08B]/30"
								>
									{tag}
								</span>
							))}
						</div>
					)}
				</div>
			)}

			{/* Action Bar */}
			<div className="flex items-center justify-between p-4 bg-[#EDF1D6]/50 border-t-2 border-[#9DC08B]/20">
				{/* Author */}
				<div className="flex items-center space-x-2">
					<div className="w-8 h-8 bg-gradient-to-r from-[#9DC08B] to-[#609966] rounded-full flex items-center justify-center text-xs font-bold text-white">
						{photo.authorPhoto ? (
							<img
								src={photo.authorPhoto}
								alt={photo.author}
								className="w-8 h-8 rounded-full"
							/>
						) : (
							photo.author?.charAt(0).toUpperCase() || "?"
						)}
					</div>
					<p className="text-sm font-medium text-[#40513B]">{photo.author}</p>
				</div>

				{/* Actions */}
				<div className="flex items-center space-x-2">
					<button className="px-3 py-1 bg-white hover:bg-gradient-to-r hover:from-[#609966] hover:to-[#40513B] text-[#609966] hover:text-white rounded-lg text-sm font-medium transition-all flex items-center space-x-1">
						<span>❤️</span>
						<span>{photo.likes || 0}</span>
					</button>
					<button className="px-3 py-1 bg-white hover:bg-gradient-to-r hover:from-[#609966] hover:to-[#40513B] text-[#609966] hover:text-white rounded-lg text-sm font-medium transition-all flex items-center space-x-1">
						<span>📤</span>
						<span>Share</span>
					</button>
				</div>
			</div>
		</div>
	);
};

export default PhotoWithAudio;
