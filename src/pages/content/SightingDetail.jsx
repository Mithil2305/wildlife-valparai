import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import CommentBox from "../../components/content/CommentBox";

const SightingDetail = () => {
	const { id } = useParams();
	const [sighting, setSighting] = useState(null);
	const [loading, setLoading] = useState(true);
	const [liked, setLiked] = useState(false);

	useEffect(() => {
		const loadSighting = () => {
			setLoading(true);
			// Simulate API call
			setTimeout(() => {
				setSighting({
					id,
					title: "Elephant Herd Crossing",
					species: "Asian Elephant",
					location: "Valparai Tea Estate, Tamil Nadu",
					date: "2024-01-15",
					time: "06:30 AM",
					weather: "Clear",
					imageUrl: "/placeholder.jpg",
					author: {
						name: "Rajesh Kumar",
						avatar: "👨",
						points: 5420,
					},
					likes: 124,
					comments: 18,
					views: 542,
					description:
						"A magnificent herd of approximately 15 elephants was spotted crossing the tea estate early this morning. The herd included several calves and was moving peacefully towards the forest corridor. This is a regular migration route for elephants in the Anamalai region.",
					tags: ["elephant", "herd", "migration", "valparai"],
					coordinates: { lat: 10.3269, lng: 76.953 },
				});
				setLoading(false);
			}, 1000);
		};
		loadSighting();
	}, [id]);

	const handleLike = () => {
		setLiked(!liked);
		setSighting({
			...sighting,
			likes: liked ? sighting.likes - 1 : sighting.likes + 1,
		});
	};

	const handleShare = () => {
		navigator.clipboard.writeText(window.location.href);
		alert("Link copied to clipboard!");
	};

	if (loading) {
		return <LoadingSpinner message="Loading sighting details..." />;
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-[#EDF1D6] via-white to-[#9DC08B]/20 py-8">
			<div className="max-w-5xl mx-auto px-4">
				{/* Breadcrumb */}
				<div className="mb-6 flex items-center space-x-2 text-sm text-[#609966]">
					<Link to="/sightings" className="hover:text-[#40513B]">
						Sightings
					</Link>
					<span>›</span>
					<span className="text-[#40513B] font-medium">{sighting.title}</span>
				</div>

				{/* Main Content */}
				<div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border-2 border-[#9DC08B]/20 overflow-hidden">
					{/* Image */}
					<div className="w-full h-96 bg-gradient-to-r from-[#EDF1D6] to-[#9DC08B]/30 flex items-center justify-center">
						<div className="text-9xl">📸</div>
					</div>

					{/* Content */}
					<div className="p-8">
						{/* Title and Actions */}
						<div className="mb-6">
							<h1 className="text-4xl font-bold text-[#40513B] mb-4">
								{sighting.title}
							</h1>
							<div className="flex items-center justify-between">
								<div className="flex items-center space-x-4">
									<div className="flex items-center space-x-2">
										<span className="text-2xl">{sighting.author.avatar}</span>
										<div>
											<div className="font-bold text-[#40513B]">
												{sighting.author.name}
											</div>
											<div className="text-sm text-[#609966]">
												⭐ {sighting.author.points} points
											</div>
										</div>
									</div>
								</div>
								<div className="flex space-x-3">
									<button
										onClick={handleLike}
										className={`px-6 py-3 rounded-xl font-bold transition-all ${
											liked
												? "bg-red-500 text-white"
												: "bg-[#EDF1D6] text-[#609966] hover:bg-[#9DC08B]/30"
										}`}
									>
										❤️ {sighting.likes}
									</button>
									<button
										onClick={handleShare}
										className="px-6 py-3 bg-[#EDF1D6] text-[#609966] rounded-xl font-bold hover:bg-[#9DC08B]/30 transition-all"
									>
										🔗 Share
									</button>
								</div>
							</div>
						</div>

						{/* Species Info */}
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
							<div className="bg-[#EDF1D6] rounded-xl p-4">
								<div className="text-2xl mb-1">🦁</div>
								<div className="text-sm text-[#609966]">Species</div>
								<div className="font-bold text-[#40513B]">
									{sighting.species}
								</div>
							</div>
							<div className="bg-[#EDF1D6] rounded-xl p-4">
								<div className="text-2xl mb-1">📍</div>
								<div className="text-sm text-[#609966]">Location</div>
								<div className="font-bold text-[#40513B]">
									{sighting.location.split(",")[0]}
								</div>
							</div>
							<div className="bg-[#EDF1D6] rounded-xl p-4">
								<div className="text-2xl mb-1">📅</div>
								<div className="text-sm text-[#609966]">Date & Time</div>
								<div className="font-bold text-[#40513B]">
									{sighting.date}
									<div className="text-xs">{sighting.time}</div>
								</div>
							</div>
							<div className="bg-[#EDF1D6] rounded-xl p-4">
								<div className="text-2xl mb-1">☀️</div>
								<div className="text-sm text-[#609966]">Weather</div>
								<div className="font-bold text-[#40513B]">
									{sighting.weather}
								</div>
							</div>
						</div>

						{/* Description */}
						<div className="mb-8">
							<h2 className="text-2xl font-bold text-[#40513B] mb-4">
								Description
							</h2>
							<p className="text-[#609966] leading-relaxed">
								{sighting.description}
							</p>
						</div>

						{/* Tags */}
						<div className="mb-8">
							<h3 className="text-xl font-bold text-[#40513B] mb-3">Tags</h3>
							<div className="flex flex-wrap gap-2">
								{sighting.tags.map((tag) => (
									<span
										key={tag}
										className="px-4 py-2 bg-[#EDF1D6] text-[#609966] rounded-xl font-medium hover:bg-[#9DC08B]/30 transition-colors cursor-pointer"
									>
										#{tag}
									</span>
								))}
							</div>
						</div>

						{/* Stats */}
						<div className="flex items-center space-x-6 text-[#609966] mb-8 pb-8 border-b-2 border-[#EDF1D6]">
							<span>👁️ {sighting.views} views</span>
							<span>❤️ {sighting.likes} likes</span>
							<span>💬 {sighting.comments} comments</span>
						</div>

						{/* Comments */}
						<CommentBox postId={id} postType="sighting" />
					</div>
				</div>

				{/* Related Sightings */}
				<div className="mt-8">
					<h2 className="text-2xl font-bold text-[#40513B] mb-4">
						Related Sightings
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{[1, 2, 3].map((i) => (
							<div
								key={i}
								className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-[#9DC08B]/20 overflow-hidden hover:scale-105 transition-transform cursor-pointer"
							>
								<div className="h-48 bg-gradient-to-r from-[#EDF1D6] to-[#9DC08B]/30 flex items-center justify-center text-6xl">
									📸
								</div>
								<div className="p-4">
									<h3 className="font-bold text-[#40513B] mb-2">
										Related Sighting {i}
									</h3>
									<p className="text-sm text-[#609966]">
										Click to view details
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default SightingDetail;
