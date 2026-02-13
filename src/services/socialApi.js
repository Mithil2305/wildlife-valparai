import {
	getFirebaseDb,
	getPostsCollection,
	getPostDoc,
	getLikeDoc,
	serverTimestamp,
	increment,
	doc,
	getDoc,
	getDocs,
	updateDoc,
	collection,
	query,
	where,
	runTransaction,
} from "./firebase";
import { collectionGroup } from "firebase/firestore";
import { applyPoints } from "./points";

/* ===================== FEED ===================== */

export const getAllPosts = async () => {
	const postsCol = await getPostsCollection();
	const snap = await getDocs(postsCol);
	return snap.docs
		.map((d) => ({ id: d.id, ...d.data() }))
		.filter((post) => !post.hidden);
};

export const getUserLikedPosts = async (userId) => {
	const db = await getFirebaseDb();
	const q = query(collectionGroup(db, "likes"), where("userId", "==", userId));
	const snap = await getDocs(q);
	return snap.docs.map((d) => d.ref.parent.parent.id);
};

/* ===================== LIKES ===================== */

export const getUserLikeStatus = async (postId, userId) => {
	const likeRef = await getLikeDoc(postId, userId);
	const snap = await getDoc(likeRef);
	return snap.exists();
};

export const toggleLike = async (postId, userId) => {
	const db = await getFirebaseDb();
	const likeRef = await getLikeDoc(postId, userId);
	const postRef = await getPostDoc(postId);

	let wasLiked = false;
	let creatorId = null;

	await runTransaction(db, async (tx) => {
		const postSnap = await tx.get(postRef);
		const likeSnap = await tx.get(likeRef);
		if (!postSnap.exists()) return;

		creatorId = postSnap.data().creatorId;

		if (likeSnap.exists()) {
			wasLiked = true;
			tx.delete(likeRef);
			tx.update(postRef, { likeCount: increment(-1) });
		} else {
			wasLiked = false;
			tx.set(likeRef, { userId, createdAt: serverTimestamp() });
			tx.update(postRef, { likeCount: increment(1) });
		}
	});

	// Apply points AFTER transaction completes
	if (creatorId) {
		if (wasLiked) {
			await applyPoints(userId, -10, "Unliked a post", { postId });
			await applyPoints(creatorId, -10, "Like removed", { postId });
		} else {
			await applyPoints(userId, 10, "Liked a post", { postId });
			await applyPoints(creatorId, 10, "Like received", { postId });
		}
	}
};

/* ===================== SHARES ===================== */

export const recordShare = async (postId) => {
	const postRef = await getPostDoc(postId);
	const snap = await getDoc(postRef);
	if (!snap.exists()) return;

	await updateDoc(postRef, { shareCount: increment(1) });

	await applyPoints(snap.data().creatorId, 10, "Post shared", { postId });
};
