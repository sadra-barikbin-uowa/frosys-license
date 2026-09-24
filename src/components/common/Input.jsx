const Input = ({ label, error, icon: Icon, className = "", containerClassName = "", ...props }) => {
  return (
    <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label className="text-sm font-medium text-slate-700">
          {label}
          {props.required && <span className="text-rose-500 mr-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
        )}
        <input
          className={`w-full rounded-lg border text-sm px-3.5 py-2.5 outline-none transition-colors placeholder:text-slate-400
            ${Icon ? "pr-10" : ""}
            ${error ? "border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-100" : "border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"}
            ${className}`}
          {...props}
        />
      </div>
      {error && <span className="text-xs text-rose-500">{error}</span>}
    </div>
  );
};

export default Input;
