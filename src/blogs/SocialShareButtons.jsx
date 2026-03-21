import React from "react";
import toast from "react-hot-toast";
import {
	FaWhatsapp,
	FaPinterestP,
	FaFacebookF,
	FaTwitter,
} from "react-icons/fa";

// A helper component for each share button
const ShareButton = ({ icon, href, colorClass, onClick }) => {
	if (onClick) {
		return (
			<button
				type="button"
				onClick={onClick}
				className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${colorClass} transition-opacity hover:opacity-80`}
			>
				{icon}
			</button>
		);
	}

	return (
		<a
			href={href}
			target="_blank"
			rel="noopener noreferrer"
			className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${colorClass} transition-opacity hover:opacity-80`}
		>
			{icon}
		</a>
	);
};

const fetchImageAsFile = async (imageUrl) => {
	if (!imageUrl) return null;

	const response = await fetch(imageUrl);
	if (!response.ok) {
		throw new Error("Failed to fetch image");
	}

	const blob = await response.blob();
	const fileType = blob.type || "image/jpeg";
	const extension = fileType.split("/")[1] || "jpg";
	return new File([blob], `wildlife-post.${extension}`, { type: fileType });
};

const SocialShareButtons = ({ url, title, image }) => {
	const encodedUrl = encodeURIComponent(url);
	const encodedTitle = encodeURIComponent(title);
	const encodedImage = encodeURIComponent(image || "");

	const handleWhatsAppShare = async () => {
		const shareText = `${title}\n${url}`;

		try {
			if (navigator.share && image && navigator.canShare) {
				const imageFile = await fetchImageAsFile(image);
				if (imageFile && navigator.canShare({ files: [imageFile] })) {
					await navigator.share({
						title,
						text: shareText,
						url,
						files: [imageFile],
					});
					return;
				}
			}
		} catch {
			toast.error("Image file share failed on this device.");
			return;
		}

		toast.error("This device does not support sharing image files to apps.");
	};

	return (
		<div className="flex items-center space-x-3 my-6">
			<ShareButton
				icon={<FaWhatsapp size={20} />}
				onClick={handleWhatsAppShare}
				colorClass="bg-green-500"
			/>
			<ShareButton
				icon={<FaPinterestP size={20} />}
				href={`https://pinterest.com/pin/create/button/?url=${encodedUrl}&media=${encodedImage}&description=${encodedTitle}`}
				colorClass="bg-red-600"
			/>
			<ShareButton
				icon={<FaFacebookF size={20} />}
				href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
				colorClass="bg-blue-600"
			/>
			<ShareButton
				icon={<FaTwitter size={20} />}
				href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
				colorClass="bg-black"
			/>
		</div>
	);
};

export default SocialShareButtons;
