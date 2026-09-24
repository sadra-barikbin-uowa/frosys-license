import { storage } from "./storage";
import { mockUsers } from "../data/mockUsers";
import { generateId } from "../utils/generateBadgeNumber";

const USERS_KEY = "users";

const ensureSeeded = () => {
  const existing = storage.read(USERS_KEY, null);
  if (!existing) {
    storage.write(USERS_KEY, mockUsers);
    return mockUsers;
  }
  return existing;
};

// عند ربط Backend مستقبلاً: استبدل الدوال هنا بطلبات axios
// مثال: getEmployees -> axios.get('/api/employees')
export const employeeService = {
  async getEmployees() {
    await storage.delay();
    return ensureSeeded().filter((u) => u.role === "employee");
  },

  async getEmployeeById(id) {
    await storage.delay();
    return ensureSeeded().find((u) => u.id === id) || null;
  },

  async createEmployee(data) {
    await storage.delay();
    const users = ensureSeeded();
    const newEmployee = {
      id: generateId("EMP"),
      role: "employee",
      status: "Active",
      ...data,
    };
    const updated = [...users, newEmployee];
    storage.write(USERS_KEY, updated);
    return newEmployee;
  },

  async updateEmployee(id, data) {
    await storage.delay();
    const users = ensureSeeded();
    const updated = users.map((u) => (u.id === id ? { ...u, ...data } : u));
    storage.write(USERS_KEY, updated);
    return updated.find((u) => u.id === id);
  },

  async toggleEmployeeStatus(id) {
    await storage.delay();
    const users = ensureSeeded();
    const updated = users.map((u) =>
      u.id === id
        ? { ...u, status: u.status === "Active" ? "Inactive" : "Active" }
        : u
    );
    storage.write(USERS_KEY, updated);
    return updated.find((u) => u.id === id);
  },

  async deleteEmployee(id) {
    await storage.delay();
    const users = ensureSeeded();
    const updated = users.filter((u) => u.id !== id);
    storage.write(USERS_KEY, updated);
    return true;
  },
};
