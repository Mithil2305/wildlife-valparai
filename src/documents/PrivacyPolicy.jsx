import React from "react";
import {
	Shield,
	Lock,
	Eye,
	FileText,
	Server,
	CreditCard,
	ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
	const lastUpdated = new Date().toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	return (
		<div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans text-gray-800">
			<div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden">
				{/* Header Section */}
				<div className="bg-[#1A331A] px-8 py-10 text-white relative overflow-hidden">
					<div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
						<Shield size={200} />
					</div>
					<Link
						to="/"
						className="inline-flex items-center text-green-200 hover:text-white mb-6 transition-colors"
					>
						<ArrowLeft size={20} className="mr-2" />
						Back to Home
					</Link>
					<h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
					<p className="text-green-100 opacity-90">
						Transparency is at the core of our community. Here is how we handle
						your data.
					</p>
					<p className="mt-4 text-xs uppercase tracking-widest opacity-70">
						Last Updated: {lastUpdated}
					</p>
				</div>

				{/* Content Body */}
				<div className="p-8 md:p-12 space-y-10">
					{/* 1. Introduction */}
					<section>
						<h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
							<FileText className="mr-3 text-[#335833]" />
							1. Introduction
						</h2>
						<p className="leading-relaxed text-gray-600 mb-4">
							Welcome to <strong>Wildlife Valparai</strong> ("we," "our," or
							"us"). We are committed to protecting your privacy while you
							explore, create, and contribute to our digital wildlife community.
							This Privacy Policy explains how we collect, use, disclosure, and
							safeguard your information when you use our web application.
						</p>
						<p className="leading-relaxed text-gray-600">
							By accessing or using our platform, you signify that you have
							read, understood, and agree to our collection, storage, use, and
							disclosure of your personal information as described in this
							Privacy Policy.
						</p>
					</section>

					{/* 2. Information We Collect */}
					<section>
						<h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
							<Eye className="mr-3 text-[#335833]" />
							2. Information We Collect
						</h2>
						<ul className="space-y-4 text-gray-600 list-disc pl-5">
							<li>
								<strong>Account Information:</strong> When you register[cite:
								14], we collect your username, email address, and authentication
								credentials via Google Sign-In or email[cite: 169]. We also
								store your chosen role (Creator or Viewer) [cite: 16-17].
							</li>
							<li>
								<strong>Profile Data:</strong> We collect personal details you
								provide, such as your bio, profile photograph, and phone
								number[cite: 105].
							</li>
							<li>
								<strong>User Content (Media):</strong> If you are a Creator, we
								collect the photos, audio recordings (e.g., bird calls), and
								blog posts you upload [cite: 23-28].
							</li>
							<li>
								<strong>Usage & Gamification Data:</strong> We track your
								interactions, including posts liked, comments made, and points
								earned. This data is used to calculate your "Engagement Score"
								and Leaderboard ranking[cite: 10, 45].
							</li>
							<li>
								<strong>Local Drafts:</strong> Unfinished blog posts may be
								stored locally on your device (localStorage) to prevent data
								loss before publication.
							</li>
						</ul>
					</section>

					{/* 3. How We Use Your Information */}
					<section>
						<h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
							<Server className="mr-3 text-[#335833]" />
							3. How We Use Your Information
						</h2>
						<div className="grid md:grid-cols-2 gap-6">
							<div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
								<h3 className="font-semibold text-gray-800 mb-2">
									Service Delivery
								</h3>
								<p className="text-sm text-gray-600">
									To host your wildlife photography and audio experiences,
									verify your identity, and display content on the public
									feed[cite: 64].
								</p>
							</div>
							<div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
								<h3 className="font-semibold text-gray-800 mb-2">
									Leaderboards & Rewards
								</h3>
								<p className="text-sm text-gray-600">
									To calculate points for the "Creator Economy" model and
									determine eligibility for cash prizes based on your engagement
									[cite: 57-58].
								</p>
							</div>
							<div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
								<h3 className="font-semibold text-gray-800 mb-2">
									Payout Processing
								</h3>
								<p className="text-sm text-gray-600">
									If you win a prize, we use your ID and payment details to
									process transactions and maintain a ledger of payouts [cite:
									140-141].
								</p>
							</div>
							<div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
								<h3 className="font-semibold text-gray-800 mb-2">
									Communication
								</h3>
								<p className="text-sm text-gray-600">
									To send you updates regarding your account security, policy
									changes, or community announcements.
								</p>
							</div>
						</div>
					</section>

					{/* 4. Third-Party Services & Storage */}
					<section>
						<h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
							<Lock className="mr-3 text-[#335833]" />
							4. Third-Party Services & Storage
						</h2>
						<p className="mb-4 text-gray-600">
							We utilize trusted third-party vendors to operate our platform
							securely. We do not sell your personal data to advertisers.
						</p>
						<ul className="space-y-3 text-gray-600">
							<li className="flex items-start">
								<span className="font-bold min-w-[140px] text-gray-800">
									Google Firebase:
								</span>
								<span>
									Used for secure user authentication and database storage[cite:
									169].
								</span>
							</li>
							<li className="flex items-start">
								<span className="font-bold min-w-[140px] text-gray-800">
									Cloudflare R2:
								</span>
								<span>
									Used for securely storing your uploaded media files (photos
									and audio).
								</span>
							</li>
							<li className="flex items-start">
								<span className="font-bold min-w-[140px] text-gray-800">
									Vercel:
								</span>
								<span>
									Used to host our frontend and process secure serverless API
									requests [cite: 167-168].
								</span>
							</li>
						</ul>
					</section>

					{/* 5. Financial Data */}
					<section>
						<h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
							<CreditCard className="mr-3 text-[#335833]" />
							5. Financial Privacy
						</h2>
						<p className="text-gray-600 leading-relaxed">
							For Creators eligible for cash prizes[cite: 11], we may collect
							necessary payment details (such as bank transfer IDs or UPI
							references). This information is restricted to authorized
							Administrators [cite: 113] and is stored securely in our private
							transaction ledgers [cite: 141-143]. We do not expose your
							financial details publicly.
						</p>
					</section>

					{/* 6. Your Rights */}
					<section>
						<h2 className="text-2xl font-bold text-gray-900 mb-4">
							6. Your Rights & Control
						</h2>
						<div className="space-y-4 text-gray-600">
							<p>
								<strong>Edit Profile:</strong> You can update your personal
								information (bio, photo, phone) at any time via your Profile
								page[cite: 105].
							</p>
							<p>
								<strong>Manage Content:</strong> You retain the right to edit or
								delete any blog post or media you have uploaded[cite: 9, 49].{" "}
								<em>
									Note: Deleting content will result in the reversal of any
									points earned from that content[cite: 204].
								</em>
							</p>
							<p>
								<strong>Account Deletion:</strong> If you wish to permanently
								delete your account and data, please contact our support team.
							</p>
						</div>
					</section>

					{/* Contact Section */}
					<div className="bg-green-50 rounded-xl p-8 text-center mt-12">
						<h3 className="text-xl font-bold text-[#1A331A] mb-2">
							Have questions about your data?
						</h3>
						<p className="text-gray-600 mb-6">
							Our team is dedicated to ensuring your safety and privacy in the
							Anamalai Hills digital community.
						</p>
						<a
							href="mailto:privacy@wildlifevalparai.com"
							className="inline-block bg-[#335833] text-white font-bold py-3 px-8 rounded-full hover:bg-[#244024] transition-colors shadow-lg"
						>
							Contact Privacy Support
						</a>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PrivacyPolicy;
