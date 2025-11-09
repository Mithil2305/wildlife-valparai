// audioService.js - Audio management and processing operations
import { uploadAudio, deleteAudio } from "../api/storageApi";
import { trackEvent } from "./analyticsService";
import { validateAudioFile } from "../utils/validators";
import { getAudioMetadata } from "../utils/audioCompressor";

// Upload audio with validation
export const uploadAudioFile = async (audioFile, userId, metadata = {}) => {
	try {
		// Validate audio file
		const validation = validateAudioFile(audioFile);
		if (!validation.valid) {
			throw new Error(validation.error);
		}

		// Get audio metadata
		const audioMetadata = await getAudioMetadata(audioFile);

		if (audioMetadata.duration > 60) {
			throw new Error("Audio duration cannot exceed 60 seconds");
		}

		// Upload audio
		const url = await uploadAudio(audioFile, userId);

		// Track upload
		trackEvent("audio_uploaded", {
			userId,
			duration: audioMetadata.duration,
			size: audioFile.size,
			format: audioFile.type,
		});

		return {
			url,
			duration: audioMetadata.duration,
			size: audioFile.size,
			format: audioFile.type,
			...metadata,
		};
	} catch (error) {
		console.error("Error uploading audio:", error);
		trackEvent("audio_upload_error", {
			userId,
			error: error.message,
		});
		throw error;
	}
};

// Delete audio file
export const deleteAudioFile = async (audioUrl, userId) => {
	try {
		await deleteAudio(audioUrl);

		trackEvent("audio_deleted", {
			userId,
			audioUrl,
		});

		return { success: true };
	} catch (error) {
		console.error("Error deleting audio:", error);
		throw error;
	}
};

// Process multiple audio files
export const uploadMultipleAudioFiles = async (audioFiles, userId) => {
	try {
		const uploadPromises = audioFiles.map((file) =>
			uploadAudioFile(file, userId)
		);

		const results = await Promise.all(uploadPromises);

		return results;
	} catch (error) {
		console.error("Error uploading multiple audio files:", error);
		throw error;
	}
};

// Validate audio duration (client-side check before upload)
export const checkAudioDuration = async (audioFile) => {
	try {
		const metadata = await getAudioMetadata(audioFile);

		return {
			valid: metadata.duration <= 60,
			duration: metadata.duration,
			message:
				metadata.duration <= 60
					? "Audio duration is valid"
					: `Audio is ${Math.ceil(metadata.duration)}s. Maximum allowed is 60s`,
		};
	} catch (error) {
		console.error("Error checking audio duration:", error);
		return {
			valid: false,
			duration: 0,
			message: "Failed to read audio file",
		};
	}
};

// Get audio file info without uploading
export const getAudioInfo = async (audioFile) => {
	try {
		const metadata = await getAudioMetadata(audioFile);

		return {
			name: audioFile.name,
			size: audioFile.size,
			type: audioFile.type,
			duration: metadata.duration,
			sizeInMB: (audioFile.size / (1024 * 1024)).toFixed(2),
			durationFormatted: formatDuration(metadata.duration),
		};
	} catch (error) {
		console.error("Error getting audio info:", error);
		throw error;
	}
};

// Format duration in MM:SS format
const formatDuration = (seconds) => {
	const mins = Math.floor(seconds / 60);
	const secs = Math.floor(seconds % 60);
	return `${mins}:${secs.toString().padStart(2, "0")}`;
};

// Validate audio format
export const isValidAudioFormat = (file) => {
	const validFormats = [
		"audio/mpeg",
		"audio/mp3",
		"audio/wav",
		"audio/ogg",
		"audio/webm",
		"audio/mp4",
		"audio/m4a",
	];

	return validFormats.includes(file.type);
};

// Get audio quality recommendation
export const getAudioQualityRecommendation = (file) => {
	const sizeInMB = file.size / (1024 * 1024);

	if (sizeInMB > 5) {
		return {
			quality: "low",
			message: "File size is large. Consider compressing for faster upload.",
			shouldCompress: true,
		};
	} else if (sizeInMB > 2) {
		return {
			quality: "medium",
			message: "File size is acceptable.",
			shouldCompress: false,
		};
	} else {
		return {
			quality: "high",
			message: "File size is optimal.",
			shouldCompress: false,
		};
	}
};

export default {
	uploadAudioFile,
	deleteAudioFile,
	uploadMultipleAudioFiles,
	checkAudioDuration,
	getAudioInfo,
	isValidAudioFormat,
	getAudioQualityRecommendation,
};
