import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	HiHome,
	HiUserGroup,
	HiCurrencyRupee,
	HiShieldCheck,
	HiPhotograph,
	HiDocumentText,
	HiTrash,
	HiCheck,
	HiPlus,
	HiStar,
	HiX,
	HiTrendingUp,
	HiQrcode,
	HiFlag,
	HiTicket,
	HiRefresh,
	HiEye,
	HiBan,
	HiCheckCircle,
	HiXCircle,
} from "react-icons/hi";
import { toast } from "react-hot-toast";
import {
	getDbInstance,
	getUsersCollection,
	getPostsCollection,
	getSponsorsCollection,
	getAuthInstance,
} from "../services/firebase.js";
import {
	getDocs,
	deleteDoc,
	doc,
	addDoc,
	serverTimestamp,
	getDoc,
} from "firebase/firestore";
import { calculateLeaderboard } from "../services/leaderboard.js";
import { createPayment } from "../services/payments.js";
import {
	getAllReportedPosts,
	getPostReports,
	adminRestorePost,
	adminPermanentDelete,
} from "../services/reportApi.js";
import {
	getAllTickets,
	approveTicket,
	rejectTicket,
} from "../services/ticketApi.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";

// --- Components ---

const SidebarItem = ({ icon: Icon, label, isActive, onClick }) => (
	<button
		onClick={onClick}
		className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
			isActive
				? "bg-[#335833] text-white shadow-lg shadow-green-900/20"
				: "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
		}`}
	>
		<Icon size={20} />
		<span className="hidden md:block">{label}</span>
	</button>
);

const StatCard = ({ label, value, icon: Icon, color, trend }) => (
	<div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-shadow">
		<div className={`absolute top-0 right-0 p-4 opacity-10 ${color}`}>
			<Icon size={64} />
		</div>
		<div className="relative z-10">
			<div
				className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${color} shadow-sm`}
			>
				<Icon size={24} className="text-white" />
			</div>
			<h3 className="text-3xl font-extrabold text-gray-900 mb-1">{value}</h3>
			<p className="text-gray-500 text-sm font-medium uppercase tracking-wide">
				{label}
			</p>
			{trend && (
				<div className="flex items-center gap-1 text-xs font-bold text-green-600 mt-2 bg-green-50 w-fit px-2 py-1 rounded-full">
					<HiTrendingUp /> {trend}
				</div>
			)}
		</div>
	</div>
);

