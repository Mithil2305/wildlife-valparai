/**
 * pushNotifications.js
 *
 * Client-side FCM integration:
 *   1. Requests Notification permission
 *   2. Retrieves an FCM token from the service worker
 *   3. Registers the token in Firestore via followApi
 *   4. Handles foreground messages (shows toast)
 */

import { getApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import {
	registerDeviceToken,
	removeDeviceToken,
	logAnalyticsEvent,
} from "./followApi.js";
import toast from "react-hot-toast";

let messagingInstance = null;

/**
 * Lazy-init the FCM Messaging singleton.
 * Returns null if the browser does not support push.
 */
const getMessagingInstance = () => {
	if (messagingInstance) return messagingInstance;

	// Guard: no support for Notification API or service workers
	if (
		typeof window === "undefined" ||
		!("Notification" in window) ||
		!("serviceWorker" in navigator)
	) {
		console.warn("Push notifications are not supported in this browser");
		return null;
	}

	try {
		const app = getApp();
		messagingInstance = getMessaging(app);
		return messagingInstance;
	} catch (err) {
		console.error("Failed to initialize Firebase Messaging:", err);
		return null;
	}
};

/**
 * Request notification permission + register FCM token.
 * Call this after user logs in.
 *
 * @param {string} userId – authenticated user UID
 * @returns {string|null} the FCM token, or null if denied / unsupported
 */
export const requestNotificationPermission = async (userId) => {
	const messaging = getMessagingInstance();
	if (!messaging) return null;

	try {
		const permission = await Notification.requestPermission();
		if (permission !== "granted") {
			console.log("Notification permission denied");
			return null;
		}

		// Register the service worker if not already active
		const swRegistration = await navigator.serviceWorker.register(
			"/firebase-messaging-sw.js",
		);

		const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;

		const token = await getToken(messaging, {
			vapidKey,
			serviceWorkerRegistration: swRegistration,
		});

		if (token) {
			await registerDeviceToken(userId, token, "web");
			console.log("FCM token registered");
			return token;
		}

		return null;
	} catch (err) {
		console.error("Error requesting notification permission:", err);
		return null;
	}
};

/**
 * Unregister the current device token (call on logout).
 */
export const unregisterNotifications = async (userId) => {
	const messaging = getMessagingInstance();
	if (!messaging) return;

	try {
		const swRegistration = await navigator.serviceWorker.getRegistration(
			"/firebase-messaging-sw.js",
		);
		if (!swRegistration) return;

		const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
		const token = await getToken(messaging, {
			vapidKey,
			serviceWorkerRegistration: swRegistration,
		});

		if (token) {
			await removeDeviceToken(userId, token);
		}
	} catch (err) {
		console.error("Error unregistering notifications:", err);
	}
};

/**
 * Listen for foreground messages and show a toast.
 * Returns an unsubscribe function.
 */
export const listenForForegroundMessages = () => {
	const messaging = getMessagingInstance();
	if (!messaging) return () => {};

	return onMessage(messaging, (payload) => {
		const { title, body } = payload.notification || {};
		const deepLink = payload.data?.deepLink;

		toast(
			(t) => (
				<div
					className="flex items-start gap-3 cursor-pointer"
					onClick={() => {
						toast.dismiss(t.id);
						if (deepLink) window.location.href = deepLink;
						logAnalyticsEvent("notification_clicked", {
							source: "foreground_toast",
						});
					}}
				>
					<div className="w-2 h-2 rounded-full bg-[#335833] mt-2 shrink-0" />
					<div>
						<p className="font-bold text-sm text-gray-900">{title}</p>
						{body && <p className="text-xs text-gray-500 mt-0.5">{body}</p>}
					</div>
				</div>
			),
			{ duration: 5000, position: "top-right" },
		);

		logAnalyticsEvent("notification_delivered", {
			title,
			source: "foreground",
		});
	});
};
