import { 
	HiShieldCheck, 
	HiBeaker, 
	HiUsers, 
	HiCode,
	HiGlobeAlt,
	HiHeart,
	HiChartBar,
	HiLightningBolt,
	HiCamera,
	HiUserGroup,
	HiSparkles,
	HiLeaf
} from "react-icons/hi";

const About = () => {
	const team = [
		{
			name: "Conservation Team",
			role: "Wildlife Experts",
			Icon: HiShieldCheck,
			color: "from-[#609966] to-[#40513B]",
		},
		{
			name: "Research Division",
			role: "Data Scientists",
			Icon: HiBeaker,
			color: "from-[#9DC08B] to-[#609966]",
		},
		{
			name: "Community",
			role: "Citizen Scientists",
			Icon: HiUsers,
			color: "from-[#609966] to-[#40513B]",
		},
		{
			name: "Tech Team",
			role: "Platform Development",
			Icon: HiCode,
			color: "from-[#9DC08B] to-[#609966]",
		},
	];

	const values = [
		{
			Icon: HiLeaf,
			title: "Conservation First",
			description:
				"Every contribution helps protect and preserve wildlife in Valparai",
		},
		{
			Icon: HiHeart,
			title: "Community Driven",
			description:
				"Built by the community, for the community of wildlife enthusiasts",
		},
		{
			Icon: HiChartBar,
			title: "Data-Backed",
			description: "Scientific approach to wildlife documentation and research",
		},
		{
			Icon: HiGlobeAlt,
			title: "Global Impact",
			description:
				"Local actions contributing to worldwide conservation efforts",
		},
	];

	const milestones = [
		{
			year: "2023",
			title: "Platform Launch",
			description: "Wildlife Valparai goes live",
			Icon: HiLightningBolt,
		},
		{
			year: "2024",
			title: "1000+ Sightings",
			description: "Community reaches first milestone",
			Icon: HiCamera,
		},
		{
			year: "2025",
			title: "Research Partnership",
			description: "Collaboration with conservation orgs",
			Icon: HiUserGroup,
		},
		{
			year: "Future",
			title: "Growing Impact",
			description: "Expanding to new regions",
			Icon: HiSparkles,
		},
	];

	return (
		<div className="space-y-12">
			{/* Hero Section */}
			<div className="bg-gradient-to-br from-[#40513B] via-[#609966] to-[#40513B] rounded-3xl p-8 md:p-16 text-white shadow-2xl relative overflow-hidden">
				<div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
				<div className="absolute bottom-0 left-0 w-64 h-64 bg-[#9DC08B]/10 rounded-full blur-3xl"></div>
				<div className="relative z-10 max-w-3xl">
					<div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
						<HiLeaf className="w-5 h-5" />
						<span className="text-sm font-medium">About Us</span>
					</div>
					<h1 className="text-4xl md:text-5xl font-bold mb-6">
						Protecting Wildlife Through
						<span className="block text-[#EDF1D6] mt-2">Citizen Science</span>
					</h1>
					<p className="text-xl text-white/90 leading-relaxed">
						Wildlife Valparai is a citizen science platform empowering
						communities to document, share, and protect the incredible
						biodiversity of Valparai's forests and tea estates.
					</p>
				</div>
			</div>

			{/* Mission & Vision */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-[#9DC08B]/20">
					<div className="w-16 h-16 bg-gradient-to-r from-[#609966] to-[#40513B] rounded-2xl flex items-center justify-center mb-4">
						<HiShieldCheck className="w-10 h-10 text-white" />
					</div>
					<h2 className="text-2xl font-bold text-[#40513B] mb-4">
						Our Mission
					</h2>
					<p className="text-[#609966] leading-relaxed">
						To create a collaborative platform where wildlife enthusiasts,
						researchers, and local communities can contribute to the
						conservation of Valparai's rich biodiversity through systematic
						documentation and data sharing.
					</p>
				</div>

				<div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-[#9DC08B]/20">
					<div className="w-16 h-16 bg-gradient-to-r from-[#9DC08B] to-[#609966] rounded-2xl flex items-center justify-center mb-4">
						<HiLightBulb className="w-10 h-10 text-white" />
					</div>
					<h2 className="text-2xl font-bold text-[#40513B] mb-4">Our Vision</h2>
					<p className="text-[#609966] leading-relaxed">
						A future where every wildlife sighting contributes to conservation
						efforts, where technology bridges the gap between citizens and
						scientists, and where Valparai becomes a model for community-driven
						conservation.
					</p>
				</div>
			</div>

			{/* Values */}
			<div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-[#9DC08B]/20">
				<h2 className="text-3xl font-bold text-[#40513B] mb-8 text-center flex items-center justify-center">
					<HiSparkles className="w-8 h-8 mr-3" />
					Our Core Values
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{values.map((value, index) => {
						const { Icon } = value;
						return (
							<div
								key={index}
								className="text-center p-6 bg-gradient-to-br from-[#EDF1D6] to-[#9DC08B]/20 rounded-2xl hover:scale-105 transition-transform duration-300 border-2 border-[#9DC08B]/30"
							>
								<div className="flex items-center justify-center mb-3">
									<Icon className="w-12 h-12 text-[#609966]" />
								</div>
								<h3 className="text-lg font-bold text-[#40513B] mb-2">
									{value.title}
								</h3>
								<p className="text-sm text-[#609966]">{value.description}</p>
							</div>
						);
					})}
				</div>
			</div>

			{/* The Story */}
			<div className="bg-gradient-to-r from-[#EDF1D6] to-[#9DC08B]/30 rounded-3xl p-8 md:p-12 border border-[#9DC08B]/20">
				<div className="max-w-4xl mx-auto">
					<h2 className="text-3xl font-bold text-[#40513B] mb-6 text-center flex items-center justify-center">
						<HiCamera className="w-8 h-8 mr-3" />
						Our Story
					</h2>
					<div className="space-y-4 text-[#40513B] leading-relaxed">
						<p className="text-lg">
							Valparai, nestled in the Western Ghats of Tamil Nadu, is a
							biodiversity hotspot home to elephants, tigers, leopards, and
							countless other species. However, this incredible wildlife often
							goes undocumented, with sightings shared only through word of
							mouth.
						</p>
						<p className="text-lg">
							Wildlife Valparai was born from a simple idea: what if every
							wildlife enthusiast, from tea estate workers to tourists, could
							contribute to conservation by documenting their sightings? What if
							their observations could help researchers, guide conservation
							policies, and educate communities?
						</p>
						<p className="text-lg">
							Today, we're building that reality. Our platform transforms casual
							wildlife observations into valuable scientific data, rewards
							contributors, and creates a vibrant community united by their love
							for nature.
						</p>
					</div>
				</div>
			</div>

			{/* Team */}
			<div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-[#9DC08B]/20">
				<h2 className="text-3xl font-bold text-[#40513B] mb-8 text-center flex items-center justify-center">
					<HiUsers className="w-8 h-8 mr-3" />
					Our Team
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{team.map((member, index) => {
						const { Icon } = member;
						return (
							<div key={index} className="text-center group">
								<div
									className={`w-24 h-24 bg-gradient-to-r ${member.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`}
								>
									<Icon className="w-12 h-12 text-white" />
								</div>
								<h3 className="text-lg font-bold text-[#40513B] mb-1">
									{member.name}
								</h3>
								<p className="text-sm text-[#609966]">{member.role}</p>
							</div>
						);
					})}
				</div>
			</div>

			{/* Timeline */}
			<div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-[#9DC08B]/20">
				<h2 className="text-3xl font-bold text-[#40513B] mb-8 text-center flex items-center justify-center">
					<HiChartBar className="w-8 h-8 mr-3" />
					Our Journey
				</h2>
				<div className="relative">
					{/* Timeline Line */}
					<div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-[#609966] via-[#9DC08B] to-[#40513B]"></div>

					<div className="space-y-8">
						{milestones.map((milestone, index) => {
							const { Icon } = milestone;
							return (
								<div
									key={index}
									className={`flex items-center ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
								>
									<div className="flex-1 md:text-right md:pr-8">
										{index % 2 === 0 && (
											<div className="bg-gradient-to-br from-[#EDF1D6] to-[#9DC08B]/20 rounded-2xl p-6 hover:scale-105 transition-transform border-2 border-[#9DC08B]/30">
												<div className="flex items-center justify-end mb-2">
													<Icon className="w-10 h-10 text-[#609966]" />
												</div>
												<h3 className="text-xl font-bold text-[#40513B] mb-2">
													{milestone.title}
												</h3>
												<p className="text-[#609966] mb-2">
													{milestone.description}
												</p>
												<span className="inline-block px-3 py-1 bg-gradient-to-r from-[#609966] to-[#40513B] text-white rounded-lg text-sm font-medium">
													{milestone.year}
												</span>
											</div>
										)}
									</div>

									<div className="hidden md:block relative z-10 w-4 h-4 bg-white border-4 border-[#609966] rounded-full"></div>

									<div className="flex-1 md:pl-8">
										{index % 2 !== 0 && (
											<div className="bg-gradient-to-br from-[#EDF1D6] to-[#9DC08B]/20 rounded-2xl p-6 hover:scale-105 transition-transform border-2 border-[#9DC08B]/30">
												<div className="flex items-center mb-2">
													<Icon className="w-10 h-10 text-[#609966]" />
												</div>
												<h3 className="text-xl font-bold text-[#40513B] mb-2">
													{milestone.title}
												</h3>
												<p className="text-[#609966] mb-2">
													{milestone.description}
												</p>
												<span className="inline-block px-3 py-1 bg-gradient-to-r from-[#609966] to-[#40513B] text-white rounded-lg text-sm font-medium">
													{milestone.year}
												</span>
											</div>
										)}
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>

			{/* Impact Stats */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				<div className="bg-gradient-to-br from-[#609966] to-[#40513B] rounded-2xl p-6 text-white text-center shadow-xl hover:scale-105 transition-transform">
					<p className="text-4xl font-bold mb-2">1000+</p>
					<p className="text-sm">Wildlife Documented</p>
				</div>
				<div className="bg-gradient-to-br from-[#9DC08B] to-[#609966] rounded-2xl p-6 text-white text-center shadow-xl hover:scale-105 transition-transform">
					<p className="text-4xl font-bold mb-2">500+</p>
					<p className="text-sm">Active Members</p>
				</div>
				<div className="bg-gradient-to-br from-[#609966] to-[#40513B] rounded-2xl p-6 text-white text-center shadow-xl hover:scale-105 transition-transform">
					<p className="text-4xl font-bold mb-2">45</p>
					<p className="text-sm">Species Tracked</p>
				</div>
				<div className="bg-gradient-to-br from-[#9DC08B] to-[#609966] rounded-2xl p-6 text-white text-center shadow-xl hover:scale-105 transition-transform">
					<p className="text-4xl font-bold mb-2">100%</p>
					<p className="text-sm">Community Driven</p>
				</div>
			</div>

			{/* Call to Action */}
			<div className="bg-gradient-to-r from-[#40513B] to-[#609966] rounded-3xl p-8 md:p-12 text-white text-center shadow-2xl">
				<h2 className="text-3xl md:text-4xl font-bold mb-4">
					Join Our Conservation Community
				</h2>
				<p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
					Every sighting matters. Every observation counts. Be part of something
					bigger.
				</p>
				<div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
					<a
						href="/register"
						className="w-full sm:w-auto px-8 py-4 bg-white text-[#40513B] rounded-2xl font-bold text-lg hover:scale-105 hover:shadow-2xl transition-all duration-300"
					>
						Get Started Today
					</a>
					<a
						href="/contact"
						className="w-full sm:w-auto px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-2xl font-bold text-lg hover:bg-white/30 hover:scale-105 transition-all duration-300"
					>
						Contact Us
					</a>
				</div>
			</div>
		</div>
	);
};

export default About;
