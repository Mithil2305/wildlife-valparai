import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
	sendPasswordResetEmail,
	updateProfile,
	updateEmail,
	updatePassword,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";

export const registerUser = async (email, password, userData) => {
	try {
		const userCredential = await createUserWithEmailAndPassword(
			auth,
			email,
			password
		);
		const user = userCredential.user;

		// Create user document in Firestore
		await setDoc(doc(db, "users", user.uid), {
			email: user.email,
			displayName: userData.displayName || "",
			photoURL: userData.photoURL || "",
			role: "user",
			points: 0,
			createdAt: new Date(),
			...userData,
		});

		// Update profile if display name provided
		if (userData.displayName) {
			await updateProfile(user, {
				displayName: userData.displayName,
				photoURL: userData.photoURL || "",
			});
		}

		return { success: true, user };
	} catch (error) {
		return { success: false, error: error.message };
	}
};

export const loginUser = async (email, password) => {
	try {
		const userCredential = await signInWithEmailAndPassword(
			auth,
			email,
			password
		);
		return { success: true, user: userCredential.user };
	} catch (error) {
		return { success: false, error: error.message };
	}
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
			await setDoc(doc(db, "users", user.uid), updates, { merge: true });
		}

		return { success: true };
	} catch (error) {
		return { success: false, error: error.message };
	}
};

export const getUserData = async (userId) => {
	try {
		const userDoc = await getDoc(doc(db, "users", userId));
		if (userDoc.exists()) {
			return { success: true, data: userDoc.data() };
		}
		return { success: false, error: "User not found" };
	} catch (error) {
		return { success: false, error: error.message };
	}
};
