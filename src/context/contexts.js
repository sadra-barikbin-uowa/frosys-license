import { createContext } from "react";

// الـ Contexts في ملف مستقل عن الـ Providers حتى يعمل Fast Refresh بشكل سليم
export const AuthContext = createContext(null);
export const SettingsContext = createContext(null);
export const ToastContext = createContext(null);
