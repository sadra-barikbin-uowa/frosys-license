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

  async getDriverByIdForEmployee(id, employeeId) {
    await storage.delay();
    return ensureSeeded().find((driver) => driver.id === id && driver.createdBy === employeeId) || null;
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
    const badges = storage.read("badges", []);
    storage.write("badges", badges.map((badge) => badge.driverId === id ? {
      ...badge,
      ...(data.fullName !== undefined ? { driverName: data.fullName } : {}),
      ...(data.personType !== undefined ? { personType: data.personType } : {}),
      ...(data.photo !== undefined ? { driverPhoto: data.photo } : {}),
      ...(data.nationalId !== undefined ? { nationalId: data.nationalId } : {}),
      ...(data.licenseNumber !== undefined ? { licenseNumber: data.licenseNumber } : {}),
    } : badge));
    return updated.find((d) => d.id === id);
  },

  async updateDriverForEmployee(id, employeeId, data) {
    const driver = await driverService.getDriverByIdForEmployee(id, employeeId);
    if (!driver) return null;
    return driverService.updateDriver(id, data);
  },

  async deleteDriver(id) {
    await storage.delay();
    const drivers = ensureSeeded();
    const driver = drivers.find((item) => item.id === id);
    storage.write(DRIVERS_KEY, drivers.filter((d) => d.id !== id));
    if (driver?.vehicleId) {
      const vehicles = storage.read("vehicles", []);
      storage.write("vehicles", vehicles.filter((vehicle) => vehicle.id !== driver.vehicleId));
    }
    const badges = storage.read("badges", []);
    storage.write("badges", badges.filter((badge) => badge.driverId !== id));
    return true;
  },
};
