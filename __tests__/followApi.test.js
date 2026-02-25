import { jest, describe, it, expect, beforeEach } from "@jest/globals";

// ─── MOCK SETUP ──────────────────────────────────────────────────────

const mockRunTransaction = jest.fn();
const mockGetDoc = jest.fn();
const mockGetDocs = jest.fn(() => ({ docs: [], empty: true, size: 0 }));
const mockDoc = jest.fn((_db, ...pathSegments) => ({
	id: pathSegments[pathSegments.length - 1] || "DOC_REF",
	path: pathSegments.join("/"),
}));
const mockSetDoc = jest.fn(() => Promise.resolve());
const mockUpdateDoc = jest.fn(() => Promise.resolve());
const mockDeleteDoc = jest.fn(() => Promise.resolve());
const mockCollection = jest.fn((_db, ...pathSegments) => ({
	id: pathSegments.join("/"),
}));
const mockQuery = jest.fn((...args) => args[0]);
const mockWhere = jest.fn(() => ({}));
const mockOrderBy = jest.fn(() => ({}));
const mockLimit = jest.fn(() => ({}));
const mockOnSnapshot = jest.fn(() => jest.fn());
const mockServerTimestamp = jest.fn(() => "NOW");
const mockIncrement = jest.fn((v) => v);
const mockStartAfter = jest.fn(() => ({}));

// Mock firebase module
jest.unstable_mockModule("../src/services/firebase", () => ({
	getFirebaseDb: jest.fn(() => Promise.resolve({})),
	getFirebaseAuth: jest.fn(() =>
		Promise.resolve({ currentUser: { uid: "user1" } }),
	),
	getUserDoc: jest.fn((userId) => Promise.resolve({ id: userId })),
	doc: mockDoc,
	getDoc: mockGetDoc,
	setDoc: mockSetDoc,
	updateDoc: mockUpdateDoc,
	deleteDoc: mockDeleteDoc,
	getDocs: mockGetDocs,
	collection: mockCollection,
	query: mockQuery,
	where: mockWhere,
	orderBy: mockOrderBy,
	limit: mockLimit,
	runTransaction: mockRunTransaction,
	increment: mockIncrement,
	serverTimestamp: mockServerTimestamp,
	onSnapshot: mockOnSnapshot,
}));

// Mock firebase/firestore for startAfter
jest.unstable_mockModule("firebase/firestore", () => ({
	startAfter: mockStartAfter,
}));

// Import after mocking
const {
	ensureCreatorProfile,
	getCreatorProfile,
	followCreator,
	unfollowCreator,
	getFollowStatus,
	subscribeFollowStatus,
	getFollowerCount,
	getCreatorPosts,
	subscribeNotifications,
	markNotificationRead,
	markAllNotificationsRead,
	notifyFollowersOfNewPost,
	incrementCreatorPostCount,
	decrementCreatorPostCount,
	logAnalyticsEvent,
} = await import("../src/services/followApi");

// ─── TESTS ───────────────────────────────────────────────────────────

