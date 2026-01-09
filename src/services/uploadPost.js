import { db, postsCollection, serverTimestamp, increment } from "./firebase";
import {
	doc,
	getDoc,
	getDocs,
	query,
	where,
	orderBy,
	limit,
	setDoc,
	updateDoc,
	deleteDoc,
	collection,
	runTransaction,
} from "firebase/firestore";
import { applyPoints } from "./points";

/* ===================== POSTS ===================== */

export const createPhotoAudioPost = async ({
	creatorId,
	creatorUsername,
	title,
	photoUrl,
	audioUrl,
}) => {
	return createPost({
		type: "photoAudio",
		creatorId,
		creatorUsername,
		title,
		photoUrl,
		audioUrl,
	});
};

export const createBlogPost = async ({
	creatorId,
	creatorUsername,
	title,
	blogContent,
}) => {
	return createPost({
		type: "blog",
		creatorId,
		creatorUsername,
		title,
		blogContent,
	});
};

const createPost = async ({
	type,
	creatorId,
	creatorUsername,
	title,
	photoUrl = "",
	audioUrl = "",
	blogContent = "",
}) => {
	const postRef = doc(postsCollection);

	await setDoc(postRef, {
		type,
		creatorId,
		creatorUsername,
		title,
		photoUrl,
		audioUrl,
		blogContent,
		likeCount: 0,
		commentCount: 0,
		shareCount: 0,
		createdAt: serverTimestamp(),
	});

	await applyPoints(
		creatorId,
		type === "blog" ? 150 : 100,
		type === "blog" ? "Published blog" : "Uploaded photo + audio",
		{ postId: postRef.id }
	);

	return postRef.id;
};

export const deleteBlogPost = async (postId) => {
	const postRef = doc(db, "posts", postId);
	const snap = await getDoc(postRef);
	if (!snap.exists()) return;

	const post = snap.data();
	const engagementLoss =
		((post.likeCount || 0) + (post.commentCount || 0)) * 10;
	const baseLoss = post.type === "blog" ? 150 : 100;

	await deleteDoc(postRef);

	await applyPoints(
		post.creatorId,
		-(baseLoss + engagementLoss),
		"Post deleted",
		{ postId }
	);
};

export const updateBlogPost = async (postId, { title, blogContent }) => {
	const postRef = doc(db, "posts", postId);
	const snap = await getDoc(postRef);
	if (!snap.exists()) return null;

	await updateDoc(postRef, {
		title,
		blogContent,
		updatedAt: serverTimestamp(),
	});

	return postId;
};

/* ===================== FETCH ===================== */

export const getPost = async (postId) => {
	const snap = await getDoc(doc(db, "posts", postId));
	return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

export const getLatestPosts = async (count = 10) => {
	const q = query(postsCollection, orderBy("createdAt", "desc"), limit(count));
	const snap = await getDocs(q);
	return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const getCreatorPosts = async (creatorId) => {
	const q = query(postsCollection, where("creatorId", "==", creatorId));
	const snap = await getDocs(q);
	return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

/* ===================== COMMENTS ===================== */

export const getPostComments = async (postId) => {
	const q = query(
		collection(db, "posts", postId, "comments"),
		orderBy("createdAt", "asc")
	);
	const snap = await getDocs(q);
	return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const addPostComment = async (postId, userId, username, text) => {
	const postRef = doc(db, "posts", postId);
	const commentRef = doc(collection(postRef, "comments"));

	let creatorId = null;

	await runTransaction(db, async (tx) => {
		const postSnap = await tx.get(postRef);
		if (!postSnap.exists()) return;

		creatorId = postSnap.data().creatorId;

		tx.set(commentRef, {
			userId,
			username,
			text,
			createdAt: serverTimestamp(),
		});

		tx.update(postRef, { commentCount: increment(1) });
	});

	// Apply points AFTER transaction completes
	if (creatorId) {
		await applyPoints(userId, 10, "Commented on a post", { postId });
		await applyPoints(creatorId, 10, "Comment received", { postId });
	}
};

export const deletePostComment = async (postId, commentId, userId) => {
	const postRef = doc(db, "posts", postId);
	const commentRef = doc(db, "posts", postId, "comments", commentId);

	let creatorId = null;

	await runTransaction(db, async (tx) => {
		const postSnap = await tx.get(postRef);
		if (!postSnap.exists()) return;

		creatorId = postSnap.data().creatorId;

		tx.delete(commentRef);
		tx.update(postRef, { commentCount: increment(-1) });
	});

	// Apply points AFTER transaction completes
	if (creatorId) {
		await applyPoints(userId, -10, "Comment deleted", { postId });
		await applyPoints(creatorId, -10, "Comment removed", { postId });
	}
};
