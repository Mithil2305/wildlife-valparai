// adsService.js - Advertisement management service
import { trackEvent } from "./analyticsService";

// Ad configuration
const AD_CONFIG = {
	enabled: true,
	minInterval: 30000, // 30 seconds between ads
	adFrequency: {
		homepage: 2, // Show ad every 2 content items
		blogDetail: 1, // Show ad after first paragraph
		gallery: 3, // Show ad every 3 images
	},
};

// Track last ad shown time to prevent ad fatigue
let lastAdShownTime = 0;

// Initialize Google AdSense
export const initializeAds = () => {
	try {
		if (typeof window === "undefined") return false;

		// Check if ads are already loaded
		if (window.adsbygoogle) {
			return true;
		}

		// Load AdSense script
		const script = document.createElement("script");
		script.src =
			"https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
		script.async = true;
		script.crossOrigin = "anonymous";
		script.setAttribute(
			"data-ad-client",
			import.meta.env.VITE_GOOGLE_ADS_CLIENT_ID || ""
		);

		document.head.appendChild(script);

		trackEvent("ads_initialized", {
			timestamp: Date.now(),
		});

		return true;
	} catch (error) {
		console.error("Error initializing ads:", error);
		return false;
	}
};

// Check if ads should be shown based on timing
export const shouldShowAd = () => {
	const now = Date.now();
	const timeSinceLastAd = now - lastAdShownTime;

	if (timeSinceLastAd >= AD_CONFIG.minInterval) {
		lastAdShownTime = now;
		return true;
	}

	return false;
};

// Display ad in a container
export const displayAd = (containerId, adSlot, adFormat = "auto") => {
	try {
		if (!AD_CONFIG.enabled) return false;
		if (!shouldShowAd()) return false;

		const container = document.getElementById(containerId);
		if (!container) {
			console.error(`Ad container ${containerId} not found`);
			return false;
		}

		// Create ad element
		const ins = document.createElement("ins");
		ins.className = "adsbygoogle";
		ins.style.display = "block";
		ins.setAttribute(
			"data-ad-client",
			import.meta.env.VITE_GOOGLE_ADS_CLIENT_ID || ""
		);
		ins.setAttribute("data-ad-slot", adSlot);
		ins.setAttribute("data-ad-format", adFormat);
		ins.setAttribute("data-full-width-responsive", "true");

		container.appendChild(ins);

		// Push ad
		if (window.adsbygoogle) {
			(window.adsbygoogle = window.adsbygoogle || []).push({});
		}

		trackEvent("ad_displayed", {
			containerId,
			adSlot,
			adFormat,
		});

		return true;
	} catch (error) {
		console.error("Error displaying ad:", error);
		return false;
	}
};

// Get ad frequency for page type
export const getAdFrequency = (pageType) => {
	return AD_CONFIG.adFrequency[pageType] || 3;
};

// Calculate ad positions in content
export const calculateAdPositions = (contentLength, pageType) => {
	const frequency = getAdFrequency(pageType);
	const positions = [];

	for (let i = frequency; i < contentLength; i += frequency) {
		positions.push(i);
	}

	return positions;
};

// Banner ad configuration
export const getBannerAdConfig = () => {
	return {
		format: "horizontal",
		slot: import.meta.env.VITE_GOOGLE_ADS_BANNER_SLOT || "",
		style: {
			width: "100%",
			maxWidth: "728px",
			height: "90px",
		},
	};
};

// Sidebar ad configuration
export const getSidebarAdConfig = () => {
	return {
		format: "vertical",
		slot: import.meta.env.VITE_GOOGLE_ADS_SIDEBAR_SLOT || "",
		style: {
			width: "300px",
			height: "600px",
		},
	};
};

// In-feed ad configuration
export const getInFeedAdConfig = () => {
	return {
		format: "fluid",
		slot: import.meta.env.VITE_GOOGLE_ADS_INFEED_SLOT || "",
		layoutKey: "-fb+5w+4e-db+86",
	};
};

// Mobile ad configuration
export const getMobileAdConfig = () => {
	return {
		format: "rectangle",
		slot: import.meta.env.VITE_GOOGLE_ADS_MOBILE_SLOT || "",
		style: {
			width: "320px",
			height: "100px",
		},
	};
};

// Track ad performance
export const trackAdClick = (adSlot, adFormat) => {
	trackEvent("ad_clicked", {
		adSlot,
		adFormat,
		timestamp: Date.now(),
	});
};

// Track ad impression
export const trackAdImpression = (adSlot, adFormat) => {
	trackEvent("ad_impression", {
		adSlot,
		adFormat,
		timestamp: Date.now(),
	});
};

// Check if user has ad blocker
export const detectAdBlocker = () => {
	try {
		const testAd = document.createElement("div");
		testAd.innerHTML = "&nbsp;";
		testAd.className = "adsbox";
		testAd.style.position = "absolute";
		testAd.style.left = "-9999px";

		document.body.appendChild(testAd);

		const isBlocked = testAd.offsetHeight === 0;
		document.body.removeChild(testAd);

		if (isBlocked) {
			trackEvent("ad_blocker_detected", {
				timestamp: Date.now(),
			});
		}

		return isBlocked;
	} catch {
		return false;
	}
};

// Enable/disable ads
export const toggleAds = (enabled) => {
	AD_CONFIG.enabled = enabled;

	trackEvent("ads_toggled", {
		enabled,
		timestamp: Date.now(),
	});
};

// Remove all ads from page
export const removeAllAds = () => {
	const ads = document.querySelectorAll(".adsbygoogle");
	ads.forEach((ad) => ad.remove());

	trackEvent("ads_removed", {
		count: ads.length,
		timestamp: Date.now(),
	});
};

export default {
	initializeAds,
	shouldShowAd,
	displayAd,
	getAdFrequency,
	calculateAdPositions,
	getBannerAdConfig,
	getSidebarAdConfig,
	getInFeedAdConfig,
	getMobileAdConfig,
	trackAdClick,
	trackAdImpression,
	detectAdBlocker,
	toggleAds,
	removeAllAds,
};
