import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import emailjs from "@emailjs/browser";
import {
	HiStar,
	HiExternalLink,
	HiHeart,
	HiGlobeAlt,
	HiChevronDown,
	HiChevronUp,
	HiCheckCircle,
	HiPaperAirplane,
	HiUserGroup,
	HiCamera,
	HiCurrencyRupee,
} from "react-icons/hi";
import { FaTree, FaHotel, FaCoffee, FaHandsHelping } from "react-icons/fa";

// --- Mock Data for Sponsors ---
const SPONSORS = [
	{
		tier: "Guardian",
		name: "Valparai Hill Resorts",
		description:
			"Supporting 5 local photographers and funding monthly conservation workshops.",
		logoIcon: FaHotel,
		color: "bg-gradient-to-br from-yellow-100 to-yellow-50 border-yellow-200",
		textColor: "text-yellow-800",
		badgeColor: "bg-yellow-400 text-yellow-900",
		link: "#",
	},
	{
		tier: "Hero",
		name: "Tea County Homestay",
		description:
			"Ensuring steady income for local guides through platform features.",
		logoIcon: FaTree,
		color: "bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200",
		textColor: "text-gray-800",
		badgeColor: "bg-gray-300 text-gray-800",
		link: "#",
	},
	{
		tier: "Hero",
		name: "The Green Cafe",
		description: "Sponsoring camera gear rentals for student reporters.",
		logoIcon: FaCoffee,
		color: "bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200",
		textColor: "text-orange-800",
		badgeColor: "bg-orange-300 text-orange-900",
		link: "#",
	},
];

// --- New Community-Focused Packages ---
const PACKAGES = [
	{
		title: "Community Supporter",
		price: "₹2,000",
		period: "per month",
		icon: HiUserGroup,
		description: "Help us keep the platform running and free for all locals.",
		impact: [
			"Covers server & hosting costs",
			"Supports 1 Student Reporter",
			"Community Badge on Profile",
		],
		color: "border-blue-200 bg-blue-50",
		iconColor: "text-blue-600",
	},
	{
		title: "Local Hero",
		price: "₹5,000",
		period: "per month",
		icon: HiCamera,
		description: "Directly fund the tools and prizes for our content creators.",
		impact: [
			"Funds monthly Cash Prizes (1st Place)",
			"Sponsors Camera Gear maintenance",
			"Featured 'Hero' Logo on Homepage",
		],
		color: "border-orange-200 bg-orange-50",
		iconColor: "text-orange-600",
	},
	{
		title: "Guardian of Valparai",
		price: "₹10,000",
		period: "per month",
		icon: FaHandsHelping,
		description: "Become a pillar of the Valparai wildlife ecosystem.",
		impact: [
			"Funds 5+ Local Reporters' Income",
			"Organizes Field Workshops for Guides",
			"Premium Brand Story & Interview",
			"Permanent 'Guardian' Status",
		],
		color: "border-yellow-200 bg-yellow-50",
		iconColor: "text-yellow-600",
	},
];

// --- FAQ Data ---
const FAQS = [
	{
		question: "Where does my sponsorship money go?",
		answer:
			"100% of the sponsorship funds go towards two things: The 'Creator Prize Pool' (paying locals who document wildlife) and 'Platform Operations' (server costs). We are a community-first initiative.",
	},
	{
		question: "How does this help local workers?",
		answer:
			"Many guides and plantation workers have incredible knowledge of wildlife but no platform. Your support gives them a digital stage and a secondary income stream through our monthly cash prizes.",
	},
	{
		question: "Can I sponsor specific equipment instead of cash?",
		answer:
			"Yes! We accept donations of camera bodies, lenses, and binoculars. These are added to our 'Community Gear Pool' for students to borrow. Select 'Gear Donation' in the form below.",
	},
	{
		question: "Do I get a tax receipt?",
		answer:
			"Yes, contributions towards our community development fund are eligible for 80G tax benefits. We will provide the necessary certificates upon payment.",
	},
];

