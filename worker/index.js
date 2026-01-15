/**
 * Cloudflare Worker for Wildlife Valparai
 * Handles secure file uploads to R2 storage and secure API operations
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

		// Route: Get Firebase config (secure - only returns public-safe config)
		if (url.pathname === "/config/firebase" && request.method === "GET") {
			return handleFirebaseConfig(env);
		}

		// Route: Send contact email via EmailJS
		if (url.pathname === "/email/contact" && request.method === "POST") {
			return handleContactEmail(request, env);
		}

		// Route: Send sponsor email via EmailJS
		if (url.pathname === "/email/sponsor" && request.method === "POST") {
			return handleSponsorEmail(request, env);
		}

		// Route: Health check
		if (url.pathname === "/health") {
			return new Response(
				JSON.stringify({
					status: "ok",
					timestamp: new Date().toISOString(),
					service: "Wildlife Valparai API Service",
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

/**
 * Handle Firebase config request
 * Returns Firebase configuration stored in worker environment
 */
function handleFirebaseConfig(env) {
	try {
		const config = {
			apiKey: env.FIREBASE_API_KEY,
			authDomain: env.FIREBASE_AUTH_DOMAIN,
			projectId: env.FIREBASE_PROJECT_ID,
			storageBucket: env.FIREBASE_STORAGE_BUCKET,
			messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID,
			appId: env.FIREBASE_APP_ID,
			measurementId: env.FIREBASE_MEASUREMENT_ID,
		};

		return new Response(JSON.stringify(config), {
			status: 200,
			headers: corsHeaders({ "Content-Type": "application/json" }),
		});
	} catch (error) {
		console.error("Config error:", error);
		return new Response(JSON.stringify({ error: "Failed to get config" }), {
			status: 500,
			headers: corsHeaders({ "Content-Type": "application/json" }),
		});
	}
}

/**
 * Handle contact email via EmailJS API
 */
async function handleContactEmail(request, env) {
	try {
		const body = await request.json();

		const emailPayload = {
			service_id: env.EMAILJS_SERVICE_ID,
			template_id: env.EMAILJS_TEMPLATE_ID,
			user_id: env.EMAILJS_PUBLIC_KEY,
			template_params: body.templateParams,
		};

		const response = await fetch(
			"https://api.emailjs.com/api/v1.0/email/send",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(emailPayload),
			}
		);

		if (!response.ok) {
			throw new Error(`EmailJS error: ${response.status}`);
		}

		return new Response(
			JSON.stringify({ success: true, message: "Email sent successfully" }),
			{
				status: 200,
				headers: corsHeaders({ "Content-Type": "application/json" }),
			}
		);
	} catch (error) {
		console.error("Contact email error:", error);
		return new Response(
			JSON.stringify({ error: "Failed to send email", message: error.message }),
			{
				status: 500,
				headers: corsHeaders({ "Content-Type": "application/json" }),
			}
		);
	}
}

/**
 * Handle sponsor email via EmailJS API
 */
async function handleSponsorEmail(request, env) {
	try {
		const body = await request.json();

		const emailPayload = {
			service_id: env.SPONSOR_SERVICE_ID,
			template_id: env.SPONSOR_TEMPLATE_ID,
			user_id: env.SPONSOR_PUBLIC_KEY,
			template_params: body.templateParams,
		};

		const response = await fetch(
			"https://api.emailjs.com/api/v1.0/email/send",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(emailPayload),
			}
		);

		if (!response.ok) {
			throw new Error(`EmailJS error: ${response.status}`);
		}

		return new Response(
			JSON.stringify({ success: true, message: "Email sent successfully" }),
			{
				status: 200,
				headers: corsHeaders({ "Content-Type": "application/json" }),
			}
		);
	} catch (error) {
		console.error("Sponsor email error:", error);
		return new Response(
			JSON.stringify({ error: "Failed to send email", message: error.message }),
			{
				status: 500,
				headers: corsHeaders({ "Content-Type": "application/json" }),
			}
		);
	}
}
