import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";

const VARIANTS = {
	primary: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-200",
	secondary: "bg-white hover:bg-slate-50 text-slate-700 ring-1 ring-slate-200",
	danger: "bg-rose-600 hover:bg-rose-700 text-white shadow-sm shadow-rose-200",
	ghost: "bg-transparent hover:bg-slate-100 text-slate-600",
	outline: "bg-transparent hover:bg-indigo-50 text-indigo-600 ring-1 ring-indigo-200",
	// للأزرار فوق الخلفيات الملوّنة (البانر الترحيبي)
	light: "bg-white hover:bg-indigo-50 text-indigo-700 shadow-sm",
	glass: "bg-white/15 hover:bg-white/25 text-white ring-1 ring-white/30",
};

const SIZES = {
	sm: "text-xs px-3 py-1.5",
	md: "text-sm px-4 py-2.5",
	lg: "text-sm px-6 py-3",
};

// عند تمرير `to` يُعرض الزر كرابط <Link> فعلي (بدل تداخل <a><button>)
const Button = ({
	children,
	variant = "primary",
	size = "md",
	icon: Icon,
	loading = false,
	disabled = false,
	className = "",
	type = "button",
	to,
	...props
}) => {
	const classes = `inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] ${VARIANTS[variant]} ${SIZES[size]} ${className}`;
	const content = (
		<>
			{loading ? <Loader2 size={16} className="animate-spin" /> : Icon ? <Icon size={16} /> : null}
			{children}
		</>
	);

	if (to && !disabled && !loading) {
		return (
			<Link to={to} className={classes} {...props}>
				{content}
			</Link>
		);
	}

	return (
		<button
			type={type}
			disabled={disabled || loading}
			aria-busy={loading || undefined}
			className={classes}
			{...props}
		>
			{content}
		</button>
	);
};

export default Button;
