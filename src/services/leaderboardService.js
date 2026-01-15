import { getUsersCollection, getDocs, query, where } from "./firebase.js";
import { getCreatorPosts } from "./uploadPost.js";
import { getAllPosts } from "./socialApi.js";

/**
 * Calculate engagement score for leaderboard ranking
 * Formula: (posts * 10) + (likes * 2) + (comments * 3)
 * @param {object} user - User data
 * @param {array} userPosts - User's posts
 * @returns {number} Engagement score
 */
const calculateEngagementScore = (user, userPosts) => {
	const postCount = userPosts.length;
	const totalLikes = userPosts.reduce(
		(sum, post) => sum + (post.likeCount || 0),
		0
	);
	const totalComments = userPosts.reduce(
		(sum, post) => sum + (post.commentCount || 0),
		0
	);

	// Weight: posts are worth 10, likes 2, comments 3
	const score = postCount * 10 + totalLikes * 2 + totalComments * 3;

	return score;
};

/**
 * Fetch and rank all creators by engagement
 * @returns {Promise<Array>} Sorted array of users with rankings
 */
export const calculateLeaderboard = async () => {
	try {
		// 1. Fetch all creators
		const usersCol = await getUsersCollection();
		const creatorsQuery = query(
			usersCol,
			where("accountType", "==", "creator")
		);
		const snapshot = await getDocs(creatorsQuery);

		const creators = [];
		snapshot.forEach((doc) => {
			creators.push({ userId: doc.id, ...doc.data() });
		});

		// 2. Calculate engagement score for each creator
		const rankedCreators = await Promise.all(
			creators.map(async (creator) => {
				const posts = await getCreatorPosts(creator.userId);
				const engagementScore = calculateEngagementScore(creator, posts);

				return {
					...creator,
					posts: posts.length,
					engagementScore,
				};
			})
		);

		// 3. Sort by engagement score (descending)
		rankedCreators.sort((a, b) => b.engagementScore - a.engagementScore);

		return rankedCreators;
	} catch (error) {
		console.error("Error calculating leaderboard:", error);
		return [];
	}
};
