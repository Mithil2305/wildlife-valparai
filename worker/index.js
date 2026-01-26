/**
 * Cloudflare Worker for Wildlife Valparai
 * Handles secure file uploads to R2 storage and secure API operations
 *
 * Security Features:
 * - Rate limiting per IP
 * - Input validation
 * - CORS restrictions
 * - File type validation
 */

// Allowed origins for CORS (add your production domains)
const ALLOWED_ORIGINS = [
	"http://localhost:5173",
	"http://localhost:3000",
	"https://wildlife-valparai.vercel.app",
	"https://wildlifevalparai.com",
	"https://www.wildlifevalparai.com",
];

// Rate limiting configuration (requests per window)
const RATE_LIMITS = {
	upload: { requests: 10, windowSeconds: 60 }, // 10 uploads per minute
	email: { requests: 5, windowSeconds: 300 }, // 5 emails per 5 minutes
	config: { requests: 30, windowSeconds: 60 }, // 30 config requests per minute
	default: { requests: 100, windowSeconds: 60 }, // 100 requests per minute default
};

// Allowed file MIME types
const ALLOWED_MIME_TYPES = {
	photo: ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"],
	audio: [
		"audio/mpeg",
		"audio/wav",
		"audio/ogg",
		"audio/mp4",
		"audio/webm",
		"audio/aac",
	],
	media: [
		"image/jpeg",
		"image/png",
		"image/webp",
		"image/gif",
		"audio/mpeg",
		"audio/wav",
	],
};

export default {
	async fetch(request, env) {
		const url = new URL(request.url);
		const origin = request.headers.get("Origin") || "";

		// Handle CORS preflight
		if (request.method === "OPTIONS") {
			return handleCORS(origin);
		}

		// Get client IP for rate limiting
		const clientIP =
			request.headers.get("CF-Connecting-IP") ||
			request.headers.get("X-Forwarded-For")?.split(",")[0]?.trim() ||
			"unknown";

		// Route: Upload file (rate limited)
		if (url.pathname === "/upload" && request.method === "POST") {
			const rateLimitResult = await checkRateLimit(
				env,
				clientIP,
				"upload",
				RATE_LIMITS.upload,
			);
			if (!rateLimitResult.allowed) {
				return rateLimitResponse(rateLimitResult, origin);
			}
			return handleUpload(request, env, origin);
		}

		// Route: Get Firebase config (rate limited)
		if (url.pathname === "/config/firebase" && request.method === "GET") {
			const rateLimitResult = await checkRateLimit(
				env,
				clientIP,
				"config",
				RATE_LIMITS.config,
			);
			if (!rateLimitResult.allowed) {
				return rateLimitResponse(rateLimitResult, origin);
			}
			return handleFirebaseConfig(env, origin);
		}

		// Route: Send contact email via EmailJS (rate limited)
		if (url.pathname === "/email/contact" && request.method === "POST") {
			const rateLimitResult = await checkRateLimit(
				env,
				clientIP,
				"email",
				RATE_LIMITS.email,
			);
			if (!rateLimitResult.allowed) {
				return rateLimitResponse(rateLimitResult, origin);
			}
			return handleContactEmail(request, env, origin);
		}

		// Route: Send sponsor email via EmailJS (rate limited)
		if (url.pathname === "/email/sponsor" && request.method === "POST") {
			const rateLimitResult = await checkRateLimit(
				env,
				clientIP,
				"email",
				RATE_LIMITS.email,
			);
			if (!rateLimitResult.allowed) {
				return rateLimitResponse(rateLimitResult, origin);
			}
			return handleSponsorEmail(request, env, origin);
		}

		// Route: Health check (minimal rate limiting)
		if (url.pathname === "/health") {
			return new Response(
				JSON.stringify({
					status: "ok",
					timestamp: new Date().toISOString(),
					service: "Wildlife Valparai API Service",
				}),
				{
					headers: corsHeaders(origin, { "Content-Type": "application/json" }),
				},
			);
		}

		return new Response("Not Found", {
			status: 404,
			headers: corsHeaders(origin),
		});
	},
};

/**
 * Check rate limit using Cloudflare KV (if available) or in-memory fallback
 * @param {Object} env - Worker environment
 * @param {string} clientIP - Client IP address
 * @param {string} action - Action being rate limited
 * @param {Object} limit - Rate limit configuration
 * @returns {Promise<{allowed: boolean, remaining: number, reset: number}>}
 */
