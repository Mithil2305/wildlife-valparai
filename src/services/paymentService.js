// Razorpay Payment Service (Client-Side Only - Spark Plan Compatible)
import {
	doc,
	addDoc,
	collection,
	serverTimestamp,
	getDoc,
	updateDoc,
} from "firebase/firestore";
import { db } from "../api/firebaseConfig";
import { COLLECTIONS, PAYMENT_CONFIG } from "../utils/constants";
import {
	validateDonationAmount,
	rupeesToPaise,
} from "../utils/paymentCalculator";

/**
 * Initialize Razorpay checkout
 * @param {Object} options - Payment options
 * @returns {Promise<Object>} - Payment result
 */
export const initiateRazorpayPayment = async (options) => {
	const {
		amount,
		userId,
		userName,
		userEmail,
		description = "Donation to Wildlife Valparai",
		onSuccess,
		onFailure,
	} = options;

	// Validate amount
	const validation = validateDonationAmount(amount);
	if (!validation.valid) {
		return { success: false, error: validation.message };
	}

	try {
		// Create payment record in Firestore
		const paymentDoc = {
			userId,
			amount,
			currency: PAYMENT_CONFIG.CURRENCY,
			status: "pending",
			description,
			createdAt: serverTimestamp(),
		};

		const paymentRef = await addDoc(
			collection(db, COLLECTIONS.PAYMENTS),
			paymentDoc
		);
		const paymentId = paymentRef.id;

		// Razorpay options
		const razorpayOptions = {
			key: PAYMENT_CONFIG.RAZORPAY_KEY_ID,
			amount: rupeesToPaise(amount), // Razorpay expects paise
			currency: PAYMENT_CONFIG.CURRENCY,
			name: "Wildlife Valparai",
			description,
			order_id: paymentId, // Use Firestore doc ID as order reference
			prefill: {
				name: userName,
				email: userEmail,
			},
			theme: {
				color: "#10b981", // Tailwind green-500
			},
			handler: async function (response) {
				// Payment successful
				try {
					await updatePaymentStatus(paymentId, "success", {
						razorpayPaymentId: response.razorpay_payment_id,
						razorpayOrderId: response.razorpay_order_id,
						razorpaySignature: response.razorpay_signature,
					});

					if (onSuccess) {
						onSuccess(response);
					}
				} catch (error) {
					console.error("Payment success handler error:", error);
				}
			},
			modal: {
				ondismiss: async function () {
					// Payment cancelled
					await updatePaymentStatus(paymentId, "cancelled");
					if (onFailure) {
						onFailure({ error: "Payment cancelled by user" });
					}
				},
			},
		};

		// Open Razorpay checkout
		const rzp = new window.Razorpay(razorpayOptions);

		rzp.on("payment.failed", async function (response) {
			await updatePaymentStatus(paymentId, "failed", {
				errorCode: response.error.code,
				errorDescription: response.error.description,
				errorReason: response.error.reason,
			});

			if (onFailure) {
				onFailure(response.error);
			}
		});

		rzp.open();

		return { success: true, paymentId };
	} catch (error) {
		console.error("Payment initiation error:", error);
		return { success: false, error: error.message };
	}
};

/**
 * Update payment status in Firestore
 * @param {string} paymentId - Payment document ID
 * @param {string} status - Payment status
 * @param {Object} metadata - Additional metadata
 */
const updatePaymentStatus = async (paymentId, status, metadata = {}) => {
	try {
		const paymentRef = doc(db, COLLECTIONS.PAYMENTS, paymentId);
		await updateDoc(paymentRef, {
			status,
			...metadata,
			updatedAt: serverTimestamp(),
		});
	} catch (error) {
		console.error("Update payment status error:", error);
	}
};

/**
 * Get payment details
 * @param {string} paymentId - Payment document ID
 * @returns {Promise<Object>} - Payment data
 */
export const getPaymentDetails = async (paymentId) => {
	try {
		const paymentRef = doc(db, COLLECTIONS.PAYMENTS, paymentId);
		const paymentDoc = await getDoc(paymentRef);

		if (paymentDoc.exists()) {
			return {
				success: true,
				data: { id: paymentDoc.id, ...paymentDoc.data() },
			};
		}

		return { success: false, error: "Payment not found" };
	} catch (error) {
		console.error("Get payment details error:", error);
		return { success: false, error: error.message };
	}
};

/**
 * Load Razorpay script
 * @returns {Promise<boolean>} - Success status
 */
export const loadRazorpayScript = () => {
	return new Promise((resolve) => {
		// Check if already loaded
		if (window.Razorpay) {
			resolve(true);
			return;
		}

		const script = document.createElement("script");
		script.src = "https://checkout.razorpay.com/v1/checkout.js";
		script.onload = () => resolve(true);
		script.onerror = () => resolve(false);
		document.body.appendChild(script);
	});
};

/**
 * Verify if Razorpay is available
 * @returns {boolean}
 */
export const isRazorpayAvailable = () => {
	return !!window.Razorpay;
};

export default {
	initiateRazorpayPayment,
	getPaymentDetails,
	loadRazorpayScript,
	isRazorpayAvailable,
};
