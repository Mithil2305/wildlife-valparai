import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
	getAuthInstance,
	getUserDoc,
	getDoc,
	onAuthStateChanged,
} from "../services/firebase.js";
import { uploadSingleFile } from "../services/r2Upload.js";
import { updateUserProfile, signOut } from "../services/authApi.js";
import LoadingSpinner from "./LoadingSpinner.jsx";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
	FaCamera,
	FaEdit,
	FaTimes,
	FaUserShield,
	FaChartLine,
	FaSignOutAlt,
	FaEnvelope,
	FaPhone,
	FaMapMarkerAlt,
	FaStar,
} from "react-icons/fa";

// --- Edit Profile Modal ---
const EditProfileModal = ({ user, onClose, onSave }) => {
	const [name, setName] = useState(user.name);
	const [bio, setBio] = useState(user.bio || "");
	const [upi, setUpi] = useState(user.upiId || "");
	const [phone, setPhone] = useState(user.phone || "");
	const [profileImageFile, setProfileImageFile] = useState(null);
	const [imagePreview, setImagePreview] = useState(user.profilePhotoUrl);
	const [isUploading, setIsUploading] = useState(false);
	const fileInputRef = useRef(null);
	const auth = getAuthInstance();

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			if (file.size > 5 * 1024 * 1024) {
				toast.error("Image size should be less than 5MB");
				return;
			}
			setProfileImageFile(file);
			setImagePreview(URL.createObjectURL(file));
		}
	};
	const handleSave = async (e) => {
		e.preventDefault();
		if (!name.trim()) {
			toast.error("Name is required");
			return;
		}

		setIsUploading(true);
		const loadingToast = toast.loading("Saving profile...");

		try {
			let newPhotoUrl = user.profilePhotoUrl;
			if (profileImageFile) {
				newPhotoUrl = await uploadSingleFile(
					profileImageFile,
					auth.currentUser.uid,
					"profile"
				);
			}

			const updatedData = {
				name: name.trim(),
				bio: bio.trim(),
				upiId: upi.trim(),
				phone: phone.trim(),
				profilePhotoUrl: newPhotoUrl,
			};
			await updateUserProfile(auth.currentUser.uid, updatedData);

			onSave(updatedData);
			toast.dismiss(loadingToast);
			toast.success("Profile updated successfully!");
			onClose();
		} catch (error) {
			console.error("Error saving profile:", error);
			toast.dismiss(loadingToast);
			toast.error("Failed to update profile.");
		} finally {
			setIsUploading(false);
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
			onClick={onClose}
		>
			<motion.div
				initial={{ scale: 0.95, opacity: 0, y: 20 }}
				animate={{ scale: 1, opacity: 1, y: 0 }}
				exit={{ scale: 0.95, opacity: 0, y: 20 }}
				className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
					<h2 className="text-xl font-bold text-gray-900">Edit Profile</h2>
					<button
						onClick={onClose}
						className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-200"
					>
						<FaTimes size={18} />
					</button>
				</div>

				<form
					onSubmit={handleSave}
					className="p-6 overflow-y-auto max-h-[80vh]"
				>
					{/* Profile Picture */}
					<div className="flex flex-col items-center mb-8">
						<div className="relative group">
							<div className="w-28 h-28 rounded-full p-1 border-2 border-dashed border-gray-300 group-hover:border-[#335833] transition-colors">
								<img
									src={
										imagePreview ||
										`https://ui-avatars.com/api/?name=${encodeURIComponent(
											user.name || user.username || "User"
										)}&size=128&background=335833&color=fff`
									}
									alt="Preview"
									className="w-full h-full rounded-full object-cover"
								/>
							</div>
							<button
								type="button"
								onClick={() => fileInputRef.current.click()}
								className="absolute bottom-1 right-1 w-9 h-9 bg-[#335833] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#2a4729] transition-transform hover:scale-105"
							>
								<FaCamera size={14} />
							</button>
						</div>
						<input
							type="file"
							ref={fileInputRef}
							onChange={handleImageChange}
							accept="image/*"
							className="hidden"
						/>
					</div>

					{/* Inputs */}
					<div className="space-y-5">
						<div>
							<label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
								Full Name
							</label>
							<input
								type="text"
								value={name}
								onChange={(e) => setName(e.target.value)}
								className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#335833] focus:bg-white outline-none transition-all font-medium"
								placeholder="John Doe"
							/>
						</div>

						<div>
							<label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
								UPI ID
							</label>
							<input
								type="text"
								value={upi}
								onChange={(e) => setUpi(e.target.value)}
								className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#335833] focus:bg-white outline-none transition-all font-medium"
								placeholder="yourname123@oksbi"
							/>
						</div>
						<div>
							<label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
								Phone
							</label>
							<input
								type="tel"
								value={phone}
								onChange={(e) => setPhone(e.target.value)}
								className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#335833] focus:bg-white outline-none transition-all font-medium"
								placeholder="+91 98765 43210"
							/>
						</div>

						<div>
							<label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
								Bio
							</label>
							<textarea
								value={bio}
								onChange={(e) => setBio(e.target.value)}
								rows={4}
								maxLength={500}
								className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#335833] focus:bg-white outline-none transition-all resize-none font-medium text-sm"
								placeholder="Tell us a bit about yourself..."
							/>
							<div className="text-right text-xs text-gray-400 mt-1">
								{bio.length}/500
							</div>
						</div>
					</div>

					{/* Buttons */}
					<div className="flex gap-3 mt-8">
						<button
							type="button"
							onClick={onClose}
							disabled={isUploading}
							className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={isUploading}
							className="flex-1 py-3 bg-[#335833] text-white font-bold rounded-xl hover:bg-[#2a4729] transition-colors shadow-lg disabled:opacity-70"
						>
							{isUploading ? "Saving..." : "Save Changes"}
						</button>
					</div>
				</form>
			</motion.div>
		</motion.div>
	);
};

