import { useRef } from "react";
import { Camera, Upload, X, RefreshCw } from "lucide-react";

// مكون رفع صور عام: يحوّل الصورة إلى Base64 عبر FileReader ليتم تخزينها في LocalStorage
const ImageUpload = ({ label, value, onChange, error, shape = "square" }) => {
  const inputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result);
    reader.readAsDataURL(file);
  };

  const shapeClass = shape === "circle" ? "rounded-full" : "rounded-xl";

  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
      <div className="flex items-center gap-4">
        <div
          className={`relative w-24 h-24 ${shapeClass} overflow-hidden bg-slate-50 ring-1 ${
            error ? "ring-rose-300" : "ring-slate-200"
          } flex items-center justify-center shrink-0`}
        >
          {value ? (
            <img src={value} alt={label} className="w-full h-full object-cover" />
          ) : (
            <Camera size={28} className="text-slate-300" />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
            >
              {value ? <RefreshCw size={14} /> : <Upload size={14} />}
              {value ? "تغيير الصورة" : "رفع صورة"}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange(null)}
                className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
              >
                <X size={14} />
                إزالة
              </button>
            )}
          </div>
          <span className="text-[11px] text-slate-400">JPG, PNG — حتى 5MB</span>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>
      {error && <span className="text-xs text-rose-500">{error}</span>}
    </div>
  );
};

export default ImageUpload;
