import { useState, useEffect } from "react";

const AdsContainer = ({ position = "sidebar", className = "" }) => {
	const [currentAdIndex, setCurrentAdIndex] = useState(0);
	const [isVisible, setIsVisible] = useState(true);

	// Mock ads data - would come from API in real implementation
	const ads = [
		{
			id: 1,
			title: "Support Wildlife Conservation",
			description: "Your donation helps protect endangered species",
			image: "🦁",
			link: "/donate",
			color: "from-[#609966] to-[#40513B]",
		},
		{
			id: 2,
			title: "Binoculars Sale",
			description: "Premium wildlife viewing equipment - 30% off",
			image: "🔭",
			link: "#",
			color: "from-[#9DC08B] to-[#609966]",
		},
		{
			id: 3,
			title: "Wildlife Photography Course",
			description: "Learn from the experts. Enroll now!",
			image: "📷",
			link: "#",
			color: "from-[#609966] to-[#40513B]",
		},
	];

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentAdIndex((prev) => (prev + 1) % ads.length);
		}, 5000);

		return () => clearInterval(interval);
	}, [ads.length]);

	const currentAd = ads[currentAdIndex];

	const handleClose = () => {
		setIsVisible(false);
	};

	if (!isVisible) return null;

	// Sidebar ad style
	if (position === "sidebar") {
		return (
			<div
				className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border-2 border-[#9DC08B]/20 ${className}`}
			>
				<div className="relative">
					<button
						onClick={handleClose}
						className="absolute top-2 right-2 w-6 h-6 bg-white/80 rounded-full flex items-center justify-center text-[#40513B] hover:bg-white transition-all z-10"
						title="Close ad"
					>
						✕
					</button>

					<div
						className={`bg-gradient-to-br ${currentAd.color} p-6 text-white text-center`}
					>
						<div className="text-6xl mb-3">{currentAd.image}</div>
						<h3 className="text-lg font-bold mb-2">{currentAd.title}</h3>
						<p className="text-sm text-white/90 mb-4">
							{currentAd.description}
						</p>
						<a
							href={currentAd.link}
							className="inline-block px-6 py-2 bg-white text-[#40513B] rounded-xl font-bold hover:scale-105 transition-all shadow-lg"
						>
							Learn More
						</a>
					</div>
				</div>

				{/* Ad Indicators */}
				<div className="flex justify-center space-x-2 py-3 bg-[#EDF1D6]">
					{ads.map((_, index) => (
						<button
							key={index}
							onClick={() => setCurrentAdIndex(index)}
							className={`w-2 h-2 rounded-full transition-all ${
								index === currentAdIndex
									? "bg-[#609966] w-6"
									: "bg-[#9DC08B]/50 hover:bg-[#9DC08B]"
							}`}
						/>
					))}
				</div>
			</div>
		);
	}

	// Banner ad style
	if (position === "banner") {
		return (
			<div
				className={`bg-gradient-to-r ${currentAd.color} rounded-2xl shadow-xl overflow-hidden border-2 border-[#9DC08B]/20 relative ${className}`}
			>
				<button
					onClick={handleClose}
					className="absolute top-2 right-2 w-6 h-6 bg-white/80 rounded-full flex items-center justify-center text-[#40513B] hover:bg-white transition-all z-10"
					title="Close ad"
				>
					✕
				</button>

				<div className="flex items-center justify-between p-6 text-white">
					<div className="flex items-center space-x-4">
						<div className="text-5xl">{currentAd.image}</div>
						<div>
							<h3 className="text-xl font-bold mb-1">{currentAd.title}</h3>
							<p className="text-white/90">{currentAd.description}</p>
						</div>
					</div>
					<a
						href={currentAd.link}
						className="px-6 py-3 bg-white text-[#40513B] rounded-xl font-bold hover:scale-105 transition-all shadow-lg whitespace-nowrap"
					>
						Learn More
					</a>
				</div>
			</div>
		);
	}

	// Inline ad style
	return (
		<div
			className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border-2 border-[#9DC08B]/20 ${className}`}
		>
			<div className="relative flex items-center p-4 space-x-4">
				<button
					onClick={handleClose}
					className="absolute top-2 right-2 w-6 h-6 bg-white/80 rounded-full flex items-center justify-center text-[#40513B] hover:bg-white transition-all z-10 text-xs"
					title="Close ad"
				>
					✕
				</button>

				<div
					className={`w-16 h-16 bg-gradient-to-br ${currentAd.color} rounded-xl flex items-center justify-center text-3xl flex-shrink-0`}
				>
					{currentAd.image}
				</div>

				<div className="flex-1 min-w-0">
					<h4 className="text-[#40513B] font-bold text-sm mb-1">
						{currentAd.title}
					</h4>
					<p className="text-[#609966] text-xs">{currentAd.description}</p>
				</div>

				<a
					href={currentAd.link}
					className="px-4 py-2 bg-gradient-to-r from-[#609966] to-[#40513B] text-white rounded-lg font-medium text-sm hover:scale-105 transition-all whitespace-nowrap flex-shrink-0"
				>
					View
				</a>
			</div>
		</div>
	);
};

export default AdsContainer;