async function checkRateLimit(env, clientIP, action, limit) {
	const key = `ratelimit:${action}:${clientIP}`;
	const now = Math.floor(Date.now() / 1000);
	const windowStart = now - limit.windowSeconds;

	try {
		// Use KV storage if available
		if (env.RATE_LIMIT_KV) {
			const stored = await env.RATE_LIMIT_KV.get(key, { type: "json" });

			if (!stored || stored.windowStart < windowStart) {
				// New window or expired
				await env.RATE_LIMIT_KV.put(
					key,
					JSON.stringify({
						count: 1,
						windowStart: now,
					}),
					{ expirationTtl: limit.windowSeconds * 2 },
				);

				return {
					allowed: true,
					remaining: limit.requests - 1,
					reset: now + limit.windowSeconds,
				};
			}

			if (stored.count >= limit.requests) {
				return {
					allowed: false,
					remaining: 0,
					reset: stored.windowStart + limit.windowSeconds,
					retryAfter: stored.windowStart + limit.windowSeconds - now,
				};
			}

			// Increment counter
			await env.RATE_LIMIT_KV.put(
				key,
				JSON.stringify({
					count: stored.count + 1,
					windowStart: stored.windowStart,
				}),
				{ expirationTtl: limit.windowSeconds * 2 },
			);

			return {
				allowed: true,
				remaining: limit.requests - stored.count - 1,
				reset: stored.windowStart + limit.windowSeconds,
			};
		}

		// Fallback: Allow all requests if KV not configured (dev mode)
		return {
			allowed: true,
			remaining: limit.requests,
			reset: now + limit.windowSeconds,
		};
	} catch (error) {
		console.error("Rate limit check failed:", error);
		// Allow request on error to prevent service disruption
		return {
			allowed: true,
			remaining: limit.requests,
			reset: now + limit.windowSeconds,
		};
	}
}

/**
 * Generate rate limit exceeded response
 */
function rateLimitResponse(rateLimitResult, origin) {
	return new Response(
		JSON.stringify({
			error: "Too Many Requests",
			message: "Rate limit exceeded. Please try again later.",
			retryAfter: rateLimitResult.retryAfter || 60,
		}),
		{
			status: 429,
			headers: corsHeaders(origin, {
				"Content-Type": "application/json",
				"Retry-After": String(rateLimitResult.retryAfter || 60),
				"X-RateLimit-Remaining": "0",
				"X-RateLimit-Reset": String(rateLimitResult.reset),
			}),
		},
	);
}

/**
 * CORS headers configuration with origin validation
 * @param {string} origin - Request origin
 * @param {Object} additionalHeaders - Extra headers to include
 */
function corsHeaders(origin, additionalHeaders = {}) {
	// Check if origin is allowed
	const allowedOrigin = ALLOWED_ORIGINS.includes(origin)
		? origin
		: ALLOWED_ORIGINS[0];

	return {
		"Access-Control-Allow-Origin": allowedOrigin,
		"Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
		"Access-Control-Allow-Headers": "Content-Type, Authorization",
		"Access-Control-Max-Age": "86400",
		"Access-Control-Allow-Credentials": "true",
		...additionalHeaders,
	};
}

/**
 * Handle CORS preflight requests
 * @param {string} origin - Request origin
 */
function handleCORS(origin) {
	return new Response(null, {
		headers: corsHeaders(origin),
	});
}

/**
 * Sanitize filename to prevent path traversal
 * @param {string} filename - Original filename
 * @returns {string}
 */
function sanitizeFilename(filename) {
	// Remove path components and dangerous characters
	return filename
		.replace(/[/\\]/g, "_") // Replace path separators
		.replace(/\.\./g, "_") // Prevent directory traversal
		.replace(/[^a-zA-Z0-9._-]/g, "_") // Only allow safe characters
		.substring(0, 100); // Limit length
}

/**
 * Validate file MIME type
 * @param {string} mimeType - File MIME type
 * @param {string} fileType - Expected file type (photo/audio)
 * @returns {boolean}
 */
function isValidMimeType(mimeType, fileType) {
	const allowedTypes = ALLOWED_MIME_TYPES[fileType] || ALLOWED_MIME_TYPES.media;
	return allowedTypes.includes(mimeType);
}

