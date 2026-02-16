import {
	getFirebaseAuth,
	getFirebaseDb,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut as firebaseSignOut,
	GoogleAuthProvider,
	onAuthStateChanged,
	runTransaction,
	getUserDoc,
	getDoc, // Import getDoc for Google Sign-In check
	getUsernameDoc,
	serverTimestamp,
	updateDoc, // Import updateDoc
	signInWithPopup, // Import signInWithPopup
} from "./firebase.js";

/**
 * Creates the user profile and username documents in a transaction.
 * This is a helper function used by both email and Google registration.
 * @param {object} transaction - The Firestore transaction object.
 * @param {string} userId - The new user's UID.
 * @param {string} email - User's email.
 * @param {string} name - User's display name.
 * @param {string} username - The unique username.
 * @param {string} accountType - "viewer" or "creator".
 * @param {string} phone - User's phone number.
 * @param {string} profilePhotoUrl - URL for profile photo.
 * @param {string} upiId - User's UPI ID (optional).
 */
const _createUserDocuments = async (
	transaction,
	userId,
	email,
	name,
	username,
	accountType,
	phone,
	profilePhotoUrl,
	upiId = "",
) => {
	const newUserRef = await getUserDoc(userId);
	const newUsernameRef = await getUsernameDoc(username);

	// 1. Create the user document as per /users/{userId} schema [cite: 132-156]
	const newUserProfile = {
		username: username,
		email: email,
		name: name,
		phone: phone || "", // Ensure phone is stored, even if empty
		accountType: accountType || "viewer", // Default to viewer
		createdAt: serverTimestamp(),
		points: 0,
		profilePhotoUrl: profilePhotoUrl || "", // Store photo URL
		bio: "", // Default empty bio
		upiId: upiId || "", // Store UPI ID
	};
	transaction.set(newUserRef, newUserProfile);

	// 2. Create the username document to reserve it [cite: 147-149]
	const newUsernameData = {
		userId: userId,
	};
	transaction.set(newUsernameRef, newUsernameData);
};

/**
 * Registers a new user with email, password, and all required fields.
 */
export const registerUser = async (
	email,
	password,
	username,
	name,
	phone,
	accountType,
	upiId,
) => {
	const lowerCaseUsername = username.toLowerCase();
	const newUsernameRef = await getUsernameDoc(lowerCaseUsername);
	const db = await getFirebaseDb();
	const auth = await getFirebaseAuth();

	try {
		// Step 1: Check if username is taken inside a transaction [cite: 150-151]
		await runTransaction(db, async (transaction) => {
			const usernameSnap = await transaction.get(newUsernameRef);
			if (usernameSnap.exists()) {
				throw new Error("Username is already taken.");
			}
		});

		// Step 2: Create the auth user
		const userCredential = await createUserWithEmailAndPassword(
			auth,
			email,
			password,
		);
		const user = userCredential.user;

		// Step 3: Create the user data and username docs in a final transaction
		await runTransaction(db, async (transaction) => {
			await _createUserDocuments(
				transaction,
				user.uid,
				email,
				name,
				lowerCaseUsername,
				accountType,
				phone,
				"", // No profile photo on email signup
				upiId,
			);
		});

		return userCredential;
	} catch (error) {
		console.error("Error during registration:", error);
		throw error;
	}
};

/**
 * Logs in a user with email and password.
 */
export const loginUser = async (email, password) => {
	try {
		const auth = await getFirebaseAuth();
		const userCredential = await signInWithEmailAndPassword(
			auth,
			email,
			password,
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
		const auth = await getFirebaseAuth();
		await firebaseSignOut(auth);
	} catch (error) {
		console.error("Error signing out:", error);
		throw error;
	}
};

/**
 * Attaches a listener to the user's authentication state.
 */
export const onAuthStateChange = async (callback) => {
	const auth = await getFirebaseAuth();
	return onAuthStateChanged(auth, callback);
};

/**
 * Generates a unique username from an email or name.
 * e.g., "john.doe@gmail.com" -> "john.doe"
 * If taken, it adds random digits: "john.doe456"
 * This is an internal helper that MUST be called from within a transaction.
 */
const _generateUniqueUsername = async (transaction, baseUsername) => {
	let username = baseUsername.replace(/[^a-z0-9]/gi, "").toLowerCase();
	if (!username) username = "user"; // fallback

	let isUnique = false;
	let attempts = 0;
	let finalUsername = username;

	while (!isUnique && attempts < 5) {
		const usernameRef = await getUsernameDoc(finalUsername);
		const usernameSnap = await transaction.get(usernameRef);
		if (!usernameSnap.exists()) {
			isUnique = true;
		} else {
			// Not unique, append 3 random digits
			finalUsername = username + Math.floor(100 + Math.random() * 900);
		}
		attempts++;
	}

	if (!isUnique) {
		// Final attempt with a timestamp to ensure uniqueness
		finalUsername = username + Date.now().toString().slice(-5);
	}

	// Final check, though it's highly unlikely to fail now
	const finalUsernameRef = await getUsernameDoc(finalUsername);
	const finalSnap = await transaction.get(finalUsernameRef);
	if (finalSnap.exists()) {
		throw new Error(
			"Failed to generate a unique username after multiple attempts.",
		);
	}

	return finalUsername;
};

/**
 * Signs in with Google.
 * If the user is new, it creates their profile in Firestore.
 */
export const signInWithGoogle = async () => {
	const provider = new GoogleAuthProvider();
	try {
		const auth = await getFirebaseAuth();
		const db = await getFirebaseDb();
		const result = await signInWithPopup(auth, provider);
		const user = result.user;

		// Check if user already exists in Firestore
		const userRef = await getUserDoc(user.uid);
		const docSnap = await getDoc(userRef);

		if (!docSnap.exists()) {
			// This is a new user, create their profile
			const { email, displayName, photoURL } = user;

			// Generate a base username from email or name
			let baseUsername = email.split("@")[0];
			if (!baseUsername || baseUsername.length < 3) {
				baseUsername = displayName.replace(/\s/g, "");
			}

			await runTransaction(db, async (transaction) => {
				// Find a unique username
				const uniqueUsername = await _generateUniqueUsername(
					transaction,
					baseUsername,
				);

				// Create the user documents
				await _createUserDocuments(
					transaction,
					user.uid,
					email,
					displayName,
					uniqueUsername,
					"viewer", // Default for Google sign-up
					user.phoneNumber || "", // Get phone if available, else empty
					photoURL,
					"", // UPI ID is empty for Google Sign-In initially
				);
			});
		}

		return result;
	} catch (error) {
		console.error("Google sign-in error:", error);
		throw error;
	}
};

/**
 * Updates a user's profile document in Firestore.
 * @param {string} userId - The UID of the user to update.
 * @param {object} data - An object with the fields to update (e.g., { name, bio, profilePhotoUrl }).
 * @returns {Promise<void>}
 */
export const updateUserProfile = async (userId, data) => {
	if (!userId || !data) {
		throw new Error("User ID and data are required to update profile.");
	}
	try {
		const userRef = await getUserDoc(userId);
		await updateDoc(userRef, data);
	} catch (error) {
		console.error("Error updating user profile:", error);
		throw error;
	}
};
