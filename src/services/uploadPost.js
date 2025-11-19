import {
	addDoc,
	postsCollection,
	serverTimestamp,
	query,
	where,
	getDocs,
	getDoc,
	doc,
	updateDoc,
	deleteDoc,
	orderBy,
	runTransaction,
	increment,
	commentsCollection,
	postDoc,
	db,
	limit,
} from "./firebase.js";
import { compressImage } from "./imageCompressor.js";
import { compressAudio } from "./audioCompressor.js";

// This is the path to your Vercel serverless function as described in the PDF
const GENERATE_UPLOAD_URL_ENDPOINT = "/api/generate-upload-url";

/**
 * Step 1: Get a presigned URL from our Vercel serverless function.
 * @param {string} filename - The name of the file to upload.
 * @returns {Promise<string>} The presigned URL for uploading.
 */
export const getPresignedUrl = async (filename) => {
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
export const uploadFileToR2 = async (presignedUrl, file) => {
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
			photoUrl: "", // Blogs don't have media
			audioUrl: "", // Blogs don't have media
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

/**
 * Fetches all posts for a specific creator.
 * @param {string} userId - The creator's UID.
 * @returns {Promise<Array<object>>} A promise that resolves to an array of post objects.
 */
export const getCreatorPosts = async (userId) => {
	if (!userId) return [];
	try {
		// --- MODIFICATION START ---
		// 1. Remove the orderBy from the query.
		// We only filter by creatorId now.
		const q = query(postsCollection, where("creatorId", "==", userId));
		// --- MODIFICATION END ---

		const snapshot = await getDocs(q);
		const posts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

		// --- MODIFICATION START ---
		// 2. Sort the results in JavaScript *after* fetching.
		// We use toMillis() to compare the Firestore Timestamps.
		posts.sort((a, b) => {
			const timeA = a.createdAt?.toMillis() || 0;
			const timeB = b.createdAt?.toMillis() || 0;
			return timeB - timeA; // (b - a) for descending order (newest first)
		});
		// --- MODIFICATION END ---

		return posts;
	} catch (error) {
		console.error("Error fetching creator posts:", error);
		throw error;
	}
};

/**
 * Fetches a single post by its ID.
 * @param {string} postId - The ID of the post to fetch.
 * @returns {Promise<object|null>} A promise that resolves to the post object or null.
 */
export const getPost = async (postId) => {
	try {
		const postRef = postDoc(postId); // Use postDoc from firebase.js
		const postSnap = await getDoc(postRef);
		if (postSnap.exists()) {
			return { id: postSnap.id, ...postSnap.data() };
		} else {
			console.warn("No such post found!");
			return null;
		}
	} catch (error) {
		console.error("Error fetching post:", error);
		throw error;
	}
};

/**
 * Updates an existing blog post.
 * @param {string} postId - The ID of the post to update.
 * @param {object} data - An object with the fields to update (e.g., { title, blogContent }).
 * @returns {Promise<void>}
 */
export const updateBlogPost = async (postId, data) => {
	try {
		const postRef = postDoc(postId); // Use postDoc from firebase.js
		await updateDoc(postRef, {
			...data,
			updatedAt: serverTimestamp(), // Add an 'updatedAt' timestamp
		});
	} catch (error) {
		console.error("Error updating blog post:", error);
		throw error;
	}
};

/**
 * Deletes a blog post.
 * WARNING: This does not delete subcollections (likes, comments).
 * A production app should use a Cloud Function for this.
 * @param {string} postId - The ID of the post to delete.
 * @returns {Promise<void>}
 */
export const deleteBlogPost = async (postId) => {
	try {
		const postRef = postDoc(postId); // Use postDoc from firebase.js
		// WARNING: This does not delete subcollections.
		await deleteDoc(postRef);
	} catch (error) {
		console.error("Error deleting blog post:", error);
		throw error;
	}
};

// --- FUNCTIONS FOR COMMENTS ---

/**
 * Fetches all comments for a specific post.
 * @param {string} postId - The ID of the post.
 * @returns {Promise<Array<object>>} A promise resolving to an array of comment objects.
 */
export const getPostComments = async (postId) => {
	try {
		const q = query(commentsCollection(postId), orderBy("timestamp", "asc"));
		const snapshot = await getDocs(q);
		return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
	} catch (error) {
		console.error("Error fetching comments:", error);
		throw error;
	}
};

/**
 * Adds a new comment to a post and increments the post's commentCount.
 * @param {string} postId - The ID of the post to comment on.
 * @param {string} userId - The UID of the user commenting.
 * @param {string} username - The username of the user.
 * @param {string} text - The comment content.
 * @returns {Promise<void>}
 */
export const addPostComment = async (postId, userId, username, text) => {
	const postRef = postDoc(postId);
	const newCommentRef = doc(commentsCollection(postId)); // Create a ref for the new comment

	try {
		await runTransaction(db, async (transaction) => {
			// 1. Create the new comment document
			const newCommentData = {
				userId: userId,
				username: username,
				text: text,
				timestamp: serverTimestamp(),
			};
			transaction.set(newCommentRef, newCommentData);

			// 2. Atomically increment the commentCount on the parent post
			transaction.update(postRef, {
				commentCount: increment(1),
			});
		});
	} catch (error) {
		console.error("Error adding comment:", error);
		throw error;
	}
};

/**
 * Deletes a comment and decrements the post's commentCount.
 * @param {string} postId - The ID of the post.
 * @param {string} commentId - The ID of the comment to delete.
 * @returns {Promise<void>}
 */
export const deletePostComment = async (postId, commentId) => {
	const postRef = postDoc(postId);
	const commentRef = doc(db, "posts", postId, "comments", commentId); // Correct path

	try {
		await runTransaction(db, async (transaction) => {
			// 1. Delete the comment document
			transaction.delete(commentRef);

			// 2. Atomically decrement the commentCount
			transaction.update(postRef, {
				commentCount: increment(-1),
			});
		});
	} catch (error) {
		console.error("Error deleting comment:", error);
		throw error;
	}
};

// --- FUNCTION FOR "LATEST POSTS" ---
/**
 * Fetches the most recent posts to show as "Related Posts".
 * @param {number} count - The number of posts to fetch.
 * @returns {Promise<Array<object>>} A promise resolving to an array of post objects.
 */
export const getLatestPosts = async (count = 3) => {
	try {
		const q = query(
			postsCollection,
			orderBy("createdAt", "desc"),
			limit(count)
		);
		const snapshot = await getDocs(q);
		return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
	} catch (error) {
		console.error("Error fetching latest posts:", error);
		throw error;
	}
};
