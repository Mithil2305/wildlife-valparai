import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
	auth,
	userDoc,
	getDoc,
	onAuthStateChanged,
} from "../services/firebase.js";
import { getCreatorPosts, deleteBlogPost } from "../services/uploadPost.js";
import { uploadSingleFile } from "../services/r2Upload.js"; // ✅ NEW IMPORT
import { updateUserProfile } from "../services/authApi.js";
import LoadingSpinner from "./LoadingSpinner.jsx";
import {
	FaCamera,
	FaEdit,
	FaFileAlt,
	FaHeart,
	FaComment,
	FaTimes,
	FaUpload,
	FaPlus,
	FaTrash,
	FaEye,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

// --- Animation Variants ---
const gridContainerVariants = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
		},
	},
};

const gridItemVariants = {
	hidden: { opacity: 0, y: 20 },
	show: { opacity: 1, y: 0 },
};

const listContainerVariants = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: {
			staggerChildren: 0.05,
		},
	},
};

const listItemVariants = {
	hidden: { opacity: 0, x: -20 },
	show: { opacity: 1, x: 0 },
};

// --- Sub-Components ---

// Stat Box Component
const StatBox = ({ icon, title, value, color, variants }) => (
	<motion.div
		variants={variants}
		className={`bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex flex-col justify-between`}
	>
		<div
			className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}
		>
			{icon}
		</div>
		<div>
			<p className="text-gray-500 text-sm font-medium">{title}</p>
			<p className="text-3xl font-bold text-gray-900">{value}</p>
		</div>
	</motion.div>
);

