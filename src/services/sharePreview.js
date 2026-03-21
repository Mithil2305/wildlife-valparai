const DEFAULT_SHARE_DESCRIPTION =
	"Explore wildlife stories and posts on Wildlife Valparai.";

const isAbsoluteUrl = (value) => /^https?:\/\//i.test(value || "");

const normalizeUrl = (value, origin) => {
	if (!value) return "";
	if (isAbsoluteUrl(value)) return value;
	if (!origin) return value;
	return value.startsWith("/") ? `${origin}${value}` : `${origin}/${value}`;
};

const toBase64Url = (value) => {
	const bytes = new TextEncoder().encode(value);
	let binary = "";
	for (const byte of bytes) {
		binary += String.fromCharCode(byte);
	}

	return btoa(binary)
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=+$/g, "");
};

export const extractFirstImageFromHtml = (html = "") => {
	if (!html) return "";
	const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
	return match?.[1] || "";
};

export const buildSharePreviewUrl = ({
	canonicalUrl,
	title,
	image,
	description = DEFAULT_SHARE_DESCRIPTION,
}) => {
	if (typeof window === "undefined") return canonicalUrl || "";

	const origin = window.location.origin;
	const finalCanonical = normalizeUrl(canonicalUrl, origin) || `${origin}/`;
	const finalImage = normalizeUrl(image, origin) || `${origin}/assets/fav.png`;
	const payload = {
		url: finalCanonical,
		title: title || "Wildlife Valparai",
		image: finalImage,
		description,
	};
	const token = toBase64Url(JSON.stringify(payload));

	return `${origin}/api/share-preview/${token}`;
};
