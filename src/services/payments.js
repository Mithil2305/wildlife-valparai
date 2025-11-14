import {
	db,
	runTransaction,
	paymentsCollection,
	transactionsReceivedCollection,
	doc,
	getDocs,
	query,
	serverTimestamp,
} from "./firebase.js";

/**
 * Creates a payment record (Admin action).
 * This atomically creates a master record in /payments
 * and a user-facing record in /users/{recipientId}/transactionsReceived.
 * * @param {string} adminId - The UID of the admin processing the payment.
 * @param {string} recipientId - The UID of the creator being paid.
 * @param {string} recipientUsername - The creator's username (denormalized).
 * @param {number} amount - The cash amount (e.g., 500.00).
 * @param {string} currency - e.g., "INR" or "USD".
 * @param {string} transactionRef - (Optional) ID from the payment provider.
 * @returns {Promise<string>} The new payment ID.
 */
export const createPayment = async (
	adminId,
	recipientId,
	recipientUsername,
	amount,
	currency,
	transactionRef = ""
) => {
	const newPaymentRef = doc(paymentsCollection); // Generate a new ID for the payment
	const newTransactionRef = doc(transactionsReceivedCollection(recipientId)); // New ID for user's log

	try {
		await runTransaction(db, async (transaction) => {
			const timestamp = serverTimestamp();

			// 1. Data for /payments/{paymentId}
			const paymentData = {
				adminId: adminId,
				recipientId: recipientId,
				recipientUsername: recipientUsername,
				amount: amount,
				currency: currency,
				timestamp: timestamp,
				status: "completed", // Assume "completed" for this example
				transactionRef: transactionRef,
			};

			// 2. Data for /users/{recipientId}/transactionsReceived/{transactionId}
			const transactionData = {
				timestamp: timestamp,
				amount: amount,
				currency: currency,
				status: "completed",
				paymentId: newPaymentRef.id, // Link to the master payment record
			};

			// 3. Set both documents in the transaction
			transaction.set(newPaymentRef, paymentData);
			transaction.set(newTransactionRef, transactionData);
		});

		console.log(
			`Successfully created payment ${newPaymentRef.id} for user ${recipientId}`
		);
		return newPaymentRef.id;
	} catch (error) {
		console.error("Error creating payment:", error);
		throw error;
	}
};

/**
 * Fetches the payment history for a specific user (for their dashboard).
 * @param {string} userId - The user's ID.
 * @returns {Promise<Array<object>>} A promise resolving to their transaction history.
 */
export const getPaymentHistory = async (userId) => {
	try {
		const q = query(transactionsReceivedCollection(userId)); // Add orderBy in real app
		const snapshot = await getDocs(q);

		const history = [];
		snapshot.forEach((doc) => {
			history.push({ id: doc.id, ...doc.data() });
		});

		// Sort in memory
		history.sort((a, b) => b.timestamp.toMillis() - a.timestamp.toMillis());

		return history;
	} catch (error) {
		console.error("Error fetching payment history:", error);
		throw error;
	}
};

/**
 * Fetches all payments from the master log (for the admin dashboard).
 * @returns {Promise<Array<object>>} A promise resolving to all payment records.
 */
export const getAllPayments = async () => {
	try {
		const q = query(paymentsCollection); // Add orderBy in real app
		const snapshot = await getDocs(q);

		const payments = [];
		snapshot.forEach((doc) => {
			payments.push({ id: doc.id, ...doc.data() });
		});

		// Sort in memory
		payments.sort((a, b) => b.timestamp.toMillis() - a.timestamp.toMillis());

		return payments;
	} catch (error) {
		console.error("Error fetching all payments:", error);
		throw error;
	}
};
