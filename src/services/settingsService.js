import { storage } from "./storage";

const SETTINGS_KEY = "settings";

const defaults = {
  organizationName: "نظام إدارة السائقين والمركبات",
  badgeValidityYears: 1,
  expiringSoonDays: 30,
};

export const settingsService = {
  async getSettings() {
    await storage.delay(60);
    return storage.read(SETTINGS_KEY, defaults);
  },
  async updateSettings(data) {
    await storage.delay();
    const current = storage.read(SETTINGS_KEY, defaults);
    const updated = { ...current, ...data };
    storage.write(SETTINGS_KEY, updated);
    return updated;
  },
};
