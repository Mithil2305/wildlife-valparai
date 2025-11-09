import { Link } from "react-router-dom";

const Footer = () => {
	const currentYear = new Date().getFullYear();

	const footerLinks = {
		explore: [
			{ name: "Home", path: "/" },
			{ name: "Sightings", path: "/sightings" },
			{ name: "Blogs", path: "/blogs" },
			{ name: "Leaderboard", path: "/leaderboard" },
		],
		about: [
			{ name: "About Us", path: "/about" },
			{ name: "Contact", path: "/contact" },
			{ name: "Our Team", path: "/about#team" },
			{ name: "Mission", path: "/about#mission" },
		],
		resources: [
			{ name: "Help Center", path: "/help" },
			{ name: "Guidelines", path: "/guidelines" },
			{ name: "API Docs", path: "/api-docs" },
			{ name: "FAQ", path: "/faq" },
		],
		legal: [
			{ name: "Terms of Service", path: "/terms" },
			{ name: "Privacy Policy", path: "/privacy" },
			{ name: "Cookie Policy", path: "/cookies" },
			{ name: "Disclaimer", path: "/disclaimer" },
		],
	};

	const socialLinks = [
		{ name: "Facebook", icon: "📘", url: "#", color: "hover:text-[#1877F2]" },
		{ name: "Twitter", icon: "🐦", url: "#", color: "hover:text-[#1DA1F2]" },
		{ name: "Instagram", icon: "📷", url: "#", color: "hover:text-[#E4405F]" },
		{ name: "YouTube", icon: "📹", url: "#", color: "hover:text-[#FF0000]" },
		{ name: "LinkedIn", icon: "💼", url: "#", color: "hover:text-[#0A66C2]" },
	];

	return (
		<footer className="bg-gradient-to-r from-[#40513B] via-[#609966] to-[#40513B] text-white mt-12">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				{/* Main Footer Content */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
					{/* Brand Section */}
					<div className="lg:col-span-1">
						<Link to="/" className="flex items-center space-x-2 mb-4 group">
							<div className="text-4xl group-hover:scale-110 transition-transform">
								🌳
							</div>
							<div>
								<div className="text-lg font-bold">Wildlife</div>
								<div className="text-lg font-bold text-[#EDF1D6]">Valparai</div>
							</div>
						</Link>
						<p className="text-white/80 text-sm leading-relaxed mb-4">
							Empowering communities to protect and document the incredible
							biodiversity of Valparai through citizen science.
						</p>
						<div className="flex space-x-2">
							{socialLinks.map((social) => (
								<a
									key={social.name}
									href={social.url}
									target="_blank"
									rel="noopener noreferrer"
									className={`text-2xl transition-all hover:scale-110 ${social.color}`}
									title={social.name}
								>
									{social.icon}
								</a>
							))}
						</div>
					</div>

					{/* Explore Links */}
					<div>
						<h3 className="text-lg font-bold mb-4 text-[#EDF1D6]">Explore</h3>
						<ul className="space-y-2">
							{footerLinks.explore.map((link) => (
								<li key={link.path}>
									<Link
										to={link.path}
										className="text-white/80 hover:text-white transition-colors text-sm hover:translate-x-1 inline-block"
									>
										{link.name}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* About Links */}
					<div>
						<h3 className="text-lg font-bold mb-4 text-[#EDF1D6]">About</h3>
						<ul className="space-y-2">
							{footerLinks.about.map((link) => (
								<li key={link.path}>
									<Link
										to={link.path}
										className="text-white/80 hover:text-white transition-colors text-sm hover:translate-x-1 inline-block"
									>
										{link.name}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Resources Links */}
					<div>
						<h3 className="text-lg font-bold mb-4 text-[#EDF1D6]">Resources</h3>
						<ul className="space-y-2">
							{footerLinks.resources.map((link) => (
								<li key={link.path}>
									<Link
										to={link.path}
										className="text-white/80 hover:text-white transition-colors text-sm hover:translate-x-1 inline-block"
									>
										{link.name}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Legal Links */}
					<div>
						<h3 className="text-lg font-bold mb-4 text-[#EDF1D6]">Legal</h3>
						<ul className="space-y-2">
							{footerLinks.legal.map((link) => (
								<li key={link.path}>
									<Link
										to={link.path}
										className="text-white/80 hover:text-white transition-colors text-sm hover:translate-x-1 inline-block"
									>
										{link.name}
									</Link>
								</li>
							))}
						</ul>
					</div>
				</div>

				{/* Newsletter Section */}
				<div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8">
					<div className="flex flex-col md:flex-row items-center justify-between gap-4">
						<div className="text-center md:text-left">
							<h3 className="text-xl font-bold mb-2 flex items-center justify-center md:justify-start">
								<span className="mr-2">📧</span>
								Stay Updated
							</h3>
							<p className="text-white/80 text-sm">
								Get the latest wildlife sightings and conservation news
							</p>
						</div>
						<div className="flex w-full md:w-auto">
							<input
								type="email"
								placeholder="Enter your email"
								className="flex-1 md:w-64 px-4 py-3 rounded-l-xl bg-white/20 backdrop-blur-sm border border-white/30 focus:outline-none focus:border-white/50 text-white placeholder-white/60"
							/>
							<button className="px-6 py-3 bg-white text-[#40513B] rounded-r-xl font-bold hover:bg-[#EDF1D6] transition-colors whitespace-nowrap">
								Subscribe
							</button>
						</div>
					</div>
				</div>

				{/* Stats Section */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
					<div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center hover:scale-105 transition-transform">
						<div className="text-3xl font-bold text-[#EDF1D6]">1000+</div>
						<div className="text-sm text-white/80">Sightings</div>
					</div>
					<div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center hover:scale-105 transition-transform">
						<div className="text-3xl font-bold text-[#EDF1D6]">500+</div>
						<div className="text-sm text-white/80">Members</div>
					</div>
					<div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center hover:scale-105 transition-transform">
						<div className="text-3xl font-bold text-[#EDF1D6]">45</div>
						<div className="text-sm text-white/80">Species</div>
					</div>
					<div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center hover:scale-105 transition-transform">
						<div className="text-3xl font-bold text-[#EDF1D6]">890</div>
						<div className="text-sm text-white/80">Blog Posts</div>
					</div>
				</div>

				{/* Bottom Bar */}
				<div className="border-t border-white/20 pt-8">
					<div className="flex flex-col md:flex-row justify-between items-center gap-4">
						<p className="text-white/80 text-sm text-center md:text-left">
							© {currentYear} Wildlife Valparai. All rights reserved. Made with
							💚 for conservation.
						</p>
						<div className="flex items-center space-x-4 text-sm text-white/80">
							<span className="flex items-center">
								<span className="mr-1">🌍</span>
								Valparai, Tamil Nadu
							</span>
							<span className="hidden md:inline">•</span>
							<a
								href="mailto:info@wildlifevalparai.org"
								className="hover:text-white transition-colors"
							>
								info@wildlifevalparai.org
							</a>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
