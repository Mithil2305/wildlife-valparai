/**
 * Custom React Hooks for performance optimization
 * Provides debouncing, throttling, and caching utilities
 */

import { useState, useEffect, useRef, useCallback, useMemo } from "react";

/**
 * Debounce hook - delays execution until after wait milliseconds
 * @param {any} value - Value to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {any} - Debounced value
 */
export const useDebounce = (value, delay = 300) => {
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => clearTimeout(timer);
	}, [value, delay]);

	return debouncedValue;
};

/**
 * Debounced callback hook
 * @param {Function} callback - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} - Debounced function
 */
export const useDebouncedCallback = (callback, delay = 300) => {
	const timeoutRef = useRef(null);

	const debouncedCallback = useCallback(
		(...args) => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
			timeoutRef.current = setTimeout(() => {
				callback(...args);
			}, delay);
		},
		[callback, delay],
	);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	return debouncedCallback;
};

/**
 * Throttle hook - limits execution to once per wait milliseconds
 * @param {Function} callback - Function to throttle
 * @param {number} delay - Minimum time between executions
 * @returns {Function} - Throttled function
 */
export const useThrottledCallback = (callback, delay = 300) => {
	const lastRan = useRef(Date.now());
	const timeoutRef = useRef(null);

	const throttledCallback = useCallback(
		(...args) => {
			const now = Date.now();

			if (now - lastRan.current >= delay) {
				callback(...args);
				lastRan.current = now;
			} else {
				// Schedule for later if not executed
				if (timeoutRef.current) {
					clearTimeout(timeoutRef.current);
				}
				timeoutRef.current = setTimeout(
					() => {
						callback(...args);
						lastRan.current = Date.now();
					},
					delay - (now - lastRan.current),
				);
			}
		},
		[callback, delay],
	);

	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	return throttledCallback;
};

/**
 * Cached async data hook with automatic refresh
 * @param {Function} fetchFn - Async function to fetch data
 * @param {Array} deps - Dependencies array
 * @param {Object} options - Configuration options
 * @returns {Object} - { data, loading, error, refetch }
 */
export const useCachedData = (fetchFn, deps = [], options = {}) => {
	const {
		cacheTime = 60000, // 1 minute default
		staleTime = 30000, // 30 seconds before considered stale
		enabled = true,
	} = options;

	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const cacheRef = useRef({ data: null, timestamp: 0 });

	const isCacheValid = useCallback(() => {
		const now = Date.now();
		return (
			cacheRef.current.data !== null &&
			now - cacheRef.current.timestamp < cacheTime
		);
	}, [cacheTime]);

	const isCacheStale = useCallback(() => {
		const now = Date.now();
		return now - cacheRef.current.timestamp > staleTime;
	}, [staleTime]);

	const fetchData = useCallback(
		async (force = false) => {
			if (!enabled) return;

			// Return cached data immediately if valid and not forced
			if (!force && isCacheValid()) {
				setData(cacheRef.current.data);
				setLoading(false);

				// Refetch in background if stale
				if (isCacheStale()) {
					try {
						const freshData = await fetchFn();
						cacheRef.current = { data: freshData, timestamp: Date.now() };
						setData(freshData);
					} catch (err) {
						console.error("Background refresh failed:", err);
					}
				}
				return;
			}

			setLoading(true);
			setError(null);

			try {
				const freshData = await fetchFn();
				cacheRef.current = { data: freshData, timestamp: Date.now() };
				setData(freshData);
			} catch (err) {
				setError(err);
				// Use stale cache if available
				if (cacheRef.current.data) {
					setData(cacheRef.current.data);
				}
			} finally {
				setLoading(false);
			}
		},
		[fetchFn, enabled, isCacheValid, isCacheStale],
	);

	// Initial fetch and refetch on deps change
	useEffect(() => {
		fetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fetchData, ...deps]);

	const refetch = useCallback(() => fetchData(true), [fetchData]);

	return useMemo(
		() => ({ data, loading, error, refetch }),
		[data, loading, error, refetch],
	);
};

/**
 * Previous value hook - returns the previous value of a state
 * @param {any} value - Current value
 * @returns {any} - Previous value
 */
export const usePrevious = (value) => {
	const ref = useRef();
	useEffect(() => {
		ref.current = value;
	}, [value]);
	return ref.current;
};

/**
 * Intersection observer hook for lazy loading
 * @param {Object} options - IntersectionObserver options
 * @returns {Array} - [ref, isIntersecting]
 */
export const useIntersectionObserver = (options = {}) => {
	const [isIntersecting, setIsIntersecting] = useState(false);
	const targetRef = useRef(null);

	useEffect(() => {
		const target = targetRef.current;
		if (!target) return;

		const observer = new IntersectionObserver(([entry]) => {
			setIsIntersecting(entry.isIntersecting);
		}, options);

		observer.observe(target);

		return () => observer.disconnect();
	}, [options]);

	return [targetRef, isIntersecting];
};

/**
 * Retry mechanism for failed async operations
 * @param {Function} fn - Async function to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} delay - Delay between retries in ms
 * @returns {Promise} - Result of successful execution
 */
export const retryAsync = async (fn, maxRetries = 3, delay = 1000) => {
	let lastError;

	for (let attempt = 1; attempt <= maxRetries; attempt++) {
		try {
			return await fn();
		} catch (error) {
			lastError = error;
			console.warn(`Attempt ${attempt}/${maxRetries} failed:`, error.message);

			if (attempt < maxRetries) {
				// Exponential backoff
				await new Promise((resolve) => setTimeout(resolve, delay * attempt));
			}
		}
	}

	throw lastError;
};
