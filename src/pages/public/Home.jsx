import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { 
	HiCamera, 
	HiPencilAlt, 
	HiTrophy, 
	HiGlobeAlt, 
	HiEye, 
	HiUsers, 
	HiDocumentText, 
	HiChartBar,
	HiLocationMarker,
	HiArrowRight,
	HiFire,
	HiLightBulb,
	HiSearch,
	HiSparkles
} from "react-icons/hi";

const Home = () => {
	const { user } = useAuth();

	const features = [
		{
			Icon: HiCamera,
			title: "Document Wildlife",
			description:
				"Share your wildlife sightings with geo-tagged photos and detailed observations",
			color: "from-[#609966] to-[#40513B]",
		},
		{
			Icon: HiPencilAlt,
			title: "Share Stories",
			description:
				"Write engaging blogs about your wildlife encounters and conservation insights",
			color: "from-[#9DC08B] to-[#609966]",
		},
		{
			Icon: HiTrophy,
			title: "Earn Rewards",
			description:
				"Get points and badges for your contributions to wildlife conservation",
			color: "from-[#609966] to-[#40513B]",
		},
		{
			Icon: HiGlobeAlt,
			title: "Make Impact",
			description:
				"Your data helps researchers and conservationists protect wildlife",
			color: "from-[#9DC08B] to-[#609966]",
		},
	];

	const stats = [
		{ value: "1,234+", label: "Wildlife Sightings", Icon: HiEye },
		{ value: "567", label: "Active Contributors", Icon: HiUsers },
		{ value: "890", label: "Blog Posts", Icon: HiDocumentText },
		{ value: "45", label: "Species Documented", Icon: HiChartBar },
	];

	const recentSightings = [
		{
			id: 1,
			species: "Bengal Tiger",
			location: "Valparai Forest",
			points: 50,
		},
		{
			id: 2,
			species: "Indian Elephant",
			location: "Tea Estate",
			points: 45,
		},
		{
			id: 3,
			species: "Lion-tailed Macaque",
			location: "Rainforest",
			points: 55,
		},
	];

	return (
		<div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 py-8">
			{/* Hero Section - Bento Style */}
			<div className="relative bg-gradient-to-br from-[#40513B] via-[#609966] to-[#40513B] rounded-3xl overflow-hidden shadow-2xl">
				<div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
				<div className="relative z-10 px-6 sm:px-8 py-12 sm:py-16 md:py-24 text-center text-white">
					<div className="max-w-4xl mx-auto">
						<div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 animate-pulse">
							<span className="w-2 h-2 bg-[#9DC08B] rounded-full"></span>
							<span className="text-xs sm:text-sm font-medium">
								Citizen Science Platform
							</span>
						</div>

						<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
							Welcome to
							<span className="block text-[#EDF1D6] mt-2">
								Wildlife Valparai
							</span>
						</h1>

						<p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-8 leading-relaxed px-4">
							Join our community of wildlife enthusiasts documenting and
							protecting the incredible biodiversity of Valparai
						</p>

						<div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4">
							{user ? (
								<>
									<Link
										to="/submit-sighting"
										className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white text-[#40513B] rounded-2xl font-bold text-base sm:text-lg hover:scale-105 hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2"
									>
										<HiCamera className="w-5 h-5 sm:w-6 sm:h-6" />
										<span>Submit Sighting</span>
									</Link>
									<Link
										to="/sightings"
										className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white/20 backdrop-blur-sm text-white rounded-2xl font-bold text-base sm:text-lg hover:bg-white/30 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
									>
										<HiSearch className="w-5 h-5 sm:w-6 sm:h-6" />
										<span>Explore</span>
									</Link>
								</>
							) : (
								<>
									<Link
										to="/register"
										className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white text-[#40513B] rounded-2xl font-bold text-base sm:text-lg hover:scale-105 hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2"
									>
										<HiSparkles className="w-5 h-5 sm:w-6 sm:h-6" />
										<span>Get Started</span>
									</Link>
									<Link
										to="/sightings"
										className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white/20 backdrop-blur-sm text-white rounded-2xl font-bold text-base sm:text-lg hover:bg-white/30 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
									>
										<HiSearch className="w-5 h-5 sm:w-6 sm:h-6" />
										<span>Explore Sightings</span>
									</Link>
								</>
							)}
						</div>
					</div>
				</div>

				{/* Decorative Elements */}
				<div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
				<div
					className="absolute bottom-10 right-10 w-32 h-32 bg-[#9DC08B]/20 rounded-full blur-xl animate-pulse"
					style={{ animationDelay: "1s" }}
				></div>
			</div>

			{/* Stats - Bento Grid */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
				{stats.map((stat, index) => (
					<div
						key={index}
						className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-[#9DC08B]/20 text-center group"
						style={{ animationDelay: `${index * 0.1}s` }}
					>
						<div className="text-5xl mb-3 group-hover:scale-110 transition-transform">
							{stat.icon}
						</div>
						<p className="text-3xl font-bold text-[#40513B] mb-1">
							{stat.value}
						</p>
						<p className="text-sm text-[#609966]">{stat.label}</p>
					</div>
				))}
			</div>

			{/* Features Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{features.map((feature, index) => (
					<div
						key={index}
						className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-[#9DC08B]/20 group"
					>
						<div
							className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center text-4xl mb-4 group-hover:rotate-12 transition-transform duration-300`}
						>
							{feature.icon}
						</div>
						<h3 className="text-2xl font-bold text-[#40513B] mb-3">
							{feature.title}
						</h3>
						<p className="text-[#609966] leading-relaxed">
							{feature.description}
						</p>
					</div>
				))}
			</div>

			{/* Recent Sightings Section */}
			<div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-[#9DC08B]/20">
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-3xl font-bold text-[#40513B] flex items-center">
						<span className="text-4xl mr-3">🔥</span>
						Recent Sightings
					</h2>
					<Link
						to="/sightings"
						className="px-6 py-3 bg-gradient-to-r from-[#609966] to-[#40513B] text-white rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
					>
						View All →
					</Link>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{recentSightings.map((sighting) => (
						<div
							key={sighting.id}
							className="bg-gradient-to-br from-[#EDF1D6] to-[#9DC08B]/20 rounded-2xl p-6 hover:scale-105 transition-transform duration-300 border-2 border-[#9DC08B]/30"
						>
							<div className="text-6xl mb-4 text-center">{sighting.image}</div>
							<h4 className="text-xl font-bold text-[#40513B] mb-2">
								{sighting.species}
							</h4>
							<p className="text-sm text-[#609966] mb-3 flex items-center">
								<span className="mr-2">📍</span>
								{sighting.location}
							</p>
							<div className="flex items-center justify-between">
								<span className="text-sm font-medium text-[#609966]">
									+{sighting.points} points
								</span>
								<Link
									to={`/sightings/${sighting.id}`}
									className="text-sm text-[#40513B] hover:text-[#609966] font-medium"
								>
									View Details →
								</Link>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Call to Action */}
			{!user && (
				<div className="bg-gradient-to-r from-[#609966] to-[#40513B] rounded-3xl p-8 md:p-12 shadow-2xl text-center text-white">
					<h2 className="text-3xl md:text-4xl font-bold mb-4">
						Ready to Make a Difference?
					</h2>
					<p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
						Join thousands of wildlife enthusiasts contributing to conservation
						efforts in Valparai
					</p>
					<div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
						<Link
							to="/register"
							className="w-full sm:w-auto px-8 py-4 bg-white text-[#40513B] rounded-2xl font-bold text-lg hover:scale-105 hover:shadow-2xl transition-all duration-300"
						>
							Sign Up Free
						</Link>
						<Link
							to="/about"
							className="w-full sm:w-auto px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-2xl font-bold text-lg hover:bg-white/30 hover:scale-105 transition-all duration-300"
						>
							Learn More
						</Link>
					</div>
				</div>
			)}

			{/* How It Works */}
			<div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-[#9DC08B]/20">
				<h2 className="text-3xl font-bold text-[#40513B] mb-8 text-center flex items-center justify-center">
					<span className="text-4xl mr-3">💡</span>
					How It Works
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					<div className="text-center">
						<div className="w-20 h-20 bg-gradient-to-r from-[#609966] to-[#40513B] rounded-full flex items-center justify-center text-4xl mx-auto mb-4 text-white font-bold shadow-lg">
							1
						</div>
						<h3 className="text-xl font-bold text-[#40513B] mb-2">
							Spot Wildlife
						</h3>
						<p className="text-[#609966]">
							Encounter wildlife in Valparai and capture the moment
						</p>
					</div>
					<div className="text-center">
						<div className="w-20 h-20 bg-gradient-to-r from-[#9DC08B] to-[#609966] rounded-full flex items-center justify-center text-4xl mx-auto mb-4 text-white font-bold shadow-lg">
							2
						</div>
						<h3 className="text-xl font-bold text-[#40513B] mb-2">
							Document & Share
						</h3>
						<p className="text-[#609966]">
							Upload photos, add details, and share your sighting
						</p>
					</div>
					<div className="text-center">
						<div className="w-20 h-20 bg-gradient-to-r from-[#609966] to-[#40513B] rounded-full flex items-center justify-center text-4xl mx-auto mb-4 text-white font-bold shadow-lg">
							3
						</div>
						<h3 className="text-xl font-bold text-[#40513B] mb-2">
							Earn & Impact
						</h3>
						<p className="text-[#609966]">
							Get points, badges, and contribute to conservation
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Home;
