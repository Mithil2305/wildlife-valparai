// Constants for Wildlife Valparai Platform

// User Roles
export const USER_ROLES = {
	USER: "user",
	CREATOR: "creator",
	ADMIN: "admin",
};

// Content Types
export const CONTENT_TYPES = {
	SIGHTING: "sighting",
	BLOG: "blog",
	PHOTO_AUDIO: "photo_audio",
};

// Moderation Status
export const MODERATION_STATUS = {
	PENDING: "pending",
	APPROVED: "approved",
	REJECTED: "rejected",
	FLAGGED: "flagged",
};

// Points System
export const POINTS_CONFIG = {
	SIGHTING_SUBMIT: 10,
	BLOG_PUBLISH: 25,
	PHOTO_AUDIO_UPLOAD: 15,
	COMMENT: 2,
	LIKE_RECEIVED: 1,
	SHARE: 3,
	FIRST_POST_BONUS: 50,
	DAILY_LOGIN: 5,
	WEEKLY_TOP_10: 100,
};

// Badges
export const BADGES = {
	NEWCOMER: { id: "newcomer", name: "Newcomer", points: 0 },
	OBSERVER: { id: "observer", name: "Observer", points: 100 },
	CONTRIBUTOR: { id: "contributor", name: "Contributor", points: 500 },
	EXPERT: { id: "expert", name: "Expert", points: 1000 },
	GUARDIAN: { id: "guardian", name: "Guardian", points: 5000 },
};

// Rate Limiting (Free Tier Optimization)
export const RATE_LIMITS = {
	SIGHTINGS_PER_DAY: 5,
	BLOGS_PER_DAY: 3,
	COMMENTS_PER_HOUR: 10,
	UPLOADS_PER_DAY: 5,
	MAX_IMAGE_SIZE_MB: 1,
	MAX_AUDIO_SIZE_MB: 2,
	MAX_AUDIO_DURATION_SECONDS: 60,
};

// Storage Limits
export const STORAGE_LIMITS = {
	MAX_IMAGE_SIZE: 1024 * 1024, // 1 MB
	MAX_AUDIO_SIZE: 2 * 1024 * 1024, // 2 MB
	COMPRESSED_IMAGE_SIZE: 500 * 1024, // 500 KB target
	IMAGE_QUALITY: 0.8,
	AUDIO_BITRATE: 64, // kbps
};

// Pagination
export const PAGINATION = {
	POSTS_PER_PAGE: 10,
	COMMENTS_PER_PAGE: 20,
	LEADERBOARD_SIZE: 50,
	NOTIFICATIONS_PER_PAGE: 15,
};

// Collection Names
export const COLLECTIONS = {
	USERS: "users",
	SIGHTINGS: "sightings",
	BLOGS: "blogs",
	COMMENTS: "comments",
	POINTS: "points",
	BADGES: "badges",
	NOTIFICATIONS: "notifications",
	ANALYTICS: "analytics",
	MODERATION_QUEUE: "moderation_queue",
	LEADERBOARD: "leaderboard",
	PAYMENTS: "payments",
};

// Error Messages
export const ERROR_MESSAGES = {
	RATE_LIMIT_EXCEEDED:
		"You have exceeded the daily limit. Please try again tomorrow.",
	FILE_TOO_LARGE: "File size exceeds the maximum allowed size.",
	UNAUTHORIZED: "You are not authorized to perform this action.",
	INVALID_FILE_TYPE:
		"Invalid file type. Please upload a valid image or audio file.",
	NETWORK_ERROR: "Network error. Please check your connection and try again.",
	MODERATION_PENDING: "Your content is pending moderation.",
};

// Supported Languages
export const LANGUAGES = {
	EN: { code: "en", name: "English" },
	TA: { code: "ta", name: "தமிழ்" },
	HI: { code: "hi", name: "हिंदी" },
};

// Payment Config
export const PAYMENT_CONFIG = {
	RAZORPAY_KEY_ID: import.meta.env.VITE_RAZORPAY_KEY_ID,
	MIN_DONATION_AMOUNT: 10, // INR
	CURRENCY: "INR",
};

// Analytics Events
export const ANALYTICS_EVENTS = {
	PAGE_VIEW: "page_view",
	SIGN_UP: "sign_up",
	LOGIN: "login",
	CONTENT_SUBMIT: "content_submit",
	CONTENT_APPROVED: "content_approved",
	DONATION: "donation",
	POINTS_EARNED: "points_earned",
	BADGE_UNLOCKED: "badge_unlocked",
};

// Firebase Query Limits (Free Tier Optimization)
export const QUERY_LIMITS = {
	MAX_RESULTS: 50,
	CACHE_DURATION: 3600000, // 1 hour in ms
};

export default {
	USER_ROLES,
	CONTENT_TYPES,
	MODERATION_STATUS,
	POINTS_CONFIG,
	BADGES,
	RATE_LIMITS,
	STORAGE_LIMITS,
	PAGINATION,
	COLLECTIONS,
	ERROR_MESSAGES,
	LANGUAGES,
	PAYMENT_CONFIG,
	ANALYTICS_EVENTS,
	QUERY_LIMITS,
};
