import {
	collection,
	addDoc,
	updateDoc,
	doc,
	getDocs,
	query,
	where,
	orderBy,
	serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebaseConfig";
import { calculateMonthlyEarnings } from "./pointsApi";

export const processMonthlyPayouts = async (month, year) => {
	try {
		// Get top performers for the month
		const startDate = new Date(year, month - 1, 1);
		const endDate = new Date(year, month, 0);

		const pointsQuery = query(
			collection(db, "pointsTransactions"),
			where("createdAt", ">=", startDate),
			where("createdAt", "<=", endDate)
		);

		const querySnapshot = await getDocs(pointsQuery);

		// Calculate points per user
		const userPoints = {};
		querySnapshot.docs.forEach((doc) => {
			const data = doc.data();
			if (!userPoints[data.userId]) {
				userPoints[data.userId] = 0;
			}
			userPoints[data.userId] += data.points;
		});

		// Convert to array and sort
		const topPerformers = Object.entries(userPoints)
			.map(([userId, points]) => ({ userId, points }))
			.sort((a, b) => b.points - a.points)
			.slice(0, 10); // Top 10 performers

		// Process payouts
		const payouts = [];
		for (const performer of topPerformers) {
			const earnings = calculateMonthlyEarnings(performer.points);

			if (earnings > 0) {
				const payoutRef = await addDoc(collection(db, "payouts"), {
					userId: performer.userId,
					month,
					year,
					points: performer.points,
					amount: earnings,
					status: "pending",
					processedAt: null,
					createdAt: serverTimestamp(),
				});

				payouts.push({
					id: payoutRef.id,
					userId: performer.userId,
					amount: earnings,
					points: performer.points,
				});
			}
		}

		return { success: true, data: payouts };
	} catch (error) {
		return { success: false, error: error.message };
	}
};

export const getPayouts = async (options = {}) => {
	try {
		const {
			userId = null,
			status = null,
			month = null,
			year = null,
			limit = 20,
		} = options;

		let payoutsQuery = collection(db, "payouts");

		const conditions = [];
		if (userId) conditions.push(where("userId", "==", userId));
		if (status) conditions.push(where("status", "==", status));
		if (month) conditions.push(where("month", "==", month));
		if (year) conditions.push(where("year", "==", year));

		conditions.forEach((condition) => {
			payoutsQuery = query(payoutsQuery, condition);
		});

		payoutsQuery = query(
			payoutsQuery,
			orderBy("createdAt", "desc"),
			limit(limit)
		);

		const querySnapshot = await getDocs(payoutsQuery);
		const payouts = querySnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));

		return { success: true, data: payouts };
	} catch (error) {
		return { success: false, error: error.message };
	}
};

export const updatePayoutStatus = async (
	payoutId,
	status,
	transactionId = null
) => {
	try {
		const payoutRef = doc(db, "payouts", payoutId);
		await updateDoc(payoutRef, {
			status,
			transactionId,
			processedAt: status === "completed" ? serverTimestamp() : null,
			updatedAt: serverTimestamp(),
		});

		return { success: true };
	} catch (error) {
		return { success: false, error: error.message };
	}
};

export const getUserEarnings = async (userId) => {
	try {
		const payoutsQuery = query(
			collection(db, "payouts"),
			where("userId", "==", userId),
			where("status", "==", "completed")
		);

		const querySnapshot = await getDocs(payoutsQuery);
		const totalEarnings = querySnapshot.docs.reduce((total, doc) => {
			return total + (doc.data().amount || 0);
		}, 0);

		return { success: true, totalEarnings };
	} catch (error) {
		return { success: false, error: error.message };
	}
};
