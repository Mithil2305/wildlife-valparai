import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
	HiTrendingUp,
	HiUserGroup,
	HiLocationMarker,
	HiCheckCircle,
} from "react-icons/hi";

// --- Stats Component ---
const StatBox = ({ label, value, icon: Icon }) => (
	<div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
		<div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3 text-[#335833]">
			<Icon size={24} />
		</div>
		<h4 className="text-3xl font-extrabold text-gray-900 mb-1">{value}</h4>
		<p className="text-gray-500 text-sm font-medium uppercase tracking-wide">
			{label}
		</p>
	</div>
);

// --- Pricing Card Component ---
const PricingCard = ({
	title,
	price,
	features,
	isPopular,
	color,
	btnColor,
}) => (
	<motion.div
		whileHover={{ y: -8 }}
		className={`relative p-8 bg-white rounded-[2rem] border ${
			isPopular ? "border-[#335833] shadow-xl" : "border-gray-200 shadow-md"
		} flex flex-col h-full`}
	>
		{isPopular && (
			<div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#335833] text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
				Most Popular
			</div>
		)}
		<h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
		<div className="flex items-baseline mb-6">
			<span className="text-4xl font-extrabold text-gray-900">₹{price}</span>
			<span className="text-gray-500 ml-2">/ month</span>
		</div>
		<p className="text-gray-600 text-sm mb-8 leading-relaxed">
			Perfect for resorts and homestays looking to attract weekend tourists.
		</p>
		<ul className="space-y-4 mb-8 flex-1">
			{features.map((feature, idx) => (
				<li key={idx} className="flex items-start gap-3 text-gray-700 text-sm">
					<HiCheckCircle className="text-green-500 text-lg shrink-0 mt-0.5" />
					<span>{feature}</span>
				</li>
			))}
		</ul>
		<Link
			to="/contact"
			className={`w-full py-3 rounded-xl font-bold text-center transition-all ${btnColor}`}
		>
			Get Started
		</Link>
	</motion.div>
);

const Advertise = () => {
	return (
		<div className="min-h-screen bg-[#F3F4F6] font-sans">
			{/* --- Header Section --- */}
			<section className="bg-white pt-20 pb-16 px-4 rounded-b-[3rem] shadow-sm border-b border-gray-100">
				<div className="container mx-auto max-w-6xl text-center">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
					>
						<h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight leading-tight">
							Grow Your Business, <br />
							<span className="text-[#335833]">Support Nature.</span>
						</h1>
						<p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
							Reach thousands of tourists actively looking for authentic
							experiences in Valparai. Place your brand right where the eyes
							are.
						</p>

						{/* Stats Grid */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
							<StatBox
								icon={HiUserGroup}
								value="5,000+"
								label="Monthly Visitors"
							/>
							<StatBox
								icon={HiLocationMarker}
								value="100%"
								label="Hyper-Local Reach"
							/>
							<StatBox
								icon={HiTrendingUp}
								value="3.5m"
								label="Avg. Session Time"
							/>
						</div>
					</motion.div>
				</div>
			</section>

			{/* --- Why Advertise? --- */}
			<section className="py-20 px-4">
				<div className="container mx-auto max-w-6xl">
					<div className="text-center mb-16">
						<h2 className="text-3xl font-bold text-gray-900">
							Why Partner with Us?
						</h2>
						<p className="text-gray-500 mt-2">
							We offer more than just banner ads; we offer engagement.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<div className="p-8 bg-white rounded-3xl shadow-sm border border-gray-100">
							<h3 className="text-xl font-bold text-gray-900 mb-3">
								High Intent Audience
							</h3>
							<p className="text-gray-600 leading-relaxed">
								Our users are already in Valparai or planning a trip. They are
								actively looking for places to stay, eat, and visit.
							</p>
						</div>
						<div className="p-8 bg-white rounded-3xl shadow-sm border border-gray-100">
							<h3 className="text-xl font-bold text-gray-900 mb-3">
								Ethical Marketing
							</h3>
							<p className="text-gray-600 leading-relaxed">
								Your ad revenue directly supports local creators and wildlife
								conservation efforts. Build a brand that cares.
							</p>
						</div>
						<div className="p-8 bg-white rounded-3xl shadow-sm border border-gray-100">
							<h3 className="text-xl font-bold text-gray-900 mb-3">
								Native Integration
							</h3>
							<p className="text-gray-600 leading-relaxed">
								We don't do annoying popups. Your ads appear naturally in the
								feed and sidebar, looking just like content.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* --- Pricing Plans --- */}
			<section className="py-16 px-4 bg-gray-900 rounded-[3rem] mx-2 md:mx-6 text-white mb-12">
				<div className="container mx-auto max-w-6xl">
					<div className="text-center mb-16">
						<h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
							Simple, Transparent Pricing
						</h2>
						<p className="text-gray-400">
							Choose a plan that fits your business size. No hidden fees.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
						<PricingCard
							title="Starter"
							price="999"
							features={[
								"Sidebar Ad Placement",
								"Rotating visibility",
								"Monthly Performance Report",
								"Support Local Creators",
							]}
							isPopular={false}
							btnColor="bg-gray-100 text-gray-900 hover:bg-gray-200"
						/>
						<PricingCard
							title="Growth"
							price="2,499"
							features={[
								"In-Feed Native Ads (High CTR)",
								"Sidebar Ad Placement",
								"Priority Rotation",
								"Featured on Sponsor Page",
								"Direct Link to WhatsApp",
							]}
							isPopular={true}
							btnColor="bg-[#335833] text-white hover:bg-[#2a4a2a] shadow-lg shadow-green-900/30"
						/>
						<PricingCard
							title="Enterprise"
							price="4,999"
							features={[
								"Top Banner Exclusive",
								"In-Feed & Sidebar Ads",
								"Dedicated Blog Feature",
								"Social Media Shoutout",
								"QR Code Integration",
							]}
							isPopular={false}
							btnColor="bg-gray-100 text-gray-900 hover:bg-gray-200"
						/>
					</div>
				</div>
			</section>

			{/* --- Final CTA --- */}
			<section className="pb-20 px-4 text-center">
				<div className="bg-white p-12 rounded-[2.5rem] shadow-xl border border-gray-100 max-w-4xl mx-auto">
					<h2 className="text-3xl font-bold text-gray-900 mb-4">
						Ready to boost your bookings?
					</h2>
					<p className="text-gray-600 mb-8 max-w-lg mx-auto">
						Join the platform that is redefining tourism in the Anamalai Hills.
						Limited slots available for this month.
					</p>
					<Link
						to="/contact"
						className="inline-block px-10 py-4 bg-[#335833] text-white font-bold rounded-xl hover:bg-[#2a4a2a] transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
					>
						Contact Sales Team
					</Link>
				</div>
			</section>
		</div>
	);
};

export default Advertise;
