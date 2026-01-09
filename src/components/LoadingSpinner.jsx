import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LoadingSpinner = () => {
	// Status text cycle to keep user engaged
	const loadingStates = [
		"Initializing...",
		"Loading Assets...",
		"Syncing Data...",
		"Almost There...",
	];
	const [currentState, setCurrentState] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentState((prev) => (prev + 1) % loadingStates.length);
		}, 2000);
		return () => clearInterval(interval);
	}, []);

	// Animation variants for the four shifting squares
	const blockVariants = {
		initial: {
			scale: 1,
			rotate: 0,
			borderRadius: "15%",
		},
		animate: (i) => ({
			scale: [1, 0.8, 0.8, 1, 1],
			rotate: [0, 90, 180, 180, 0],
			borderRadius: ["15%", "50%", "50%", "15%", "15%"],
			x: i === 0 || i === 2 ? [0, -20, -20, 0, 0] : [0, 20, 20, 0, 0],
			y: i === 0 || i === 1 ? [0, -20, -20, 0, 0] : [0, 20, 20, 0, 0],
			transition: {
				duration: 2.5,
				repeat: Infinity,
				ease: "easeInOut",
				times: [0, 0.25, 0.5, 0.75, 1],
				delay: i * 0.1, // Stagger effect
			},
		}),
	};

	return (
		<div className="flex flex-col items-center justify-center gap-10 p-4 min-h-screen w-full">
			{/* The Graphic Animation */}
			<div className="relative w-24 h-24 flex items-center justify-center">
				{/* Decorative Background Blur/Pulse */}
				<motion.div
					className="absolute inset-0 bg-[#335833]/20 blur-2xl rounded-full"
					animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 0.6, 0.3] }}
					transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
				/>

				{/* The 2x2 Grid Layout */}
				<div className="grid grid-cols-2 gap-0 relative z-10">
					{[0, 1, 2, 3].map((index) => (
						<motion.div
							key={index}
							custom={index}
							variants={blockVariants}
							initial="initial"
							animate="animate"
							className="w-8 h-8 bg-gradient-to-r from-[#335833] to-[#4a7d4a] shadow-lg shadow-[#335833]/30 backdrop-blur-sm"
						/>
					))}
				</div>
			</div>

			{/* The Text Animation */}
			<div className="h-8 relative flex flex-col items-center justify-center overflow-hidden">
				<AnimatePresence mode="wait">
					<motion.p
						key={currentState}
						initial={{ y: 20, opacity: 0, filter: "blur(5px)" }}
						animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
						exit={{ y: -20, opacity: 0, filter: "blur(5px)" }}
						transition={{ duration: 0.5, ease: "easeOut" }}
						className="text-[#335833] font-mono text-sm tracking-[0.2em] font-medium uppercase whitespace-nowrap"
					>
						{loadingStates[currentState]}
					</motion.p>
				</AnimatePresence>

				{/* Small progress bar line */}
				<motion.div
					className="h-0.5 bg-[#335833]/50 mt-2 rounded-full"
					initial={{ width: 0 }}
					animate={{ width: 60 }}
					transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
				/>
			</div>
		</div>
	);
};

export default LoadingSpinner;
