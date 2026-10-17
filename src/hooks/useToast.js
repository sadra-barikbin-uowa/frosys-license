import { useContext } from "react";
import { ToastContext } from "../context/contexts";

export const useToast = () => {
	const ctx = useContext(ToastContext);
	if (!ctx) throw new Error("useToast يجب أن يُستخدم داخل ToastProvider");
	return ctx;
};
