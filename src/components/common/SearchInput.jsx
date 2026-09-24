import { Search, X } from "lucide-react";

const SearchInput = ({ value, onChange, placeholder = "بحث...", className = "" }) => {
  return (
    <div className={`relative ${className}`}>
      <Search size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-200 text-sm pr-10 pl-9 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-colors placeholder:text-slate-400"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};

export default SearchInput;
