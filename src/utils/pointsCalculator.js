// Points Calculator for Gamification System
import { POINTS_CONFIG, BADGES } from "./constants";

/**
 * Calculate points for a specific action
 * @param {string} action - Action type
 * @returns {number} - Points earned
 */
export const calculatePoints = (action) => {
	switch (action) {
		case "sighting_submit":
			return POINTS_CONFIG.SIGHTING_SUBMIT;
		case "blog_publish":
			return POINTS_CONFIG.BLOG_PUBLISH;
		case "photo_audio_upload":
			return POINTS_CONFIG.PHOTO_AUDIO_UPLOAD;
		case "comment":
			return POINTS_CONFIG.COMMENT;
		case "like_received":
			return POINTS_CONFIG.LIKE_RECEIVED;
		case "share":
			return POINTS_CONFIG.SHARE;
		case "first_post_bonus":
			return POINTS_CONFIG.FIRST_POST_BONUS;
		case "daily_login":
			return POINTS_CONFIG.DAILY_LOGIN;
		case "weekly_top_10":
			return POINTS_CONFIG.WEEKLY_TOP_10;
		default:
			return 0;
	}
};

/**
 * Calculate total points from user activity
 * @param {Object} userActivity - User activity object
 * @returns {number} - Total points
 */
export const calculateTotalPoints = (userActivity) => {
	let total = 0;

	if (userActivity.sightings) {
		total += userActivity.sightings * POINTS_CONFIG.SIGHTING_SUBMIT;
	}
	if (userActivity.blogs) {
		total += userActivity.blogs * POINTS_CONFIG.BLOG_PUBLISH;
	}
	if (userActivity.photoAudios) {
		total += userActivity.photoAudios * POINTS_CONFIG.PHOTO_AUDIO_UPLOAD;
	}
	if (userActivity.comments) {
		total += userActivity.comments * POINTS_CONFIG.COMMENT;
	}
	if (userActivity.likesReceived) {
		total += userActivity.likesReceived * POINTS_CONFIG.LIKE_RECEIVED;
	}
	if (userActivity.shares) {
		total += userActivity.shares * POINTS_CONFIG.SHARE;
	}
	if (userActivity.firstPostBonus) {
		total += POINTS_CONFIG.FIRST_POST_BONUS;
	}
	if (userActivity.dailyLogins) {
		total += userActivity.dailyLogins * POINTS_CONFIG.DAILY_LOGIN;
	}
	if (userActivity.weeklyTop10Count) {
		total += userActivity.weeklyTop10Count * POINTS_CONFIG.WEEKLY_TOP_10;
	}

	return total;
};

/**
 * Get badge based on total points
 * @param {number} totalPoints - Total points
 * @returns {Object} - Badge object
 */
export const getBadgeForPoints = (totalPoints) => {
	if (totalPoints >= BADGES.GUARDIAN.points) {
		return BADGES.GUARDIAN;
	} else if (totalPoints >= BADGES.EXPERT.points) {
		return BADGES.EXPERT;
	} else if (totalPoints >= BADGES.CONTRIBUTOR.points) {
		return BADGES.CONTRIBUTOR;
	} else if (totalPoints >= BADGES.OBSERVER.points) {
		return BADGES.OBSERVER;
	} else {
		return BADGES.NEWCOMER;
	}
};

/**
 * Get all unlocked badges
 * @param {number} totalPoints - Total points
 * @returns {Array} - Array of unlocked badges
 */
export const getUnlockedBadges = (totalPoints) => {
	const badges = [];

	if (totalPoints >= BADGES.NEWCOMER.points) {
		badges.push(BADGES.NEWCOMER);
	}
	if (totalPoints >= BADGES.OBSERVER.points) {
		badges.push(BADGES.OBSERVER);
	}
	if (totalPoints >= BADGES.CONTRIBUTOR.points) {
		badges.push(BADGES.CONTRIBUTOR);
	}
	if (totalPoints >= BADGES.EXPERT.points) {
		badges.push(BADGES.EXPERT);
	}
	if (totalPoints >= BADGES.GUARDIAN.points) {
		badges.push(BADGES.GUARDIAN);
	}

	return badges;
};

/**
 * Get next badge and points needed
 * @param {number} totalPoints - Total points
 * @returns {Object} - Next badge info
 */
