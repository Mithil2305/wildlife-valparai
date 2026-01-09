import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
	HiSparkles,
	HiUserGroup,
	HiPhotograph,
	HiCurrencyRupee,
	HiShieldCheck,
	HiGlobeAlt,
	HiHeart,
	HiMicrophone,
} from "react-icons/hi";

// --- Animations ---
const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: { staggerChildren: 0.1 },
	},
};

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

// --- Sub-Components ---
const FeatureCard = ({
	icon: Icon,
	title,
	description,
	colorClass,
	gradient,
}) => (
	<motion.div
		variants={itemVariants}
		className={`relative overflow-hidden p-8 rounded-[2rem] border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 group bg-white`}
	>
		{/* Subtle Gradient Background on Hover */}
		<div
			className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br ${gradient}`}
		></div>

		{/* Decorative Circle */}
		<div
			className={`absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-10 ${colorClass.replace(
				"text-",
				"bg-"
			)} blur-2xl group-hover:scale-150 transition-transform duration-700`}
		></div>

		<div
			className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${colorClass} group-hover:scale-110 transition-transform duration-300 relative z-10 shadow-md`}
		>
			<Icon className="text-3xl text-white" />
		</div>
		<h3 className="text-2xl font-extrabold text-gray-900 mb-3 relative z-10 group-hover:translate-x-1 transition-transform">
			{title}
		</h3>
		<p className="text-gray-600 leading-relaxed text-base relative z-10 group-hover:text-gray-800 transition-colors">
			{description}
		</p>
	</motion.div>
);

