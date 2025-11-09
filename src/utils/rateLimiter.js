// Rate Limiter for Free Tier Optimization
import { RATE_LIMITS } from "./constants";

/**
 * Check if user has exceeded rate limit
 * @param {string} userId - User ID
 * @param {string} action - Action type (e.g., 'sighting', 'blog', 'comment')
 * @param {number} limit - Rate limit count
 * @param {number} windowMs - Time window in milliseconds (default: 24 hours)
 * @returns {Object} - {allowed: boolean, remaining: number, resetTime: Date}
 */
export const checkRateLimit = (
	userId,
	action,
	limit,
	windowMs = 24 * 60 * 60 * 1000
) => {
	const key = `rateLimit_${userId}_${action}`;
	const now = Date.now();

	// Get stored data from localStorage
	const storedData = localStorage.getItem(key);
	let data = storedData
		? JSON.parse(storedData)
		: { count: 0, resetTime: now + windowMs };

	// Reset if time window has passed
	if (now >= data.resetTime) {
		data = { count: 0, resetTime: now + windowMs };
	}

	// Check if limit exceeded
	const allowed = data.count < limit;
	const remaining = Math.max(0, limit - data.count);

	if (allowed) {
		data.count++;
		localStorage.setItem(key, JSON.stringify(data));
	}

	return {
		allowed,
		remaining,
		resetTime: new Date(data.resetTime),
		count: data.count,
	};
};

/**
 * Check sighting submission rate limit
 * @param {string} userId - User ID
 * @returns {Object} - Rate limit status
 */
export const checkSightingRateLimit = (userId) => {
	return checkRateLimit(userId, "sighting", RATE_LIMITS.SIGHTINGS_PER_DAY);
};

/**
 * Check blog submission rate limit
 * @param {string} userId - User ID
 * @returns {Object} - Rate limit status
 */
export const checkBlogRateLimit = (userId) => {
	return checkRateLimit(userId, "blog", RATE_LIMITS.BLOGS_PER_DAY);
};

/**
 * Check comment rate limit (per hour)
 * @param {string} userId - User ID
 * @returns {Object} - Rate limit status
 */
export const checkCommentRateLimit = (userId) => {
	return checkRateLimit(
		userId,
		"comment",
		RATE_LIMITS.COMMENTS_PER_HOUR,
		60 * 60 * 1000
	);
};

/**
 * Check upload rate limit
 * @param {string} userId - User ID
 * @returns {Object} - Rate limit status
 */
export const checkUploadRateLimit = (userId) => {
	return checkRateLimit(userId, "upload", RATE_LIMITS.UPLOADS_PER_DAY);
};

/**
 * Get all rate limit statuses for a user
 * @param {string} userId - User ID
 * @returns {Object} - All rate limit statuses
 */
export const getAllRateLimits = (userId) => {
	return {
		sightings: checkSightingRateLimit(userId),
		blogs: checkBlogRateLimit(userId),
		comments: checkCommentRateLimit(userId),
		uploads: checkUploadRateLimit(userId),
	};
};

/**
 * Reset rate limit for a specific action
 * @param {string} userId - User ID
 * @param {string} action - Action type
 */
export const resetRateLimit = (userId, action) => {
	const key = `rateLimit_${userId}_${action}`;
	localStorage.removeItem(key);
};

/**
 * Reset all rate limits for a user
 * @param {string} userId - User ID
 */
export const resetAllRateLimits = (userId) => {
	const actions = ["sighting", "blog", "comment", "upload"];
	actions.forEach((action) => resetRateLimit(userId, action));
};

/**
 * Get time until rate limit reset
 * @param {string} userId - User ID
 * @param {string} action - Action type
 * @returns {number} - Milliseconds until reset
 */
export const getTimeUntilReset = (userId, action) => {
	const key = `rateLimit_${userId}_${action}`;
	const storedData = localStorage.getItem(key);

	if (!storedData) return 0;

	const data = JSON.parse(storedData);
	const now = Date.now();
	return Math.max(0, data.resetTime - now);
};

/**
 * Format time until reset as human-readable string
 * @param {number} ms - Milliseconds
 * @returns {string} - Formatted time
 */
export const formatTimeUntilReset = (ms) => {
	const hours = Math.floor(ms / (60 * 60 * 1000));
	const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));

	if (hours > 0) {
		return `${hours}h ${minutes}m`;
	}
	return `${minutes}m`;
};

/**
 * Throttle function execution
 * @param {Function} func - Function to throttle
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} - Throttled function
 */
export const throttle = (func, delay) => {
	let lastCall = 0;
	return function (...args) {
		const now = Date.now();
		if (now - lastCall >= delay) {
			lastCall = now;
			return func(...args);
		}
	};
};

/**
 * Debounce function execution
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} - Debounced function
 */
export const debounce = (func, delay) => {
	let timeoutId;
	return function (...args) {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => func(...args), delay);
	};
};

export default {
	checkRateLimit,
	checkSightingRateLimit,
	checkBlogRateLimit,
	checkCommentRateLimit,
	checkUploadRateLimit,
	getAllRateLimits,
	resetRateLimit,
	resetAllRateLimits,
	getTimeUntilReset,
	formatTimeUntilReset,
	throttle,
	debounce,
};
