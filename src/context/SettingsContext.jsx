import { useCallback, useMemo, useState } from "react";
import { settingsService } from "../services/settingsService";
import { setExpiringSoonDays } from "../utils/badgeStatus";
import { SettingsContext } from "./contexts";

export const SettingsProvider = ({ children }) => {
	const [settings, setSettings] = useState(() => {
		const initial = settingsService.getSettingsSync();
		setExpiringSoonDays(initial.expiringSoonDays);
		return initial;
	});

	const updateSettings = useCallback(async (updates) => {
		const saved = await settingsService.updateSettings(updates);
		// يجب تحديث عتبة "قريب الانتهاء" قبل إعادة العرض حتى تظهر الحالات الجديدة فورًا
		setExpiringSoonDays(saved.expiringSoonDays);
		setSettings(saved);
		return saved;
	}, []);

	const value = useMemo(() => ({ settings, updateSettings }), [settings, updateSettings]);

	return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};
