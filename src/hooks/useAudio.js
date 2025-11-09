// useAudio Hook - Audio playback and controls
import { useState, useEffect, useRef, useCallback } from "react";

export const useAudio = (audioUrl) => {
	const audioRef = useRef(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [duration, setDuration] = useState(0);
	const [currentTime, setCurrentTime] = useState(0);
	const [volume, setVolume] = useState(1);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	// Initialize audio element
	useEffect(() => {
		if (audioUrl) {
			audioRef.current = new Audio(audioUrl);
			setLoading(true);

			// Event listeners
			const audio = audioRef.current;

			const handleLoadedMetadata = () => {
				setDuration(audio.duration);
				setLoading(false);
			};

			const handleTimeUpdate = () => {
				setCurrentTime(audio.currentTime);
			};

			const handleEnded = () => {
				setIsPlaying(false);
				setCurrentTime(0);
			};

			const handleError = (e) => {
				console.error("Audio loading error:", e);
				setError("Failed to load audio");
				setLoading(false);
			};

			audio.addEventListener("loadedmetadata", handleLoadedMetadata);
			audio.addEventListener("timeupdate", handleTimeUpdate);
			audio.addEventListener("ended", handleEnded);
			audio.addEventListener("error", handleError);

			// Cleanup
			return () => {
				audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
				audio.removeEventListener("timeupdate", handleTimeUpdate);
				audio.removeEventListener("ended", handleEnded);
				audio.removeEventListener("error", handleError);
				audio.pause();
				audio.src = "";
			};
		}
	}, [audioUrl]);

	// Play audio
	const play = useCallback(async () => {
		if (audioRef.current) {
			try {
				await audioRef.current.play();
				setIsPlaying(true);
				setError(null);
			} catch (err) {
				console.error("Error playing audio:", err);
				setError("Failed to play audio");
			}
		}
	}, []);

	// Pause audio
	const pause = useCallback(() => {
		if (audioRef.current) {
			audioRef.current.pause();
			setIsPlaying(false);
		}
	}, []);

	// Toggle play/pause
	const togglePlay = useCallback(() => {
		if (isPlaying) {
			pause();
		} else {
			play();
		}
	}, [isPlaying, play, pause]);

	// Seek to specific time
	const seek = useCallback((time) => {
		if (audioRef.current) {
			audioRef.current.currentTime = time;
			setCurrentTime(time);
		}
	}, []);

	// Skip forward by seconds
	const skipForward = useCallback(
		(seconds = 10) => {
			if (audioRef.current) {
				const newTime = Math.min(
					audioRef.current.currentTime + seconds,
					duration
				);
				seek(newTime);
			}
		},
		[duration, seek]
	);

	// Skip backward by seconds
	const skipBackward = useCallback(
		(seconds = 10) => {
			if (audioRef.current) {
				const newTime = Math.max(audioRef.current.currentTime - seconds, 0);
				seek(newTime);
			}
		},
		[seek]
	);

	// Change volume (0.0 to 1.0)
	const changeVolume = useCallback((newVolume) => {
		if (audioRef.current) {
			const clampedVolume = Math.max(0, Math.min(1, newVolume));
			audioRef.current.volume = clampedVolume;
			setVolume(clampedVolume);
		}
	}, []);

	// Mute/unmute
	const toggleMute = useCallback(() => {
		if (audioRef.current) {
			if (audioRef.current.volume > 0) {
				audioRef.current.volume = 0;
				setVolume(0);
			} else {
				audioRef.current.volume = 1;
				setVolume(1);
			}
		}
	}, []);

	// Reset audio to beginning
	const reset = useCallback(() => {
		if (audioRef.current) {
			audioRef.current.currentTime = 0;
			setCurrentTime(0);
			setIsPlaying(false);
			audioRef.current.pause();
		}
	}, []);

	// Change audio source
	const changeSource = useCallback((newUrl) => {
		if (audioRef.current) {
			audioRef.current.pause();
			audioRef.current.src = newUrl;
			audioRef.current.load();
			setIsPlaying(false);
			setCurrentTime(0);
			setError(null);
			setLoading(true);
		}
	}, []);

	// Format time as MM:SS
	const formatTime = useCallback((time) => {
		if (!isFinite(time)) return "0:00";
		const minutes = Math.floor(time / 60);
		const seconds = Math.floor(time % 60);
		return `${minutes}:${seconds.toString().padStart(2, "0")}`;
	}, []);

	// Calculate progress percentage
	const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

	return {
		isPlaying,
		duration,
		currentTime,
		volume,
		loading,
		error,
		progress,
		play,
		pause,
		togglePlay,
		seek,
		skipForward,
		skipBackward,
		changeVolume,
		toggleMute,
		reset,
		changeSource,
		formatTime,
		isMuted: volume === 0,
		formattedCurrentTime: formatTime(currentTime),
		formattedDuration: formatTime(duration),
	};
};

export default useAudio;
