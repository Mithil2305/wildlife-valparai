import {
	postsCollection,
	postDoc,
	likeDoc,
	likesCollection,
	getDocs,
	getDoc,
	query,
	orderBy,
	runTransaction,
	increment,
	serverTimestamp,
	deleteDoc,
	db,
	setDoc,
} from "./firebase.js";

/**
 * Fetches all posts (both photoAudio and blog types).
 * @returns {Promise<Array<object>>} Array of all posts.
 */
export const getAllPosts = async () => {
	try {
		const snapshot = await getDocs(postsCollection);
		const posts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

		// Sort by creation date (newest first)
		posts.sort((a, b) => {
			const timeA = a.createdAt?.toMillis() || 0;
			const timeB = b.createdAt?.toMillis() || 0;
			return timeB - timeA;
		});

		return posts;
	} catch (error) {
		console.error("Error fetching all posts:", error);
		throw error;
	}
};

/**
 * Toggles a like on a post.
 * @param {string} postId - The ID of the post.
 * @param {string} userId - The ID of the user.
 * @param {string} username - The username of the user.
 * @returns {Promise<boolean>} True if liked, false if unliked.
 */
export const toggleLike = async (postId, userId, username) => {
	const postRef = postDoc(postId);
	const likeRef = likeDoc(postId, userId);

	try {
		let isLiked = false;

		await runTransaction(db, async (transaction) => {
			const likeSnap = await transaction.get(likeRef);

			if (likeSnap.exists()) {
				// Unlike: remove the like document and decrement count
				transaction.delete(likeRef);
				transaction.update(postRef, {
					likeCount: increment(-1),
				});
				isLiked = false;
			} else {
				// Like: create the like document and increment count
				transaction.set(likeRef, {
					userId: userId,
					username: username,
					timestamp: serverTimestamp(),
				});
				transaction.update(postRef, {
					likeCount: increment(1),
				});
				isLiked = true;
			}
		});

		return isLiked;
	} catch (error) {
		console.error("Error toggling like:", error);
		throw error;
	}
};

/**
 * Checks if a user has liked a specific post.
 * @param {string} postId - The ID of the post.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<boolean>} True if liked, false otherwise.
 */
export const getUserLikeStatus = async (postId, userId) => {
	try {
		const likeRef = likeDoc(postId, userId);
		const likeSnap = await getDoc(likeRef);
		return likeSnap.exists();
	} catch (error) {
		console.error("Error checking like status:", error);
		return false;
	}
};

/**
 * Deletes a post (WARNING: doesn't delete subcollections).
 * @param {string} postId - The ID of the post to delete.
 * @returns {Promise<void>}
 */
export const deletePost = async (postId) => {
	try {
		const postRef = postDoc(postId);
		await deleteDoc(postRef);
	} catch (error) {
		console.error("Error deleting post:", error);
		throw error;
	}
};

/**
 * Gets likes for a specific post.
 * @param {string} postId - The ID of the post.
 * @returns {Promise<Array<object>>} Array of like objects.
 */
export const getPostLikes = async (postId) => {
	try {
		const snapshot = await getDocs(likesCollection(postId));
		return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
	} catch (error) {
		console.error("Error fetching likes:", error);
		throw error;
	}
};
