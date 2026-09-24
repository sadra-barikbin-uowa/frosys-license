export const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("ar-EG-u-nu-latn", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

export const todayISO = () => new Date().toISOString().slice(0, 10);

export const addYears = (dateStr, years = 1) => {
  const date = dateStr ? new Date(dateStr) : new Date();
  date.setFullYear(date.getFullYear() + years);
  return date.toISOString().slice(0, 10);
};

export const daysUntil = (dateStr) => {
  if (!dateStr) return null;
  const target = new Date(dateStr);
  const now = new Date();
  target.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
};
