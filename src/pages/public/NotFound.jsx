import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const NotFound = () => {
	const { user } = useAuth();

	const suggestions = [
		{
			icon: "🏠",
			title: "Go Home",
			description: "Return to the homepage",
			link: "/",
			color: "from-[#609966] to-[#40513B]",
		},
		{
			icon: "📸",
			title: "Browse Sightings",
			description: "Explore wildlife photos",
			link: "/sightings",
			color: "from-[#9DC08B] to-[#609966]",
		},
		{
			icon: "📝",
			title: "Read Blogs",
			description: "Check out latest stories",
			link: "/blogs",
			color: "from-[#609966] to-[#40513B]",
		},
		{
			icon: "🤝",
			title: "About Us",
			description: "Learn about our mission",
			link: "/about",
			color: "from-[#9DC08B] to-[#609966]",
		},
	];

	const quickLinks = [
		{ name: "Home", path: "/" },
		{ name: "Sightings", path: "/sightings" },
		{ name: "Blogs", path: "/blogs" },
		{ name: "Leaderboard", path: "/leaderboard" },
		{ name: "About", path: "/about" },
		{ name: "Contact", path: "/contact" },
	];

	return (
		<div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12">
			<div className="w-full max-w-5xl mx-auto">
				{/* Main Error Section */}
				<div className="bg-gradient-to-br from-[#40513B] via-[#609966] to-[#40513B] rounded-3xl p-12 md:p-16 text-white shadow-2xl relative overflow-hidden mb-8">
					<div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
					<div
						className="absolute bottom-0 left-0 w-64 h-64 bg-[#9DC08B]/10 rounded-full blur-3xl animate-pulse"
						style={{ animationDelay: "1s" }}
					></div>

					<div className="relative z-10 text-center">
						<div className="text-8xl mb-6 animate-bounce">🦉</div>
						<h1 className="text-6xl md:text-8xl font-bold mb-4">404</h1>
						<h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#EDF1D6]">
							Page Not Found
						</h2>
						<p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
							Oops! Looks like this page went on a wildlife adventure and didn't
							come back. Even our tracking experts couldn't find it!
						</p>

						<div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
							<Link
								to="/"
								className="px-8 py-4 bg-white text-[#40513B] rounded-2xl font-bold text-lg hover:scale-105 hover:shadow-2xl transition-all duration-300"
							>
								Take Me Home
							</Link>
							{!user && (
								<Link
									to="/register"
									className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-2xl font-bold text-lg hover:bg-white/30 hover:scale-105 transition-all duration-300"
								>
									Join Community
								</Link>
							)}
						</div>
					</div>
				</div>

				{/* Suggestions Grid */}
				<div className="mb-8">
					<h3 className="text-2xl font-bold text-[#40513B] mb-6 text-center">
						Where would you like to go?
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						{suggestions.map((suggestion, index) => (
							<Link key={index} to={suggestion.link} className="group">
								<div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-[#9DC08B]/20 text-center">
									<div
										className={`w-16 h-16 bg-gradient-to-r ${suggestion.color} rounded-2xl flex items-center justify-center text-4xl mx-auto mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`}
									>
										{suggestion.icon}
									</div>
									<h4 className="text-lg font-bold text-[#40513B] mb-2">
										{suggestion.title}
									</h4>
									<p className="text-sm text-[#609966]">
										{suggestion.description}
									</p>
								</div>
							</Link>
						))}
					</div>
				</div>

				{/* Quick Links */}
				<div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-[#9DC08B]/20">
					<h3 className="text-xl font-bold text-[#40513B] mb-4 text-center flex items-center justify-center">
						<span className="text-2xl mr-2">🔗</span>
						Quick Navigation
					</h3>
					<div className="flex flex-wrap justify-center gap-3">
						{quickLinks.map((link, index) => (
							<Link
								key={index}
								to={link.path}
								className="px-6 py-3 bg-gradient-to-r from-[#EDF1D6] to-[#9DC08B]/30 text-[#40513B] rounded-xl font-medium hover:scale-105 hover:shadow-lg transition-all duration-300 border-2 border-[#9DC08B]/30"
							>
								{link.name}
							</Link>
						))}
					</div>
				</div>

				{/* Help Section */}
				<div className="mt-8 bg-gradient-to-r from-[#EDF1D6] to-[#9DC08B]/30 rounded-3xl p-8 border border-[#9DC08B]/20">
					<div className="text-center">
						<h3 className="text-xl font-bold text-[#40513B] mb-4">
							Still can't find what you're looking for?
						</h3>
						<p className="text-[#609966] mb-6">
							Our team is here to help you navigate
						</p>
						<div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
							<Link
								to="/contact"
								className="px-8 py-3 bg-gradient-to-r from-[#609966] to-[#40513B] text-white rounded-2xl font-bold hover:scale-105 hover:shadow-xl transition-all duration-300"
							>
								Contact Support
							</Link>
							<a
								href="mailto:info@wildlifevalparai.org"
								className="px-8 py-3 bg-white text-[#40513B] rounded-2xl font-bold hover:scale-105 hover:shadow-xl transition-all duration-300 border-2 border-[#9DC08B]/30"
							>
								Email Us
							</a>
						</div>
					</div>
				</div>

				{/* Fun Wildlife Facts */}
				<div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
					<div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-[#9DC08B]/20 text-center hover:scale-105 transition-transform">
						<div className="text-4xl mb-3">🐘</div>
						<p className="text-sm text-[#609966] leading-relaxed">
							While you're here, did you know elephants can recognize themselves
							in mirrors?
						</p>
					</div>
					<div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-[#9DC08B]/20 text-center hover:scale-105 transition-transform">
						<div className="text-4xl mb-3">🦁</div>
						<p className="text-sm text-[#609966] leading-relaxed">
							A lion's roar can be heard from as far as 5 miles away!
						</p>
					</div>
					<div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-[#9DC08B]/20 text-center hover:scale-105 transition-transform">
						<div className="text-4xl mb-3">🦋</div>
						<p className="text-sm text-[#609566] leading-relaxed">
							Butterflies taste with their feet to find their favorite plants!
						</p>
					</div>
				</div>

				{/* Search Alternative */}
				<div className="mt-8 text-center">
					<p className="text-[#609966] text-sm">
						Error Code: 404 | Page Not Found |
						<Link
							to="/"
							className="text-[#40513B] font-medium hover:underline ml-1"
						>
							Return to Homepage
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export default NotFound;
