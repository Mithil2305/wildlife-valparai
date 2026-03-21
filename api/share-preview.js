const FALLBACK_TITLE = "Wildlife Valparai";
const FALLBACK_DESCRIPTION =
	"Explore wildlife stories and posts on Wildlife Valparai.";

const toSingleValue = (value) =>
	Array.isArray(value) ? (value[0] ?? "") : (value ?? "");

const escapeHtml = (value = "") =>
	String(value)
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");

const sanitizeHttpUrl = (candidate, fallback) => {
	try {
		const parsed = new URL(candidate);
		if (parsed.protocol === "http:" || parsed.protocol === "https:") {
			return parsed.toString();
		}
	} catch {
		// Ignore malformed URLs and use fallback.
	}
	return fallback;
};

export default function handler(req, res) {
	const host = req.headers.host || "wildlifevalparai.com";
	const protocol =
		(req.headers["x-forwarded-proto"] || "https").split(",")[0].trim() ||
		"https";
	const baseUrl = `${protocol}://${host}`;

	const queryUrl = toSingleValue(req.query.url);
	const queryTitle = toSingleValue(req.query.title);
	const queryImage = toSingleValue(req.query.image);
	const queryDescription = toSingleValue(req.query.description);

	const destinationUrl = sanitizeHttpUrl(queryUrl, `${baseUrl}/`);
	const imageUrl = sanitizeHttpUrl(queryImage, `${baseUrl}/assets/fav.png`);
	const title = (queryTitle || FALLBACK_TITLE).slice(0, 160);
	const description = (queryDescription || FALLBACK_DESCRIPTION).slice(0, 300);

	const escapedDestination = escapeHtml(destinationUrl);
	const escapedImage = escapeHtml(imageUrl);
	const escapedTitle = escapeHtml(title);
	const escapedDescription = escapeHtml(description);

	const html = `<!doctype html>
<html lang="en">
<head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title>${escapedTitle}</title>
	<meta name="description" content="${escapedDescription}" />

	<meta property="og:type" content="article" />
	<meta property="og:site_name" content="Wildlife Valparai" />
	<meta property="og:title" content="${escapedTitle}" />
	<meta property="og:description" content="${escapedDescription}" />
	<meta property="og:image" content="${escapedImage}" />
	<meta property="og:url" content="${escapedDestination}" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="${escapedTitle}" />
	<meta name="twitter:description" content="${escapedDescription}" />
	<meta name="twitter:image" content="${escapedImage}" />

	<link rel="canonical" href="${escapedDestination}" />
	<meta http-equiv="refresh" content="0;url=${escapedDestination}" />
	<style>
		body { font-family: Arial, sans-serif; padding: 2rem; color: #1f2937; }
		a { color: #2563eb; }
	</style>
</head>
<body>
	<p>Redirecting to the post...</p>
	<p><a href="${escapedDestination}">Open the post</a></p>
	<script>window.location.replace(${JSON.stringify(destinationUrl)});</script>
</body>
</html>`;

	res.setHeader("Content-Type", "text/html; charset=utf-8");
	res.setHeader("Cache-Control", "public, max-age=120, s-maxage=600");
	res.status(200).send(html);
}
