/**
 * Worker API Service
 * Handles all communication with the Cloudflare Worker for secure operations
 */

// Get worker URL from environment variables
const WORKER_URL = import.meta.env.VITE_WORKER_URL || "http://localhost:8787";

// Cache for Firebase config to avoid repeated requests
let firebaseConfigCache = null;
let configFetchPromise = null;

/**
 * Fetches Firebase configuration from the secure worker
 * @returns {Promise<Object>} Firebase configuration object
 */
export const getFirebaseConfig = async () => {
	// Return cached config if available
	if (firebaseConfigCache) {
		return firebaseConfigCache;
	}

	// If a fetch is already in progress, wait for it
	if (configFetchPromise) {
		return configFetchPromise;
	}

	// Fetch config from worker
	configFetchPromise = (async () => {
		try {
			const response = await fetch(`${WORKER_URL}/config/firebase`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				throw new Error(`Failed to fetch Firebase config: ${response.status}`);
			}

			const config = await response.json();
			firebaseConfigCache = config;
			return config;
		} catch (error) {
			console.error("Error fetching Firebase config:", error);
			// Clear the promise so retry is possible
			configFetchPromise = null;
			throw error;
		}
	})();

	return configFetchPromise;
};

/**
 * Sends a contact form email through the worker
 * @param {Object} templateParams - Email template parameters
 * @returns {Promise<Object>} Response from the worker
 */
export const sendContactEmail = async (templateParams) => {
	try {
		const response = await fetch(`${WORKER_URL}/email/contact`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ templateParams }),
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.message || "Failed to send email");
		}

		return await response.json();
	} catch (error) {
		console.error("Error sending contact email:", error);
		throw error;
	}
};

/**
 * Sends a sponsor form email through the worker
 * @param {Object} templateParams - Email template parameters
 * @returns {Promise<Object>} Response from the worker
 */
export const sendSponsorEmail = async (templateParams) => {
	try {
		const response = await fetch(`${WORKER_URL}/email/sponsor`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ templateParams }),
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.message || "Failed to send email");
		}

		return await response.json();
	} catch (error) {
		console.error("Error sending sponsor email:", error);
		throw error;
	}
};

/**
 * Health check for the worker
 * @returns {Promise<Object>} Health status
 */
export const checkWorkerHealth = async () => {
	try {
		const response = await fetch(`${WORKER_URL}/health`);
		return await response.json();
	} catch (error) {
		console.error("Worker health check failed:", error);
		throw error;
	}
};

/**
 * Verify a Cloudflare Turnstile CAPTCHA token via the worker.
 * @param {string} token - The Turnstile response token from the widget
 * @returns {Promise<{ success: boolean }>}
 */
export const verifyCaptcha = async (token) => {
	// Skip verification in dev when no site key is configured
	if (token === "dev-bypass") {
		return { success: true };
	}

	try {
		const response = await fetch(`${WORKER_URL}/captcha/verify`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ token }),
		});

		const data = await response.json();

		if (!response.ok || !data.success) {
			throw new Error(data.error || "CAPTCHA verification failed");
		}

		return data;
	} catch (error) {
		console.error("CAPTCHA verification error:", error);
		throw error;
	}
};
