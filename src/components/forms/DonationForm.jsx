import { useState } from "react";
import { usePayment } from "../../hooks/usePayment";
import LoadingSpinner from "../common/LoadingSpinner";

const DonationForm = ({ onSuccess, onCancel }) => {
	const [amount, setAmount] = useState("");
	const [customAmount, setCustomAmount] = useState("");
	const [frequency, setFrequency] = useState("once");
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		message: "",
		anonymous: false,
	});
	const [processing, setProcessing] = useState(false);
	const [error, setError] = useState("");
	const { initializePayment } = usePayment();

	const predefinedAmounts = [500, 1000, 2500, 5000, 10000];

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData({
			...formData,
			[name]: type === "checkbox" ? checked : value,
		});
	};

	const handleAmountSelect = (value) => {
		setAmount(value);
		setCustomAmount("");
	};

	const handleCustomAmount = (e) => {
		const value = e.target.value;
		if (value === "" || /^\d+$/.test(value)) {
			setCustomAmount(value);
			setAmount("");
		}
	};

	const getFinalAmount = () => {
		return customAmount || amount;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		const finalAmount = getFinalAmount();
		if (!finalAmount || finalAmount < 100) {
			setError("Minimum donation amount is ₹100");
			return;
		}

		setProcessing(true);
		try {
			const donationData = {
				amount: parseInt(finalAmount),
				frequency,
				...formData,
				type: "donation",
				createdAt: new Date().toISOString(),
			};

			await initializePayment(donationData);
			onSuccess && onSuccess(donationData);
		} catch (err) {
			setError(err.message || "Failed to process donation");
		} finally {
			setProcessing(false);
		}
	};

	if (processing) {
		return <LoadingSpinner message="Processing your donation..." />;
	}

	return (
		<div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-2 border-[#9DC08B]/20">
			<div className="text-center mb-8">
				<h2 className="text-4xl font-bold text-[#40513B] mb-3 flex items-center justify-center">
					<span className="mr-3 text-5xl">💚</span>
					Support Wildlife Conservation
				</h2>
				<p className="text-[#609966] text-lg">
					Your donation helps protect wildlife in Valparai
				</p>
			</div>

			{error && (
				<div className="mb-6 p-4 bg-red-100 border-2 border-red-300 text-red-700 rounded-2xl">
					{error}
				</div>
			)}

			<form onSubmit={handleSubmit} className="space-y-6">
				{/* Frequency Selection */}
				<div>
					<label className="block text-sm font-bold text-[#40513B] mb-3">
						Donation Frequency
					</label>
					<div className="grid grid-cols-2 gap-4">
						<label
							className={`flex items-center justify-center space-x-2 px-6 py-4 rounded-xl border-2 cursor-pointer transition-all ${
								frequency === "once"
									? "border-[#609966] bg-[#609966]/10"
									: "border-[#9DC08B]/30 hover:border-[#9DC08B]"
							}`}
						>
							<input
								type="radio"
								name="frequency"
								value="once"
								checked={frequency === "once"}
								onChange={(e) => setFrequency(e.target.value)}
								className="hidden"
							/>
							<span className="text-2xl">💝</span>
							<span className="font-medium text-[#40513B]">One-time</span>
						</label>
						<label
							className={`flex items-center justify-center space-x-2 px-6 py-4 rounded-xl border-2 cursor-pointer transition-all ${
								frequency === "monthly"
									? "border-[#609966] bg-[#609966]/10"
									: "border-[#9DC08B]/30 hover:border-[#9DC08B]"
							}`}
						>
							<input
								type="radio"
								name="frequency"
								value="monthly"
								checked={frequency === "monthly"}
								onChange={(e) => setFrequency(e.target.value)}
								className="hidden"
							/>
							<span className="text-2xl">🔄</span>
							<span className="font-medium text-[#40513B]">Monthly</span>
						</label>
					</div>
				</div>

				{/* Amount Selection */}
				<div>
					<label className="block text-sm font-bold text-[#40513B] mb-3">
						Select Amount (₹)
					</label>
					<div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-4">
						{predefinedAmounts.map((value) => (
							<button
								key={value}
								type="button"
								onClick={() => handleAmountSelect(value)}
								className={`px-4 py-3 rounded-xl font-bold transition-all ${
									amount === value
										? "bg-gradient-to-r from-[#609966] to-[#40513B] text-white scale-105 shadow-lg"
										: "bg-[#EDF1D6] text-[#609966] hover:bg-[#9DC08B]/30"
								}`}
							>
								₹{value.toLocaleString()}
							</button>
						))}
					</div>

					<div className="relative">
						<span className="absolute left-4 top-3 text-[#609966] font-bold text-lg">
							₹
						</span>
						<input
							type="text"
							value={customAmount}
							onChange={handleCustomAmount}
							placeholder="Enter custom amount"
							className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-[#9DC08B]/30 focus:border-[#609966] focus:outline-none transition-colors bg-white/50 font-medium text-lg"
						/>
					</div>
					<p className="text-xs text-[#609966]/60 mt-2">Minimum: ₹100</p>
				</div>

				{/* Impact Display */}
				{getFinalAmount() && (
					<div className="bg-gradient-to-r from-[#EDF1D6] to-[#9DC08B]/20 rounded-2xl p-6">
						<h3 className="text-lg font-bold text-[#40513B] mb-3">
							Your Impact 🌟
						</h3>
						<div className="space-y-2 text-sm text-[#609966]">
							{getFinalAmount() >= 500 && (
								<p>✅ Help monitor 1 wildlife corridor for a month</p>
							)}
							{getFinalAmount() >= 1000 && (
								<p>✅ Support educational programs for local communities</p>
							)}
							{getFinalAmount() >= 2500 && (
								<p>✅ Fund wildlife rescue and rehabilitation efforts</p>
							)}
							{getFinalAmount() >= 5000 && (
								<p>✅ Contribute to habitat restoration projects</p>
							)}
						</div>
					</div>
				)}

				{/* Donor Information */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
							disabled={formData.anonymous}
							className="w-full px-4 py-3 rounded-xl border-2 border-[#9DC08B]/30 focus:border-[#609966] focus:outline-none transition-colors bg-white/50 disabled:opacity-50"
							placeholder="Your name"
						/>
					</div>

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
				</div>

				<div>
					<label
						htmlFor="phone"
						className="block text-sm font-bold text-[#40513B] mb-2"
					>
						Phone Number
					</label>
					<input
						type="tel"
						id="phone"
						name="phone"
						value={formData.phone}
						onChange={handleChange}
						className="w-full px-4 py-3 rounded-xl border-2 border-[#9DC08B]/30 focus:border-[#609966] focus:outline-none transition-colors bg-white/50"
						placeholder="+91 1234567890"
					/>
				</div>

				<div>
					<label
						htmlFor="message"
						className="block text-sm font-bold text-[#40513B] mb-2"
					>
						Message (Optional)
					</label>
					<textarea
						id="message"
						name="message"
						value={formData.message}
						onChange={handleChange}
						rows={3}
						className="w-full px-4 py-3 rounded-xl border-2 border-[#9DC08B]/30 focus:border-[#609966] focus:outline-none transition-colors bg-white/50 resize-none"
						placeholder="Share why you're supporting wildlife conservation..."
					/>
				</div>

				{/* Anonymous Donation */}
				<div className="flex items-center space-x-3">
					<input
						type="checkbox"
						id="anonymous"
						name="anonymous"
						checked={formData.anonymous}
						onChange={handleChange}
						className="w-5 h-5 rounded border-2 border-[#9DC08B] text-[#609966] focus:ring-[#609966]"
					/>
					<label
						htmlFor="anonymous"
						className="text-sm text-[#40513B] cursor-pointer"
					>
						🕶️ Make this donation anonymous
					</label>
				</div>

				{/* Payment Info */}
				<div className="bg-[#EDF1D6]/50 rounded-2xl p-4 border-2 border-[#9DC08B]/20">
					<p className="text-sm text-[#609966] flex items-center">
						<span className="mr-2">🔒</span>
						Secure payment powered by Razorpay. Your information is safe.
					</p>
				</div>

				{/* Action Buttons */}
				<div className="flex space-x-4 pt-4">
					<button
						type="submit"
						disabled={processing || !getFinalAmount()}
						className="flex-1 px-8 py-4 bg-gradient-to-r from-[#609966] to-[#40513B] text-white rounded-2xl font-bold text-lg hover:scale-105 hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{processing ? "Processing..." : `Donate ₹${getFinalAmount() || 0}`}
					</button>
					{onCancel && (
						<button
							type="button"
							onClick={onCancel}
							className="px-8 py-4 bg-white border-2 border-[#9DC08B]/30 text-[#609966] rounded-2xl font-bold text-lg hover:bg-[#EDF1D6] transition-all"
						>
							Cancel
						</button>
					)}
				</div>
			</form>

			{/* Tax Benefit Info */}
			<div className="mt-6 text-center text-sm text-[#609966]/80">
				💡 Donations are eligible for 80G tax benefits
			</div>
		</div>
	);
};

export default DonationForm;
