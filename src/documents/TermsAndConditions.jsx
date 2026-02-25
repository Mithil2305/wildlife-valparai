import React from "react";
import {
	FileCheck,
	UserCheck,
	Scale,
	Ban,
	Trophy,
	AlertCircle,
	ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";

const Section = ({ icon: Icon, title, children }) => (
	<section className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
		<div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-4">
			<div className="p-2 bg-green-50 rounded-lg text-[#335833]">
				<Icon size={24} />
			</div>
			<h2 className="text-xl font-bold text-gray-900">{title}</h2>
		</div>
		<div className="text-gray-600 space-y-3 leading-relaxed text-sm md:text-base">
			{children}
		</div>
	</section>
);

const TermsAndConditions = () => {
	const lastUpdated = new Date().toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	return (
		<div className="min-h-screen bg-[#FAFAFA] font-sans text-gray-800">
			{/* --- Header --- */}
			<div className="bg-[#1A331A] text-white py-12 px-4 md:px-8 relative overflow-hidden">
				{/* Decorative elements matching About page */}
				<div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

				<div className="max-w-4xl mx-auto relative z-10">
					<Link
						to="/"
						className="inline-flex items-center text-green-200 hover:text-white mb-6 transition-colors text-sm font-semibold"
					>
						<ArrowLeft size={16} className="mr-2" />
						Back to Home
					</Link>
					<h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">
						Terms & Conditions
					</h1>
					<p className="text-green-100/90 text-lg max-w-2xl">
						The rules of the wild. Please read these terms carefully before
						joining our community.
					</p>
					<p className="mt-6 text-xs font-mono uppercase tracking-widest text-green-400">
						Last Updated: {lastUpdated}
					</p>
				</div>
			</div>

			{/* --- Main Content --- */}
			<main className="max-w-4xl mx-auto px-4 py-12 space-y-8 -mt-8 relative z-20">
				{/* Introduction */}
				<div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
					<p className="text-gray-600 leading-relaxed">
						Welcome to <strong>Wildlife Valparai</strong>. By accessing our
						website, registering as a Creator or Viewer, or uploading content,
						you agree to be bound by these Terms and Conditions. If you disagree
						with any part of these terms, you may not use our services.
					</p>
				</div>

				<Section icon={UserCheck} title="1. User Accounts & Roles">
					<p>
						<strong>Registration:</strong> You must provide accurate and
						complete information when creating [cite_start]an account[cite: 14].
						You are responsible for maintaining the confidentiality of your
						account credentials.
					</p>
					<p>
						<strong>Roles:</strong>
					</p>
					<ul className="list-disc pl-5 space-y-1">
						[cite_start]
						<li>
							<strong>Viewers:</strong> May browse content and interact
							(like/comment) to earn points[cite: 62].
						</li>
						<li>
							<strong>Creators:</strong> May upload photos, audio, and blogs.
							Creators retain ownership of their content [cite_start]but grant
							Wildlife Valparai a license to display it[cite: 3].
						</li>
					</ul>
				</Section>

				<Section icon={FileCheck} title="2. Content Guidelines">
					<p>
						We adhere to a zero-tolerance policy for content that violates
						ecological ethics or local laws.
					</p>
					<p>
						<strong>Prohibited Content:</strong>
					</p>
					<ul className="list-disc pl-5 space-y-1">
						[cite_start]
						<li>
							Media depicting the harassment, provoking, or baiting of
							wildlife[cite: 194].
						</li>
						<li>
							Content revealing the precise nesting locations of endangered
							species.
						</li>
						<li>Hate speech, misinformation, or sexually explicit material.</li>
					</ul>
					<p className="text-xs bg-red-50 text-red-600 p-2 rounded mt-2 border border-red-100">
						Violation of these guidelines will result in immediate account
						termination and content removal.
					</p>
				</Section>

				<Section icon={Trophy} title="3. Points, Rewards & Gamification">
					<p>
						<strong>Earning Points:</strong> Points are awarded for valid
						interactions (e.g., uploading posts, [cite_start]receiving
						likes)[cite: 10]. We reserve the right to audit point history at any
						time.
					</p>
					<p>
						<strong>Points Reversal:</strong> To ensure fair play, deleting a
						post or unliking content will [cite_start]automatically deduct the
						associated points from your account[cite: 51, 204].
					</p>
					<p>
						<strong>Cash Prizes:</strong> Eligibility for cash prizes (up to
						₹10,000) is determined by the [cite_start]Leaderboard rank at the
						end of the cycle[cite: 11]. We reserve the right to disqualify users
						suspected of manipulating the system (e.g., using bots or
						"like-farming").
					</p>
				</Section>

				<Section icon={Scale} title="4. Intellectual Property">
					<p>
						<strong>Your Content:</strong> You retain full copyright of the
						media you upload. By posting, you grant us a non-exclusive,
						royalty-free license to display your content on the platform and
						associated social media channels for promotional purposes.
					</p>
					<p>
						<strong>Platform Assets:</strong> The Wildlife Valparai logo, code,
						and design are the property [cite_start]of Mud Media and protected
						by copyright laws[cite: 203].
					</p>
				</Section>

				<Section icon={AlertCircle} title="5. Limitation of Liability">
					<p>
						<strong>Physical Safety:</strong> Wildlife Valparai is a digital
						platform. We are not liable for [cite_start]any physical injury,
						accident, or damage incurred while you are capturing content in the
						field[cite: 194]. You acknowledge that wildlife photography involves
						inherent risks.
					</p>
					<p>
						<strong>Service Availability:</strong> We do not guarantee
						uninterrupted access to the platform. Services may be suspended for
						maintenance or updates without prior notice.
					</p>
				</Section>

				<Section icon={Ban} title="6. Termination">
					<p>
						We reserve the right to terminate or suspend your account
						immediately, without prior notice or liability, for any reason
						whatsoever, including without limitation if you breach the Terms.
					</p>
				</Section>

				{/* Footer */}
				<div className="text-center pt-8 border-t border-gray-200">
					<p className="text-gray-500 text-sm mb-4">
						These terms are governed by the laws of India. Any disputes shall be
						subject to the exclusive jurisdiction of the courts in Tamil Nadu.
					</p>
					<div className="flex justify-center gap-4 text-[#335833] font-semibold text-sm">
						<Link to="/privacy-policy" className="hover:underline">
							Privacy Policy
						</Link>
						<span>•</span>
						<Link to="/disclaimer" className="hover:underline">
							Disclaimer
						</Link>
						<span>•</span>
						<Link to="/contact" className="hover:underline">
							Contact Support
						</Link>
					</div>
				</div>
			</main>
		</div>
	);
};

export default TermsAndConditions;