const PaymentModal = ({ user, onClose, onSuccess }) => {
	const [amount, setAmount] = useState("");
	const [loading, setLoading] = useState(false);
	const [upiId, setUpiId] = useState("Loading...");
	const [isMarkedPaid, setIsMarkedPaid] = useState(false);
	const db = getDbInstance();

	useEffect(() => {
		const fetchDetails = async () => {
			if (user?.userId) {
				try {
					const docSnap = await getDoc(doc(db, "users", user.userId));
					if (docSnap.exists()) {
						setUpiId(docSnap.data().upiId || "Not Linked");
					}
				} catch (_e) {
					setUpiId("Error fetching");
				}
			}
		};
		fetchDetails();
	}, [user, db]);

	const handlePay = async (e) => {
		e.preventDefault();

		if (!isMarkedPaid) {
			return toast.error("Please confirm payment via checkbox");
		}

		if (!amount || amount <= 0) return toast.error("Invalid amount");

		setLoading(true);
		try {
			await createPayment(user.userId, Number(amount), "Monthly Prize Payout");
			toast.success(`Marked as paid: ₹${amount} to ${user.name}`);
			onSuccess();
			onClose();
		} catch (error) {
			console.error(error);
			toast.error("Payment recording failed");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
			<motion.div
				initial={{ scale: 0.9, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl border border-gray-100"
			>
				<div className="flex justify-between items-center mb-6">
					<h3 className="text-xl font-bold text-gray-900">Issue Payout</h3>
					<button
						onClick={onClose}
						className="p-2 hover:bg-gray-100 rounded-full text-gray-500 hover:text-gray-900 transition-colors"
					>
						<HiX />
					</button>
				</div>

				{/* User Info Card */}
				<div className="flex items-center gap-4 mb-6 bg-gray-50 p-4 rounded-2xl border border-gray-100">
					<img
						src={
							user.profilePhotoUrl ||
							`https://ui-avatars.com/api/?name=${user.name}`
						}
						alt={user.name}
						className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-sm"
					/>
					<div>
						<p className="font-bold text-gray-900">{user.name}</p>
						<div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
							<span className="flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-gray-200">
								<HiQrcode className="text-[#335833]" />
								{upiId}
							</span>
						</div>
					</div>
				</div>

				<form onSubmit={handlePay} className="space-y-6">
					<div>
						<label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
							Prize Amount
						</label>
						<div className="relative">
							<span className="absolute left-4 top-3.5 text-gray-400 font-bold">
								₹
							</span>
							<input
								type="number"
								value={amount}
								onChange={(e) => setAmount(e.target.value)}
								className="w-full pl-8 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#335833] focus:border-[#335833] outline-none font-bold text-lg transition-all shadow-sm"
								placeholder="0.00"
								autoFocus
							/>
						</div>
					</div>

					<div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl border border-green-100">
						<input
							type="checkbox"
							id="confirmPaid"
							checked={isMarkedPaid}
							onChange={(e) => setIsMarkedPaid(e.target.checked)}
							className="mt-1 w-4 h-4 text-[#335833] rounded focus:ring-[#335833] border-gray-300"
						/>
						<label
							htmlFor="confirmPaid"
							className="text-sm text-green-900 cursor-pointer select-none"
						>
							<span className="font-bold block mb-0.5">
								Mark as Paid Offline
							</span>
							I confirm that I have transferred the amount to{" "}
							<span className="font-mono font-bold">{upiId}</span> via my
							banking app.
						</label>
					</div>

					<button
						type="submit"
						disabled={loading || !isMarkedPaid}
						className="w-full py-4 bg-[#335833] text-white font-bold rounded-xl hover:bg-[#2a4a2a] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-green-900/20"
					>
						{loading ? <LoadingSpinner /> : "Record Payment"}
					</button>
				</form>
			</motion.div>
		</div>
	);
};

// --- Main Admin Dashboard ---

const AdminDashboard = () => {
	const [activeTab, setActiveTab] = useState("overview");
	const [loading, setLoading] = useState(true);
	const [stats, setStats] = useState({
		users: 0,
		blogs: 0,
		socials: 0,
		sponsors: 0,
	});
	const [creators, setCreators] = useState([]);
	const [blogs, setBlogs] = useState([]);
	const [socials, setSocials] = useState([]);
	const [sponsors, setSponsors] = useState([]);
	const [selectedUser, setSelectedUser] = useState(null);
	const [reportedPosts, setReportedPosts] = useState([]);
	const [tickets, setTickets] = useState([]);
	const [rejectReason, setRejectReason] = useState("");
	const [rejectingTicketId, setRejectingTicketId] = useState(null);

	const auth = getAuthInstance();
	const adminId = auth?.currentUser?.uid;

	// Fetch Data
	useEffect(() => {
		const fetchData = async () => {
			try {
				// 1. Fetch Collections (using async getters)
				const usersCol = await getUsersCollection();
				const postsCol = await getPostsCollection();
				const sponsorsCol = await getSponsorsCollection();

				const usersSnap = await getDocs(usersCol);
				const postsSnap = await getDocs(postsCol);
				const sponsorsSnap = await getDocs(sponsorsCol);

				// 2. Process Posts (Separate Blogs vs Socials)
				const allPosts = postsSnap.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));

				// Sort by date desc
				allPosts.sort(
					(a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0),
				);

				const blogPosts = allPosts.filter((p) => p.type === "blog");
				const socialPosts = allPosts.filter((p) => p.type === "photoAudio");

				setStats({
					users: usersSnap.size,
					blogs: blogPosts.length,
					socials: socialPosts.length,
					sponsors: sponsorsSnap.size,
				});

				// 3. Set Content States (Limit 20 for view)
				setBlogs(blogPosts.slice(0, 20));
				setSocials(socialPosts.slice(0, 20));

				// 4. Fetch Sponsors
				const sponsorsList = sponsorsSnap.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				setSponsors(sponsorsList);

				// 5. Fetch Leaderboard for Payouts
				const leaderboardData = await calculateLeaderboard(50);
				setCreators(leaderboardData);

				// 6. Fetch Reported Posts
				const reported = await getAllReportedPosts();
				setReportedPosts(reported);

				// 7. Fetch Upgrade Tickets
				const allTickets = await getAllTickets();
				setTickets(allTickets);
			} catch (error) {
				console.error("Error fetching admin data:", error);
				toast.error("Failed to load dashboard data");
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	// Handlers
	const handleDelete = async (collectionRef, id, type) => {
		if (
			!window.confirm(
				"Are you sure you want to delete this content permanently?",
			)
		)
			return;
		try {
			await deleteDoc(doc(collectionRef, id));
			toast.success("Content deleted");

			// Update local state based on type
			if (type === "blog") setBlogs(blogs.filter((b) => b.id !== id));
			if (type === "social") setSocials(socials.filter((s) => s.id !== id));
			if (type === "sponsor") setSponsors(sponsors.filter((s) => s.id !== id));
		} catch (error) {
			console.error(error);
			toast.error("Delete failed");
		}
	};

	const handleAddSponsor = async () => {
		const name = prompt("Enter Sponsor Name:");
		if (!name) return;
		try {
			const sponsorsCol = getSponsorsCollection();
			const newSponsor = {
				name,
				tier: "Gold",
				createdAt: serverTimestamp(),
				description: "New Partner added by Admin",
			};
			const docRef = await addDoc(sponsorsCol, newSponsor);
			setSponsors([...sponsors, { id: docRef.id, ...newSponsor }]);
			toast.success("Sponsor added!");
		} catch (err) {
			console.error(err);
			toast.error("Failed to add sponsor");
		}
	};

	// --- Report Handlers ---
	const handleRestorePost = async (postId) => {
		if (!window.confirm("Restore this post and clear all reports?")) return;
		try {
			await adminRestorePost(postId);
			setReportedPosts(reportedPosts.filter((p) => p.id !== postId));
			toast.success("Post restored successfully");
		} catch (error) {
			console.error(error);
			toast.error("Failed to restore post");
		}
	};

	const handlePermanentDelete = async (postId) => {
		if (
			!window.confirm(
				"Permanently delete this post? This action cannot be undone.",
			)
		)
			return;
		try {
			await adminPermanentDelete(postId);
			setReportedPosts(reportedPosts.filter((p) => p.id !== postId));
			toast.success("Post permanently deleted");
		} catch (error) {
			console.error(error);
			toast.error("Failed to delete post");
		}
	};

	const handleViewReports = async (postId) => {
		try {
			const reports = await getPostReports(postId);
			const reasons = reports.map(
				(r) => `• ${r.reason}${r.details ? ` — "${r.details}"` : ""}`,
			);
			alert(`Reports for this post:\n\n${reasons.join("\n")}`);
		} catch (error) {
			console.error(error);
			toast.error("Failed to load reports");
		}
	};

	// --- Ticket Handlers ---
	const handleApproveTicket = async (ticketId) => {
		if (!window.confirm("Approve this creator upgrade request?")) return;
		try {
			await approveTicket(ticketId, adminId);
			setTickets(
				tickets.map((t) =>
					t.id === ticketId ? { ...t, status: "approved" } : t,
				),
			);
			toast.success("Creator upgrade approved!");
		} catch (error) {
			console.error(error);
			toast.error("Failed to approve ticket");
		}
	};

	const handleRejectTicket = async (ticketId) => {
		if (!rejectReason.trim()) {
			toast.error("Please provide a rejection reason");
			return;
		}
		try {
			await rejectTicket(ticketId, adminId, rejectReason);
			setTickets(
				tickets.map((t) =>
					t.id === ticketId
						? { ...t, status: "rejected", rejectionReason: rejectReason }
						: t,
				),
			);
			setRejectingTicketId(null);
			setRejectReason("");
			toast.success("Ticket rejected");
		} catch (error) {
			console.error(error);
			toast.error("Failed to reject ticket");
		}
	};

	if (loading)
		return (
			<div className="min-h-screen flex items-center justify-center bg-[#F3F4F6]">
				<LoadingSpinner />
			</div>
		);

	return (
		<div className="min-h-screen bg-[#F3F4F6] font-sans flex flex-col md:flex-row">
			{/* --- Sidebar --- */}
			<aside className="w-full md:w-72 bg-white border-r border-gray-200 p-6 flex flex-col gap-2 sticky top-0 h-auto md:h-screen z-20">
				<div className="flex items-center gap-3 px-4 mb-8">
					<div className="w-10 h-10 bg-[#335833] rounded-xl flex items-center justify-center text-white shadow-md shadow-green-900/20">
						<HiShieldCheck size={24} />
					</div>
					<div>
						<h1 className="font-bold text-gray-900 leading-tight">
							Admin
							<br />
							<span className="text-[#335833]">Dashboard</span>
						</h1>
					</div>
				</div>

				<SidebarItem
					icon={HiHome}
					label="Overview"
					isActive={activeTab === "overview"}
					onClick={() => setActiveTab("overview")}
				/>
				<SidebarItem
					icon={HiCurrencyRupee}
					label="Payouts & Prizes"
					isActive={activeTab === "payouts"}
					onClick={() => setActiveTab("payouts")}
				/>
				<SidebarItem
					icon={HiPhotograph}
					label="Moderation"
					isActive={activeTab === "moderation"}
					onClick={() => setActiveTab("moderation")}
				/>
				<SidebarItem
					icon={HiStar}
					label="Sponsors"
					isActive={activeTab === "sponsors"}
					onClick={() => setActiveTab("sponsors")}
				/>
				<SidebarItem
					icon={HiFlag}
					label="Reported Content"
					isActive={activeTab === "reports"}
					onClick={() => setActiveTab("reports")}
				/>
				<SidebarItem
					icon={HiTicket}
					label="Upgrade Tickets"
					isActive={activeTab === "tickets"}
					onClick={() => setActiveTab("tickets")}
				/>
			</aside>

			{/* --- Main Content --- */}
			<main className="flex-1 p-4 md:p-8 overflow-y-auto">
				{/* Header */}
				<header className="flex justify-between items-center mb-8">
					<div>
						<h2 className="text-2xl font-bold text-gray-900 capitalize">
							{activeTab}
						</h2>
						<p className="text-gray-500 text-sm">Welcome back, Admin</p>
					</div>
					<div className="flex items-center gap-3">
						<span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center gap-1 border border-green-200">
							<span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
							Live System
						</span>
					</div>
				</header>

				{/* Tab Content */}
				<div className="space-y-8">
					{/* OVERVIEW TAB */}
					{activeTab === "overview" && (
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							className="space-y-8"
						>
							{/* Stats Grid */}
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
								<StatCard
									label="Total Users"
									value={stats.users}
									icon={HiUserGroup}
									color="bg-blue-500"
									trend="+12%"
								/>
								<StatCard
									label="Blog Posts"
									value={stats.blogs}
									icon={HiDocumentText}
									color="bg-purple-500"
								/>
								<StatCard
									label="Social Moments"
									value={stats.socials}
									icon={HiPhotograph}
									color="bg-orange-500"
									trend="+5%"
								/>
								<StatCard
									label="Active Sponsors"
									value={stats.sponsors}
									icon={HiStar}
									color="bg-yellow-500"
								/>
							</div>

							{/* Recent Signups / Quick Actions */}
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
								<div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
									<h3 className="font-bold text-gray-900 mb-4">
										System Health
									</h3>
									<div className="space-y-4">
										<div className="flex items-center justify-between p-4 bg-green-50 rounded-2xl border border-green-100/50">
											<div className="flex items-center gap-3">
												<div className="p-2 bg-green-500 text-white rounded-lg shadow-sm">
													<HiCheck />
												</div>
												<span className="font-medium text-gray-700">
													Database Connection
												</span>
											</div>
											<span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
												Stable
											</span>
										</div>
										<div className="flex items-center justify-between p-4 bg-blue-50 rounded-2xl border border-blue-100/50">
											<div className="flex items-center gap-3">
												<div className="p-2 bg-blue-500 text-white rounded-lg shadow-sm">
													<HiCheck />
												</div>
												<span className="font-medium text-gray-700">
													Storage (R2)
												</span>
											</div>
											<span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
												Optimal
											</span>
										</div>
									</div>
								</div>
								<div className="bg-[#1A331A] p-6 rounded-3xl shadow-lg shadow-green-900/10 border border-gray-100 text-white flex flex-col justify-center items-center text-center relative overflow-hidden">
									<div className="absolute top-0 right-0 p-4 opacity-5">
										<HiShieldCheck size={120} />
									</div>
									<h3 className="text-2xl font-bold mb-2 relative z-10">
										Need Help?
									</h3>
									<p className="text-gray-300 mb-6 text-sm relative z-10">
										Contact the developer support team for any database issues.
									</p>
									<button className="px-6 py-2 bg-white text-[#1A331A] font-bold rounded-full hover:bg-gray-100 transition-colors relative z-10 shadow-md">
										Open Ticket
									</button>
								</div>
							</div>
						</motion.div>
					)}

					{/* PAYOUTS TAB */}
					{activeTab === "payouts" && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden"
						>
							<div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
								<div>
									<h3 className="font-bold text-lg text-gray-900">
										Creator Leaderboard
									</h3>
									<p className="text-sm text-gray-500">
										Top 50 creators eligible for prizes
									</p>
								</div>
								<button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl text-sm hover:bg-gray-50 transition-colors shadow-sm">
									Export CSV
								</button>
							</div>
							<div className="overflow-x-auto">
								<table className="w-full text-left">
									<thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold border-b border-gray-100">
										<tr>
											<th className="px-6 py-4">Rank</th>
											<th className="px-6 py-4">Creator</th>
											<th className="px-6 py-4 text-right">Points</th>
											<th className="px-6 py-4 text-right">Action</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-gray-100">
										{creators.map((user, index) => (
											<tr
												key={user.userId}
												className="hover:bg-gray-50 transition-colors group"
											>
												<td className="px-6 py-4 font-bold text-gray-400">
													#{index + 1}
												</td>
												<td className="px-6 py-4 flex items-center gap-3">
													<img
														src={
															user.profilePhotoUrl ||
															`https://ui-avatars.com/api/?name=${user.name}`
														}
														className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm"
														alt=""
													/>
													<div>
														<p className="font-bold text-gray-900">
															{user.name}
														</p>
														<p className="text-xs text-gray-500">
															@{user.username}
														</p>
													</div>
												</td>
												<td className="px-6 py-4 text-right font-bold text-[#335833]">
													{user.points}
												</td>
												<td className="px-6 py-4 text-right">
													<button
														onClick={() => setSelectedUser(user)}
														className="px-4 py-2 bg-[#335833] text-white text-xs font-bold rounded-lg hover:bg-[#2a4a2a] shadow-sm transition-all hover:shadow-md"
													>
														Pay Prize
													</button>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</motion.div>
					)}

					{/* MODERATION TAB */}
					{activeTab === "moderation" && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className="space-y-8"
						>
							{/* Blogs Section */}
							<div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
								<div className="p-6 border-b border-gray-100 flex items-center gap-2 bg-gray-50/50">
									<div className="p-2 bg-purple-500 text-white rounded-lg shadow-sm">
										<HiDocumentText />
									</div>
									<h3 className="font-bold text-lg text-gray-900">
										Recent Blogs
									</h3>
								</div>
								<div className="overflow-x-auto">
									<table className="w-full text-left">
										<thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold border-b border-gray-100">
											<tr>
												<th className="px-6 py-4">Title</th>
												<th className="px-6 py-4">Author</th>
												<th className="px-6 py-4 text-right">Actions</th>
											</tr>
										</thead>
										<tbody className="divide-y divide-gray-100">
											{blogs.map((blog) => (
												<tr
													key={blog.id}
													className="hover:bg-gray-50 transition-colors"
												>
													<td className="px-6 py-4 font-medium text-gray-900 max-w-xs truncate">
														{blog.title}
													</td>
													<td className="px-6 py-4 text-sm text-gray-500">
														{blog.creatorUsername || "Unknown"}
													</td>
													<td className="px-6 py-4 text-right">
														<button
															onClick={() =>
																handleDelete(
																	getPostsCollection(),
																	blog.id,
																	"blog",
																)
															}
															className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
														>
															<HiTrash />
														</button>
													</td>
												</tr>
											))}
											{blogs.length === 0 && (
												<tr>
													<td
														colSpan="3"
														className="px-6 py-4 text-center text-gray-400"
													>
														No blogs found
													</td>
												</tr>
											)}
										</tbody>
									</table>
								</div>
							</div>

							{/* Socials Section */}
							<div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
								<div className="p-6 border-b border-gray-100 flex items-center gap-2 bg-gray-50/50">
									<div className="p-2 bg-orange-500 text-white rounded-lg shadow-sm">
										<HiPhotograph />
									</div>
									<h3 className="font-bold text-lg text-gray-900">
										Recent Social Moments
									</h3>
								</div>
								<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-6">
									{socials.map((post) => (
										<div
											key={post.id}
											className="relative group rounded-xl overflow-hidden aspect-square bg-gray-100 shadow-sm hover:shadow-md transition-all"
										>
											<img
												src={post.photoUrl}
												alt=""
												className="w-full h-full object-cover"
											/>
											<div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
												<button
													onClick={() =>
														handleDelete(
															getPostsCollection(),
															post.id,
															"social",
														)
													}
													className="p-3 bg-white text-red-500 rounded-full hover:bg-red-50 shadow-lg transform hover:scale-110 transition-all"
												>
													<HiTrash />
												</button>
											</div>
											<div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent text-white text-xs truncate">
												{post.creatorUsername}
											</div>
										</div>
									))}
									{socials.length === 0 && (
										<div className="col-span-full text-center text-gray-400 py-4">
											No social posts found
										</div>
									)}
								</div>
							</div>
						</motion.div>
					)}

					{/* SPONSORS TAB */}
					{activeTab === "sponsors" && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className="space-y-6"
						>
							<div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
								<div>
									<h3 className="font-bold text-lg text-gray-900">
										Partner Management
									</h3>
									<p className="text-sm text-gray-500">
										Manage companies displayed on the Sponsors page
									</p>
								</div>
								<button
									onClick={handleAddSponsor}
									className="px-4 py-2 bg-[#335833] text-white font-bold rounded-xl flex items-center gap-2 hover:bg-[#2a4a2a] shadow-lg shadow-green-900/20"
								>
									<HiPlus /> Add New
								</button>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								{sponsors.map((sponsor) => (
									<div
										key={sponsor.id}
										className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 relative group hover:shadow-md transition-shadow"
									>
										<button
											onClick={() =>
												handleDelete(
													getSponsorsCollection(),
													sponsor.id,
													"sponsor",
												)
											}
											className="absolute top-4 right-4 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
										>
											<HiTrash />
										</button>
										<div className="w-12 h-12 bg-yellow-500 text-white rounded-xl flex items-center justify-center mb-4 shadow-sm">
											<HiStar size={24} />
										</div>
										<h4 className="font-bold text-lg text-gray-900">
											{sponsor.name}
										</h4>
										<p className="text-sm text-gray-500 mb-2">
											{sponsor.tier || "Standard"} Tier
										</p>
										<p className="text-sm text-gray-600 line-clamp-2">
											{sponsor.description}
										</p>
									</div>
								))}
								{sponsors.length === 0 && (
									<div className="col-span-full py-12 text-center text-gray-400 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
										No active sponsors found.
									</div>
								)}
							</div>
						</motion.div>
					)}

					{/* REPORTED CONTENT TAB */}
					{activeTab === "reports" && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className="space-y-6"
						>
							<div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
								<div>
									<h3 className="font-bold text-lg text-gray-900">
										Reported Content
									</h3>
									<p className="text-sm text-gray-500">
										Review and take action on reported posts (
										{reportedPosts.length} total)
									</p>
								</div>
								<button
									onClick={async () => {
										const reported = await getAllReportedPosts();
										setReportedPosts(reported);
										toast.success("Refreshed");
									}}
									className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl text-sm hover:bg-gray-200 transition-colors flex items-center gap-2"
								>
									<HiRefresh /> Refresh
								</button>
							</div>

							<div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
								<div className="overflow-x-auto">
									<table className="w-full text-left">
										<thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold border-b border-gray-100">
											<tr>
												<th className="px-6 py-4">Content</th>
												<th className="px-6 py-4">Type</th>
												<th className="px-6 py-4">Creator</th>
												<th className="px-6 py-4 text-center">Reports</th>
												<th className="px-6 py-4 text-center">Status</th>
												<th className="px-6 py-4 text-right">Actions</th>
											</tr>
										</thead>
										<tbody className="divide-y divide-gray-100">
											{reportedPosts.map((post) => (
												<tr
													key={post.id}
													className={`hover:bg-gray-50 transition-colors ${post.hidden ? "bg-red-50/50" : ""}`}
												>
													<td className="px-6 py-4 font-medium text-gray-900 max-w-xs truncate">
														{post.title || post.caption || "Untitled"}
													</td>
													<td className="px-6 py-4">
														<span
															className={`px-2 py-1 text-xs font-bold rounded-full ${post.type === "blog" ? "bg-purple-100 text-purple-700" : "bg-orange-100 text-orange-700"}`}
														>
															{post.type === "blog" ? "Blog" : "Social"}
														</span>
													</td>
													<td className="px-6 py-4 text-sm text-gray-500">
														{post.creatorUsername || "Unknown"}
													</td>
													<td className="px-6 py-4 text-center">
														<span
															className={`px-3 py-1 text-xs font-bold rounded-full ${(post.reportCount || 0) >= 20 ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}
														>
															{post.reportCount || 0}
														</span>
													</td>
													<td className="px-6 py-4 text-center">
														{post.hidden ? (
															<span className="px-2 py-1 text-xs font-bold bg-red-100 text-red-600 rounded-full flex items-center gap-1 justify-center">
																<HiBan size={12} /> Hidden
															</span>
														) : (
															<span className="px-2 py-1 text-xs font-bold bg-green-100 text-green-600 rounded-full">
																Visible
															</span>
														)}
													</td>
													<td className="px-6 py-4 text-right">
														<div className="flex items-center justify-end gap-2">
															<button
																onClick={() => handleViewReports(post.id)}
																className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
																title="View Reports"
															>
																<HiEye size={16} />
															</button>
															<button
																onClick={() => handleRestorePost(post.id)}
																className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-colors"
																title="Restore Post"
															>
																<HiRefresh size={16} />
															</button>
															<button
																onClick={() => handlePermanentDelete(post.id)}
																className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
																title="Delete Permanently"
															>
																<HiTrash size={16} />
															</button>
														</div>
													</td>
												</tr>
											))}
											{reportedPosts.length === 0 && (
												<tr>
													<td
														colSpan="6"
														className="px-6 py-12 text-center text-gray-400"
													>
														No reported content. All clear! 🎉
													</td>
												</tr>
											)}
										</tbody>
									</table>
								</div>
							</div>
						</motion.div>
					)}

					{/* UPGRADE TICKETS TAB */}
					{activeTab === "tickets" && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className="space-y-6"
						>
							<div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
								<div>
									<h3 className="font-bold text-lg text-gray-900">
										Creator Upgrade Requests
									</h3>
									<p className="text-sm text-gray-500">
										Manage viewer to creator upgrade tickets
									</p>
								</div>
								<button
									onClick={async () => {
										const allTix = await getAllTickets();
										setTickets(allTix);
										toast.success("Refreshed");
									}}
									className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl text-sm hover:bg-gray-200 transition-colors flex items-center gap-2"
								>
									<HiRefresh /> Refresh
								</button>
							</div>

							<div className="space-y-4">
								{tickets.map((ticket) => (
									<div
										key={ticket.id}
										className={`bg-white rounded-3xl shadow-sm border p-6 transition-shadow hover:shadow-md ${
											ticket.status === "pending"
												? "border-yellow-200"
												: ticket.status === "approved"
													? "border-green-200"
													: "border-red-200"
										}`}
									>
										<div className="flex items-start justify-between gap-4">
											<div className="flex items-center gap-4">
												<img
													src={
														ticket.profilePhotoUrl ||
														`https://ui-avatars.com/api/?name=${ticket.userName}`
													}
													className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-sm"
													alt=""
												/>
												<div>
													<h4 className="font-bold text-gray-900">
														{ticket.userName}
													</h4>
													<p className="text-sm text-gray-500">
														@{ticket.username} • {ticket.userEmail}
													</p>
													{ticket.message && (
														<p className="text-sm text-gray-600 mt-2 bg-gray-50 p-3 rounded-xl border border-gray-100">
															"{ticket.message}"
														</p>
													)}
													<p className="text-xs text-gray-400 mt-2">
														Submitted:{" "}
														{ticket.createdAt?.toDate
															? new Date(
																	ticket.createdAt.toDate(),
																).toLocaleDateString("en-US", {
																	month: "short",
																	day: "numeric",
																	year: "numeric",
																	hour: "numeric",
																	minute: "numeric",
																})
															: "Unknown"}
													</p>
												</div>
											</div>

											<div className="flex flex-col items-end gap-2">
												{ticket.status === "pending" && (
													<span className="px-3 py-1 text-xs font-bold bg-yellow-100 text-yellow-700 rounded-full">
														Pending
													</span>
												)}
												{ticket.status === "approved" && (
													<span className="px-3 py-1 text-xs font-bold bg-green-100 text-green-700 rounded-full flex items-center gap-1">
														<HiCheckCircle size={14} /> Approved
													</span>
												)}
												{ticket.status === "rejected" && (
													<span className="px-3 py-1 text-xs font-bold bg-red-100 text-red-700 rounded-full flex items-center gap-1">
														<HiXCircle size={14} /> Rejected
													</span>
												)}
											</div>
										</div>

										{/* Action Buttons for Pending Tickets */}
										{ticket.status === "pending" && (
											<div className="mt-4 pt-4 border-t border-gray-100">
												{rejectingTicketId === ticket.id ? (
													<div className="flex items-center gap-3">
														<input
															type="text"
															value={rejectReason}
															onChange={(e) => setRejectReason(e.target.value)}
															placeholder="Reason for rejection..."
															className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-300 focus:border-red-300 outline-none"
														/>
														<button
															onClick={() => handleRejectTicket(ticket.id)}
															className="px-4 py-2 bg-red-500 text-white text-sm font-bold rounded-xl hover:bg-red-600 transition-colors"
														>
															Confirm
														</button>
														<button
															onClick={() => {
																setRejectingTicketId(null);
																setRejectReason("");
															}}
															className="px-4 py-2 bg-gray-100 text-gray-600 text-sm font-bold rounded-xl hover:bg-gray-200 transition-colors"
														>
															Cancel
														</button>
													</div>
												) : (
													<div className="flex items-center gap-3">
														<button
															onClick={() => handleApproveTicket(ticket.id)}
															className="px-5 py-2 bg-[#335833] text-white text-sm font-bold rounded-xl hover:bg-[#2a4a2a] transition-colors shadow-lg shadow-green-900/20 flex items-center gap-2"
														>
															<HiCheckCircle /> Approve
														</button>
														<button
															onClick={() => setRejectingTicketId(ticket.id)}
															className="px-5 py-2 bg-red-100 text-red-700 text-sm font-bold rounded-xl hover:bg-red-200 transition-colors flex items-center gap-2"
														>
															<HiXCircle /> Reject
														</button>
													</div>
												)}
											</div>
										)}

										{/* Show rejection reason */}
										{ticket.status === "rejected" && ticket.rejectionReason && (
											<div className="mt-3 p-3 bg-red-50 rounded-xl border border-red-100 text-sm text-red-700">
												<span className="font-bold">Reason:</span>{" "}
												{ticket.rejectionReason}
											</div>
										)}
									</div>
								))}
								{tickets.length === 0 && (
									<div className="py-12 text-center text-gray-400 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
										No upgrade tickets found.
									</div>
								)}
							</div>
						</motion.div>
					)}
				</div>
			</main>

			{/* Modals */}
			<AnimatePresence>
				{selectedUser && (
					<PaymentModal
						user={selectedUser}
						onClose={() => setSelectedUser(null)}
						onSuccess={() => {
							// In a real app, you might trigger a re-fetch here
						}}
					/>
				)}
			</AnimatePresence>
		</div>
	);
};

export default AdminDashboard;
