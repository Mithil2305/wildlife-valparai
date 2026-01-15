import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthInstance } from "../services/firebase.js";
import { getCreatorPosts, deleteBlogPost } from "../services/uploadPost.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import toast from "react-hot-toast";
import { FaTrash, FaPlus, FaImage, FaMusic } from "react-icons/fa";

const ManageSocial = () => {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();
	const auth = getAuthInstance();
	const currentUser = auth?.currentUser;

	useEffect(() => {
		if (!currentUser) {
			navigate("/login");
			return;
		}
		fetchUserPosts();
	}, [currentUser]);

	const fetchUserPosts = async () => {
		try {
			setLoading(true);
			const userPosts = await getCreatorPosts(currentUser.uid);
			setPosts(userPosts.filter((post) => post.type === "photoAudio"));
		} catch (error) {
			console.error("Error fetching posts:", error);
			toast.error("Failed to load your posts");
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (postId) => {
		if (!window.confirm("Are you sure you want to delete this post?")) {
			return;
		}

		const deletePromise = deleteBlogPost(postId);

		toast.promise(deletePromise, {
			loading: "Deleting post...",
			success: () => {
				setPosts(posts.filter((p) => p.id !== postId));
				return "Post deleted successfully";
			},
			error: "Failed to delete post",
		});
	};

	if (loading) {
		return <LoadingSpinner />;
	}

	return (
		<div className="min-h-screen bg-gray-50 py-12 px-4">
			<div className="max-w-6xl mx-auto">
				<div className="flex justify-between items-center mb-8">
					<div>
						<h1 className="text-3xl font-bold text-gray-900">Social Content</h1>
						<p className="text-gray-500 mt-1">
							Manage your photo and audio uploads.
						</p>
					</div>
					<button
						onClick={() => navigate("/upload/content")}
						className="bg-[#335833] text-white px-6 py-2.5 rounded-lg hover:bg-[#2a4a2a] transition-colors flex items-center gap-2 font-medium shadow-sm"
					>
						<FaPlus size={14} /> Upload New
					</button>
				</div>

				{posts.length === 0 ? (
					<div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-200">
						<div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
							<FaImage size={24} />
						</div>
						<h3 className="text-lg font-semibold text-gray-900 mb-2">
							No content yet
						</h3>
						<p className="text-gray-500 mb-6">
							Start sharing your wildlife moments today.
						</p>
						<button
							onClick={() => navigate("/upload/content")}
							className="text-[#335833] font-medium hover:underline"
						>
							Upload your first post
						</button>
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{posts.map((post) => (
							<div
								key={post.id}
								className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group"
							>
								<div className="relative h-48 bg-gray-100">
									{post.photoUrl ? (
										<img
											src={post.photoUrl}
											alt={post.title}
											className="w-full h-full object-cover"
										/>
									) : (
										<div className="w-full h-full flex items-center justify-center text-gray-400">
											<FaImage size={32} />
										</div>
									)}

									<div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
										<FaMusic size={10} /> Photo + Audio
									</div>

									<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
										<button
											onClick={() => handleDelete(post.id)}
											className="bg-white text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors shadow-sm"
											title="Delete"
										>
											<FaTrash size={16} />
										</button>
									</div>
								</div>

								<div className="p-4">
									<h3
										className="font-semibold text-gray-800 mb-1 truncate"
										title={post.title}
									>
										{post.title || "Untitled"}
									</h3>
									<p className="text-xs text-gray-500">
										Posted on {post.createdAt?.toDate().toLocaleDateString()}
									</p>

									<div className="mt-4 flex items-center justify-between text-sm text-gray-500 border-t border-gray-100 pt-3">
										<span>{post.likeCount || 0} Likes</span>
										<span>{post.commentCount || 0} Comments</span>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default ManageSocial;
