import { storage } from "../services/storage";

const COUNTER_KEY = "badgeNumberCounter";

// يولّد رقم بطاقة تسلسلي بصيغة DRV-YYYY-00001
export const generateBadgeNumber = () => {
  const year = new Date().getFullYear();
  const counters = storage.read(COUNTER_KEY, {});
  const current = (counters[year] || 0) + 1;
  counters[year] = current;
  storage.write(COUNTER_KEY, counters);
  const padded = String(current).padStart(5, "0");
  return `DRV-${year}-${padded}`;
};

export const generateId = (prefix) =>
  `${prefix}-${Date.now().toString(36)}${Math.floor(Math.random() * 1000)}`;
