import { useState, useEffect } from "react";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { SearchBar, FilterBar } from "../../components/content/ContentSwitcher";

const AdminUsers = () => {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedUser, setSelectedUser] = useState(null);
	const [showModal, setShowModal] = useState(false);
	const [filters, setFilters] = useState({
		role: "all",
		status: "all",
		sort: "recent",
	});

	useEffect(() => {
		const loadUsers = () => {
			setLoading(true);
			// Simulate API call
			setTimeout(() => {
				setUsers([
					{
						id: 1,
						name: "Dr. Priya Sharma",
						email: "priya@example.com",
						role: "creator",
						status: "active",
						joinedAt: "2024-01-15",
						points: 8540,
						contributions: { sightings: 45, blogs: 12, audio: 8 },
						lastActive: "2 hours ago",
					},
					{
						id: 2,
						name: "Rajesh Kumar",
						email: "rajesh@example.com",
						role: "creator",
						status: "active",
						joinedAt: "2024-01-20",
						points: 5420,
						contributions: { sightings: 32, blogs: 5, audio: 3 },
						lastActive: "5 mins ago",
					},
					{
						id: 3,
						name: "Arun Menon",
						email: "arun@example.com",
						role: "user",
						status: "active",
						joinedAt: "2024-02-01",
						points: 2150,
						contributions: { sightings: 18, blogs: 3, audio: 1 },
						lastActive: "1 day ago",
					},
					{
						id: 4,
						name: "Meera Iyer",
						email: "meera@example.com",
						role: "creator",
						status: "inactive",
						joinedAt: "2023-12-10",
						points: 3890,
						contributions: { sightings: 25, blogs: 8, audio: 5 },
						lastActive: "1 week ago",
					},
					{
						id: 5,
						name: "Admin User",
						email: "admin@example.com",
						role: "admin",
						status: "active",
						joinedAt: "2023-01-01",
						points: 0,
						contributions: { sightings: 0, blogs: 0, audio: 0 },
						lastActive: "Online",
					},
				]);
				setLoading(false);
			}, 1000);
		};
		loadUsers();
	}, [filters]);

	const handleSearch = (query) => {
		console.log("Searching for:", query);
	};

	const handleFilter = (newFilters) => {
		setFilters({ ...filters, ...newFilters });
	};

	const handleViewUser = (user) => {
		setSelectedUser(user);
		setShowModal(true);
	};

	const handleUpdateStatus = (userId, newStatus) => {
		setUsers(
			users.map((user) =>
				user.id === userId ? { ...user, status: newStatus } : user
			)
		);
	};

	const getRoleBadge = (role) => {
		const badges = {
			admin: "bg-red-100 text-red-700",
			creator: "bg-blue-100 text-blue-700",
			user: "bg-gray-100 text-gray-700",
		};
		return badges[role] || "bg-gray-100 text-gray-700";
	};

	const getStatusBadge = (status) => {
		const badges = {
			active: "bg-green-100 text-green-700",
			inactive: "bg-gray-100 text-gray-700",
			banned: "bg-red-100 text-red-700",
		};
		return badges[status] || "bg-gray-100 text-gray-700";
	};

	if (loading) {
		return <LoadingSpinner message="Loading users..." />;
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-[#EDF1D6] via-white to-[#9DC08B]/20 py-8">
			<div className="max-w-7xl mx-auto px-4">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-5xl font-bold text-[#40513B] mb-2">
						👥 User Management
					</h1>
					<p className="text-[#609966] text-lg">
						Manage user accounts, roles, and permissions
					</p>
				</div>

				{/* Stats Cards */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
					{[
						{ icon: "👥", label: "Total Users", value: users.length },
						{
							icon: "✅",
							label: "Active",
							value: users.filter((u) => u.status === "active").length,
						},
						{
							icon: "🎨",
							label: "Creators",
							value: users.filter((u) => u.role === "creator").length,
						},
						{
							icon: "🔧",
							label: "Admins",
							value: users.filter((u) => u.role === "admin").length,
						},
					].map((stat, index) => (
						<div
							key={index}
							className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-[#9DC08B]/20 p-6 hover:scale-105 transition-transform"
						>
							<div className="text-4xl mb-2">{stat.icon}</div>
							<div className="text-2xl font-bold text-[#40513B]">
								{stat.value}
							</div>
							<div className="text-sm text-[#609966]">{stat.label}</div>
						</div>
					))}
				</div>

				{/* Filters */}
				<div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-[#9DC08B]/20 p-6 mb-8">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
						<SearchBar onSearch={handleSearch} placeholder="Search users..." />
						<FilterBar
							onFilter={handleFilter}
							filters={[
								{ value: "all", label: "All Roles" },
								{ value: "admin", label: "Admins" },
								{ value: "creator", label: "Creators" },
								{ value: "user", label: "Users" },
							]}
						/>
					</div>
					<div className="flex items-center space-x-2">
						<span className="text-sm text-[#609966]">Status:</span>
						{["all", "active", "inactive", "banned"].map((status) => (
							<button
								key={status}
								onClick={() => handleFilter({ status })}
								className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
									filters.status === status
										? "bg-[#609966] text-white"
										: "bg-[#EDF1D6] text-[#609966] hover:bg-[#9DC08B]/30"
								}`}
							>
								{status.charAt(0).toUpperCase() + status.slice(1)}
							</button>
						))}
					</div>
				</div>

				{/* Users Table */}
				<div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border-2 border-[#9DC08B]/20 overflow-hidden">
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-[#EDF1D6]">
								<tr>
									<th className="px-6 py-4 text-left text-sm font-bold text-[#40513B]">
										User
									</th>
									<th className="px-6 py-4 text-left text-sm font-bold text-[#40513B]">
										Role
									</th>
									<th className="px-6 py-4 text-left text-sm font-bold text-[#40513B]">
										Status
									</th>
									<th className="px-6 py-4 text-left text-sm font-bold text-[#40513B]">
										Points
									</th>
									<th className="px-6 py-4 text-left text-sm font-bold text-[#40513B]">
										Contributions
									</th>
									<th className="px-6 py-4 text-left text-sm font-bold text-[#40513B]">
										Last Active
									</th>
									<th className="px-6 py-4 text-left text-sm font-bold text-[#40513B]">
										Actions
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-[#EDF1D6]">
								{users.map((user) => (
									<tr
										key={user.id}
										className="hover:bg-[#EDF1D6]/50 transition-colors"
									>
										<td className="px-6 py-4">
											<div>
												<div className="font-bold text-[#40513B]">
													{user.name}
												</div>
												<div className="text-sm text-[#609966]">
													{user.email}
												</div>
											</div>
										</td>
										<td className="px-6 py-4">
											<span
												className={`px-3 py-1 rounded-full text-xs font-bold ${getRoleBadge(
													user.role
												)}`}
											>
												{user.role.toUpperCase()}
											</span>
										</td>
										<td className="px-6 py-4">
											<span
												className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(
													user.status
												)}`}
											>
												{user.status}
											</span>
										</td>
										<td className="px-6 py-4">
											<span className="font-bold text-[#609966]">
												⭐ {user.points}
											</span>
										</td>
										<td className="px-6 py-4">
											<div className="text-xs text-[#609966] space-y-1">
												<div>📸 {user.contributions.sightings} sightings</div>
												<div>✍️ {user.contributions.blogs} blogs</div>
												<div>🎵 {user.contributions.audio} audio</div>
											</div>
										</td>
										<td className="px-6 py-4">
											<span className="text-sm text-[#609966]">
												{user.lastActive}
											</span>
										</td>
										<td className="px-6 py-4">
											<div className="flex space-x-2">
												<button
													onClick={() => handleViewUser(user)}
													className="px-3 py-1 bg-[#609966] text-white rounded-lg text-xs font-bold hover:bg-[#40513B] transition-colors"
												>
													View
												</button>
												<button className="px-3 py-1 bg-[#EDF1D6] text-[#609966] rounded-lg text-xs font-bold hover:bg-[#9DC08B]/30 transition-colors">
													Edit
												</button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>

				{/* User Detail Modal */}
				{showModal && selectedUser && (
					<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
						<div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
							<div className="p-8">
								<div className="flex items-center justify-between mb-6">
									<h2 className="text-3xl font-bold text-[#40513B]">
										User Details
									</h2>
									<button
										onClick={() => setShowModal(false)}
										className="text-3xl text-[#609966] hover:text-[#40513B]"
									>
										×
									</button>
								</div>

								<div className="space-y-6">
									<div className="flex items-center space-x-4 p-6 bg-[#EDF1D6] rounded-2xl">
										<div className="text-6xl">👤</div>
										<div className="flex-1">
											<h3 className="text-2xl font-bold text-[#40513B]">
												{selectedUser.name}
											</h3>
											<p className="text-[#609966]">{selectedUser.email}</p>
											<div className="flex space-x-2 mt-2">
												<span
													className={`px-3 py-1 rounded-full text-xs font-bold ${getRoleBadge(
														selectedUser.role
													)}`}
												>
													{selectedUser.role.toUpperCase()}
												</span>
												<span
													className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(
														selectedUser.status
													)}`}
												>
													{selectedUser.status}
												</span>
											</div>
										</div>
									</div>

									<div className="grid grid-cols-2 gap-4">
										<div className="p-4 bg-[#EDF1D6] rounded-xl">
											<div className="text-sm text-[#609966] mb-1">
												Total Points
											</div>
											<div className="text-2xl font-bold text-[#40513B]">
												⭐ {selectedUser.points}
											</div>
										</div>
										<div className="p-4 bg-[#EDF1D6] rounded-xl">
											<div className="text-sm text-[#609966] mb-1">
												Member Since
											</div>
											<div className="text-lg font-bold text-[#40513B]">
												{selectedUser.joinedAt}
											</div>
										</div>
									</div>

									<div>
										<h4 className="font-bold text-[#40513B] mb-3">
											Contributions
										</h4>
										<div className="grid grid-cols-3 gap-4">
											<div className="p-4 bg-[#EDF1D6] rounded-xl text-center">
												<div className="text-3xl mb-2">📸</div>
												<div className="text-2xl font-bold text-[#40513B]">
													{selectedUser.contributions.sightings}
												</div>
												<div className="text-xs text-[#609966]">Sightings</div>
											</div>
											<div className="p-4 bg-[#EDF1D6] rounded-xl text-center">
												<div className="text-3xl mb-2">✍️</div>
												<div className="text-2xl font-bold text-[#40513B]">
													{selectedUser.contributions.blogs}
												</div>
												<div className="text-xs text-[#609966]">Blogs</div>
											</div>
											<div className="p-4 bg-[#EDF1D6] rounded-xl text-center">
												<div className="text-3xl mb-2">🎵</div>
												<div className="text-2xl font-bold text-[#40513B]">
													{selectedUser.contributions.audio}
												</div>
												<div className="text-xs text-[#609966]">Audio</div>
											</div>
										</div>
									</div>

									<div className="flex space-x-3">
										<button
											onClick={() => {
												handleUpdateStatus(
													selectedUser.id,
													selectedUser.status === "active"
														? "inactive"
														: "active"
												);
												setShowModal(false);
											}}
											className="flex-1 px-6 py-3 bg-[#609966] text-white rounded-xl font-bold hover:bg-[#40513B] transition-colors"
										>
											Toggle Status
										</button>
										<button
											onClick={() => setShowModal(false)}
											className="flex-1 px-6 py-3 bg-[#EDF1D6] text-[#609966] rounded-xl font-bold hover:bg-[#9DC08B]/30 transition-colors"
										>
											Close
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default AdminUsers;
