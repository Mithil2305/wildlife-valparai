/**
 * Upload service using Cloudflare Worker
 * No credentials needed in frontend - everything is secure!
 */

// Get worker URL from environment variables
const WORKER_URL = import.meta.env.VITE_WORKER_URL || "http://localhost:8787";

/**
 * Uploads a file to R2 via Cloudflare Worker.
 * @param {File} file - The file to upload.
 * @param {string} userId - The user's ID.
 * @param {string} fileType - 'photo' or 'audio'.
 * @returns {Promise<string>} The public URL of the uploaded file.
 */
export const uploadToR2 = async (file, userId, fileType = "photo") => {
	try {
		console.log(
			`Uploading ${fileType} to R2:`,
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
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.error || error.message || "Upload failed");
		}

		const data = await response.json();
		console.log(`${fileType} uploaded successfully:`, data.url);

		return data.url;
	} catch (error) {
		console.error(`Error uploading ${fileType}:`, error);
		throw new Error(`Failed to upload ${fileType}: ${error.message}`);
	}
};

/**
 * Uploads both photo and audio files to R2 in parallel.
 * @param {File} photoFile - The photo file.
 * @param {File} audioFile - The audio file.
 * @param {string} userId - The user's ID.
 * @returns {Promise<{photoUrl: string, audioUrl: string}>}
 */
export const uploadMediaToR2 = async (photoFile, audioFile, userId) => {
	try {
		console.log("Starting parallel upload to R2...");

		// Upload both files in parallel for better performance
		const [photoUrl, audioUrl] = await Promise.all([
			uploadToR2(photoFile, userId, "photo"),
			uploadToR2(audioFile, userId, "audio"),
		]);

		console.log("Both files uploaded successfully!");
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
