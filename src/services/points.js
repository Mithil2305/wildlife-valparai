import {
	db,
	runTransaction,
	userDoc,
	pointsHistoryCollection,
	increment,
	serverTimestamp,
	doc, // Added 'doc'
	query, // Added 'query'
	getDocs, // Added 'getDocs'
} from "./firebase.js";

/**
 * Awards points to a user.
 * This function atomically updates the user's total points and
 * Creates a record in their points history, as per the schema.
 *
 * @param {string} userId - The user to award points to.
 * @param {number} points - The number of points to add (e.g., 50).
 * @param {string} reason - e.g., "New post upload".
 * @param {string} [postId] - (Optional) The post ID related to this event.
 */
export const addPoints = async (userId, points, reason, postId = null) => {
	if (!userId || !points || !reason) {
		throw new Error("userId, points, and reason are required.");
	}

	const userRef = userDoc(userId);

	try {
		await runTransaction(db, async (transaction) => {
			// 1. Update the total points on the user's document
			transaction.update(userRef, {
				points: increment(points),
			});

			// 2. Create a new document in /users/{userId}/pointsHistory
			// We must use addDoc *after* the transaction, or create a ref inside it
			// Let's create the history doc *within* the transaction for atomicity
			const historyCollectionRef = pointsHistoryCollection(userId);
			const newHistoryRef = doc(historyCollectionRef); // Create a new doc ref (NOW WORKS)

			const historyData = {
				timestamp: serverTimestamp(),
				points: points, // The points added
				reason: reason,
			};

			if (postId) {
				historyData.postId = postId;
			}

			transaction.set(newHistoryRef, historyData);
		});

		console.log(
			`Successfully added ${points} points to user ${userId} for ${reason}`
		);
	} catch (error) {
		console.error(`Failed to add points to user ${userId}:`, error);
		throw error;
	}
};

/**
 * Fetches the points history for a user.
 * @param {string} userId - The user's ID.
 * @returns {Promise<Array<object>>} A promise that resolves to an array of history documents.
 */
export const getPointsHistory = async (userId) => {
	try {
		const historyCollectionRef = pointsHistoryCollection(userId);
		const q = query(historyCollectionRef); // (NOW WORKS) Add orderBy('timestamp', 'desc') in a real app
		const snapshot = await getDocs(q); // (NOW WORKS)

		const history = [];
		snapshot.forEach((doc) => {
			history.push({ id: doc.id, ...doc.data() });
		});

		// Sort in memory to avoid needing a composite index
		history.sort((a, b) => b.timestamp.toMillis() - a.timestamp.toMillis());

		return history;
	} catch (error) {
		console.error("Error fetching points history:", error);
		throw error;
	}
};
