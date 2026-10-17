import {
	BADGE_STATUS,
	badgeStatusLabel,
	badgeStatusStyle,
	computeBadgeStatus,
} from "../../utils/badgeStatus";

const DOT = {
	[BADGE_STATUS.ACTIVE]: "bg-emerald-500",
	[BADGE_STATUS.EXPIRED]: "bg-rose-500",
	[BADGE_STATUS.EXPIRING_SOON]: "bg-amber-500",
	[BADGE_STATUS.SUSPENDED]: "bg-slate-400",
};

// شارة حالة البطاقة: نقطة ملوّنة + نص (تُستخدم في الجداول والبطاقات والتفاصيل)
const StatusBadge = ({ badge, prefix = "", size = "sm", className = "" }) => (
	<span
		className={`inline-flex items-center gap-1.5 font-semibold rounded-full whitespace-nowrap ${
			size === "md" ? "text-xs px-3 py-1.5" : "text-[11px] px-2.5 py-1"
		} ${badgeStatusStyle(badge)} ${className}`}
	>
		<span className={`w-1.5 h-1.5 rounded-full ${DOT[computeBadgeStatus(badge)]}`} />
		{prefix}
		{badgeStatusLabel(badge)}
	</span>
);

export default StatusBadge;
