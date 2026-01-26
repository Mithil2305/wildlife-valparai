import {
	getUsersCollection,
	getDocs,
	query,
	where,
	orderBy,
	limit as firestoreLimit,
} from "./firebase.js";

/**
 * Cash prize distribution
 */
export const PRIZES = {
	1: { amount: 10000, label: "₹10,000" },
	2: { amount: 7500, label: "₹7,500" },
	3: { amount: 5000, label: "₹5,000" },
	4: { amount: 2500, label: "₹2,500" },
};

// --- Caching Configuration ---
const CACHE_DURATION_MS = 60 * 1000; // 1 minute cache
let leaderboardCache = {
	data: null,
	timestamp: 0,
	limitCount: 0,
};

/**
 * Check if cached data is still valid
 * @param {number} requestedLimit - Requested limit count
 * @returns {boolean}
 */
const isCacheValid = (requestedLimit) => {
	const now = Date.now();
	return (
		leaderboardCache.data !== null &&
		leaderboardCache.limitCount >= requestedLimit &&
		now - leaderboardCache.timestamp < CACHE_DURATION_MS
	);
};

/**
 * Invalidate the leaderboard cache
 * Call this when points are updated
 */
export const invalidateLeaderboardCache = () => {
	leaderboardCache = {
		data: null,
		timestamp: 0,
		limitCount: 0,
	};
};

/**
 * Calculate leaderboard rankings based on total points
 * Uses caching to reduce Firestore reads and improve performance.
 * @param {number} limitCount - Number of users to return
 * @param {boolean} forceRefresh - Force refresh ignoring cache
 * @returns {Promise<Array>} Sorted array of users by points
 */
export const calculateLeaderboard = async (
	limitCount = 100,
	forceRefresh = false,
) => {
	try {
		// Return cached data if valid and not forcing refresh
		if (!forceRefresh && isCacheValid(limitCount)) {
			console.log("Returning cached leaderboard data");
			return leaderboardCache.data.slice(0, limitCount);
		}

		console.log("Fetching fresh leaderboard data...");
		const startTime = performance.now();

		// 1. Fetch users with optimized query
		const usersCol = await getUsersCollection();

		// Try to use server-side ordering first (requires Firestore index)
		let snapshot;
		try {
			// Optimized query: only fetch non-admin users with points, ordered by points
			const optimizedQuery = query(
				usersCol,
				where("accountType", "!=", "admin"),
				orderBy("points", "desc"),
				firestoreLimit(Math.max(limitCount, 100)), // Fetch at least 100 for caching
			);
			snapshot = await getDocs(optimizedQuery);
		} catch {
			// Fallback to simple query if index not available
			console.warn("Firestore index not available, using fallback query");
			const fallbackQuery = query(usersCol);
			snapshot = await getDocs(fallbackQuery);
		}

		console.log(
			`Fetched ${snapshot.size} users in ${Math.round(performance.now() - startTime)}ms`,
		);

		let allUsers = [];
		snapshot.forEach((doc) => {
			const userData = doc.data();
			// Filter out 'admin' accounts immediately
			if (userData.accountType === "admin") return;

			allUsers.push({
				userId: doc.id,
				name: userData.name || "Anonymous",
				username: userData.username || "user",
				points: Number(userData.points) || 0,
				accountType: userData.accountType || "viewer",
				profilePhotoUrl: userData.profilePhotoUrl || null,
			});
		});

		// 2. Sort users by points (Highest first) - Client side sorting as backup
		allUsers.sort((a, b) => b.points - a.points);

		// 3. Assign ranks and prizes
		const rankedUsers = allUsers.map((user, index) => ({
			...user,
			rank: index + 1,
			prize: PRIZES[index + 1] || null,
		}));

		// 4. Update cache
		leaderboardCache = {
			data: rankedUsers,
			timestamp: Date.now(),
			limitCount: rankedUsers.length,
		};

		console.log(
			`Leaderboard calculated. Top 3:`,
			rankedUsers.slice(0, 3).map((u) => u.name),
		);
		return rankedUsers.slice(0, limitCount);
	} catch (error) {
		console.error("Error calculating leaderboard:", error);

		// Return stale cache if available
		if (leaderboardCache.data) {
			console.log("Returning stale cache due to error");
			return leaderboardCache.data.slice(0, limitCount);
		}

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
