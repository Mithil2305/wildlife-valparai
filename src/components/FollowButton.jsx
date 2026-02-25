import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthInstance } from "../services/firebase.js";
import {
	followCreator,
	unfollowCreator,
	subscribeFollowStatus,
	logAnalyticsEvent,
} from "../services/followApi.js";
import toast from "react-hot-toast";

/**
 * FollowButton – Instagram-style Follow / Following toggle.
 *
 * Props:
 *   creatorId   – UID of the creator to follow
 *   creatorName – display name (used in toast / confirmation)
 *   size        – "sm" | "md" | "lg" (default "md")
 *   className   – additional Tailwind classes
 */
const FollowButton = ({
	creatorId,
	creatorName = "this creator",
	size = "md",
	className = "",
}) => {
	const [isFollowing, setIsFollowing] = useState(false);
	const [loading, setLoading] = useState(false);
	const [initialLoad, setInitialLoad] = useState(true);
	const navigate = useNavigate();
	const auth = getAuthInstance();
	const currentUser = auth?.currentUser;

	const isSelf = currentUser?.uid === creatorId;

	// Real-time follow status subscription
	useEffect(() => {
		let unsub = () => {};

		const setup = async () => {
			if (!currentUser || !creatorId || isSelf) {
				setInitialLoad(false);
				return;
			}
			try {
				unsub = await subscribeFollowStatus(
					creatorId,
					currentUser.uid,
					(status) => {
						setIsFollowing(status);
						setInitialLoad(false);
					},
				);
			} catch {
				setInitialLoad(false);
			}
		};

		setup();
		return () => unsub();
	}, [creatorId, currentUser, isSelf]);

	// ── FOLLOW ─────────────────────────────────────────────────
	const handleFollow = useCallback(async () => {
		if (!currentUser) {
			toast.error("Please log in to follow creators");
			navigate("/login");
			return;
		}

		// Optimistic update
		setIsFollowing(true);
		setLoading(true);

		try {
			await followCreator(creatorId);
			toast.success(`Following ${creatorName}`, {
				icon: "✅",
				duration: 2000,
			});
			logAnalyticsEvent("follow", { creatorId, creatorName });
		} catch (err) {
			// Revert on error
			setIsFollowing(false);
			if (err.message === "Already following this creator") {
				// Silently ignore race condition
			} else {
				console.error("Follow error:", err);
				toast.error("Could not follow. Please try again.");
			}
		} finally {
			setLoading(false);
		}
	}, [creatorId, creatorName, currentUser, navigate]);

	// ── UNFOLLOW ───────────────────────────────────────────────
	const handleUnfollow = useCallback(() => {
		// Lightweight confirmation
		toast(
			(t) => (
				<div className="flex items-center gap-3">
					<span className="text-sm font-medium text-gray-800">
						Unfollow <strong>{creatorName}</strong>?
					</span>
					<button
						onClick={async () => {
							toast.dismiss(t.id);
							setIsFollowing(false);
							setLoading(true);
							try {
								await unfollowCreator(creatorId);
								toast.success(`Unfollowed ${creatorName}`, {
									duration: 2000,
								});
								logAnalyticsEvent("unfollow", { creatorId, creatorName });
							} catch (err) {
								setIsFollowing(true);
								console.error("Unfollow error:", err);
								toast.error("Could not unfollow.");
							} finally {
								setLoading(false);
							}
						}}
						className="px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-lg hover:bg-red-600 transition-colors min-h-9"
					>
						Yes
					</button>
					<button
						onClick={() => toast.dismiss(t.id)}
						className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-200 transition-colors min-h-9"
					>
						Cancel
					</button>
				</div>
			),
			{ duration: 6000, position: "top-center" },
		);
	}, [creatorId, creatorName]);

	// Don't render if viewing own profile
	if (isSelf) return null;

	// ── SIZE VARIANTS ──────────────────────────────────────────
	const sizeClasses = {
		sm: "px-3 py-1 text-xs min-h-[32px] min-w-[80px]",
		md: "px-4 py-2 text-sm min-h-[44px] min-w-[100px]",
		lg: "px-6 py-2.5 text-base min-h-[48px] min-w-[120px]",
	};

	const baseClasses = `
    inline-flex items-center justify-center gap-1.5 font-bold rounded-full
    transition-all duration-200 select-none touch-manipulation
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    active:scale-95
  `;

	if (initialLoad) {
		return (
			<div
				className={`${sizeClasses[size]} ${baseClasses} bg-gray-100 text-gray-400 animate-pulse rounded-full ${className}`}
			>
				&nbsp;
			</div>
		);
	}

	if (isFollowing) {
		return (
			<button
				onClick={handleUnfollow}
				disabled={loading}
				className={`
          ${baseClasses} ${sizeClasses[size]}
          bg-gray-100 text-gray-700 border border-gray-200
          hover:bg-red-50 hover:text-red-600 hover:border-red-200
          focus:ring-gray-300
          group
          ${className}
        `}
				aria-label={`Unfollow ${creatorName}`}
			>
				<span className="group-hover:hidden">Following</span>
				<span className="hidden group-hover:inline">Unfollow</span>
			</button>
		);
	}

	return (
		<button
			onClick={handleFollow}
			disabled={loading}
			className={`
        ${baseClasses} ${sizeClasses[size]}
        bg-[#335833] text-white
        hover:bg-[#2a4a2a] hover:shadow-md
        focus:ring-[#335833]/50
        ${className}
      `}
			aria-label={`Follow ${creatorName}`}
		>
			{loading ? (
				<svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
					<circle
						className="opacity-25"
						cx="12"
						cy="12"
						r="10"
						stroke="currentColor"
						strokeWidth="4"
					/>
					<path
						className="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
					/>
				</svg>
			) : (
				"Follow"
			)}
		</button>
	);
};

export default FollowButton;
