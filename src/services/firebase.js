import { initializeApp, setLogLevel } from "firebase/app";
import {
  getAuth,
  signInAnonymously,
  signInWithCustomToken,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider
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
  serverTimestamp
} from "firebase/firestore";

// --- 1. Firebase Configuration ---
// These global variables (__firebase_config, __initial_auth_token) are provided by the environment.
const firebaseConfig = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{}');
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// This global variable is provided by the environment.
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

// --- 2. Initialize Firebase ---
let app;
let auth;
let db;
let authReady = false;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  setLogLevel('Debug'); // Enable debug logging for Firestore
} catch (error) {
  console.error("Error initializing Firebase:", error);
  // Handle initialization error, e.g., show a message to the user
}

// --- 3. Authentication Handling ---
const signIn = async () => {
  try {
    if (initialAuthToken) {
      await signInWithCustomToken(auth, initialAuthToken);
    } else {
      await signInAnonymously(auth);
    }
  } catch (error) {
    console.error("Firebase sign-in error:", error);
  }
};

// Call signIn immediately to authenticate
signIn();

// Listen for auth state changes to set authReady
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User is authenticated:", user.uid);
    authReady = true;
  } else {
    console.log("User is signed out.");
    authReady = false;
    // If anonymous sign-in failed or user signed out, retry anonymous sign-in
    if (!initialAuthToken) {
      signInAnonymously(auth).catch(err => console.error("Anonymous sign-in failed:", err));
    }
  }
});

// Function to get the current user ID, falling back to a random UUID for anonymous users
const getUserId = () => {
    return auth.currentUser?.uid || crypto.randomUUID();
};

// --- 4. Firestore Collection References (as per schema) ---

// Helper function to create collection paths
const getPublicDataPath = () => `/artifacts/${appId}/public/data`;

// /users
const usersCollection = collection(db, getPublicDataPath(), 'users');
const userDoc = (userId) => doc(db, getPublicDataPath(), 'users', userId);

// /users/{userId}/pointsHistory
const pointsHistoryCollection = (userId) => 
  collection(db, getPublicDataPath(), 'users', userId, 'pointsHistory');

// /users/{userId}/transactionsReceived
const transactionsReceivedCollection = (userId) =>
  collection(db, getPublicDataPath(), 'users', userId, 'transactionsReceived');

// /posts
const postsCollection = collection(db, getPublicDataPath(), 'posts');
const postDoc = (postId) => doc(db, getPublicDataPath(), 'posts', postId);

// /posts/{postId}/likes
const likesCollection = (postId) =>
  collection(db, getPublicDataPath(), 'posts', postId, 'likes');
const likeDoc = (postId, userId) => 
  doc(db, getPublicDataPath(), 'posts', postId, 'likes', userId);

// /posts/{postId}/comments
const commentsCollection = (postId) =>
  collection(db, getPublicDataPath(), 'posts', postId, 'comments');

// /usernames
const usernamesCollection = collection(db, getPublicDataPath(), 'usernames');
const usernameDoc = (username) => doc(db, getPublicDataPath(), 'usernames', username.toLowerCase());

// /payments (Admin)
const paymentsCollection = collection(db, getPublicDataPath(), 'payments');
const paymentDoc = (paymentId) => doc(db, getPublicDataPath(), 'payments', paymentId);

// /sponsors (Admin)
const sponsorsCollection = collection(db, getPublicDataPath(), 'sponsors');
const sponsorDoc = (sponsorId) => doc(db, getPublicDataPath(), 'sponsors', sponsorId);


// --- 5. Export Core Services ---
export {
  db,
  auth,
  authReady,
  getUserId,
  // Auth methods
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  onAuthStateChanged,
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
  sponsorDoc,
  sponsorsCollection
};