export const getNextBadge = (totalPoints) => {
	const badgeList = Object.values(BADGES).sort((a, b) => a.points - b.points);

	for (const badge of badgeList) {
		if (totalPoints < badge.points) {
			return {
				badge,
				pointsNeeded: badge.points - totalPoints,
				progress: (totalPoints / badge.points) * 100,
			};
		}
	}

	return {
		badge: BADGES.GUARDIAN,
		pointsNeeded: 0,
		progress: 100,
	};
};

/**
 * Calculate progress percentage to next badge
 * @param {number} totalPoints - Total points
 * @returns {number} - Progress percentage (0-100)
 */
export const calculateBadgeProgress = (totalPoints) => {
	const nextBadgeInfo = getNextBadge(totalPoints);
	return nextBadgeInfo.progress;
};

/**
 * Check if user has earned a new badge
 * @param {number} oldPoints - Old total points
 * @param {number} newPoints - New total points
 * @returns {Object|null} - New badge or null
 */
export const checkNewBadge = (oldPoints, newPoints) => {
	const oldBadge = getBadgeForPoints(oldPoints);
	const newBadge = getBadgeForPoints(newPoints);

	if (oldBadge.id !== newBadge.id) {
		return newBadge;
	}

	return null;
};

/**
 * Calculate leaderboard ranking
 * @param {Array} users - Array of users with points
 * @param {string} userId - Current user ID
 * @returns {Object} - Ranking info
 */
export const calculateRanking = (users, userId) => {
	const sortedUsers = users.sort((a, b) => b.totalPoints - a.totalPoints);
	const rank = sortedUsers.findIndex((user) => user.id === userId) + 1;
	const total = sortedUsers.length;

	return {
		rank,
		total,
		percentile: ((total - rank) / total) * 100,
	};
};

/**
 * Get points breakdown
 * @param {Object} userActivity - User activity object
 * @returns {Array} - Points breakdown
 */
export const getPointsBreakdown = (userActivity) => {
	const breakdown = [];

	if (userActivity.sightings > 0) {
		breakdown.push({
			action: "Sightings",
			count: userActivity.sightings,
			pointsPerAction: POINTS_CONFIG.SIGHTING_SUBMIT,
			total: userActivity.sightings * POINTS_CONFIG.SIGHTING_SUBMIT,
		});
	}

	if (userActivity.blogs > 0) {
		breakdown.push({
			action: "Blogs",
			count: userActivity.blogs,
			pointsPerAction: POINTS_CONFIG.BLOG_PUBLISH,
			total: userActivity.blogs * POINTS_CONFIG.BLOG_PUBLISH,
		});
	}

	if (userActivity.photoAudios > 0) {
		breakdown.push({
			action: "Photo/Audio Posts",
			count: userActivity.photoAudios,
			pointsPerAction: POINTS_CONFIG.PHOTO_AUDIO_UPLOAD,
			total: userActivity.photoAudios * POINTS_CONFIG.PHOTO_AUDIO_UPLOAD,
		});
	}

	if (userActivity.comments > 0) {
		breakdown.push({
			action: "Comments",
			count: userActivity.comments,
			pointsPerAction: POINTS_CONFIG.COMMENT,
			total: userActivity.comments * POINTS_CONFIG.COMMENT,
		});
	}

	if (userActivity.likesReceived > 0) {
		breakdown.push({
			action: "Likes Received",
			count: userActivity.likesReceived,
			pointsPerAction: POINTS_CONFIG.LIKE_RECEIVED,
			total: userActivity.likesReceived * POINTS_CONFIG.LIKE_RECEIVED,
		});
	}

	return breakdown;
};

/**
 * Calculate weekly points
 * @param {Array} pointsHistory - Points history array
 * @returns {number} - Weekly points
 */
export const calculateWeeklyPoints = (pointsHistory) => {
	const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
	return pointsHistory
		.filter((entry) => entry.timestamp >= oneWeekAgo)
		.reduce((sum, entry) => sum + entry.points, 0);
};

/**
 * Calculate monthly points
 * @param {Array} pointsHistory - Points history array
 * @returns {number} - Monthly points
 */
export const calculateMonthlyPoints = (pointsHistory) => {
	const oneMonthAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
	return pointsHistory
		.filter((entry) => entry.timestamp >= oneMonthAgo)
		.reduce((sum, entry) => sum + entry.points, 0);
};

export default {
	calculatePoints,
	calculateTotalPoints,
	getBadgeForPoints,
	getUnlockedBadges,
	getNextBadge,
	calculateBadgeProgress,
	checkNewBadge,
	calculateRanking,
	getPointsBreakdown,
	calculateWeeklyPoints,
	calculateMonthlyPoints,
};
