// Payment Calculator Utilities

/**
 * Calculate platform fee (if applicable)
 * @param {number} amount - Donation amount
 * @param {number} feePercentage - Fee percentage (default: 0 for now)
 * @returns {number} - Platform fee
 */
export const calculatePlatformFee = (amount, feePercentage = 0) => {
	return (amount * feePercentage) / 100;
};

/**
 * Calculate net amount after fees
 * @param {number} amount - Gross amount
 * @param {number} feePercentage - Fee percentage
 * @returns {number} - Net amount
 */
export const calculateNetAmount = (amount, feePercentage = 0) => {
	const fee = calculatePlatformFee(amount, feePercentage);
	return amount - fee;
};

/**
 * Calculate Razorpay transaction fee
 * Razorpay charges 2% + GST (18%) on transaction amount
 * @param {number} amount - Transaction amount in INR
 * @returns {Object} - Fee breakdown
 */
export const calculateRazorpayFee = (amount) => {
	const transactionFee = amount * 0.02; // 2% of amount
	const gst = transactionFee * 0.18; // 18% GST on transaction fee
	const totalFee = transactionFee + gst;
	const netAmount = amount - totalFee;

	return {
		amount,
		transactionFee: parseFloat(transactionFee.toFixed(2)),
		gst: parseFloat(gst.toFixed(2)),
		totalFee: parseFloat(totalFee.toFixed(2)),
		netAmount: parseFloat(netAmount.toFixed(2)),
	};
};

/**
 * Format amount in INR currency
 * @param {number} amount - Amount to format
 * @returns {string} - Formatted amount
 */
export const formatINR = (amount) => {
	return new Intl.NumberFormat("en-IN", {
		style: "currency",
		currency: "INR",
		minimumFractionDigits: 2,
	}).format(amount);
};

/**
 * Convert paise to rupees
 * @param {number} paise - Amount in paise
 * @returns {number} - Amount in rupees
 */
export const paiseToRupees = (paise) => {
	return paise / 100;
};

/**
 * Convert rupees to paise
 * @param {number} rupees - Amount in rupees
 * @returns {number} - Amount in paise
 */
export const rupeesToPaise = (rupees) => {
	return Math.round(rupees * 100);
};

/**
 * Calculate monthly payout for creators
 * @param {number} totalPoints - Total points earned
 * @param {number} totalPool - Total payout pool
 * @param {number} totalPointsAllUsers - Total points of all users
 * @returns {number} - Payout amount
 */
export const calculateCreatorPayout = (
	totalPoints,
	totalPool,
	totalPointsAllUsers
) => {
	if (totalPointsAllUsers === 0) return 0;
	const share = totalPoints / totalPointsAllUsers;
	return parseFloat((share * totalPool).toFixed(2));
};

/**
 * Calculate top performer bonus
 * @param {number} rank - User rank
 * @param {number} bonusPool - Total bonus pool
 * @returns {number} - Bonus amount
 */
export const calculateTopPerformerBonus = (rank, bonusPool) => {
	const bonusDistribution = {
		1: 0.3, // 30% for 1st place
		2: 0.2, // 20% for 2nd place
		3: 0.15, // 15% for 3rd place
		4: 0.1, // 10% for 4th place
		5: 0.08, // 8% for 5th place
		6: 0.05, // 5% for 6th-10th place
		7: 0.05,
		8: 0.05,
		9: 0.01,
		10: 0.01,
	};

	const percentage = bonusDistribution[rank] || 0;
	return parseFloat((percentage * bonusPool).toFixed(2));
};

/**
 * Validate donation amount
 * @param {number} amount - Donation amount
 * @param {number} minAmount - Minimum allowed amount
 * @returns {Object} - Validation result
 */
export const validateDonationAmount = (amount, minAmount = 10) => {
	if (typeof amount !== "number" || isNaN(amount)) {
		return { valid: false, message: "Invalid amount" };
	}
	if (amount < minAmount) {
		return {
			valid: false,
			message: `Minimum donation amount is ₹${minAmount}`,
		};
	}
	return { valid: true };
};

/**
 * Generate payment receipt data
 * @param {Object} payment - Payment object
 * @returns {Object} - Receipt data
 */
export const generateReceiptData = (payment) => {
	return {
		receiptId: `WV${Date.now()}`,
		date: new Date().toISOString(),
		amount: payment.amount,
		currency: "INR",
		paymentMethod: payment.method || "UPI",
		transactionId: payment.transactionId,
		status: payment.status,
		donor: payment.donor,
	};
};

/**
 * Calculate total donations for a period
 * @param {Array} donations - Array of donation objects
 * @param {number} days - Number of days to look back
 * @returns {number} - Total amount
 */
export const calculateTotalDonations = (donations, days = 30) => {
	const cutoffDate = Date.now() - days * 24 * 60 * 60 * 1000;
	return donations
		.filter((d) => d.timestamp >= cutoffDate)
		.reduce((sum, d) => sum + d.amount, 0);
};

/**
 * Group donations by month
 * @param {Array} donations - Array of donation objects
 * @returns {Object} - Donations grouped by month
 */
export const groupDonationsByMonth = (donations) => {
	const grouped = {};

	donations.forEach((donation) => {
		const date = new Date(donation.timestamp);
		const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

		if (!grouped[key]) {
			grouped[key] = {
				month: key,
				total: 0,
				count: 0,
				donations: [],
			};
		}

		grouped[key].total += donation.amount;
		grouped[key].count++;
		grouped[key].donations.push(donation);
	});

	return grouped;
};

/**
 * Calculate average donation amount
 * @param {Array} donations - Array of donation objects
 * @returns {number} - Average amount
 */
export const calculateAverageDonation = (donations) => {
	if (donations.length === 0) return 0;
	const total = donations.reduce((sum, d) => sum + d.amount, 0);
	return parseFloat((total / donations.length).toFixed(2));
};

export default {
	calculatePlatformFee,
	calculateNetAmount,
	calculateRazorpayFee,
	formatINR,
	paiseToRupees,
	rupeesToPaise,
	calculateCreatorPayout,
	calculateTopPerformerBonus,
	validateDonationAmount,
	generateReceiptData,
	calculateTotalDonations,
	groupDonationsByMonth,
	calculateAverageDonation,
};
