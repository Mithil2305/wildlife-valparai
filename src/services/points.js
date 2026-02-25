import {
	getFirebaseDb,
	getUserDoc,
	getPointsHistoryCollection,
	serverTimestamp,
	doc,
	runTransaction,
} from "./firebase.js";
import { invalidateLeaderboardCache } from "./leaderboard.js";

/**
 * Apply points to a user in a SAFE atomic transaction.
 * @param {string} userId
 * @param {number} points (+ve or -ve)
 * @param {string} reason
 * @param {object} meta (optional)
 */
export const applyPoints = async (userId, points, reason, meta = {}) => {
	if (!userId || !points || !reason) return;

	try {
		const db = await getFirebaseDb();
		const userRef = await getUserDoc(userId);
		const historyCol = await getPointsHistoryCollection(userId);
		const historyRef = doc(historyCol);

		await runTransaction(db, async (tx) => {
			// Read the user document first to ensure it exists
			const userSnap = await tx.get(userRef);
			if (!userSnap.exists()) {
				console.error(`User ${userId} does not exist, cannot apply points`);
				return;
			}

			// Calculate new points value manually
			const currentPoints = userSnap.data().points || 0;
			const newPoints = Math.max(0, currentPoints + points); // Prevent negative points

			tx.update(userRef, {
				points: newPoints,
				lastPointsUpdate: serverTimestamp(),
			});

			tx.set(historyRef, {
				points,
				reason,
				meta,
				timestamp: serverTimestamp(),
			});
		});

		// Invalidate leaderboard cache after points change
		invalidateLeaderboardCache();
	} catch (error) {
		console.error("Error applying points:", error);
	}
};
