import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
	subscribeCreatorProfile,
	getCreatorPosts,
	ensureCreatorProfile,
} from "../services/followApi.js";
import FollowButton from "./FollowButton.jsx";
import LoadingSpinner from "./LoadingSpinner.jsx";
import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars
import {
	FaArrowLeft,
	FaCamera,
	FaStar,
	FaThLarge,
	FaPen,
	FaHeart,
	FaComment,
	FaPlay,
} from "react-icons/fa";
import { HiPhotograph, HiDocumentText } from "react-icons/hi";

// ─── Helper: format large numbers (1200 → 1.2K) ──────────────────
const formatCount = (n) => {
	if (!n || n < 1000) return String(n || 0);
	if (n < 1_000_000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "K";
	return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
};

// ─── Helper: extract first image from blog HTML/markdown ──────────
const extractThumbnail = (post) => {
	if (post.imageUrl) return post.imageUrl;
	if (post.mediaUrl) return post.mediaUrl;
	const content = post.blogContent || "";
	const htmlMatch = content.match(/<img[^>]+src="([^">]+)"/);
	if (htmlMatch) return htmlMatch[1];
	const mdMatch = content.match(/!\[.*?\]\((.*?)\)/);
	if (mdMatch) return mdMatch[1];
	return null;
};

