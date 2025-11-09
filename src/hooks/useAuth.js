// useAuth Hook - Simplified auth operations
import { useAuthContext } from "../contexts/AuthContext";

export const useAuth = () => {
	const context = useAuthContext();

	if (!context) {
		throw new Error("useAuth must be used within AuthProvider");
	}

	return {
		user: context.user,
		userData: context.userData,
		loading: context.loading,
		error: context.error,
		isAuthenticated: !!context.user,
		isAdmin: context.userData?.role === "admin",
		isCreator:
			context.userData?.role === "creator" ||
			context.userData?.role === "admin",
		register: context.register,
		login: context.login,
		googleSignIn: context.googleSignIn,
		logout: context.logout,
		sendPasswordReset: context.sendPasswordReset,
		updateProfile: context.updateProfile,
		refreshUserData: context.refreshUserData,
		checkIsAdmin: context.checkIsAdmin,
		checkIsCreator: context.checkIsCreator,
	};
};

export default useAuth;
