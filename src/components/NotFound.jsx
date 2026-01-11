import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { HiHome, HiArrowLeft, HiMap } from "react-icons/hi";
import { FaLeaf, FaBinoculars, FaTree } from "react-icons/fa";

const NotFound = () => {
	const navigate = useNavigate();

	// Floating animation for leaves
	const leafVariants = {
		animate: (i) => ({
			y: [0, -15, 0],
			x: [0, 10, 0],
			rotate: [0, 10, -10, 0],
			transition: {
				duration: 4 + i,
				repeat: Infinity,
				ease: "easeInOut",
			},
		}),
	};

	return (
		<div className="min-h-screen bg-[#F3F4F6] relative overflow-hidden flex items-center justify-center p-4">
			{/* --- Background Elements --- */}
			<div className="absolute inset-0 pointer-events-none overflow-hidden">
				{/* Gradient Blob */}
				<div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-green-100 rounded-full blur-3xl opacity-60 animate-pulse"></div>
				<div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#335833] rounded-full blur-[100px] opacity-10"></div>

				{/* Floating Leaves */}
				{[1, 2, 3, 4, 5].map((i) => (
					<motion.div
						key={i}
						custom={i}
						variants={leafVariants}
						animate="animate"
						className="absolute text-green-200/50"
						style={{
							top: `${Math.random() * 100}%`,
							left: `${Math.random() * 100}%`,
							fontSize: `${Math.random() * 40 + 20}px`,
						}}
					>
						<FaLeaf />
					</motion.div>
				))}
			</div>

			{/* --- Main Content Card --- */}
			<motion.div
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.5 }}
				className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl rounded-[3rem] p-8 md:p-12 max-w-2xl w-full text-center relative z-10"
			>
				{/* Animated 404 Illustration */}
				<div className="relative h-48 md:h-64 mb-8 flex justify-center items-center">
					{/* 404 Text behind */}
					<h1 className="text-[150px] md:text-[200px] font-black text-gray-100 absolute select-none">
						404
					</h1>

					{/* Binoculars Animation */}
					<motion.div
						initial={{ y: 20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ delay: 0.2 }}
						className="relative z-10 bg-white p-6 rounded-full shadow-lg border-4 border-[#335833] text-[#335833]"
					>
						<motion.div
							animate={{ rotate: [0, -10, 10, 0] }}
							transition={{
								duration: 2,
								repeat: Infinity,
								repeatDelay: 1,
								ease: "easeInOut",
							}}
						>
							<FaBinoculars size={64} />
						</motion.div>
					</motion.div>

					{/* Trees popping up */}
					<motion.div
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						transition={{ delay: 0.4, type: "spring" }}
						className="absolute bottom-4 left-1/4 text-green-600"
					>
						<FaTree size={40} />
					</motion.div>
					<motion.div
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						transition={{ delay: 0.5, type: "spring" }}
						className="absolute bottom-8 right-1/4 text-green-400"
					>
						<FaTree size={32} />
					</motion.div>
				</div>

				{/* Text Content */}
				<div className="space-y-4 mb-10">
					<motion.h2
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3 }}
						className="text-3xl md:text-4xl font-bold text-gray-900"
					>
						Lost in the Wild?
					</motion.h2>
					<motion.p
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.4 }}
						className="text-gray-600 text-lg max-w-md mx-auto"
					>
						It looks like you've ventured off the marked trail. The page you're
						looking for doesn't exist or has been moved.
					</motion.p>
				</div>

				{/* Action Buttons */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.5 }}
					className="flex flex-col sm:flex-row gap-4 justify-center"
				>
					<button
						onClick={() => navigate(-1)}
						className="flex items-center justify-center gap-2 px-8 py-3.5 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition-all active:scale-95"
					>
						<HiArrowLeft /> Go Back
					</button>
					<Link
						to="/"
						className="flex items-center justify-center gap-2 px-8 py-3.5 bg-[#335833] text-white font-bold rounded-2xl hover:bg-[#2a4a2a] transition-all shadow-lg shadow-green-900/20 active:scale-95 group"
					>
						<HiHome /> Return to Base
					</Link>
				</motion.div>

				{/* Footer Hint */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 1 }}
					className="mt-12 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-sm text-gray-400"
				>
					<HiMap />
					<span>Coordinates: Unknown Sector</span>
				</motion.div>
			</motion.div>
		</div>
	);
};

export default NotFound;
