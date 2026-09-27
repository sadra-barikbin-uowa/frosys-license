import { storage } from "./storage";
import { ensureAllSeeded } from "../data/ensureSeeded";
import { generateId } from "../utils/generateBadgeNumber";

const VEHICLES_KEY = "vehicles";

const ensureSeeded = () => {
  ensureAllSeeded();
  return storage.read(VEHICLES_KEY, []);
};

// عند ربط Backend مستقبلاً: استبدل الدوال هنا بطلبات axios بنفس التوقيع
export const vehicleService = {
  async getVehicles() {
    await storage.delay();
    return ensureSeeded();
  },

  async getVehicleById(id) {
    await storage.delay();
    return ensureSeeded().find((v) => v.id === id) || null;
  },

  async createVehicle(data) {
    await storage.delay();
    const vehicles = ensureSeeded();
    const newVehicle = { id: generateId("VH"), ...data };
    storage.write(VEHICLES_KEY, [newVehicle, ...vehicles]);
    return newVehicle;
  },

  async updateVehicle(id, data) {
    await storage.delay();
    const vehicles = ensureSeeded();
    const updated = vehicles.map((v) => (v.id === id ? { ...v, ...data } : v));
    storage.write(VEHICLES_KEY, updated);
    const badges = storage.read("badges", []);
    storage.write("badges", badges.map((badge) => badge.vehicleId === id ? {
      ...badge,
      ...(data.vehicleNumber !== undefined ? { vehicleNumber: data.vehicleNumber } : {}),
      ...(data.vehicleType !== undefined ? { vehicleType: data.vehicleType } : {}),
      ...(data.model !== undefined ? { vehicleModel: data.model } : {}),
      ...(data.color !== undefined ? { vehicleColor: data.color } : {}),
    } : badge));
    return updated.find((v) => v.id === id);
  },

  async deleteVehicle(id) {
    await storage.delay();
    const vehicles = ensureSeeded();
    storage.write(VEHICLES_KEY, vehicles.filter((v) => v.id !== id));
    const badges = storage.read("badges", []);
    storage.write("badges", badges.filter((badge) => badge.vehicleId !== id));
    return true;
  },
};
