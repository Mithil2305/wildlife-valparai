import {
	collection,
	addDoc,
	updateDoc,
	doc,
	getDoc,
	getDocs,
	query,
	where,
	orderBy,
	serverTimestamp,
	increment,
} from "firebase/firestore";
import { db } from "./firebaseConfig";

// Points configuration
const POINTS_CONFIG = {
	sighting_submission: 10,
	sighting_approved: 50,
	blog_published: 30,
	blog_liked: 2,
	sighting_liked: 1,
	daily_login: 5,
	profile_completion: 20,
	content_shared: 15,
	comment_added: 5,
};

export const awardPoints = async (userId, action, referenceId = null) => {
	try {
		const points = POINTS_CONFIG[action] || 0;

		if (points === 0) {
			return { success: false, error: "Invalid action" };
		}

		// Create points transaction
		await addDoc(collection(db, "pointsTransactions"), {
			userId,
			action,
			points,
			referenceId,
			createdAt: serverTimestamp(),
		});

		// Update user's total points
		const userRef = doc(db, "users", userId);
		await updateDoc(userRef, {
			points: increment(points),
			lastPointsUpdate: serverTimestamp(),
		});

		return { success: true, points };
	} catch (error) {
		return { success: false, error: error.message };
	}
};

export const getUserPoints = async (userId) => {
	try {
		const userDoc = await getDoc(doc(db, "users", userId));
		if (userDoc.exists()) {
			const userData = userDoc.data();
			return { success: true, points: userData.points || 0 };
		}
		return { success: false, error: "User not found" };
	} catch (error) {
		return { success: false, error: error.message };
	}
};

export const getPointsHistory = async (userId, limit = 20) => {
	try {
		const pointsQuery = query(
			collection(db, "pointsTransactions"),
			where("userId", "==", userId),
			orderBy("createdAt", "desc"),
			limit(limit)
		);

		const querySnapshot = await getDocs(pointsQuery);
		const history = querySnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));

		return { success: true, data: history };
	} catch (error) {
		return { success: false, error: error.message };
	}
};

export const getLeaderboard = async (limit = 50) => {
	try {
		const usersQuery = query(
			collection(db, "users"),
			orderBy("points", "desc"),
			limit(limit)
		);

		const querySnapshot = await getDocs(usersQuery);
		const leaderboard = querySnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));

		return { success: true, data: leaderboard };
	} catch (error) {
		return { success: false, error: error.message };
	}
};

export const calculateMonthlyEarnings = (points) => {
	// Simple calculation: 1000 points = $1 (adjust as needed)
	const earnings = (points / 1000).toFixed(2);
	return parseFloat(earnings);
};
