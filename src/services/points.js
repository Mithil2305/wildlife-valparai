import {
	db,
	doc,
	getDoc,
	setDoc,
	updateDoc,
	increment,
	serverTimestamp,
	collection,
	query,
	orderBy,
	limit,
	getDocs,
} from "./firebase.js";

/**
 * Points allocation rules:
 *
 * CREATOR:
 * - Social post created: 100 points
 * - Social like received: 10 points
 * - Social comment received: 10 points
 * - Social share received: 10 points
 * - Blog post created: 150 points
 *
 * VIEWER:
 * - Like given: 10 points
 * - Comment given: 10 points
 * - Share given: 30 points
 */

const POINTS = {
	CREATOR: {
		SOCIAL_POST: 100,
		SOCIAL_LIKE: 10,
		SOCIAL_COMMENT: 10,
		SOCIAL_SHARE: 10,
		BLOG_POST: 150,
	},
	VIEWER: {
		LIKE: 10,
		COMMENT: 10,
		SHARE: 30,
	},
};

/**
 * Award points to a user
 * @param {string} userId - User ID
 * @param {number} points - Points to award
 * @param {string} reason - Reason for points
 * @param {object} metadata - Additional metadata
 */
export const awardPoints = async (userId, points, reason, metadata = {}) => {
	try {
		const userRef = doc(db, "users", userId);
		const userSnap = await getDoc(userRef);

		if (!userSnap.exists()) {
			console.error("User not found:", userId);
			return;
		}

		// Update user points
		await updateDoc(userRef, {
			points: increment(points),
			lastPointsUpdate: serverTimestamp(),
		});

		// Log points transaction
		const pointsLogRef = doc(
			db,
			"users",
			userId,
			"pointsHistory",
			Date.now().toString()
		);
		await setDoc(pointsLogRef, {
			points: points,
			reason: reason,
			timestamp: serverTimestamp(),
			metadata: metadata,
		});

		console.log(`Awarded ${points} points to ${userId} for: ${reason}`);
	} catch (error) {
		console.error("Error awarding points:", error);
		throw error;
	}
};

/**
 * Award points for creating a social post (Creator only)
 * @param {string} creatorId - Creator user ID
 * @param {string} postId - Post ID
 */
export const awardSocialPostPoints = async (creatorId, postId) => {
	await awardPoints(
		creatorId,
		POINTS.CREATOR.SOCIAL_POST,
		"Social post created",
		{ postId, type: "social_post" }
	);
};

/**
 * Award points for creating a blog post (Creator only)
 * @param {string} creatorId - Creator user ID
 * @param {string} postId - Post ID
 */
export const awardBlogPostPoints = async (creatorId, postId) => {
	await awardPoints(creatorId, POINTS.CREATOR.BLOG_POST, "Blog post created", {
		postId,
		type: "blog_post",
	});
};

/**
 * Award points for receiving a like on social post (Creator gets points)
 * Award points for giving a like (Viewer gets points)
 * @param {string} postCreatorId - Post creator ID
 * @param {string} likerId - User who liked
 * @param {string} postId - Post ID
 */
export const awardLikePoints = async (postCreatorId, likerId, postId) => {
	try {
		// Get liker's account type
		const likerRef = doc(db, "users", likerId);
		const likerSnap = await getDoc(likerRef);

		if (!likerSnap.exists()) return;

		const likerData = likerSnap.data();

		// Award points to viewer for liking
		await awardPoints(likerId, POINTS.VIEWER.LIKE, "Liked a post", {
			postId,
			type: "like_given",
		});

		// Award points to creator for receiving like (only if different user)
		if (postCreatorId !== likerId) {
			await awardPoints(
				postCreatorId,
				POINTS.CREATOR.SOCIAL_LIKE,
				"Received a like",
				{ postId, type: "like_received", from: likerId }
			);
		}
	} catch (error) {
		console.error("Error awarding like points:", error);
	}
};

/**
 * Award points for commenting
 * @param {string} postCreatorId - Post creator ID
 * @param {string} commenterId - User who commented
 * @param {string} postId - Post ID
 */
export const awardCommentPoints = async (
	postCreatorId,
	commenterId,
	postId
) => {
	try {
		// Award points to viewer for commenting
		await awardPoints(
			commenterId,
			POINTS.VIEWER.COMMENT,
			"Commented on a post",
			{ postId, type: "comment_given" }
		);

		// Award points to creator for receiving comment (only if different user)
		if (postCreatorId !== commenterId) {
			await awardPoints(
				postCreatorId,
				POINTS.CREATOR.SOCIAL_COMMENT,
				"Received a comment",
				{ postId, type: "comment_received", from: commenterId }
			);
		}
	} catch (error) {
		console.error("Error awarding comment points:", error);
	}
};

/**
 * Award points for sharing
 * @param {string} postCreatorId - Post creator ID
 * @param {string} sharerId - User who shared
 * @param {string} postId - Post ID
 */
export const awardSharePoints = async (postCreatorId, sharerId, postId) => {
	try {
		// Award points to viewer for sharing
		await awardPoints(sharerId, POINTS.VIEWER.SHARE, "Shared a post", {
			postId,
			type: "share_given",
		});

		// Award points to creator for receiving share (only if different user)
		if (postCreatorId !== sharerId) {
			await awardPoints(
				postCreatorId,
				POINTS.CREATOR.SOCIAL_SHARE,
				"Post was shared",
				{ postId, type: "share_received", from: sharerId }
			);
		}
	} catch (error) {
		console.error("Error awarding share points:", error);
	}
};

/**
 * Get user's points history
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Points history
 */
export const getUserPointsHistory = async (userId) => {
	try {
		const historyRef = collection(db, "users", userId, "pointsHistory");
		const q = query(historyRef, orderBy("timestamp", "desc"), limit(50));
		const snapshot = await getDocs(q);

		return snapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));
	} catch (error) {
		console.error("Error fetching points history:", error);
		return [];
	}
};

export { POINTS };
