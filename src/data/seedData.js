// بيانات تجريبية أولية تُستخدم فقط عند أول تشغيل للنظام (عند فراغ LocalStorage)
const firstNames = ["محمد", "أحمد", "عبدالرحمن", "خالد", "فهد", "سلطان", "ناصر", "تركي", "بندر", "سامي", "ماجد", "يوسف"];
const lastNames = ["الغامدي", "القحطاني", "العتيبي", "الحربي", "الزهراني", "المطيري", "الشهري", "الدوسري", "السبيعي", "العنزي"];
const colors = ["أبيض", "أسود", "فضي", "رمادي", "أزرق", "أحمر"];
const models = ["تويوتا كامري", "هونداي إلنترا", "نيسان صني", "كيا سيراتو", "تويوتا هايلكس", "هوندا CBR"];
const vehicleTypeValues = ["car", "taxi", "motorcycle", "truck", "other"];
const employees = [
  { id: "EMP-001", name: "أحمد محمد" },
  { id: "EMP-002", name: "سارة المطيري" },
  { id: "EMP-003", name: "خالد العتيبي" },
];

const pick = (arr, i) => arr[i % arr.length];
const pad = (n, len = 5) => String(n).padStart(len, "0");

const isoDaysAgo = (days) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
};
const isoDaysFromNow = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};

export const buildSeedData = () => {
  const drivers = [];
  const vehicles = [];
  const badges = [];

  const total = 14;
  for (let i = 1; i <= total; i++) {
    const fullName = `${pick(firstNames, i)} ${pick(lastNames, i + 3)}`;
    const driverId = `DR-${pad(i)}`;
    const vehicleId = `VH-${pad(i)}`;
    const badgeId = `BD-${pad(i)}`;
    const employee = pick(employees, i);
    const vehicleType = pick(vehicleTypeValues, i);
    const photoSeed = i + 10;

    const driver = {
      id: driverId,
      fullName,
      fatherName: pick(firstNames, i + 1),
      motherName: pick(firstNames, i + 5),
      birthDate: `19${85 + (i % 15)}-0${(i % 9) + 1}-1${i % 9}`,
      phone: `05${pad(10000000 + i * 137, 8)}`,
      address: "الرياض - المملكة العربية السعودية",
      nationalId: `10${pad(20000 + i * 91, 7)}`,
      licenseNumber: `LIC-${pad(5000 + i, 6)}`,
      licenseIssue: isoDaysAgo(700 + i * 10),
      licenseExpiry: isoDaysFromNow(400 + i * 20),
      photo: `https://i.pravatar.cc/300?img=${photoSeed}`,
      vehicleId,
      createdBy: employee.id,
      createdByName: employee.name,
      createdAt: isoDaysAgo(200 - i * 5),
    };

    const vehicle = {
      id: vehicleId,
      vehicleNumber: `${pad(1000 + i * 7, 5)}`,
      vehicleType,
      model: pick(models, i),
      year: String(2015 + (i % 10)),
      color: pick(colors, i),
      photo: `https://picsum.photos/seed/vehicle${i}/400/260`,
      driverId,
      createdBy: employee.id,
    };

    // توزيع تواريخ الانتهاء لتغطية جميع الحالات: فعال / قريب الانتهاء / منتهي / موقوف
    let expiryDate;
    let status = "Active";
    if (i % 7 === 0) {
      expiryDate = isoDaysAgo(30 + i);
      status = "Expired";
    } else if (i % 5 === 0) {
      expiryDate = isoDaysFromNow(15);
      status = "ExpiringSoon";
    } else if (i % 11 === 0) {
      expiryDate = isoDaysFromNow(365);
      status = "Suspended";
    } else {
      expiryDate = isoDaysFromNow(365 + i * 5);
    }

    const issueDate = isoDaysAgo(365 - (i % 30));
    const badgeNumber = `DRV-${new Date().getFullYear()}-${pad(i)}`;

    const badge = {
      id: badgeId,
      badgeNumber,
      driverId,
      vehicleId,
      driverName: fullName,
      driverPhoto: driver.photo,
      nationalId: driver.nationalId,
      licenseNumber: driver.licenseNumber,
      vehicleType,
      vehicleNumber: vehicle.vehicleNumber,
      vehicleModel: vehicle.model,
      vehicleColor: vehicle.color,
      issueDate,
      expiryDate,
      status,
      createdBy: employee.id,
      createdByName: employee.name,
      createdAt: issueDate,
    };

    drivers.push(driver);
    vehicles.push(vehicle);
    badges.push(badge);
  }

  return { drivers, vehicles, badges };
};
