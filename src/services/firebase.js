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
// Get worker URL for fetching secure config
const WORKER_URL = import.meta.env.VITE_WORKER_URL;

const validateConfig = (config) => {
	const requiredKeys = [
		"apiKey",
		"authDomain",
		"projectId",
		"storageBucket",
		"messagingSenderId",
		"appId",
	];

	const missing = requiredKeys.filter((key) => !config?.[key]);
	if (missing.length) {
		throw new Error(
			`Firebase config missing: ${missing.join(", ")}. Check worker secrets and VITE_WORKER_URL.`,
		);
	}

	return config;
};

// Firebase instances (will be initialized)
let app = null;
let auth = null;
let db = null;
let isInitialized = false;
let initPromise = null;

/**
 * Fetch Firebase config from secure Cloudflare Worker
 */
const fetchFirebaseConfig = async () => {
	try {
		const response = await fetch(`${WORKER_URL}/config/firebase`, {
			method: "GET",
			headers: { "Content-Type": "application/json" },
		});

		if (!response.ok) {
			throw new Error(`Failed to fetch config: ${response.status}`);
		}

		const cfg = await response.json();
		return validateConfig(cfg);
	} catch (error) {
		console.error("Error fetching Firebase config from worker:", error);
		throw error;
	}
};

/**
 * Initialize Firebase with config from secure worker
 * This must be called before using any Firebase services
 */
const initializeFirebase = async () => {
	if (isInitialized) return { app, auth, db };
	if (initPromise) return initPromise;

	initPromise = (async () => {
		try {
			console.log("Fetching Firebase config from worker...");
			const firebaseConfig = await fetchFirebaseConfig();

			app = initializeApp(firebaseConfig);
			auth = getAuth(app);
			db = getFirestore(app);
			isInitialized = true;

			setLogLevel("Debug");
			console.log("Firebase initialized successfully with secure config");

			return { app, auth, db };
		} catch (error) {
			console.error("Failed to initialize Firebase:", error);
			initPromise = null;
			throw error;
		}
	})();

	return initPromise;
};

/**
 * Get Firebase Auth instance (ensures initialization)
 */
const getFirebaseAuth = async () => {
	await initializeFirebase();
	return auth;
};

/**
 * Get Firestore instance (ensures initialization)
 */
const getFirebaseDb = async () => {
	await initializeFirebase();
	return db;
};

/**
 * Check if Firebase is initialized
 */
const isFirebaseInitialized = () => isInitialized;

// --- 2. Firestore Collection References (async getters) ---

const getUsersCollection = async () => {
	const database = await getFirebaseDb();
	return collection(database, "users");
};

const getUserDoc = async (userId) => {
	const database = await getFirebaseDb();
	return doc(database, "users", userId);
};

const getPointsHistoryCollection = async (userId) => {
	const database = await getFirebaseDb();
	return collection(database, "users", userId, "pointsHistory");
};

const getTransactionsReceivedCollection = async (userId) => {
	const database = await getFirebaseDb();
	return collection(database, "users", userId, "transactionsReceived");
};

const getPostsCollection = async () => {
	const database = await getFirebaseDb();
	return collection(database, "posts");
};

const getPostDoc = async (postId) => {
	const database = await getFirebaseDb();
	return doc(database, "posts", postId);
};

const getLikesCollection = async (postId) => {
	const database = await getFirebaseDb();
	return collection(database, "posts", postId, "likes");
};

const getLikeDoc = async (postId, userId) => {
	const database = await getFirebaseDb();
	return doc(database, "posts", postId, "likes", userId);
};

const getCommentsCollection = async (postId) => {
	const database = await getFirebaseDb();
	return collection(database, "posts", postId, "comments");
};

const getUsernamesCollection = async () => {
	const database = await getFirebaseDb();
	return collection(database, "usernames");
};

const getUsernameDoc = async (username) => {
	const database = await getFirebaseDb();
	return doc(database, "usernames", username.toLowerCase());
};

const getPaymentsCollection = async () => {
	const database = await getFirebaseDb();
	return collection(database, "payments");
};

const getPaymentDoc = async (paymentId) => {
	const database = await getFirebaseDb();
	return doc(database, "payments", paymentId);
};

const getSponsorsCollection = async () => {
	const database = await getFirebaseDb();
	return collection(database, "sponsors");
};

const getSponsorDoc = async (sponsorId) => {
	const database = await getFirebaseDb();
	return doc(database, "sponsors", sponsorId);
};

// --- 3. Export Core Services ---
export {
	// Initialization (MUST be called at app startup)
	initializeFirebase,
	isFirebaseInitialized,
	getFirebaseAuth,
	getFirebaseDb,
	// Auth methods
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
	GoogleAuthProvider,
	onAuthStateChanged,
	signInWithPopup,
	// Firestore methods
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
	// Async collection/doc getters
	getUsersCollection,
	getUserDoc,
	getPointsHistoryCollection,
	getTransactionsReceivedCollection,
	getPostsCollection,
	getPostDoc,
	getLikesCollection,
	getLikeDoc,
	getCommentsCollection,
	getUsernamesCollection,
	getUsernameDoc,
	getPaymentsCollection,
	getPaymentDoc,
	getSponsorsCollection,
	getSponsorDoc,
};

// Legacy getters for backward compatibility
// Components should call initializeFirebase() first, then use these
export const getAuthInstance = () => auth;
export const getDbInstance = () => db;
