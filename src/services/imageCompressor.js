/**
 * Compresses an image file before upload using browser-image-compression.
 * This helps reduce upload time and avoid large request failures.
 * @param {File} file - The original image file.
 * @param {object} options - Optional compression options.
 * @returns {Promise<File>} A promise that resolves with the compressed file.
 */
import imageCompression from "browser-image-compression";

export const compressImage = async (
	file,
	options = {
		maxSizeMB: 0.5,
		maxWidthOrHeight: 1280,
		useWebWorker: true,
		initialQuality: 0.7,
	}
) => {
	if (!file || !(file instanceof File)) return file;

	try {
		// If the file is already small, skip compression
		const sizeMB = file.size / (1024 * 1024);
		if (sizeMB <= (options.maxSizeMB || 0.5)) {
			return file;
		}

		const compressedFile = await imageCompression(file, options);
		// browser-image-compression may return a Blob - convert to File to preserve name/type
		if (compressedFile instanceof Blob && !(compressedFile instanceof File)) {
			const newFile = new File([compressedFile], file.name, {
				type: file.type,
			});
			return newFile;
		}

		return compressedFile;
	} catch (err) {
		console.warn("Image compression failed, returning original file.", err);
		return file;
	}
};
