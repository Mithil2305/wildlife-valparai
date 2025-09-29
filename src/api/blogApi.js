import {
	collection,
	addDoc,
	updateDoc,
	deleteDoc,
	doc,
	getDocs,
	getDoc,
	query,
	where,
	orderBy,
	limit,
	startAfter,
	serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebaseConfig";

export const createBlog = async (blogData) => {
	try {
		const blogRef = await addDoc(collection(db, "blogs"), {
			...blogData,
			createdAt: serverTimestamp(),
			updatedAt: serverTimestamp(),
			likes: 0,
			views: 0,
			status: "published",
		});

		return { success: true, id: blogRef.id };
	} catch (error) {
		return { success: false, error: error.message };
	}
};

export const updateBlog = async (blogId, updates) => {
	try {
		const blogRef = doc(db, "blogs", blogId);
		await updateDoc(blogRef, {
			...updates,
			updatedAt: serverTimestamp(),
		});

		return { success: true };
	} catch (error) {
		return { success: false, error: error.message };
	}
};

export const deleteBlog = async (blogId) => {
	try {
		await deleteDoc(doc(db, "blogs", blogId));
		return { success: true };
	} catch (error) {
		return { success: false, error: error.message };
	}
};

export const getBlog = async (blogId) => {
	try {
		const blogDoc = await getDoc(doc(db, "blogs", blogId));
		if (blogDoc.exists()) {
			return { success: true, data: { id: blogDoc.id, ...blogDoc.data() } };
		}
		return { success: false, error: "Blog not found" };
	} catch (error) {
		return { success: false, error: error.message };
	}
};

export const getBlogs = async (options = {}) => {
	try {
		const {
			userId = null,
			limit: limitCount = 10,
			startAfter: startAfterDoc = null,
			status = "published",
			category = null,
			tag = null,
		} = options;

		let blogsQuery = query(
			collection(db, "blogs"),
			orderBy("createdAt", "desc")
		);

		if (userId) {
			blogsQuery = query(blogsQuery, where("authorId", "==", userId));
		}

		if (status) {
			blogsQuery = query(blogsQuery, where("status", "==", status));
		}

		if (category) {
			blogsQuery = query(blogsQuery, where("category", "==", category));
		}

		if (tag) {
			blogsQuery = query(blogsQuery, where("tags", "array-contains", tag));
		}

		// Apply startAfter for pagination
		if (startAfterDoc) {
			blogsQuery = query(blogsQuery, startAfter(startAfterDoc));
		}

		// Apply limit
		blogsQuery = query(blogsQuery, limit(limitCount));

		const querySnapshot = await getDocs(blogsQuery);
		const blogs = querySnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));

		// Get the last document for next page pagination
		const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

		return {
			success: true,
			data: blogs,
			lastDoc: lastDoc || null,
			hasMore: blogs.length === limitCount,
		};
	} catch (error) {
		return { success: false, error: error.message };
	}
};

// New paginated blogs function with better structure
export const getPaginatedBlogs = async (
	pageSize = 10,
	lastDoc = null,
	filters = {}
) => {
	try {
		const {
			userId = null,
			status = "published",
			category = null,
			tag = null,
			orderByField = "createdAt",
			orderDirection = "desc",
		} = filters;

		let blogsQuery = query(
			collection(db, "blogs"),
			orderBy(orderByField, orderDirection)
		);

		// Apply filters
		if (userId) {
			blogsQuery = query(blogsQuery, where("authorId", "==", userId));
		}

		if (status) {
			blogsQuery = query(blogsQuery, where("status", "==", status));
		}

		if (category) {
			blogsQuery = query(blogsQuery, where("category", "==", category));
		}

		if (tag) {
			blogsQuery = query(blogsQuery, where("tags", "array-contains", tag));
		}

		// Apply startAfter for pagination
		if (lastDoc) {
			blogsQuery = query(blogsQuery, startAfter(lastDoc));
		}

		// Apply limit
		blogsQuery = query(blogsQuery, limit(pageSize));

		const querySnapshot = await getDocs(blogsQuery);
		const blogs = querySnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));

		// Get the last document for next page pagination
		const newLastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

		return {
			success: true,
			data: blogs,
			lastDoc: newLastDoc || null,
			hasMore: blogs.length === pageSize,
			totalCount: blogs.length,
		};
	} catch (error) {
		return { success: false, error: error.message };
	}
};

