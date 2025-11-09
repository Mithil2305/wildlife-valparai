// userService.js - User management and profile operations
import {
	collection,
	doc,
	getDoc,
	getDocs,
	updateDoc,
	query,
	where,
	orderBy,
	limit,
	serverTimestamp,
} from "firebase/firestore";
import { db } from "../api/firebaseConfig";
import { trackEvent } from "./analyticsService";
import { COLLECTIONS, USER_ROLES } from "../utils/constants";

// Get user profile by ID
export const getUserProfile = async (userId) => {
	try {
		const userRef = doc(db, COLLECTIONS.USERS, userId);
		const userSnap = await getDoc(userRef);

		if (userSnap.exists()) {
			return {
				id: userSnap.id,
				...userSnap.data(),
			};
		} else {
			throw new Error("User not found");
		}
	} catch (error) {
		console.error("Error getting user profile:", error);
		throw error;
	}
};

// Update user profile
export const updateUserProfile = async (userId, updates) => {
	try {
		const userRef = doc(db, COLLECTIONS.USERS, userId);

		const updateData = {
			...updates,
			updatedAt: serverTimestamp(),
		};

		await updateDoc(userRef, updateData);

		trackEvent("profile_updated", { userId });

		return true;
	} catch (error) {
		console.error("Error updating user profile:", error);
		throw error;
	}
};

// Get user statistics
export const getUserStats = async (userId) => {
	try {
		const userProfile = await getUserProfile(userId);

		return {
			totalPoints: userProfile.points || 0,
			currentBadge: userProfile.currentBadge || "Newcomer",
			totalSightings: userProfile.totalSightings || 0,
			totalBlogs: userProfile.totalBlogs || 0,
			totalPhotos: userProfile.totalPhotos || 0,
			totalAudios: userProfile.totalAudios || 0,
			totalComments: userProfile.totalComments || 0,
			totalDonationsReceived: userProfile.totalDonationsReceived || 0,
			totalDonationsGiven: userProfile.totalDonationsGiven || 0,
			joinedDate: userProfile.createdAt,
			lastActive: userProfile.lastActive,
		};
	} catch (error) {
		console.error("Error getting user stats:", error);
		throw error;
	}
};

// Get top users (leaderboard)
export const getTopUsers = async (limitCount = 10, orderByField = "points") => {
	try {
		const usersRef = collection(db, COLLECTIONS.USERS);
		const q = query(usersRef, orderBy(orderByField, "desc"), limit(limitCount));

		const snapshot = await getDocs(q);
		const users = snapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));

		return users;
	} catch (error) {
		console.error("Error getting top users:", error);
		throw error;
	}
};

// Get creators
export const getCreators = async (limitCount = 20) => {
	try {
		const usersRef = collection(db, COLLECTIONS.USERS);
		const q = query(
			usersRef,
			where("role", "in", [USER_ROLES.CREATOR, USER_ROLES.ADMIN]),
			orderBy("points", "desc"),
			limit(limitCount)
		);

		const snapshot = await getDocs(q);
		const creators = snapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));

		return creators;
	} catch (error) {
		console.error("Error getting creators:", error);
		throw error;
	}
};

// Search users by name or email
export const searchUsers = async (searchTerm, limitCount = 10) => {
	try {
		if (!searchTerm || searchTerm.trim() === "") {
			return [];
		}

		const usersRef = collection(db, COLLECTIONS.USERS);

		// Firestore doesn't support full-text search, so we'll do prefix matching
		const searchTermLower = searchTerm.toLowerCase();

		const snapshot = await getDocs(usersRef);
		const users = snapshot.docs
			.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}))
			.filter((user) => {
				const displayName = (user.displayName || "").toLowerCase();
				const email = (user.email || "").toLowerCase();
				return (
					displayName.includes(searchTermLower) ||
					email.includes(searchTermLower)
				);
			})
			.slice(0, limitCount);

		return users;
	} catch (error) {
		console.error("Error searching users:", error);
		throw error;
	}
};

// Get user's content counts
export const getUserContentCounts = async (userId) => {
	try {
		// Get sightings count
		const sightingsRef = collection(db, COLLECTIONS.SIGHTINGS);
		const sightingsQuery = query(sightingsRef, where("userId", "==", userId));
		const sightingsSnap = await getDocs(sightingsQuery);

		// Get blogs count
		const blogsRef = collection(db, COLLECTIONS.BLOGS);
		const blogsQuery = query(blogsRef, where("authorId", "==", userId));
		const blogsSnap = await getDocs(blogsQuery);

		return {
			sightings: sightingsSnap.size,
			blogs: blogsSnap.size,
		};
	} catch (error) {
		console.error("Error getting user content counts:", error);
		throw error;
	}
};

// Update user role (admin only)
export const updateUserRole = async (userId, newRole) => {
	try {
		const userRef = doc(db, COLLECTIONS.USERS, userId);

		await updateDoc(userRef, {
			role: newRole,
			updatedAt: serverTimestamp(),
		});

		trackEvent("user_role_updated", { userId, newRole });

		return true;
	} catch (error) {
		console.error("Error updating user role:", error);
		throw error;
	}
};

// Update last active timestamp
export const updateLastActive = async (userId) => {
	try {
		const userRef = doc(db, COLLECTIONS.USERS, userId);

		await updateDoc(userRef, {
			lastActive: serverTimestamp(),
		});

		return true;
	} catch (error) {
		console.error("Error updating last active:", error);
		// Don't throw error for last active update
		return false;
	}
};

// Follow/unfollow user
export const toggleFollowUser = async (
	currentUserId,
	targetUserId,
	isFollowing
) => {
	try {
		const currentUserRef = doc(db, COLLECTIONS.USERS, currentUserId);
		const targetUserRef = doc(db, COLLECTIONS.USERS, targetUserId);

		if (isFollowing) {
			// Unfollow
			await updateDoc(currentUserRef, {
				following: currentUserId !== targetUserId ? [] : [],
				updatedAt: serverTimestamp(),
			});
			await updateDoc(targetUserRef, {
				followers: currentUserId !== targetUserId ? [] : [],
				updatedAt: serverTimestamp(),
			});

			trackEvent("user_unfollowed", { currentUserId, targetUserId });
		} else {
			// Follow
			trackEvent("user_followed", { currentUserId, targetUserId });
		}

		return !isFollowing;
	} catch (error) {
		console.error("Error toggling follow user:", error);
		throw error;
	}
};

export default {
	getUserProfile,
	updateUserProfile,
	getUserStats,
	getTopUsers,
	getCreators,
	searchUsers,
	getUserContentCounts,
	updateUserRole,
	updateLastActive,
	toggleFollowUser,
};
