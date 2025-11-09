// Language Context - Manages i18n (English, Tamil, Hindi)
import { createContext, useContext, useState, useEffect } from "react";
import { LANGUAGES } from "../utils/constants";

const LanguageContext = createContext();

export const useLanguageContext = () => {
	const context = useContext(LanguageContext);
	if (!context) {
		throw new Error("useLanguageContext must be used within LanguageProvider");
	}
	return context;
};

export const LanguageProvider = ({ children }) => {
	const [language, setLanguage] = useState(LANGUAGES.EN.code);
	const [translations, setTranslations] = useState({});
	const [loading, setLoading] = useState(false);

	// Load language from localStorage on mount
	useEffect(() => {
		const savedLanguage = localStorage.getItem("language");
		if (
			savedLanguage &&
			[LANGUAGES.EN.code, LANGUAGES.TA.code, LANGUAGES.HI.code].includes(
				savedLanguage
			)
		) {
			setLanguage(savedLanguage);
			loadTranslations(savedLanguage);
		} else {
			loadTranslations(LANGUAGES.EN.code);
		}
	}, []);

	// Load translations for a language
	const loadTranslations = async (lang) => {
		try {
			setLoading(true);
			const response = await fetch(`/assets/translations/${lang}.json`);
			if (response.ok) {
				const data = await response.json();
				setTranslations(data);
			} else {
				console.error(`Failed to load translations for ${lang}`);
				// Fallback to English
				if (lang !== LANGUAGES.EN.code) {
					const fallbackResponse = await fetch(
						`/assets/translations/${LANGUAGES.EN.code}.json`
					);
					if (fallbackResponse.ok) {
						const fallbackData = await fallbackResponse.json();
						setTranslations(fallbackData);
					}
				}
			}
		} catch (error) {
			console.error("Error loading translations:", error);
		} finally {
			setLoading(false);
		}
	};

	// Change language
	const changeLanguage = async (newLang) => {
		if (
			[LANGUAGES.EN.code, LANGUAGES.TA.code, LANGUAGES.HI.code].includes(
				newLang
			)
		) {
			setLanguage(newLang);
			localStorage.setItem("language", newLang);
			await loadTranslations(newLang);
		}
	};

	// Get translation by key
	const t = (key, defaultValue = key) => {
		const keys = key.split(".");
		let value = translations;

		for (const k of keys) {
			if (value && typeof value === "object" && k in value) {
				value = value[k];
			} else {
				return defaultValue;
			}
		}

		return typeof value === "string" ? value : defaultValue;
	};

	// Get current language info
	const getCurrentLanguage = () => {
		switch (language) {
			case LANGUAGES.EN.code:
				return LANGUAGES.EN;
			case LANGUAGES.TA.code:
				return LANGUAGES.TA;
			case LANGUAGES.HI.code:
				return LANGUAGES.HI;
			default:
				return LANGUAGES.EN;
		}
	};

	const value = {
		language,
		translations,
		loading,
		changeLanguage,
		t,
		getCurrentLanguage,
		availableLanguages: [LANGUAGES.EN, LANGUAGES.TA, LANGUAGES.HI],
	};

	return (
		<LanguageContext.Provider value={value}>
			{children}
		</LanguageContext.Provider>
	);
};

export default LanguageContext;
