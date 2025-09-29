import {
	collection,
	addDoc,
	updateDoc,
	deleteDoc,
	doc,
	getDocs,
	getDoc,
	query,
	where,
	orderBy,
	limit,
	serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebaseConfig";
import { uploadToCloudflareR2 } from "./storageApi";
import { awardPoints } from "./pointsApi";

export const createSighting = async (sightingData, audioFile, imageFiles) => {
	try {
		// Upload audio file if provided
		let audioUrl = "";
		if (audioFile) {
			const audioUpload = await uploadToCloudflareR2(audioFile, "audio");
			if (audioUpload.success) {
				audioUrl = audioUpload.url;
			}
		}

		// Upload image files
		const imageUrls = [];
		if (imageFiles && imageFiles.length > 0) {
			for (const imageFile of imageFiles) {
				const imageUpload = await uploadToCloudflareR2(imageFile, "images");
				if (imageUpload.success) {
					imageUrls.push(imageUpload.url);
				}
			}
		}

		// Create sighting document
		const sightingRef = await addDoc(collection(db, "sightings"), {
			...sightingData,
			audioUrl,
			imageUrls,
			createdAt: serverTimestamp(),
			updatedAt: serverTimestamp(),
			likes: 0,
			views: 0,
			status: "pending", // pending, approved, rejected
			verified: false,
		});

		// Award points for submission
		await awardPoints(
			sightingData.authorId,
			"sighting_submission",
			sightingRef.id
		);

		return { success: true, id: sightingRef.id };
	} catch (error) {
		return { success: false, error: error.message };
	}
};

export const updateSighting = async (sightingId, updates) => {
	try {
		const sightingRef = doc(db, "sightings", sightingId);
		await updateDoc(sightingRef, {
			...updates,
			updatedAt: serverTimestamp(),
		});

		return { success: true };
	} catch (error) {
		return { success: false, error: error.message };
	}
};

export const deleteSighting = async (sightingId) => {
	try {
		await deleteDoc(doc(db, "sightings", sightingId));
		return { success: true };
	} catch (error) {
		return { success: false, error: error.message };
	}
};

export const getSighting = async (sightingId) => {
	try {
		const sightingDoc = await getDoc(doc(db, "sightings", sightingId));
		if (sightingDoc.exists()) {
			return {
				success: true,
				data: { id: sightingDoc.id, ...sightingDoc.data() },
			};
		}
		return { success: false, error: "Sighting not found" };
	} catch (error) {
		return { success: false, error: error.message };
	}
};

export const getSightings = async (options = {}) => {
	try {
		const {
			userId = null,
			status = "approved",
			limit: limitCount = 20,
			species = null,
		} = options;

		let sightingsQuery = query(
			collection(db, "sightings"),
			orderBy("createdAt", "desc")
		);

		if (userId) {
			sightingsQuery = query(sightingsQuery, where("authorId", "==", userId));
		}

		if (status) {
			sightingsQuery = query(sightingsQuery, where("status", "==", status));
		}

		if (species) {
			sightingsQuery = query(sightingsQuery, where("species", "==", species));
		}

		sightingsQuery = query(sightingsQuery, limit(limitCount));

		const querySnapshot = await getDocs(sightingsQuery);
		const sightings = querySnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));

		return { success: true, data: sightings };
	} catch (error) {
		return { success: false, error: error.message };
	}
};

export const approveSighting = async (sightingId) => {
	try {
		const sightingRef = doc(db, "sightings", sightingId);
		await updateDoc(sightingRef, {
			status: "approved",
			verified: true,
			updatedAt: serverTimestamp(),
		});

		// Get sighting to award points to author
		const sightingDoc = await getDoc(sightingRef);
		if (sightingDoc.exists()) {
			const sightingData = sightingDoc.data();
			await awardPoints(sightingData.authorId, "sighting_approved", sightingId);
		}

		return { success: true };
	} catch (error) {
		return { success: false, error: error.message };
	}
};

export const rejectSighting = async (sightingId, reason) => {
	try {
		const sightingRef = doc(db, "sightings", sightingId);
		await updateDoc(sightingRef, {
			status: "rejected",
			rejectionReason: reason,
			updatedAt: serverTimestamp(),
		});

		return { success: true };
	} catch (error) {
		return { success: false, error: error.message };
	}
};

export const incrementSightingViews = async (sightingId) => {
	try {
		const sightingRef = doc(db, "sightings", sightingId);
		const sightingDoc = await getDoc(sightingRef);

		if (sightingDoc.exists()) {
			const currentViews = sightingDoc.data().views || 0;
			await updateDoc(sightingRef, {
				views: currentViews + 1,
			});
		}

		return { success: true };
	} catch (error) {
		return { success: false, error: error.message };
	}
};
