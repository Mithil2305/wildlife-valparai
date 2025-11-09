import { useContentView } from "../../contexts/ContentViewContext";

const ViewToggle = ({ className = "" }) => {
	const { view, setView } = useContentView();

	const views = [
		{ id: "grid", name: "Grid", icon: "◫" },
		{ id: "list", name: "List", icon: "☰" },
		{ id: "map", name: "Map", icon: "🗺️" },
	];

	return (
		<div
			className={`inline-flex bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border-2 border-[#9DC08B]/20 p-1 ${className}`}
		>
			{views.map((viewOption) => (
				<button
					key={viewOption.id}
					onClick={() => setView(viewOption.id)}
					className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 flex items-center space-x-2 ${
						view === viewOption.id
							? "bg-gradient-to-r from-[#609966] to-[#40513B] text-white shadow-lg scale-105"
							: "text-[#609966] hover:bg-[#EDF1D6]"
					}`}
					title={`${viewOption.name} View`}
				>
					<span className="text-lg">{viewOption.icon}</span>
					<span className="hidden sm:inline">{viewOption.name}</span>
				</button>
			))}
		</div>
	);
};

export default ViewToggle;
