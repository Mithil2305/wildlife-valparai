import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAuthInstance } from "../services/firebase.js";
import { getPost, updateBlogPost } from "../services/uploadPost.js";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner.jsx";

const EditBlog = () => {
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [loading, setLoading] = useState(true);
	const [post, setPost] = useState(null);
	const { postId } = useParams();
	const navigate = useNavigate();
	const auth = getAuthInstance();

	// Fetch the post data on load
	useEffect(() => {
		const fetchPost = async () => {
			setLoading(true);
			const postData = await getPost(postId);
			if (postData) {
				// Security check: Ensure current user is the post creator
				if (postData.creatorId !== auth?.currentUser?.uid) {
					toast.error("You are not authorized to edit this post.");
					navigate("/dashboard/creator");
					return;
				}
				setPost(postData);
				setTitle(postData.title);
				setContent(postData.blogContent);
			} else {
				toast.error("Post not found.");
				navigate("/dashboard/creator");
			}
			setLoading(false);
		};

		if (postId) {
			fetchPost();
		}
	}, [postId, navigate]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!title || !content) {
			toast.error("Please fill in all fields.");
			return;
		}

		setLoading(true);
		const updateData = {
			title: title,
			blogContent: content,
		};

		const updatePromise = updateBlogPost(postId, updateData);

		toast.promise(updatePromise, {
			loading: "Updating post...",
			success: () => {
				setLoading(false);
				navigate("/dashboard/creator"); // Go to dashboard on success
				return <b>Post updated successfully!</b>;
			},
			error: (err) => {
				setLoading(false);
				return <b>Error updating post: {err.message}</b>;
			},
		});
	};

	if (loading || !post) {
		return <LoadingSpinner />;
	}

	return (
		<div className="bg-gray-50 min-h-screen py-12 px-4">
			<div className="container mx-auto max-w-3xl bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
				<h1 className="text-3xl font-bold text-gray-900 mb-6">
					Edit Blog Post
				</h1>
				<form onSubmit={handleSubmit} className="space-y-6">
					<div>
						<label
							htmlFor="title"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Post Title
						</label>
						<input
							type="text"
							id="title"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#335833]"
						/>
					</div>
					<div>
						<label
							htmlFor="content"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Blog Content
						</label>
						<textarea
							id="content"
							value={content}
							onChange={(e) => setContent(e.target.value)}
							rows={15}
							className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#335833]"
						/>
					</div>
					<div className="flex justify-end space-x-4">
						<button
							type="button"
							onClick={() => navigate("/dashboard/creator")}
							disabled={loading}
							className="py-2 px-5 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-all"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={loading}
							className="py-2 px-5 bg-[#335833] text-white font-semibold rounded-lg hover:bg-opacity-90 transition-all disabled:opacity-50"
						>
							{loading ? "Saving..." : "Save Changes"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default EditBlog;
