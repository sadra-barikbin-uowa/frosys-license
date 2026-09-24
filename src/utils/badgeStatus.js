import { daysUntil } from "./formatDate";

export const BADGE_STATUS = {
  ACTIVE: "Active",
  EXPIRED: "Expired",
  EXPIRING_SOON: "ExpiringSoon",
  SUSPENDED: "Suspended",
};

export const BADGE_STATUS_LABELS = {
  [BADGE_STATUS.ACTIVE]: "فعال",
  [BADGE_STATUS.EXPIRED]: "منتهي",
  [BADGE_STATUS.EXPIRING_SOON]: "قريب الانتهاء",
  [BADGE_STATUS.SUSPENDED]: "موقوف",
};

export const BADGE_STATUS_STYLES = {
  [BADGE_STATUS.ACTIVE]: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  [BADGE_STATUS.EXPIRED]: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
  [BADGE_STATUS.EXPIRING_SOON]: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  [BADGE_STATUS.SUSPENDED]: "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
};

// يحسب الحالة تلقائيًا اعتمادًا على تاريخ الانتهاء، إلا إذا كانت موقوفة يدويًا
export const computeBadgeStatus = (badge) => {
  if (!badge) return BADGE_STATUS.ACTIVE;
  if (badge.status === BADGE_STATUS.SUSPENDED) return BADGE_STATUS.SUSPENDED;

  const remaining = daysUntil(badge.expiryDate);
  if (remaining === null) return BADGE_STATUS.ACTIVE;
  if (remaining < 0) return BADGE_STATUS.EXPIRED;
  if (remaining <= 30) return BADGE_STATUS.EXPIRING_SOON;
  return BADGE_STATUS.ACTIVE;
};

export const badgeStatusLabel = (badge) => BADGE_STATUS_LABELS[computeBadgeStatus(badge)];
export const badgeStatusStyle = (badge) => BADGE_STATUS_STYLES[computeBadgeStatus(badge)];
