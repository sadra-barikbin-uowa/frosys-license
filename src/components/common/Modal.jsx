import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";

const SIZES = {
	sm: "max-w-sm",
	md: "max-w-md",
	lg: "max-w-2xl",
	xl: "max-w-4xl",
};

const FOCUSABLE =
	'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

const ModalDialog = ({ onClose, title, children, footer, size, dismissible }) => {
	const dialogRef = useRef(null);
	const onCloseRef = useRef(onClose);
	const titleId = useId();

	useEffect(() => {
		onCloseRef.current = onClose;
	});

	useEffect(() => {
		const dialog = dialogRef.current;
		const previouslyFocused = document.activeElement;
		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";

		// التركيز على أول حقل إدخال (أو النافذة نفسها) ليعمل الكيبورد وقارئ الشاشة مباشرة
		const firstField = dialog.querySelector(
			'input:not([type="file"]):not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled])',
		);
		(firstField || dialog).focus({ preventScroll: true });

		const handleKeyDown = (event) => {
			if (event.key === "Escape" && dismissible) {
				event.stopPropagation();
				onCloseRef.current?.();
				return;
			}
			if (event.key !== "Tab") return;

			// حصر التنقل بـ Tab داخل النافذة
			const items = [...dialog.querySelectorAll(FOCUSABLE)].filter(
				(el) => el.offsetParent !== null,
			);
			if (items.length === 0) {
				event.preventDefault();
				return;
			}
			const first = items[0];
			const last = items[items.length - 1];
			const active = document.activeElement;
			if (event.shiftKey && (active === first || active === dialog)) {
				event.preventDefault();
				last.focus();
			} else if (!event.shiftKey && active === last) {
				event.preventDefault();
				first.focus();
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
			document.body.style.overflow = previousOverflow;
			if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus({ preventScroll: true });
		};
	}, [dismissible]);

	return (
		<div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 no-print">
			<div
				className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px] animate-[fadeIn_.15s_ease-out]"
				onMouseDown={dismissible ? onClose : undefined}
				aria-hidden="true"
			/>
			<div
				ref={dialogRef}
				role="dialog"
				aria-modal="true"
				aria-labelledby={titleId}
				tabIndex={-1}
				className={`relative w-full ${SIZES[size]} bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[92dvh] sm:max-h-[90dvh] flex flex-col animate-[fadeIn_.2s_ease-out] outline-none`}
			>
				<div className="flex items-center justify-between gap-3 px-5 sm:px-6 py-4 border-b border-slate-100">
					<h3 id={titleId} className="text-base font-bold text-slate-800">
						{title}
					</h3>
					<button
						type="button"
						onClick={onClose}
						aria-label="إغلاق"
						className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
					>
						<X size={18} />
					</button>
				</div>
				<div className="px-5 sm:px-6 py-5 overflow-y-auto overscroll-contain">{children}</div>
				{footer && (
					<div className="px-5 sm:px-6 py-4 border-t border-slate-100 flex flex-wrap justify-end gap-2">
						{footer}
					</div>
				)}
			</div>
		</div>
	);
};

const Modal = ({ open, onClose, title, children, footer, size = "md", dismissible = true }) => {
	if (!open) return null;
	return (
		<ModalDialog
			onClose={onClose}
			title={title}
			footer={footer}
			size={size}
			dismissible={dismissible}
		>
			{children}
		</ModalDialog>
	);
};

export default Modal;
