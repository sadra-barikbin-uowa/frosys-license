import { createContext, useContext, useEffect, useState } from "react";
import { settingsService } from "../services/settingsService";

const SettingsContext = createContext(null);

export const SettingsProvider = ({ children }) => {
	const [settings, setSettings] = useState(() =>
		settingsService.getSettingsSync(),
	);

	useEffect(() => {
		document.title = settings.systemName;
	}, [settings.systemName]);

	const updateSettings = async (updates) => {
		const saved = await settingsService.updateSettings(updates);
		setSettings(saved);
		return saved;
	};

	return (
		<SettingsContext.Provider value={{ settings, updateSettings }}>
			{children}
		</SettingsContext.Provider>
	);
};

export const useSettings = () => {
	const context = useContext(SettingsContext);
	if (!context)
		throw new Error("useSettings must be used within SettingsProvider");
	return context;
};
