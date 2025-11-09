// Date Formatting Utilities
import {
	format,
	formatDistance,
	formatRelative,
	isToday,
	isYesterday,
	parseISO,
} from "date-fns";

/**
 * Format date to readable string
 * @param {Date|string|number} date - Date to format
 * @param {string} formatStr - Format string (default: 'PPP')
 * @returns {string} - Formatted date
 */
export const formatDate = (date, formatStr = "PPP") => {
	try {
		const dateObj = typeof date === "string" ? parseISO(date) : new Date(date);
		return format(dateObj, formatStr);
	} catch {
		return "Invalid date";
	}
};

/**
 * Format date and time
 * @param {Date|string|number} date - Date to format
 * @returns {string} - Formatted date and time
 */
export const formatDateTime = (date) => {
	return formatDate(date, "PPP p");
};

/**
 * Format date as relative time (e.g., "2 hours ago")
 * @param {Date|string|number} date - Date to format
 * @returns {string} - Relative time string
 */
export const formatRelativeTime = (date) => {
	try {
		const dateObj = typeof date === "string" ? parseISO(date) : new Date(date);
		return formatDistance(dateObj, new Date(), { addSuffix: true });
	} catch {
		return "Invalid date";
	}
};

/**
 * Format date with context (e.g., "Today at 3:24 PM", "Yesterday at 5:00 PM")
 * @param {Date|string|number} date - Date to format
 * @returns {string} - Formatted date with context
 */
export const formatDateWithContext = (date) => {
	try {
		const dateObj = typeof date === "string" ? parseISO(date) : new Date(date);

		if (isToday(dateObj)) {
			return `Today at ${format(dateObj, "p")}`;
		}

		if (isYesterday(dateObj)) {
			return `Yesterday at ${format(dateObj, "p")}`;
		}

		return formatRelative(dateObj, new Date());
	} catch {
		return "Invalid date";
	}
};

/**
 * Format date for display in short format
 * @param {Date|string|number} date - Date to format
 * @returns {string} - Short date format
 */
export const formatShortDate = (date) => {
	return formatDate(date, "PP");
};

/**
 * Format time only
 * @param {Date|string|number} date - Date to format
 * @returns {string} - Time string
 */
export const formatTime = (date) => {
	return formatDate(date, "p");
};

/**
 * Format date for input fields (YYYY-MM-DD)
 * @param {Date|string|number} date - Date to format
 * @returns {string} - Date in YYYY-MM-DD format
 */
export const formatInputDate = (date) => {
	return formatDate(date, "yyyy-MM-dd");
};

/**
 * Format month and year
 * @param {Date|string|number} date - Date to format
 * @returns {string} - Month and year
 */
export const formatMonthYear = (date) => {
	return formatDate(date, "MMMM yyyy");
};

/**
 * Get timestamp from date
 * @param {Date|string} date - Date object or string
 * @returns {number} - Timestamp in milliseconds
 */
export const getTimestamp = (date) => {
	const dateObj = typeof date === "string" ? parseISO(date) : new Date(date);
	return dateObj.getTime();
};

/**
 * Check if date is within last N days
 * @param {Date|string|number} date - Date to check
 * @param {number} days - Number of days
 * @returns {boolean} - True if within range
 */
export const isWithinDays = (date, days) => {
	const dateObj = typeof date === "string" ? parseISO(date) : new Date(date);
	const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
	return dateObj.getTime() >= cutoff;
};

/**
 * Format duration in seconds to readable string
 * @param {number} seconds - Duration in seconds
 * @returns {string} - Formatted duration
 */
export const formatDuration = (seconds) => {
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = Math.floor(seconds % 60);

	if (minutes === 0) {
		return `${remainingSeconds}s`;
	}

	return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

/**
 * Get start of day timestamp
 * @param {Date|string|number} date - Date
 * @returns {number} - Start of day timestamp
 */
export const getStartOfDay = (date) => {
	const dateObj = typeof date === "string" ? parseISO(date) : new Date(date);
	dateObj.setHours(0, 0, 0, 0);
	return dateObj.getTime();
};

/**
 * Get end of day timestamp
 * @param {Date|string|number} date - Date
 * @returns {number} - End of day timestamp
 */
export const getEndOfDay = (date) => {
	const dateObj = typeof date === "string" ? parseISO(date) : new Date(date);
	dateObj.setHours(23, 59, 59, 999);
	return dateObj.getTime();
};

export default {
	formatDate,
	formatDateTime,
	formatRelativeTime,
	formatDateWithContext,
	formatShortDate,
	formatTime,
	formatInputDate,
	formatMonthYear,
	getTimestamp,
	isWithinDays,
	formatDuration,
	getStartOfDay,
	getEndOfDay,
};
