import { useState, useEffect } from "react";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const AdminPayments = () => {
	const [transactions, setTransactions] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedTransaction, setSelectedTransaction] = useState(null);
	const [showModal, setShowModal] = useState(false);
	const [timeRange, setTimeRange] = useState("month");

	useEffect(() => {
		const loadTransactions = () => {
			setLoading(true);
			// Simulate API call
			setTimeout(() => {
				setTransactions([
					{
						id: "TXN001",
						type: "donation",
						amount: 5000,
						user: "Arun Menon",
						email: "arun@example.com",
						method: "UPI",
						status: "completed",
						date: "2024-01-20",
						time: "14:30",
						purpose: "Wildlife Conservation",
						frequency: "one-time",
					},
					{
						id: "TXN002",
						type: "donation",
						amount: 10000,
						user: "Dr. Priya Sharma",
						email: "priya@example.com",
						method: "Card",
						status: "completed",
						date: "2024-01-19",
						time: "10:15",
						purpose: "Monthly Support",
						frequency: "monthly",
					},
					{
						id: "TXN003",
						type: "donation",
						amount: 2500,
						user: "Rajesh Kumar",
						email: "rajesh@example.com",
						method: "Net Banking",
						status: "completed",
						date: "2024-01-18",
						time: "16:45",
						purpose: "General Donation",
						frequency: "one-time",
					},
					{
						id: "TXN004",
						type: "donation",
						amount: 1000,
						user: "Meera Iyer",
						email: "meera@example.com",
						method: "Wallet",
						status: "pending",
						date: "2024-01-17",
						time: "12:20",
						purpose: "Wildlife Conservation",
						frequency: "one-time",
					},
					{
						id: "TXN005",
						type: "donation",
						amount: 3000,
						user: "Anonymous",
						email: "anonymous@example.com",
						method: "UPI",
						status: "failed",
						date: "2024-01-16",
						time: "09:30",
						purpose: "General Donation",
						frequency: "one-time",
					},
				]);
				setLoading(false);
			}, 1000);
		};
		loadTransactions();
	}, [timeRange]);

	const handleViewTransaction = (transaction) => {
		setSelectedTransaction(transaction);
		setShowModal(true);
	};

	const getStatusBadge = (status) => {
		const badges = {
			completed: "bg-green-100 text-green-700",
			pending: "bg-yellow-100 text-yellow-700",
			failed: "bg-red-100 text-red-700",
			refunded: "bg-blue-100 text-blue-700",
		};
		return badges[status] || "bg-gray-100 text-gray-700";
	};

	const getMethodIcon = (method) => {
		const icons = {
			UPI: "📱",
			Card: "💳",
			"Net Banking": "🏦",
			Wallet: "👛",
		};
		return icons[method] || "💰";
	};

	const totalRevenue = transactions
		.filter((t) => t.status === "completed")
		.reduce((sum, t) => sum + t.amount, 0);
	const pendingAmount = transactions
		.filter((t) => t.status === "pending")
		.reduce((sum, t) => sum + t.amount, 0);

	if (loading) {
		return <LoadingSpinner message="Loading transactions..." />;
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-[#EDF1D6] via-white to-[#9DC08B]/20 py-8">
			<div className="max-w-7xl mx-auto px-4">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-5xl font-bold text-[#40513B] mb-2">
						💳 Payment Management
					</h1>
					<p className="text-[#609966] text-lg">
						Monitor transactions and revenue
					</p>
				</div>

				{/* Stats Cards */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
					<div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-[#9DC08B]/20 p-6 hover:scale-105 transition-transform">
						<div className="text-4xl mb-2">💰</div>
						<div className="text-2xl font-bold text-[#40513B]">
							₹{totalRevenue.toLocaleString()}
						</div>
						<div className="text-sm text-[#609966]">Total Revenue</div>
					</div>
					<div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-[#9DC08B]/20 p-6 hover:scale-105 transition-transform">
						<div className="text-4xl mb-2">📊</div>
						<div className="text-2xl font-bold text-[#40513B]">
							{transactions.length}
						</div>
						<div className="text-sm text-[#609966]">Total Transactions</div>
					</div>
					<div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-[#9DC08B]/20 p-6 hover:scale-105 transition-transform">
						<div className="text-4xl mb-2">⏳</div>
						<div className="text-2xl font-bold text-[#40513B]">
							₹{pendingAmount.toLocaleString()}
						</div>
						<div className="text-sm text-[#609966]">Pending Amount</div>
					</div>
					<div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-[#9DC08B]/20 p-6 hover:scale-105 transition-transform">
						<div className="text-4xl mb-2">✅</div>
						<div className="text-2xl font-bold text-[#40513B]">
							{transactions.filter((t) => t.status === "completed").length}
						</div>
						<div className="text-sm text-[#609966]">Completed</div>
					</div>
				</div>

				{/* Time Range Filter */}
				<div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-[#9DC08B]/20 p-6 mb-8">
					<div className="flex items-center justify-between">
						<h3 className="text-xl font-bold text-[#40513B]">Time Range</h3>
						<div className="flex space-x-2">
							{["today", "week", "month", "year", "all"].map((range) => (
								<button
									key={range}
									onClick={() => setTimeRange(range)}
									className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
										timeRange === range
											? "bg-[#609966] text-white"
											: "bg-[#EDF1D6] text-[#609966] hover:bg-[#9DC08B]/30"
									}`}
								>
									{range.charAt(0).toUpperCase() + range.slice(1)}
								</button>
							))}
						</div>
					</div>
				</div>

				{/* Transactions Table */}
				<div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border-2 border-[#9DC08B]/20 overflow-hidden">
					<div className="p-6 bg-[#EDF1D6] border-b-2 border-[#9DC08B]/20">
						<h2 className="text-2xl font-bold text-[#40513B]">
							Recent Transactions
						</h2>
					</div>
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-[#EDF1D6]/50">
								<tr>
									<th className="px-6 py-4 text-left text-sm font-bold text-[#40513B]">
										Transaction ID
									</th>
									<th className="px-6 py-4 text-left text-sm font-bold text-[#40513B]">
										User
									</th>
									<th className="px-6 py-4 text-left text-sm font-bold text-[#40513B]">
										Amount
									</th>
									<th className="px-6 py-4 text-left text-sm font-bold text-[#40513B]">
										Method
									</th>
									<th className="px-6 py-4 text-left text-sm font-bold text-[#40513B]">
										Status
									</th>
									<th className="px-6 py-4 text-left text-sm font-bold text-[#40513B]">
										Date & Time
									</th>
									<th className="px-6 py-4 text-left text-sm font-bold text-[#40513B]">
										Actions
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-[#EDF1D6]">
								{transactions.map((transaction) => (
									<tr
										key={transaction.id}
										className="hover:bg-[#EDF1D6]/50 transition-colors"
									>
										<td className="px-6 py-4">
											<div className="font-mono text-sm font-bold text-[#40513B]">
												{transaction.id}
											</div>
										</td>
										<td className="px-6 py-4">
											<div>
												<div className="font-bold text-[#40513B]">
													{transaction.user}
												</div>
												<div className="text-xs text-[#609966]">
													{transaction.email}
												</div>
											</div>
										</td>
										<td className="px-6 py-4">
											<div className="font-bold text-[#609966] text-lg">
												₹{transaction.amount.toLocaleString()}
											</div>
											{transaction.frequency === "monthly" && (
												<span className="text-xs text-[#609966]">
													🔄 Monthly
												</span>
											)}
										</td>
										<td className="px-6 py-4">
											<div className="flex items-center space-x-2">
												<span className="text-2xl">
													{getMethodIcon(transaction.method)}
												</span>
												<span className="text-sm text-[#609966]">
													{transaction.method}
												</span>
											</div>
										</td>
										<td className="px-6 py-4">
											<span
												className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(
													transaction.status
												)}`}
											>
												{transaction.status}
											</span>
										</td>
										<td className="px-6 py-4">
											<div className="text-sm text-[#609966]">
												<div>📅 {transaction.date}</div>
												<div>🕐 {transaction.time}</div>
											</div>
										</td>
										<td className="px-6 py-4">
											<button
												onClick={() => handleViewTransaction(transaction)}
												className="px-4 py-2 bg-[#609966] text-white rounded-lg text-xs font-bold hover:bg-[#40513B] transition-colors"
											>
												View Details
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>

				{/* Transaction Detail Modal */}
				{showModal && selectedTransaction && (
					<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
						<div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
							<div className="p-8">
								<div className="flex items-center justify-between mb-6">
									<h2 className="text-3xl font-bold text-[#40513B]">
										Transaction Details
									</h2>
									<button
										onClick={() => setShowModal(false)}
										className="text-3xl text-[#609966] hover:text-[#40513B]"
									>
										×
									</button>
								</div>

								<div className="space-y-6">
									{/* Status Banner */}
									<div
										className={`p-6 rounded-2xl text-center ${
											selectedTransaction.status === "completed"
												? "bg-green-100"
												: selectedTransaction.status === "pending"
													? "bg-yellow-100"
													: "bg-red-100"
										}`}
									>
										<div className="text-6xl mb-2">
											{selectedTransaction.status === "completed"
												? "✅"
												: selectedTransaction.status === "pending"
													? "⏳"
													: "❌"}
										</div>
										<span
											className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusBadge(
												selectedTransaction.status
											)}`}
										>
											{selectedTransaction.status.toUpperCase()}
										</span>
									</div>

									{/* Info Grid */}
									<div className="grid grid-cols-2 gap-4">
										<div className="col-span-2 p-4 bg-[#EDF1D6] rounded-xl">
											<div className="text-sm text-[#609966] mb-1">
												Transaction ID
											</div>
											<div className="font-mono font-bold text-[#40513B] text-xl">
												{selectedTransaction.id}
											</div>
										</div>
										<div className="col-span-2 p-4 bg-[#EDF1D6] rounded-xl">
											<div className="text-sm text-[#609966] mb-1">Amount</div>
											<div className="font-bold text-[#40513B] text-3xl">
												₹{selectedTransaction.amount.toLocaleString()}
											</div>
										</div>
										<div className="p-4 bg-[#EDF1D6] rounded-xl">
											<div className="text-sm text-[#609966] mb-1">User</div>
											<div className="font-bold text-[#40513B]">
												{selectedTransaction.user}
											</div>
											<div className="text-xs text-[#609966]">
												{selectedTransaction.email}
											</div>
										</div>
										<div className="p-4 bg-[#EDF1D6] rounded-xl">
											<div className="text-sm text-[#609966] mb-1">
												Payment Method
											</div>
											<div className="font-bold text-[#40513B]">
												{getMethodIcon(selectedTransaction.method)}{" "}
												{selectedTransaction.method}
											</div>
										</div>
										<div className="p-4 bg-[#EDF1D6] rounded-xl">
											<div className="text-sm text-[#609966] mb-1">Date</div>
											<div className="font-bold text-[#40513B]">
												📅 {selectedTransaction.date}
											</div>
										</div>
										<div className="p-4 bg-[#EDF1D6] rounded-xl">
											<div className="text-sm text-[#609966] mb-1">Time</div>
											<div className="font-bold text-[#40513B]">
												🕐 {selectedTransaction.time}
											</div>
										</div>
										<div className="p-4 bg-[#EDF1D6] rounded-xl">
											<div className="text-sm text-[#609966] mb-1">Purpose</div>
											<div className="font-bold text-[#40513B]">
												{selectedTransaction.purpose}
											</div>
										</div>
										<div className="p-4 bg-[#EDF1D6] rounded-xl">
											<div className="text-sm text-[#609966] mb-1">
												Frequency
											</div>
											<div className="font-bold text-[#40513B]">
												{selectedTransaction.frequency === "monthly"
													? "🔄 Monthly"
													: "One-time"}
											</div>
										</div>
									</div>

									{/* Close Button */}
									<button
										onClick={() => setShowModal(false)}
										className="w-full px-6 py-3 bg-[#609966] text-white rounded-xl font-bold hover:bg-[#40513B] transition-colors"
									>
										Close
									</button>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default AdminPayments;
