import React from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { PointsProvider } from "./contexts/PointsContext";
import AppRoutes from "./routes";

function App() {
	return (
		<ThemeProvider>
			<LanguageProvider>
				<AuthProvider>
					<PointsProvider>
						<AppRoutes />
					</PointsProvider>
				</AuthProvider>
			</LanguageProvider>
		</ThemeProvider>
	);
}

export default App;
