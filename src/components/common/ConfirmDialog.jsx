import { useState } from "react";
import Modal from "./Modal";
import Button from "./Button";
import { useToast } from "../../hooks/useToast";
import { getErrorMessage } from "../../utils/errors";

// نافذة تأكيد موحّدة للحذف/الإيقاف: تعرض حالة التحميل وتمنع الضغط المزدوج،
// وتعرض رسالة خطأ إن فشلت العملية بدل أن تُترك دون إشعار
const ConfirmDialog = ({
	open,
	title,
	message,
	confirmLabel = "تأكيد",
	variant = "danger",
	onConfirm,
	onClose,
}) => {
	const { showToast } = useToast();
	const [busy, setBusy] = useState(false);

	const handleConfirm = async () => {
		setBusy(true);
		try {
			await onConfirm();
			onClose();
		} catch (error) {
			console.error(error);
			showToast(getErrorMessage(error, "تعذر تنفيذ العملية"), "error");
		} finally {
			setBusy(false);
		}
	};

	return (
		<Modal
			open={open}
			onClose={busy ? undefined : onClose}
			dismissible={!busy}
			title={title}
			size="sm"
			footer={
				<>
					<Button variant="secondary" onClick={onClose} disabled={busy}>
						إلغاء
					</Button>
					<Button variant={variant} onClick={handleConfirm} loading={busy}>
						{confirmLabel}
					</Button>
				</>
			}
		>
			<p className="text-sm leading-relaxed text-slate-600">{message}</p>
		</Modal>
	);
};

export default ConfirmDialog;
