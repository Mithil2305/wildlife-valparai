import { StrictMode, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { initializeFirebase } from "./services/firebase.js";
import LoadingSpinner from "./components/LoadingSpinner.jsx";

/**
 * Root component that initializes Firebase before rendering the app
 */
const Root = () => {
	const [isInitialized, setIsInitialized] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		const init = async () => {
			try {
				await initializeFirebase();
				setIsInitialized(true);
			} catch (err) {
				console.error("Failed to initialize app:", err);
				setError(err.message);
			}
		};
		init();
	}, []);

	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-100">
				<div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
					<h1 className="text-2xl font-bold text-red-600 mb-4">
						Initialization Error
					</h1>
					<p className="text-gray-600 mb-4">
						Failed to connect to the server. Please check your internet
						connection and try again.
					</p>
					<button
						onClick={() => window.location.reload()}
						className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
					>
						Retry
					</button>
				</div>
			</div>
		);
	}

	if (!isInitialized) {
		return <LoadingSpinner />;
	}

	return (
		<BrowserRouter>
			<App />
		</BrowserRouter>
	);
};

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<Root />
	</StrictMode>
);
