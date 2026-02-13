import {
	getPostDoc,
	getReportsCollection,
	getReportDoc,
	getPostsCollection,
	getDoc,
	getDocs,
	setDoc,
	deleteDoc,
	updateDoc,
	increment,
	serverTimestamp,
	query,
	where,
	orderBy,
} from "./firebase.js";

const REPORT_THRESHOLD = 20;

export const REPORT_REASONS = [
	"Spam or misleading",
	"Harassment or bullying",
	"Inappropriate content",
	"Violence or dangerous acts",
	"Copyright violation",
	"False information",
	"Other",
];

/**
 * Report a post. Each user can report a post only once.
 * When reportCount >= REPORT_THRESHOLD, the post is auto-hidden.
 */
export const reportPost = async (postId, userId, reason, details = "") => {
	if (!postId || !userId || !reason) {
		throw new Error("Post ID, user ID, and reason are required");
	}

	// Check if user already reported this post
	const reportRef = await getReportDoc(postId, userId);
	const existingReport = await getDoc(reportRef);
	if (existingReport.exists()) {
		throw new Error("You have already reported this post");
	}

	// Create the report document (keyed by userId to prevent duplicates)
	await setDoc(reportRef, {
		userId,
		reason,
		details: details.slice(0, 500), // limit details length
		createdAt: serverTimestamp(),
	});

	// Increment the reportCount on the post
	const postRef = await getPostDoc(postId);
	await updateDoc(postRef, {
		reportCount: increment(1),
	});

	// Check if threshold is reached and auto-hide
	const postSnap = await getDoc(postRef);
	if (postSnap.exists()) {
		const data = postSnap.data();
		if ((data.reportCount || 0) >= REPORT_THRESHOLD && !data.hidden) {
			await updateDoc(postRef, { hidden: true });
		}
	}

	return true;
};

/**
 * Check if a user has already reported a specific post.
 */
export const hasUserReported = async (postId, userId) => {
	const reportRef = await getReportDoc(postId, userId);
	const snap = await getDoc(reportRef);
	return snap.exists();
};

/**
 * Get all reports for a specific post (admin use).
 */
export const getPostReports = async (postId) => {
	const reportsCol = await getReportsCollection(postId);
	const q = query(reportsCol, orderBy("createdAt", "desc"));
	const snapshot = await getDocs(q);
	return snapshot.docs.map((doc) => ({
		id: doc.id,
		...doc.data(),
	}));
};

/**
 * Get all posts that have been reported (reportCount > 0).
 * Used by Admin dashboard.
 */
export const getAllReportedPosts = async () => {
	const postsCol = await getPostsCollection();
	const q = query(
		postsCol,
		where("reportCount", ">", 0),
		orderBy("reportCount", "desc"),
	);
	const snapshot = await getDocs(q);
	return snapshot.docs.map((doc) => ({
		id: doc.id,
		...doc.data(),
	}));
};

/**
 * Get reported posts for a specific creator (read-only view).
 * Uses client-side filtering to avoid requiring a Firestore composite index.
 */
export const getCreatorReportedPosts = async (creatorId) => {
	const postsCol = await getPostsCollection();
	const q = query(postsCol, where("creatorId", "==", creatorId));
	const snapshot = await getDocs(q);
	return snapshot.docs
		.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}))
		.filter((post) => (post.reportCount || 0) > 0);
};

/**
 * Admin: Restore a hidden post (clear reports and unhide).
 */
export const adminRestorePost = async (postId) => {
	const postRef = await getPostDoc(postId);

	// Reset reportCount and unhide
	await updateDoc(postRef, {
		reportCount: 0,
		hidden: false,
	});

	// Delete all report subdocuments
	const reportsCol = await getReportsCollection(postId);
	const snapshot = await getDocs(reportsCol);
	const deletePromises = snapshot.docs.map((reportDoc) =>
		deleteDoc(reportDoc.ref),
	);
	await Promise.all(deletePromises);

	return true;
};

/**
 * Admin: Permanently delete a post and all its reports from DB.
 */
export const adminPermanentDelete = async (postId) => {
	// Delete all report subdocuments first
	const reportsCol = await getReportsCollection(postId);
	const snapshot = await getDocs(reportsCol);
	const deletePromises = snapshot.docs.map((reportDoc) =>
		deleteDoc(reportDoc.ref),
	);
	await Promise.all(deletePromises);

	// Delete the post itself
	const postRef = await getPostDoc(postId);
	await deleteDoc(postRef);

	return true;
};
