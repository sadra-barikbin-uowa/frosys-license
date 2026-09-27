import { storage } from "./storage";
import { mockUsers } from "../data/mockUsers";
import { ensureAllSeeded } from "../data/ensureSeeded";

const USERS_KEY = "users";
const CURRENT_USER_KEY = "currentUser";

const ensureUsersSeeded = () => {
  ensureAllSeeded();
  const existing = storage.read(USERS_KEY, null);
  if (!existing) {
    storage.write(USERS_KEY, mockUsers);
    return mockUsers;
  }
  return existing;
};

export const authService = {
  async login(username, password) {
    await storage.delay();
    const users = ensureUsersSeeded();
    const user = users.find(
      (u) => u.username === username.trim() && u.password === password
    );
    if (!user) {
      throw new Error("اسم المستخدم أو كلمة المرور غير صحيحة");
    }
    if (user.status === "Inactive") {
      throw new Error("هذا الحساب موقوف، الرجاء التواصل مع الإدارة");
    }
    const { password: _pw, ...safeUser } = user;
    storage.write(CURRENT_USER_KEY, safeUser);
    return safeUser;
  },

  async logout() {
    await storage.delay(80);
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  getCurrentUser() {
    return storage.read(CURRENT_USER_KEY, null);
  },

  getUsers() {
    return ensureUsersSeeded();
  },
};
