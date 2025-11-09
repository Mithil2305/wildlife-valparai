// usePoints Hook - Points and badges operations
import { usePointsContext } from "../contexts/PointsContext";

export const usePoints = () => {
	const context = usePointsContext();

	if (!context) {
		throw new Error("usePoints must be used within PointsProvider");
	}

	return {
		points: context.points,
		badges: context.badges,
		currentBadge: context.currentBadge,
		pointsHistory: context.pointsHistory,
		loading: context.loading,
		error: context.error,
		award: context.award,
		awardBonus: context.awardBonus,
		getBadgeInfo: context.getBadgeInfo,
		getNextBadgeInfo: context.getNextBadgeInfo,
		getCurrentBadgeInfo: context.getCurrentBadgeInfo,
		calculatePointsForAction: context.calculatePointsForAction,
		refresh: context.refresh,
	};
};

export default usePoints;
