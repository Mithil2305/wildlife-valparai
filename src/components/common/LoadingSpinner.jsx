const LoadingSpinner = ({ size = "large", message = "Loading..." }) => {
	const sizeClasses = {
		small: "h-6 w-6",
		medium: "h-10 w-10",
		large: "h-16 w-16",
	};

	return (
		<div className="flex flex-col justify-center items-center p-8 min-h-[200px]">
			<div className="relative">
				{/* Outer spinning ring */}
				<div
					className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-[#EDF1D6]`}
					style={{
						borderTopColor: "#609966",
						borderRightColor: "#9DC08B",
					}}
				></div>
				{/* Inner pulsing circle */}
				<div className="absolute inset-0 flex items-center justify-center">
					<div className="w-3 h-3 bg-gradient-to-r from-[#609966] to-[#40513B] rounded-full animate-pulse"></div>
				</div>
			</div>
			{message && (
				<p className="mt-4 text-[#609966] font-medium animate-pulse">
					{message}
				</p>
			)}
		</div>
	);
};

export default LoadingSpinner;
