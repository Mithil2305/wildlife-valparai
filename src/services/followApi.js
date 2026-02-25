import {
	getFirebaseDb,
	getFirebaseAuth,
	getUserDoc,
	doc,
	getDoc,
	setDoc,
	updateDoc,
	deleteDoc,
	getDocs,
	collection,
	query,
	where,
	orderBy,
	limit,
	runTransaction,
	increment,
	serverTimestamp,
	onSnapshot,
} from "./firebase";
import { startAfter } from "firebase/firestore";

// ─── COLLECTION HELPERS ───────────────────────────────────────────────

const getCreatorDoc = async (creatorId) => {
	const db = await getFirebaseDb();
	return doc(db, "creators", creatorId);
};

const getFollowerMemberDoc = async (creatorId, userId) => {
	const db = await getFirebaseDb();
	return doc(db, "followers", creatorId, "members", userId);
};

const getUserFollowingDoc = async (userId, creatorId) => {
	const db = await getFirebaseDb();
	return doc(db, "users", userId, "following", creatorId);
};

const _getNotificationsCollection = async (userId) => {
	const db = await getFirebaseDb();
	return collection(db, "notifications", userId, "items");
};

const getDeviceDoc = async (userId, deviceId) => {
	const db = await getFirebaseDb();
	return doc(db, "users", userId, "devices", deviceId);
};

// ─── CREATOR PROFILE ──────────────────────────────────────────────────

/**
 * Ensures a creator profile document exists. If not, creates one
 * from the user's existing profile data.
 */
export const ensureCreatorProfile = async (creatorId) => {
	const creatorRef = await getCreatorDoc(creatorId);
	const snap = await getDoc(creatorRef);

	if (snap.exists()) return { id: snap.id, ...snap.data() };

	// Only authenticated users can create the profile doc
	const auth = await getFirebaseAuth();
	if (!auth.currentUser) {
		// Can't create – try to read from the user doc instead (read-only fallback)
		const userRef = await getUserDoc(creatorId);
		const userSnap = await getDoc(userRef);
		if (!userSnap.exists()) return null;
		const userData = userSnap.data();
		return {
			id: creatorId,
			name: userData.name || "Anonymous",
			avatarUrl: userData.profilePhotoUrl || "",
			bio: userData.bio || "",
			points: userData.points || 0,
			followerCount: 0,
			postCount: 0,
		};
	}

	// Pull from user profile
	const userRef = await getUserDoc(creatorId);
	const userSnap = await getDoc(userRef);
	const userData = userSnap.exists() ? userSnap.data() : {};

	const profile = {
		name: userData.name || "Anonymous",
		avatarUrl: userData.profilePhotoUrl || "",
		bio: userData.bio || "",
		points: userData.points || 0,
		followerCount: 0,
		postCount: 0,
		createdAt: serverTimestamp(),
	};

	await setDoc(creatorRef, profile);
	return { id: creatorId, ...profile };
};

/**
 * Fetch a creator profile (read-only).
 */
export const getCreatorProfile = async (creatorId) => {
	const creatorRef = await getCreatorDoc(creatorId);
	const snap = await getDoc(creatorRef);
	if (!snap.exists()) return null;
	return { id: snap.id, ...snap.data() };
};

/**
 * Subscribe to real-time creator profile updates.
 */
export const subscribeCreatorProfile = async (creatorId, callback) => {
	const creatorRef = await getCreatorDoc(creatorId);
	return onSnapshot(creatorRef, (snap) => {
		if (snap.exists()) {
			callback({ id: snap.id, ...snap.data() });
		} else {
			callback(null);
		}
	});
};

/**
 * Update creator's own profile fields (name, bio, avatarUrl).
 */
export const updateCreatorProfile = async (creatorId, data) => {
	const auth = await getFirebaseAuth();
	if (!auth.currentUser || auth.currentUser.uid !== creatorId) {
		throw new Error("Only the creator can update their profile");
	}

	const allowed = {};
	if (data.name !== undefined) allowed.name = data.name;
	if (data.bio !== undefined) allowed.bio = data.bio;
	if (data.avatarUrl !== undefined) allowed.avatarUrl = data.avatarUrl;

	const creatorRef = await getCreatorDoc(creatorId);
	await updateDoc(creatorRef, allowed);
};

// ─── FOLLOW / UNFOLLOW ───────────────────────────────────────────────

/**
 * Follow a creator – transactional write to both collections
 * and increment the follower counter on the creator profile.
 */
