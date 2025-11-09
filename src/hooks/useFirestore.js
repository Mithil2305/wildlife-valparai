// useFirestore Hook - Firestore CRUD operations with caching and real-time updates
import { useState, useCallback } from "react";
import {
	collection,
	doc,
	getDoc,
	getDocs,
	addDoc,
	updateDoc,
	deleteDoc,
	query,
	where,
	orderBy,
	limit,
	onSnapshot,
	serverTimestamp,
	increment,
} from "firebase/firestore";
import { db } from "../api/firebaseConfig";

export const useFirestore = (collectionName) => {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	// Get all documents from collection
	const getAll = useCallback(
		async (queryConstraints = []) => {
			setLoading(true);
			setError(null);
			try {
				const colRef = collection(db, collectionName);
				const q =
					queryConstraints.length > 0
						? query(colRef, ...queryConstraints)
						: colRef;
				const snapshot = await getDocs(q);
				const results = snapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				setData(results);
				return results;
			} catch (err) {
				console.error(`Error getting documents from ${collectionName}:`, err);
				setError(err.message);
				throw err;
			} finally {
				setLoading(false);
			}
		},
		[collectionName]
	);

	// Get single document by ID
	const getById = useCallback(
		async (documentId) => {
			setLoading(true);
			setError(null);
			try {
				const docRef = doc(db, collectionName, documentId);
				const docSnap = await getDoc(docRef);
				if (docSnap.exists()) {
					const result = { id: docSnap.id, ...docSnap.data() };
					return result;
				} else {
					throw new Error("Document not found");
				}
			} catch (err) {
				console.error(
					`Error getting document ${documentId} from ${collectionName}:`,
					err
				);
				setError(err.message);
				throw err;
			} finally {
				setLoading(false);
			}
		},
		[collectionName]
	);

	// Query documents with filters
	const queryDocs = useCallback(
		async (queryConstraints = []) => {
			setLoading(true);
			setError(null);
			try {
				const colRef = collection(db, collectionName);
				const q = query(colRef, ...queryConstraints);
				const snapshot = await getDocs(q);
				const results = snapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				setData(results);
				return results;
			} catch (err) {
				console.error(`Error querying documents from ${collectionName}:`, err);
				setError(err.message);
				throw err;
			} finally {
				setLoading(false);
			}
		},
		[collectionName]
	);

	// Add new document
	const add = useCallback(
		async (documentData) => {
			setLoading(true);
			setError(null);
			try {
				const colRef = collection(db, collectionName);
				const dataWithTimestamp = {
					...documentData,
					createdAt: serverTimestamp(),
					updatedAt: serverTimestamp(),
				};
				const docRef = await addDoc(colRef, dataWithTimestamp);
				return docRef.id;
			} catch (err) {
				console.error(`Error adding document to ${collectionName}:`, err);
				setError(err.message);
				throw err;
			} finally {
				setLoading(false);
			}
		},
		[collectionName]
	);

	// Update existing document
	const update = useCallback(
		async (documentId, updates) => {
			setLoading(true);
			setError(null);
			try {
				const docRef = doc(db, collectionName, documentId);
				const updatesWithTimestamp = {
					...updates,
					updatedAt: serverTimestamp(),
				};
				await updateDoc(docRef, updatesWithTimestamp);
				return true;
			} catch (err) {
				console.error(
					`Error updating document ${documentId} in ${collectionName}:`,
					err
				);
				setError(err.message);
				throw err;
			} finally {
				setLoading(false);
			}
		},
		[collectionName]
	);

	// Delete document
	const remove = useCallback(
		async (documentId) => {
			setLoading(true);
			setError(null);
			try {
				const docRef = doc(db, collectionName, documentId);
				await deleteDoc(docRef);
				return true;
			} catch (err) {
				console.error(
					`Error deleting document ${documentId} from ${collectionName}:`,
					err
				);
				setError(err.message);
				throw err;
			} finally {
				setLoading(false);
			}
		},
		[collectionName]
	);

	// Increment a numeric field
	const incrementField = useCallback(
		async (documentId, fieldName, value = 1) => {
			setLoading(true);
			setError(null);
			try {
				const docRef = doc(db, collectionName, documentId);
				await updateDoc(docRef, {
					[fieldName]: increment(value),
					updatedAt: serverTimestamp(),
				});
				return true;
			} catch (err) {
				console.error(
					`Error incrementing field ${fieldName} in ${documentId}:`,
					err
				);
				setError(err.message);
				throw err;
			} finally {
				setLoading(false);
			}
		},
		[collectionName]
	);

	// Subscribe to real-time updates for entire collection
	const subscribe = useCallback(
		(queryConstraints = [], callback) => {
			const colRef = collection(db, collectionName);
			const q =
				queryConstraints.length > 0
					? query(colRef, ...queryConstraints)
					: colRef;

			const unsubscribe = onSnapshot(
				q,
				(snapshot) => {
					const results = snapshot.docs.map((doc) => ({
						id: doc.id,
						...doc.data(),
					}));
					setData(results);
					if (callback) callback(results);
				},
				(err) => {
					console.error(`Error subscribing to ${collectionName}:`, err);
					setError(err.message);
				}
			);

			return unsubscribe;
		},
		[collectionName]
	);

	// Subscribe to real-time updates for single document
	const subscribeToDoc = useCallback(
		(documentId, callback) => {
			const docRef = doc(db, collectionName, documentId);

			const unsubscribe = onSnapshot(
				docRef,
				(docSnap) => {
					if (docSnap.exists()) {
						const result = { id: docSnap.id, ...docSnap.data() };
						if (callback) callback(result);
					}
				},
				(err) => {
					console.error(`Error subscribing to document ${documentId}:`, err);
					setError(err.message);
				}
			);

			return unsubscribe;
		},
		[collectionName]
	);

	return {
		data,
		loading,
		error,
		getAll,
		getById,
		queryDocs,
		add,
		update,
		remove,
		incrementField,
		subscribe,
		subscribeToDoc,
		// Export Firestore query helpers for convenience
		where,
		orderBy,
		limit,
	};
};

export default useFirestore;
