import { jest } from "@jest/globals";

export const db = {};

export const userDoc = jest.fn(() => ({ id: "USER_REF" }));

export const pointsHistoryCollection = jest.fn(() => ({
	doc: jest.fn(() => ({ id: "POINTS_HISTORY_REF" })),
}));

export const postsCollection = { id: "POSTS_COLLECTION" };

export const serverTimestamp = jest.fn(() => "NOW");

export const increment = jest.fn((value) => value);
