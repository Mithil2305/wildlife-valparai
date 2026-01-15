import { jest } from "@jest/globals";

// Mock database instance
export const db = {};

// Async getters for Firebase instances
export const getFirebaseDb = jest.fn(() => Promise.resolve(db));
export const getFirebaseAuth = jest.fn(() => Promise.resolve({}));
export const initializeFirebase = jest.fn(() =>
	Promise.resolve({ app: {}, auth: {}, db })
);
export const isFirebaseInitialized = jest.fn(() => true);

// Sync getters for backward compatibility
export const getAuthInstance = jest.fn(() => ({}));
export const getDbInstance = jest.fn(() => db);

// Async collection/doc getters
export const getUserDoc = jest.fn((userId) => Promise.resolve({ id: userId }));
export const getUsersCollection = jest.fn(() =>
	Promise.resolve({ id: "USERS_COLLECTION" })
);
export const getPointsHistoryCollection = jest.fn((userId) =>
	Promise.resolve({ id: "POINTS_HISTORY_COLLECTION" })
);
export const getTransactionsReceivedCollection = jest.fn((userId) =>
	Promise.resolve({ id: "TRANSACTIONS_COLLECTION" })
);
export const getPostsCollection = jest.fn(() =>
	Promise.resolve({ id: "POSTS_COLLECTION" })
);
export const getPostDoc = jest.fn((postId) => Promise.resolve({ id: postId }));
export const getLikesCollection = jest.fn((postId) =>
	Promise.resolve({ id: "LIKES_COLLECTION" })
);
export const getLikeDoc = jest.fn((postId, userId) =>
	Promise.resolve({ id: `${postId}_${userId}` })
);
export const getCommentsCollection = jest.fn((postId) =>
	Promise.resolve({ id: "COMMENTS_COLLECTION" })
);
export const getUsernamesCollection = jest.fn(() =>
	Promise.resolve({ id: "USERNAMES_COLLECTION" })
);
export const getUsernameDoc = jest.fn((username) =>
	Promise.resolve({ id: username })
);
export const getPaymentsCollection = jest.fn(() =>
	Promise.resolve({ id: "PAYMENTS_COLLECTION" })
);
export const getPaymentDoc = jest.fn((paymentId) =>
	Promise.resolve({ id: paymentId })
);
export const getSponsorsCollection = jest.fn(() =>
	Promise.resolve({ id: "SPONSORS_COLLECTION" })
);
export const getSponsorDoc = jest.fn((sponsorId) =>
	Promise.resolve({ id: sponsorId })
);

// Firestore methods
export const doc = jest.fn((collection, id) => ({ id: id || "DOC_REF" }));
export const getDoc = jest.fn(() =>
	Promise.resolve({ exists: () => true, data: () => ({}) })
);
export const setDoc = jest.fn(() => Promise.resolve());
export const updateDoc = jest.fn(() => Promise.resolve());
export const deleteDoc = jest.fn(() => Promise.resolve());
export const getDocs = jest.fn(() => Promise.resolve({ docs: [], size: 0 }));
export const collection = jest.fn((db, path) => ({ id: path }));
export const query = jest.fn((...args) => args[0]);
export const where = jest.fn(() => ({}));
export const orderBy = jest.fn(() => ({}));
export const limit = jest.fn(() => ({}));
export const addDoc = jest.fn(() => Promise.resolve({ id: "NEW_DOC_ID" }));
export const runTransaction = jest.fn((db, updateFn) =>
	updateFn({
		get: jest.fn(() =>
			Promise.resolve({ exists: () => true, data: () => ({ points: 0 }) })
		),
		set: jest.fn(),
		update: jest.fn(),
		delete: jest.fn(),
	})
);
export const onSnapshot = jest.fn(() => jest.fn());

// Firebase values
export const serverTimestamp = jest.fn(() => "NOW");
export const increment = jest.fn((value) => value);
export const Timestamp = {
	fromDate: jest.fn((date) => ({ toDate: () => date })),
};

// Auth methods
export const createUserWithEmailAndPassword = jest.fn();
export const signInWithEmailAndPassword = jest.fn();
export const signOut = jest.fn();
export const GoogleAuthProvider = jest.fn();
export const onAuthStateChanged = jest.fn();
export const signInWithPopup = jest.fn();
