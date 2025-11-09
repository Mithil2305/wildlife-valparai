// Analytics Service - Client-side usage tracking
import {
	doc,
	setDoc,
	getDoc,
	updateDoc,
	increment,
	serverTimestamp,
	collection,
	query,
	where,
	getDocs,
	orderBy,
	limit,
} from "firebase/firestore";
import { db, analytics } from "../api/firebaseConfig";
import { COLLECTIONS, ANALYTICS_EVENTS } from "../utils/constants";
import { logEvent } from "firebase/analytics";

/**
 * Track page view
 * @param {string} pageName - Page name
 * @param {string} userId - User ID (optional)
 */
export const trackPageView = async (pageName, userId = null) => {
	try {
		// Firebase Analytics (free)
		if (analytics) {
			logEvent(analytics, ANALYTICS_EVENTS.PAGE_VIEW, {
				page_name: pageName,
				user_id: userId,
			});
		}

		// Store aggregated data in Firestore
		const dateKey = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
		const analyticsRef = doc(db, COLLECTIONS.ANALYTICS, `pageviews_${dateKey}`);

		const analyticsDoc = await getDoc(analyticsRef);

		if (analyticsDoc.exists()) {
			await updateDoc(analyticsRef, {
				[`pages.${pageName}`]: increment(1),
				totalViews: increment(1),
				lastUpdated: serverTimestamp(),
			});
		} else {
			await setDoc(analyticsRef, {
				date: dateKey,
				pages: {
					[pageName]: 1,
				},
				totalViews: 1,
				createdAt: serverTimestamp(),
				lastUpdated: serverTimestamp(),
			});
		}
	} catch (error) {
		console.error("Track page view error:", error);
	}
};

/**
 * Track user action
 * @param {string} eventName - Event name
 * @param {Object} properties - Event properties
 */
export const trackEvent = async (eventName, properties = {}) => {
	try {
		if (analytics) {
			logEvent(analytics, eventName, properties);
		}
	} catch (error) {
		console.error("Track event error:", error);
	}
};

/**
 * Track content submission
 * @param {string} contentType - Type of content (sighting, blog, etc.)
 * @param {string} userId - User ID
 */
export const trackContentSubmission = async (contentType, userId) => {
	try {
		await trackEvent(ANALYTICS_EVENTS.CONTENT_SUBMIT, {
			content_type: contentType,
			user_id: userId,
		});

		// Update user stats
		const userRef = doc(db, COLLECTIONS.USERS, userId);
		await updateDoc(userRef, {
			[`stats.${contentType}Count`]: increment(1),
			[`stats.totalSubmissions`]: increment(1),
		});
	} catch (error) {
		console.error("Track content submission error:", error);
	}
};

/**
 * Track user engagement (likes, comments, shares)
 * @param {string} engagementType - Type of engagement
 * @param {string} contentId - Content ID
 * @param {string} userId - User ID
 */
export const trackEngagement = async (engagementType, contentId, userId) => {
	try {
		await trackEvent("engagement", {
			engagement_type: engagementType,
			content_id: contentId,
			user_id: userId,
		});
	} catch (error) {
		console.error("Track engagement error:", error);
	}
};

/**
 * Get analytics summary
 * @param {string} dateKey - Date key (YYYY-MM-DD)
 * @returns {Promise<Object>} - Analytics data
 */
export const getAnalyticsSummary = async (dateKey) => {
	try {
		const analyticsRef = doc(db, COLLECTIONS.ANALYTICS, `pageviews_${dateKey}`);
		const analyticsDoc = await getDoc(analyticsRef);

		if (analyticsDoc.exists()) {
			return { success: true, data: analyticsDoc.data() };
		}

		return { success: false, error: "No data for this date" };
	} catch (error) {
		console.error("Get analytics summary error:", error);
		return { success: false, error: error.message };
	}
};

/**
 * Get user activity stats
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - User stats
 */
export const getUserActivityStats = async (userId) => {
	try {
		const userRef = doc(db, COLLECTIONS.USERS, userId);
		const userDoc = await getDoc(userRef);

		if (userDoc.exists()) {
			const userData = userDoc.data();
			return {
				success: true,
				stats: userData.stats || {},
			};
		}

		return { success: false, error: "User not found" };
	} catch (error) {
		console.error("Get user activity stats error:", error);
		return { success: false, error: error.message };
	}
};

/**
 * Get top content
 * @param {string} contentType - Type of content (sightings, blogs)
 * @param {number} limitCount - Number of items to return
 * @returns {Promise<Array>} - Top content items
 */
export const getTopContent = async (contentType, limitCount = 10) => {
	try {
		const contentRef = collection(db, contentType);
		const q = query(
			contentRef,
			where("status", "==", "approved"),
			orderBy("likes", "desc"),
			limit(limitCount)
		);

		const snapshot = await getDocs(q);
		const items = [];

		snapshot.forEach((doc) => {
			items.push({ id: doc.id, ...doc.data() });
		});

		return { success: true, data: items };
	} catch (error) {
		console.error("Get top content error:", error);
		return { success: false, error: error.message };
	}
};

/**
 * Track user sign up
 * @param {string} userId - User ID
 * @param {string} method - Sign up method (email, google)
 */
export const trackSignUp = async (userId, method) => {
	try {
		await trackEvent(ANALYTICS_EVENTS.SIGN_UP, {
			user_id: userId,
			method,
		});
	} catch (error) {
		console.error("Track sign up error:", error);
	}
};

/**
 * Track donation
 * @param {string} userId - User ID
 * @param {number} amount - Donation amount
 */
export const trackDonation = async (userId, amount) => {
	try {
		await trackEvent(ANALYTICS_EVENTS.DONATION, {
			user_id: userId,
			amount,
			currency: "INR",
		});
	} catch (error) {
		console.error("Track donation error:", error);
	}
};

export default {
	trackPageView,
	trackEvent,
	trackContentSubmission,
	trackEngagement,
	getAnalyticsSummary,
	getUserActivityStats,
	getTopContent,
	trackSignUp,
	trackDonation,
};
