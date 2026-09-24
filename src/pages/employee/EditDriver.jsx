import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import DriverForm from "../../components/drivers/DriverForm";
import Button from "../../components/common/Button";
import { useToast } from "../../context/ToastContext";
import { driverService } from "../../services/driverService";
import { vehicleService } from "../../services/vehicleService";
import { validateDriverForm } from "../../utils/validation";

const EditDriver = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [data, setData] = useState(null);
  const [vehicleId, setVehicleId] = useState(null);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const driver = await driverService.getDriverById(id);
      if (!driver) return;
      const vehicle = driver.vehicleId ? await vehicleService.getVehicleById(driver.vehicleId) : null;
      setVehicleId(vehicle?.id || null);
      setData({
        fullName: driver.fullName || "",
        fatherName: driver.fatherName || "",
        motherName: driver.motherName || "",
        birthDate: driver.birthDate || "",
        phone: driver.phone || "",
        address: driver.address || "",
        nationalId: driver.nationalId || "",
        photo: driver.photo || null,
        licenseNumber: driver.licenseNumber || "",
        licenseIssue: driver.licenseIssue || "",
        licenseExpiry: driver.licenseExpiry || "",
        vehicleType: vehicle?.vehicleType || "",
        vehicleNumber: vehicle?.vehicleNumber || "",
        model: vehicle?.model || "",
        year: vehicle?.year || "",
        color: vehicle?.color || "",
        vehiclePhoto: vehicle?.photo || null,
      });
    };
    load();
  }, [id]);

  const handleChange = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSave = async () => {
    const { isValid, errors: validationErrors } = validateDriverForm(data);
    setErrors(validationErrors);
    if (!isValid) {
      showToast("الرجاء تعبئة جميع الحقول المطلوبة بشكل صحيح", "error");
      return;
    }
    setSaving(true);
    try {
      await driverService.updateDriver(id, {
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
      });
      if (vehicleId) {
        await vehicleService.updateVehicle(vehicleId, {
          vehicleNumber: data.vehicleNumber,
          vehicleType: data.vehicleType,
          model: data.model,
          year: data.year,
          color: data.color,
          photo: data.vehiclePhoto,
        });
      }
      showToast("تم حفظ التعديلات بنجاح", "success");
      navigate(`/employee/drivers/${id}`);
    } catch (err) {
      console.error(err);
      showToast("حدث خطأ أثناء الحفظ", "error");
    } finally {
      setSaving(false);
    }
  };

  if (!data) {
    return (
      <DashboardLayout role="employee">
        <p className="text-sm text-slate-400">جارِ التحميل...</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="employee">
      <Link to={`/employee/drivers/${id}`} className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-4">
        <ArrowRight size={16} /> رجوع
      </Link>
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800">تعديل بيانات السائق</h1>
      </div>

      <div className="max-w-3xl">
        <DriverForm data={data} errors={errors} onChange={handleChange} />
        <div className="mt-6 flex justify-end">
          <Button onClick={handleSave} loading={saving} size="lg">
            حفظ التعديلات
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EditDriver;
