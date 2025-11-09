import { useState } from "react";
import {
	HiMail,
	HiPhone,
	HiLocationMarker,
	HiClock,
	HiQuestionMarkCircle,
	HiCamera,
	HiTrophy,
	HiShieldCheck
} from "react-icons/hi";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

const Contact = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		subject: "",
		message: "",
	});

	const [status, setStatus] = useState({ type: "", message: "" });

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		// TODO: Implement actual form submission
		setStatus({
			type: "success",
			message: "Thank you! We'll get back to you soon.",
		});
		setFormData({ name: "", email: "", subject: "", message: "" });
	};

	const contactInfo = [
		{
			Icon: HiMail,
			title: "Email",
			value: "info@wildlifevalparai.org",
			link: "mailto:info@wildlifevalparai.org",
		},
		{
			Icon: HiPhone,
			title: "Phone",
			value: "+91 98765 43210",
			link: "tel:+919876543210",
		},
		{
			Icon: HiLocationMarker,
			title: "Location",
			value: "Valparai, Tamil Nadu, India",
			link: "https://maps.google.com/?q=Valparai",
		},
		{
			Icon: HiClock,
			title: "Response Time",
			value: "Within 24-48 hours",
			link: null,
		},
	];

	const socialLinks = [
		{
			name: "Facebook",
			Icon: FaFacebook,
			url: "#",
			color: "from-[#609966] to-[#40513B]",
		},
		{
			name: "Twitter",
			Icon: FaTwitter,
			url: "#",
			color: "from-[#9DC08B] to-[#609966]",
		},
		{
			name: "Instagram",
			Icon: FaInstagram,
			url: "#",
			color: "from-[#609966] to-[#40513B]",
		},
		{
			name: "YouTube",
			Icon: FaYoutube,
			url: "#",
			color: "from-[#9DC08B] to-[#609966]",
		},
	];

	const faqCategories = [
		{
			Icon: HiQuestionMarkCircle,
			title: "General Questions",
			description: "Learn about our platform and mission",
		},
		{
			Icon: HiCamera,
			title: "Upload Support",
			description: "Help with sightings and content",
		},
		{
			Icon: HiTrophy,
			title: "Points & Rewards",
			description: "Understand our rewards system",
		},
		{
			Icon: HiShieldCheck,
			title: "Technical Issues",
			description: "Troubleshooting and bug reports",
		},
	];

	return (
		<div className="space-y-12">
			{/* Hero Section */}
			<div className="bg-gradient-to-br from-[#40513B] via-[#609966] to-[#40513B] rounded-3xl p-8 md:p-16 text-white shadow-2xl relative overflow-hidden">
				<div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
				<div className="absolute bottom-0 left-0 w-64 h-64 bg-[#9DC08B]/10 rounded-full blur-3xl"></div>
				<div className="relative z-10 max-w-3xl mx-auto text-center">
					<div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
						<HiMail className="w-5 h-5" />
						<span className="text-sm font-medium">Contact Us</span>
					</div>
					<h1 className="text-4xl md:text-5xl font-bold mb-6">
						We'd Love to
						<span className="block text-[#EDF1D6] mt-2">Hear From You</span>
					</h1>
					<p className="text-xl text-white/90 leading-relaxed">
						Have questions, suggestions, or just want to say hello? Our team is
						here to help!
					</p>
				</div>
			</div>

			{/* Contact Info Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{contactInfo.map((info, index) => {
					const { Icon } = info;
					return (
						<div
							key={index}
							className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-[#9DC08B]/20 text-center"
						>
							<div className="flex items-center justify-center mb-3">
								<Icon className="w-12 h-12 text-[#609966]" />
							</div>
							<h3 className="text-lg font-bold text-[#40513B] mb-2">
								{info.title}
							</h3>
						{info.link ? (
							<a
								href={info.link}
								className="text-[#609966] hover:text-[#40513B] transition-colors"
								target={info.link.startsWith("http") ? "_blank" : undefined}
								rel={
									info.link.startsWith("http")
										? "noopener noreferrer"
										: undefined
								}
							>
								{info.value}
							</a>
						) : (
							<p className="text-[#609966]">{info.value}</p>
						)}
						</div>
					);
				})}
			</div>

			{/* Main Contact Form & Info */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* Contact Form */}
				<div className="lg:col-span-2">
					<div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-[#9DC08B]/20">
						<h2 className="text-3xl font-bold text-[#40513B] mb-6 flex items-center">
							<HiMail className="w-8 h-8 mr-3" />
							Send Us a Message
						</h2>

						{status.message && (
							<div
								className={`mb-6 p-4 rounded-2xl ${
									status.type === "success"
										? "bg-[#9DC08B]/20 text-[#40513B] border border-[#9DC08B]"
										: "bg-red-100 text-red-700 border border-red-300"
								}`}
							>
								{status.message}
							</div>
						)}

						<form onSubmit={handleSubmit} className="space-y-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<label
										htmlFor="name"
										className="block text-sm font-bold text-[#40513B] mb-2"
									>
										Your Name
									</label>
									<input
										type="text"
										id="name"
										name="name"
										value={formData.name}
										onChange={handleChange}
										required
										className="w-full px-4 py-3 rounded-xl border-2 border-[#9DC08B]/30 focus:border-[#609966] focus:outline-none transition-colors bg-white/50"
										placeholder="John Doe"
									/>
								</div>

								<div>
									<label
										htmlFor="email"
										className="block text-sm font-bold text-[#40513B] mb-2"
									>
										Email Address
									</label>
									<input
										type="email"
										id="email"
										name="email"
										value={formData.email}
										onChange={handleChange}
										required
										className="w-full px-4 py-3 rounded-xl border-2 border-[#9DC08B]/30 focus:border-[#609966] focus:outline-none transition-colors bg-white/50"
										placeholder="john@example.com"
									/>
								</div>
							</div>

							<div>
								<label
									htmlFor="subject"
									className="block text-sm font-bold text-[#40513B] mb-2"
								>
									Subject
								</label>
								<input
									type="text"
									id="subject"
									name="subject"
									value={formData.subject}
									onChange={handleChange}
									required
									className="w-full px-4 py-3 rounded-xl border-2 border-[#9DC08B]/30 focus:border-[#609966] focus:outline-none transition-colors bg-white/50"
									placeholder="What is this regarding?"
								/>
							</div>

							<div>
								<label
									htmlFor="message"
									className="block text-sm font-bold text-[#40513B] mb-2"
								>
									Your Message
								</label>
								<textarea
									id="message"
									name="message"
									value={formData.message}
									onChange={handleChange}
									required
									rows={6}
									className="w-full px-4 py-3 rounded-xl border-2 border-[#9DC08B]/30 focus:border-[#609966] focus:outline-none transition-colors bg-white/50 resize-none"
									placeholder="Tell us more about your inquiry..."
								></textarea>
							</div>

							<button
								type="submit"
								className="w-full px-8 py-4 bg-gradient-to-r from-[#609966] to-[#40513B] text-white rounded-2xl font-bold text-lg hover:scale-105 hover:shadow-2xl transition-all duration-300"
							>
								Send Message
							</button>
						</form>
					</div>
				</div>

				{/* Sidebar */}
				<div className="space-y-6">
					{/* FAQ Categories */}
					<div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-[#9DC08B]/20">
						<h3 className="text-xl font-bold text-[#40513B] mb-4">
							Quick Help
						</h3>
						<div className="space-y-3">
							{faqCategories.map((category, index) => {
								const { Icon } = category;
								return (
									<a
										key={index}
										href="#"
										className="flex items-start space-x-3 p-3 rounded-xl bg-gradient-to-r from-[#EDF1D6] to-[#9DC08B]/20 hover:scale-105 transition-transform border border-[#9DC08B]/30"
									>
										<Icon className="w-6 h-6 text-[#609966] flex-shrink-0 mt-0.5" />
										<div>
											<p className="font-bold text-[#40513B] text-sm">
												{category.title}
											</p>
											<p className="text-xs text-[#609966]">
												{category.description}
											</p>
										</div>
									</a>
								);
							})}
						</div>
					</div>

					{/* Social Media */}
					<div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-[#9DC08B]/20">
						<h3 className="text-xl font-bold text-[#40513B] mb-4">Follow Us</h3>
						<div className="grid grid-cols-2 gap-3">
							{socialLinks.map((social, index) => {
								const { Icon } = social;
								return (
									<a
										key={index}
										href={social.url}
										className={`flex flex-col items-center justify-center p-4 bg-gradient-to-r ${social.color} text-white rounded-xl hover:scale-105 transition-transform shadow-lg`}
										target="_blank"
										rel="noopener noreferrer"
									>
										<Icon className="w-8 h-8 mb-1" />
										<span className="text-xs font-medium">{social.name}</span>
									</a>
								);
							})}
						</div>
					</div>

					{/* Office Hours */}
					<div className="bg-gradient-to-br from-[#9DC08B] to-[#609966] rounded-3xl p-6 text-white shadow-xl">
						<h3 className="text-xl font-bold mb-4 flex items-center">
							<HiClock className="w-6 h-6 mr-2" />
							Office Hours
						</h3>
						<div className="space-y-2 text-sm">
							<div className="flex justify-between">
								<span>Monday - Friday</span>
								<span className="font-bold">9 AM - 6 PM</span>
							</div>
							<div className="flex justify-between">
								<span>Saturday</span>
								<span className="font-bold">10 AM - 4 PM</span>
							</div>
							<div className="flex justify-between">
								<span>Sunday</span>
								<span className="font-bold">Closed</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Alternative Contact Methods */}
			<div className="bg-gradient-to-r from-[#EDF1D6] to-[#9DC08B]/30 rounded-3xl p-8 border border-[#9DC08B]/20">
				<h2 className="text-2xl font-bold text-[#40513B] mb-6 text-center">
					Other Ways to Reach Us
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<div className="text-center p-6 bg-white/50 rounded-2xl hover:scale-105 transition-transform">
						<div className="text-4xl mb-3">💼</div>
						<h3 className="font-bold text-[#40513B] mb-2">
							Partnership Inquiries
						</h3>
						<p className="text-sm text-[#609966] mb-2">
							Interested in collaborating?
						</p>
						<a
							href="mailto:partnerships@wildlifevalparai.org"
							className="text-[#609966] hover:text-[#40513B] font-medium text-sm"
						>
							partnerships@wildlifevalparai.org
						</a>
					</div>

					<div className="text-center p-6 bg-white/50 rounded-2xl hover:scale-105 transition-transform">
						<div className="text-4xl mb-3">🎓</div>
						<h3 className="font-bold text-[#40513B] mb-2">
							Research & Education
						</h3>
						<p className="text-sm text-[#609966] mb-2">
							Academic collaborations
						</p>
						<a
							href="mailto:research@wildlifevalparai.org"
							className="text-[#609966] hover:text-[#40513B] font-medium text-sm"
						>
							research@wildlifevalparai.org
						</a>
					</div>

					<div className="text-center p-6 bg-white/50 rounded-2xl hover:scale-105 transition-transform">
						<div className="text-4xl mb-3">📰</div>
						<h3 className="font-bold text-[#40513B] mb-2">Media & Press</h3>
						<p className="text-sm text-[#609966] mb-2">
							Press inquiries welcome
						</p>
						<a
							href="mailto:press@wildlifevalparai.org"
							className="text-[#609966] hover:text-[#40513B] font-medium text-sm"
						>
							press@wildlifevalparai.org
						</a>
					</div>
				</div>
			</div>

			{/* Map Section (Placeholder) */}
			<div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-[#9DC08B]/20">
				<h2 className="text-2xl font-bold text-[#40513B] mb-6 flex items-center">
					<HiLocationMarker className="w-7 h-7 mr-3" />
					Visit Valparai
				</h2>
				<div className="bg-gradient-to-br from-[#EDF1D6] to-[#9DC08B]/30 rounded-2xl h-64 flex items-center justify-center border-2 border-[#9DC08B]/30">
					<div className="text-center">
						<p className="text-6xl mb-4">🌲</p>
						<p className="text-[#40513B] font-bold">Valparai, Tamil Nadu</p>
						<p className="text-[#609966] text-sm">Western Ghats Region</p>
						<a
							href="https://maps.google.com/?q=Valparai"
							target="_blank"
							rel="noopener noreferrer"
							className="inline-block mt-4 px-6 py-2 bg-gradient-to-r from-[#609966] to-[#40513B] text-white rounded-lg hover:scale-105 transition-transform"
						>
							View on Map
						</a>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Contact;
