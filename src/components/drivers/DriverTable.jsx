import { Link } from "react-router-dom";
import { Eye, User } from "lucide-react";
import { formatDate } from "../../utils/formatDate";

const DriverTable = ({ drivers, basePath = "/employee/drivers", showEmployee = false }) => {
  if (!drivers.length) {
    return <div className="text-center py-14 text-slate-400 text-sm">لا يوجد سائقون مطابقون</div>;
  }

  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0">
      <table className="w-full text-sm min-w-[760px]">
        <thead>
          <tr className="text-right text-xs text-slate-400 border-b border-slate-100">
            <th className="py-3 px-3 font-medium">السائق</th>
            <th className="py-3 px-3 font-medium">رقم الهوية</th>
            <th className="py-3 px-3 font-medium">الهاتف</th>
            <th className="py-3 px-3 font-medium">رقم الرخصة</th>
            {showEmployee && <th className="py-3 px-3 font-medium">أضيف بواسطة</th>}
            <th className="py-3 px-3 font-medium">تاريخ الإضافة</th>
            <th className="py-3 px-3 font-medium"></th>
          </tr>
        </thead>
        <tbody>
          {drivers.map((driver) => (
            <tr key={driver.id} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
              <td className="py-3 px-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-100 shrink-0">
                    {driver.photo ? (
                      <img src={driver.photo} alt={driver.fullName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <User size={16} />
                      </div>
                    )}
                  </div>
                  <span className="font-medium text-slate-700 whitespace-nowrap">{driver.fullName}</span>
                </div>
              </td>
              <td className="py-3 px-3 text-slate-600 whitespace-nowrap">{driver.nationalId}</td>
              <td className="py-3 px-3 text-slate-600 whitespace-nowrap">{driver.phone}</td>
              <td className="py-3 px-3 text-slate-600 whitespace-nowrap">{driver.licenseNumber}</td>
              {showEmployee && (
                <td className="py-3 px-3 text-slate-600 whitespace-nowrap">{driver.createdByName}</td>
              )}
              <td className="py-3 px-3 text-slate-500 whitespace-nowrap">{formatDate(driver.createdAt)}</td>
              <td className="py-3 px-3">
                <Link to={`${basePath}/${driver.id}`} className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 inline-block">
                  <Eye size={15} />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DriverTable;
