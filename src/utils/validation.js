export const required = (value) => {
  if (typeof value === "string") return value.trim().length > 0;
  return value !== null && value !== undefined && value !== "";
};

// يتحقق من بيانات السائق والمركبة قبل إنشاء البطاقة
export const validateDriverForm = (data) => {
  const errors = {};

  if (!required(data.fullName)) errors.fullName = "الاسم الكامل مطلوب";
  if (!required(data.nationalId)) errors.nationalId = "رقم الهوية الوطنية مطلوب";
  if (!required(data.phone)) errors.phone = "رقم الهاتف مطلوب";
  else if (!/^[0-9+\s-]{7,15}$/.test(data.phone.trim()))
    errors.phone = "رقم الهاتف غير صحيح";

  if (!required(data.photo)) errors.photo = "صورة السائق مطلوبة";

  if (!required(data.licenseNumber)) errors.licenseNumber = "رقم رخصة القيادة مطلوب";
  if (!required(data.licenseExpiry)) errors.licenseExpiry = "تاريخ انتهاء الرخصة مطلوب";

  if (!required(data.vehicleType)) errors.vehicleType = "نوع المركبة مطلوب";
  if (!required(data.vehicleNumber)) errors.vehicleNumber = "رقم المركبة مطلوب";

  return { isValid: Object.keys(errors).length === 0, errors };
};
