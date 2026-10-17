import { useContext } from "react";
import { SettingsContext } from "../context/contexts";

export const useSettings = () => {
	const ctx = useContext(SettingsContext);
	if (!ctx) throw new Error("useSettings يجب أن يُستخدم داخل SettingsProvider");
	return ctx;
};
