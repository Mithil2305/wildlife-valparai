// authService.js - High-level authentication business logic
import {
	registerUser as registerUserApi,
	loginUser as loginUserApi,
	signInWithGoogle as signInWithGoogleApi,
	logoutUser as logoutUserApi,
	resetPassword as resetPasswordApi,
	updateUserProfile as updateUserProfileApi,
	getUserData as getUserDataApi,
	isAdmin as isAdminApi,
	isCreator as isCreatorApi,
} from "../api/authApi";
import { trackEvent } from "./analyticsService";
import { USER_ROLES } from "../utils/constants";

// Register new user with validation and analytics
export const registerUser = async (email, password, displayName) => {
	try {
		// Basic validation
		if (!email || !password || !displayName) {
			throw new Error("All fields are required");
		}

		if (password.length < 6) {
			throw new Error("Password must be at least 6 characters");
		}

		// Register user
		const userCredential = await registerUserApi(email, password, displayName);

		// Track registration
		trackEvent("user_registered", {
			method: "email",
			userId: userCredential.user.uid,
		});

		return userCredential;
	} catch (error) {
		console.error("Error in registerUser service:", error);
		throw error;
	}
};

// Login user with analytics
export const loginUser = async (email, password) => {
	try {
		if (!email || !password) {
			throw new Error("Email and password are required");
		}

		const userCredential = await loginUserApi(email, password);

		// Track login
		trackEvent("user_logged_in", {
			method: "email",
			userId: userCredential.user.uid,
		});

		return userCredential;
	} catch (error) {
		console.error("Error in loginUser service:", error);
		throw error;
	}
};

// Google Sign-In with analytics
export const signInWithGoogle = async () => {
	try {
		const userCredential = await signInWithGoogleApi();

		// Track login
		trackEvent("user_logged_in", {
			method: "google",
			userId: userCredential.user.uid,
		});

		return userCredential;
	} catch (error) {
		console.error("Error in signInWithGoogle service:", error);
		throw error;
	}
};

// Logout with analytics
export const logoutUser = async () => {
	try {
		await logoutUserApi();
		trackEvent("user_logged_out", {});
	} catch (error) {
		console.error("Error in logoutUser service:", error);
		throw error;
	}
};

// Reset password with validation
export const resetPassword = async (email) => {
	try {
		if (!email) {
			throw new Error("Email is required");
		}

		await resetPasswordApi(email);
		trackEvent("password_reset_requested", { email });
	} catch (error) {
		console.error("Error in resetPassword service:", error);
		throw error;
	}
};

// Update user profile with validation
export const updateUserProfile = async (userId, updates) => {
	try {
		if (!userId) {
			throw new Error("User ID is required");
		}

		await updateUserProfileApi(userId, updates);
		trackEvent("profile_updated", { userId });
	} catch (error) {
		console.error("Error in updateUserProfile service:", error);
		throw error;
	}
};

// Get user data with caching
export const getUserData = async (userId) => {
	try {
		if (!userId) {
			throw new Error("User ID is required");
		}

		return await getUserDataApi(userId);
	} catch (error) {
		console.error("Error in getUserData service:", error);
		throw error;
	}
};

// Check if user is admin
export const checkIsAdmin = async (userId) => {
	try {
		return await isAdminApi(userId);
	} catch (error) {
		console.error("Error in checkIsAdmin service:", error);
		return false;
	}
};

// Check if user is creator
export const checkIsCreator = async (userId) => {
	try {
		return await isCreatorApi(userId);
	} catch (error) {
		console.error("Error in checkIsCreator service:", error);
		return false;
	}
};

// Request creator role upgrade
export const requestCreatorRole = async (userId, reason) => {
	try {
		if (!userId || !reason) {
			throw new Error("User ID and reason are required");
		}

		// In a real app, this would create a request in Firestore
		// For now, just track the event
		trackEvent("creator_role_requested", { userId, reason });

		return {
			success: true,
			message:
				"Creator role request submitted. Admin will review your request.",
		};
	} catch (error) {
		console.error("Error in requestCreatorRole service:", error);
		throw error;
	}
};

// Get user role
export const getUserRole = async (userId) => {
	try {
		const userData = await getUserData(userId);
		return userData?.role || USER_ROLES.USER;
	} catch (error) {
		console.error("Error in getUserRole service:", error);
		return USER_ROLES.USER;
	}
};

export default {
	registerUser,
	loginUser,
	signInWithGoogle,
	logoutUser,
	resetPassword,
	updateUserProfile,
	getUserData,
	checkIsAdmin,
	checkIsCreator,
	requestCreatorRole,
	getUserRole,
};
