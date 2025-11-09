// Authentication API with Firebase Auth (Spark Plan)
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signInWithPopup,
	signOut,
	sendPasswordResetEmail,
	updateProfile,
	updateEmail,
	updatePassword,
	onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider } from "./firebaseConfig";
import {
	COLLECTIONS,
	USER_ROLES,
	POINTS_CONFIG,
	BADGES,
} from "../utils/constants";

/**
 * Register new user with email and password
 */
export const registerUser = async (email, password, userData) => {
	try {
		const userCredential = await createUserWithEmailAndPassword(
			auth,
			email,
			password
		);
		const user = userCredential.user;

		// Create user document in Firestore with Newcomer badge
		const userDoc = {
			uid: user.uid,
			email: user.email,
			displayName: userData.displayName || "",
			photoURL: userData.photoURL || "",
			role: USER_ROLES.USER,
			points: 0,
			totalPoints: 0,
			badges: [BADGES.NEWCOMER.id],
			currentBadge: BADGES.NEWCOMER.id,
			createdAt: serverTimestamp(),
			lastLoginAt: serverTimestamp(),
			isFirstLogin: true,
			...userData,
		};

		await setDoc(doc(db, COLLECTIONS.USERS, user.uid), userDoc);

		// Update profile if display name provided
		if (userData.displayName) {
			await updateProfile(user, {
				displayName: userData.displayName,
				photoURL: userData.photoURL || "",
			});
		}

		// Initialize points document
		await setDoc(doc(db, COLLECTIONS.POINTS, user.uid), {
			userId: user.uid,
			totalPoints: 0,
			weeklyPoints: 0,
			monthlyPoints: 0,
			history: [],
			lastUpdated: serverTimestamp(),
		});

		return { success: true, user, userData: userDoc };
	} catch (error) {
		console.error("Registration error:", error);
		return { success: false, error: error.message };
	}
};

/**
 * Login user with email and password
 */
export const loginUser = async (email, password) => {
	try {
		const userCredential = await signInWithEmailAndPassword(
			auth,
			email,
			password
		);

		// Update last login time
		const userRef = doc(db, COLLECTIONS.USERS, userCredential.user.uid);
		await setDoc(
			userRef,
			{
				lastLoginAt: serverTimestamp(),
			},
			{ merge: true }
		);

		// Award daily login points if first login of the day
		const userData = await getUserData(userCredential.user.uid);
		if (userData.success) {
			const lastLogin = userData.data.lastLoginAt?.toDate();
			const today = new Date().setHours(0, 0, 0, 0);
			const lastLoginDate = lastLogin
				? new Date(lastLogin).setHours(0, 0, 0, 0)
				: 0;

			if (lastLoginDate < today) {
				// Award daily login points (handled in points service)
			}
		}

		return { success: true, user: userCredential.user };
	} catch (error) {
		console.error("Login error:", error);
		return { success: false, error: error.message };
	}
};

/**
 * Sign in with Google
 */
export const signInWithGoogle = async () => {
	try {
		const result = await signInWithPopup(auth, googleProvider);
		const user = result.user;

		// Check if user document exists
		const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, user.uid));

		if (!userDoc.exists()) {
			// Create new user document for Google sign-in
			const newUserDoc = {
				uid: user.uid,
				email: user.email,
				displayName: user.displayName || "",
				photoURL: user.photoURL || "",
				role: USER_ROLES.USER,
				points: 0,
				totalPoints: 0,
				badges: [BADGES.NEWCOMER.id],
				currentBadge: BADGES.NEWCOMER.id,
				provider: "google",
				createdAt: serverTimestamp(),
				lastLoginAt: serverTimestamp(),
				isFirstLogin: true,
			};

			await setDoc(doc(db, COLLECTIONS.USERS, user.uid), newUserDoc);

			// Initialize points document
			await setDoc(doc(db, COLLECTIONS.POINTS, user.uid), {
				userId: user.uid,
				totalPoints: 0,
				weeklyPoints: 0,
				monthlyPoints: 0,
				history: [],
				lastUpdated: serverTimestamp(),
			});
		} else {
			// Update last login time for existing user
			await setDoc(
				doc(db, COLLECTIONS.USERS, user.uid),
				{
					lastLoginAt: serverTimestamp(),
				},
				{ merge: true }
			);
		}

		return { success: true, user, isNewUser: !userDoc.exists() };
	} catch (error) {
		console.error("Google sign-in error:", error);
		return { success: false, error: error.message };
	}
};

/**
 * Auth state observer
 */
export const observeAuthState = (callback) => {
	return onAuthStateChanged(auth, callback);
};

export const logoutUser = async () => {
	try {
		await signOut(auth);
		return { success: true };
	} catch (error) {
		return { success: false, error: error.message };
	}
};

export const resetPassword = async (email) => {
	try {
		await sendPasswordResetEmail(auth, email);
		return { success: true };
	} catch (error) {
		return { success: false, error: error.message };
	}
};

/**
 * Update user profile
 */
export const updateUserProfile = async (updates) => {
	try {
		const user = auth.currentUser;
		if (!user) throw new Error("No user logged in");

		if (updates.displayName || updates.photoURL) {
			await updateProfile(user, {
				displayName: updates.displayName || user.displayName,
				photoURL: updates.photoURL || user.photoURL,
			});
		}

		if (updates.email) {
			await updateEmail(user, updates.email);
		}

		if (updates.password) {
			await updatePassword(user, updates.password);
		}

		// Update Firestore document
		if (Object.keys(updates).length > 0) {
			const userRef = doc(db, COLLECTIONS.USERS, user.uid);
			const updateData = { ...updates };
			delete updateData.password; // Don't store password in Firestore
			updateData.updatedAt = serverTimestamp();

			await setDoc(userRef, updateData, { merge: true });
		}

		return { success: true };
	} catch (error) {
		console.error("Profile update error:", error);
		return { success: false, error: error.message };
	}
};

/**
 * Get user data from Firestore
 */
export const getUserData = async (userId) => {
	try {
		const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, userId));
		if (userDoc.exists()) {
			return { success: true, data: userDoc.data() };
		}
		return { success: false, error: "User not found" };
	} catch (error) {
		console.error("Get user data error:", error);
		return { success: false, error: error.message };
	}
};

/**
 * Get current authenticated user
 */
export const getCurrentUser = () => {
	return auth.currentUser;
};

/**
 * Check if user is admin
 */
export const isAdmin = async (userId) => {
	try {
		const userData = await getUserData(userId);
		return userData.success && userData.data.role === USER_ROLES.ADMIN;
	} catch {
		return false;
	}
};

/**
 * Check if user is creator
 */
export const isCreator = async (userId) => {
	try {
		const userData = await getUserData(userId);
		return (
			userData.success &&
			(userData.data.role === USER_ROLES.CREATOR ||
				userData.data.role === USER_ROLES.ADMIN)
		);
	} catch {
		return false;
	}
};

// Export all functions
export default {
	registerUser,
	loginUser,
	signInWithGoogle,
	logoutUser,
	resetPassword,
	updateUserProfile,
	getUserData,
	getCurrentUser,
	observeAuthState,
	isAdmin,
	isCreator,
};
