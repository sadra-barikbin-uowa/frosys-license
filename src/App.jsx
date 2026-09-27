import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { SettingsProvider } from "./context/SettingsContext";
import AppRoutes from "./routes/AppRoutes";

function App() {
	return (
		<BrowserRouter>
			<ToastProvider>
				<SettingsProvider>
					<AuthProvider>
						<AppRoutes />
					</AuthProvider>
				</SettingsProvider>
			</ToastProvider>
		</BrowserRouter>
	);
}

export default App;