const About = () => {
	return (
		<div className="min-h-screen bg-[#FAFAFA] font-sans">
			{/* --- Hero Section --- */}
			<section className="relative overflow-hidden bg-[#1A331A] py-20 md:py-32">
				{/* Decorative Background Elements */}
				<div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white opacity-5 rounded-full blur-3xl -mr-32 -mt-32"></div>
				<div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#4A7A4A] opacity-20 rounded-full blur-3xl -ml-20 -mb-20"></div>

				<div className="container mx-auto max-w-7xl px-4 md:px-6 relative z-10 text-center">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
					>
						<span className="inline-block py-1 px-3 rounded-full bg-white/10 border border-white/20 text-green-100 text-sm font-semibold mb-6 backdrop-blur-md">
							Rediscovering Valparai
						</span>
						<h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight">
							Where Nature Meets <br className="hidden md:block" />
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-400">
								Community Innovation
							</span>
						</h1>
						<p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
							A digital ecosystem built to preserve our wildlife, empower local
							creators, and share the untold stories of the Anamalai Hills with
							the world.
						</p>
						<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
							<Link
								to="/register"
								className="px-8 py-4 bg-white text-[#1A331A] font-bold rounded-xl hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 w-full sm:w-auto"
							>
								Join the Community
							</Link>
							<Link
								to="/socials"
								className="px-8 py-4 bg-transparent border border-white/30 text-white font-bold rounded-xl hover:bg-white/10 transition-all w-full sm:w-auto"
							>
								Explore Content
							</Link>
						</div>
					</motion.div>
				</div>
			</section>

			{/* --- Mission Grid --- */}
			<section className="py-20 md:py-32 px-4 bg-white relative">
				{/* Background Pattern */}
				<div className="absolute inset-0 opacity-30 pointer-events-none bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>

				<div className="container mx-auto max-w-7xl relative z-10">
					<div className="text-center mb-20">
						<h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">
							Three Pillars of{" "}
							<span className="text-[#335833] underline decoration-4 decoration-green-200 underline-offset-4">
								Impact
							</span>
						</h2>
						<p className="text-xl text-gray-500 max-w-2xl mx-auto">
							We are bridging the gap between tourism, conservation, and local
							livelihoods through technology.
						</p>
					</div>

					<motion.div
						variants={containerVariants}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true }}
						className="grid grid-cols-1 md:grid-cols-3 gap-8"
					>
						<FeatureCard
							icon={HiGlobeAlt}
							title="Digital Conservation"
							description="Building a real-time archive of Valparai’s biodiversity through crowd-sourced photography and audio recordings."
							colorClass="bg-blue-500 text-blue-500"
							gradient="from-blue-500 to-cyan-400"
						/>
						<FeatureCard
							icon={HiCurrencyRupee}
							title="Creator Economy"
							description="Empowering locals, guides, and students to earn passive income by sharing their daily encounters with nature."
							colorClass="bg-green-600 text-green-600"
							gradient="from-green-500 to-emerald-400"
						/>
						<FeatureCard
							icon={HiShieldCheck}
							title="Human-Wildlife Harmony"
							description="Fostering coexistence by sharing real-time updates and educational stories about the animals we share our home with."
							colorClass="bg-orange-500 text-orange-500"
							gradient="from-orange-500 to-amber-400"
						/>
					</motion.div>
				</div>
			</section>

			{/* --- How It Works (Bento Style) --- */}
			<section className="py-16 bg-[#FAFAFA] border-y border-gray-100">
				<div className="container mx-auto max-w-7xl px-4">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
						{/* Left: Text Content */}
						<div className="space-y-8">
							<div>
								<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
									A Platform for Everyone
								</h2>
								<p className="text-gray-600 text-lg leading-relaxed mb-6">
									Whether you're a local resident with a smartphone or a tourist
									looking for authentic experiences, Wildlife Valparai has
									something for you.
								</p>
							</div>

							<div className="space-y-6">
								<div className="flex gap-4">
									<div className="mt-1">
										<div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
											<HiSparkles size={20} />
										</div>
									</div>
									<div>
										<h4 className="text-xl font-bold text-gray-900">
											For Creators (Locals)
										</h4>
										<p className="text-gray-600 mt-1">
											Take photos, record bird calls, and write blogs. Earn
											points for every contribution and compete for monthly{" "}
											<span className="font-bold text-[#335833]">
												Cash Prizes up to ₹10,000
											</span>
											.
										</p>
									</div>
								</div>

								<div className="flex gap-4">
									<div className="mt-1">
										<div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600">
											<HiUserGroup size={20} />
										</div>
									</div>
									<div>
										<h4 className="text-xl font-bold text-gray-900">
											For Viewers (Tourists)
										</h4>
										<p className="text-gray-600 mt-1">
											Don't just see Valparai—hear it. Listen to rare bird calls
											recorded by experts, read local stories, and find the best
											spots for sightings.
										</p>
									</div>
								</div>
							</div>
						</div>

						{/* Right: Visual Bento Grid */}
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-4 mt-8">
								<div className="bg-white p-6 rounded-3xl text-center border border-gray-100 shadow-sm">
									<HiPhotograph className="text-4xl text-blue-400 mx-auto mb-3" />
									<h4 className="font-bold text-gray-800">Visuals</h4>
									<p className="text-xs text-gray-500">Share Photography</p>
								</div>
								<div className="bg-[#335833] p-6 rounded-3xl text-center text-white shadow-xl">
									<HiCurrencyRupee className="text-4xl text-yellow-300 mx-auto mb-3" />
									<h4 className="font-bold">Earn Cash</h4>
									<p className="text-xs text-green-100">Monthly Prizes</p>
								</div>
							</div>
							<div className="space-y-4">
								<div className="bg-orange-50 p-6 rounded-3xl text-center border border-orange-100">
									<HiHeart className="text-4xl text-red-400 mx-auto mb-3" />
									<h4 className="font-bold text-gray-800">Community</h4>
									<p className="text-xs text-gray-500">Likes & Comments</p>
								</div>
								<div className="bg-white p-6 rounded-3xl text-center border border-gray-100 shadow-sm">
									<HiMicrophone className="text-4xl text-purple-400 mx-auto mb-3" />
									<h4 className="font-bold text-gray-800">Audio</h4>
									<p className="text-xs text-gray-500">Nature Sounds</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* --- Team & Credits --- */}
			<section className="py-20 px-4">
				<div className="container mx-auto max-w-4xl text-center">
					<h2 className="text-3xl font-bold text-gray-900 mb-8">
						Behind the Initiative
					</h2>
					<div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-gray-100 relative overflow-hidden">
						<div className="absolute top-0 right-0 w-40 h-40 bg-green-50 rounded-full blur-3xl -mr-20 -mt-20"></div>
						<p className="text-xl text-gray-600 italic mb-8 relative z-10">
							"We believe that conservation works best when the local community
							benefits directly from it. By gamifying nature observation, we are
							turning every resident into a guardian of the wild."
						</p>
						<div className="flex items-center justify-center gap-2 relative z-10">
							<span className="w-2 h-2 rounded-full bg-[#335833]"></span>
							<span className="text-sm font-bold text-gray-400 uppercase tracking-widest">
								Developed by Mud Media
							</span>
							<span className="w-2 h-2 rounded-full bg-[#335833]"></span>
						</div>
					</div>
				</div>
			</section>

			{/* --- CTA Section --- */}
			<section className="mb-50 py-20 bg-gradient-to-br from-[#335833] to-[#1A331A] text-white px-4">
				<div className="container mx-auto max-w-5xl text-center">
					<h2 className="text-3xl md:text-5xl font-bold mb-6">
						Ready to Start Your Journey?
					</h2>
					<p className="text-lg text-green-100 mb-10 max-w-2xl mx-auto">
						Join hundreds of locals and travelers in building the largest
						digital wildlife archive of the Anamalai Hills.
					</p>
					<div className="flex flex-col sm:flex-row justify-center gap-4">
						<Link
							to="/register"
							className="px-10 py-4 bg-white text-[#1A331A] font-bold rounded-full hover:shadow-2xl hover:scale-105 transition-all"
						>
							Create Account
						</Link>
						<Link
							to="/leaderboard"
							className="px-10 py-4 bg-[#4A7A4A] bg-opacity-30 border border-white/20 text-white font-bold rounded-full hover:bg-opacity-50 transition-all backdrop-blur-sm"
						>
							View Leaderboard
						</Link>
					</div>
				</div>
			</section>
		</div>
	);
};

export default About;
