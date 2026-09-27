import { storage } from "./storage";

const SETTINGS_KEY = "settings";

const defaults = {
  systemName: "نظام إدارة السائقين والمركبات",
  logo: "",
  badgeColor: "#4338ca",
  contactInfo: "",
  badgeValidityYears: 1,
  expiringSoonDays: 30,
};

const readSettings = () => {
  const saved = storage.read(SETTINGS_KEY, {});
  const systemName = saved.systemName || saved.organizationName || defaults.systemName;
  return { ...defaults, ...saved, systemName, organizationName: systemName };
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
    const requestedName = data.systemName || data.organizationName || current.systemName;
    const systemName = requestedName.trim() || current.systemName;
    const updated = { ...current, ...data, systemName, organizationName: systemName };
    storage.write(SETTINGS_KEY, updated);
    return updated;
  },
};
