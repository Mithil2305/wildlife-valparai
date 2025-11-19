import { initializeApp, setLogLevel } from "firebase/app";
import {
	getAuth,
	// Auth methods
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
	GoogleAuthProvider,
	onAuthStateChanged,
	signInWithPopup,
} from "firebase/auth";
import {
	getFirestore,
	// Core Firestore methods
	doc,
	getDoc,
	setDoc,
	updateDoc,
	deleteDoc,
	onSnapshot,
	collection,
	query,
	where,
	addDoc,
	getDocs,
	runTransaction,
	increment,
	Timestamp,
	serverTimestamp,
	limit,
	orderBy,
} from "firebase/firestore";

// --- 1. Firebase Configuration ---
// This reads the VITE_ variables from your .env file
const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
	projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
	storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
	appId: import.meta.env.VITE_FIREBASE_APP_ID,
	measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// --- 2. Initialize Firebase ---
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
setLogLevel("Debug"); // Enable debug logging

// --- 3. Firestore Collection References (as per wv-overview.pdf) ---
// These are now corrected to be root-level collections, matching your firestore.rules

// /users [cite: 132-156]
const usersCollection = collection(db, "users");
const userDoc = (userId) => doc(db, "users", userId);

// /users/{userId}/pointsHistory [cite: 132-134]
const pointsHistoryCollection = (userId) =>
	collection(db, "users", userId, "pointsHistory");

// /users/{userId}/transactionsReceived [cite: 135-136]
const transactionsReceivedCollection = (userId) =>
	collection(db, "users", userId, "transactionsReceived");

// /posts [cite: 137-140]
const postsCollection = collection(db, "posts");
const postDoc = (postId) => doc(db, "posts", postId);

// /posts/{postId}/likes [cite: 141-143]
const likesCollection = (postId) => collection(db, "posts", postId, "likes");
const likeDoc = (postId, userId) => doc(db, "posts", postId, "likes", userId);

// /posts/{postId}/comments [cite: 144-146]
const commentsCollection = (postId) =>
	collection(db, "posts", postId, "comments");

// /usernames [cite: 147-149]
const usernamesCollection = collection(db, "usernames");
const usernameDoc = (username) => doc(db, "usernames", username.toLowerCase());

// /payments (Admin) [cite: 152-155]
const paymentsCollection = collection(db, "payments");
const paymentDoc = (paymentId) => doc(db, "payments", paymentId);

// /sponsors (Admin) [cite: 156-158]
const sponsorsCollection = collection(db, "sponsors");
const sponsorDoc = (sponsorId) => doc(db, "sponsors", sponsorId);

// --- 4. Export Core Services ---
export {
	db,
	auth,
	// Auth methods
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
	GoogleAuthProvider,
	onAuthStateChanged,
	signInWithPopup,
	// Firestore methods and refs
	doc,
	getDoc,
	setDoc,
	updateDoc,
	deleteDoc,
	onSnapshot,
	collection,
	query,
	where,
	addDoc,
	getDocs,
	runTransaction,
	increment,
	Timestamp,
	serverTimestamp,
	limit,
	orderBy,
	// Schema-specific refs
	usersCollection,
	userDoc,
	pointsHistoryCollection,
	transactionsReceivedCollection,
	postsCollection,
	postDoc,
	likesCollection,
	likeDoc,
	commentsCollection,
	usernamesCollection,
	usernameDoc,
	paymentsCollection,
	paymentDoc,
	sponsorDoc,
	sponsorsCollection,
};
