import { User } from "lucide-react";

const SIZES = {
	sm: { box: "w-9 h-9", icon: 16 },
	md: { box: "w-12 h-12", icon: 18 },
	lg: { box: "w-14 h-14", icon: 20 },
	xl: { box: "w-24 h-24", icon: 32 },
};

const Avatar = ({ src, alt = "", size = "sm", shape = "full", className = "" }) => {
	const { box, icon } = SIZES[size];
	return (
		<div
			className={`${box} ${shape === "full" ? "rounded-full" : "rounded-lg"} overflow-hidden bg-slate-100 shrink-0 ${className}`}
		>
			{src ? (
				<img src={src} alt={alt} loading="lazy" decoding="async" className="w-full h-full object-cover" />
			) : (
				<div className="w-full h-full flex items-center justify-center text-slate-300">
					<User size={icon} />
				</div>
			)}
		</div>
	);
};

export default Avatar;
