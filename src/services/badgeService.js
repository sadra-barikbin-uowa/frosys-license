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
      id: generateId("BD"),
      badgeNumber,
      issueDate: new Date().toISOString().slice(0, 10),
      status: "Active",
      createdAt: new Date().toISOString(),
      ...data,
      badgeNumber, // تأكيد عدم الكتابة فوق الرقم المُولّد
    };
    storage.write(BADGES_KEY, [newBadge, ...badges]);
    return newBadge;
  },

  async updateBadge(id, data) {
    await storage.delay();
    const badges = ensureSeeded();
    const updated = badges.map((b) => (b.id === id ? { ...b, ...data } : b));
    storage.write(BADGES_KEY, updated);
    return updated.find((b) => b.id === id);
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
