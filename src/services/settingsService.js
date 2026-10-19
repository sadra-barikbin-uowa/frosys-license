import { storage } from "./storage";

const SETTINGS_KEY = "settings";

export const defaultSettings = {
	systemName: "نظام إدارة السائقين والمركبات",
	logo: "",
	managerSignature: "",
	badgeColor: "#4338ca",
	contactInfo: "",
	badgeValidityYears: 1,
	expiringSoonDays: 30,
};

const positiveInt = (value, fallback) => {
	const number = Math.floor(Number(value));
	return Number.isFinite(number) && number >= 1 ? number : fallback;
};

const readSettings = () => {
	const saved = storage.read(SETTINGS_KEY, {});
	const systemName = saved.systemName || saved.organizationName || defaultSettings.systemName;
	return { ...defaultSettings, ...saved, systemName, organizationName: systemName };
};

export const settingsService = {
	getSettingsSync() {
		return readSettings();
	},
	async getSettings() {
		await storage.delay(60);
		return readSettings();
	},
	async updateSettings(data) {
		await storage.delay();
		const current = readSettings();
		const requestedName = data.systemName ?? data.organizationName ?? current.systemName;
		const systemName = requestedName.trim() || current.systemName;
		const updated = {
			...current,
			...data,
			systemName,
			organizationName: systemName,
			badgeValidityYears: positiveInt(
				data.badgeValidityYears ?? current.badgeValidityYears,
				defaultSettings.badgeValidityYears,
			),
			expiringSoonDays: positiveInt(
				data.expiringSoonDays ?? current.expiringSoonDays,
				defaultSettings.expiringSoonDays,
			),
		};
		storage.write(SETTINGS_KEY, updated);
		return updated;
	},
};
