import {  addDoc, postsCollection, serverTimestamp } from "./firebase.js";
import { compressImage } from "./imageCompressor.js";
import { compressAudio } from "./audioCompressor.js";

// This is the path to your Vercel serverless function as described in the PDF
const GENERATE_UPLOAD_URL_ENDPOINT = "/api/generate-upload-url";

/**
 * Step 1: Get a presigned URL from our Vercel serverless function.
 * @param {string} filename - The name of the file to upload.
 * @returns {Promise<string>} The presigned URL for uploading.
 */
const getPresignedUrl = async (filename) => {
	try {
		const response = await fetch(GENERATE_UPLOAD_URL_ENDPOINT, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ filename }),
		});

		if (!response.ok) {
			throw new Error("Failed to get presigned URL from server.");
		}

		const { presignedUrl } = await response.json();
		return presignedUrl;
	} catch (error) {
		console.error("Error getting presigned URL:", error);
		throw error;
	}
};

/**
 * Step 2: Upload the file data directly to Cloudflare R2 using the presigned URL.
 * @param {string} presignedUrl - The URL from Step 1.
 * @param {File} file - The file to upload.
 * @returns {Promise<void>}
 */
const uploadFileToR2 = async (presignedUrl, file) => {
	try {
		const response = await fetch(presignedUrl, {
			method: "PUT",
			body: file,
			headers: {
				"Content-Type": file.type,
			},
		});

		if (!response.ok) {
			throw new Error("Cloudflare R2 upload failed.");
		}
	} catch (error) {
		console.error("Error uploading file to R2:", error);
		throw error;
	}
};

/**
 * Creates a "photoAudio" post.
 * This implements the full workflow from section 5 of the PDF.
 * @param {string} creatorId - The user's UID.
 * @param {string} creatorUsername - The user's username (denormalized).
 * @param {File} photoFile - The raw photo file.
 * @param {File} audioFile - The raw audio file.
 * @param {string} title - The title for the post.
 * @returns {Promise<object>} The new post document reference.
 */
export const createPhotoAudioPost = async (
	creatorId,
	creatorUsername,
	photoFile,
	audioFile,
	title
) => {
	try {
		// A. Compress files (using stubs for now)
		const compressedPhoto = await compressImage(photoFile);
		const compressedAudio = await compressAudio(audioFile);

		// B. Get presigned URLs for both files
		// Note: Use unique filenames, e.g., by prepending userId and timestamp
		const photoFilename = `${creatorId}-${Date.now()}-${compressedPhoto.name}`;
		const audioFilename = `${creatorId}-${Date.now()}-${compressedAudio.name}`;

		const photoPresignedUrl = await getPresignedUrl(photoFilename);
		const audioPresignedUrl = await getPresignedUrl(audioFilename);

		// C. Upload files to R2 in parallel
		await Promise.all([
			uploadFileToR2(photoPresignedUrl, compressedPhoto),
			uploadFileToR2(audioPresignedUrl, compressedAudio),
		]);

		// D. Get the final public URLs
		// This assumes your presigned URL generation logic returns the final public URL
		// or that you can construct it.
		// For this example, we'll assume the presigned URL's origin + path is the public URL.
		// A better way: your API should return { presignedUrl, publicUrl }
		const photoUrl =
			new URL(photoPresignedUrl).origin + new URL(photoPresignedUrl).pathname;
		const audioUrl =
			new URL(audioPresignedUrl).origin + new URL(audioPresignedUrl).pathname;

		// E. Create the Firestore document in /posts
		const newPostData = {
			creatorId: creatorId,
			creatorUsername: creatorUsername,
			createdAt: serverTimestamp(),
			type: "photoAudio",
			photoUrl: photoUrl,
			audioUrl: audioUrl,
			title: title || "",
			blogContent: "",
			likeCount: 0,
			commentCount: 0,
		};

		const docRef = await addDoc(postsCollection, newPostData);
		return docRef;
	} catch (error) {
		console.error("Error creating photo/audio post:", error);
		throw error;
	}
};

/**
 * Creates a "blog" post.
 * @param {string} creatorId - The user's UID.
 * @param {string} creatorUsername - The user's username (denormalized).
 * @param {string} title - The title for the blog post.
 * @param {string} blogContent - The text content for the blog.
 * @returns {Promise<object>} The new post document reference.
 */
export const createBlogPost = async (
	creatorId,
	creatorUsername,
	title,
	blogContent
) => {
	try {
		const newPostData = {
			creatorId: creatorId,
			creatorUsername: creatorUsername,
			createdAt: serverTimestamp(),
			type: "blog",
			photoUrl: "",
			audioUrl: "",
			title: title,
			blogContent: blogContent,
			likeCount: 0,
			commentCount: 0,
		};

		const docRef = await addDoc(postsCollection, newPostData);
		return docRef;
	} catch (error) {
		console.error("Error creating blog post:", error);
		throw error;
	}
};
