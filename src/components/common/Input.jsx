import { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const Input = ({
	label,
	error,
	hint,
	icon: Icon,
	className = "",
	containerClassName = "",
	type = "text",
	id,
	...props
}) => {
	const generatedId = useId();
	const inputId = id || generatedId;
	const messageId = `${inputId}-message`;
	const [showPassword, setShowPassword] = useState(false);
	const isPassword = type === "password";

	return (
		<div className={`flex flex-col gap-1.5 ${containerClassName}`}>
			{label && (
				<label htmlFor={inputId} className="text-sm font-medium text-slate-700">
					{label}
					{props.required && <span className="text-rose-500 mr-1">*</span>}
				</label>
			)}
			<div className="relative">
				{Icon && (
					<Icon
						size={16}
						className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
					/>
				)}
				<input
					id={inputId}
					type={isPassword && showPassword ? "text" : type}
					aria-invalid={error ? true : undefined}
					aria-describedby={error || hint ? messageId : undefined}
					className={`w-full rounded-lg border bg-white text-sm px-3.5 py-2.5 outline-none transition-colors placeholder:text-slate-400 disabled:bg-slate-50 disabled:text-slate-400
						${Icon ? "pr-10" : ""}
						${isPassword ? "pl-10" : ""}
						${error ? "border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-100" : "border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"}
						${className}`}
					{...props}
				/>
				{isPassword && (
					<button
						type="button"
						onClick={() => setShowPassword((value) => !value)}
						aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
						className="absolute left-2.5 top-1/2 -translate-y-1/2 p-1 rounded text-slate-400 hover:text-slate-600"
					>
						{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
					</button>
				)}
			</div>
			{error ? (
				<span id={messageId} className="text-xs text-rose-500">
					{error}
				</span>
			) : hint ? (
				<span id={messageId} className="text-xs text-slate-400">
					{hint}
				</span>
			) : null}
		</div>
	);
};

export default Input;
