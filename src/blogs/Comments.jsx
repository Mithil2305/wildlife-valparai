import React, { useState, useEffect } from "react";
import {
	getPostComments,
	addPostComment,
	deletePostComment,
} from "../services/uploadPost.js";
import {
	getAuthInstance,
	getUserDoc,
	getDoc,
	onAuthStateChanged,
} from "../services/firebase.js";
import toast from "react-hot-toast";
import { FaTrash, FaPaperPlane } from "react-icons/fa";

const Comments = ({ postId }) => {
	const [comments, setComments] = useState([]);
	const [newComment, setNewComment] = useState("");
	const [loading, setLoading] = useState(true);
	const [currentUser, setCurrentUser] = useState(null);
	const [currentUserProfile, setCurrentUserProfile] = useState(null);

	// Listen to auth state
	useEffect(() => {
		const auth = getAuthInstance();
		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			setCurrentUser(user);
			if (user) {
				const userRef = await getUserDoc(user.uid);
				const userSnap = await getDoc(userRef);
				if (userSnap.exists()) {
					setCurrentUserProfile(userSnap.data());
				}
			} else {
				setCurrentUserProfile(null);
			}
		});
		return () => unsubscribe();
	}, []);

	// Fetch comments
	const fetchComments = async () => {
		setLoading(true);
		try {
			const postComments = await getPostComments(postId);
			setComments(postComments);
		} catch (error) {
			toast.error("Could not load comments.", error);
		}
		setLoading(false);
	};

	useEffect(() => {
		if (postId) {
			fetchComments();
		}
	}, [postId]);

	// Handle comment submission
	const handleSubmitComment = async (e) => {
		e.preventDefault();
		if (!newComment.trim()) return;
		if (!currentUser || !currentUserProfile) {
			toast.error("You must be logged in to comment.");
			return;
		}

		const commentPromise = addPostComment(
			postId,
			currentUser.uid,
			currentUserProfile.username,
			newComment
		);

		toast.promise(commentPromise, {
			loading: "Posting comment...",
			success: () => {
				setNewComment("");
				fetchComments(); // Refresh comments list
				return <b>Comment posted!</b>;
			},
			error: <b>Could not post comment.</b>,
		});
	};

	// Handle comment deletion
	const handleDeleteComment = async (commentId) => {
		if (window.confirm("Are you sure you want to delete this comment?")) {
			const deletePromise = deletePostComment(postId, commentId);
			toast.promise(deletePromise, {
				loading: "Deleting comment...",
				success: () => {
					fetchComments(); // Refresh comments list
					return <b>Comment deleted.</b>;
				},
				error: <b>Could not delete comment.</b>,
			});
		}
	};

	return (
		<div className="mt-8 pt-8 border-t border-gray-200">
			{/* New Comment Form (styled like image) */}
			<h3 className="text-lg font-semibold text-gray-800 mb-3">
				Write a Comment...
			</h3>
			{currentUser ? (
				<form
					onSubmit={handleSubmitComment}
					className="relative flex items-center mb-6"
				>
					<input
						type="text"
						value={newComment}
						onChange={(e) => setNewComment(e.target.value)}
						className="w-full p-4 pr-16 border border-gray-300 rounded-full focus:ring-2 focus:ring-[#335833] focus:outline-none"
						placeholder="Add your comment..."
					/>
					<button
						type="submit"
						className="absolute right-2 w-10 h-10 bg-[#335833] text-white rounded-full flex items-center justify-center hover:bg-opacity-90 transition-all"
						aria-label="Post comment"
					>
						<FaPaperPlane />
					</button>
				</form>
			) : (
				<p className="mb-6 text-gray-600">
					You must be{" "}
					<a href="/login" className="text-[#335833] underline">
						logged in
					</a>{" "}
					to post a comment.
				</p>
			)}

			{/* List of comments (styled like image) */}
			<h3 className="text-lg font-semibold text-gray-800 mb-4">Comments</h3>
			<div className="space-y-5">
				{loading ? (
					<p>Loading comments...</p>
				) : comments.length > 0 ? (
					comments.map((comment) => (
						<div key={comment.id} className="border-b border-gray-200 pb-4">
							<div className="flex items-center justify-between">
								<span className="font-bold text-gray-900">
									{comment.username}
								</span>
								{/* Show delete button if user is owner */}
								{currentUser?.uid === comment.userId && (
									<button
										onClick={() => handleDeleteComment(comment.id)}
										className="text-gray-400 hover:text-red-600"
										title="Delete comment"
									>
										<FaTrash size={14} />
									</button>
								)}
							</div>
							<p className="mt-1 text-gray-700">{comment.text}</p>
						</div>
					))
				) : (
					<p className="text-gray-500">Be the first to comment!</p>
				)}
			</div>
		</div>
	);
};

export default Comments;
