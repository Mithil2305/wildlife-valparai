import React from "react";
import {
	AlertTriangle,
	ShieldAlert,
	Camera,
	Banknote,
	MapPin,
	ExternalLink,
	ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";

// Reusable Card Component matching T&C style
const DisclaimerCard = ({
	icon: Icon,
	title,
	children,
	variant = "default",
}) => {
	const isWarning = variant === "warning";

	return (
		<section
			className={`p-6 md:p-8 rounded-2xl border shadow-sm transition-shadow duration-300 ${
				isWarning
					? "bg-red-50 border-red-100"
					: "bg-white border-gray-100 hover:shadow-md"
			}`}
		>
			<div className="flex items-start gap-4">
				<div
					className={`p-3 rounded-xl shrink-0 ${
						isWarning ? "bg-red-100 text-red-700" : "bg-green-50 text-[#335833]"
					}`}
				>
					<Icon size={24} />
				</div>
				<div>
					<h2
						className={`text-xl font-bold mb-3 ${
							isWarning ? "text-red-900" : "text-gray-900"
						}`}
					>
						{title}
					</h2>
					<div
						className={`space-y-3 leading-relaxed text-sm md:text-base ${
							isWarning ? "text-red-800/80" : "text-gray-600"
						}`}
					>
						{children}
					</div>
				</div>
			</div>
		</section>
	);
};

const Disclaimer = () => {
	const lastUpdated = new Date().toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	return (
		<div className="min-h-screen bg-[#FAFAFA] font-sans text-gray-800">
			{/* --- Header (Consistent with T&C) --- */}
			<div className="bg-[#1A331A] text-white py-12 px-4 md:px-8 relative overflow-hidden">
				{/* Decorative elements */}
				<div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
				<div className="absolute bottom-0 left-0 w-48 h-48 bg-[#4A7A4A] opacity-10 rounded-full blur-3xl -ml-12 -mb-12 pointer-events-none"></div>

				<div className="max-w-4xl mx-auto relative z-10">
					<Link
						to="/"
						className="inline-flex items-center text-green-200 hover:text-white mb-6 transition-colors text-sm font-semibold"
					>
						<ArrowLeft size={16} className="mr-2" />
						Back to Home
					</Link>
					<div className="flex items-center gap-3 mb-4">
						<div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
							<ShieldAlert size={32} className="text-green-300" />
						</div>
						<h1 className="text-3xl md:text-5xl font-black tracking-tight">
							Disclaimer
						</h1>
					</div>
					<p className="text-green-100/90 text-lg max-w-2xl">
						Important information regarding safety, liability, and content on
						the Wildlife Valparai platform.
					</p>
					<p className="mt-6 text-xs font-mono uppercase tracking-widest text-green-400">
						Last Updated: {lastUpdated}
					</p>
				</div>
			</div>

			{/* --- Main Content --- */}
			<main className="max-w-4xl mx-auto px-4 py-12 space-y-6 -mt-12 relative z-20 mt-1">
				{/* 1. Critical Safety Warning */}
				<DisclaimerCard
					icon={AlertTriangle}
					title="Critical: Wildlife Safety & Physical Risk"
					variant="warning"
				>
					<p className="font-semibold">
						Your physical safety is your sole responsibility.
					</p>
					<p>
						Valparai is an active wildlife zone with significant populations of
						elephants, leopards, and other large mammals. Wildlife Valparai is a
						digital platform for sharing content; we generally{" "}
						<strong>do not advise</strong> approaching wild animals to capture
						photos or audio.
					</p>
					<p>
						We are not liable for any injury, loss of life, or accident that
						occurs while you are using the app in the field. Always prioritize
						safety over earning points.
					</p>
				</DisclaimerCard>

				{/* 2. Content Accuracy */}
				<DisclaimerCard icon={Camera} title="User-Generated Content Accuracy">
					<p>
						The media (photos, audio) and articles on this platform are uploaded
						by independent Creators (locals, students, guides)[cite: 188]. While
						we strive for quality, we do not guarantee the scientific accuracy
						of species identification, animal behaviors, or descriptions
						provided in user posts[cite: 63].
					</p>
					<p>
						Information provided in "Wildlife Moments" or Blogs should be used
						for recreational purposes only, not as a definitive scientific
						guide.
					</p>
				</DisclaimerCard>

				{/* 3. Financial Rewards */}
				<DisclaimerCard icon={Banknote} title="Points & Cash Prizes">
					<p>
						Participation in the Leaderboard and eligibility for cash prizes is
						subject to strict verification[cite: 11, 59].
					</p>
					<ul className="list-disc pl-5 space-y-1 mt-2">
						<li>
							<strong>No Guarantee:</strong> Earning points does not guarantee a
							cash reward. Payouts are processed manually by Administrators and
							depend on fund availability.
						</li>
						<li>
							<strong>Disqualification:</strong> We reserve the right to
							withhold prizes if we detect manipulation of engagement metrics
							(e.g., fake likes/comments) or violation of our fair play
							policies[cite: 51].
						</li>
					</ul>
				</DisclaimerCard>

				{/* 4. Location Data */}
				<DisclaimerCard icon={MapPin} title="Location Data & GPS">
					<p>
						Posts may contain location tags. We caution users against using this
						data to track animals or intrude on private estates. Wildlife
						Valparai is not responsible for trespassing violations. Please
						respect private property boundaries within tea estates and forest
						zones.
					</p>
				</DisclaimerCard>

				{/* 5. Sponsors & Third Parties */}
				<DisclaimerCard icon={ExternalLink} title="Sponsors & Advertisements">
					<p>
						The platform displays advertisements from "Sponsors" (such as local
						resorts or homestays)[cite: 118, 149]. These are paid placements.
						The presence of a sponsor on our platform does not constitute an
						endorsement of their safety standards, service quality, or business
						practices. Any transaction between you and a Sponsor is strictly
						between the two parties[cite: 195].
					</p>
				</DisclaimerCard>

				{/* Footer */}
				<div className="text-center pt-8 border-t border-gray-200 mt-8">
					<p className="text-gray-500 text-sm mb-4">
						By continuing to use Wildlife Valparai, you acknowledge that you
						have read and understood this disclaimer.
					</p>
					<div className="flex justify-center gap-4 text-[#335833] font-semibold text-sm">
						<Link to="/terms" className="hover:underline">
							Terms of Service
						</Link>
						<span>•</span>
						<Link to="/privacy-policy" className="hover:underline">
							Privacy Policy
						</Link>
					</div>
				</div>
			</main>
		</div>
	);
};

export default Disclaimer;
