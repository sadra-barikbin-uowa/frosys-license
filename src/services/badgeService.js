import { storage } from "./storage";
import { ensureAllSeeded } from "../data/ensureSeeded";
import { generateId, generateBadgeNumber } from "../utils/generateBadgeNumber";
import { computeBadgeStatus } from "../utils/badgeStatus";

const BADGES_KEY = "badges";

const ensureSeeded = () => {
  ensureAllSeeded();
  return storage.read(BADGES_KEY, []);
};

// عند ربط Backend مستقبلاً: استبدل الدوال هنا بطلبات axios بنفس التوقيع
// مثال: createBadge -> axios.post('/api/badges', data).then(res => res.data)
export const badgeService = {
  async getBadges() {
    await storage.delay();
    return ensureSeeded().map((b) => ({ ...b, status: computeBadgeStatus(b) }));
  },

  async getBadgeById(id) {
    await storage.delay();
    const badge = ensureSeeded().find((b) => b.id === id);
    return badge ? { ...badge, status: computeBadgeStatus(badge) } : null;
  },

  async getBadgeByIdForEmployee(id, employeeId) {
    await storage.delay();
    const badge = ensureSeeded().find((b) => b.id === id && b.createdBy === employeeId);
    return badge ? { ...badge, status: computeBadgeStatus(badge) } : null;
  },

  async getBadgesByEmployee(employeeId) {
    await storage.delay();
    return ensureSeeded()
      .filter((b) => b.createdBy === employeeId)
      .map((b) => ({ ...b, status: computeBadgeStatus(b) }));
  },

  async createBadge(data) {
    await storage.delay();
    const badges = ensureSeeded();
    const badgeNumber = generateBadgeNumber();
    const newBadge = {
      issueDate: new Date().toISOString().slice(0, 10),
      status: "Active",
      createdAt: new Date().toISOString(),
      ...data,
      id: generateId("BD"),
      badgeNumber,
    };
    storage.write(BADGES_KEY, [newBadge, ...badges]);
    return newBadge;
  },

  async updateBadge(id, data) {
    await storage.delay();
    const badges = ensureSeeded();
    const current = badges.find((badge) => badge.id === id);
    if (!current) return null;
    const updated = badges.map((b) => (b.id === id ? { ...b, ...data } : b));
    storage.write(BADGES_KEY, updated);
    const driverUpdates = {
      fullName: data.driverName || data.fullName,
      photo: data.driverPhoto || data.photo,
      nationalId: data.nationalId,
      licenseNumber: data.licenseNumber,
    };
    if (current.driverId) {
      const drivers = storage.read("drivers", []);
      storage.write("drivers", drivers.map((driver) => driver.id === current.driverId
        ? { ...driver, ...Object.fromEntries(Object.entries(driverUpdates).filter(([, value]) => value !== undefined)) }
        : driver));
    }
    if (current.vehicleId) {
      const vehicles = storage.read("vehicles", []);
      storage.write("vehicles", vehicles.map((vehicle) => vehicle.id === current.vehicleId
        ? { ...vehicle,
          ...(data.vehicleType !== undefined ? { vehicleType: data.vehicleType } : {}),
          ...(data.vehicleNumber !== undefined ? { vehicleNumber: data.vehicleNumber } : {}),
          ...(data.vehicleModel !== undefined ? { model: data.vehicleModel } : {}),
          ...(data.vehicleColor !== undefined ? { color: data.vehicleColor } : {}),
        }
        : vehicle));
    }
    return updated.find((b) => b.id === id);
  },

  async updateBadgeForEmployee(id, employeeId, data) {
    const badge = await badgeService.getBadgeByIdForEmployee(id, employeeId);
    if (!badge) return null;
    return badgeService.updateBadge(id, data);
  },

  async setBadgeStatus(id, status) {
    return badgeService.updateBadge(id, { status });
  },

  async deleteBadge(id) {
    await storage.delay();
    const badges = ensureSeeded();
    storage.write(BADGES_KEY, badges.filter((b) => b.id !== id));
    return true;
  },
};
