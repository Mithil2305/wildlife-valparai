// Theme Context - Manages dark/light mode
import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const useThemeContext = () => {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error("useThemeContext must be used within ThemeProvider");
	}
	return context;
};

export const ThemeProvider = ({ children }) => {
	const [theme, setTheme] = useState("light");

	// Load theme from localStorage on mount
	useEffect(() => {
		const savedTheme = localStorage.getItem("theme");
		if (savedTheme) {
			setTheme(savedTheme);
			applyTheme(savedTheme);
		} else {
			// Check system preference
			const prefersDark = window.matchMedia(
				"(prefers-color-scheme: dark)"
			).matches;
			const initialTheme = prefersDark ? "dark" : "light";
			setTheme(initialTheme);
			applyTheme(initialTheme);
		}
	}, []);

	// Apply theme to document
	const applyTheme = (newTheme) => {
		if (newTheme === "dark") {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	};

	// Toggle theme
	const toggleTheme = () => {
		const newTheme = theme === "light" ? "dark" : "light";
		setTheme(newTheme);
		localStorage.setItem("theme", newTheme);
		applyTheme(newTheme);
	};

	// Set specific theme
	const setSpecificTheme = (newTheme) => {
		if (newTheme === "light" || newTheme === "dark") {
			setTheme(newTheme);
			localStorage.setItem("theme", newTheme);
			applyTheme(newTheme);
		}
	};

	const value = {
		theme,
		toggleTheme,
		setTheme: setSpecificTheme,
		isDark: theme === "dark",
	};

	return (
		<ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
	);
};

export default ThemeContext;
