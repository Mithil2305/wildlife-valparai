import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { sendContactEmail } from "../services/workerApi.js";
import {
	HiMail,
	HiPhone,
	HiLocationMarker,
	HiChatAlt2,
	HiPaperAirplane,
	HiQuestionMarkCircle,
	HiGlobeAlt,
	HiExclamationCircle,
} from "react-icons/hi";
import {
	FaInstagram,
	FaFacebookF,
	FaYoutube,
	FaTwitter,
	FaWhatsapp,
} from "react-icons/fa";

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
	visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Contact = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		subject: "",
		location: "", // Extra field for sightings
		message: "",
	});
	const [loading, setLoading] = useState(false);

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!formData.name || !formData.email || !formData.message) {
			toast.error("Please fill in all required fields.");
			return;
		}

		setLoading(true);

		try {
			// Prepare data for email (formatting specific fields)
			const templateParams = {
				...formData,
				subject_line: formData.subject || "General Inquiry",
				// Include location in message if it exists
				message: formData.location
					? `[Location: ${formData.location}]\n\n${formData.message}`
					: formData.message,
			};

			// Send email through secure worker API
			await sendContactEmail(templateParams);
			toast.success("Message sent successfully! We'll get back to you soon.");
			setFormData({
				name: "",
				email: "",
				subject: "",
				location: "",
				message: "",
			});
		} catch (error) {
			console.error("Email Error:", error);
			toast.error("Failed to send message. Please try again later.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-[#FAFAFA] font-sans pt-8 pb-16 px-4 md:px-6">
			<div className="container mx-auto max-w-7xl">
				{/* --- Hero Section --- */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="text-center mb-12 md:mb-16"
				>
					<span className="inline-flex items-center gap-2 bg-green-50 border border-green-100 text-[#335833] px-4 py-1.5 rounded-full text-sm font-bold mb-6">
						<HiChatAlt2 />
						Community Support
					</span>
					<h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
						Get in <span className="text-[#335833]">Touch</span>
					</h1>
					<p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
						Have a wildlife sighting to report? Need help with your creator
						account? Or just want to say hello? We're listening.
					</p>
				</motion.div>

				<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
					{/* --- Left Column: Contact Form (Span 7) --- */}
					<div className="lg:col-span-7">
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.2 }}
							className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 md:p-10 relative overflow-hidden"
						>
							{/* Decorative Blob */}
							<div className="absolute top-0 right-0 w-64 h-64 bg-green-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-50 pointer-events-none"></div>

							<form onSubmit={handleSubmit} className="space-y-6 relative z-10">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div className="space-y-2">
										<label className="text-sm font-bold text-gray-700 uppercase tracking-wide">
											Your Name <span className="text-red-500">*</span>
										</label>
										<input
											type="text"
											name="name"
											value={formData.name}
											onChange={handleChange}
											placeholder="John Doe"
											className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#335833] focus:bg-white focus:border-transparent outline-none transition-all"
										/>
									</div>
									<div className="space-y-2">
										<label className="text-sm font-bold text-gray-700 uppercase tracking-wide">
											Email Address <span className="text-red-500">*</span>
										</label>
										<input
											type="email"
											name="email"
											value={formData.email}
											onChange={handleChange}
											placeholder="john@example.com"
											className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#335833] focus:bg-white focus:border-transparent outline-none transition-all"
										/>
									</div>
								</div>

								<div className="space-y-2">
									<label className="text-sm font-bold text-gray-700 uppercase tracking-wide">
										Subject
									</label>
									<select
										name="subject"
										value={formData.subject}
										onChange={handleChange}
										className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#335833] focus:bg-white focus:border-transparent outline-none transition-all appearance-none cursor-pointer"
									>
										<option value="" disabled>
											Select a topic
										</option>
										<option value="General Inquiry">General Inquiry</option>
										<option value="Report Sighting">
											Report a Rare Sighting
										</option>
										<option value="Creator Support">
											Creator Support / Points
										</option>
										<option value="Collaboration">
											Collaboration / Sponsor
										</option>
									</select>
								</div>

								{/* Conditional Location Field for Sightings */}
								<AnimatePresence>
									{formData.subject === "Report Sighting" && (
										<motion.div
											initial={{ height: 0, opacity: 0 }}
											animate={{ height: "auto", opacity: 1 }}
											exit={{ height: 0, opacity: 0 }}
											className="overflow-hidden space-y-2"
										>
											<label className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
												<HiLocationMarker className="text-red-500" /> Sighting
												Location
											</label>
											<input
												type="text"
												name="location"
												value={formData.location}
												onChange={handleChange}
												placeholder="e.g., Near Sholayar Dam Checkpost"
												className="w-full px-4 py-3 bg-red-50 border border-red-100 rounded-xl focus:ring-2 focus:ring-red-500 focus:bg-white focus:border-transparent outline-none transition-all"
											/>
										</motion.div>
									)}
								</AnimatePresence>

								<div className="space-y-2">
									<label className="text-sm font-bold text-gray-700 uppercase tracking-wide">
										Message <span className="text-red-500">*</span>
									</label>
									<textarea
										name="message"
										rows="5"
										value={formData.message}
										onChange={handleChange}
										placeholder="Tell us more about what you saw or how we can help..."
										className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#335833] focus:bg-white focus:border-transparent outline-none transition-all resize-none"
									></textarea>
								</div>

								<button
									type="submit"
									disabled={loading}
									className="w-full py-4 bg-[#335833] text-white font-bold rounded-xl shadow-lg hover:bg-[#2a4a2a] hover:shadow-xl transition-all disabled:opacity-70 flex items-center justify-center gap-2 group"
								>
									{loading ? (
										"Sending..."
									) : (
										<>
											Send Message
											<HiPaperAirplane className="group-hover:translate-x-1 transition-transform rotate-90" />
										</>
									)}
								</button>
							</form>
						</motion.div>
					</div>

					{/* --- Right Column: Info & Socials (Span 5) --- */}
					<div className="lg:col-span-5 space-y-6">
						{/* Info Cards Grid */}
						<motion.div
							variants={containerVariants}
							initial="hidden"
							animate="visible"
							className="grid grid-cols-1 gap-4"
						>
							{/* Emergency Card (New) */}
							<motion.div
								variants={itemVariants}
								className="bg-red-50 p-6 rounded-2xl border border-red-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow"
							>
								<div className="p-3 bg-red-100 text-red-600 rounded-xl shrink-0 animate-pulse">
									<HiExclamationCircle size={24} />
								</div>
								<div>
									<h3 className="font-bold text-gray-900">
										Emergency Helpline
									</h3>
									<p className="text-sm text-gray-600 mb-1">
										Conflict or Injured Animal?
									</p>
									<a
										href="tel:+919442000000" // Replace with real forest dept number
										className="text-red-600 font-bold text-lg hover:underline"
									>
										+91 0422-2432642
									</a>
									<p className="text-xs text-red-400 mt-1">Forest Department</p>
								</div>
							</motion.div>

							{/* Email Card */}
							<motion.div
								variants={itemVariants}
								className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow"
							>
								<div className="p-3 bg-blue-50 text-blue-600 rounded-xl shrink-0">
									<HiMail size={24} />
								</div>
								<div>
									<h3 className="font-bold text-gray-900">Email Us</h3>

									<a
										href="mailto:wildlife.valparai@gmail.com"
										className="text-[#335833] font-semibold hover:underline"
									>
										wildlife.valparai@gmail.com
									</a>
								</div>
							</motion.div>

							{/* Location Card */}
							<motion.div
								variants={itemVariants}
								className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow"
							>
								<div className="p-3 bg-orange-50 text-orange-600 rounded-xl shrink-0">
									<HiLocationMarker size={24} />
								</div>
								<div>
									<h3 className="font-bold text-gray-900">Visit Us</h3>

									<p className="text-gray-800 font-medium">
										Valparai, Tamil Nadu 642127
									</p>
								</div>
							</motion.div>
						</motion.div>

						{/* Social Media Links */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.5 }}
							className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
						>
							<h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
								<span className="w-2 h-2 rounded-full bg-green-500"></span>
								Follow Us
							</h3>
							<div className="flex flex-wrap gap-3">
								<SocialLink
									icon={FaInstagram}
									href="https://www.instagram.com/wildlife_valparai"
									color="text-pink-600 bg-pink-50 hover:bg-pink-100"
								/>
								<SocialLink
									icon={FaFacebookF}
									href="https://www.facebook.com/profile.php?id=100070562311839"
									color="text-blue-600 bg-blue-50 hover:bg-blue-100"
								/>
								<SocialLink
									icon={FaYoutube}
									href="https://www.youtube.com/@wildlife.valparai"
									color="text-red-600 bg-red-50 hover:bg-red-100"
								/>
								<SocialLink
									icon={FaWhatsapp}
									href="https://whatsapp.com"
									color="text-green-600 bg-green-50 hover:bg-green-100"
								/>
							</div>
						</motion.div>
					</div>
				</div>
			</div>
		</div>
	);
};

// Helper Component for Social Links
const SocialLink = ({ icon: Icon, href, color }) => (
	<a
		href={href}
		target="_blank"
		rel="noopener noreferrer"
		className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-300 hover:scale-110 ${color}`}
	>
		<Icon size={20} />
	</a>
);

export default Contact;
