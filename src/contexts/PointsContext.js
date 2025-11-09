// Points Context - Manages points and badges state
import { createContext, useContext, useState, useEffect } from "react";
import {
	awardPoints,
	getUserPoints,
	getUserBadges,
	getCurrentBadge,
	awardBonusPoints,
} from "../services/pointsService";
import { useAuthContext } from "./AuthContext";
import {
	calculatePoints,
	getNextBadge,
	getBadgeForPoints,
} from "../utils/pointsCalculator";

const PointsContext = createContext();

export const usePointsContext = () => {
	const context = useContext(PointsContext);
	if (!context) {
		throw new Error("usePointsContext must be used within PointsProvider");
	}
	return context;
};

export const PointsProvider = ({ children }) => {
	const { user } = useAuthContext();
	const [points, setPoints] = useState(0);
	const [badges, setBadges] = useState([]);
	const [currentBadge, setCurrentBadge] = useState(null);
	const [pointsHistory, setPointsHistory] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	// Load user points and badges when user changes
	useEffect(() => {
		const loadData = async () => {
			if (user) {
				await loadUserPoints();
				await loadUserBadges();
			} else {
				// Reset state when user logs out
				setPoints(0);
				setBadges([]);
				setCurrentBadge(null);
				setPointsHistory([]);
			}
		};

		loadData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);

	// Load user points
	const loadUserPoints = async () => {
		if (!user) return;

		try {
			setLoading(true);
			setError(null);
			const result = await getUserPoints(user.uid);

			if (result.success) {
				setPoints(result.data.totalPoints || 0);
				setPointsHistory(result.data.history || []);
			}
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	// Load user badges
	const loadUserBadges = async () => {
		if (!user) return;

		try {
			const result = await getUserBadges(user.uid);

			if (result.success) {
				setBadges(result.badges || []);
				setCurrentBadge(result.currentBadge || "newcomer");
			}
		} catch (err) {
			setError(err.message);
		}
	};

	// Award points to user
	const award = async (action, metadata = {}) => {
		if (!user) return { success: false, error: "User not authenticated" };

		try {
			setError(null);
			const result = await awardPoints(user.uid, action, metadata);

			if (result.success) {
				setPoints(result.newTotalPoints);

				if (result.newBadge) {
					setBadges((prev) => [...prev, result.newBadge.id]);
					setCurrentBadge(result.newBadge.id);
				}

				// Reload history
				await loadUserPoints();

				return result;
			} else {
				setError(result.error);
				return result;
			}
		} catch (err) {
			setError(err.message);
			return { success: false, error: err.message };
		}
	};

	// Award bonus points
	const awardBonus = async (pointsAmount, reason) => {
		if (!user) return { success: false, error: "User not authenticated" };

		try {
			setError(null);
			const result = await awardBonusPoints(user.uid, pointsAmount, reason);

			if (result.success) {
				setPoints((prev) => prev + pointsAmount);
				await loadUserPoints();
				return result;
			} else {
				setError(result.error);
				return result;
			}
		} catch (err) {
			setError(err.message);
			return { success: false, error: err.message };
		}
	};

	// Get current badge info
	const getBadgeInfo = async () => {
		if (!user) return null;

		try {
			const result = await getCurrentBadge(user.uid);
			if (result.success) {
				return result.badge;
			}
			return null;
		} catch {
			return null;
		}
	};

	// Get next badge info
	const getNextBadgeInfo = () => {
		return getNextBadge(points);
	};

	// Get current badge from points
	const getCurrentBadgeInfo = () => {
		return getBadgeForPoints(points);
	};

	// Calculate points for action (preview)
	const calculatePointsForAction = (action) => {
		return calculatePoints(action);
	};

	// Refresh all points data
	const refresh = async () => {
		await loadUserPoints();
		await loadUserBadges();
	};

	const value = {
		points,
		badges,
		currentBadge,
		pointsHistory,
		loading,
		error,
		award,
		awardBonus,
		getBadgeInfo,
		getNextBadgeInfo,
		getCurrentBadgeInfo,
		calculatePointsForAction,
		refresh,
	};

	return (
		<PointsContext.Provider value={value}>{children}</PointsContext.Provider>
	);
};

export default PointsContext;
