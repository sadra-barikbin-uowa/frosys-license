export const PERSON_TYPES = [
  { value: "visitor", label: "زائر" },
  { value: "employee", label: "موظف" },
  { value: "student", label: "طالب" },
];

export const personTypeLabel = (value) =>
  PERSON_TYPES.find((type) => type.value === value)?.label || "—";