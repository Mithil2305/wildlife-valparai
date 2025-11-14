import {  usersCollection, getDocs, query, where } from "./firebase.js";

/**
 * Fetches and ranks creators for the leaderboard.
 * * As per instructions, this fetches all creators and sorts them
 * in memory to avoid Firestore 'orderBy' index requirements.
 * * @returns {Promise<Array<object>>} A sorted array of creator user objects.
 */
export const getLeaderboard = async () => {
	try {
		// 1. Query for all users who are creators
		const q = query(usersCollection, where("accountType", "==", "creator"));
		const snapshot = await getDocs(q);

		const creators = [];
		snapshot.forEach((doc) => {
			creators.push({ id: doc.id, ...doc.data() });
		});

		// 2. Sort the creators by points in memory (descending)
		creators.sort((a, b) => (b.points || 0) - (a.points || 0));

		return creators;
	} catch (error) {
		console.error("Error fetching leaderboard data:", error);
		throw error;
	}
};

/**
 * Fetches a specific user's rank and points.
 * @param {string} userId - The user's ID.
 * @returns {Promise<object>} An object with { user, rank }.
 */
export const getUserRank = async (userId) => {
	try {
		// This is inefficient but necessary without a dedicated backend
		// A better approach for scale would be a cloud function
		// that maintains a separate "ranks" collection.

		const leaderboard = await getLeaderboard();

		const userIndex = leaderboard.findIndex((user) => user.id === userId);

		if (userIndex === -1) {
			// User is not a creator or not on the leaderboard
			return { user: null, rank: -1 };
		}

		return {
			user: leaderboard[userIndex],
			rank: userIndex + 1, // 1-based index
		};
	} catch (error) {
		console.error("Error getting user rank:", error);
		throw error;
	}
};
