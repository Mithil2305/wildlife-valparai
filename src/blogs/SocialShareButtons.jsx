import React from "react";
import {
	FaWhatsapp,
	FaPinterestP,
	FaFacebookF,
	FaTwitter,
} from "react-icons/fa";

// A helper component for each share button
const ShareButton = ({ icon, href, colorClass }) => (
	<a
		href={href}
		target="_blank"
		rel="noopener noreferrer"
		className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${colorClass} transition-opacity hover:opacity-80`}
	>
		{icon}
	</a>
);

const SocialShareButtons = ({ url, title }) => {
	const encodedUrl = encodeURIComponent(url);
	const encodedTitle = encodeURIComponent(title);

	return (
		<div className="flex items-center space-x-3 my-6">
			<ShareButton
				icon={<FaWhatsapp size={20} />}
				href={`https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`}
				colorClass="bg-green-500"
			/>
			<ShareButton
				icon={<FaPinterestP size={20} />}
				href={`https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedTitle}`}
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
