import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import DriverForm from "../../components/drivers/DriverForm";
import BadgePreview from "../../components/badges/BadgePreview";
import Button from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { driverService } from "../../services/driverService";
import { vehicleService } from "../../services/vehicleService";
import { badgeService } from "../../services/badgeService";
import { validateDriverForm } from "../../utils/validation";
import { addYears, todayISO } from "../../utils/formatDate";

const initialState = {
  fullName: "",
  fatherName: "",
  motherName: "",
  birthDate: "",
  phone: "",
  address: "",
  nationalId: "",
  photo: null,
  licenseNumber: "",
  licenseIssue: "",
  licenseExpiry: "",
  vehicleType: "",
  vehicleNumber: "",
  model: "",
  year: "",
  color: "",
  vehiclePhoto: null,
};

const AddDriver = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [data, setData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async () => {
    const { isValid, errors: validationErrors } = validateDriverForm(data);
    setErrors(validationErrors);
    if (!isValid) {
      showToast("الرجاء تعبئة جميع الحقول المطلوبة بشكل صحيح", "error");
      return;
    }

    setSubmitting(true);
    try {
      const newDriver = await driverService.createDriver({
        fullName: data.fullName,
        fatherName: data.fatherName,
        motherName: data.motherName,
        birthDate: data.birthDate,
        phone: data.phone,
        address: data.address,
        nationalId: data.nationalId,
        photo: data.photo,
        licenseNumber: data.licenseNumber,
        licenseIssue: data.licenseIssue,
        licenseExpiry: data.licenseExpiry,
        createdBy: user.id,
        createdByName: user.name,
      });

      const newVehicle = await vehicleService.createVehicle({
        vehicleNumber: data.vehicleNumber,
        vehicleType: data.vehicleType,
        model: data.model,
        year: data.year,
        color: data.color,
        photo: data.vehiclePhoto,
        driverId: newDriver.id,
        createdBy: user.id,
      });

      await driverService.updateDriver(newDriver.id, { vehicleId: newVehicle.id });

      const issueDate = todayISO();
      const newBadge = await badgeService.createBadge({
        driverId: newDriver.id,
        vehicleId: newVehicle.id,
        driverName: data.fullName,
        driverPhoto: data.photo,
        nationalId: data.nationalId,
        licenseNumber: data.licenseNumber,
        vehicleType: data.vehicleType,
        vehicleNumber: data.vehicleNumber,
        vehicleModel: data.model,
        vehicleColor: data.color,
        issueDate,
        expiryDate: addYears(issueDate, 1),
        createdBy: user.id,
        createdByName: user.name,
      });

      showToast("تم إنشاء البطاقة بنجاح", "success");
      navigate(`/employee/badges/${newBadge.id}`);
    } catch (err) {
      console.error(err);
      showToast("حدث خطأ أثناء إنشاء البطاقة، حاول مرة أخرى", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout role="employee">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800">إضافة سائق جديد</h1>
        <p className="text-sm text-slate-400 mt-1">
          أدخل بيانات السائق والمركبة، وستظهر معاينة البطاقة مباشرة أثناء الكتابة
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start">
        <DriverForm data={data} errors={errors} onChange={handleChange} />

        <div className="lg:sticky lg:top-6 flex flex-col gap-4">
          <div className="bg-white rounded-xl ring-1 ring-slate-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={16} className="text-indigo-500" />
              <h3 className="text-sm font-bold text-slate-800">معاينة البطاقة</h3>
            </div>
            <BadgePreview
              data={{
                ...data,
                issueDate: todayISO(),
                expiryDate: addYears(todayISO(), 1),
                vehicleColor: data.color,
              }}
            />
            <p className="text-[11px] text-slate-400 text-center mt-4">
              يتم توليد رقم البطاقة تلقائيًا عند الضغط على "إنشاء البطاقة"
            </p>
          </div>

          <Button onClick={handleSubmit} loading={submitting} size="lg" className="w-full">
            إنشاء البطاقة
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AddDriver;