// Get featured blogs (most viewed or liked)
export const getFeaturedBlogs = async (limitCount = 5, lastDoc = null) => {
	try {
		let featuredQuery = query(
			collection(db, "blogs"),
			where("status", "==", "published"),
			orderBy("views", "desc"),
			orderBy("createdAt", "desc")
		);

		if (lastDoc) {
			featuredQuery = query(featuredQuery, startAfter(lastDoc));
		}

		featuredQuery = query(featuredQuery, limit(limitCount));

		const querySnapshot = await getDocs(featuredQuery);
		const blogs = querySnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));

		const lastDocument = querySnapshot.docs[querySnapshot.docs.length - 1];

		return {
			success: true,
			data: blogs,
			lastDoc: lastDocument || null,
			hasMore: blogs.length === limitCount,
		};
	} catch (error) {
		return { success: false, error: error.message };
	}
};

// Get blogs by category with pagination
export const getBlogsByCategory = async (
	category,
	pageSize = 10,
	lastDoc = null
) => {
	return getPaginatedBlogs(pageSize, lastDoc, {
		category,
		status: "published",
	});
};

// Get user's blogs with pagination
export const getUserBlogs = async (
	userId,
	pageSize = 10,
	lastDoc = null,
	status = null
) => {
	return getPaginatedBlogs(pageSize, lastDoc, {
		userId,
		status: status || "published",
	});
};

// Search blogs with pagination
export const searchBlogs = async (
	searchTerm,
	pageSize = 10,
	lastDoc = null
) => {
	try {
		// Note: Firestore doesn't support native text search
		// This would need to be implemented with Algolia or similar
		// For now, we'll search in title and content fields

		let blogsQuery = query(
			collection(db, "blogs"),
			where("status", "==", "published"),
			orderBy("title"),
			orderBy("createdAt", "desc")
		);

		if (lastDoc) {
			blogsQuery = query(blogsQuery, startAfter(lastDoc));
		}

		blogsQuery = query(blogsQuery, limit(pageSize));

		const querySnapshot = await getDocs(blogsQuery);

		// Client-side filtering (not efficient for large datasets)
		const allBlogs = querySnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));

		const filteredBlogs = allBlogs.filter(
			(blog) =>
				blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
				blog.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
				(blog.tags &&
					blog.tags.some((tag) =>
						tag.toLowerCase().includes(searchTerm.toLowerCase())
					))
		);

		const lastDocument = querySnapshot.docs[querySnapshot.docs.length - 1];

		return {
			success: true,
			data: filteredBlogs,
			lastDoc: lastDocument || null,
			hasMore: allBlogs.length === pageSize,
		};
	} catch (error) {
		return { success: false, error: error.message };
	}
};

export const incrementBlogViews = async (blogId) => {
	try {
		const blogRef = doc(db, "blogs", blogId);
		const blogDoc = await getDoc(blogRef);

		if (blogDoc.exists()) {
			const currentViews = blogDoc.data().views || 0;
			await updateDoc(blogRef, {
				views: currentViews + 1,
			});
		}

		return { success: true };
	} catch (error) {
		return { success: false, error: error.message };
	}
};

export const likeBlog = async (blogId, userId) => {
	try {
		const blogRef = doc(db, "blogs", blogId);
		const blogDoc = await getDoc(blogRef);

		if (blogDoc.exists()) {
			const currentLikes = blogDoc.data().likes || 0;
			await updateDoc(blogRef, {
				likes: currentLikes + 1,
			});

			// Record the like in user's liked blogs
			await addDoc(collection(db, "blogLikes"), {
				blogId,
				userId,
				likedAt: serverTimestamp(),
			});
		}

		return { success: true };
	} catch (error) {
		return { success: false, error: error.message };
	}
};

// Get blog statistics
export const getBlogStats = async (userId = null) => {
	try {
		let statsQuery = query(
			collection(db, "blogs"),
			where("status", "==", "published")
		);

		if (userId) {
			statsQuery = query(statsQuery, where("authorId", "==", userId));
		}

		const querySnapshot = await getDocs(statsQuery);
		const blogs = querySnapshot.docs.map((doc) => doc.data());

		const totalViews = blogs.reduce((sum, blog) => sum + (blog.views || 0), 0);
		const totalLikes = blogs.reduce((sum, blog) => sum + (blog.likes || 0), 0);
		const averageViews = blogs.length > 0 ? totalViews / blogs.length : 0;

		return {
			success: true,
			data: {
				totalBlogs: blogs.length,
				totalViews,
				totalLikes,
				averageViews: Math.round(averageViews),
			},
		};
	} catch (error) {
		return { success: false, error: error.message };
	}
};