export const followCreator = async (creatorId) => {
	const auth = await getFirebaseAuth();
	const user = auth.currentUser;
	if (!user) throw new Error("Must be authenticated to follow");
	if (user.uid === creatorId) throw new Error("Cannot follow yourself");

	const db = await getFirebaseDb();

	// Ensure creator profile exists before following
	await ensureCreatorProfile(creatorId);

	const memberRef = await getFollowerMemberDoc(creatorId, user.uid);
	const followingRef = await getUserFollowingDoc(user.uid, creatorId);
	const creatorRef = await getCreatorDoc(creatorId);

	await runTransaction(db, async (tx) => {
		const memberSnap = await tx.get(memberRef);
		if (memberSnap.exists()) {
			throw new Error("Already following this creator");
		}

		tx.set(memberRef, { joinedAt: serverTimestamp() });
		tx.set(followingRef, { joinedAt: serverTimestamp() });
		tx.update(creatorRef, { followerCount: increment(1) });
	});
};

/**
 * Unfollow a creator – transactional removal + decrement counter.
 */
export const unfollowCreator = async (creatorId) => {
	const auth = await getFirebaseAuth();
	const user = auth.currentUser;
	if (!user) throw new Error("Must be authenticated to unfollow");

	const db = await getFirebaseDb();
	const memberRef = await getFollowerMemberDoc(creatorId, user.uid);
	const followingRef = await getUserFollowingDoc(user.uid, creatorId);
	const creatorRef = await getCreatorDoc(creatorId);

	await runTransaction(db, async (tx) => {
		const memberSnap = await tx.get(memberRef);
		if (!memberSnap.exists()) {
			throw new Error("Not currently following this creator");
		}

		tx.delete(memberRef);
		tx.delete(followingRef);
		tx.update(creatorRef, { followerCount: increment(-1) });
	});
};

/**
 * Check if the current user follows a creator.
 */
export const getFollowStatus = async (creatorId) => {
	const auth = await getFirebaseAuth();
	const user = auth.currentUser;
	if (!user) return false;

	const memberRef = await getFollowerMemberDoc(creatorId, user.uid);
	const snap = await getDoc(memberRef);
	return snap.exists();
};

/**
 * Subscribe to follow-status changes in real time.
 */
export const subscribeFollowStatus = async (creatorId, userId, callback) => {
	if (!userId) {
		callback(false);
		return () => {};
	}
	const memberRef = await getFollowerMemberDoc(creatorId, userId);
	return onSnapshot(memberRef, (snap) => callback(snap.exists()));
};

/**
 * Get the list of creator IDs the user follows.
 */
export const getUserFollowing = async (userId) => {
	const db = await getFirebaseDb();
	const followingCol = collection(db, "users", userId, "following");
	const snap = await getDocs(followingCol);
	return snap.docs.map((d) => d.id);
};

/**
 * Get the follower count for a creator (from the profile doc).
 */
export const getFollowerCount = async (creatorId) => {
	const profile = await getCreatorProfile(creatorId);
	return profile?.followerCount || 0;
};

// ─── CREATOR POSTS (paginated) ────────────────────────────────────────

const POSTS_PAGE_SIZE = 12;

/**
 * Fetch a page of posts for a specific creator with cursor-based pagination.
 */
export const getCreatorPosts = async (creatorId, lastDoc = null) => {
	const db = await getFirebaseDb();
	const postsCol = collection(db, "posts");

	let q = query(
		postsCol,
		where("creatorId", "==", creatorId),
		where("hidden", "==", false),
		orderBy("createdAt", "desc"),
		limit(POSTS_PAGE_SIZE),
	);

	if (lastDoc) {
		q = query(
			postsCol,
			where("creatorId", "==", creatorId),
			where("hidden", "==", false),
			orderBy("createdAt", "desc"),
			startAfter(lastDoc),
			limit(POSTS_PAGE_SIZE),
		);
	}

	const snap = await getDocs(q);
	const posts = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
	const lastVisible = snap.docs[snap.docs.length - 1] || null;
	const hasMore = snap.docs.length === POSTS_PAGE_SIZE;

	return { posts, lastVisible, hasMore };
};

// ─── IN-APP NOTIFICATIONS ────────────────────────────────────────────

/**
 * Subscribe to in-app notifications for a user (real-time).
 */
export const subscribeNotifications = async (userId, callback) => {
	const db = await getFirebaseDb();
	const notifCol = collection(db, "notifications", userId, "items");
	const q = query(notifCol, orderBy("createdAt", "desc"), limit(50));

	return onSnapshot(q, (snap) => {
		const notifications = snap.docs.map((d) => ({
			id: d.id,
			...d.data(),
		}));
		callback(notifications);
	});
};

/**
 * Mark a notification as read.
 */
export const markNotificationRead = async (userId, notificationId) => {
	const db = await getFirebaseDb();
	const notifRef = doc(db, "notifications", userId, "items", notificationId);
	await updateDoc(notifRef, { read: true });
};

/**
 * Mark all notifications as read.
 */
export const markAllNotificationsRead = async (userId) => {
	const db = await getFirebaseDb();
	const notifCol = collection(db, "notifications", userId, "items");
	const q = query(notifCol, where("read", "==", false));
	const snap = await getDocs(q);

	const batch = [];
	snap.docs.forEach((d) => {
		batch.push(
			updateDoc(doc(db, "notifications", userId, "items", d.id), {
				read: true,
			}),
		);
	});
	await Promise.all(batch);
};

