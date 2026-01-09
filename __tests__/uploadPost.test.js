import { jest, describe, it, expect, beforeEach } from "@jest/globals";

// Create mock functions
const mockApplyPoints = jest.fn();
const mockDoc = jest.fn(() => ({ id: "post123" }));
const mockSetDoc = jest.fn();
const mockDeleteDoc = jest.fn();
const mockGetDoc = jest.fn();
const mockGetDocs = jest.fn(() => ({ docs: [] }));
const mockUpdateDoc = jest.fn();
const mockRunTransaction = jest.fn();
const mockCollection = jest.fn();
const mockQuery = jest.fn();
const mockWhere = jest.fn();
const mockOrderBy = jest.fn();
const mockLimit = jest.fn();
const mockServerTimestamp = jest.fn(() => "NOW");
const mockIncrement = jest.fn((v) => v);

// Mock firebase/firestore module
jest.unstable_mockModule("firebase/firestore", () => ({
	doc: mockDoc,
	setDoc: mockSetDoc,
	deleteDoc: mockDeleteDoc,
	getDoc: mockGetDoc,
	getDocs: mockGetDocs,
	updateDoc: mockUpdateDoc,
	runTransaction: mockRunTransaction,
	collection: mockCollection,
	query: mockQuery,
	where: mockWhere,
	orderBy: mockOrderBy,
	limit: mockLimit,
	serverTimestamp: mockServerTimestamp,
	increment: mockIncrement,
}));

// Mock the firebase service module
jest.unstable_mockModule("../src/services/firebase", () => ({
	db: {},
	postsCollection: { id: "POSTS_COLLECTION" },
	serverTimestamp: mockServerTimestamp,
	increment: mockIncrement,
}));

// Mock the points service module
jest.unstable_mockModule("../src/services/points", () => ({
	applyPoints: mockApplyPoints,
}));

// Import after mocking
const { createBlogPost, deleteBlogPost } = await import(
	"../src/services/uploadPost"
);

describe("uploadPost service", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockSetDoc.mockResolvedValue(undefined);
		mockDeleteDoc.mockResolvedValue(undefined);
	});

	it("awards points on blog publish", async () => {
		await createBlogPost({
			creatorId: "creator1",
			creatorUsername: "testuser",
			title: "Test Blog",
			blogContent: "Test content",
		});

		expect(mockApplyPoints).toHaveBeenCalled();
	});

	it("reverses points on delete", async () => {
		mockGetDoc.mockResolvedValue({
			exists: () => true,
			data: () => ({
				type: "blog",
				creatorId: "creator1",
				likeCount: 2,
				commentCount: 3,
			}),
		});

		await deleteBlogPost("post1");

		expect(mockApplyPoints).toHaveBeenCalledWith(
			"creator1",
			-200,
			"Post deleted",
			{
				postId: "post1",
			}
		);
	});
});
