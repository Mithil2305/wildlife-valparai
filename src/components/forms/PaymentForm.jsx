import { useState } from "react";
import { usePayment } from "../../hooks/usePayment";
import LoadingSpinner from "../common/LoadingSpinner";

const PaymentForm = ({ amount, purpose, metadata, onSuccess, onCancel }) => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
	});
	const [processing, setProcessing] = useState(false);
	const [error, setError] = useState("");
	const { initializePayment, verifyPayment } = usePayment();

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setProcessing(true);

		try {
			const paymentData = {
				amount: parseInt(amount),
				purpose,
				...formData,
				...metadata,
				createdAt: new Date().toISOString(),
			};

			const result = await initializePayment(paymentData);

			if (result.success) {
				await verifyPayment(result.paymentId);
				onSuccess && onSuccess(result);
			}
		} catch (err) {
			setError(err.message || "Payment failed. Please try again.");
		} finally {
			setProcessing(false);
		}
	};

	if (processing) {
		return <LoadingSpinner message="Processing your payment..." />;
	}

	return (
		<div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-2 border-[#9DC08B]/20 max-w-2xl mx-auto">
			<div className="text-center mb-8">
				<h2 className="text-3xl font-bold text-[#40513B] mb-2 flex items-center justify-center">
					<span className="mr-3 text-4xl">💳</span>
					Complete Payment
				</h2>
				<p className="text-[#609966]">{purpose}</p>
			</div>

			{/* Payment Summary */}
			<div className="bg-gradient-to-r from-[#EDF1D6] to-[#9DC08B]/20 rounded-2xl p-6 mb-6">
				<div className="flex justify-between items-center mb-4">
					<span className="text-[#40513B] font-medium">Amount to Pay</span>
					<span className="text-3xl font-bold text-[#609966]">
						₹{amount?.toLocaleString()}
					</span>
				</div>

				{metadata && Object.keys(metadata).length > 0 && (
					<div className="border-t-2 border-[#9DC08B]/20 pt-4 mt-4 space-y-2">
						{Object.entries(metadata).map(([key, value]) => (
							<div key={key} className="flex justify-between text-sm">
								<span className="text-[#609966] capitalize">
									{key.replace(/([A-Z])/g, " $1").trim()}:
								</span>
								<span className="text-[#40513B] font-medium">{value}</span>
							</div>
						))}
					</div>
				)}
			</div>

			{error && (
				<div className="mb-6 p-4 bg-red-100 border-2 border-red-300 text-red-700 rounded-2xl">
					{error}
				</div>
			)}

			<form onSubmit={handleSubmit} className="space-y-6">
				{/* Contact Information */}
				<div>
					<label
						htmlFor="name"
						className="block text-sm font-bold text-[#40513B] mb-2"
					>
						Full Name *
					</label>
					<input
						type="text"
						id="name"
						name="name"
						value={formData.name}
						onChange={handleChange}
						required
						className="w-full px-4 py-3 rounded-xl border-2 border-[#9DC08B]/30 focus:border-[#609966] focus:outline-none transition-colors bg-white/50"
						placeholder="Enter your full name"
					/>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<label
							htmlFor="email"
							className="block text-sm font-bold text-[#40513B] mb-2"
						>
							Email Address *
						</label>
						<input
							type="email"
							id="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
							required
							className="w-full px-4 py-3 rounded-xl border-2 border-[#9DC08B]/30 focus:border-[#609966] focus:outline-none transition-colors bg-white/50"
							placeholder="your@email.com"
						/>
					</div>

					<div>
						<label
							htmlFor="phone"
							className="block text-sm font-bold text-[#40513B] mb-2"
						>
							Phone Number *
						</label>
						<input
							type="tel"
							id="phone"
							name="phone"
							value={formData.phone}
							onChange={handleChange}
							required
							pattern="[0-9]{10}"
							className="w-full px-4 py-3 rounded-xl border-2 border-[#9DC08B]/30 focus:border-[#609966] focus:outline-none transition-colors bg-white/50"
							placeholder="1234567890"
						/>
					</div>
				</div>

				{/* Payment Methods */}
				<div>
					<label className="block text-sm font-bold text-[#40513B] mb-3">
						Payment Method
					</label>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						{[
							{ method: "card", icon: "💳", label: "Card" },
							{ method: "upi", icon: "📱", label: "UPI" },
							{ method: "netbanking", icon: "🏦", label: "Net Banking" },
							{ method: "wallet", icon: "👛", label: "Wallet" },
						].map((option) => (
							<div
								key={option.method}
								className="flex flex-col items-center justify-center p-4 bg-[#EDF1D6] rounded-xl border-2 border-[#9DC08B]/20 hover:border-[#609966] hover:bg-[#9DC08B]/20 transition-all cursor-pointer"
							>
								<span className="text-3xl mb-2">{option.icon}</span>
								<span className="text-sm font-medium text-[#40513B]">
									{option.label}
								</span>
							</div>
						))}
					</div>
					<p className="text-xs text-[#609966]/60 mt-3 text-center">
						You'll be redirected to Razorpay for secure payment
					</p>
				</div>

				{/* Security Info */}
				<div className="bg-[#EDF1D6]/50 rounded-2xl p-4 border-2 border-[#9DC08B]/20">
					<div className="flex items-start space-x-3">
						<span className="text-2xl">🔒</span>
						<div className="flex-1">
							<h4 className="font-bold text-[#40513B] mb-1">
								Secure Payment Gateway
							</h4>
							<ul className="text-sm text-[#609966] space-y-1">
								<li>✅ 256-bit SSL encryption</li>
								<li>✅ PCI DSS compliant</li>
								<li>✅ Instant payment confirmation</li>
							</ul>
						</div>
					</div>
				</div>

				{/* Terms & Conditions */}
				<div className="flex items-start space-x-3">
					<input
						type="checkbox"
						id="terms"
						required
						className="mt-1 w-5 h-5 rounded border-2 border-[#9DC08B] text-[#609966] focus:ring-[#609966]"
					/>
					<label htmlFor="terms" className="text-sm text-[#40513B]">
						I agree to the{" "}
						<a
							href="/terms"
							className="text-[#609966] hover:underline font-medium"
						>
							Terms & Conditions
						</a>{" "}
						and{" "}
						<a
							href="/privacy"
							className="text-[#609966] hover:underline font-medium"
						>
							Privacy Policy
						</a>
					</label>
				</div>

				{/* Action Buttons */}
				<div className="flex space-x-4 pt-4">
					<button
						type="submit"
						disabled={processing}
						className="flex-1 px-8 py-4 bg-gradient-to-r from-[#609966] to-[#40513B] text-white rounded-2xl font-bold text-lg hover:scale-105 hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{processing ? "Processing..." : `Pay ₹${amount?.toLocaleString()}`}
					</button>
					{onCancel && (
						<button
							type="button"
							onClick={onCancel}
							disabled={processing}
							className="px-8 py-4 bg-white border-2 border-[#9DC08B]/30 text-[#609966] rounded-2xl font-bold text-lg hover:bg-[#EDF1D6] transition-all"
						>
							Cancel
						</button>
					)}
				</div>
			</form>

			{/* Support Info */}
			<div className="mt-6 text-center text-sm text-[#609966]/80">
				Need help? Contact us at{" "}
				<a
					href="mailto:support@wildlifevalparai.org"
					className="font-medium hover:underline"
				>
					support@wildlifevalparai.org
				</a>
			</div>
		</div>
	);
};

export default PaymentForm;
