import React from "react";
import { Link } from "react-router-dom";
import {
	Instagram,
	Facebook,
	Youtube,
	MessageCircle,
	Mail,
	ArrowRight,
	Heart,
	Shield,
	FileText,
	AlertCircle,
} from "lucide-react";

const Footer = () => {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="bg-[#1A331A] text-gray-300 font-sans border-t border-white/5 relative overflow-hidden">
			{/* Decorative Background Elements */}
			<div className="absolute top-0 right-0 w-96 h-96 bg-[#335833] rounded-full blur-[120px] opacity-20 pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
			<div className="absolute bottom-0 left-0 w-64 h-64 bg-[#335833] rounded-full blur-[100px] opacity-10 pointer-events-none translate-y-1/2 -translate-x-1/2"></div>

			<div className="container mx-auto max-w-7xl px-6 pt-16 pb-8 relative z-10">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
					{/* 1. Brand & Newsletter (Span 4) */}
					<div className="lg:col-span-4 ">
						<Link to="/" className="inline-block">
							<img
								src="/assets/logo.png"
								alt="Wildlife Valparai"
								className="h-35 w-auto brightness-110"
							/>
						</Link>
						<p className="text-gray-400 text-sm leading-relaxed max-w-sm">
							Dedicated to protecting nature and preserving life in Valparai.
							Join our community to stay updated with the latest sightings and
							conservation efforts.
						</p>

						{/* Newsletter Input */}
						<div className="relative max-w-sm mt-4">
							<input
								type="email"
								placeholder="Enter your email"
								className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-4 pr-12 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#4A7A4A] focus:ring-1 focus:ring-[#4A7A4A] transition-all"
							/>
							<button className="absolute right-1.5 top-1.5 p-1.5 bg-[#335833] hover:bg-[#3e6b3e] text-white rounded-full transition-colors shadow-sm">
								<ArrowRight size={16} />
							</button>
						</div>
					</div>

					{/* 2. Explore (Span 2) */}
					<div className="lg:col-span-2 lg:ml-auto">
						<h3 className="font-bold text-white text-lg mb-6">Explore</h3>
						<ul className="space-y-4">
							<li>
								<Link
									to="/about"
									className="text-gray-400 hover:text-[#8CBF8C] transition-colors inline-flex items-center gap-2 group"
								>
									<span className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-[#8CBF8C] transition-colors"></span>
									About Us
								</Link>
							</li>
							<li>
								<Link
									to="/contact"
									className="text-gray-400 hover:text-[#8CBF8C] transition-colors inline-flex items-center gap-2 group"
								>
									<span className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-[#8CBF8C] transition-colors"></span>
									Contact Us
								</Link>
							</li>
							<li>
								<Link
									to="/socials"
									className="text-gray-400 hover:text-[#8CBF8C] transition-colors inline-flex items-center gap-2 group"
								>
									<span className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-[#8CBF8C] transition-colors"></span>
									Social Feed
								</Link>
							</li>
							<li>
								<Link
									to="/leaderboard"
									className="text-gray-400 hover:text-[#8CBF8C] transition-colors inline-flex items-center gap-2 group"
								>
									<span className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-[#8CBF8C] transition-colors"></span>
									Leaderboard
								</Link>
							</li>
							<li>
								<Link
									to="/sponsor"
									className="text-gray-400 hover:text-[#8CBF8C] transition-colors inline-flex items-center gap-2 group"
								>
									<span className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-[#8CBF8C] transition-colors"></span>
									Sponsors
								</Link>
							</li>
						</ul>
					</div>

					{/* 3. Legal Docs (Span 3) */}
					<div className="lg:col-span-3 lg:pl-8">
						<h3 className="font-bold text-white text-lg mb-6">Legal</h3>
						<ul className="space-y-4">
							<li>
								<Link
									to="/legal/privacy"
									className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
								>
									<Shield size={16} className="text-[#335833]" />
									Privacy Policy
								</Link>
							</li>
							<li>
								<Link
									to="/legal/terms-and-conditions"
									className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
								>
									<FileText size={16} className="text-[#335833]" />
									Terms & Conditions
								</Link>
							</li>
							<li>
								<Link
									to="/legal/disclaimer"
									className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
								>
									<AlertCircle size={16} className="text-[#335833]" />
									Disclaimer
								</Link>
							</li>
						</ul>
					</div>

					{/* 4. Contact & Socials (Span 3) */}
					<div className="lg:col-span-3">
						<h3 className="font-bold text-white text-lg mb-6">Connect</h3>
						<div className="space-y-4">
							<a
								href="mailto:wildlife.valparai@gmail.com"
								className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all group"
							>
								<div className="p-2 bg-[#335833]/20 text-[#8CBF8C] rounded-lg group-hover:scale-110 transition-transform">
									<Mail size={18} />
								</div>
								<div>
									<p className="text-xs text-gray-400">Found an issue?</p>
									<p className="text-sm font-medium text-white group-hover:text-[#8CBF8C] transition-colors">
										Email Support
									</p>
								</div>
							</a>

							{/* Social Icons Grid */}
							<div className="flex items-center gap-3 mt-4">
								<SocialIcon
									href="https://www.instagram.com/wildlife_valparai"
									icon={Instagram}
									color="hover:text-pink-500 hover:bg-pink-500/10"
								/>
								<SocialIcon
									href="https://www.facebook.com/profile.php?id=100070562311839"
									icon={Facebook}
									color="hover:text-blue-500 hover:bg-blue-500/10"
								/>
								<SocialIcon
									href="https://www.youtube.com/@wildlife.valparai"
									icon={Youtube}
									color="hover:text-red-500 hover:bg-red-500/10"
								/>
								<SocialIcon
									href="https://wa.me/your-number"
									icon={MessageCircle}
									color="hover:text-green-500 hover:bg-green-500/10"
								/>
							</div>
						</div>
					</div>
				</div>

				{/* Bottom Bar */}
				<div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
					<p>
						© {currentYear}{" "}
						<span className="text-white">Wildlife Valparai</span>. All Rights
						Reserved.
					</p>
					<div className="flex items-center gap-1.5">
						<span>Made with</span>
						<Heart size={14} className="text-red-500 fill-red-500" />
						<span>
							by{" "}
							<a
								href="https://mudmedia.in"
								target="_blank"
								rel="noopener noreferrer"
								className="text-white font-medium"
							>
								Mud Media
							</a>
						</span>
					</div>
				</div>
			</div>
		</footer>
	);
};

// Helper for Social Icons
const SocialIcon = ({ href, icon: Icon, color }) => (
	<a
		href={href}
		target="_blank"
		rel="noopener noreferrer"
		className={`w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-gray-400 transition-all duration-300 hover:scale-110 ${color}`}
	>
		<Icon size={18} />
	</a>
);

export default Footer;
