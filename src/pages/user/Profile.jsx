import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { usePoints } from "../../hooks/usePoints";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const Profile = () => {
	const { user, updateProfile } = useAuth();
	const { points, badges, currentBadge, pointsHistory } = usePoints();
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState({
		displayName: "",
		bio: "",
		location: "",
		interests: "",
	});
	const [activeTab, setActiveTab] = useState("overview");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (user) {
			setFormData({
				displayName: user.displayName || "",
				bio: user.bio || "",
				location: user.location || "",
				interests: user.interests || "",
			});
		}
	}, [user]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			await updateProfile(formData);
			setIsEditing(false);
		} catch (error) {
			console.error("Profile update error:", error);
		} finally {
			setLoading(false);
		}
	};

	if (!user) return <LoadingSpinner />;

	const stats = [
		{
			label: "Total Points",
			value: points || 0,
			icon: "⭐",
			color: "from-[#609966] to-[#40513B]",
		},
		{
			label: "Sightings",
			value: user.sightingsCount || 0,
			icon: "📸",
			color: "from-[#9DC08B] to-[#609966]",
		},
		{
			label: "Blog Posts",
			value: user.blogsCount || 0,
			icon: "📝",
			color: "from-[#609966] to-[#40513B]",
		},
		{
			label: "Rank",
			value: `#${user.rank || "N/A"}`,
			icon: "🏆",
			color: "from-[#9DC08B] to-[#609966]",
		},
	];

	return (
		<div className="space-y-6">
			{/* Header with gradient */}
			<div className="bg-gradient-to-r from-[#40513B] to-[#609966] rounded-3xl p-8 text-white shadow-2xl">
				<div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
					{/* Avatar */}
					<div className="relative group">
						<div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center text-6xl shadow-xl group-hover:scale-105 transition-transform duration-300">
							{user.photoURL ? (
								<img
									src={user.photoURL}
									alt="Profile"
									className="w-full h-full rounded-3xl object-cover"
								/>
							) : (
								<span>{user.displayName?.[0] || user.email?.[0] || "U"}</span>
							)}
						</div>
						<button className="absolute bottom-2 right-2 w-10 h-10 bg-[#9DC08B] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
							<span className="text-xl">📷</span>
						</button>
					</div>

					{/* User Info */}
					<div className="flex-1 text-center md:text-left">
						<h1 className="text-3xl font-bold mb-2">
							{user.displayName || "Wildlife Enthusiast"}
						</h1>
						<p className="text-white/80 mb-1">{user.email}</p>
						{user.location && (
							<p className="text-white/70 flex items-center justify-center md:justify-start space-x-2 mb-3">
								<span>📍</span>
								<span>{user.location}</span>
							</p>
						)}
						{currentBadge && (
							<div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
								<span className="text-2xl">{currentBadge.icon}</span>
								<div className="text-left">
									<p className="text-xs text-white/70">Current Badge</p>
									<p className="font-semibold">{currentBadge.name}</p>
								</div>
							</div>
						)}
					</div>

					{/* Edit Button */}
					<button
						onClick={() => setIsEditing(!isEditing)}
						className="px-6 py-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl font-medium transition-all duration-300 hover:scale-105 flex items-center space-x-2"
					>
						<span>{isEditing ? "❌" : "✏️"}</span>
						<span>{isEditing ? "Cancel" : "Edit Profile"}</span>
					</button>
				</div>
			</div>

			{/* Stats Grid - Bento Style */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				{stats.map((stat, index) => (
					<div
						key={index}
						className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-[#9DC08B]/20 group"
					>
						<div
							className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center text-2xl mb-3 group-hover:rotate-12 transition-transform duration-300`}
						>
							{stat.icon}
						</div>
						<p className="text-3xl font-bold text-[#40513B] mb-1">
							{stat.value}
						</p>
						<p className="text-sm text-[#609966]">{stat.label}</p>
					</div>
				))}
			</div>

			{/* Tabs */}
			<div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg inline-flex space-x-2">
				{["overview", "badges", "activity"].map((tab) => (
					<button
						key={tab}
						onClick={() => setActiveTab(tab)}
						className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 capitalize ${
							activeTab === tab
								? "bg-gradient-to-r from-[#609966] to-[#40513B] text-white shadow-lg"
								: "text-[#40513B] hover:bg-[#9DC08B]/20"
						}`}
					>
						{tab}
					</button>
				))}
			</div>

			{/* Content Area - Bento Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Main Content */}
				<div className="lg:col-span-2 space-y-6">
					{activeTab === "overview" && (
						<>
							{isEditing ? (
								<div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-[#9DC08B]/20">
									<h2 className="text-2xl font-bold text-[#40513B] mb-6 flex items-center">
										<span className="text-3xl mr-3">✏️</span>
										Edit Profile
									</h2>
									<form onSubmit={handleSubmit} className="space-y-4">
										<div>
											<label className="block text-sm font-medium text-[#609966] mb-2">
												Display Name
											</label>
											<input
												type="text"
												value={formData.displayName}
												onChange={(e) =>
													setFormData({
														...formData,
														displayName: e.target.value,
													})
												}
												className="w-full px-4 py-3 rounded-xl border-2 border-[#9DC08B]/30 focus:border-[#609966] outline-none transition-colors bg-white/50"
												placeholder="Your display name"
											/>
										</div>
										<div>
											<label className="block text-sm font-medium text-[#609966] mb-2">
												Bio
											</label>
											<textarea
												value={formData.bio}
												onChange={(e) =>
													setFormData({ ...formData, bio: e.target.value })
												}
												rows={4}
												className="w-full px-4 py-3 rounded-xl border-2 border-[#9DC08B]/30 focus:border-[#609966] outline-none transition-colors bg-white/50"
												placeholder="Tell us about yourself..."
											/>
										</div>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div>
												<label className="block text-sm font-medium text-[#609966] mb-2">
													Location
												</label>
												<input
													type="text"
													value={formData.location}
													onChange={(e) =>
														setFormData({
															...formData,
															location: e.target.value,
														})
													}
													className="w-full px-4 py-3 rounded-xl border-2 border-[#9DC08B]/30 focus:border-[#609966] outline-none transition-colors bg-white/50"
													placeholder="Your location"
												/>
											</div>
											<div>
												<label className="block text-sm font-medium text-[#609966] mb-2">
													Interests
												</label>
												<input
													type="text"
													value={formData.interests}
													onChange={(e) =>
														setFormData({
															...formData,
															interests: e.target.value,
														})
													}
													className="w-full px-4 py-3 rounded-xl border-2 border-[#9DC08B]/30 focus:border-[#609966] outline-none transition-colors bg-white/50"
													placeholder="Wildlife, Photography..."
												/>
											</div>
										</div>
										<div className="flex space-x-3 pt-4">
											<button
												type="submit"
												disabled={loading}
												className="flex-1 px-6 py-3 bg-gradient-to-r from-[#609966] to-[#40513B] text-white rounded-xl font-medium hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50"
											>
												{loading ? "Saving..." : "💾 Save Changes"}
											</button>
											<button
												type="button"
												onClick={() => setIsEditing(false)}
												className="px-6 py-3 bg-[#9DC08B]/20 text-[#40513B] rounded-xl font-medium hover:bg-[#9DC08B]/30 transition-colors"
											>
												Cancel
											</button>
										</div>
									</form>
								</div>
							) : (
								<div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-[#9DC08B]/20">
									<h2 className="text-2xl font-bold text-[#40513B] mb-6 flex items-center">
										<span className="text-3xl mr-3">👤</span>
										About Me
									</h2>
									<div className="space-y-4">
										{user.bio ? (
											<p className="text-[#40513B] leading-relaxed">
												{user.bio}
											</p>
										) : (
											<p className="text-[#609966] italic">
												No bio added yet. Click "Edit Profile" to add one!
											</p>
										)}
										{user.interests && (
											<div>
												<p className="text-sm font-medium text-[#609966] mb-2">
													Interests
												</p>
												<div className="flex flex-wrap gap-2">
													{user.interests.split(",").map((interest, i) => (
														<span
															key={i}
															className="px-4 py-2 bg-gradient-to-r from-[#EDF1D6] to-[#9DC08B]/30 text-[#40513B] rounded-xl text-sm font-medium"
														>
															{interest.trim()}
														</span>
													))}
												</div>
											</div>
										)}
										<div className="pt-4 border-t border-[#9DC08B]/20">
											<p className="text-sm text-[#609966] mb-2">
												Member since
											</p>
											<p className="text-[#40513B] font-medium">
												{user.createdAt
													? new Date(user.createdAt).toLocaleDateString(
															"en-US",
															{ year: "numeric", month: "long", day: "numeric" }
														)
													: "Recently joined"}
											</p>
										</div>
									</div>
								</div>
							)}
						</>
					)}

					{activeTab === "badges" && (
						<div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-[#9DC08B]/20">
							<h2 className="text-2xl font-bold text-[#40513B] mb-6 flex items-center">
								<span className="text-3xl mr-3">🏅</span>
								My Badges
							</h2>
							{badges && badges.length > 0 ? (
								<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
									{badges.map((badge, index) => (
										<div
											key={index}
											className="bg-gradient-to-br from-[#EDF1D6] to-[#9DC08B]/20 rounded-2xl p-6 text-center hover:scale-105 transition-transform duration-300 border-2 border-[#9DC08B]/30"
										>
											<div className="text-5xl mb-3">{badge.icon}</div>
											<p className="font-bold text-[#40513B] mb-1">
												{badge.name}
											</p>
											<p className="text-xs text-[#609966]">
												{badge.description}
											</p>
											<p className="text-xs text-[#609966] mt-2">
												Earned: {new Date(badge.earnedAt).toLocaleDateString()}
											</p>
										</div>
									))}
								</div>
							) : (
								<div className="text-center py-12">
									<span className="text-6xl mb-4 block">🎯</span>
									<p className="text-[#609966] text-lg">
										No badges earned yet!
									</p>
									<p className="text-[#609966] mt-2">
										Start contributing to earn your first badge.
									</p>
								</div>
							)}
						</div>
					)}

					{activeTab === "activity" && (
						<div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-[#9DC08B]/20">
							<h2 className="text-2xl font-bold text-[#40513B] mb-6 flex items-center">
								<span className="text-3xl mr-3">📊</span>
								Recent Activity
							</h2>
							{pointsHistory && pointsHistory.length > 0 ? (
								<div className="space-y-3">
									{pointsHistory.slice(0, 10).map((activity, index) => (
										<div
											key={index}
											className="flex items-center justify-between p-4 bg-gradient-to-r from-[#EDF1D6] to-transparent rounded-xl hover:shadow-md transition-shadow"
										>
											<div className="flex items-center space-x-3">
												<div className="w-10 h-10 bg-gradient-to-r from-[#609966] to-[#40513B] rounded-xl flex items-center justify-center text-white">
													{activity.type === "sighting"
														? "📸"
														: activity.type === "blog"
															? "📝"
															: "⭐"}
												</div>
												<div>
													<p className="font-medium text-[#40513B]">
														{activity.description}
													</p>
													<p className="text-xs text-[#609966]">
														{new Date(activity.timestamp).toLocaleDateString()}
													</p>
												</div>
											</div>
											<span className="text-lg font-bold text-[#609966]">
												+{activity.points}
											</span>
										</div>
									))}
								</div>
							) : (
								<div className="text-center py-12">
									<span className="text-6xl mb-4 block">📭</span>
									<p className="text-[#609966] text-lg">No activity yet!</p>
									<p className="text-[#609966] mt-2">
										Start contributing to see your activity here.
									</p>
								</div>
							)}
						</div>
					)}
				</div>

				{/* Sidebar */}
				<div className="space-y-6">
					{/* Quick Actions */}
					<div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-[#9DC08B]/20">
						<h3 className="font-bold text-[#40513B] mb-4 flex items-center">
							<span className="text-xl mr-2">⚡</span>
							Quick Actions
						</h3>
						<div className="space-y-2">
							<a
								href="/submit-sighting"
								className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-[#609966] to-[#40513B] text-white hover:shadow-lg hover:scale-105 transition-all duration-300"
							>
								<span>📸</span>
								<span className="font-medium">Submit Sighting</span>
							</a>
							<a
								href="/create-blog"
								className="flex items-center space-x-3 p-3 rounded-xl bg-[#9DC08B]/30 text-[#40513B] hover:bg-[#9DC08B]/50 hover:scale-105 transition-all duration-300"
							>
								<span>✍️</span>
								<span className="font-medium">Write Blog</span>
							</a>
							<a
								href="/leaderboard"
								className="flex items-center space-x-3 p-3 rounded-xl bg-[#EDF1D6] text-[#40513B] hover:bg-[#9DC08B]/30 hover:scale-105 transition-all duration-300"
							>
								<span>🏆</span>
								<span className="font-medium">View Leaderboard</span>
							</a>
						</div>
					</div>

					{/* Achievements Preview */}
					<div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-[#9DC08B]/20">
						<h3 className="font-bold text-[#40513B] mb-4 flex items-center">
							<span className="text-xl mr-2">🎯</span>
							Next Milestone
						</h3>
						<div className="space-y-3">
							<div className="bg-gradient-to-r from-[#EDF1D6] to-[#9DC08B]/20 rounded-xl p-4">
								<p className="text-sm text-[#609966] mb-2">
									Points to Next Badge
								</p>
								<div className="flex items-center justify-between mb-2">
									<span className="text-2xl font-bold text-[#40513B]">
										{points || 0}
									</span>
									<span className="text-sm text-[#609966]">/ 1000</span>
								</div>
								<div className="w-full bg-white/50 rounded-full h-2 overflow-hidden">
									<div
										className="h-full bg-gradient-to-r from-[#609966] to-[#40513B] rounded-full transition-all duration-500"
										style={{ width: `${((points || 0) / 1000) * 100}%` }}
									></div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Profile;
