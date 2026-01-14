/**
 * Upload service using Cloudflare Worker
 * No credentials needed in frontend - everything is secure!
 */

// Get worker URL from environment variables
const WORKER_URL = import.meta.env.VITE_WORKER_URL || "http://localhost:8787";

import { compressImage } from "./imageCompressor.js";

/**
 * Default upload options — balanced for reliability and speed
 */
const DEFAULT_UPLOAD_OPTIONS = {
	retries: 3,
	timeoutMs: 60_000, // 60 seconds per attempt (enough for slow connections)
};

/**
 * Uploads a file to R2 via Cloudflare Worker.
 * @param {File} file - The file to upload.
 * @param {string} userId - The user's ID.
 * @param {string} fileType - 'photo' or 'audio'.
 * @returns {Promise<string>} The public URL of the uploaded file.
 */
export const uploadToR2 = async (
	file,
	userId,
	fileType = "photo",
	options = DEFAULT_UPLOAD_OPTIONS
) => {
	if (!file) throw new Error("No file provided for upload");

	const { retries, timeoutMs } = {
		...DEFAULT_UPLOAD_OPTIONS,
		...(options || {}),
	};

	let attempt = 0;

	while (attempt < retries) {
		attempt += 1;

		// Create a new AbortController for each attempt
		const controller = new AbortController();
		const signal = controller.signal;

		const timer = setTimeout(() => {
			controller.abort();
		}, timeoutMs);

		try {
			console.log(
				`Uploading ${fileType} to R2 (attempt ${attempt}):`,
				file.name,
				`(${file.size} bytes)`
			);

			const formData = new FormData();
			formData.append("file", file);
			formData.append("userId", userId);
			formData.append("fileType", fileType);

			const response = await fetch(`${WORKER_URL}/upload`, {
				method: "POST",
				body: formData,
				signal,
			});

			clearTimeout(timer);

			if (!response.ok) {
				// Try to read response text for better diagnostics
				let text;
				try {
					text = await response.text();
				} catch (e) {
					text = `<unable to read response body: ${e.message}>`;
				}
				throw new Error(
					`Upload failed: ${response.status} ${response.statusText} - ${text}`
				);
			}

			const data = await response.json();
			console.log(`${fileType} uploaded successfully:`, data.url);
			return data.url;
		} catch (err) {
			clearTimeout(timer);
			console.error(`Error uploading ${fileType} (attempt ${attempt}):`, err);

			// If this was the last attempt, rethrow
			if (attempt >= retries) {
				throw new Error(`Failed to upload ${fileType}: ${err.message}`);
			}

			// Wait a short fixed delay before retrying (no backoff for speed)
			const delay = 300;
			console.log(`Retrying upload of ${fileType} in ${delay}ms...`);
			await new Promise((res) => setTimeout(res, delay));
		}
	}
};

/**
 * Uploads both photo and audio files to R2 in parallel.
 * @param {File} photoFile - The photo file.
 * @param {File} audioFile - The audio file.
 * @param {string} userId - The user's ID.
 * @returns {Promise<{photoUrl: string, audioUrl: string}>}
 */
export const uploadMediaToR2 = async (
	photoFile,
	audioFile,
	userId,
	opts = {}
) => {
	try {
		console.log("Starting media upload to R2...");

		// Compress image first (helps reduce upload time and chance of failure)
		let compressedPhoto = photoFile;
		try {
			compressedPhoto = await compressImage(
				photoFile,
				opts.imageOptions || undefined
			);
			if (compressedPhoto && compressedPhoto.size) {
				console.log(
					`Compressed photo size: ${Math.round(compressedPhoto.size / 1024)} KB`
				);
			}
		} catch (err) {
			console.warn(
				"Image compression failed — continuing with original file.",
				err
			);
			compressedPhoto = photoFile;
		}

		// Upload both in parallel for fastest total time
		const [photoUrl, audioUrl] = await Promise.all([
			uploadToR2(compressedPhoto, userId, "photo", opts.uploadOptions),
			uploadToR2(audioFile, userId, "audio", opts.uploadOptions),
		]);

		console.log("Files uploaded successfully:", { photoUrl, audioUrl });
		return { photoUrl, audioUrl };
	} catch (error) {
		console.error("Error uploading media to R2:", error);
		throw error;
	}
};

/**
 * Upload a single file (for profile photos, etc.)
 * @param {File} file - The file to upload.
 * @param {string} userId - The user's ID.
 * @param {string} fileType - Type of file (e.g., 'profile', 'photo', 'audio').
 * @returns {Promise<string>} The public URL.
 */
export const uploadSingleFile = async (file, userId, fileType = "media") => {
	return uploadToR2(file, userId, fileType);
};
