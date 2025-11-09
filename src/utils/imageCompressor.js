// Image Compression Utility for Free Tier Optimization
import Compressor from "compressorjs";
import { STORAGE_LIMITS } from "./constants";

/**
 * Compress an image file to reduce storage usage
 * @param {File} file - The image file to compress
 * @param {Object} options - Compression options
 * @returns {Promise<File>} - Compressed image file
 */
export const compressImage = (file, options = {}) => {
	return new Promise((resolve, reject) => {
		const defaultOptions = {
			quality: options.quality || STORAGE_LIMITS.IMAGE_QUALITY,
			maxWidth: options.maxWidth || 1920,
			maxHeight: options.maxHeight || 1080,
			mimeType: options.mimeType || file.type,
			convertSize: STORAGE_LIMITS.COMPRESSED_IMAGE_SIZE,
			success(result) {
				// Convert Blob to File
				const compressedFile = new File([result], file.name, {
					type: result.type,
					lastModified: Date.now(),
				});
				resolve(compressedFile);
			},
			error(err) {
				reject(err);
			},
		};

		new Compressor(file, defaultOptions);
	});
};

/**
 * Compress image with aggressive settings for thumbnails
 * @param {File} file - The image file
 * @returns {Promise<File>} - Compressed thumbnail
 */
export const compressToThumbnail = (file) => {
	return compressImage(file, {
		quality: 0.6,
		maxWidth: 400,
		maxHeight: 400,
	});
};

/**
 * Compress image for medium-sized display
 * @param {File} file - The image file
 * @returns {Promise<File>} - Compressed medium-sized image
 */
export const compressToMedium = (file) => {
	return compressImage(file, {
		quality: 0.75,
		maxWidth: 1200,
		maxHeight: 900,
	});
};

/**
 * Check if image needs compression
 * @param {File} file - The image file
 * @returns {boolean} - True if compression needed
 */
export const needsCompression = (file) => {
	return file.size > STORAGE_LIMITS.COMPRESSED_IMAGE_SIZE;
};

/**
 * Get image dimensions
 * @param {File} file - The image file
 * @returns {Promise<{width: number, height: number}>}
 */
export const getImageDimensions = (file) => {
	return new Promise((resolve, reject) => {
		const img = new Image();
		const objectUrl = URL.createObjectURL(file);

		img.onload = () => {
			URL.revokeObjectURL(objectUrl);
			resolve({
				width: img.width,
				height: img.height,
			});
		};

		img.onerror = () => {
			URL.revokeObjectURL(objectUrl);
			reject(new Error("Failed to load image"));
		};

		img.src = objectUrl;
	});
};

/**
 * Convert image to WebP format for better compression
 * @param {File} file - The image file
 * @returns {Promise<File>} - WebP image file
 */
export const convertToWebP = (file) => {
	return compressImage(file, {
		mimeType: "image/webp",
		quality: 0.8,
	});
};

/**
 * Resize image to specific dimensions
 * @param {File} file - The image file
 * @param {number} width - Target width
 * @param {number} height - Target height
 * @returns {Promise<File>} - Resized image file
 */
export const resizeImage = (file, width, height) => {
	return compressImage(file, {
		width,
		height,
		resize: "cover",
	});
};

/**
 * Batch compress multiple images
 * @param {File[]} files - Array of image files
 * @returns {Promise<File[]>} - Array of compressed files
 */
export const batchCompressImages = async (files) => {
	const compressionPromises = files.map((file) => compressImage(file));
	return Promise.all(compressionPromises);
};

/**
 * Get file size in MB
 * @param {File} file - The file
 * @returns {number} - File size in MB
 */
export const getFileSizeMB = (file) => {
	return (file.size / (1024 * 1024)).toFixed(2);
};

/**
 * Calculate compression ratio
 * @param {File} originalFile - Original file
 * @param {File} compressedFile - Compressed file
 * @returns {number} - Compression ratio (0-100%)
 */
export const getCompressionRatio = (originalFile, compressedFile) => {
	return ((1 - compressedFile.size / originalFile.size) * 100).toFixed(2);
};

export default {
	compressImage,
	compressToThumbnail,
	compressToMedium,
	needsCompression,
	getImageDimensions,
	convertToWebP,
	resizeImage,
	batchCompressImages,
	getFileSizeMB,
	getCompressionRatio,
};
