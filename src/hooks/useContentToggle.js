// useContentToggle Hook - Photo/blog view toggle operations
import { useContentViewContext } from "../contexts/ContentViewContext";

export const useContentToggle = () => {
	const context = useContentViewContext();

	if (!context) {
		throw new Error("useContentToggle must be used within ContentViewProvider");
	}

	return {
		viewMode: context.viewMode,
		isPhotoView: context.viewMode === "photo",
		isBlogView: context.viewMode === "blog",
		toggleView: context.toggleView,
		setPhotoView: () => context.toggleView("photo"),
		setBlogView: () => context.toggleView("blog"),
	};
};

export default useContentToggle;
