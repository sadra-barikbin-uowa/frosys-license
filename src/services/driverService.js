import { storage } from "./storage";
import { ensureAllSeeded } from "../data/ensureSeeded";
import { generateId } from "../utils/generateBadgeNumber";

const DRIVERS_KEY = "drivers";

const ensureSeeded = () => {
  ensureAllSeeded();
  return storage.read(DRIVERS_KEY, []);
};

// عند ربط Backend مستقبلاً: استبدل الدوال هنا بطلبات axios بنفس التوقيع
// مثال: getDrivers -> axios.get('/api/drivers').then(res => res.data)
export const driverService = {
  async getDrivers() {
    await storage.delay();
    return ensureSeeded();
  },

  async getDriversByEmployee(employeeId) {
    await storage.delay();
    return ensureSeeded().filter((d) => d.createdBy === employeeId);
  },

  async getDriverById(id) {
    await storage.delay();
    return ensureSeeded().find((d) => d.id === id) || null;
  },

  async createDriver(data) {
    await storage.delay();
    const drivers = ensureSeeded();
    const newDriver = { id: generateId("DR"), createdAt: new Date().toISOString(), ...data };
    storage.write(DRIVERS_KEY, [newDriver, ...drivers]);
    return newDriver;
  },

  async updateDriver(id, data) {
    await storage.delay();
    const drivers = ensureSeeded();
    const updated = drivers.map((d) => (d.id === id ? { ...d, ...data } : d));
    storage.write(DRIVERS_KEY, updated);
    return updated.find((d) => d.id === id);
  },

  async deleteDriver(id) {
    await storage.delay();
    const drivers = ensureSeeded();
    storage.write(DRIVERS_KEY, drivers.filter((d) => d.id !== id));
    return true;
  },
};
