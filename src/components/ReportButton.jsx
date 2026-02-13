import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiFlag, HiX } from "react-icons/hi";
import { toast } from "react-hot-toast";
import {
	reportPost,
	REPORT_REASONS,
	hasUserReported,
} from "../services/reportApi.js";

/**
 * ReportButton - Shows a flag icon that opens a report modal.
 * Props:
 *   postId - the post/blog ID to report
 *   userId - current logged-in user ID (null if not logged in)
 *   className - optional extra classes for the button
 */
const ReportButton = ({ postId, userId, className = "" }) => {
	const [showModal, setShowModal] = useState(false);

	const handleClick = async () => {
		if (!userId) {
			toast.error("Please log in to report content");
			return;
		}
		try {
			const alreadyReported = await hasUserReported(postId, userId);
			if (alreadyReported) {
				toast("You've already reported this post", { icon: "⚠️" });
				return;
			}
			setShowModal(true);
		} catch {
			setShowModal(true);
		}
	};

	return (
		<>
			<button
				onClick={handleClick}
				className={`p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors ${className}`}
				title="Report this content"
			>
				<HiFlag size={18} />
			</button>

			<AnimatePresence>
				{showModal && (
					<ReportModal
						postId={postId}
						userId={userId}
						onClose={() => setShowModal(false)}
					/>
				)}
			</AnimatePresence>
		</>
	);
};

const ReportModal = ({ postId, userId, onClose }) => {
	const [selectedReason, setSelectedReason] = useState("");
	const [details, setDetails] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!selectedReason) {
			toast.error("Please select a reason");
			return;
		}

		setLoading(true);
		try {
			await reportPost(postId, userId, selectedReason, details);
			toast.success(
				"Report submitted. Thank you for keeping our community safe!",
			);
			onClose();
		} catch (error) {
			toast.error(error.message || "Failed to submit report");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div
			className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
			onClick={onClose}
		>
			<motion.div
				initial={{ scale: 0.9, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				exit={{ scale: 0.9, opacity: 0 }}
				transition={{ type: "spring", duration: 0.3 }}
				className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-gray-100"
				onClick={(e) => e.stopPropagation()}
			>
				{/* Header */}
				<div className="flex justify-between items-center mb-5">
					<div className="flex items-center gap-3">
						<div className="p-2 bg-red-100 text-red-500 rounded-xl">
							<HiFlag size={20} />
						</div>
						<h3 className="text-lg font-bold text-gray-900">Report Content</h3>
					</div>
					<button
						onClick={onClose}
						className="p-2 hover:bg-gray-100 rounded-full text-gray-500 hover:text-gray-900 transition-colors"
					>
						<HiX size={18} />
					</button>
				</div>

				<p className="text-sm text-gray-500 mb-4">
					Help us understand the issue. Select the reason that best describes
					the problem.
				</p>

				<form onSubmit={handleSubmit} className="space-y-4">
					{/* Reason Options */}
					<div className="space-y-2 max-h-56 overflow-y-auto pr-1">
						{REPORT_REASONS.map((reason) => (
							<label
								key={reason}
								className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
									selectedReason === reason
										? "border-red-300 bg-red-50 text-red-700"
										: "border-gray-200 hover:bg-gray-50 text-gray-700"
								}`}
							>
								<input
									type="radio"
									name="reportReason"
									value={reason}
									checked={selectedReason === reason}
									onChange={(e) => setSelectedReason(e.target.value)}
									className="w-4 h-4 text-red-500 focus:ring-red-500 border-gray-300"
								/>
								<span className="text-sm font-medium">{reason}</span>
							</label>
						))}
					</div>

					{/* Additional Details */}
					<div>
						<label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
							Additional Details (Optional)
						</label>
						<textarea
							value={details}
							onChange={(e) => setDetails(e.target.value)}
							maxLength={500}
							rows={3}
							className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-300 focus:border-red-300 outline-none text-sm resize-none transition-all"
							placeholder="Provide any additional context..."
						/>
						<p className="text-xs text-gray-400 mt-1 text-right">
							{details.length}/500
						</p>
					</div>

					{/* Actions */}
					<div className="flex gap-3 pt-2">
						<button
							type="button"
							onClick={onClose}
							className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors text-sm"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={loading || !selectedReason}
							className="flex-1 px-4 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm shadow-lg shadow-red-200"
						>
							{loading ? "Submitting..." : "Submit Report"}
						</button>
					</div>
				</form>
			</motion.div>
		</div>
	);
};

export default ReportButton;
