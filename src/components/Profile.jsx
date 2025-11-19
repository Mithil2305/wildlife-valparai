import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
	auth,
	userDoc,
	getDoc,
	onAuthStateChanged,
} from "../services/firebase.js";
import { uploadSingleFile } from "../services/r2Upload.js";
import { updateUserProfile } from "../services/authApi.js";
import LoadingSpinner from "./LoadingSpinner.jsx";
import {
	FaCamera,
	FaEdit,
	FaTimes,
	FaUserShield,
	FaChartLine,
	FaSignOutAlt,
} from "react-icons/fa";
import { signOut } from "../services/authApi.js";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

// Edit Profile Modal
const EditProfileModal = ({ user, onClose, onSave }) => {
	const [name, setName] = useState(user.name);
	const [bio, setBio] = useState(user.bio || "");
	const [phone, setPhone] = useState(user.phone || "");
	const [profileImageFile, setProfileImageFile] = useState(null);
	const [imagePreview, setImagePreview] = useState(user.profilePhotoUrl);
	const [isUploading, setIsUploading] = useState(false);
	const fileInputRef = useRef(null);

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			// Validate file size (max 5MB)
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

			// Upload new profile photo if selected
			if (profileImageFile) {
				console.log("Uploading profile photo to R2...");
				newPhotoUrl = await uploadSingleFile(
					profileImageFile,
					auth.currentUser.uid,
					"profile"
				);
				console.log("Profile photo uploaded:", newPhotoUrl);
			}

			// Update user profile in Firestore
			const updatedData = {
				name: name.trim(),
				bio: bio.trim(),
				phone: phone.trim(),
				profilePhotoUrl: newPhotoUrl,
			};
			await updateUserProfile(auth.currentUser.uid, updatedData);

			// Update parent state
			onSave(updatedData);
			toast.dismiss(loadingToast);
			toast.success("Profile updated successfully!");
			onClose();
		} catch (error) {
			console.error("Error saving profile:", error);
			toast.dismiss(loadingToast);
			toast.error("Failed to update profile: " + error.message);
		} finally {
			setIsUploading(false);
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
			onClick={onClose}
		>
			<motion.div
				initial={{ scale: 0.9, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				exit={{ scale: 0.9, opacity: 0 }}
				className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
					<button
						onClick={onClose}
						className="text-gray-400 hover:text-gray-600 transition-colors"
					>
						<FaTimes size={24} />
					</button>
				</div>

				<form onSubmit={handleSave}>
					{/* Profile Picture Upload */}
					<div className="flex flex-col items-center mb-6">
						<div className="relative">
							<img
								src={
									imagePreview ||
									`https://ui-avatars.com/api/?name=${encodeURIComponent(
										user.name
									)}&size=128&background=335833&color=fff`
								}
								alt="Profile Preview"
								className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 shadow-lg"
							/>
							<button
								type="button"
								onClick={() => fileInputRef.current.click()}
								className="absolute -bottom-2 -right-2 w-12 h-12 bg-[#335833] text-white rounded-full flex items-center justify-center border-4 border-white shadow-lg hover:bg-[#2a4729] transition-colors"
								title="Change profile picture"
							>
								<FaCamera size={18} />
							</button>
						</div>
						<input
							type="file"
							ref={fileInputRef}
							onChange={handleImageChange}
							accept="image/png, image/jpeg, image/jpg, image/webp"
							className="hidden"
						/>
						<p className="text-xs text-gray-500 mt-3">
							Click camera icon to upload new photo (max 5MB)
						</p>
					</div>

					{/* Name Field */}
					<div className="mb-4">
						<label
							htmlFor="name"
							className="block text-sm font-semibold text-gray-700 mb-2"
						>
							Full Name *
						</label>
						<input
							type="text"
							id="name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#335833] focus:border-transparent transition-all"
							placeholder="Enter your full name"
							required
						/>
					</div>

					{/* Phone Field */}
					<div className="mb-4">
						<label
							htmlFor="phone"
							className="block text-sm font-semibold text-gray-700 mb-2"
						>
							Phone Number
						</label>
						<input
							type="tel"
							id="phone"
							value={phone}
							onChange={(e) => setPhone(e.target.value)}
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#335833] focus:border-transparent transition-all"
							placeholder="Enter your phone number"
						/>
					</div>

					{/* Bio Field */}
					<div className="mb-6">
						<label
							htmlFor="bio"
							className="block text-sm font-semibold text-gray-700 mb-2"
						>
							Bio
						</label>
						<textarea
							id="bio"
							value={bio}
							onChange={(e) => setBio(e.target.value)}
							rows={4}
							maxLength={500}
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#335833] focus:border-transparent transition-all resize-none"
							placeholder="Tell us about yourself (max 500 characters)"
						/>
						<p className="text-xs text-gray-500 mt-1 text-right">
							{bio.length}/500 characters
						</p>
					</div>

					{/* Action Buttons */}
					<div className="flex gap-3">
						<button
							type="button"
							onClick={onClose}
							disabled={isUploading}
							className="flex-1 py-3 px-6 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={isUploading}
							className="flex-1 py-3 px-6 bg-[#335833] text-white font-semibold rounded-lg hover:bg-[#2a4729] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
						>
							{isUploading ? "Saving..." : "Save Changes"}
						</button>
					</div>
				</form>
			</motion.div>
		</motion.div>
	);
};

// Main Profile Component
const Profile = () => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
			if (currentUser) {
				setLoading(true);
				try {
					const userRef = userDoc(currentUser.uid);
					const userSnap = await getDoc(userRef);

					if (userSnap.exists()) {
						setUser(userSnap.data());
					} else {
						toast.error("Could not find user profile.");
						navigate("/");
						return;
					}
				} catch (error) {
					console.error("Error fetching profile data:", error);
					toast.error("Failed to load profile data.");
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

	if (loading) {
		return <LoadingSpinner />;
	}

	if (!user) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<h2 className="text-2xl font-bold text-gray-900 mb-2">
						No User Found
					</h2>
					<p className="text-gray-600 mb-4">
						Please log in to view your profile.
					</p>
					<Link
						to="/login"
						className="text-[#335833] hover:underline font-semibold"
					>
						Go to Login
					</Link>
				</div>
			</div>
		);
	}

	return (
		<>
			<div className="bg-linear-to-br from-gray-50 to-green-50/20 min-h-screen py-12 px-4">
				<div className="container mx-auto max-w-4xl">
					{/* Profile Header Card */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden mb-6"
					>
						{/* Cover/Header Section */}
						<div className="bg-linear-to-r from-[#335833] to-[#4a7d4a] h-32" />

						{/* Profile Content */}
						<div className="px-8 pb-8">
							<div className="flex flex-col md:flex-row items-center md:items-start -mt-16 mb-6">
								{/* Profile Picture */}
								<img
									src={
										user.profilePhotoUrl ||
										`https://ui-avatars.com/api/?name=${encodeURIComponent(
											user.name
										)}&size=128&background=335833&color=fff`
									}
									alt="Profile"
									className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl"
								/>

								{/* User Info */}
								<div className="md:ml-6 mt-4 md:mt-16 text-center md:text-left flex-1">
									<h1 className="text-3xl font-bold text-gray-900">
										{user.name}
									</h1>
									<p className="text-gray-600 text-lg">@{user.username}</p>
									<div className="flex items-center justify-center md:justify-start gap-2 mt-2">
										<span
											className={`px-3 py-1 rounded-full text-xs font-semibold ${
												user.accountType === "creator"
													? "bg-green-100 text-green-800"
													: user.accountType === "admin"
													? "bg-purple-100 text-purple-800"
													: "bg-blue-100 text-blue-800"
											}`}
										>
											{user.accountType === "creator"
												? "Creator"
												: user.accountType === "admin"
												? "Admin"
												: "Viewer"}
										</span>
										{user.points > 0 && (
											<span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
												⭐ {user.points} Points
											</span>
										)}
									</div>
								</div>

								{/* Edit Button */}
								<button
									onClick={() => setIsEditModalOpen(true)}
									className="mt-4 md:mt-16 flex items-center gap-2 px-6 py-3 bg-[#335833] text-white font-semibold rounded-lg hover:bg-[#2a4729] transition-all shadow-lg"
								>
									<FaEdit /> Edit Profile
								</button>
							</div>

							{/* Bio Section */}
							<div className="mb-6">
								<h3 className="text-sm font-semibold text-gray-700 mb-2">
									About
								</h3>
								<p className="text-gray-600 leading-relaxed">
									{user.bio || "This user hasn't written a bio yet."}
								</p>
							</div>

							{/* Contact Info */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
								<div>
									<h3 className="text-sm font-semibold text-gray-700 mb-1">
										Email
									</h3>
									<p className="text-gray-600">{user.email}</p>
								</div>
								{user.phone && (
									<div>
										<h3 className="text-sm font-semibold text-gray-700 mb-1">
											Phone
										</h3>
										<p className="text-gray-600">{user.phone}</p>
									</div>
								)}
							</div>

							{/* Dashboard Links */}
							<div className="border-t border-gray-200 pt-6">
								<h3 className="text-sm font-semibold text-gray-700 mb-4">
									Quick Actions
								</h3>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
									{/* Creator Dashboard Link */}
									{user.accountType === "creator" && (
										<Link
											to="/dashboard/creator"
											className="flex items-center gap-3 px-6 py-4 bg-linear-to-r from-green-50 to-green-100 border border-green-200 rounded-lg hover:shadow-md transition-all group"
										>
											<div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
												<FaChartLine className="text-white text-xl" />
											</div>
											<div>
												<p className="font-semibold text-gray-900">
													Creator Dashboard
												</p>
												<p className="text-xs text-gray-600">
													Manage your content & stats
												</p>
											</div>
										</Link>
									)}

									{/* Admin Dashboard Link */}
									{user.accountType === "admin" && (
										<Link
											to="/dashboard/admin"
											className="flex items-center gap-3 px-6 py-4 bg-linear-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-lg hover:shadow-md transition-all group"
										>
											<div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
												<FaUserShield className="text-white text-xl" />
											</div>
											<div>
												<p className="font-semibold text-gray-900">
													Admin Dashboard
												</p>
												<p className="text-xs text-gray-600">
													Manage users & platform
												</p>
											</div>
										</Link>
									)}

									{/* Sign Out Button */}
									<button
										onClick={handleSignOut}
										className="flex items-center gap-3 px-6 py-4 bg-linear-to-r from-red-50 to-red-100 border border-red-200 rounded-lg hover:shadow-md transition-all group"
									>
										<div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
											<FaSignOutAlt className="text-white text-xl" />
										</div>
										<div className="text-left">
											<p className="font-semibold text-gray-900">Sign Out</p>
											<p className="text-xs text-gray-600">
												Log out from your account
											</p>
										</div>
									</button>
								</div>
							</div>
						</div>
					</motion.div>

					{/* Viewer CTA */}
					{user.accountType === "viewer" && (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.2 }}
							className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 text-center"
						>
							<h2 className="text-2xl font-bold text-gray-900 mb-3">
								Become a Creator
							</h2>
							<p className="text-gray-600 mb-6 max-w-2xl mx-auto">
								Share your wildlife experiences, earn points, and climb the
								leaderboard. Start creating content today!
							</p>
							<button
								onClick={() =>
									toast.info("Creator application feature coming soon!")
								}
								className="px-8 py-3 bg-[#335833] text-white font-semibold rounded-lg hover:bg-[#2a4729] transition-all shadow-lg"
							>
								Apply to Become a Creator
							</button>
						</motion.div>
					)}
				</div>
			</div>

			{/* Edit Profile Modal */}
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
