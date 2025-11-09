// Content View Context - Toggle between Photo/Audio and Blog views
import { createContext, useContext, useState, useEffect } from "react";

const ContentViewContext = createContext();

export const useContentViewContext = () => {
	const context = useContext(ContentViewContext);
	if (!context) {
		throw new Error(
			"useContentViewContext must be used within ContentViewProvider"
		);
	}
	return context;
};

export const ContentViewProvider = ({ children }) => {
	const [viewMode, setViewMode] = useState("photos"); // 'photos' or 'blogs'

	// Load view mode from localStorage on mount
	useEffect(() => {
		const savedViewMode = localStorage.getItem("contentViewMode");
		if (savedViewMode === "photos" || savedViewMode === "blogs") {
			setViewMode(savedViewMode);
		}
	}, []);

	// Toggle between views
	const toggleView = () => {
		const newMode = viewMode === "photos" ? "blogs" : "photos";
		setViewMode(newMode);
		localStorage.setItem("contentViewMode", newMode);
	};

	// Set specific view
	const setView = (mode) => {
		if (mode === "photos" || mode === "blogs") {
			setViewMode(mode);
			localStorage.setItem("contentViewMode", mode);
		}
	};

	const value = {
		viewMode,
		toggleView,
		setView,
		isPhotoView: viewMode === "photos",
		isBlogView: viewMode === "blogs",
	};

	return (
		<ContentViewContext.Provider value={value}>
			{children}
		</ContentViewContext.Provider>
	);
};

export default ContentViewContext;
