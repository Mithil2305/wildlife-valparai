// Google Adsense integration
export const loadGoogleAds = () => {
	if (typeof window !== "undefined") {
		const script = document.createElement("script");
		script.src =
			"https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
		script.async = true;
		script.setAttribute(
			"data-ad-client",
			import.meta.env.VITE_GOOGLE_ADS_CLIENT_ID
		);
		document.head.appendChild(script);
	}
};

export const showAd = (adSlotId, adFormat = "auto", adLayout = null) => {
	if (typeof window !== "undefined" && window.adsbygoogle) {
		try {
			const adConfig = {
				google_ad_client: import.meta.env.VITE_GOOGLE_ADS_CLIENT_ID,
				enable_page_level_ads: false,
			};

			// Apply ad format specific configurations
			switch (adFormat) {
				case "banner":
					adConfig.google_ad_slot = adSlotId;
					adConfig.google_ad_width = 728;
					adConfig.google_ad_height = 90;
					adConfig.google_ad_format = "728x90_as";
					break;

				case "rectangle":
					adConfig.google_ad_slot = adSlotId;
					adConfig.google_ad_width = 300;
					adConfig.google_ad_height = 250;
					adConfig.google_ad_format = "300x250_as";
					break;

				case "vertical":
					adConfig.google_ad_slot = adSlotId;
					adConfig.google_ad_width = 160;
					adConfig.google_ad_height = 600;
					adConfig.google_ad_format = "160x600_as";
					break;

				case "mobile":
					adConfig.google_ad_slot = adSlotId;
					adConfig.google_ad_width = 320;
					adConfig.google_ad_height = 50;
					adConfig.google_ad_format = "320x50_as";
					break;

				case "in-article":
					adConfig.google_ad_slot = adSlotId;
					adConfig.google_ad_format = "fluid";
					adConfig.google_ad_layout = adLayout || "in-article";
					break;

				case "in-feed":
					adConfig.google_ad_slot = adSlotId;
					adConfig.google_ad_format = "fluid";
					adConfig.google_ad_layout = adLayout || "in-feed";
					adConfig.google_ad_layout_key = "-fb+5w+2e-db+86";
					break;

				case "auto":
				default:
					adConfig.google_ad_slot = adSlotId;
					adConfig.google_ad_format = "auto";
					adConfig.google_full_width_responsive = true;
					break;
			}

			(window.adsbygoogle = window.adsbygoogle || []).push(adConfig);
			return { success: true, format: adFormat, layout: adLayout };
		} catch (error) {
			console.error("Error showing ad:", error);
			return { success: false, error: error.message };
		}
	}
	return { success: false, error: "Google Ads not loaded" };
};

// Initialize ad slots with specific formats
export const initializeAdSlots = () => {
	const adSlots = [
		{ id: "header-ad", format: "banner", layout: null },
		{ id: "sidebar-ad", format: "vertical", layout: null },
		{ id: "content-ad", format: "rectangle", layout: null },
		{ id: "mobile-ad", format: "mobile", layout: null },
		{ id: "article-ad", format: "in-article", layout: "in-article" },
		{ id: "feed-ad", format: "in-feed", layout: "in-feed" },
	];

	adSlots.forEach((slot) => {
		setTimeout(() => {
			showAd(slot.id, slot.format, slot.layout);
		}, 1000);
	});
};

// Sponsored ads management with format support
export const getSponsoredAds = async (
	placement = "sidebar",
	adFormat = "banner"
) => {
	// In a real implementation, this would fetch from your database
	// For now, return mock data with format-specific ads

	const mockAds = {
		sidebar: {
			banner: [
				{
					id: 1,
					title: "Wildlife Photography Gear",
					description:
						"Get the best cameras and lenses for wildlife photography",
					image: "/assets/images/ads/camera-gear-banner.jpg",
					url: "https://example.com/gear",
					sponsor: "CameraPro",
					format: "banner",
					width: 728,
					height: 90,
				},
			],
			vertical: [
				{
					id: 2,
					title: "Eco Tourism Packages",
					description: "Explore Valparai with our guided eco tours",
					image: "/assets/images/ads/eco-tour-vertical.jpg",
					url: "https://example.com/tours",
					sponsor: "EcoValparai",
					format: "vertical",
					width: 160,
					height: 600,
				},
			],
			rectangle: [
				{
					id: 3,
					title: "Bird Watching Equipment",
					description: "High-quality binoculars and spotting scopes",
					image: "/assets/images/ads/binoculars-rectangle.jpg",
					url: "https://example.com/binoculars",
					sponsor: "NatureGear",
					format: "rectangle",
					width: 300,
					height: 250,
				},
			],
		},
		header: {
			banner: [
				{
					id: 4,
					title: "Conservation Fund",
					description: "Support wildlife conservation efforts in Valparai",
					image: "/assets/images/ads/conservation-banner.jpg",
					url: "https://example.com/donate",
					sponsor: "Wildlife Trust",
					format: "banner",
					width: 728,
					height: 90,
				},
			],
			mobile: [
				{
					id: 5,
					title: "Wildlife App",
					description: "Download our wildlife spotting app",
					image: "/assets/images/ads/app-mobile.jpg",
					url: "https://example.com/app",
					sponsor: "WildlifeApps",
					format: "mobile",
					width: 320,
					height: 50,
				},
			],
		},
		content: {
			"in-article": [
				{
					id: 6,
					title: "Photography Workshop",
					description: "Learn wildlife photography from experts",
					image: "/assets/images/ads/workshop-article.jpg",
					url: "https://example.com/workshop",
					sponsor: "PhotoMasters",
					format: "in-article",
					width: "fluid",
					height: "auto",
				},
			],
			"in-feed": [
				{
					id: 7,
					title: "Wildlife Books",
					description: "Discover amazing wildlife photography books",
					image: "/assets/images/ads/books-feed.jpg",
					url: "https://example.com/books",
					sponsor: "NatureBooks",
					format: "in-feed",
					width: "fluid",
					height: "auto",
				},
			],
		},
	};

	const placementAds = mockAds[placement];
	const formatAds = placementAds ? placementAds[adFormat] : [];

	return {
		success: true,
		data: formatAds || [],
		placement,
		format: adFormat,
	};
};

