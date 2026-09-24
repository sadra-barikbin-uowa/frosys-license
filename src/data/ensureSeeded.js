import { storage } from "../services/storage";
import { buildSeedData } from "./seedData";

// يضمن تزامن بيانات السائقين والمركبات والبطاقات عند أول تشغيل فقط
let seeded = false;

export const ensureAllSeeded = () => {
  if (seeded) return;
  const hasDrivers = storage.read("drivers", null);
  const hasVehicles = storage.read("vehicles", null);
  const hasBadges = storage.read("badges", null);

  if (!hasDrivers || !hasVehicles || !hasBadges) {
    const { drivers, vehicles, badges } = buildSeedData();
    if (!hasDrivers) storage.write("drivers", drivers);
    if (!hasVehicles) storage.write("vehicles", vehicles);
    if (!hasBadges) storage.write("badges", badges);
  }
  seeded = true;
};