// --- Main Profile Component ---
const Profile = () => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		const auth = getAuthInstance();
		const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
			if (currentUser) {
				try {
					const userRef = await getUserDoc(currentUser.uid);
					const userSnap = await getDoc(userRef);
					if (userSnap.exists()) {
						setUser(userSnap.data());
					} else {
						toast.error("Profile not found.");
						navigate("/");
					}
				} catch (error) {
					console.error("Error fetching profile:", error);
				} finally {
					setLoading(false);
				}
			} else {
				setLoading(false);
				navigate("/login");
			}
		});
		return () => unsubscribe();
	}, [navigate]);

	const handleSaveProfile = (updatedData) => {
		setUser({ ...user, ...updatedData });
	};

	const handleSignOut = async () => {
		try {
			await signOut();
			toast.success("Signed out successfully");
			navigate("/login");
		} catch (error) {
			toast.error("Failed to sign out", error);
		}
	};

	if (loading) return <LoadingSpinner />;
	if (!user) return null;

	return (
		<>
			<div className="min-h-screen bg-[#F3F4F6] py-8 px-4 md:px-8">
				<div className="max-w-5xl mx-auto space-y-6">
					{/* 1. Header Card */}
					<div className="bg-white rounded-[2rem] shadow-sm border border-gray-200 overflow-hidden relative">
						{/* Cover Photo */}
						<div className="h-48 md:h-64 bg-gradient-to-r from-[#1A331A] via-[#335833] to-[#4A7A4A] relative">
							<div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
						</div>

						<div className="px-6 md:px-10 pb-8 relative">
							<div className="flex flex-col md:flex-row items-start gap-6">
								{/* Avatar - Negative Margin to Overlap */}
								<div className="-mt-16 md:-mt-20 relative z-10">
									<div className="p-1.5 bg-white rounded-full shadow-md">
										<img
											src={
												user.profilePhotoUrl ||
												`https://ui-avatars.com/api/?name=${encodeURIComponent(
													user.name || user.username || "User"
												)}&size=128&background=335833&color=fff`
											}
											alt={user.name || "User"}
											className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white bg-gray-100"
										/>
									</div>
								</div>

								{/* User Text Info */}
								<div className="flex-1 mt-2 md:mt-4">
									<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
										<div>
											<h1 className="text-3xl font-bold text-gray-900">
												{user.name}
											</h1>
											<p className="text-gray-500 font-medium">
												@{user.username}
											</p>
										</div>
										<button
											onClick={() => setIsEditModalOpen(true)}
											className="px-6 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-full hover:bg-gray-200 transition-colors flex items-center gap-2 self-start"
										>
											<FaEdit /> Edit Profile
										</button>
									</div>

									{/* Bio */}
									<p className="mt-4 text-gray-600 leading-relaxed max-w-2xl">
										{user.bio || "No bio added yet."}
									</p>

									{/* Contact Info (Inline) */}
									<div className="flex flex-wrap gap-4 mt-6">
										<div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg">
											<FaEnvelope className="text-[#335833]" />
											{user.email}
										</div>
										{user.phone && (
											<div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg">
												<FaPhone className="text-[#335833]" />
												{user.phone}
											</div>
										)}
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* 2. Bento Grid for Stats & Actions */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{/* Left Column: Stats Cards */}
						<div className="space-y-6">
							{/* Account Type Card */}
							<div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group">
								<div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
								<h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2 relative z-10">
									Membership
								</h3>
								<div className="flex items-center gap-3 relative z-10">
									<div
										className={`p-3 rounded-xl ${
											user.accountType === "creator"
												? "bg-green-100 text-green-700"
												: user.accountType === "admin"
												? "bg-purple-100 text-purple-700"
												: "bg-blue-100 text-blue-700"
										}`}
									>
										<FaUserShield size={24} />
									</div>
									<div>
										<p className="text-xl font-bold text-gray-900 capitalize">
											{user.accountType}
										</p>
										<p className="text-xs text-gray-500">Current Plan</p>
									</div>
								</div>
							</div>

							{/* Points Card */}
							<div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group">
								<div className="absolute top-0 right-0 w-24 h-24 bg-yellow-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
								<h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2 relative z-10">
									Achievements
								</h3>
								<div className="flex items-center gap-3 relative z-10">
									<div className="p-3 bg-yellow-100 text-yellow-600 rounded-xl">
										<FaStar size={24} />
									</div>
									<div>
										<p className="text-xl font-bold text-gray-900">
											{user.points || 0}
										</p>
										<p className="text-xs text-gray-500">Total Points</p>
									</div>
								</div>
							</div>
						</div>

						{/* Right Column: Actions (Span 2) */}
						<div className="md:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
							<h3 className="text-lg font-bold text-gray-900 mb-6">
								Quick Actions
							</h3>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								{/* Dashboard Link */}
								{user.accountType === "creator" && (
									<Link
										to="/dashboard/creator"
										className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-[#335833] hover:text-white hover:border-[#335833] transition-all group"
									>
										<div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#335833] shadow-sm group-hover:scale-110 transition-transform">
											<FaChartLine size={20} />
										</div>
										<div>
											<p className="font-bold">Creator Dashboard</p>
											<p className="text-xs text-gray-500 group-hover:text-green-100">
												Manage Content
											</p>
										</div>
									</Link>
								)}

								{user.accountType === "admin" && (
									<Link
										to="/dashboard/admin"
										className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-all group"
									>
										<div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-purple-600 shadow-sm group-hover:scale-110 transition-transform">
											<FaUserShield size={20} />
										</div>
										<div>
											<p className="font-bold">Admin Panel</p>
											<p className="text-xs text-gray-500 group-hover:text-purple-100">
												System Settings
											</p>
										</div>
									</Link>
								)}

								{/* Sign Out */}
								<button
									onClick={handleSignOut}
									className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all group w-full text-left"
								>
									<div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-red-500 shadow-sm group-hover:scale-110 transition-transform">
										<FaSignOutAlt size={20} />
									</div>
									<div>
										<p className="font-bold">Sign Out</p>
										<p className="text-xs text-gray-500 group-hover:text-red-100">
											Securely log out
										</p>
									</div>
								</button>
							</div>

							{/* Viewer Upgrade CTA */}
							{user.accountType === "viewer" && (
								<div className="mt-8 p-6 bg-linear-to-r from-gray-900 to-gray-800 rounded-2xl text-white relative overflow-hidden">
									<div className="relative z-10">
										<h4 className="font-bold text-lg mb-2">Become a Creator</h4>
										<p className="text-gray-300 text-sm mb-4 max-w-md">
											Share your wildlife photography and blogs with the world.
											Earn points and win prizes.
										</p>
										<button
											onClick={() =>
												toast("Application system coming soon!", {
													icon: "🚧",
												})
											}
											className="px-5 py-2 bg-white text-gray-900 font-bold rounded-lg hover:bg-gray-100 transition-colors text-sm"
										>
											Apply Now
										</button>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>

			<AnimatePresence>
				{isEditModalOpen && (
					<EditProfileModal
						user={user}
						onClose={() => setIsEditModalOpen(false)}
						onSave={handleSaveProfile}
					/>
				)}
			</AnimatePresence>
		</>
	);
};

export default Profile;
