import { jest, describe, it, expect, beforeEach } from "@jest/globals";

// Create mock functions
const mockRunTransaction = jest.fn();
const mockUserDoc = jest.fn(() => ({ id: "USER_REF" }));
const mockPointsHistoryCollection = jest.fn(() => "POINTS_HISTORY_COLLECTION");
const mockDoc = jest.fn(() => ({ id: "POINTS_HISTORY_REF" }));
const mockServerTimestamp = jest.fn(() => "NOW");

// Mock firebase/firestore module
jest.unstable_mockModule("firebase/firestore", () => ({
	runTransaction: mockRunTransaction,
}));

// Mock the firebase service module
jest.unstable_mockModule("../src/services/firebase", () => ({
	db: {},
	getFirebaseDb: jest.fn(() => Promise.resolve({})),
	getUserDoc: mockUserDoc,
	getPointsHistoryCollection: mockPointsHistoryCollection,
	doc: mockDoc,
	serverTimestamp: mockServerTimestamp,
	runTransaction: mockRunTransaction,
}));

// Mock the leaderboard service
jest.unstable_mockModule("../src/services/leaderboard", () => ({
	invalidateLeaderboardCache: jest.fn(),
}));

// Import after mocking
const { applyPoints } = await import("../src/services/points");

describe("applyPoints()", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("applies points and logs history", async () => {
		const tx = {
			get: jest.fn().mockResolvedValue({
				exists: () => true,
				data: () => ({ points: 50 }),
			}),
			update: jest.fn(),
			set: jest.fn(),
		};
		mockRunTransaction.mockImplementation(async (_, cb) => cb(tx));

		await applyPoints("user1", 10, "Liked post", { postId: "p1" });

		expect(tx.get).toHaveBeenCalled();
		expect(tx.update).toHaveBeenCalledWith(
			{ id: "USER_REF" },
			expect.objectContaining({ points: 60 }),
		);
		expect(tx.set).toHaveBeenCalled();
	});

	it("does not apply points if user does not exist", async () => {
		const tx = {
			get: jest.fn().mockResolvedValue({
				exists: () => false,
			}),
			update: jest.fn(),
			set: jest.fn(),
		};
		mockRunTransaction.mockImplementation(async (_, cb) => cb(tx));

		await applyPoints("user1", 10, "Liked post", { postId: "p1" });

		expect(tx.get).toHaveBeenCalled();
		expect(tx.update).not.toHaveBeenCalled();
		expect(tx.set).not.toHaveBeenCalled();
	});
});
