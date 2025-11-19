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
import { uploadMediaToR2 } from "./r2Upload.js";
import {
	awardSocialPostPoints,
	awardBlogPostPoints,
	awardCommentPoints,
} from "./points.js";

/**
 * Creates a "photoAudio" post using Cloudflare R2.
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
		console.log("Starting photo/audio post creation...");

		// A. Compress files (optional - stubs for now)
		const compressedPhoto = await compressImage(photoFile);
		const compressedAudio = await compressAudio(audioFile);

		console.log("Files compressed, uploading to R2...");

		// B. Upload to Cloudflare R2 and get public URLs
		const { photoUrl, audioUrl } = await uploadMediaToR2(
			compressedPhoto,
			compressedAudio,
			creatorId
		);

		console.log("Files uploaded to R2:", { photoUrl, audioUrl });

		// C. Create the Firestore document in /posts
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
			shareCount: 0,
		};

		const docRef = await addDoc(postsCollection, newPostData);
		console.log("Post created successfully with ID:", docRef.id);

		// Award points for creating social post
		try {
			await awardSocialPostPoints(creatorId, docRef.id);
		} catch (error) {
			console.error("Error awarding points:", error);
		}

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
			shareCount: 0,
		};

		const docRef = await addDoc(postsCollection, newPostData);

		// Award points for creating blog post
		try {
			await awardBlogPostPoints(creatorId, docRef.id);
		} catch (error) {
			console.error("Error awarding points:", error);
		}

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
		const q = query(postsCollection, where("creatorId", "==", userId));
		const snapshot = await getDocs(q);
		const posts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

		posts.sort((a, b) => {
			const timeA = a.createdAt?.toMillis() || 0;
			const timeB = b.createdAt?.toMillis() || 0;
			return timeB - timeA;
		});

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
		const postRef = postDoc(postId);
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
		const postRef = postDoc(postId);
		await updateDoc(postRef, {
			...data,
			updatedAt: serverTimestamp(),
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
		const postRef = postDoc(postId);
		await deleteDoc(postRef);
	} catch (error) {
		console.error("Error deleting blog post:", error);
		throw error;
	}
};

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
 * Awards points to both commenter and post creator.
 * @param {string} postId - The ID of the post to comment on.
 * @param {string} userId - The UID of the user commenting.
 * @param {string} username - The username of the user.
 * @param {string} text - The comment content.
 * @returns {Promise<void>}
 */
export const addPostComment = async (postId, userId, username, text) => {
	const postRef = postDoc(postId);
	const newCommentRef = doc(commentsCollection(postId));

	try {
		// Get post data to find creator
		const postSnap = await getDoc(postRef);
		if (!postSnap.exists()) {
			throw new Error("Post not found");
		}
		const postData = postSnap.data();

		await runTransaction(db, async (transaction) => {
			const newCommentData = {
				userId: userId,
				username: username,
				text: text,
				timestamp: serverTimestamp(),
			};
			transaction.set(newCommentRef, newCommentData);

			transaction.update(postRef, {
				commentCount: increment(1),
			});
		});

		// Award points for commenting (outside transaction)
		try {
			await awardCommentPoints(postData.creatorId, userId, postId);
		} catch (error) {
			console.error("Error awarding comment points:", error);
		}
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
	const commentRef = doc(db, "posts", postId, "comments", commentId);

	try {
		await runTransaction(db, async (transaction) => {
			transaction.delete(commentRef);

			transaction.update(postRef, {
				commentCount: increment(-1),
			});
		});
	} catch (error) {
		console.error("Error deleting comment:", error);
		throw error;
	}
};

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
