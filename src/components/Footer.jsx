import React from "react";
import { Link } from "react-router-dom";
/**
 * A placeholder for your "WV Wildlife Valparai" logo.
 * It mimics the text and structure shown in the image.
 */

/**
 * FooterLink component for styling
 */
const FooterLink = ({ to, children }) => (
	<Link
		to={to}
		className="text-gray-300 hover:text-white transition-colors duration-200"
	>
		{children}
	</Link>
);

/**
 * ExternalLink component for styling
 */
const ExternalLink = ({ href, children }) => (
	<a
		href={href}
		target="_blank"
		rel="noopener noreferrer"
		className="text-gray-300 hover:text-white transition-colors duration-200"
	>
		{children}
	</a>
);

const Footer = () => {
	// Using the dark green from your navbar toggle: bg-[#335833]
	return (
		<footer className="bg-[#335833] text-gray-200">
			<div className="container mx-auto max-w-7xl px-4 md:px-6 py-12">
				{/* Main Grid: 5 columns as seen in the image */}
				<div className="grid grid-cols-2 md:grid-cols-5 gap-8">
					{/* Column 1: Logo */}
					<div className="col-span-2 md:col-span-1">
						<Link to="/" aria-label="Go to Homepage">
							<img src="/assets/logo.png" alt="logo" />
						</Link>
					</div>

					{/* Column 2: Docs */}
					<div className="flex flex-col space-y-3">
						<h3 className="font-semibold text-white text-lg">Docs</h3>
						<FooterLink to="/legal/disclaimer">Disclaimer</FooterLink>
						<FooterLink to="/legal/privacy">Privacy Policy</FooterLink>
						<FooterLink to="/legal/terms">Terms and Conditions</FooterLink>
					</div>

					{/* Column 3: Pages */}
					<div className="flex flex-col space-y-3">
						<h3 className="font-semibold text-white text-lg">Pages</h3>
						<FooterLink to="/">Home</FooterLink>
						<FooterLink to="/about">About</FooterLink>
						<FooterLink to="/contact">Contact</FooterLink>
						<FooterLink to="/socials">WV Socials</FooterLink>
						<FooterLink to="/sponsor">Become Sponsor</FooterLink>
					</div>

					{/* Column 4: Social Media */}
					<div className="flex flex-col space-y-3">
						<h3 className="font-semibold text-white text-lg">Social Media</h3>
						<ExternalLink href="https://www.instagram.com/wildlifevalparai">
							Instagram
						</ExternalLink>
						<ExternalLink href="https://www.facebook.com/wildlifevalparai">
							Facebook
						</ExternalLink>
						<ExternalLink href="https://www.youtube.com/wildlifevalparai">
							YouTube
						</ExternalLink>
						<ExternalLink href="https://wa.me/your-number">
							WhatsApp
						</ExternalLink>
					</div>

					{/* Column 5: Found a Issue! */}
					<div className="flex flex-col space-y-3">
						<h3 className="font-semibold text-white text-lg">Found a Issue!</h3>
						<p className="text-gray-300">Report at</p>
						<a
							href="mailto:wildlife.valparai@gmail.com"
							className="text-gray-300 hover:text-white transition-colors duration-200"
						>
							wildlife.valparai@gmail.com
						</a>
					</div>
				</div>

				{/* Bottom Copyright Bar */}
				<div className="mt-5 pt-8 border-t border-gray-100/20 text-center md:text-right">
					<p className="text-gray-400 text-sm">
						© {new Date().getFullYear()} | Wildlife Valparai | All Rights
						Reserved
					</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
