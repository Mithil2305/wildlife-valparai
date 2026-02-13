import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthInstance, getUserDoc, getDoc } from "../services/firebase.js";
import { createPhotoAudioPost } from "../services/uploadPost.js";
import { uploadMediaToR2 } from "../services/r2Upload.js";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import CloudflareTurnstile from "../components/CloudflareTurnstile.jsx";
import { verifyCaptcha } from "../services/workerApi.js";
import { FaCloudUploadAlt, FaImage, FaMusic, FaTimes } from "react-icons/fa";

const UploadContent = () => {
	const [photoFile, setPhotoFile] = useState(null);
	const [audioFile, setAudioFile] = useState(null);
	const [title, setTitle] = useState("");
	const [photoPreview, setPhotoPreview] = useState(null);
	const [uploading, setUploading] = useState(false);
	const [userData, setUserData] = useState(null);
	const [captchaToken, setCaptchaToken] = useState("");
	const navigate = useNavigate();
	const auth = getAuthInstance();
	const currentUser = auth?.currentUser;

	// Fetch user data from Firestore to get actual username and profile photo
	useEffect(() => {
		const fetchUserData = async () => {
			if (currentUser) {
				try {
					const userRef = await getUserDoc(currentUser.uid);
					const userSnap = await getDoc(userRef);
					if (userSnap.exists()) {
						setUserData(userSnap.data());
					}
				} catch (error) {
					console.error("Error fetching user data:", error);
				}
			}
		};
		fetchUserData();
	}, [currentUser]);

	const handlePhotoChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			if (!file.type.startsWith("image/")) {
				toast.error("Please select a valid image file");
				return;
			}
			if (file.size > 10 * 1024 * 1024) {
				toast.error("Image size should be less than 10MB");
				return;
			}
			setPhotoFile(file);
			setPhotoPreview(URL.createObjectURL(file));
		}
	};

	const handleAudioChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			if (!file.type.startsWith("audio/")) {
				toast.error("Please select a valid audio file");
				return;
			}
			if (file.size > 20 * 1024 * 1024) {
				toast.error("Audio size should be less than 20MB");
				return;
			}
			setAudioFile(file);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!photoFile || !audioFile) {
			toast.error("Please select both photo and audio files");
			return;
		}

		if (!title.trim()) {
			toast.error("Please enter a title");
			return;
		}

		if (!currentUser) {
			toast.error("You must be logged in to upload content");
			return;
		}

		if (!userData) {
			toast.error("Unable to load user data. Please try again.");
			return;
		}

		if (!captchaToken) {
			toast.error("Please complete the CAPTCHA verification");
			return;
		}

		setUploading(true);

		try {
			// Verify CAPTCHA server-side before upload
			await verifyCaptcha(captchaToken);

			// First, upload files to R2 to get URLs
			const { photoUrl, audioUrl } = await uploadMediaToR2(
				photoFile,
				audioFile,
				currentUser.uid,
			);

			// Then create the post with the URLs (use Firestore username, not Auth displayName)
			await createPhotoAudioPost({
				creatorId: currentUser.uid,
				creatorUsername: userData.username || userData.name || "Anonymous",
				creatorProfilePhoto: userData.profilePhotoUrl || null,
				title: title.trim(),
				photoUrl,
				audioUrl,
			});

			toast.success("Content uploaded successfully!");
			navigate("/socials");
		} catch (error) {
			console.error("Upload error:", error);
			toast.error(error.message || "Failed to upload content");
		} finally {
			setUploading(false);
		}
	};

	if (uploading) {
		return (
			<div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
				<LoadingSpinner />
				<p className="mt-4 text-gray-600 font-medium">
					Uploading your content to Cloudflare R2...
				</p>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 py-12 px-4">
			<div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
				<div className="p-8 border-b border-gray-100 bg-gray-50/50">
					<h1 className="text-2xl font-bold text-gray-900">
						Upload Wildlife Moment
					</h1>
					<p className="text-gray-500 mt-1 text-sm">
						Share your photos and nature sounds with the community.
					</p>
				</div>

				<form onSubmit={handleSubmit} className="p-8 space-y-8">
					<div>
						<label className="block text-sm font-semibold text-gray-700 mb-2">
							Caption / Title
						</label>
						<input
							type="text"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder="e.g. Morning calls of the Malabar Whistling Thrush"
							className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#335833] focus:border-transparent outline-none transition-all"
							required
						/>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="space-y-2">
							<label className="block text-sm font-semibold text-gray-700">
								Photo
							</label>
							<div
								className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all h-48 flex flex-col items-center justify-center ${
									photoPreview
										? "border-[#335833] bg-green-50"
										: "border-gray-300 hover:border-gray-400"
								}`}
							>
								{photoPreview ? (
									<div className="relative w-full h-full">
										<img
											src={photoPreview}
											alt="Preview"
											className="w-full h-full object-contain rounded-lg"
										/>
										<button
											type="button"
											onClick={() => {
												setPhotoFile(null);
												setPhotoPreview(null);
											}}
											className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-sm hover:bg-red-600"
										>
											<FaTimes size={12} />
										</button>
									</div>
								) : (
									<label className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
										<FaImage className="w-8 h-8 text-gray-400 mb-2" />
										<span className="text-sm text-gray-600 font-medium">
											Click to upload image
										</span>
										<span className="text-xs text-gray-400 mt-1">
											JPG, PNG up to 10MB
										</span>
										<input
											type="file"
											accept="image/*"
											onChange={handlePhotoChange}
											className="hidden"
										/>
									</label>
								)}
							</div>
						</div>

						<div className="space-y-2">
							<label className="block text-sm font-semibold text-gray-700">
								Audio
							</label>
							<div
								className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all h-48 flex flex-col items-center justify-center ${
									audioFile
										? "border-[#335833] bg-green-50"
										: "border-gray-300 hover:border-gray-400"
								}`}
							>
								{audioFile ? (
									<div className="w-full">
										<FaMusic className="w-8 h-8 text-[#335833] mx-auto mb-2" />
										<p className="text-sm text-gray-800 font-medium truncate px-2">
											{audioFile.name}
										</p>
										<button
											type="button"
											onClick={() => setAudioFile(null)}
											className="text-red-500 text-xs font-medium mt-2 hover:text-red-600"
										>
											Remove
										</button>
									</div>
								) : (
									<label className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
										<FaMusic className="w-8 h-8 text-gray-400 mb-2" />
										<span className="text-sm text-gray-600 font-medium">
											Click to upload audio
										</span>
										<span className="text-xs text-gray-400 mt-1">
											MP3, WAV up to 20MB
										</span>
										<input
											type="file"
											accept="audio/*"
											onChange={handleAudioChange}
											className="hidden"
										/>
									</label>
								)}
							</div>
						</div>
					</div>

					<CloudflareTurnstile
						onVerify={setCaptchaToken}
						theme="light"
						className="flex justify-center"
					/>

					<div className="flex gap-4 pt-4">
						<button
							type="button"
							onClick={() => navigate("/socials")}
							className="flex-1 px-6 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={uploading || !captchaToken}
							className="flex-1 bg-[#335833] text-white py-3 rounded-xl font-semibold hover:bg-[#2a4a2a] transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
						>
							<FaCloudUploadAlt size={20} />
							Upload Post
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default UploadContent;
