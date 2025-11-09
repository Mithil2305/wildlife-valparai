// Validators for form inputs and data validation

// Email validation
export const validateEmail = (email) => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
};

// Password validation (min 8 chars, 1 uppercase, 1 lowercase, 1 number)
export const validatePassword = (password) => {
	if (password.length < 8) {
		return {
			valid: false,
			message: "Password must be at least 8 characters long",
		};
	}
	if (!/[A-Z]/.test(password)) {
		return {
			valid: false,
			message: "Password must contain at least one uppercase letter",
		};
	}
	if (!/[a-z]/.test(password)) {
		return {
			valid: false,
			message: "Password must contain at least one lowercase letter",
		};
	}
	if (!/[0-9]/.test(password)) {
		return {
			valid: false,
			message: "Password must contain at least one number",
		};
	}
	return { valid: true };
};

// Username validation (alphanumeric, 3-20 chars)
export const validateUsername = (username) => {
	const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
	if (!usernameRegex.test(username)) {
		return {
			valid: false,
			message:
				"Username must be 3-20 characters and contain only letters, numbers, and underscores",
		};
	}
	return { valid: true };
};

// File size validation
export const validateFileSize = (file, maxSizeMB) => {
	const maxSizeBytes = maxSizeMB * 1024 * 1024;
	if (file.size > maxSizeBytes) {
		return {
			valid: false,
			message: `File size must be less than ${maxSizeMB}MB`,
		};
	}
	return { valid: true };
};

// Image file validation
export const validateImageFile = (file) => {
	const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
	if (!allowedTypes.includes(file.type)) {
		return {
			valid: false,
			message: "Only JPEG, PNG, and WebP images are allowed",
		};
	}
	return { valid: true };
};

// Audio file validation
export const validateAudioFile = (file) => {
	const allowedTypes = [
		"audio/mpeg",
		"audio/mp3",
		"audio/wav",
		"audio/ogg",
		"audio/webm",
	];
	if (!allowedTypes.includes(file.type)) {
		return {
			valid: false,
			message: "Only MP3, WAV, OGG, and WebM audio files are allowed",
		};
	}
	return { valid: true };
};

// Audio duration validation
export const validateAudioDuration = (duration, maxDuration = 60) => {
	if (duration > maxDuration) {
		return {
			valid: false,
			message: `Audio duration must be less than ${maxDuration} seconds`,
		};
	}
	return { valid: true };
};

// Text content validation
export const validateContent = (content, minLength = 10, maxLength = 5000) => {
	if (!content || content.trim().length < minLength) {
		return {
			valid: false,
			message: `Content must be at least ${minLength} characters long`,
		};
	}
	if (content.length > maxLength) {
		return {
			valid: false,
			message: `Content must be less than ${maxLength} characters`,
		};
	}
	return { valid: true };
};

// Title validation
export const validateTitle = (title, minLength = 5, maxLength = 200) => {
	if (!title || title.trim().length < minLength) {
		return {
			valid: false,
			message: `Title must be at least ${minLength} characters long`,
		};
	}
	if (title.length > maxLength) {
		return {
			valid: false,
			message: `Title must be less than ${maxLength} characters`,
		};
	}
	return { valid: true };
};

// Location validation (latitude and longitude)
export const validateLocation = (lat, lng) => {
	if (typeof lat !== "number" || typeof lng !== "number") {
		return { valid: false, message: "Invalid location coordinates" };
	}
	if (lat < -90 || lat > 90) {
		return { valid: false, message: "Latitude must be between -90 and 90" };
	}
	if (lng < -180 || lng > 180) {
		return { valid: false, message: "Longitude must be between -180 and 180" };
	}
	return { valid: true };
};

// URL validation
export const validateURL = (url) => {
	try {
		new URL(url);
		return { valid: true };
	} catch {
		return { valid: false, message: "Invalid URL format" };
	}
};

// Phone number validation (basic)
export const validatePhoneNumber = (phone) => {
	const phoneRegex =
		/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
	if (!phoneRegex.test(phone)) {
		return { valid: false, message: "Invalid phone number format" };
	}
	return { valid: true };
};

// Sanitize HTML to prevent XSS
export const sanitizeHTML = (html) => {
	const temp = document.createElement("div");
	temp.textContent = html;
	return temp.innerHTML;
};

// Check for profanity (basic word list)
const profanityList = ["badword1", "badword2"]; // Add actual words as needed
export const containsProfanity = (text) => {
	const lowerText = text.toLowerCase();
	return profanityList.some((word) => lowerText.includes(word));
};

// Validate date format
export const validateDate = (dateString) => {
	const date = new Date(dateString);
	if (isNaN(date.getTime())) {
		return { valid: false, message: "Invalid date format" };
	}
	return { valid: true };
};

// Validate donation amount
export const validateDonationAmount = (amount, minAmount = 10) => {
	if (typeof amount !== "number" || amount < minAmount) {
		return {
			valid: false,
			message: `Minimum donation amount is ${minAmount} INR`,
		};
	}
	return { valid: true };
};

export default {
	validateEmail,
	validatePassword,
	validateUsername,
	validateFileSize,
	validateImageFile,
	validateAudioFile,
	validateAudioDuration,
	validateContent,
	validateTitle,
	validateLocation,
	validateURL,
	validatePhoneNumber,
	sanitizeHTML,
	containsProfanity,
	validateDate,
	validateDonationAmount,
};
