import { jest, describe, it, expect, beforeEach } from "@jest/globals";

// Create mock functions
const mockApplyPoints = jest.fn();
const mockRunTransaction = jest.fn();
const mockGetDoc = jest.fn();
const mockGetDocs = jest.fn(() => ({ docs: [] }));
const mockDoc = jest.fn(() => ({ id: "DOC_REF" }));
const mockSetDoc = jest.fn();
const mockDeleteDoc = jest.fn();
const mockUpdateDoc = jest.fn();
const mockCollection = jest.fn();
const mockQuery = jest.fn();
const mockWhere = jest.fn();
const mockServerTimestamp = jest.fn(() => "NOW");
const mockIncrement = jest.fn((v) => v);

// Mock firebase/firestore module
jest.unstable_mockModule("firebase/firestore", () => ({
	runTransaction: mockRunTransaction,
	doc: mockDoc,
	getDoc: mockGetDoc,
	getDocs: mockGetDocs,
	setDoc: mockSetDoc,
	deleteDoc: mockDeleteDoc,
	updateDoc: mockUpdateDoc,
	collection: mockCollection,
	query: mockQuery,
	where: mockWhere,
	increment: mockIncrement,
	serverTimestamp: mockServerTimestamp,
	collectionGroup: jest.fn(),
}));

// Mock the firebase service module
jest.unstable_mockModule("../src/services/firebase", () => ({
	db: {},
	getFirebaseDb: jest.fn(() => Promise.resolve({})),
	getPostsCollection: jest.fn(() =>
		Promise.resolve({ id: "POSTS_COLLECTION" }),
	),
	getPostDoc: jest.fn((postId) => Promise.resolve({ id: postId })),
	getLikeDoc: jest.fn(() => Promise.resolve({ id: "LIKE_DOC" })),
	serverTimestamp: mockServerTimestamp,
	increment: mockIncrement,
	doc: mockDoc,
	getDoc: mockGetDoc,
	getDocs: mockGetDocs,
	setDoc: mockSetDoc,
	deleteDoc: mockDeleteDoc,
	updateDoc: mockUpdateDoc,
	collection: mockCollection,
	query: mockQuery,
	where: mockWhere,
	runTransaction: mockRunTransaction,
}));

// Mock the points service module
jest.unstable_mockModule("../src/services/points", () => ({
	applyPoints: mockApplyPoints,
}));

// Import after mocking
const { toggleLike, recordShare } = await import("../src/services/socialApi");

describe("socialApi service", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("awards points on like", async () => {
		// Setup runTransaction to properly simulate the transaction callback
		mockRunTransaction.mockImplementation(async (_, cb) => {
			const mockTx = {
				get: jest
					.fn()
					.mockResolvedValueOnce({
						// First call: postSnap - post exists
						exists: () => true,
						data: () => ({ creatorId: "creator1" }),
					})
					.mockResolvedValueOnce({
						// Second call: likeSnap - like doesn't exist yet
						exists: () => false,
					}),
				set: jest.fn(),
				delete: jest.fn(),
				update: jest.fn(),
			};
			await cb(mockTx);
		});

		await toggleLike("post1", "viewer1");

		expect(mockApplyPoints).toHaveBeenCalled();
	});

	it("awards creator points on share", async () => {
		mockGetDoc.mockResolvedValue({
			exists: () => true,
			data: () => ({ creatorId: "creator1" }),
		});

		await recordShare("post1");

		expect(mockApplyPoints).toHaveBeenCalledWith(
			"creator1",
			10,
			"Post shared",
			{
				postId: "post1",
			},
		);
	});
});
