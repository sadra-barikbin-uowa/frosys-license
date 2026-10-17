import { useEffect } from "react";
import { useSettings } from "./useSettings";

// يضبط عنوان تبويب المتصفح: "اسم الصفحة | اسم النظام"
export const usePageTitle = (title) => {
	const { settings } = useSettings();
	useEffect(() => {
		document.title = title ? `${title} | ${settings.systemName}` : settings.systemName;
	}, [title, settings.systemName]);
};
