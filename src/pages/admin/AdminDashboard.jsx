import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const AdminDashboard = () => {
	const [stats, setStats] = useState(null);
	const [loading, setLoading] = useState(true);
	const [recentActivity, setRecentActivity] = useState([]);

	useEffect(() => {
		const loadDashboardData = () => {
			setLoading(true);
			// Simulate API call
			setTimeout(() => {
				setStats({
					users: { total: 2845, active: 1892, new: 124, growth: 12.5 },
					content: { total: 8456, pending: 45, approved: 8234, rejected: 177 },
					revenue: { total: 425000, monthly: 45600, growth: 18.2 },
					engagement: {
						views: 145230,
						likes: 23456,
						comments: 8945,
						shares: 3421,
					},
				});
				setRecentActivity([
					{
						id: 1,
						type: "user",
						action: "New user registration",
						user: "Priya Sharma",
						time: "5 mins ago",
						status: "success",
					},
					{
						id: 2,
						type: "content",
						action: "Sighting submitted",
						user: "Rajesh Kumar",
						time: "12 mins ago",
						status: "pending",
					},
					{
						id: 3,
						type: "payment",
						action: "Donation received",
						user: "Arun Menon",
						amount: "₹5000",
						time: "25 mins ago",
						status: "success",
					},
					{
						id: 4,
						type: "content",
						action: "Blog published",
						user: "Meera Iyer",
						time: "1 hour ago",
						status: "success",
					},
					{
						id: 5,
						type: "report",
						action: "Content reported",
						user: "System",
						time: "2 hours ago",
						status: "warning",
					},
				]);
				setLoading(false);
			}, 1000);
		};
		loadDashboardData();
	}, []);

	const getStatusColor = (status) => {
		const colors = {
			success: "bg-green-100 text-green-700",
			pending: "bg-yellow-100 text-yellow-700",
			warning: "bg-orange-100 text-orange-700",
			error: "bg-red-100 text-red-700",
		};
		return colors[status] || "bg-gray-100 text-gray-700";
	};

	const getActivityIcon = (type) => {
		const icons = {
			user: "👤",
			content: "📝",
			payment: "💰",
			report: "⚠️",
		};
		return icons[type] || "📋";
	};

	if (loading) {
		return <LoadingSpinner message="Loading admin dashboard..." />;
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-[#EDF1D6] via-white to-[#9DC08B]/20 py-8">
			<div className="max-w-7xl mx-auto px-4">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-5xl font-bold text-[#40513B] mb-2">
						🎛️ Admin Dashboard
					</h1>
					<p className="text-[#609966] text-lg">
						Manage and monitor your Wildlife Valparai platform
					</p>
				</div>

				{/* Quick Stats Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
					{/* Users Stats */}
					<div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border-2 border-[#9DC08B]/20 p-6 hover:scale-105 transition-transform">
						<div className="flex items-center justify-between mb-4">
							<div className="text-5xl">👥</div>
							<span
								className={`px-3 py-1 rounded-full text-xs font-bold ${
									stats.users.growth > 0
										? "bg-green-100 text-green-700"
										: "bg-red-100 text-red-700"
								}`}
							>
								+{stats.users.growth}%
							</span>
						</div>
						<div className="text-3xl font-bold text-[#40513B] mb-1">
							{stats.users.total.toLocaleString()}
						</div>
						<div className="text-sm text-[#609966] mb-3">Total Users</div>
						<div className="flex items-center justify-between text-xs text-[#609966]">
							<span>Active: {stats.users.active}</span>
							<span>New: {stats.users.new}</span>
						</div>
					</div>

					{/* Content Stats */}
					<div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border-2 border-[#9DC08B]/20 p-6 hover:scale-105 transition-transform">
						<div className="flex items-center justify-between mb-4">
							<div className="text-5xl">📝</div>
							<span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">
								{stats.content.pending} Pending
							</span>
						</div>
						<div className="text-3xl font-bold text-[#40513B] mb-1">
							{stats.content.total.toLocaleString()}
						</div>
						<div className="text-sm text-[#609966] mb-3">Total Content</div>
						<div className="flex items-center justify-between text-xs text-[#609966]">
							<span>✅ {stats.content.approved}</span>
							<span>❌ {stats.content.rejected}</span>
						</div>
					</div>

					{/* Revenue Stats */}
					<div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border-2 border-[#9DC08B]/20 p-6 hover:scale-105 transition-transform">
						<div className="flex items-center justify-between mb-4">
							<div className="text-5xl">💰</div>
							<span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
								+{stats.revenue.growth}%
							</span>
						</div>
						<div className="text-3xl font-bold text-[#40513B] mb-1">
							₹{(stats.revenue.total / 1000).toFixed(0)}K
						</div>
						<div className="text-sm text-[#609966] mb-3">Total Revenue</div>
						<div className="text-xs text-[#609966]">
							This month: ₹{stats.revenue.monthly.toLocaleString()}
						</div>
					</div>

					{/* Engagement Stats */}
					<div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border-2 border-[#9DC08B]/20 p-6 hover:scale-105 transition-transform">
						<div className="flex items-center justify-between mb-4">
							<div className="text-5xl">📊</div>
							<span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
								High
							</span>
						</div>
						<div className="text-3xl font-bold text-[#40513B] mb-1">
							{(stats.engagement.views / 1000).toFixed(1)}K
						</div>
						<div className="text-sm text-[#609966] mb-3">Total Views</div>
						<div className="flex items-center justify-between text-xs text-[#609966]">
							<span>❤️ {(stats.engagement.likes / 1000).toFixed(1)}K</span>
							<span>💬 {(stats.engagement.comments / 1000).toFixed(1)}K</span>
						</div>
					</div>
				</div>

				{/* Quick Actions */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
					<Link
						to="/admin/users"
						className="bg-gradient-to-br from-[#609966] to-[#40513B] rounded-2xl p-6 text-white hover:scale-105 transition-transform shadow-xl"
					>
						<div className="text-4xl mb-3">👥</div>
						<h3 className="text-xl font-bold mb-2">Manage Users</h3>
						<p className="text-sm opacity-90">View and manage all users</p>
					</Link>

					<Link
						to="/admin/sightings"
						className="bg-gradient-to-br from-[#609966] to-[#40513B] rounded-2xl p-6 text-white hover:scale-105 transition-transform shadow-xl"
					>
						<div className="text-4xl mb-3">📸</div>
						<h3 className="text-xl font-bold mb-2">Review Content</h3>
						<p className="text-sm opacity-90">Approve pending submissions</p>
					</Link>

					<Link
						to="/admin/payments"
						className="bg-gradient-to-br from-[#609966] to-[#40513B] rounded-2xl p-6 text-white hover:scale-105 transition-transform shadow-xl"
					>
						<div className="text-4xl mb-3">💳</div>
						<h3 className="text-xl font-bold mb-2">Payments</h3>
						<p className="text-sm opacity-90">Monitor transactions</p>
					</Link>

					<Link
						to="/admin/performance"
						className="bg-gradient-to-br from-[#609966] to-[#40513B] rounded-2xl p-6 text-white hover:scale-105 transition-transform shadow-xl"
					>
						<div className="text-4xl mb-3">📈</div>
						<h3 className="text-xl font-bold mb-2">Analytics</h3>
						<p className="text-sm opacity-90">View detailed reports</p>
					</Link>
				</div>

				{/* Recent Activity & Alerts */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Recent Activity */}
					<div className="lg:col-span-2 bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border-2 border-[#9DC08B]/20 p-6">
						<div className="flex items-center justify-between mb-6">
							<h2 className="text-2xl font-bold text-[#40513B]">
								⚡ Recent Activity
							</h2>
							<button className="text-sm text-[#609966] hover:text-[#40513B] font-medium">
								View All →
							</button>
						</div>
						<div className="space-y-4">
							{recentActivity.map((activity) => (
								<div
									key={activity.id}
									className="flex items-center justify-between p-4 bg-[#EDF1D6] rounded-xl hover:bg-[#9DC08B]/20 transition-colors"
								>
									<div className="flex items-center space-x-4 flex-1">
										<div className="text-3xl">
											{getActivityIcon(activity.type)}
										</div>
										<div className="flex-1">
											<div className="font-bold text-[#40513B]">
												{activity.action}
											</div>
											<div className="text-sm text-[#609966]">
												{activity.user}
												{activity.amount && ` • ${activity.amount}`}
											</div>
										</div>
									</div>
									<div className="text-right">
										<span
											className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(
												activity.status
											)}`}
										>
											{activity.status}
										</span>
										<div className="text-xs text-[#609966] mt-1">
											{activity.time}
										</div>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* System Status & Alerts */}
					<div className="space-y-6">
						{/* System Health */}
						<div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border-2 border-[#9DC08B]/20 p-6">
							<h2 className="text-xl font-bold text-[#40513B] mb-4">
								🔧 System Health
							</h2>
							<div className="space-y-3">
								{[
									{ name: "Server Status", status: "Operational", value: 99.9 },
									{ name: "Database", status: "Healthy", value: 98.5 },
									{ name: "Storage", status: "Normal", value: 78.2 },
									{ name: "API Response", status: "Fast", value: 95.1 },
								].map((item, index) => (
									<div key={index}>
										<div className="flex items-center justify-between mb-1">
											<span className="text-sm text-[#609966]">
												{item.name}
											</span>
											<span className="text-xs font-bold text-[#40513B]">
												{item.value}%
											</span>
										</div>
										<div className="w-full bg-[#EDF1D6] rounded-full h-2">
											<div
												className="bg-gradient-to-r from-[#609966] to-[#40513B] h-2 rounded-full transition-all"
												style={{ width: `${item.value}%` }}
											></div>
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Quick Stats */}
						<div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border-2 border-[#9DC08B]/20 p-6">
							<h2 className="text-xl font-bold text-[#40513B] mb-4">
								📌 Quick Stats
							</h2>
							<div className="space-y-3">
								<div className="flex items-center justify-between">
									<span className="text-sm text-[#609966]">
										Pending Approvals
									</span>
									<span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">
										{stats.content.pending}
									</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-sm text-[#609966]">Active Users</span>
									<span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
										{stats.users.active}
									</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-sm text-[#609966]">New Today</span>
									<span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
										{stats.users.new}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdminDashboard;
