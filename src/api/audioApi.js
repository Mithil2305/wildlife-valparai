import { uploadToCloudflareR2, getSignedFileUrl } from "./storageApi";

export const uploadAudio = async (audioFile) => {
	try {
		// Validate audio file
		if (!audioFile.type.startsWith("audio/")) {
			return { success: false, error: "File must be an audio file" };
		}

		// Validate duration (max 1 minute)
		const duration = await getAudioDuration(audioFile);
		if (duration > 60) {
			return { success: false, error: "Audio must be 1 minute or less" };
		}

		// Compress audio if needed
		const compressedAudio = await compressAudio(audioFile);

		// Upload to Cloudflare R2
		const uploadResult = await uploadToCloudflareR2(compressedAudio, "audio");

		if (uploadResult.success) {
			return {
				success: true,
				url: uploadResult.url,
				key: uploadResult.key,
				duration,
			};
		}

		return uploadResult;
	} catch (error) {
		return { success: false, error: error.message };
	}
};

export const getAudioDuration = (audioFile) => {
	return new Promise((resolve) => {
		const audio = new Audio();
		audio.src = URL.createObjectURL(audioFile);

		audio.onloadedmetadata = () => {
			resolve(audio.duration);
			URL.revokeObjectURL(audio.src);
		};

		audio.onerror = () => {
			resolve(0); // Return 0 if duration can't be determined
			URL.revokeObjectURL(audio.src);
		};
	});
};

export const compressAudio = async (audioFile) => {
	// For now, return the original file
	// In a real implementation, you might use ffmpeg.wasm or similar
	return audioFile;
};

export const getSecureAudioUrl = async (audioKey, expiresIn = 3600) => {
	try {
		// Use getSignedFileUrl for private audio files
		const signedUrlResult = await getSignedFileUrl(audioKey, expiresIn);

		if (signedUrlResult.success) {
			return {
				success: true,
				url: signedUrlResult.url,
				expiresIn,
			};
		}

		return signedUrlResult;
	} catch (error) {
		return { success: false, error: error.message };
	}
};

export const playAudio = async (audioKeyOrUrl, useSignedUrl = false) => {
	try {
		let audioUrl = audioKeyOrUrl;

		// If it's a key and we need a signed URL, get one
		if (useSignedUrl && !audioKeyOrUrl.startsWith("http")) {
			const signedUrlResult = await getSecureAudioUrl(audioKeyOrUrl, 3600); // 1 hour expiry
			if (!signedUrlResult.success) {
				throw new Error("Failed to get secure audio URL");
			}
			audioUrl = signedUrlResult.url;
		}

		return new Promise((resolve, reject) => {
			const audio = new Audio(audioUrl);

			audio.onended = () => resolve();
			audio.onerror = () => reject(new Error("Audio playback failed"));

			audio.play().catch(reject);
		});
	} catch (error) {
		return { success: false, error: error.message };
	}
};

export const stopAudio = (audioElement) => {
	if (audioElement) {
		audioElement.pause();
		audioElement.currentTime = 0;
	}
};

export const preloadAudio = async (audioKey) => {
	try {
		// Get signed URL for preloading
		const signedUrlResult = await getSecureAudioUrl(audioKey, 7200); // 2 hour expiry for preload

		if (signedUrlResult.success) {
			// Preload by creating audio element (browser will cache it)
			const audio = new Audio(signedUrlResult.url);
			audio.preload = "auto";

			return { success: true, url: signedUrlResult.url };
		}

		return signedUrlResult;
	} catch (error) {
		return { success: false, error: error.message };
	}
};

export const createAudioWaveform = async (audioFile) => {
	// This would integrate with wavesurfer.js in the component
	// Return mock data for now
	return {
		peaks: Array.from({ length: 100 }, () => Math.random()),
		duration: await getAudioDuration(audioFile),
	};
};

// Batch get signed URLs for multiple audio files
export const getBatchSignedAudioUrls = async (audioKeys, expiresIn = 3600) => {
	try {
		const signedUrls = [];

		for (const key of audioKeys) {
			const signedUrlResult = await getSecureAudioUrl(key, expiresIn);
			if (signedUrlResult.success) {
				signedUrls.push({
					key,
					url: signedUrlResult.url,
					expiresIn: signedUrlResult.expiresIn,
				});
			}
		}

		return { success: true, data: signedUrls };
	} catch (error) {
		return { success: false, error: error.message };
	}
};

// Validate audio URL and get metadata
export const validateAudioUrl = async (audioUrl) => {
	try {
		const response = await fetch(audioUrl, { method: "HEAD" });

		if (response.ok) {
			const contentLength = response.headers.get("content-length");
			const contentType = response.headers.get("content-type");

			return {
				success: true,
				valid: true,
				contentLength: parseInt(contentLength) || 0,
				contentType: contentType || "audio/mpeg",
			};
		}

		return { success: true, valid: false };
	} catch (error) {
		return { success: false, error: error.message };
	}
};
