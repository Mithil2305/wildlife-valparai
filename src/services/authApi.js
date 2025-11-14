import {
	auth,
	db,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut as firebaseSignOut,
	GoogleAuthProvider,
	onAuthStateChanged,
	runTransaction,
	userDoc,
	usernameDoc,
	serverTimestamp,
} from "./firebase.js";

/**
 * Registers a new user with email, password, and username.
 * Implements the username uniqueness check as per the PDF.
 * Creates both the /usernames/{username} and /users/{userId} documents.
 * * @param {string} email
 * @param {string} password
 * @param {string} username
 * @param {string} name - User's full name
 * @returns {object} The user credential object.
 * @throws {Error} Throws an error if registration fails or username is taken.
 */
export const registerUser = async (email, password, username, name) => {
	const lowerCaseUsername = username.toLowerCase();
	const newUsernameRef = usernameDoc(lowerCaseUsername);

	try {
		// Step 1: Check if username is taken inside a transaction
		await runTransaction(db, async (transaction) => {
			const usernameSnap = await transaction.get(newUsernameRef);
			if (usernameSnap.exists()) {
				throw new Error("Username is already taken.");
			}

			// Username is available, but don't create the doc yet.
			// We only create it *after* auth user is created.
		});

		// Step 2: Create the auth user
		const userCredential = await createUserWithEmailAndPassword(
			auth,
			email,
			password
		);
		const user = userCredential.user;
		const userId = user.uid;

		// Step 3: Now, create the user data and username docs in a final transaction
		await runTransaction(db, async (transaction) => {
			const newUserRef = userDoc(userId);

			// Create the user document as per /users/{userId} schema
			const newUserProfile = {
				username: lowerCaseUsername,
				email: email,
				name: name,
				accountType: "viewer", // Default to "viewer" as per schema
				createdAt: serverTimestamp(),
				points: 0,
				profilePhotoUrl: "", // Default
				bio: "", // Default
			};
			transaction.set(newUserRef, newUserProfile);

			// Create the username document to reserve it
			const newUsernameData = {
				userId: userId,
			};
			transaction.set(newUsernameRef, newUsernameData);
		});

		return userCredential;
	} catch (error) {
		console.error("Error during registration:", error);
		// Handle specific errors (e.g., 'auth/email-already-in-use')
		throw error;
	}
};

/**
 * Logs in a user with email and password.
 * @param {string} email
 * @param {string} password
 * @returns {object} The user credential object.
 */
export const loginUser = async (email, password) => {
	try {
		const userCredential = await signInWithEmailAndPassword(
			auth,
			email,
			password
		);
		return userCredential;
	} catch (error) {
		console.error("Error during login:", error);
		throw error;
	}
};

/**
 * Logs out the current user.
 */
export const signOut = async () => {
	try {
		await firebaseSignOut(auth);
	} catch (error) {
		console.error("Error signing out:", error);
		throw error;
	}
};

/**
 * Attaches a listener to the user's authentication state.
 * @param {function} callback - Function to call when auth state changes.
 * @returns {function} The unsubscribe function.
 */
export const onAuthStateChange = (callback) => {
	return onAuthStateChanged(auth, callback);
};

// TODO: Add Google Sign-In and other providers if needed
export const signInWithGoogle = async () => {
	const provider = new GoogleAuthProvider();
	// This logic needs to be expanded to handle new vs. returning users
	// and create the /users and /usernames docs if it's a new user.
	// This is more complex than email/pass registration.
	console.warn(
		"signInWithGoogle not fully implemented. Needs user data creation logic."
	);
	// try {
	//   const result = await signInWithPopup(auth, provider);
	//   // ... check if user is new, then create docs
	// } catch (error) {
	//   console.error("Google sign-in error:", error);
	// }
};
