import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
	Sparkles,
	Users,
	Camera,
	IndianRupee,
	ShieldCheck,
	Globe,
	Heart,
	Mic,
	MessageCircle,
	Share2,
	PenLine,
	HelpCircle,
	ChevronDown,
} from "lucide-react";

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
			<Icon className="text-white" size={32} />
		</div>
		<h3 className="text-2xl font-extrabold text-gray-900 mb-3 relative z-10 group-hover:translate-x-1 transition-transform">
			{title}
		</h3>
		<p className="text-gray-600 leading-relaxed text-base relative z-10 group-hover:text-gray-800 transition-colors">
			{description}
		</p>
	</motion.div>
);

const PointsRow = ({ action, points, icon: Icon, color }) => (
	<div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
		<div className="flex items-center gap-4">
			{/* White icon with solid background */}
			<div className={`p-2 rounded-lg ${color} text-white shadow-sm`}>
				<Icon size={20} />
			</div>
			<span className="font-semibold text-gray-700">{action}</span>
		</div>
		<span className="font-bold text-[#335833] bg-green-50 px-3 py-1 rounded-full border border-green-100">
			{points} pts
		</span>
	</div>
);

const FAQItem = ({ question, answer }) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<motion.div
			variants={itemVariants}
			className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
		>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="w-full flex items-center justify-between p-6 text-left focus:outline-none group"
			>
				<div className="flex items-center gap-4">
					<div className="bg-[#335833] p-2 rounded-lg flex-shrink-0 group-hover:bg-[#2a472a] transition-colors">
						<HelpCircle className="text-white" size={20} />
					</div>
					<h3 className="text-lg font-bold text-gray-900 group-hover:text-[#335833] transition-colors">
						{question}
					</h3>
				</div>
				<motion.div
					animate={{ rotate: isOpen ? 180 : 0 }}
					transition={{ duration: 0.3 }}
					className="text-gray-400"
				>
					<ChevronDown size={24} />
				</motion.div>
			</button>
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.3, ease: "easeInOut" }}
					>
						<div className="px-6 pb-6 pl-[4.5rem]">
							<p className="text-gray-600 leading-relaxed text-sm border-l-2 border-green-100 pl-4">
								{answer}
							</p>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	);
};

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
							icon={Globe}
							title="Digital Conservation"
							description="Building a real-time archive of Valparai’s biodiversity through crowd-sourced photography and audio recordings."
							colorClass="bg-blue-500 text-blue-500"
							gradient="from-blue-500 to-cyan-400"
						/>
						<FeatureCard
							icon={IndianRupee}
							title="Creator Economy"
							description="Empowering locals, guides, and students to earn passive income by sharing their daily encounters with nature."
							colorClass="bg-green-600 text-green-600"
							gradient="from-green-500 to-emerald-400"
						/>
						<FeatureCard
							icon={ShieldCheck}
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
											<Sparkles size={20} />
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
											<Users size={20} />
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
									<div className="flex justify-center mb-3">
										<Camera className="text-blue-400" size={32} />
									</div>
									<h4 className="font-bold text-gray-800">Visuals</h4>
									<p className="text-xs text-gray-500">Share Photography</p>
								</div>
								<div className="bg-[#335833] p-6 rounded-3xl text-center text-white shadow-xl">
									<div className="flex justify-center mb-3">
										<IndianRupee className="text-yellow-300" size={32} />
									</div>
									<h4 className="font-bold">Earn Cash</h4>
									<p className="text-xs text-green-100">Monthly Prizes</p>
								</div>
							</div>
							<div className="space-y-4">
								<div className="bg-orange-50 p-6 rounded-3xl text-center border border-orange-100">
									<div className="flex justify-center mb-3">
										<Heart className="text-red-400" size={32} />
									</div>
									<h4 className="font-bold text-gray-800">Community</h4>
									<p className="text-xs text-gray-500">Likes & Comments</p>
								</div>
								<div className="bg-white p-6 rounded-3xl text-center border border-gray-100 shadow-sm">
									<div className="flex justify-center mb-3">
										<Mic className="text-purple-400" size={32} />
									</div>
									<h4 className="font-bold text-gray-800">Audio</h4>
									<p className="text-xs text-gray-500">Nature Sounds</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* --- Points Ecosystem Section --- */}
			<section className="py-16 bg-white">
				<div className="container mx-auto max-w-6xl px-4">
					<div className="text-center mb-12">
						<h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
							The <span className="text-[#335833]">Points Ecosystem</span>
						</h2>
						<p className="text-gray-600 max-w-2xl mx-auto">
							Every interaction helps you climb the leaderboard. We believe in
							fair play, so actions like deleting content will reverse the
							points earned.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						{/* Creator Column */}
						<div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100">
							<h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
								<span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
									<Camera size={16} />
								</span>
								Earn as a Creator
							</h3>
							<div className="space-y-3">
								<PointsRow
									action="Publish a Blog"
									points="+150"
									icon={PenLine}
									color="bg-purple-500"
								/>
								<PointsRow
									action="Upload Photo + Audio"
									points="+100"
									icon={Camera}
									color="bg-blue-500"
								/>
								<PointsRow
									action="Receive a Like"
									points="+10"
									icon={Heart}
									color="bg-red-500"
								/>
								<PointsRow
									action="Receive a Comment"
									points="+10"
									icon={MessageCircle}
									color="bg-orange-500"
								/>
								<PointsRow
									action="Post gets Shared"
									points="+10"
									icon={Share2}
									color="bg-indigo-500"
								/>
							</div>
						</div>

						{/* Viewer Column */}
						<div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100">
							<h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
								<span className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
									<Users size={16} />
								</span>
								Earn as a Viewer
							</h3>
							<div className="space-y-3">
								<PointsRow
									action="Like a Post"
									points="+10"
									icon={Heart}
									color="bg-red-500"
								/>
								<PointsRow
									action="Comment on a Post"
									points="+10"
									icon={MessageCircle}
									color="bg-orange-500"
								/>
							</div>
							<div className="mt-8 p-4 bg-red-50 rounded-xl border border-red-100">
								<p className="text-sm text-red-600 font-semibold mb-1">
									Warning: Points Reversal
								</p>
								<p className="text-sm text-red-500 leading-relaxed">
									Deleting a post removes all points earned from it (including
									engagement points). Unliking or deleting a comment also
									deducts the points originally awarded.
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* --- FAQ Section --- */}
			<section className="py-16 bg-[#FAFAFA] border-t border-gray-100">
				<div className="container mx-auto max-w-4xl px-4">
					<h2 className="text-3xl font-bold text-center text-gray-900 mb-10">
						Frequently Asked Questions
					</h2>
					<motion.div
						variants={containerVariants}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true }}
						className="space-y-4 text-sm"
					>
						<FAQItem
							question="How does the points calculation work?"
							answer="Points are calculated instantly based on your contributions. Creating high-effort content like blogs earns the most (150 pts), while sharing nature moments via photos and audio earns 100 pts. Community engagement is a two-way street; both the person giving a like/comment and the creator receiving it earn 10 pts each."
						/>
						<FAQItem
							question="Can I lose points once I've earned them?"
							answer="Yes. To ensure the leaderboard reflects genuine contributions, our system automatically reverses points if actions are undone. If you delete a post, you lose the creation points plus any points earned from likes/comments on that post. Similarly, unliking a post or deleting your comment will deduct the points you originally gained."
						/>
						<FAQItem
							question="What can I do with my points?"
							answer="Points determine your standing on the Wildlife Valparai Leaderboard. This isn't just for show—top-ranking creators and contributors are eligible for monthly cash prizes and special recognition within our conservation community."
						/>
					</motion.div>
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
