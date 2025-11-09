// usePayment Hook - Razorpay payment processing
import { useState, useCallback } from "react";
import {
	initializeRazorpay,
	createRazorpayOrder,
	verifyPaymentSignature,
} from "../services/paymentService";
import {
	calculateTotalWithFees,
	calculatePlatformFee,
} from "../utils/paymentCalculator";

export const usePayment = () => {
	const [processing, setProcessing] = useState(false);
	const [error, setError] = useState(null);
	const [paymentResult, setPaymentResult] = useState(null);

	// Initialize Razorpay SDK
	const initRazorpay = useCallback(async () => {
		try {
			const initialized = await initializeRazorpay();
			if (!initialized) {
				throw new Error("Failed to load Razorpay SDK");
			}
			return initialized;
		} catch (err) {
			console.error("Error initializing Razorpay:", err);
			setError(err.message);
			throw err;
		}
	}, []);

	// Process payment
	const processPayment = useCallback(
		async (paymentData) => {
			setProcessing(true);
			setError(null);
			setPaymentResult(null);

			try {
				// Ensure Razorpay is loaded
				await initRazorpay();

				// Calculate amounts
				const platformFee = calculatePlatformFee(paymentData.amount);
				const totalAmount = calculateTotalWithFees(paymentData.amount);

				// Create order details
				const orderData = {
					amount: totalAmount,
					currency: paymentData.currency || "INR",
					notes: {
						...paymentData.notes,
						originalAmount: paymentData.amount,
						platformFee: platformFee,
						type: paymentData.type || "donation",
					},
				};

				// Open Razorpay checkout
				const result = await createRazorpayOrder(orderData, {
					name: paymentData.recipientName || "Wildlife Valparai",
					description:
						paymentData.description || "Support wildlife conservation",
					prefill: {
						name: paymentData.userName,
						email: paymentData.userEmail,
						contact: paymentData.userPhone,
					},
				});

				setPaymentResult(result);
				return result;
			} catch (err) {
				console.error("Error processing payment:", err);
				setError(err.message);
				throw err;
			} finally {
				setProcessing(false);
			}
		},
		[initRazorpay]
	);

	// Process donation
	const processDonation = useCallback(
		async (donationData) => {
			const paymentData = {
				amount: donationData.amount,
				currency: "INR",
				type: "donation",
				recipientName: donationData.recipientName,
				description: `Donation to ${donationData.recipientName}`,
				userName: donationData.userName,
				userEmail: donationData.userEmail,
				userPhone: donationData.userPhone,
				notes: {
					donorId: donationData.donorId,
					recipientId: donationData.recipientId,
					message: donationData.message,
				},
			};

			return await processPayment(paymentData);
		},
		[processPayment]
	);

	// Process content purchase
	const purchaseContent = useCallback(
		async (purchaseData) => {
			const paymentData = {
				amount: purchaseData.amount,
				currency: "INR",
				type: "purchase",
				recipientName: purchaseData.creatorName,
				description: `Purchase: ${purchaseData.contentTitle}`,
				userName: purchaseData.userName,
				userEmail: purchaseData.userEmail,
				userPhone: purchaseData.userPhone,
				notes: {
					buyerId: purchaseData.buyerId,
					creatorId: purchaseData.creatorId,
					contentId: purchaseData.contentId,
					contentType: purchaseData.contentType,
				},
			};

			return await processPayment(paymentData);
		},
		[processPayment]
	);

	// Verify payment signature (for additional security)
	const verifyPayment = useCallback(async (paymentId, orderId, signature) => {
		try {
			const isValid = verifyPaymentSignature(paymentId, orderId, signature);
			if (!isValid) {
				throw new Error("Payment signature verification failed");
			}
			return isValid;
		} catch (err) {
			console.error("Error verifying payment:", err);
			setError(err.message);
			throw err;
		}
	}, []);

	// Calculate payment preview
	const calculatePaymentPreview = useCallback((amount) => {
		const platformFee = calculatePlatformFee(amount);
		const total = calculateTotalWithFees(amount);
		const razorpayFee = total - amount - platformFee;

		return {
			baseAmount: amount,
			platformFee: platformFee,
			razorpayFee: razorpayFee,
			totalAmount: total,
			breakdown: {
				"Base Amount": amount,
				"Platform Fee (2%)": platformFee,
				"Razorpay Fee": razorpayFee,
				"Total Amount": total,
			},
		};
	}, []);

	// Reset state
	const reset = useCallback(() => {
		setProcessing(false);
		setError(null);
		setPaymentResult(null);
	}, []);

	return {
		processing,
		error,
		paymentResult,
		initRazorpay,
		processPayment,
		processDonation,
		purchaseContent,
		verifyPayment,
		calculatePaymentPreview,
		reset,
	};
};

export default usePayment;
