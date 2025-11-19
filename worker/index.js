/**
 * Cloudflare Worker for Wildlife Valparai Media Uploads
 * Handles secure file uploads to R2 storage
 */

export default {
	async fetch(request, env) {
		// Handle CORS preflight
		if (request.method === "OPTIONS") {
			return handleCORS();
		}

		const url = new URL(request.url);

		// Route: Upload file
		if (url.pathname === "/upload" && request.method === "POST") {
			return handleUpload(request, env);
		}

		// Route: Health check
		if (url.pathname === "/health") {
			return new Response(
				JSON.stringify({
					status: "ok",
					timestamp: new Date().toISOString(),
					service: "Wildlife Valparai Upload Service",
				}),
				{
					headers: corsHeaders({ "Content-Type": "application/json" }),
				}
			);
		}

		return new Response("Not Found", { status: 404 });
	},
};

/**
 * CORS headers configuration
 */
function corsHeaders(additionalHeaders = {}) {
	return {
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
		"Access-Control-Allow-Headers": "Content-Type, Authorization",
		"Access-Control-Max-Age": "86400",
		...additionalHeaders,
	};
}

/**
 * Handle CORS preflight requests
 */
function handleCORS() {
	return new Response(null, {
		headers: corsHeaders(),
	});
}

/**
 * Handle file upload to R2
 */
async function handleUpload(request, env) {
	try {
		// Parse multipart form data
		const formData = await request.formData();
		const file = formData.get("file");
		const userId = formData.get("userId");
		const fileType = formData.get("fileType") || "media";

		// Validate inputs
		if (!file) {
			return new Response(JSON.stringify({ error: "No file provided" }), {
				status: 400,
				headers: corsHeaders({ "Content-Type": "application/json" }),
			});
		}

		if (!userId) {
			return new Response(JSON.stringify({ error: "User ID required" }), {
				status: 400,
				headers: corsHeaders({ "Content-Type": "application/json" }),
			});
		}

		// Validate file size (max 50MB)
		const maxSize = 50 * 1024 * 1024; // 50MB
		if (file.size > maxSize) {
			return new Response(
				JSON.stringify({ error: "File too large. Maximum size is 50MB" }),
				{
					status: 400,
					headers: corsHeaders({ "Content-Type": "application/json" }),
				}
			);
		}

		// Generate unique filename
		const timestamp = Date.now();
		const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
		const key = `posts/${fileType}/${userId}/${timestamp}-${sanitizedFileName}`;

		// Upload to R2
		await env.WILDLIFE_BUCKET.put(key, file.stream(), {
			httpMetadata: {
				contentType: file.type,
			},
		});

		// Generate public URL
		const publicUrl = `${env.PUBLIC_BUCKET_URL}/${key}`;

		// Log successful upload
		console.log(`File uploaded: ${key} (${file.size} bytes)`);

		return new Response(
			JSON.stringify({
				success: true,
				url: publicUrl,
				key: key,
				filename: file.name,
				size: file.size,
				type: file.type,
				uploadedAt: new Date().toISOString(),
			}),
			{
				status: 200,
				headers: corsHeaders({ "Content-Type": "application/json" }),
			}
		);
	} catch (error) {
		console.error("Upload error:", error);
		return new Response(
			JSON.stringify({
				error: "Upload failed",
				message: error.message,
			}),
			{
				status: 500,
				headers: corsHeaders({ "Content-Type": "application/json" }),
			}
		);
	}
}
