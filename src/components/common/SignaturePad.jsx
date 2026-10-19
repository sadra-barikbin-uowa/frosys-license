import { useEffect, useRef, useState } from "react";
import { Eraser, PenLine } from "lucide-react";

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 150;

const SignaturePad = ({ value, onChange }) => {
	const canvasRef = useRef(null);
	const drawing = useRef(false);
	const hasDrawing = useRef(false);
	const [isDrawing, setIsDrawing] = useState(false);

	useEffect(() => {
		const canvas = canvasRef.current;
		const context = canvas.getContext("2d");
		context.clearRect(0, 0, canvas.width, canvas.height);
		if (!value) return;

		const image = new Image();
		image.onload = () => context.drawImage(image, 0, 0, canvas.width, canvas.height);
		image.src = value;
		return () => {
			image.onload = null;
		};
	}, [value]);

	const getPoint = (event) => {
		const canvas = canvasRef.current;
		const bounds = canvas.getBoundingClientRect();
		return {
			x: ((event.clientX - bounds.left) / bounds.width) * canvas.width,
			y: ((event.clientY - bounds.top) / bounds.height) * canvas.height,
		};
	};

	const startDrawing = (event) => {
		const canvas = canvasRef.current;
		const context = canvas.getContext("2d");
		const point = getPoint(event);
		canvas.setPointerCapture(event.pointerId);
		context.beginPath();
		context.moveTo(point.x, point.y);
		context.lineWidth = 4;
		context.lineCap = "round";
		context.lineJoin = "round";
		context.strokeStyle = "#172554";
		drawing.current = true;
		hasDrawing.current = false;
		setIsDrawing(true);
	};

	const draw = (event) => {
		if (!drawing.current) return;
		const point = getPoint(event);
		const context = canvasRef.current.getContext("2d");
		context.lineTo(point.x, point.y);
		context.stroke();
		hasDrawing.current = true;
	};

	const stopDrawing = () => {
		if (!drawing.current) return;
		drawing.current = false;
		setIsDrawing(false);
		if (hasDrawing.current) onChange(canvasRef.current.toDataURL("image/png"));
		hasDrawing.current = false;
	};

	const clearSignature = () => {
		const canvas = canvasRef.current;
		canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
		hasDrawing.current = false;
		setIsDrawing(false);
		onChange("");
	};

	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-center justify-between gap-2">
				<label htmlFor="manager-signature" className="text-sm font-medium text-slate-700">
					توقيع المدير
				</label>
				<button
					type="button"
					onClick={clearSignature}
					disabled={!value && !isDrawing}
					className="inline-flex items-center gap-1.5 rounded-lg bg-rose-50 px-3 py-2 text-xs font-medium text-rose-600 transition-colors hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
				>
					<Eraser size={14} />
					حذف التوقيع / إنشاء جديد
				</button>
			</div>
			<div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white">
				<canvas
					ref={canvasRef}
					id="manager-signature"
					width={CANVAS_WIDTH}
					height={CANVAS_HEIGHT}
					aria-label="ارسم توقيع المدير هنا"
					className="block h-32 w-full touch-none cursor-crosshair"
					onPointerDown={startDrawing}
					onPointerMove={draw}
					onPointerUp={stopDrawing}
					onPointerCancel={stopDrawing}
					onLostPointerCapture={stopDrawing}
				/>
				{!value && !isDrawing && (
					<div className="pointer-events-none absolute inset-0 flex items-center justify-center gap-2 text-xs text-slate-400">
						<PenLine size={15} />
						ارسم التوقيع باستخدام الفأرة أو اللمس
					</div>
				)}
			</div>
			<p className="text-[11px] text-slate-500">بعد الرسم، احفظ الإعدادات ليظهر التوقيع على البطاقات.</p>
		</div>
	);
};

export default SignaturePad;
