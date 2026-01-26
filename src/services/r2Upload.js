/**
 * Upload service using Cloudflare Worker
 * No credentials needed in frontend - everything is secure!
 *
 * Features:
 * - Automatic retry with exponential backoff
 * - Request timeout handling
 * - Image compression before upload
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
	baseDelay: 500, // Base delay for exponential backoff
};

/**
 * Calculate exponential backoff delay
 * @param {number} attempt - Current attempt number (1-based)
 * @param {number} baseDelay - Base delay in ms
 * @returns {number} - Delay in ms
 */
const getBackoffDelay = (attempt, baseDelay = 500) => {
	// Exponential backoff with jitter: baseDelay * 2^attempt + random(0-500)
	const exponentialDelay = baseDelay * Math.pow(2, attempt - 1);
	const jitter = Math.random() * 500;
	return Math.min(exponentialDelay + jitter, 10000); // Cap at 10 seconds
};

/**
 * Uploads a file to R2 via Cloudflare Worker.
 * @param {File} file - The file to upload.
 * @param {string} userId - The user's ID.
 * @param {string} fileType - 'photo' or 'audio'.
 * @param {Object} options - Upload options
 * @returns {Promise<string>} The public URL of the uploaded file.
 */
export const uploadToR2 = async (
	file,
	userId,
	fileType = "photo",
	options = DEFAULT_UPLOAD_OPTIONS,
) => {
	if (!file) throw new Error("No file provided for upload");
	if (!userId) throw new Error("User ID is required for upload");

	const { retries, timeoutMs, baseDelay } = {
		...DEFAULT_UPLOAD_OPTIONS,
		...(options || {}),
	};

	let lastError = null;

	for (let attempt = 1; attempt <= retries; attempt++) {
		// Create a new AbortController for each attempt
		const controller = new AbortController();
		const signal = controller.signal;

		const timer = setTimeout(() => {
			controller.abort();
		}, timeoutMs);

		try {
			console.log(
				`Uploading ${fileType} to R2 (attempt ${attempt}/${retries}):`,
				file.name,
				`(${Math.round(file.size / 1024)} KB)`,
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

			// Handle rate limiting
			if (response.status === 429) {
				const retryAfter = parseInt(
					response.headers.get("Retry-After") || "60",
					10,
				);
				throw new Error(`Rate limited. Please wait ${retryAfter} seconds.`);
			}

			if (!response.ok) {
				// Try to read response text for better diagnostics
				let errorMessage;
				try {
					const errorData = await response.json();
					errorMessage =
						errorData.error || errorData.message || response.statusText;
				} catch {
					errorMessage = response.statusText;
				}
				throw new Error(`Upload failed: ${response.status} - ${errorMessage}`);
			}

			const data = await response.json();
			console.log(`${fileType} uploaded successfully:`, data.url);
			return data.url;
		} catch (err) {
			clearTimeout(timer);
			lastError = err;

			// Don't retry on abort (timeout) on last attempt
			const isAborted = err.name === "AbortError";
			const errorMessage = isAborted ? "Request timed out" : err.message;

			console.error(
				`Error uploading ${fileType} (attempt ${attempt}/${retries}):`,
				errorMessage,
			);

			// If this was the last attempt, don't wait
			if (attempt >= retries) {
				break;
			}

			// Calculate backoff delay
			const delay = getBackoffDelay(attempt, baseDelay);
			console.log(
				`Retrying upload of ${fileType} in ${Math.round(delay)}ms...`,
			);
			await new Promise((res) => setTimeout(res, delay));
		}
	}

	// All retries exhausted
	throw new Error(
		`Failed to upload ${fileType} after ${retries} attempts: ${lastError?.message || "Unknown error"}`,
	);
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
	opts = {},
) => {
	try {
		console.log("Starting media upload to R2...");

		// Compress image first (helps reduce upload time and chance of failure)
		let compressedPhoto = photoFile;
		try {
			compressedPhoto = await compressImage(
				photoFile,
				opts.imageOptions || undefined,
			);
			if (compressedPhoto && compressedPhoto.size) {
				console.log(
					`Compressed photo size: ${Math.round(compressedPhoto.size / 1024)} KB`,
				);
			}
		} catch (err) {
			console.warn(
				"Image compression failed — continuing with original file.",
				err,
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