// --- Animation Variants ---
const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: { staggerChildren: 0.15 },
	},
};

const itemVariants = {
	hidden: { opacity: 0, y: 30 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const FAQItem = ({ question, answer }) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className="border-b border-gray-100 last:border-0">
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="w-full py-5 flex items-center justify-between text-left focus:outline-none group"
			>
				<span
					className={`text-lg font-bold transition-colors ${
						isOpen
							? "text-[#335833]"
							: "text-gray-800 group-hover:text-[#335833]"
					}`}
				>
					{question}
				</span>
				<div
					className={`p-2 rounded-full transition-colors ${
						isOpen
							? "bg-green-50 text-[#335833]"
							: "bg-gray-50 text-gray-400 group-hover:bg-gray-100"
					}`}
				>
					{isOpen ? <HiChevronUp /> : <HiChevronDown />}
				</div>
			</button>
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						className="overflow-hidden"
					>
						<p className="pb-6 text-gray-600 leading-relaxed text-sm md:text-base">
							{answer}
						</p>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

const Sponsor = () => {
	const [formData, setFormData] = useState({
		name: "",
		organization: "",
		email: "",
		phone: "",
		planType: "Local Hero",
		message: "",
	});
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!formData.name || !formData.email || !formData.organization) {
			toast.error("Please fill in all required fields.");
			return;
		}

		setIsSubmitting(true);

		try {
			await emailjs.send(
				import.meta.env.VITE_SPONSOR_SERVICE_ID,
				import.meta.env.VITE_SPONSOR_TEMPLATE_ID,
				formData,
				import.meta.env.VITE_SPONSOR_PUBLIC_KEY
			);
			toast.success("Thank you for your support! We'll contact you shortly.");
			setFormData({
				name: "",
				organization: "",
				email: "",
				phone: "",
				planType: "Local Hero",
				message: "",
			});
		} catch (error) {
			console.error("Failed to send email:", error);
			toast.error("Failed to send message. Please try again later.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="min-h-screen bg-[#FAFAFA] font-sans">
			{/* --- Hero Section --- */}
			<section className="relative overflow-hidden bg-[#1A331A] py-20 px-4">
				{/* Decorative Background */}
				<div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
					<div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
				</div>

				<div className="container mx-auto max-w-5xl text-center relative z-10">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
					>
						<span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-green-100 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
							<HiHeart className="text-red-400" />
							Empower The Locals
						</span>
						<h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
							Be a Guardian of <br className="hidden md:block" />
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500">
								Valparai's Community
							</span>
						</h1>
						<p className="text-lg text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
							Support the guides, photographers, and students who document our
							wildlife. Your contribution creates jobs and preserves nature.
						</p>
					</motion.div>
				</div>
			</section>

			{/* --- Impact Packages Section --- */}
			<section className="py-20 px-4">
				<div className="container mx-auto max-w-6xl">
					<div className="text-center mb-16">
						<h2 className="text-3xl font-bold text-gray-900">
							How You Can Help
						</h2>
						<p className="text-gray-500 mt-2">
							Choose a tier that fits your ability to support our workforce.
						</p>
					</div>

					<motion.div
						variants={containerVariants}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true }}
						className="grid grid-cols-1 md:grid-cols-3 gap-8"
					>
						{PACKAGES.map((pkg, index) => (
							<motion.div
								key={index}
								variants={itemVariants}
								className={`p-8 rounded-[2rem] border ${pkg.color} relative hover:-translate-y-2 transition-transform duration-300`}
							>
								<div
									className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center bg-white shadow-sm ${pkg.iconColor}`}
								>
									<pkg.icon size={24} />
								</div>
								<h3 className="text-xl font-bold text-gray-900 mb-1">
									{pkg.title}
								</h3>
								<div className="flex items-baseline mb-4">
									<span className="text-2xl font-bold text-gray-900">
										{pkg.price}
									</span>
									<span className="text-xs text-gray-500 ml-1">
										/{pkg.period}
									</span>
								</div>
								<p className="text-sm text-gray-600 mb-6">{pkg.description}</p>
								<ul className="space-y-3">
									{pkg.impact.map((item, idx) => (
										<li
											key={idx}
											className="flex items-start gap-2 text-sm text-gray-700"
										>
											<HiCheckCircle className="text-green-500 shrink-0 mt-0.5" />
											{item}
										</li>
									))}
								</ul>
							</motion.div>
						))}
					</motion.div>
				</div>
			</section>

			{/* --- Current Guardians Grid --- */}
			<section className="py-16 px-4 md:px-6 bg-white border-y border-gray-100">
				<div className="container mx-auto max-w-6xl">
					<div className="text-center mb-12">
						<h2 className="text-3xl font-bold text-gray-900">
							Current Guardians
						</h2>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{SPONSORS.map((sponsor, index) => (
							<motion.div
								key={index}
								whileHover={{ scale: 1.02 }}
								className={`relative p-8 rounded-[2rem] border ${sponsor.color} shadow-sm group`}
							>
								{/* Badge */}
								<div className="absolute top-6 right-6">
									<span
										className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 ${sponsor.badgeColor}`}
									>
										<HiStar /> {sponsor.tier}
									</span>
								</div>

								{/* Icon/Logo Placeholder */}
								<div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 text-3xl text-gray-700">
									<sponsor.logoIcon />
								</div>

								<h3 className={`text-2xl font-bold mb-3 ${sponsor.textColor}`}>
									{sponsor.name}
								</h3>
								<p className="text-gray-600 mb-6 leading-relaxed text-sm">
									{sponsor.description}
								</p>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* --- FAQ Section --- */}
			<section className="py-16 px-4">
				<div className="container mx-auto max-w-3xl">
					<div className="text-center mb-12">
						<h2 className="text-3xl font-bold text-gray-900">
							Community Impact FAQs
						</h2>
						<p className="text-gray-500 mt-2">
							Transparency in how we use your funds.
						</p>
					</div>
					<div className="bg-white rounded-3xl border border-gray-100 shadow-sm px-6 md:px-10 py-4">
						{FAQS.map((faq, index) => (
							<FAQItem
								key={index}
								question={faq.question}
								answer={faq.answer}
							/>
						))}
					</div>
				</div>
			</section>

			{/* --- Support Inquiry Form --- */}
			<section className="py-20 px-4">
				<div className="container mx-auto max-w-6xl">
					<motion.div
						initial={{ opacity: 0, scale: 0.98 }}
						whileInView={{ opacity: 1, scale: 1 }}
						viewport={{ once: true }}
						className="bg-white rounded-[2.5rem] border border-gray-200 shadow-xl overflow-hidden"
					>
						<div className="grid grid-cols-1 lg:grid-cols-12">
							{/* Form Side */}
							<div className="lg:col-span-7 p-8 md:p-12 order-2 lg:order-1">
								<h2 className="text-3xl font-bold text-gray-900 mb-2">
									Pledge Your Support
								</h2>
								<p className="text-gray-600 mb-8">
									Join hands with us to secure the future of Valparai's wildlife
									and its people.
								</p>

								<form onSubmit={handleSubmit} className="space-y-6">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<div className="space-y-2">
											<label className="text-sm font-bold text-gray-700 uppercase tracking-wide">
												Your Name <span className="text-red-500">*</span>
											</label>
											<input
												type="text"
												name="name"
												value={formData.name}
												onChange={handleInputChange}
												placeholder="John Doe"
												className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#335833] focus:bg-white outline-none transition-all"
											/>
										</div>
										<div className="space-y-2">
											<label className="text-sm font-bold text-gray-700 uppercase tracking-wide">
												Organization / Business{" "}
												<span className="text-red-500">*</span>
											</label>
											<input
												type="text"
												name="organization"
												value={formData.organization}
												onChange={handleInputChange}
												placeholder="Valparai Resorts"
												className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#335833] focus:bg-white outline-none transition-all"
											/>
										</div>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<div className="space-y-2">
											<label className="text-sm font-bold text-gray-700 uppercase tracking-wide">
												Email Address <span className="text-red-500">*</span>
											</label>
											<input
												type="email"
												name="email"
												value={formData.email}
												onChange={handleInputChange}
												placeholder="contact@email.com"
												className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#335833] focus:bg-white outline-none transition-all"
											/>
										</div>
										<div className="space-y-2">
											<label className="text-sm font-bold text-gray-700 uppercase tracking-wide">
												Phone Number
											</label>
											<input
												type="tel"
												name="phone"
												value={formData.phone}
												onChange={handleInputChange}
												placeholder="+91 98765 43210"
												className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#335833] focus:bg-white outline-none transition-all"
											/>
										</div>
									</div>

									<div className="space-y-2">
										<label className="text-sm font-bold text-gray-700 uppercase tracking-wide">
											Support Plan
										</label>
										<select
											name="planType"
											value={formData.planType}
											onChange={handleInputChange}
											className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#335833] focus:bg-white outline-none transition-all appearance-none cursor-pointer"
										>
											<option value="Community Supporter">
												Community Supporter (₹2,000)
											</option>
											<option value="Local Hero">Local Hero (₹5,000)</option>
											<option value="Guardian">Guardian (₹10,000)</option>
											<option value="Gear Donation">Gear Donation</option>
											<option value="Other">Other / Custom</option>
										</select>
									</div>

									<div className="space-y-2">
										<label className="text-sm font-bold text-gray-700 uppercase tracking-wide">
											Message (Optional)
										</label>
										<textarea
											name="message"
											rows="3"
											value={formData.message}
											onChange={handleInputChange}
											placeholder="Any specific requests or questions?"
											className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#335833] focus:bg-white outline-none transition-all resize-none"
										></textarea>
									</div>

									<button
										type="submit"
										disabled={isSubmitting}
										className="w-full py-4 bg-[#335833] text-white font-bold rounded-xl shadow-lg hover:bg-[#2a4a2a] hover:shadow-xl transition-all disabled:opacity-70 flex items-center justify-center gap-2"
									>
										{isSubmitting ? (
											"Sending..."
										) : (
											<>
												Submit Pledge <HiPaperAirplane className="rotate-90" />
											</>
										)}
									</button>
								</form>
							</div>

							{/* Info/Visual Side */}
							<div className="lg:col-span-5 bg-green-50 relative overflow-hidden flex flex-col justify-center p-8 md:p-12 order-1 lg:order-2">
								<div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
								<div className="relative z-10">
									<h3 className="text-2xl font-bold text-[#1A331A] mb-6">
										The Impact Cycle
									</h3>
									<ul className="space-y-6">
										<li className="flex items-start gap-3">
											<div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 text-[#335833]">
												<HiCurrencyRupee size={20} />
											</div>
											<div>
												<h4 className="font-bold text-gray-900">You Pledge</h4>
												<p className="text-sm text-gray-600">
													Funds are allocated to the monthly prize pool.
												</p>
											</div>
										</li>
										<li className="flex items-start gap-3">
											<div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 text-[#335833]">
												<HiCamera size={20} />
											</div>
											<div>
												<h4 className="font-bold text-gray-900">
													Locals Create
												</h4>
												<p className="text-sm text-gray-600">
													Guides & students capture wildlife moments.
												</p>
											</div>
										</li>
										<li className="flex items-start gap-3">
											<div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 text-[#335833]">
												<FaHandsHelping size={20} />
											</div>
											<div>
												<h4 className="font-bold text-gray-900">
													Community Wins
												</h4>
												<p className="text-sm text-gray-600">
													Best creators get paid; Wildlife gets protection.
												</p>
											</div>
										</li>
									</ul>
								</div>
							</div>
						</div>
					</motion.div>
				</div>
			</section>
		</div>
	);
};

export default Sponsor;
