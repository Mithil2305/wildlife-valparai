import {
	collection,
	doc,
	getDocs,
	getDoc,
	addDoc,
	updateDoc,
	deleteDoc,
	query,
	where,
	orderBy,
	limit,
	startAfter,
	serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebaseConfig";

// Generic CRUD operations
export const createDocument = async (collectionName, data) => {
	try {
		const docRef = await addDoc(collection(db, collectionName), {
			...data,
			createdAt: serverTimestamp(),
			updatedAt: serverTimestamp(),
		});
		return { success: true, id: docRef.id };
	} catch (error) {
		return { success: false, error: error.message };
	}
};

export const getDocument = async (collectionName, docId) => {
	try {
		const docRef = doc(db, collectionName, docId);
		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
		}
		return { success: false, error: "Document not found" };
	} catch (error) {
		return { success: false, error: error.message };
	}
};

export const updateDocument = async (collectionName, docId, updates) => {
	try {
		const docRef = doc(db, collectionName, docId);
		await updateDoc(docRef, {
			...updates,
			updatedAt: serverTimestamp(),
		});
		return { success: true };
	} catch (error) {
		return { success: false, error: error.message };
	}
};

export const deleteDocument = async (collectionName, docId) => {
	try {
		await deleteDoc(doc(db, collectionName, docId));
		return { success: true };
	} catch (error) {
		return { success: false, error: error.message };
	}
};

export const getCollection = async (collectionName, options = {}) => {
	try {
		const {
			where: whereConditions = [],
			orderBy: orderByField = "createdAt",
			orderDirection = "desc",
			limit: limitCount = 10,
			startAfter: startAfterDoc = null,
		} = options;

		let collectionQuery = collection(db, collectionName);

		// Apply where conditions
		whereConditions.forEach((condition) => {
			collectionQuery = query(
				collectionQuery,
				where(condition.field, condition.operator, condition.value)
			);
		});

		// Apply ordering
		collectionQuery = query(
			collectionQuery,
			orderBy(orderByField, orderDirection)
		);

		// Apply startAfter for pagination
		if (startAfterDoc) {
			collectionQuery = query(collectionQuery, startAfter(startAfterDoc));
		}

		// Apply limit
		if (limitCount) {
			collectionQuery = query(collectionQuery, limit(limitCount));
		}

		const querySnapshot = await getDocs(collectionQuery);
		const documents = querySnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));

		// Get the last document for next page pagination
		const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

		return {
			success: true,
			data: documents,
			lastDoc: lastDoc || null,
			hasMore: documents.length === limitCount,
		};
	} catch (error) {
		return { success: false, error: error.message };
	}
};

// Paginated collection fetch with cursor
export const getPaginatedCollection = async (
	collectionName,
	pageSize = 10,
	lastDoc = null,
	filters = {}
) => {
	try {
		const {
			where: whereConditions = [],
			orderBy: orderByField = "createdAt",
			orderDirection = "desc",
		} = filters;

		let collectionQuery = collection(db, collectionName);

		// Apply where conditions
		whereConditions.forEach((condition) => {
			collectionQuery = query(
				collectionQuery,
				where(condition.field, condition.operator, condition.value)
			);
		});

		// Apply ordering
		collectionQuery = query(
			collectionQuery,
			orderBy(orderByField, orderDirection)
		);

		// Apply startAfter for pagination if lastDoc provided
		if (lastDoc) {
			collectionQuery = query(collectionQuery, startAfter(lastDoc));
		}

		// Apply limit
		collectionQuery = query(collectionQuery, limit(pageSize));

		const querySnapshot = await getDocs(collectionQuery);
		const documents = querySnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));

		// Get the last document for next page pagination
		const newLastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

		return {
			success: true,
			data: documents,
			lastDoc: newLastDoc || null,
			hasMore: documents.length === pageSize,
		};
	} catch (error) {
		return { success: false, error: error.message };
	}
};

// Specific collections helper functions with pagination
export const getUsers = async (pageSize = 20, lastDoc = null) => {
	return getPaginatedCollection("users", pageSize, lastDoc, {
		orderBy: "createdAt",
		orderDirection: "desc",
	});
};

export const getSightings = async (
	filters = {},
	pageSize = 20,
	lastDoc = null
) => {
	const whereConditions = [];

	if (filters.userId) {
		whereConditions.push({
			field: "authorId",
			operator: "==",
			value: filters.userId,
		});
	}

	if (filters.status) {
		whereConditions.push({
			field: "status",
			operator: "==",
			value: filters.status,
		});
	}

	if (filters.species) {
		whereConditions.push({
			field: "species",
			operator: "==",
			value: filters.species,
		});
	}

	return getPaginatedCollection("sightings", pageSize, lastDoc, {
		where: whereConditions,
		orderBy: "createdAt",
		orderDirection: "desc",
	});
};

export const getBlogs = async (filters = {}, pageSize = 15, lastDoc = null) => {
	const whereConditions = [];

	if (filters.userId) {
		whereConditions.push({
			field: "authorId",
			operator: "==",
			value: filters.userId,
		});
	}

	if (filters.status) {
		whereConditions.push({
			field: "status",
			operator: "==",
			value: filters.status,
		});
	}

	if (filters.category) {
		whereConditions.push({
			field: "category",
			operator: "==",
			value: filters.category,
		});
	}

	return getPaginatedCollection("blogs", pageSize, lastDoc, {
		where: whereConditions,
		orderBy: "createdAt",
		orderDirection: "desc",
	});
};

// Get documents by field value with pagination
export const getDocumentsByField = async (
	collectionName,
	field,
	value,
	pageSize = 10,
	lastDoc = null
) => {
	return getPaginatedCollection(collectionName, pageSize, lastDoc, {
		where: [{ field, operator: "==", value }],
		orderBy: "createdAt",
		orderDirection: "desc",
	});
};

// Search documents with pagination
export const searchDocuments = async (
	collectionName,
	searchField,
	searchValue,
	pageSize = 10,
	lastDoc = null
) => {
	// For simple exact match search
	return getPaginatedCollection(collectionName, pageSize, lastDoc, {
		where: [{ field: searchField, operator: "==", value: searchValue }],
		orderBy: "createdAt",
		orderDirection: "desc",
	});
};

// Get recent documents with pagination
export const getRecentDocuments = async (
	collectionName,
	days = 7,
	pageSize = 10,
	lastDoc = null
) => {
	const startDate = new Date();
	startDate.setDate(startDate.getDate() - days);

	return getPaginatedCollection(collectionName, pageSize, lastDoc, {
		where: [
			{
				field: "createdAt",
				operator: ">=",
				value: startDate,
			},
		],
		orderBy: "createdAt",
		orderDirection: "desc",
	});
};
