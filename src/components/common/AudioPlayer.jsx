import { useState, useRef, useEffect } from "react";

const AudioPlayer = ({ audioUrl, title, className = "" }) => {
	const [isPlaying, setIsPlaying] = useState(false);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);
	const [volume, setVolume] = useState(1);
	const [showVolumeSlider, setShowVolumeSlider] = useState(false);
	const audioRef = useRef(null);

	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;

		const updateTime = () => setCurrentTime(audio.currentTime);
		const updateDuration = () => setDuration(audio.duration);
		const handleEnded = () => setIsPlaying(false);

		audio.addEventListener("timeupdate", updateTime);
		audio.addEventListener("loadedmetadata", updateDuration);
		audio.addEventListener("ended", handleEnded);

		return () => {
			audio.removeEventListener("timeupdate", updateTime);
			audio.removeEventListener("loadedmetadata", updateDuration);
			audio.removeEventListener("ended", handleEnded);
		};
	}, []);

	const togglePlayPause = () => {
		if (isPlaying) {
			audioRef.current.pause();
		} else {
			audioRef.current.play();
		}
		setIsPlaying(!isPlaying);
	};

	const handleSeek = (e) => {
		const newTime = parseFloat(e.target.value);
		audioRef.current.currentTime = newTime;
		setCurrentTime(newTime);
	};

	const handleVolumeChange = (e) => {
		const newVolume = parseFloat(e.target.value);
		audioRef.current.volume = newVolume;
		setVolume(newVolume);
	};

	const formatTime = (time) => {
		if (isNaN(time)) return "0:00";
		const minutes = Math.floor(time / 60);
		const seconds = Math.floor(time % 60);
		return `${minutes}:${seconds.toString().padStart(2, "0")}`;
	};

	const skipTime = (seconds) => {
		const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
		audioRef.current.currentTime = newTime;
		setCurrentTime(newTime);
	};

	return (
		<div
			className={`bg-gradient-to-r from-[#EDF1D6] to-[#9DC08B]/30 rounded-2xl p-4 shadow-lg border-2 border-[#9DC08B]/30 ${className}`}
		>
			<audio ref={audioRef} src={audioUrl} preload="metadata" />

			{/* Title */}
			{title && (
				<div className="mb-3 flex items-center space-x-2">
					<span className="text-xl">🎵</span>
					<h4 className="text-[#40513B] font-bold text-sm truncate">{title}</h4>
				</div>
			)}

			{/* Progress Bar */}
			<div className="mb-3">
				<input
					type="range"
					min="0"
					max={duration || 0}
					value={currentTime}
					onChange={handleSeek}
					className="w-full h-2 bg-white/50 rounded-lg appearance-none cursor-pointer slider-thumb"
					style={{
						background: `linear-gradient(to right, #609966 0%, #609966 ${(currentTime / duration) * 100}%, #ffffff50 ${(currentTime / duration) * 100}%, #ffffff50 100%)`,
					}}
				/>
				<div className="flex justify-between text-xs text-[#609966] mt-1">
					<span>{formatTime(currentTime)}</span>
					<span>{formatTime(duration)}</span>
				</div>
			</div>

			{/* Controls */}
			<div className="flex items-center justify-between">
				{/* Left Controls */}
				<div className="flex items-center space-x-2">
					{/* Skip Backward */}
					<button
						onClick={() => skipTime(-10)}
						className="w-8 h-8 bg-white/50 hover:bg-white rounded-lg flex items-center justify-center text-[#40513B] transition-all hover:scale-110"
						title="Skip -10s"
					>
						<span className="text-xs">-10</span>
					</button>

					{/* Play/Pause */}
					<button
						onClick={togglePlayPause}
						className="w-12 h-12 bg-gradient-to-r from-[#609966] to-[#40513B] hover:from-[#40513B] hover:to-[#609966] text-white rounded-xl flex items-center justify-center transition-all hover:scale-110 shadow-lg"
					>
						<span className="text-2xl">{isPlaying ? "⏸️" : "▶️"}</span>
					</button>

					{/* Skip Forward */}
					<button
						onClick={() => skipTime(10)}
						className="w-8 h-8 bg-white/50 hover:bg-white rounded-lg flex items-center justify-center text-[#40513B] transition-all hover:scale-110"
						title="Skip +10s"
					>
						<span className="text-xs">+10</span>
					</button>
				</div>

				{/* Volume Control */}
				<div className="relative flex items-center">
					<button
						onClick={() => setShowVolumeSlider(!showVolumeSlider)}
						className="w-8 h-8 bg-white/50 hover:bg-white rounded-lg flex items-center justify-center text-[#40513B] transition-all hover:scale-110"
						title={`Volume: ${Math.round(volume * 100)}%`}
					>
						<span className="text-lg">
							{volume === 0 ? "🔇" : volume < 0.5 ? "🔉" : "🔊"}
						</span>
					</button>

					{showVolumeSlider && (
						<div className="absolute right-0 bottom-full mb-2 bg-white rounded-lg shadow-xl p-3 border-2 border-[#9DC08B]/30">
							<input
								type="range"
								min="0"
								max="1"
								step="0.01"
								value={volume}
								onChange={handleVolumeChange}
								className="w-24 h-2 bg-[#EDF1D6] rounded-lg appearance-none cursor-pointer"
								style={{
									background: `linear-gradient(to right, #609966 0%, #609966 ${volume * 100}%, #EDF1D6 ${volume * 100}%, #EDF1D6 100%)`,
								}}
							/>
							<div className="text-center text-xs text-[#609966] mt-1 font-medium">
								{Math.round(volume * 100)}%
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Waveform Visual (Decorative) */}
			<div className="mt-3 flex items-center justify-center space-x-1 h-8">
				{[...Array(20)].map((_, i) => (
					<div
						key={i}
						className={`w-1 bg-gradient-to-t from-[#609966] to-[#9DC08B] rounded-full transition-all ${
							isPlaying ? "animate-pulse" : ""
						}`}
						style={{
							height: `${Math.random() * 100}%`,
							animationDelay: `${i * 0.1}s`,
						}}
					></div>
				))}
			</div>
		</div>
	);
};

export default AudioPlayer;