// Get optimized ad for specific device and placement
export const getOptimizedAd = async (placement, deviceType = "desktop") => {
	let adFormat = "banner";

	switch (deviceType) {
		case "mobile":
			adFormat = placement === "header" ? "mobile" : "rectangle";
			break;
		case "tablet":
			adFormat = "rectangle";
			break;
		case "desktop":
			adFormat = placement === "sidebar" ? "vertical" : "banner";
			break;
		default:
			adFormat = "auto";
	}

	return getSponsoredAds(placement, adFormat);
};

// Render ad with specific format and styling
export const renderAd = (adData, containerId) => {
	const container = document.getElementById(containerId);
	if (!container || !adData) return;

	const adElement = document.createElement("div");
	adElement.className = `sponsored-ad ad-format-${adData.format}`;
	adElement.innerHTML = `
    <a href="${adData.url}" target="_blank" rel="noopener sponsored" class="ad-link">
      <img src="${adData.image}" alt="${adData.title}" 
           width="${adData.width}" height="${adData.height}"
           class="ad-image">
      <div class="ad-content">
        <h4 class="ad-title">${adData.title}</h4>
        <p class="ad-description">${adData.description}</p>
        <span class="ad-sponsor">Sponsored by ${adData.sponsor}</span>
      </div>
    </a>
  `;

	container.appendChild(adElement);
	trackAdImpression(adData.id);
};

export const trackAdClick = async (
	adId,
	userId = null,
	adFormat = "unknown"
) => {
	try {
		// Record ad click in your analytics with format information
		console.log(`Ad ${adId} (format: ${adFormat}) clicked by user ${userId}`);

		// In a real implementation, send to analytics service
		const analyticsData = {
			adId,
			userId,
			adFormat,
			timestamp: new Date().toISOString(),
			type: "click",
		};

		// Example: Send to your analytics endpoint
		// await fetch('/api/analytics/ad-click', {
		//   method: 'POST',
		//   body: JSON.stringify(analyticsData)
		// });

		return { success: true, data: analyticsData };
	} catch (error) {
		return { success: false, error: error.message };
	}
};

export const trackAdImpression = async (
	adId,
	userId = null,
	adFormat = "unknown"
) => {
	try {
		// Record ad impression in your analytics with format information
		console.log(
			`Ad ${adId} (format: ${adFormat}) impression by user ${userId}`
		);

		const analyticsData = {
			adId,
			userId,
			adFormat,
			timestamp: new Date().toISOString(),
			type: "impression",
		};

		// Example: Send to your analytics endpoint
		// await fetch('/api/analytics/ad-impression', {
		//   method: 'POST',
		//   body: JSON.stringify(analyticsData)
		// });

		return { success: true, data: analyticsData };
	} catch (error) {
		return { success: false, error: error.message };
	}
};

// Get ad performance metrics by format
export const getAdPerformanceByFormat = async (timeRange = "7d") => {
	// Mock performance data by format
	const performanceData = {
		banner: {
			impressions: 15000,
			clicks: 45,
			ctr: 0.003,
			revenue: 25.5,
		},
		rectangle: {
			impressions: 12000,
			clicks: 60,
			ctr: 0.005,
			revenue: 32.75,
		},
		vertical: {
			impressions: 8000,
			clicks: 32,
			ctr: 0.004,
			revenue: 18.2,
		},
		mobile: {
			impressions: 20000,
			clicks: 80,
			ctr: 0.004,
			revenue: 45.0,
		},
		"in-article": {
			impressions: 5000,
			clicks: 25,
			ctr: 0.005,
			revenue: 15.75,
		},
		"in-feed": {
			impressions: 7000,
			clicks: 35,
			ctr: 0.005,
			revenue: 21.3,
		},
	};

	return { success: true, data: performanceData, timeRange };
};
