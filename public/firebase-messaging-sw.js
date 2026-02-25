/* global importScripts, firebase, clients */

/**
 * Firebase Messaging Service Worker
 *
 * This file MUST live at the root of the public directory so
 * the browser can register it at scope "/".
 *
 * Firebase config is injected dynamically from the main app
 * or can be set here as env-safe defaults (public keys only).
 */

importScripts(
	"https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js",
	"https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js",
);

// The config here only needs the public fields required for messaging.
// The actual values should match your project. These will be
// overridden at runtime if you use `messagingSenderId` from the app init.
// For safety we use self.__FIREBASE_CONFIG injected by the main thread,
// but fall back to an empty object (FCM will still work if the main
// app already initialized messaging with the correct config).
const firebaseConfig = self.__FIREBASE_CONFIG || {
	// Minimal config – only messagingSenderId + projectId needed for SW
	apiKey: "PLACEHOLDER",
	projectId: "PLACEHOLDER",
	messagingSenderId: "PLACEHOLDER",
	appId: "PLACEHOLDER",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

/**
 * Handle background (push) notifications when the page is not in focus.
 */
messaging.onBackgroundMessage((payload) => {
	const { title, body, icon } = payload.notification || {};
	const deepLink = payload.data?.deepLink || "/";

	const options = {
		body: body || "You have a new update from Wildlife Valparai",
		icon: icon || "/assets/logo-192.png",
		badge: "/assets/logo-72.png",
		tag: payload.collapseKey || "wv-notification",
		data: { deepLink },
		actions: [{ action: "open", title: "View" }],
	};

	self.registration.showNotification(title || "Wildlife Valparai", options);
});

/**
 * Handle notification click – open the deep link.
 */
self.addEventListener("notificationclick", (event) => {
	event.notification.close();

	const deepLink = event.notification.data?.deepLink || "/";

	event.waitUntil(
		clients
			.matchAll({ type: "window", includeUncontrolled: true })
			.then((clientList) => {
				// Focus existing tab if available
				for (const client of clientList) {
					if (client.url.includes(self.location.origin) && "focus" in client) {
						client.navigate(deepLink);
						return client.focus();
					}
				}
				// Otherwise open a new window
				return clients.openWindow(deepLink);
			}),
	);
});