/**
 * Handle file upload to R2
 * @param {Request} request - Incoming request
 * @param {Object} env - Worker environment
 * @param {string} origin - Request origin
 */
async function handleUpload(request, env, origin) {
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
				headers: corsHeaders(origin, { "Content-Type": "application/json" }),
			});
		}

		if (!userId) {
			return new Response(JSON.stringify({ error: "User ID required" }), {
				status: 400,
				headers: corsHeaders(origin, { "Content-Type": "application/json" }),
			});
		}

		// Validate userId format (Firebase UIDs are 28 characters, alphanumeric)
		if (!/^[a-zA-Z0-9]{20,40}$/.test(userId)) {
			return new Response(JSON.stringify({ error: "Invalid user ID format" }), {
				status: 400,
				headers: corsHeaders(origin, { "Content-Type": "application/json" }),
			});
		}

		// Validate file type
		if (!["photo", "audio", "media", "profile"].includes(fileType)) {
			return new Response(JSON.stringify({ error: "Invalid file type" }), {
				status: 400,
				headers: corsHeaders(origin, { "Content-Type": "application/json" }),
			});
		}

		// Validate MIME type
		if (!isValidMimeType(file.type, fileType)) {
			return new Response(
				JSON.stringify({
					error: "Invalid file format",
					message: `File type '${file.type}' is not allowed for ${fileType} uploads`,
				}),
				{
					status: 400,
					headers: corsHeaders(origin, { "Content-Type": "application/json" }),
				},
			);
		}

		// Validate file size based on type
		const maxSizes = {
			photo: 15 * 1024 * 1024, // 15MB for photos
			audio: 25 * 1024 * 1024, // 25MB for audio
			profile: 5 * 1024 * 1024, // 5MB for profile photos
			media: 50 * 1024 * 1024, // 50MB generic
		};
		const maxSize = maxSizes[fileType] || maxSizes.media;

		if (file.size > maxSize) {
			return new Response(
				JSON.stringify({
					error: `File too large. Maximum size is ${Math.round(maxSize / (1024 * 1024))}MB`,
				}),
				{
					status: 400,
					headers: corsHeaders(origin, { "Content-Type": "application/json" }),
				},
			);
		}

		// Generate unique filename with sanitization
		const timestamp = Date.now();
		const randomSuffix = Math.random().toString(36).substring(2, 8);
		const sanitizedFileName = sanitizeFilename(file.name);
		const key = `posts/${fileType}/${userId}/${timestamp}-${randomSuffix}-${sanitizedFileName}`;

		// Upload to R2
		await env.WILDLIFE_BUCKET.put(key, file.stream(), {
			httpMetadata: {
				contentType: file.type,
				cacheControl: "public, max-age=31536000", // Cache for 1 year
			},
		});

		// Generate public URL
		const publicUrl = `${env.PUBLIC_BUCKET_URL}/${key}`;

		// Log successful upload (avoid logging sensitive data)
		console.log(
			`File uploaded: ${fileType} by user ${userId.substring(0, 8)}... (${file.size} bytes)`,
		);

		return new Response(
			JSON.stringify({
				success: true,
				url: publicUrl,
				key: key,
				filename: sanitizedFileName,
				size: file.size,
				type: file.type,
				uploadedAt: new Date().toISOString(),
			}),
			{
				status: 200,
				headers: corsHeaders(origin, { "Content-Type": "application/json" }),
			},
		);
	} catch (error) {
		console.error("Upload error:", error.message);
		return new Response(
			JSON.stringify({
				error: "Upload failed",
				message:
					"An error occurred while processing your upload. Please try again.",
			}),
			{
				status: 500,
				headers: corsHeaders(origin, { "Content-Type": "application/json" }),
			},
		);
	}
}

/**
 * Handle Firebase config request
 * Returns Firebase configuration stored in worker environment
 * @param {Object} env - Worker environment
 * @param {string} origin - Request origin
 */
function handleFirebaseConfig(env, origin) {
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
			headers: corsHeaders(origin, {
				"Content-Type": "application/json",
				"Cache-Control": "public, max-age=3600", // Cache for 1 hour
			}),
		});
	} catch (error) {
		console.error("Config error:", error.message);
		return new Response(JSON.stringify({ error: "Failed to get config" }), {
			status: 500,
			headers: corsHeaders(origin, { "Content-Type": "application/json" }),
		});
	}
}

