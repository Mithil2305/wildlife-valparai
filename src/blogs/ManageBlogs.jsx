import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { getAuthInstance } from "../services/firebase.js";
import { getCreatorPosts, deleteBlogPost } from "../services/uploadPost.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import toast from "react-hot-toast";

const ManageBlogs = () => {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	// Fetch user's posts
	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			const auth = getAuthInstance();
			const currentUser = auth?.currentUser;
			if (currentUser) {
				const creatorPosts = await getCreatorPosts(currentUser.uid);
				setPosts(creatorPosts);
			}
			setLoading(false);
		};
		fetchData();
	}, []);

	// Handle Post Deletion
	const handleDelete = async (postId) => {
		if (window.confirm("Are you sure you want to delete this post?")) {
			const deletePromise = deleteBlogPost(postId);
			toast.promise(deletePromise, {
				loading: "Deleting post...",
				success: () => {
					// Refresh list
					setPosts(posts.filter((post) => post.id !== postId));
					return <b>Post deleted!</b>;
				},
				error: <b>Could not delete post.</b>,
			});
		}
	};

	if (loading) {
		return <LoadingSpinner />;
	}

	return (
		<div className="bg-gray-50 min-h-screen p-4 md:p-8">
			<div className="container mx-auto max-w-4xl">
				<div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
					<h1 className="text-3xl font-bold text-gray-900 mb-6">
						Manage Your Posts
					</h1>
					<div className="space-y-4">
						{posts.length > 0 ? (
							posts.map((post) => (
								<div
									key={post.id}
									className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-lg border border-gray-200 bg-gray-50"
								>
									<div>
										<span
											className={`text-xs font-semibold px-2 py-0.5 rounded ${
												post.type === "blog"
													? "bg-blue-100 text-blue-800"
													: "bg-green-100 text-green-800"
											}`}
										>
											{post.type === "blog" ? "Blog" : "Social"}
										</span>
										<h3 className="text-lg font-semibold text-gray-800 mt-1">
											{post.title || "Untitled Post"}
										</h3>
										<p className="text-sm text-gray-500">
											{new Date(post.createdAt?.toDate()).toLocaleDateString()}
										</p>
									</div>
									<div className="flex space-x-2 mt-4 md:mt-0">
										<button
											onClick={() => navigate(`/blog/${post.id}`)}
											className="p-2 text-sm text-gray-600 bg-white border rounded-lg hover:bg-gray-100 transition-colors"
											title="View Post"
										>
											<FaEye />
										</button>
										<button
											onClick={() => navigate(`/blog/edit/${post.id}`)}
											className="p-2 text-sm text-blue-600 bg-white border rounded-lg hover:bg-gray-100 transition-colors"
											title="Edit Post"
										>
											<FaEdit />
										</button>
										<button
											onClick={() => handleDelete(post.id)}
											className="p-2 text-sm text-red-600 bg-white border rounded-lg hover:bg-gray-100 transition-colors"
											title="Delete Post"
										>
											<FaTrash />
										</button>
									</div>
								</div>
							))
						) : (
							<p className="text-gray-500 text-center py-8">
								You haven't created any posts yet.
							</p>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ManageBlogs;