describe("followApi service", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	// ── CREATOR PROFILE ─────────────────────────────────────

	describe("ensureCreatorProfile", () => {
		it("returns existing profile if it exists", async () => {
			mockGetDoc.mockResolvedValueOnce({
				exists: () => true,
				id: "creator1",
				data: () => ({
					name: "TestCreator",
					followerCount: 5,
				}),
			});

			const profile = await ensureCreatorProfile("creator1");
			expect(profile).toEqual({
				id: "creator1",
				name: "TestCreator",
				followerCount: 5,
			});
			// Should NOT call setDoc since profile already exists
			expect(mockSetDoc).not.toHaveBeenCalled();
		});

		it("creates a new profile from user data if none exists", async () => {
			// First call: creator doc doesn't exist
			mockGetDoc.mockResolvedValueOnce({
				exists: () => false,
				id: "creator1",
			});
			// Second call: user doc exists with profile data
			mockGetDoc.mockResolvedValueOnce({
				exists: () => true,
				data: () => ({
					name: "John",
					profilePhotoUrl: "https://img.example.com/john.jpg",
					bio: "Wildlife photographer",
				}),
			});

			const profile = await ensureCreatorProfile("creator1");

			expect(mockSetDoc).toHaveBeenCalledTimes(1);
			expect(profile.name).toBe("John");
			expect(profile.avatarUrl).toBe("https://img.example.com/john.jpg");
			expect(profile.bio).toBe("Wildlife photographer");
			expect(profile.followerCount).toBe(0);
			expect(profile.postCount).toBe(0);
		});
	});

	describe("getCreatorProfile", () => {
		it("returns null if profile doesn't exist", async () => {
			mockGetDoc.mockResolvedValueOnce({
				exists: () => false,
			});

			const profile = await getCreatorProfile("unknown");
			expect(profile).toBeNull();
		});

		it("returns the profile data if it exists", async () => {
			mockGetDoc.mockResolvedValueOnce({
				exists: () => true,
				id: "creator1",
				data: () => ({ name: "Alice", followerCount: 42 }),
			});

			const profile = await getCreatorProfile("creator1");
			expect(profile.name).toBe("Alice");
			expect(profile.followerCount).toBe(42);
		});
	});

	// ── FOLLOW / UNFOLLOW ───────────────────────────────────

	describe("followCreator", () => {
		it("runs a transaction that sets member + following docs and increments count", async () => {
			// ensureCreatorProfile should be called first – mock creator exists
			mockGetDoc.mockResolvedValueOnce({
				exists: () => true,
				id: "creator1",
				data: () => ({ name: "Creator", followerCount: 5 }),
			});

			mockRunTransaction.mockImplementation(async (_db, cb) => {
				const mockTx = {
					get: jest.fn().mockResolvedValueOnce({
						exists: () => false, // member doc doesn't exist yet
					}),
					set: jest.fn(),
					update: jest.fn(),
				};
				await cb(mockTx);
				// Verify: should set member doc, set following doc, update creator
				expect(mockTx.set).toHaveBeenCalledTimes(2);
				expect(mockTx.update).toHaveBeenCalledTimes(1);
			});

			await followCreator("creator1");
			expect(mockRunTransaction).toHaveBeenCalledTimes(1);
		});

		it("throws if already following", async () => {
			mockGetDoc.mockResolvedValueOnce({
				exists: () => true,
				id: "creator1",
				data: () => ({ name: "Creator" }),
			});

			mockRunTransaction.mockImplementation(async (_db, cb) => {
				const mockTx = {
					get: jest.fn().mockResolvedValueOnce({
						exists: () => true, // member doc already exists
					}),
					set: jest.fn(),
					update: jest.fn(),
				};
				await cb(mockTx);
			});

			await expect(followCreator("creator1")).rejects.toThrow(
				"Already following this creator",
			);
		});
	});

	describe("unfollowCreator", () => {
		it("deletes member + following docs and decrements count", async () => {
			mockRunTransaction.mockImplementation(async (_db, cb) => {
				const mockTx = {
					get: jest.fn().mockResolvedValueOnce({
						exists: () => true, // member doc exists
					}),
					delete: jest.fn(),
					update: jest.fn(),
				};
				await cb(mockTx);
				expect(mockTx.delete).toHaveBeenCalledTimes(2);
				expect(mockTx.update).toHaveBeenCalledTimes(1);
			});

			await unfollowCreator("creator1");
			expect(mockRunTransaction).toHaveBeenCalledTimes(1);
		});

		it("throws if not currently following", async () => {
			mockRunTransaction.mockImplementation(async (_db, cb) => {
				const mockTx = {
					get: jest.fn().mockResolvedValueOnce({
						exists: () => false, // member doc doesn't exist
					}),
					delete: jest.fn(),
					update: jest.fn(),
				};
				await cb(mockTx);
			});

			await expect(unfollowCreator("creator1")).rejects.toThrow(
				"Not currently following this creator",
			);
		});
	});

	describe("getFollowStatus", () => {
		it("returns true when user is following", async () => {
			mockGetDoc.mockResolvedValueOnce({ exists: () => true });
			const result = await getFollowStatus("creator1");
			expect(result).toBe(true);
		});

		it("returns false when user is not following", async () => {
			mockGetDoc.mockResolvedValueOnce({ exists: () => false });
			const result = await getFollowStatus("creator1");
			expect(result).toBe(false);
		});
	});

	describe("subscribeFollowStatus", () => {
		it("calls callback with false when userId is null", async () => {
			const callback = jest.fn();
			await subscribeFollowStatus("creator1", null, callback);
			expect(callback).toHaveBeenCalledWith(false);
		});

		it("sets up onSnapshot listener when userId is provided", async () => {
			const callback = jest.fn();
			await subscribeFollowStatus("creator1", "user1", callback);
			expect(mockOnSnapshot).toHaveBeenCalled();
		});
	});

	describe("getFollowerCount", () => {
		it("returns the follower count from profile", async () => {
			mockGetDoc.mockResolvedValueOnce({
				exists: () => true,
				id: "creator1",
				data: () => ({ followerCount: 100 }),
			});

			const count = await getFollowerCount("creator1");
			expect(count).toBe(100);
		});

		it("returns 0 if profile doesn't exist", async () => {
			mockGetDoc.mockResolvedValueOnce({ exists: () => false });
			const count = await getFollowerCount("creator1");
			expect(count).toBe(0);
		});
	});

	// ── CREATOR POSTS ───────────────────────────────────────

	describe("getCreatorPosts", () => {
		it("returns paginated posts", async () => {
			mockGetDocs.mockResolvedValueOnce({
				docs: [
					{ id: "post1", data: () => ({ title: "Post 1" }) },
					{ id: "post2", data: () => ({ title: "Post 2" }) },
				],
			});

			const result = await getCreatorPosts("creator1");
			expect(result.posts).toHaveLength(2);
			expect(result.posts[0].title).toBe("Post 1");
		});

		it("uses startAfter for pagination when lastDoc provided", async () => {
			const lastDoc = { id: "lastDoc" };
			mockGetDocs.mockResolvedValueOnce({ docs: [] });

			await getCreatorPosts("creator1", lastDoc);
			expect(mockStartAfter).toHaveBeenCalledWith(lastDoc);
		});
	});

	// ── NOTIFICATIONS ───────────────────────────────────────

	describe("subscribeNotifications", () => {
		it("sets up real-time listener for user notifications", async () => {
			const callback = jest.fn();
			await subscribeNotifications("user1", callback);
			expect(mockOnSnapshot).toHaveBeenCalled();
		});
	});

	describe("markNotificationRead", () => {
		it("updates the notification doc with read: true", async () => {
			await markNotificationRead("user1", "notif1");
			expect(mockUpdateDoc).toHaveBeenCalledWith(expect.anything(), {
				read: true,
			});
		});
	});

	describe("markAllNotificationsRead", () => {
		it("updates all unread notifications", async () => {
			mockGetDocs.mockResolvedValueOnce({
				docs: [{ id: "notif1" }, { id: "notif2" }, { id: "notif3" }],
			});

			await markAllNotificationsRead("user1");
			expect(mockUpdateDoc).toHaveBeenCalledTimes(3);
		});

		it("does nothing when there are no unread notifications", async () => {
			mockGetDocs.mockResolvedValueOnce({ docs: [] });
			await markAllNotificationsRead("user1");
			expect(mockUpdateDoc).not.toHaveBeenCalled();
		});
	});

	// ── CLIENT-SIDE FOLLOWER NOTIFICATIONS ──────────────────

	describe("notifyFollowersOfNewPost", () => {
		it("writes a notification doc for each follower", async () => {
			mockGetDocs.mockResolvedValueOnce({
				empty: false,
				size: 3,
				docs: [{ id: "follower1" }, { id: "follower2" }, { id: "follower3" }],
			});

			await notifyFollowersOfNewPost(
				"creator1",
				"Creator Name",
				"post123",
				"Amazing Wildlife",
				"blog",
			);

			// 3 notification writes + 1 analytics write
			expect(mockSetDoc).toHaveBeenCalled();
		});

		it("skips if no followers", async () => {
			mockGetDocs.mockResolvedValueOnce({
				empty: true,
				size: 0,
				docs: [],
			});

			await notifyFollowersOfNewPost(
				"creator1",
				"Creator Name",
				"post123",
				"Title",
				"blog",
			);

			// Only the analytics event should not be called since no followers
			expect(mockSetDoc).not.toHaveBeenCalled();
		});

		it("does not notify the creator about their own post", async () => {
			mockGetDocs.mockResolvedValueOnce({
				empty: false,
				size: 2,
				docs: [
					{ id: "creator1" }, // Self – should be skipped
					{ id: "follower1" },
				],
			});

			await notifyFollowersOfNewPost(
				"creator1",
				"Creator Name",
				"post123",
				"Title",
				"photoAudio",
			);

			// Only 1 follower notification + 1 analytics = 2 setDoc calls
			// (creator1 is skipped, follower1 gets a notification, analytics is a setDoc)
			const notifCalls = mockSetDoc.mock.calls.filter(
				(call) => call[1]?.read === false,
			);
			expect(notifCalls).toHaveLength(1);
		});
	});

	// ── CREATOR POST COUNT ──────────────────────────────────

	describe("incrementCreatorPostCount", () => {
		it("increments the postCount on the creator profile", async () => {
			// ensureCreatorProfile call
			mockGetDoc.mockResolvedValueOnce({
				exists: () => true,
				id: "creator1",
				data: () => ({ name: "Creator", postCount: 5 }),
			});

			await incrementCreatorPostCount("creator1");
			expect(mockUpdateDoc).toHaveBeenCalledWith(
				expect.anything(),
				{ postCount: 1 }, // increment(1) returns 1 in our mock
			);
		});
	});

	describe("decrementCreatorPostCount", () => {
		it("decrements the postCount on the creator profile", async () => {
			await decrementCreatorPostCount("creator1");
			expect(mockUpdateDoc).toHaveBeenCalledWith(
				expect.anything(),
				{ postCount: -1 }, // increment(-1) returns -1 in our mock
			);
		});
	});

	// ── ANALYTICS ───────────────────────────────────────────

	describe("logAnalyticsEvent", () => {
		it("writes an analytics event doc", async () => {
			await logAnalyticsEvent("follow", { creatorId: "creator1" });
			expect(mockSetDoc).toHaveBeenCalledTimes(1);
			expect(mockSetDoc).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({
					event: "follow",
					data: { creatorId: "creator1" },
				}),
			);
		});

		it("does not throw on error", async () => {
			mockSetDoc.mockRejectedValueOnce(new Error("Write failed"));
			// Should not throw
			await expect(logAnalyticsEvent("test_event")).resolves.toBeUndefined();
		});
	});
});