/**
 * Sanitize and validate email template parameters
 * @param {Object} params - Template parameters
 * @returns {Object} Sanitized parameters
 */
function sanitizeEmailParams(params) {
	if (!params || typeof params !== "object") {
		return {};
	}

	const sanitized = {};
	const allowedFields = [
		"name",
		"email",
		"message",
		"subject",
		"phone",
		"company",
		"budget",
		"type",
	];

	for (const key of allowedFields) {
		if (params[key] !== undefined) {
			// Limit string length and remove dangerous characters
			let value = String(params[key]).substring(0, 1000);
			// Basic XSS prevention
			value = value.replace(/[<>]/g, "");
			sanitized[key] = value;
		}
	}

	return sanitized;
}

/**
 * Handle contact email via EmailJS API
 * @param {Request} request - Incoming request
 * @param {Object} env - Worker environment
 * @param {string} origin - Request origin
 */
async function handleContactEmail(request, env, origin) {
	try {
		const body = await request.json();

		// Validate and sanitize input
		if (!body.templateParams) {
			return new Response(
				JSON.stringify({ error: "Missing template parameters" }),
				{
					status: 400,
					headers: corsHeaders(origin, { "Content-Type": "application/json" }),
				},
			);
		}

		const sanitizedParams = sanitizeEmailParams(body.templateParams);

		// Validate required fields
		if (!sanitizedParams.email || !sanitizedParams.message) {
			return new Response(
				JSON.stringify({ error: "Email and message are required" }),
				{
					status: 400,
					headers: corsHeaders(origin, { "Content-Type": "application/json" }),
				},
			);
		}

		const emailPayload = {
			service_id: env.EMAILJS_SERVICE_ID,
			template_id: env.EMAILJS_TEMPLATE_ID,
			user_id: env.EMAILJS_PUBLIC_KEY,
			template_params: sanitizedParams,
		};

		const response = await fetch(
			"https://api.emailjs.com/api/v1.0/email/send",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(emailPayload),
			},
		);

		if (!response.ok) {
			throw new Error(`EmailJS error: ${response.status}`);
		}

		return new Response(
			JSON.stringify({ success: true, message: "Email sent successfully" }),
			{
				status: 200,
				headers: corsHeaders(origin, { "Content-Type": "application/json" }),
			},
		);
	} catch (error) {
		console.error("Contact email error:", error.message);
		return new Response(JSON.stringify({ error: "Failed to send email" }), {
			status: 500,
			headers: corsHeaders(origin, { "Content-Type": "application/json" }),
		});
	}
}

/**
 * Handle sponsor email via EmailJS API
 * @param {Request} request - Incoming request
 * @param {Object} env - Worker environment
 * @param {string} origin - Request origin
 */
async function handleSponsorEmail(request, env, origin) {
	try {
		const body = await request.json();

		// Validate and sanitize input
		if (!body.templateParams) {
			return new Response(
				JSON.stringify({ error: "Missing template parameters" }),
				{
					status: 400,
					headers: corsHeaders(origin, { "Content-Type": "application/json" }),
				},
			);
		}

		const sanitizedParams = sanitizeEmailParams(body.templateParams);

		const emailPayload = {
			service_id: env.SPONSOR_SERVICE_ID,
			template_id: env.SPONSOR_TEMPLATE_ID,
			user_id: env.SPONSOR_PUBLIC_KEY,
			template_params: sanitizedParams,
		};

		const response = await fetch(
			"https://api.emailjs.com/api/v1.0/email/send",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(emailPayload),
			},
		);

		if (!response.ok) {
			throw new Error(`EmailJS error: ${response.status}`);
		}

		return new Response(
			JSON.stringify({ success: true, message: "Email sent successfully" }),
			{
				status: 200,
				headers: corsHeaders(origin, { "Content-Type": "application/json" }),
			},
		);
	} catch (error) {
		console.error("Sponsor email error:", error.message);
		return new Response(JSON.stringify({ error: "Failed to send email" }), {
			status: 500,
			headers: corsHeaders(origin, { "Content-Type": "application/json" }),
		});
	}
}
