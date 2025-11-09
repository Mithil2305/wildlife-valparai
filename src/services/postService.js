// postService.js - Blog and sighting post operations
import {
	collection,
	doc,
	getDoc,
	getDocs,
	addDoc,
	updateDoc,
	deleteDoc,
	query,
	where,
	orderBy,
	limit,
	serverTimestamp,
	increment,
} from "firebase/firestore";
import { db } from "../api/firebaseConfig";
import { trackEvent } from "./analyticsService";
import { awardPoints } from "./pointsService";
import { COLLECTIONS, POINTS } from "../utils/constants";
import { checkRateLimit, recordAction } from "../utils/rateLimiter";

// Create new sighting post
export const createSighting = async (sightingData, userId) => {
	try {
		// Check rate limit (5 sightings per day)
		const canPost = checkRateLimit(userId, "sighting", 5);
		if (!canPost) {
			throw new Error(
				"Daily sighting limit reached. Please try again tomorrow."
			);
		}

		const sightingsRef = collection(db, COLLECTIONS.SIGHTINGS);

		const newSighting = {
			...sightingData,
			userId,
			likes: 0,
			comments: 0,
			views: 0,
			status: "published",
			createdAt: serverTimestamp(),
			updatedAt: serverTimestamp(),
		};

		const docRef = await addDoc(sightingsRef, newSighting);

		// Award points for sighting
		await awardPoints(userId, POINTS.SIGHTING, "sighting_created", docRef.id);

		// Record action for rate limiting
		recordAction(userId, "sighting");

		// Track event
		trackEvent("sighting_created", {
			userId,
			sightingId: docRef.id,
			species: sightingData.species,
		});

		return docRef.id;
	} catch (error) {
		console.error("Error creating sighting:", error);
		throw error;
	}
};

// Create new blog post
export const createBlog = async (blogData, userId) => {
	try {
		// Check rate limit (3 blogs per day)
		const canPost = checkRateLimit(userId, "blog", 3);
		if (!canPost) {
			throw new Error("Daily blog limit reached. Please try again tomorrow.");
		}

		const blogsRef = collection(db, COLLECTIONS.BLOGS);

		const newBlog = {
			...blogData,
			authorId: userId,
			likes: 0,
			comments: 0,
			views: 0,
			status: "published",
			createdAt: serverTimestamp(),
			updatedAt: serverTimestamp(),
		};

		const docRef = await addDoc(blogsRef, newBlog);

		// Award points for blog
		await awardPoints(userId, POINTS.BLOG_POST, "blog_created", docRef.id);

		// Record action for rate limiting
		recordAction(userId, "blog");

		// Track event
		trackEvent("blog_created", {
			userId,
			blogId: docRef.id,
			title: blogData.title,
		});

		return docRef.id;
	} catch (error) {
		console.error("Error creating blog:", error);
		throw error;
	}
};

// Get post by ID (works for both sightings and blogs)
export const getPostById = async (postId, postType = "sighting") => {
	try {
		const collectionName =
			postType === "blog" ? COLLECTIONS.BLOGS : COLLECTIONS.SIGHTINGS;
		const docRef = doc(db, collectionName, postId);
		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			// Increment view count
			await updateDoc(docRef, {
				views: increment(1),
			});

			return {
				id: docSnap.id,
				...docSnap.data(),
			};
		} else {
			throw new Error("Post not found");
		}
	} catch (error) {
		console.error("Error getting post:", error);
		throw error;
	}
};

// Get recent posts
export const getRecentPosts = async (
	postType = "sighting",
	limitCount = 20
) => {
	try {
		const collectionName =
			postType === "blog" ? COLLECTIONS.BLOGS : COLLECTIONS.SIGHTINGS;
		const postsRef = collection(db, collectionName);
		const q = query(
			postsRef,
			where("status", "==", "published"),
			orderBy("createdAt", "desc"),
			limit(limitCount)
		);

		const snapshot = await getDocs(q);
		const posts = snapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));

		return posts;
	} catch (error) {
		console.error("Error getting recent posts:", error);
		throw error;
	}
};

// Get posts by user
export const getPostsByUser = async (
	userId,
	postType = "sighting",
	limitCount = 20
) => {
	try {
		const collectionName =
			postType === "blog" ? COLLECTIONS.BLOGS : COLLECTIONS.SIGHTINGS;
		const userField = postType === "blog" ? "authorId" : "userId";

		const postsRef = collection(db, collectionName);
		const q = query(
			postsRef,
			where(userField, "==", userId),
			orderBy("createdAt", "desc"),
			limit(limitCount)
		);

		const snapshot = await getDocs(q);
		const posts = snapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));

		return posts;
	} catch (error) {
		console.error("Error getting user posts:", error);
		throw error;
	}
};

// Update post
export const updatePost = async (postId, updates, postType = "sighting") => {
	try {
		const collectionName =
			postType === "blog" ? COLLECTIONS.BLOGS : COLLECTIONS.SIGHTINGS;
		const docRef = doc(db, collectionName, postId);

		const updateData = {
			...updates,
			updatedAt: serverTimestamp(),
		};

		await updateDoc(docRef, updateData);

		trackEvent("post_updated", { postId, postType });

		return true;
	} catch (error) {
		console.error("Error updating post:", error);
		throw error;
	}
};

