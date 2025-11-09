import { useState } from "react";

const ContentSwitcher = ({ tabs, defaultTab = 0, className = "" }) => {
	const [activeTab, setActiveTab] = useState(defaultTab);

	if (!tabs || tabs.length === 0) {
		return (
			<div className="text-center p-8 text-[#609966]">No content available</div>
		);
	}

	return (
		<div
			className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-[#9DC08B]/20 overflow-hidden ${className}`}
		>
			{/* Tab Headers */}
			<div className="flex border-b-2 border-[#9DC08B]/20 bg-gradient-to-r from-[#EDF1D6] to-[#9DC08B]/20 overflow-x-auto">
				{tabs.map((tab, index) => (
					<button
						key={index}
						onClick={() => setActiveTab(index)}
						className={`flex-1 min-w-fit px-6 py-4 font-bold text-sm transition-all duration-300 relative ${
							activeTab === index
								? "text-white bg-gradient-to-r from-[#609966] to-[#40513B]"
								: "text-[#609966] hover:bg-white/50"
						}`}
					>
						{/* Icon */}
						{tab.icon && (
							<span className="inline-block mr-2 text-lg">{tab.icon}</span>
						)}

						{/* Label */}
						<span>{tab.label}</span>

						{/* Badge */}
						{tab.badge && (
							<span
								className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
									activeTab === index
										? "bg-white/20"
										: "bg-[#609966]/20 text-[#40513B]"
								}`}
							>
								{tab.badge}
							</span>
						)}

						{/* Active Indicator */}
						{activeTab === index && (
							<div className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-t-full"></div>
						)}
					</button>
				))}
			</div>

			{/* Tab Content */}
			<div className="p-6">
				{tabs[activeTab]?.content ? (
					<div className="animate-fadeIn">{tabs[activeTab].content}</div>
				) : (
					<div className="text-center py-12">
						<div className="text-6xl mb-4">📭</div>
						<p className="text-[#609966] text-lg font-medium">
							No content to display
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

// Grid View Component
export const GridView = ({
	items,
	renderItem,
	emptyMessage = "No items found",
}) => {
	if (!items || items.length === 0) {
		return (
			<div className="text-center py-12">
				<div className="text-6xl mb-4">🔍</div>
				<p className="text-[#609966] text-lg">{emptyMessage}</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{items.map((item, index) => (
				<div
					key={item.id || index}
					className="animate-fadeIn"
					style={{ animationDelay: `${index * 0.1}s` }}
				>
					{renderItem(item)}
				</div>
			))}
		</div>
	);
};

// List View Component
export const ListView = ({
	items,
	renderItem,
	emptyMessage = "No items found",
}) => {
	if (!items || items.length === 0) {
		return (
			<div className="text-center py-12">
				<div className="text-6xl mb-4">📋</div>
				<p className="text-[#609966] text-lg">{emptyMessage}</p>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{items.map((item, index) => (
				<div
					key={item.id || index}
					className="animate-fadeIn"
					style={{ animationDelay: `${index * 0.05}s` }}
				>
					{renderItem(item)}
				</div>
			))}
		</div>
	);
};

// Filter Bar Component
export const FilterBar = ({
	filters,
	activeFilters,
	onFilterChange,
	className = "",
}) => {
	const toggleFilter = (filterKey, value) => {
		const current = activeFilters[filterKey] || [];
		const updated = current.includes(value)
			? current.filter((v) => v !== value)
			: [...current, value];

		onFilterChange({
			...activeFilters,
			[filterKey]: updated,
		});
	};

	return (
		<div
			className={`bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border-2 border-[#9DC08B]/20 ${className}`}
		>
			{filters.map((filter, index) => (
				<div
					key={index}
					className={index > 0 ? "mt-4 pt-4 border-t border-[#9DC08B]/20" : ""}
				>
					<h4 className="text-sm font-bold text-[#40513B] mb-3 flex items-center">
						{filter.icon && <span className="mr-2">{filter.icon}</span>}
						{filter.label}
					</h4>
					<div className="flex flex-wrap gap-2">
						{filter.options.map((option, optIndex) => {
							const isActive = activeFilters[filter.key]?.includes(
								option.value
							);
							return (
								<button
									key={optIndex}
									onClick={() => toggleFilter(filter.key, option.value)}
									className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
										isActive
											? "bg-gradient-to-r from-[#609966] to-[#40513B] text-white scale-105"
											: "bg-[#EDF1D6] text-[#609966] hover:bg-[#9DC08B]/30"
									}`}
								>
									{option.label}
									{option.count !== undefined && (
										<span
											className={`ml-1 ${isActive ? "text-white/80" : "text-[#609966]/60"}`}
										>
											({option.count})
										</span>
									)}
								</button>
							);
						})}
					</div>
				</div>
			))}

			{/* Clear Filters */}
			{Object.values(activeFilters).some((f) => f && f.length > 0) && (
				<button
					onClick={() => onFilterChange({})}
					className="mt-4 w-full px-4 py-2 bg-red-100 text-red-600 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
				>
					Clear All Filters
				</button>
			)}
		</div>
	);
};

// Search Bar Component
export const SearchBar = ({
	value,
	onChange,
	placeholder = "Search...",
	className = "",
}) => {
	return (
		<div className={`relative ${className}`}>
			<input
				type="text"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder={placeholder}
				className="w-full px-4 py-3 pl-12 rounded-xl border-2 border-[#9DC08B]/30 focus:border-[#609966] focus:outline-none transition-colors bg-white/90 backdrop-blur-sm text-[#40513B] placeholder-[#609966]/50"
			/>
			<span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl">
				🔍
			</span>
			{value && (
				<button
					onClick={() => onChange("")}
					className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#609966] hover:text-[#40513B] transition-colors"
				>
					✕
				</button>
			)}
		</div>
	);
};

export default ContentSwitcher;
