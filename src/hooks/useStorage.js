// useStorage Hook - File upload, download, and management operations
import { useState, useCallback } from "react";
import {
	uploadImage,
	uploadAudio,
	deleteFile,
	getFileURL,
	listUserFiles,
} from "../api/storageApi";
import { compressImage } from "../utils/imageCompressor";
import { compressAudio } from "../utils/audioCompressor";

export const useStorage = () => {
	const [uploading, setUploading] = useState(false);
	const [progress, setProgress] = useState(0);
	const [error, setError] = useState(null);
	const [downloadURL, setDownloadURL] = useState(null);

	// Upload image with compression
	const uploadImageFile = useCallback(async (file, userId, options = {}) => {
		setUploading(true);
		setError(null);
		setProgress(0);

		try {
			// Compress image before upload
			const compressedFile = await compressImage(file, {
				maxWidth: options.maxWidth || 1920,
				maxHeight: options.maxHeight || 1080,
				quality: options.quality || 0.8,
			});

			const url = await uploadImage(compressedFile, userId, (progressPercent) =>
				setProgress(progressPercent)
			);

			setDownloadURL(url);
			return url;
		} catch (err) {
			console.error("Error uploading image:", err);
			setError(err.message);
			throw err;
		} finally {
			setUploading(false);
			setProgress(0);
		}
	}, []);

	// Upload audio with compression
	const uploadAudioFile = useCallback(async (file, userId, options = {}) => {
		setUploading(true);
		setError(null);
		setProgress(0);

		try {
			// Compress audio before upload
			const compressedBlob = await compressAudio(file, {
				bitrate: options.bitrate || 128,
				format: options.format || "mp3",
			});

			const url = await uploadAudio(compressedBlob, userId, (progressPercent) =>
				setProgress(progressPercent)
			);

			setDownloadURL(url);
			return url;
		} catch (err) {
			console.error("Error uploading audio:", err);
			setError(err.message);
			throw err;
		} finally {
			setUploading(false);
			setProgress(0);
		}
	}, []);

	// Upload file without compression (for other file types)
	const uploadFile = useCallback(async (file, userId, fileType = "image") => {
		setUploading(true);
		setError(null);
		setProgress(0);

		try {
			let url;
			if (fileType === "image") {
				url = await uploadImage(file, userId, (progressPercent) =>
					setProgress(progressPercent)
				);
			} else if (fileType === "audio") {
				url = await uploadAudio(file, userId, (progressPercent) =>
					setProgress(progressPercent)
				);
			} else {
				throw new Error("Unsupported file type");
			}

			setDownloadURL(url);
			return url;
		} catch (err) {
			console.error("Error uploading file:", err);
			setError(err.message);
			throw err;
		} finally {
			setUploading(false);
			setProgress(0);
		}
	}, []);

	// Delete file from storage
	const deleteStorageFile = useCallback(async (filePath) => {
		setError(null);

		try {
			await deleteFile(filePath);
			return true;
		} catch (err) {
			console.error("Error deleting file:", err);
			setError(err.message);
			throw err;
		}
	}, []);

	// Get public URL for file
	const getFileDownloadURL = useCallback(async (filePath) => {
		setError(null);

		try {
			const url = await getFileURL(filePath);
			setDownloadURL(url);
			return url;
		} catch (err) {
			console.error("Error getting file URL:", err);
			setError(err.message);
			throw err;
		}
	}, []);

	// List all files for a user
	const listFiles = useCallback(async (userId, fileType = "image") => {
		setError(null);

		try {
			const files = await listUserFiles(userId, fileType);
			return files;
		} catch (err) {
			console.error("Error listing files:", err);
			setError(err.message);
			throw err;
		}
	}, []);

	// Reset state
	const reset = useCallback(() => {
		setUploading(false);
		setProgress(0);
		setError(null);
		setDownloadURL(null);
	}, []);

	return {
		uploading,
		progress,
		error,
		downloadURL,
		uploadImageFile,
		uploadAudioFile,
		uploadFile,
		deleteStorageFile,
		getFileDownloadURL,
		listFiles,
		reset,
	};
};

export default useStorage;