// Delete post
export const deletePost = async (postId, postType = "sighting") => {
	try {
		const collectionName =
			postType === "blog" ? COLLECTIONS.BLOGS : COLLECTIONS.SIGHTINGS;
		const docRef = doc(db, collectionName, postId);

		await deleteDoc(docRef);

		trackEvent("post_deleted", { postId, postType });

		return true;
	} catch (error) {
		console.error("Error deleting post:", error);
		throw error;
	}
};

// Like/unlike post
export const toggleLikePost = async (postId, userId, postType = "sighting") => {
	try {
		const collectionName =
			postType === "blog" ? COLLECTIONS.BLOGS : COLLECTIONS.SIGHTINGS;
		const docRef = doc(db, collectionName, postId);
		const likesRef = collection(db, COLLECTIONS.LIKES);

		// Check if user already liked
		const likeQuery = query(
			likesRef,
			where("postId", "==", postId),
			where("userId", "==", userId)
		);
		const likeSnap = await getDocs(likeQuery);

		if (likeSnap.empty) {
			// Add like
			await addDoc(likesRef, {
				postId,
				userId,
				postType,
				createdAt: serverTimestamp(),
			});

			// Increment like count
			await updateDoc(docRef, {
				likes: increment(1),
			});

			trackEvent("post_liked", { postId, userId, postType });

			return true;
		} else {
			// Remove like
			const likeDoc = likeSnap.docs[0];
			await deleteDoc(doc(db, COLLECTIONS.LIKES, likeDoc.id));

			// Decrement like count
			await updateDoc(docRef, {
				likes: increment(-1),
			});

			trackEvent("post_unliked", { postId, userId, postType });

			return false;
		}
	} catch (error) {
		console.error("Error toggling like:", error);
		throw error;
	}
};

// Add comment to post
export const addComment = async (
	postId,
	userId,
	commentText,
	postType = "sighting"
) => {
	try {
		// Check rate limit (10 comments per hour)
		const canComment = checkRateLimit(userId, "comment", 10, 60); // 60 minutes
		if (!canComment) {
			throw new Error("Comment limit reached. Please try again later.");
		}

		const commentsRef = collection(db, COLLECTIONS.COMMENTS);
		const collectionName =
			postType === "blog" ? COLLECTIONS.BLOGS : COLLECTIONS.SIGHTINGS;
		const postRef = doc(db, collectionName, postId);

		const newComment = {
			postId,
			userId,
			postType,
			text: commentText,
			likes: 0,
			createdAt: serverTimestamp(),
			updatedAt: serverTimestamp(),
		};

		const docRef = await addDoc(commentsRef, newComment);

		// Increment comment count on post
		await updateDoc(postRef, {
			comments: increment(1),
		});

		// Award points for comment
		await awardPoints(userId, POINTS.COMMENT, "comment_created", docRef.id);

		// Record action for rate limiting
		recordAction(userId, "comment");

		trackEvent("comment_added", { postId, userId, postType });

		return docRef.id;
	} catch (error) {
		console.error("Error adding comment:", error);
		throw error;
	}
};

// Get comments for post
export const getComments = async (postId, limitCount = 50) => {
	try {
		const commentsRef = collection(db, COLLECTIONS.COMMENTS);
		const q = query(
			commentsRef,
			where("postId", "==", postId),
			orderBy("createdAt", "desc"),
			limit(limitCount)
		);

		const snapshot = await getDocs(q);
		const comments = snapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));

		return comments;
	} catch (error) {
		console.error("Error getting comments:", error);
		throw error;
	}
};

// Search posts
export const searchPosts = async (
	searchTerm,
	postType = "sighting",
	limitCount = 20
) => {
	try {
		if (!searchTerm || searchTerm.trim() === "") {
			return [];
		}

		const collectionName =
			postType === "blog" ? COLLECTIONS.BLOGS : COLLECTIONS.SIGHTINGS;
		const postsRef = collection(db, collectionName);

		const snapshot = await getDocs(postsRef);
		const searchTermLower = searchTerm.toLowerCase();

		const posts = snapshot.docs
			.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}))
			.filter((post) => {
				const title = (post.title || "").toLowerCase();
				const description = (post.description || "").toLowerCase();
				const species = (post.species || "").toLowerCase();
				return (
					title.includes(searchTermLower) ||
					description.includes(searchTermLower) ||
					species.includes(searchTermLower)
				);
			})
			.slice(0, limitCount);

		return posts;
	} catch (error) {
		console.error("Error searching posts:", error);
		throw error;
	}
};

export default {
	createSighting,
	createBlog,
	getPostById,
	getRecentPosts,
	getPostsByUser,
	updatePost,
	deletePost,
	toggleLikePost,
	addComment,
	getComments,
	searchPosts,
};
