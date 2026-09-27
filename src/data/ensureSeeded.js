import { storage } from "../services/storage";

// Initialize missing collections without replacing data already in LocalStorage.
let seeded = false;

export const ensureAllSeeded = () => {
  if (seeded) return;
  ["drivers", "vehicles", "badges"].forEach((key) => {
    if (storage.read(key, null) === null) storage.write(key, []);
  });

  const legacySamples = {
    drivers: /^DR-\d{5}$/,
    vehicles: /^VH-\d{5}$/,
    badges: /^BD-\d{5}$/,
  };
  Object.entries(legacySamples).forEach(([key, sampleId]) => {
    const records = storage.read(key, []);
    const retained = records.filter((record) => !sampleId.test(record.id));
    if (retained.length !== records.length) storage.write(key, retained);
  });

  const users = storage.read("users", null);
  if (users) {
    const retainedUsers = users.filter((user) => !["EMP-001", "EMP-002", "EMP-003"].includes(user.id));
    if (retainedUsers.length !== users.length) storage.write("users", retainedUsers);
  }
  seeded = true;
};
