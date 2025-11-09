import { Link } from "react-router-dom";
import CreatorStats from "../../components/dashboard/CreatorStats";
import PointsDisplay from "../../components/dashboard/PointsDisplay";

const CreatorDashboard = () => {
	const quickActions = [
		{
			title: "Submit Sighting",
			description: "Share a wildlife sighting",
			icon: "📸",
			link: "/creator/submit-sighting",
			color: "from-[#609966] to-[#40513B]",
		},
		{
			title: "Create Blog",
			description: "Write a new blog post",
			icon: "✍️",
			link: "/creator/create-blog",
			color: "from-[#9DC08B] to-[#609966]",
		},
		{
			title: "Upload Media",
			description: "Add photos with audio",
			icon: "🎵",
			link: "/creator/upload-photo-audio",
			color: "from-[#EDF1D6] to-[#9DC08B]",
		},
		{
			title: "My Content",
			description: "Manage your posts",
			icon: "📂",
			link: "/creator/my-content",
			color: "from-[#40513B] to-[#609966]",
		},
	];

	return (
		<div className="min-h-screen bg-gradient-to-br from-[#EDF1D6] via-white to-[#9DC08B]/20 py-8">
			<div className="max-w-7xl mx-auto px-4 space-y-8">
				{/* Welcome Banner */}
				<div className="bg-gradient-to-r from-[#609966] to-[#40513B] rounded-3xl p-8 shadow-2xl text-white">
					<div className="flex flex-col md:flex-row md:items-center md:justify-between">
						<div>
							<h1 className="text-4xl font-bold mb-2 flex items-center">
								<span className="mr-3">👋</span>
								Welcome Back, Creator!
							</h1>
							<p className="text-lg opacity-90">
								Continue sharing your wildlife experiences with the community
							</p>
						</div>
						<div className="mt-6 md:mt-0 text-right">
							<div className="text-5xl font-bold mb-1">24</div>
							<div className="text-sm opacity-90">Total Contributions</div>
						</div>
					</div>
				</div>

				{/* Quick Actions Grid */}
				<div>
					<h2 className="text-2xl font-bold text-[#40513B] mb-4 flex items-center">
						<span className="mr-2">⚡</span>
						Quick Actions
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						{quickActions.map((action, index) => (
							<Link
								key={index}
								to={action.link}
								className="group bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-2 border-[#9DC08B]/20 hover:scale-105 hover:shadow-2xl transition-all duration-300"
							>
								<div className="text-5xl mb-4">{action.icon}</div>
								<h3 className="text-xl font-bold text-[#40513B] mb-2 group-hover:text-[#609966] transition-colors">
									{action.title}
								</h3>
								<p className="text-sm text-[#609966]">{action.description}</p>
								<div className="mt-4 text-right">
									<span className="text-[#609966] group-hover:translate-x-1 inline-block transition-transform">
										→
									</span>
								</div>
							</Link>
						))}
					</div>
				</div>

				{/* Points Display */}
				<div>
					<h2 className="text-2xl font-bold text-[#40513B] mb-4 flex items-center">
						<span className="mr-2">💰</span>
						Your Earnings
					</h2>
					<PointsDisplay showHistory={true} />
				</div>

				{/* Creator Stats */}
				<div>
					<CreatorStats />
				</div>

				{/* Recent Activity */}
				<div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 border-[#9DC08B]/20">
					<h2 className="text-2xl font-bold text-[#40513B] mb-4 flex items-center">
						<span className="mr-2">📋</span>
						Recent Activity
					</h2>
					<div className="space-y-3">
						{[
							{
								action: "Blog published",
								title: "Elephant Migration Patterns",
								time: "2 hours ago",
								icon: "📝",
								status: "success",
							},
							{
								action: "Sighting approved",
								title: "Rare Bird Sighting",
								time: "5 hours ago",
								icon: "✅",
								status: "success",
							},
							{
								action: "Comment received",
								title: "Conservation Success Story",
								time: "1 day ago",
								icon: "💬",
								status: "info",
							},
							{
								action: "Sighting pending review",
								title: "Tiger Footprints",
								time: "2 days ago",
								icon: "⏳",
								status: "pending",
							},
						].map((activity, index) => (
							<div
								key={index}
								className="flex items-center justify-between p-4 bg-[#EDF1D6] rounded-xl hover:bg-[#9DC08B]/30 transition-colors"
							>
								<div className="flex items-center space-x-4">
									<div className="text-3xl">{activity.icon}</div>
									<div>
										<div className="font-bold text-[#40513B]">
											{activity.action}
										</div>
										<div className="text-sm text-[#609966]">
											{activity.title}
										</div>
									</div>
								</div>
								<div className="text-right">
									<div className="text-sm text-[#609966]">{activity.time}</div>
									<div
										className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${
											activity.status === "success"
												? "bg-green-100 text-green-700"
												: activity.status === "pending"
													? "bg-yellow-100 text-yellow-700"
													: "bg-blue-100 text-blue-700"
										}`}
									>
										{activity.status}
									</div>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Tips & Resources */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-2 border-[#9DC08B]/20">
						<h3 className="text-xl font-bold text-[#40513B] mb-4 flex items-center">
							<span className="mr-2">💡</span>
							Creator Tips
						</h3>
						<ul className="space-y-3">
							<li className="flex items-start space-x-2">
								<span className="text-green-500">✓</span>
								<span className="text-sm text-[#609966]">
									Post during peak hours (6-9 PM) for better engagement
								</span>
							</li>
							<li className="flex items-start space-x-2">
								<span className="text-green-500">✓</span>
								<span className="text-sm text-[#609966]">
									Use high-quality images to attract more viewers
								</span>
							</li>
							<li className="flex items-start space-x-2">
								<span className="text-green-500">✓</span>
								<span className="text-sm text-[#609966]">
									Add detailed descriptions for better SEO
								</span>
							</li>
						</ul>
					</div>

					<div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-2 border-[#9DC08B]/20">
						<h3 className="text-xl font-bold text-[#40513B] mb-4 flex items-center">
							<span className="mr-2">🎯</span>
							Goals & Milestones
						</h3>
						<div className="space-y-4">
							<div>
								<div className="flex justify-between text-sm mb-1">
									<span className="text-[#609966]">Monthly Target</span>
									<span className="font-bold text-[#40513B]">80%</span>
								</div>
								<div className="w-full bg-[#EDF1D6] rounded-full h-2">
									<div
										className="bg-gradient-to-r from-[#609966] to-[#40513B] h-2 rounded-full"
										style={{ width: "80%" }}
									/>
								</div>
							</div>
							<div className="text-sm text-[#609966]">
								4 more contributions to reach your monthly goal! 🎉
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CreatorDashboard;
