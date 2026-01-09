import { usersCollection, getDocs, query } from "./firebase.js";

/**
 * Cash prize distribution
 */
export const PRIZES = {
	1: { amount: 10000, label: "₹10,000" },
	2: { amount: 7500, label: "₹7,500" },
	3: { amount: 5000, label: "₹5,000" },
	4: { amount: 2500, label: "₹2,500" },
};

/**
 * Calculate leaderboard rankings based on total points
 * NOTE: Uses Client-side sorting to be robust against missing Firestore indexes.
 * @param {number} limitCount - Number of users to return
 * @returns {Promise<Array>} Sorted array of users by points
 */
export const calculateLeaderboard = async (limitCount = 100) => {
	try {
		console.log("Fetching leaderboard data...");
		// 1. Fetch all users
		const q = query(usersCollection);
		const snapshot = await getDocs(q);

		console.log(`Fetched ${snapshot.size} users.`);

		let allUsers = [];
		snapshot.forEach((doc) => {
			const userData = doc.data();
			allUsers.push({
				userId: doc.id,
				name: userData.name || "Anonymous",
				username: userData.username || "user",
				points: Number(userData.points) || 0, // Ensure points is a number
				accountType: userData.accountType || "viewer",
				profilePhotoUrl: userData.profilePhotoUrl || null,
			});
		});

		// 2. Sort users by points (Highest first) - Client Side
		allUsers.sort((a, b) => b.points - a.points);

		// 3. Apply limit and assign ranks/prizes
		const rankedUsers = allUsers.slice(0, limitCount).map((user, index) => ({
			...user,
			rank: index + 1,
			prize: PRIZES[index + 1] || null,
		}));

		console.log("Top 3 Users:", rankedUsers.slice(0, 3));
		return rankedUsers;
	} catch (error) {
		console.error("Error calculating leaderboard:", error);
		return [];
	}
};

/**
 * Get user's rank and nearby competitors
 */
export const getUserRankInfo = async (userId) => {
	try {
		const leaderboard = await calculateLeaderboard();
		const userIndex = leaderboard.findIndex((u) => u.userId === userId);

		if (userIndex === -1) {
			return {
				rank: null,
				user: null,
				above: [],
				below: [],
			};
		}

		const user = leaderboard[userIndex];
		const above = leaderboard.slice(Math.max(0, userIndex - 2), userIndex);
		const below = leaderboard.slice(userIndex + 1, userIndex + 3);

		return {
			rank: user.rank,
			user: user,
			above: above,
			below: below,
		};
	} catch (error) {
		console.error("Error getting user rank info:", error);
		return null;
	}
};