const CreatorProfile = () => {
	const { creatorId } = useParams();
	const navigate = useNavigate();
	const [profile, setProfile] = useState(null);
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [loadingMore, setLoadingMore] = useState(false);
	const [hasMore, setHasMore] = useState(false);
	const [filter, setFilter] = useState("all");
	const lastDocRef = useRef(null);
	const [notFound, setNotFound] = useState(false);

	// Subscribe to real-time creator profile
	useEffect(() => {
		let unsub = () => {};
		const setup = async () => {
			try {
				const initial = await ensureCreatorProfile(creatorId);
				if (!initial) {
					setNotFound(true);
					setLoading(false);
					return;
				}
				setProfile(initial);
				unsub = await subscribeCreatorProfile(creatorId, (data) => {
					if (data) {
						setProfile(data);
					}
					setLoading(false);
				});
			} catch {
				setNotFound(true);
				setLoading(false);
			}
		};
		setup();
		return () => unsub();
	}, [creatorId]);

	// Fetch initial posts
	useEffect(() => {
		const fetchPosts = async () => {
			try {
				const result = await getCreatorPosts(creatorId);
				setPosts(result.posts);
				lastDocRef.current = result.lastVisible;
				setHasMore(result.hasMore);
			} catch (err) {
				console.error("Error fetching creator posts:", err);
			}
		};
		fetchPosts();
	}, [creatorId]);

	// Load more
	const loadMore = useCallback(async () => {
		if (loadingMore || !hasMore) return;
		setLoadingMore(true);
		try {
			const result = await getCreatorPosts(creatorId, lastDocRef.current);
			setPosts((prev) => [...prev, ...result.posts]);
			lastDocRef.current = result.lastVisible;
			setHasMore(result.hasMore);
		} catch (err) {
			console.error("Error loading more posts:", err);
		} finally {
			setLoadingMore(false);
		}
	}, [creatorId, loadingMore, hasMore]);

	// Infinite scroll
	const sentinelRef = useRef(null);
	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && hasMore && !loadingMore) {
					loadMore();
				}
			},
			{ rootMargin: "200px" },
		);
		const el = sentinelRef.current;
		if (el) observer.observe(el);
		return () => {
			if (el) observer.unobserve(el);
		};
	}, [hasMore, loadingMore, loadMore]);

	const filteredPosts =
		filter === "all" ? posts : posts.filter((p) => p.type === filter);

	const blogCount = posts.filter((p) => p.type === "blog").length;
	const momentCount = posts.filter((p) => p.type === "photoAudio").length;

	if (loading) return <LoadingSpinner />;

	if (notFound || !profile) {
		return (
			<div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
				<div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
					<FaCamera className="text-gray-300 text-3xl" />
				</div>
				<h2 className="text-xl font-bold text-gray-900 mb-2">
					Creator not found
				</h2>
				<p className="text-gray-500 text-sm mb-6 max-w-xs">
					This profile doesn't exist or may have been removed.
				</p>
				<button
					onClick={() => navigate(-1)}
					className="px-6 py-2.5 bg-[#335833] text-white font-bold rounded-full text-sm hover:bg-[#2a4a2a] transition-colors"
				>
					Go Back
				</button>
			</div>
		);
	}

	const avatarUrl =
		profile.avatarUrl ||
		`https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name || "Creator")}&background=335833&color=fff&size=256`;

	return (
		<div className="min-h-screen bg-gray-50">
			{/* ── PROFILE HEADER ─────────────────────────────── */}
			<div className="bg-white border-b border-gray-200">
				<div className="max-w-3xl mx-auto px-4 sm:px-6">
					{/* Top bar */}
					<div className="flex items-center justify-between py-3 sm:py-4">
						<button
							onClick={() => navigate(-1)}
							className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600"
						>
							<FaArrowLeft size={16} />
						</button>
						<h2 className="text-sm font-bold text-gray-900 truncate max-w-[200px] sm:max-w-none">
							{profile.name}
						</h2>
						<div className="w-8" /> {/* spacer */}
					</div>

					{/* Profile section — Instagram layout */}
					<div className="pb-5 sm:pb-6">
						{/* Mobile: Avatar centered + info below */}
						{/* Desktop: Avatar left + info right */}
						<div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-8">
							{/* Avatar */}
							<motion.div
								initial={{ scale: 0.8, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								transition={{ type: "spring", stiffness: 200, damping: 20 }}
								className="relative shrink-0"
							>
								<div className="w-20 h-20 sm:w-[150px] sm:h-[150px] rounded-full p-[3px] bg-linear-to-tr from-[#335833] via-[#4a8a4a] to-[#6db86d]">
									<img
										src={avatarUrl}
										alt={profile.name}
										loading="eager"
										className="w-full h-full rounded-full object-cover border-[3px] border-white bg-gray-100"
									/>
								</div>
								{/* Online indicator */}
								<div className="absolute bottom-1 right-1 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-full border-2 border-white" />
							</motion.div>

							{/* Info */}
							<div className="flex-1 min-w-0 text-center sm:text-left w-full">
								{/* Name + Follow */}
								<div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-3">
									<h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
										{profile.name}
									</h1>
									<div className="flex justify-center sm:justify-start">
										<FollowButton
											creatorId={creatorId}
											creatorName={profile.name}
											size="sm"
										/>
									</div>
								</div>

								{/* ── STATS ROW ── */}
								<div className="flex items-center justify-center sm:justify-start gap-0 sm:gap-8 mb-4">
									<div className="flex-1 sm:flex-initial text-center py-2 sm:py-0">
										<span className="block text-lg sm:text-xl font-extrabold text-gray-900">
											{formatCount(profile.postCount ?? posts.length)}
										</span>
										<span className="text-[11px] sm:text-xs text-gray-500 font-medium">
											Posts
										</span>
									</div>
									<div className="w-px h-8 bg-gray-200 sm:hidden" />
									<div className="flex-1 sm:flex-initial text-center py-2 sm:py-0">
										<span className="block text-lg sm:text-xl font-extrabold text-gray-900">
											{formatCount(profile.followerCount ?? 0)}
										</span>
										<span className="text-[11px] sm:text-xs text-gray-500 font-medium">
											Followers
										</span>
									</div>
									<div className="w-px h-8 bg-gray-200 sm:hidden" />
									<div className="flex-1 sm:flex-initial text-center py-2 sm:py-0">
										<span className="block text-lg sm:text-xl font-extrabold text-[#b8860b]">
											{formatCount(profile.points ?? 0)}
										</span>
										<span className="text-[11px] sm:text-xs text-gray-500 font-medium flex items-center justify-center sm:justify-start gap-1">
											<FaStar className="text-yellow-500 text-[10px]" />
											Points
										</span>
									</div>
								</div>

								{/* Bio */}
								{profile.bio && (
									<p className="text-sm text-gray-700 leading-relaxed max-w-md mx-auto sm:mx-0 whitespace-pre-line">
										{profile.bio}
									</p>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* ── CONTENT AREA ───────────────────────────────── */}
			<div className="max-w-3xl mx-auto">
				{/* Filter tabs — icon style like Instagram */}
				<div className="bg-white border-b border-gray-200 sticky top-14 z-10">
					<div className="flex">
						{[
							{
								key: "all",
								icon: FaThLarge,
								label: "All",
								count: posts.length,
							},
							{
								key: "blog",
								icon: HiDocumentText,
								label: "Blogs",
								count: blogCount,
							},
							{
								key: "photoAudio",
								icon: HiPhotograph,
								label: "Moments",
								count: momentCount,
							},
						].map(
							(
								{ key, icon: Icon, label, count }, // eslint-disable-line no-unused-vars
							) => (
								<button
									key={key}
									onClick={() => setFilter(key)}
									className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs sm:text-sm font-bold transition-all relative ${
										filter === key
											? "text-[#335833]"
											: "text-gray-400 hover:text-gray-600"
									}`}
								>
									<Icon
										className={`text-base sm:text-lg ${filter === key ? "text-[#335833]" : ""}`}
									/>
									<span className="hidden sm:inline">{label}</span>
									<span
										className={`text-[10px] px-1.5 py-0.5 rounded-full ${filter === key ? "bg-[#335833]/10 text-[#335833]" : "bg-gray-100 text-gray-400"}`}
									>
										{count}
									</span>
									{/* Active indicator */}
									{filter === key && (
										<motion.div
											layoutId="activeTab"
											className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#335833]"
										/>
									)}
								</button>
							),
						)}
					</div>
				</div>

				{/* Posts grid */}
				<div className="px-1 sm:px-0 pt-1">
					{filteredPosts.length === 0 ? (
						<div className="text-center py-20 px-4">
							<div className="w-20 h-20 border-2 border-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
								<FaCamera className="text-gray-300 text-2xl" />
							</div>
							<h3 className="text-lg font-bold text-gray-900 mb-1">
								No Posts Yet
							</h3>
							<p className="text-sm text-gray-500 max-w-xs mx-auto">
								When {profile.name} shares photos or writes blogs, you'll see
								them here.
							</p>
						</div>
					) : (
						<div className="grid grid-cols-3 gap-0.5 sm:gap-1">
							{filteredPosts.map((post) => (
								<PostGridItem key={post.id} post={post} />
							))}
						</div>
					)}
				</div>

				{/* Infinite scroll sentinel */}
				<div ref={sentinelRef} className="h-4" />

				{loadingMore && (
					<div className="flex justify-center py-8">
						<div className="w-8 h-8 border-[3px] border-gray-200 border-t-[#335833] rounded-full animate-spin" />
					</div>
				)}

				{!hasMore && filteredPosts.length > 0 && (
					<p className="text-center text-xs text-gray-400 py-8 tracking-wide">
						— End of posts —
					</p>
				)}
			</div>
		</div>
	);
};

// ─── GRID ITEM (Instagram-style square thumbnail) ────────────────
const PostGridItem = ({ post }) => {
	const thumbnail = extractThumbnail(post);
	const isBlog = post.type === "blog";
	const hasAudio = !!post.audioUrl;
	const linkPath = isBlog ? `/blog/${post.id}` : `/socials/${post.id}`;

	return (
		<Link
			to={linkPath}
			className="relative group block aspect-square overflow-hidden bg-gray-100"
		>
			{thumbnail ? (
				<img
					src={thumbnail}
					alt={post.title || "Post"}
					loading="lazy"
					className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
					onError={(e) => {
						e.target.style.display = "none";
						e.target.nextSibling?.classList?.remove("hidden");
					}}
				/>
			) : null}

			{/* Fallback placeholder if no image */}
			{!thumbnail && (
				<div className="w-full h-full flex flex-col items-center justify-center bg-linear-to-br from-gray-100 to-gray-200 p-3 text-center">
					{isBlog ? (
						<>
							<FaPen className="text-gray-400 text-lg mb-2" />
							<p className="text-[11px] sm:text-xs font-bold text-gray-600 line-clamp-3 leading-tight">
								{post.title || "Untitled Blog"}
							</p>
						</>
					) : (
						<HiPhotograph className="text-gray-300 text-4xl" />
					)}
				</div>
			)}

			{/* Hidden fallback for broken images */}
			<div className="hidden w-full h-full absolute inset-0 flex-col items-center justify-center bg-gray-100">
				<HiPhotograph className="text-gray-300 text-3xl" />
			</div>

			{/* Hover overlay */}
			<div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
				<div className="flex items-center gap-4 text-white text-sm font-bold">
					<span className="flex items-center gap-1">
						<FaHeart size={14} />
						{post.likeCount || 0}
					</span>
					<span className="flex items-center gap-1">
						<FaComment size={14} />
						{post.commentCount || 0}
					</span>
				</div>
			</div>

			{/* Type badge (top-right) */}
			<div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2">
				{isBlog ? (
					<div className="bg-white/90 backdrop-blur-sm rounded-md p-1 shadow-sm">
						<FaPen className="text-gray-600 text-[10px]" />
					</div>
				) : hasAudio ? (
					<div className="bg-white/90 backdrop-blur-sm rounded-md p-1 shadow-sm">
						<FaPlay className="text-gray-600 text-[10px]" />
					</div>
				) : null}
			</div>
		</Link>
	);
};

export default CreatorProfile;
