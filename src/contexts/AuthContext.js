// Authentication Context - Manages auth state across the app
import { createContext, useContext, useEffect, useState } from "react";
import {
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
} from "../api/authApi";
import { trackSignUp } from "../services/analyticsService";

const AuthContext = createContext();

export const useAuthContext = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuthContext must be used within AuthProvider");
	}
	return context;
};

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [userData, setUserData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// Observe auth state changes
	useEffect(() => {
		const unsubscribe = observeAuthState(async (firebaseUser) => {
			if (firebaseUser) {
				setUser(firebaseUser);
				// Fetch user data from Firestore
				const result = await getUserData(firebaseUser.uid);
				if (result.success) {
					setUserData(result.data);
				}
			} else {
				setUser(null);
				setUserData(null);
			}
			setLoading(false);
		});

		return () => unsubscribe();
	}, []);

	// Register new user
	const register = async (email, password, additionalData) => {
		try {
			setError(null);
			setLoading(true);
			const result = await registerUser(email, password, additionalData);

			if (result.success) {
				setUser(result.user);
				setUserData(result.userData);
				await trackSignUp(result.user.uid, "email");
				return { success: true, user: result.user };
			} else {
				setError(result.error);
				return { success: false, error: result.error };
			}
		} catch (err) {
			setError(err.message);
			return { success: false, error: err.message };
		} finally {
			setLoading(false);
		}
	};

	// Login user
	const login = async (email, password) => {
		try {
			setError(null);
			setLoading(true);
			const result = await loginUser(email, password);

			if (result.success) {
				setUser(result.user);
				const userDataResult = await getUserData(result.user.uid);
				if (userDataResult.success) {
					setUserData(userDataResult.data);
				}
				return { success: true, user: result.user };
			} else {
				setError(result.error);
				return { success: false, error: result.error };
			}
		} catch (err) {
			setError(err.message);
			return { success: false, error: err.message };
		} finally {
			setLoading(false);
		}
	};

	// Google Sign-In
	const googleSignIn = async () => {
		try {
			setError(null);
			setLoading(true);
			const result = await signInWithGoogle();

			if (result.success) {
				setUser(result.user);
				const userDataResult = await getUserData(result.user.uid);
				if (userDataResult.success) {
					setUserData(userDataResult.data);
				}

				if (result.isNewUser) {
					await trackSignUp(result.user.uid, "google");
				}

				return { success: true, user: result.user };
			} else {
				setError(result.error);
				return { success: false, error: result.error };
			}
		} catch (err) {
			setError(err.message);
			return { success: false, error: err.message };
		} finally {
			setLoading(false);
		}
	};

	// Logout user
	const logout = async () => {
		try {
			setError(null);
			const result = await logoutUser();
			if (result.success) {
				setUser(null);
				setUserData(null);
				return { success: true };
			} else {
				setError(result.error);
				return { success: false, error: result.error };
			}
		} catch (err) {
			setError(err.message);
			return { success: false, error: err.message };
		}
	};

	// Reset password
	const sendPasswordReset = async (email) => {
		try {
			setError(null);
			const result = await resetPassword(email);
			return result;
		} catch (err) {
			setError(err.message);
			return { success: false, error: err.message };
		}
	};

	// Update profile
	const updateProfile = async (updates) => {
		try {
			setError(null);
			const result = await updateUserProfile(updates);

			if (result.success && user) {
				// Refresh user data
				const userDataResult = await getUserData(user.uid);
				if (userDataResult.success) {
					setUserData(userDataResult.data);
				}
			}

			return result;
		} catch (err) {
			setError(err.message);
			return { success: false, error: err.message };
		}
	};

	// Refresh user data
	const refreshUserData = async () => {
		if (user) {
			const result = await getUserData(user.uid);
			if (result.success) {
				setUserData(result.data);
			}
		}
	};

	// Check if current user is admin
	const checkIsAdmin = async () => {
		if (!user) return false;
		return await isAdmin(user.uid);
	};

	// Check if current user is creator
	const checkIsCreator = async () => {
		if (!user) return false;
		return await isCreator(user.uid);
	};

	const value = {
		user,
		userData,
		loading,
		error,
		register,
		login,
		googleSignIn,
		logout,
		sendPasswordReset,
		updateProfile,
		refreshUserData,
		checkIsAdmin,
		checkIsCreator,
		getCurrentUser,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
