import React from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import AppRoutes from "./routes";

function App() {
	return (
		<ThemeProvider>
			<LanguageProvider>
				<AuthProvider>
					<AppRoutes />
				</AuthProvider>
			</LanguageProvider>
		</ThemeProvider>
	);
}

export default App;
