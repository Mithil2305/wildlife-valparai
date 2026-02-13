import React, { useEffect, useRef, useCallback } from "react";

/**
 * Cloudflare Turnstile CAPTCHA component.
 *
 * Props:
 * - onVerify(token)  — called when user passes the challenge
 * - onExpire()       — called when the token expires (optional)
 * - onError(error)   — called on widget error (optional)
 * - theme            — "light" | "dark" | "auto" (default "auto")
 * - size             — "normal" | "compact" (default "normal")
 * - className        — additional wrapper class names
 *
 * The SITE KEY is read from VITE_TURNSTILE_SITE_KEY env variable.
 */
const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || "";

const CloudflareTurnstile = ({
	onVerify,
	onExpire,
	onError,
	theme = "auto",
	size = "normal",
	className = "",
}) => {
	const containerRef = useRef(null);
	const widgetIdRef = useRef(null);

	const handleVerify = useCallback(
		(token) => {
			onVerify?.(token);
		},
		[onVerify],
	);

	const handleExpire = useCallback(() => {
		onVerify?.(""); // Clear the token
		onExpire?.();
	}, [onVerify, onExpire]);

	const handleError = useCallback(
		(error) => {
			onVerify?.(""); // Clear the token on error
			onError?.(error);
		},
		[onVerify, onError],
	);

	useEffect(() => {
		if (!SITE_KEY) {
			console.warn(
				"Cloudflare Turnstile: VITE_TURNSTILE_SITE_KEY is not set. CAPTCHA will be skipped.",
			);
			// Auto-pass in dev if no site key configured
			onVerify?.("dev-bypass");
			return;
		}

		// Wait for the Turnstile script to load
		const renderWidget = () => {
			if (
				!containerRef.current ||
				!window.turnstile ||
				widgetIdRef.current !== null
			)
				return;

			widgetIdRef.current = window.turnstile.render(containerRef.current, {
				sitekey: SITE_KEY,
				theme,
				size,
				callback: handleVerify,
				"expired-callback": handleExpire,
				"error-callback": handleError,
			});
		};

		// If turnstile is already loaded, render immediately
		if (window.turnstile) {
			renderWidget();
		} else {
			// Otherwise wait for script to load
			const interval = setInterval(() => {
				if (window.turnstile) {
					clearInterval(interval);
					renderWidget();
				}
			}, 200);

			// Cleanup interval
			return () => clearInterval(interval);
		}

		return () => {
			// Cleanup widget on unmount
			if (widgetIdRef.current !== null && window.turnstile) {
				try {
					window.turnstile.remove(widgetIdRef.current);
				} catch {
					// Widget may already be removed
				}
				widgetIdRef.current = null;
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [theme, size, handleVerify, handleExpire, handleError]);

	// Reset helper — prefixed with _ to satisfy lint (available for external use)
	const _resetWidget = useCallback(() => {
		if (widgetIdRef.current !== null && window.turnstile) {
			window.turnstile.reset(widgetIdRef.current);
		}
	}, []);

	if (!SITE_KEY) {
		return null; // Don't render anything if no site key (dev mode)
	}

	return (
		<div className={`cf-turnstile-wrapper ${className}`} ref={containerRef} />
	);
};

export default CloudflareTurnstile;
