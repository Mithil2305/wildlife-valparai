// Points Service - Client-side gamification system
import {
	doc,
	getDoc,
	setDoc,
	updateDoc,
	arrayUnion,
	serverTimestamp,
	increment,
} from "firebase/firestore";
import { db } from "../api/firebaseConfig";
import { COLLECTIONS, POINTS_CONFIG } from "../utils/constants";
import {
	calculatePoints,
	getBadgeForPoints,
	checkNewBadge,
} from "../utils/pointsCalculator";

/**
 * Award points to a user
 * @param {string} userId - User ID
 * @param {string} action - Action type
 * @param {Object} metadata - Additional metadata
 * @returns {Promise<Object>} - Result with new points and badge info
 */
export const awardPoints = async (userId, action, metadata = {}) => {
	try {
		const points = calculatePoints(action);

		if (points === 0) {
			return { success: true, pointsAwarded: 0 };
		}

		// Get current user data
		const userRef = doc(db, COLLECTIONS.USERS, userId);
		const userDoc = await getDoc(userRef);

		if (!userDoc.exists()) {
			throw new Error("User not found");
		}

		const userData = userDoc.data();
		const oldPoints = userData.totalPoints || 0;
		const newPoints = oldPoints + points;

		// Check for new badge
		const newBadge = checkNewBadge(oldPoints, newPoints);

		// Update user document
		const updates = {
			totalPoints: newPoints,
			points: increment(points),
			updatedAt: serverTimestamp(),
		};

		if (newBadge) {
			updates.badges = arrayUnion(newBadge.id);
			updates.currentBadge = newBadge.id;
		}

		await updateDoc(userRef, updates);

		// Update points history
		const pointsRef = doc(db, COLLECTIONS.POINTS, userId);
		const pointsDoc = await getDoc(pointsRef);

		const pointEntry = {
			action,
			points,
			timestamp: Date.now(),
			metadata,
		};

		if (pointsDoc.exists()) {
			await updateDoc(pointsRef, {
				totalPoints: newPoints,
				history: arrayUnion(pointEntry),
				lastUpdated: serverTimestamp(),
			});
		} else {
			await setDoc(pointsRef, {
				userId,
				totalPoints: newPoints,
				weeklyPoints: points,
				monthlyPoints: points,
				history: [pointEntry],
				lastUpdated: serverTimestamp(),
			});
		}

		return {
			success: true,
			pointsAwarded: points,
			newTotalPoints: newPoints,
			newBadge,
		};
	} catch (error) {
		console.error("Award points error:", error);
		return { success: false, error: error.message };
	}
};

/**
 * Get user points
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Points data
 */
export const getUserPoints = async (userId) => {
	try {
		const pointsRef = doc(db, COLLECTIONS.POINTS, userId);
		const pointsDoc = await getDoc(pointsRef);

		if (pointsDoc.exists()) {
			return { success: true, data: pointsDoc.data() };
		}

		return { success: true, data: { totalPoints: 0, history: [] } };
	} catch (error) {
		console.error("Get points error:", error);
		return { success: false, error: error.message };
	}
};

/**
 * Get user badges
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - User badges
 */
export const getUserBadges = async (userId) => {
	try {
		const userRef = doc(db, COLLECTIONS.USERS, userId);
		const userDoc = await getDoc(userRef);

		if (userDoc.exists()) {
			const userData = userDoc.data();
			return {
				success: true,
				badges: userData.badges || [],
				currentBadge: userData.currentBadge || "newcomer",
				totalPoints: userData.totalPoints || 0,
			};
		}

		return { success: false, error: "User not found" };
	} catch (error) {
		console.error("Get badges error:", error);
		return { success: false, error: error.message };
	}
};

/**
 * Get current badge for user
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Current badge
 */
export const getCurrentBadge = async (userId) => {
	try {
		const userRef = doc(db, COLLECTIONS.USERS, userId);
		const userDoc = await getDoc(userRef);

		if (userDoc.exists()) {
			const userData = userDoc.data();
			const totalPoints = userData.totalPoints || 0;
			const badge = getBadgeForPoints(totalPoints);

			return { success: true, badge, totalPoints };
		}

		return { success: false, error: "User not found" };
	} catch (error) {
		console.error("Get current badge error:", error);
		return { success: false, error: error.message };
	}
};

/**
 * Award bonus points (e.g., for weekly top performers)
 * @param {string} userId - User ID
 * @param {number} points - Bonus points
 * @param {string} reason - Reason for bonus
 * @returns {Promise<Object>} - Result
 */
export const awardBonusPoints = async (userId, points, reason) => {
	try {
		const userRef = doc(db, COLLECTIONS.USERS, userId);
		const pointsRef = doc(db, COLLECTIONS.POINTS, userId);

		// Update user total
		await updateDoc(userRef, {
			totalPoints: increment(points),
			points: increment(points),
			updatedAt: serverTimestamp(),
		});

		// Update points history
		const pointEntry = {
			action: "bonus",
			points,
			timestamp: Date.now(),
			metadata: { reason },
		};

		await updateDoc(pointsRef, {
			totalPoints: increment(points),
			history: arrayUnion(pointEntry),
			lastUpdated: serverTimestamp(),
		});

		return { success: true, pointsAwarded: points };
	} catch (error) {
		console.error("Award bonus points error:", error);
		return { success: false, error: error.message };
	}
};

export default {
	awardPoints,
	getUserPoints,
	getUserBadges,
	getCurrentBadge,
	awardBonusPoints,
};