// Edit Profile Modal
const EditProfileModal = ({ user, onClose, onSave }) => {
	const [name, setName] = useState(user.name);
	const [bio, setBio] = useState(user.bio || "");
	const [profileImageFile, setProfileImageFile] = useState(null);
	const [imagePreview, setImagePreview] = useState(user.profilePhotoUrl);
	const [isUploading, setIsUploading] = useState(false);
	const fileInputRef = useRef(null);

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setProfileImageFile(file);
			setImagePreview(URL.createObjectURL(file));
		}
	};

	const handleSave = async (e) => {
		e.preventDefault();
		setIsUploading(true);
		toast.loading("Saving profile...");

		try {
			let newPhotoUrl = user.profilePhotoUrl;

			// ✅ UPDATED: Use new R2 upload method
			if (profileImageFile) {
				console.log("Uploading profile photo to R2...");
				newPhotoUrl = await uploadSingleFile(
					profileImageFile,
					auth.currentUser.uid,
					"profile"
				);
				console.log("Profile photo uploaded:", newPhotoUrl);
			}

			// Step 2: Update the user document in Firestore
			const updatedData = {
				name: name,
				bio: bio,
				profilePhotoUrl: newPhotoUrl,
			};
			await updateUserProfile(auth.currentUser.uid, updatedData);

			// Step 3: Update parent state and close modal
			onSave(updatedData);
			toast.dismiss();
			toast.success("Profile updated successfully!");
			onClose();
		} catch (error) {
			console.error("Error saving profile:", error);
			toast.dismiss();
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
				initial={{ y: -50, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				exit={{ y: -50, opacity: 0 }}
				className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-xl font-bold text-gray-900">Edit Profile</h2>
					<button
						onClick={onClose}
						className="text-gray-400 hover:text-gray-600"
					>
						<FaTimes size={20} />
					</button>
				</div>
				<form onSubmit={handleSave}>
					{/* Profile Picture Upload */}
					<div className="flex flex-col items-center mb-6">
						<div className="relative">
							<img
								src={
									imagePreview ||
									`https://placehold.co/128x128/335833/FFF?text=${user.name
										.charAt(0)
										.toUpperCase()}`
								}
								alt="Profile Preview"
								className="w-32 h-32 rounded-full object-cover border-4 border-gray-100"
							/>
							<button
								type="button"
								onClick={() => fileInputRef.current.click()}
								className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#335833] text-white rounded-full flex items-center justify-center border-2 border-white shadow-md hover:bg-opacity-90"
								title="Change profile picture"
							>
								<FaCamera />
							</button>
						</div>
						<input
							type="file"
							ref={fileInputRef}
							onChange={handleImageChange}
							accept="image/png, image/jpeg, image/jpg, image/webp"
							className="hidden"
						/>
						<p className="text-xs text-gray-500 mt-2">
							Click camera to upload new photo
						</p>
					</div>

					{/* Name Field */}
					<div className="mb-4">
						<label
							htmlFor="name"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Name
						</label>
						<input
							type="text"
							id="name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#335833]"
						/>
					</div>

					{/* Bio Field */}
					<div className="mb-6">
						<label
							htmlFor="bio"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Bio
						</label>
						<textarea
							id="bio"
							value={bio}
							onChange={(e) => setBio(e.target.value)}
							rows={4}
							className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#335833]"
							placeholder="Tell everyone a little about yourself"
						/>
					</div>

					{/* Action Buttons */}
					<div className="flex justify-end space-x-3">
						<button
							type="button"
							onClick={onClose}
							disabled={isUploading}
							className="py-2 px-5 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-all disabled:opacity-50"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={isUploading}
							className="py-2 px-5 bg-[#335833] text-white font-semibold rounded-lg hover:bg-opacity-90 transition-all disabled:opacity-50"
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
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const navigate = useNavigate();

	// Fetch user data and posts on load
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
			if (currentUser) {
				setLoading(true);
				try {
					// 1. Fetch user profile
					const userRef = userDoc(currentUser.uid);
					const userSnap = await getDoc(userRef);

					if (userSnap.exists()) {
						const userData = userSnap.data();
						setUser(userData);

						// 2. If user is a creator, fetch their posts
						if (userData.accountType === "creator") {
							const creatorPosts = await getCreatorPosts(currentUser.uid);
							setPosts(creatorPosts);
						}
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

	// Calculate stats (only if creator)
	const totalPosts = posts.length;
	const totalLikes = posts.reduce(
		(sum, post) => sum + (post.likeCount || 0),
		0
	);
	const totalComments = posts.reduce(
		(sum, post) => sum + (post.commentCount || 0),
		0
	);

	// Handle saving from the modal
	const handleSaveProfile = (updatedData) => {
		setUser({ ...user, ...updatedData });
	};

	// Handle Post Deletion
	const handleDelete = async (postId) => {
		if (window.confirm("Are you sure you want to delete this post?")) {
			const deletePromise = deleteBlogPost(postId);
			toast.promise(deletePromise, {
				loading: "Deleting post...",
				success: () => {
					setPosts(posts.filter((post) => post.id !== postId));
					return <b>Post deleted!</b>;
				},
				error: <b>Could not delete post.</b>,
			});
		}
	};

	if (loading) {
		return <LoadingSpinner />;
	}

	if (!user) {
		return (
			<div className="text-center p-10">
				<h2 className="text-2xl font-bold">No User Found</h2>
				<p>Please log in to view your profile.</p>
				<Link to="/login" className="text-[#335833] hover:underline mt-4 block">
					Go to Login
				</Link>
			</div>
		);
	}

	return (
		<>
			<div className="bg-gray-50 min-h-screen p-4 md:p-8">
				<div className="container mx-auto max-w-5xl">
					{/* --- Profile Header --- */}
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 mb-8"
					>
						<div className="flex flex-col md:flex-row items-center md:items-start">
							<img
								src={
									user.profilePhotoUrl ||
									`https://placehold.co/128x128/335833/FFF?text=${user.name
										.charAt(0)
										.toUpperCase()}`
								}
								alt="Profile"
								className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
							/>
							<div className="md:ml-6 mt-4 md:mt-0 text-center md:text-left">
								<h1 className="text-3xl font-bold text-gray-900">
									{user.name}
								</h1>
								<p className="text-gray-500 text-lg">@{user.username}</p>
								<p className="text-gray-700 mt-2 max-w-xl">
									{user.bio || "This user hasn't written a bio yet."}
								</p>
							</div>
							<button
								onClick={() => setIsEditModalOpen(true)}
								className="mt-4 md:mt-0 md:ml-auto flex items-center py-2 px-4 bg-white border border-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-100 transition-all shadow-sm"
							>
								<FaEdit className="mr-2" /> Edit Profile
							</button>
						</div>
					</motion.div>

					{/* --- CONDITIONAL DASHBOARD FOR CREATORS --- */}
					{user.accountType === "creator" && (
						<motion.div
							variants={gridContainerVariants}
							initial="hidden"
							animate="show"
						>
							{/* --- Stats Grid --- */}
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
								<StatBox
									variants={gridItemVariants}
									icon={<FaFileAlt className="w-5 h-5 text-white" />}
									title="Total Posts"
									value={totalPosts}
									color="bg-blue-500"
								/>
								<StatBox
									variants={gridItemVariants}
									icon={<FaHeart className="w-5 h-5 text-white" />}
									title="Total Likes"
									value={totalLikes}
									color="bg-red-500"
								/>
								<StatBox
									variants={gridItemVariants}
									icon={<FaComment className="w-5 h-5 text-white" />}
									title="Total Comments"
									value={totalComments}
									color="bg-green-500"
								/>
								<StatBox
									variants={gridItemVariants}
									icon={<FaUpload className="w-5 h-5 text-white" />}
									title="Points"
									value={user.points || 0}
									color="bg-purple-500"
								/>
							</div>

							{/* --- Create Post & Manage Posts Grid --- */}
							<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
								{/* Create New Post */}
								<motion.div
									variants={gridItemVariants}
									className="lg:col-span-1"
								>
									<div className="bg-gradient-to-br from-[#335833] to-[#4a7d4a] text-white p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center text-center h-full">
										<h2 className="text-2xl font-bold mb-4">
											Ready to post again?
										</h2>
										<p className="text-gray-200 mb-6">
											Create a new blog or social post.
										</p>
										<div className="flex flex-col space-y-3 w-full">
											<Link
												to="/upload/blog"
												className="flex items-center justify-center bg-white text-[#335833] font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-gray-100 transition-all"
											>
												<FaFileAlt className="mr-2" /> New Blog Post
											</Link>
											<Link
												to="/upload/content"
												className="flex items-center justify-center bg-white text-black font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-gray-100 transition-all"
											>
												<FaPlus className="mr-2" /> New Social Post
											</Link>
										</div>
									</div>
								</motion.div>

								{/* Post Management List */}
								<motion.div
									variants={gridItemVariants}
									className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
								>
									<h2 className="text-xl font-bold text-gray-900 mb-4">
										Manage Your Posts
									</h2>
									<motion.div
										className="space-y-4 max-h-[600px] overflow-y-auto"
										variants={listContainerVariants}
										initial="hidden"
										animate="show"
									>
										{posts.length > 0 ? (
											posts.map((post) => (
												<motion.div
													key={post.id}
													variants={listItemVariants}
													className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-lg border border-gray-200 bg-gray-50"
												>
													<div>
														<span
															className={`text-xs font-semibold px-2 py-0.5 rounded ${
																post.type === "blog"
																	? "bg-blue-100 text-blue-800"
																	: "bg-green-100 text-green-800"
															}`}
														>
															{post.type === "blog" ? "Blog" : "Social"}
														</span>
														<h3 className="text-lg font-semibold text-gray-800 mt-1">
															{post.title || "Untitled Post"}
														</h3>
														<p className="text-sm text-gray-500">
															{new Date(
																post.createdAt?.toDate()
															).toLocaleDateString()}
														</p>
													</div>
													<div className="flex space-x-2 mt-4 md:mt-0 flex-shrink-0">
														<button
															onClick={() => navigate(`/blog/${post.id}`)}
															className="p-2 text-sm text-gray-600 bg-white border rounded-lg hover:bg-gray-100 transition-colors"
															title="View Post"
														>
															<FaEye />
														</button>
														<button
															onClick={() => navigate(`/blog/edit/${post.id}`)}
															className="p-2 text-sm text-blue-600 bg-white border rounded-lg hover:bg-gray-100 transition-colors"
															title="Edit Post"
														>
															<FaEdit />
														</button>
														<button
															onClick={() => handleDelete(post.id)}
															className="p-2 text-sm text-red-600 bg-white border rounded-lg hover:bg-gray-100 transition-colors"
															title="Delete Post"
														>
															<FaTrash />
														</button>
													</div>
												</motion.div>
											))
										) : (
											<p className="text-gray-500 text-center py-8">
												You haven't created any posts yet.
											</p>
										)}
									</motion.div>
								</motion.div>
							</div>
						</motion.div>
					)}

					{/* --- CONDITIONAL PANEL FOR VIEWERS --- */}
					{user.accountType === "viewer" && (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.2 }}
							className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center"
						>
							<h2 className="text-2xl font-bold text-gray-900 mb-3">
								You are a Viewer
							</h2>
							<p className="text-gray-600 mb-6 max-w-lg mx-auto">
								Want to share your own wildlife photos, audio, and stories?
								Become a creator to start posting and earning points.
							</p>
							<button
								onClick={() =>
									toast.error("Creator application not yet implemented.")
								}
								className="py-3 px-6 bg-[#335833] text-white font-semibold rounded-lg hover:bg-opacity-90 transition-all shadow-md"
							>
								Become a Creator
							</button>
						</motion.div>
					)}
				</div>
			</div>

			{/* --- Edit Profile Modal --- */}
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