// ─── DEVICE TOKEN MANAGEMENT (FCM) ──────────────────────────────────

/**
 * Register an FCM device token for push notifications.
 */
export const registerDeviceToken = async (userId, token, platform = "web") => {
	// Use a hash of the token as deviceId for deduplication
	const deviceId = btoa(token).slice(0, 20);
	const deviceRef = await getDeviceDoc(userId, deviceId);
	await setDoc(
		deviceRef,
		{
			fcmToken: token,
			platform,
			updatedAt: serverTimestamp(),
		},
		{ merge: true },
	);
};

/**
 * Remove a device token (on logout / permission revoke).
 */
export const removeDeviceToken = async (userId, token) => {
	const deviceId = btoa(token).slice(0, 20);
	const deviceRef = await getDeviceDoc(userId, deviceId);
	await deleteDoc(deviceRef);
};

// ─── ANALYTICS EVENTS ────────────────────────────────────────────────

/**
 * Lightweight analytics helper – writes to a Firestore `analytics` collection
 * so Cloud Functions / BigQuery can consume them.
 */
export const logAnalyticsEvent = async (eventName, data = {}) => {
	try {
		const db = await getFirebaseDb();
		const analyticsCol = collection(db, "analytics");
		const auth = await getFirebaseAuth();
		const eventRef = doc(analyticsCol);
		await setDoc(eventRef, {
			event: eventName,
			userId: auth.currentUser?.uid || null,
			data,
			timestamp: serverTimestamp(),
		});
	} catch (err) {
		// Analytics should never break the app
		console.warn("Analytics event failed:", err);
	}
};

// ─── CLIENT-SIDE FOLLOWER NOTIFICATIONS ─────────────────────────────

/**
 * Notify all followers of a creator about a new post.
 *
 * Runs entirely on the client – no Cloud Functions required.
 * Writes an in-app notification doc to `notifications/{followerId}/items/{auto}`
 * for every member in `followers/{creatorId}/members`.
 *
 * Should be called AFTER a post is successfully created.
 *
 * @param {string}  creatorId       – UID of the creator
 * @param {string}  creatorName     – display name shown in notification
 * @param {string}  postId          – the newly created post ID
 * @param {string}  postTitle       – title of the post
 * @param {string}  postType        – "blog" | "photoAudio"
 */
export const notifyFollowersOfNewPost = async (
	creatorId,
	creatorName,
	postId,
	postTitle,
	postType,
) => {
	try {
		const db = await getFirebaseDb();
		const membersCol = collection(db, "followers", creatorId, "members");
		const membersSnap = await getDocs(membersCol);

		if (membersSnap.empty) return;

		const deepLink =
			postType === "blog" ? `/blog/${postId}` : `/socials/${postId}`;

		const notificationData = {
			title: `${creatorName} published a new ${postType === "blog" ? "blog post" : "wildlife moment"}`,
			body: postTitle,
			read: false,
			deepLink,
			creatorId,
			postId,
			createdAt: serverTimestamp(),
		};

		// Write notifications in parallel (batched by Promise.all)
		// For very large follower counts (>500), this should be migrated
		// to a background worker or Cloud Function in the future.
		const writes = membersSnap.docs.map((memberDoc) => {
			const followerId = memberDoc.id;
			// Don't notify the creator about their own post
			if (followerId === creatorId) return Promise.resolve();

			const notifCol = collection(db, "notifications", followerId, "items");
			const notifRef = doc(notifCol);
			return setDoc(notifRef, notificationData);
		});

		await Promise.all(writes);

		logAnalyticsEvent("notifications_sent", {
			creatorId,
			postId,
			followerCount: membersSnap.size,
		});
	} catch (err) {
		// Notification failures should never block the post creation flow
		console.error("Error notifying followers:", err);
	}
};

// ─── CREATOR POST COUNT ─────────────────────────────────────────────

/**
 * Increment the postCount on a creator profile.
 * Called after a post is successfully created.
 */
export const incrementCreatorPostCount = async (creatorId) => {
	try {
		// Ensure creator profile exists first
		await ensureCreatorProfile(creatorId);
		const creatorRef = await getCreatorDoc(creatorId);
		await updateDoc(creatorRef, { postCount: increment(1) });
	} catch (err) {
		console.error("Error incrementing post count:", err);
	}
};

/**
 * Decrement the postCount on a creator profile.
 * Called after a post is deleted.
 */
export const decrementCreatorPostCount = async (creatorId) => {
	try {
		const creatorRef = await getCreatorDoc(creatorId);
		await updateDoc(creatorRef, { postCount: increment(-1) });
	} catch (err) {
		console.error("Error decrementing post count:", err);
	}
};
