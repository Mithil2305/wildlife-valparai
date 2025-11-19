import { usersCollection, getDocs, query, orderBy, limit } from "./firebase.js";

/**
 * Cash prize distribution:
 * 1st Place: ₹10,000
 * 2nd Place: ₹7,500
 * 3rd Place: ₹5,000
 * 4th Place: ₹2,500
 * Total: ₹25,000
 */

export const PRIZES = {
	1: { amount: 10000, label: "₹10,000" },
	2: { amount: 7500, label: "₹7,500" },
	3: { amount: 5000, label: "₹5,000" },
	4: { amount: 2500, label: "₹2,500" },
};

/**
 * Calculate leaderboard rankings based on total points
 * @param {number} limitCount - Number of users to return (default: 100)
 * @returns {Promise<Array>} Sorted array of users by points
 */
export const calculateLeaderboard = async (limitCount = 100) => {
	try {
		// Fetch all users sorted by points
		const q = query(
			usersCollection,
			orderBy("points", "desc"),
			limit(limitCount)
		);

		const snapshot = await getDocs(q);

		const rankedUsers = [];
		snapshot.forEach((doc, index) => {
			const userData = doc.data();
			rankedUsers.push({
				userId: doc.id,
				rank: index + 1,
				name: userData.name,
				username: userData.username,
				points: userData.points || 0,
				accountType: userData.accountType,
				profilePhotoUrl: userData.profilePhotoUrl,
				prize: PRIZES[index + 1] || null,
			});
		});

		return rankedUsers;
	} catch (error) {
		console.error("Error calculating leaderboard:", error);
		return [];
	}
};

/**
 * Get user's rank and nearby competitors
 * @param {string} userId - User ID
 * @returns {Promise<object>} User rank info with nearby users
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
