import { Search, X } from "lucide-react";

const SearchInput = ({ value, onChange, placeholder = "بحث...", className = "" }) => {
	return (
		<div className={`relative ${className}`}>
			<Search
				size={16}
				className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
			/>
			<input
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder={placeholder}
				aria-label={placeholder}
				inputMode="search"
				enterKeyHint="search"
				autoComplete="off"
				className="w-full rounded-lg border border-slate-200 bg-white text-sm pr-10 pl-9 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-colors placeholder:text-slate-400"
			/>
			{value && (
				<button
					type="button"
					onClick={() => onChange("")}
					aria-label="مسح البحث"
					className="absolute left-2.5 top-1/2 -translate-y-1/2 p-1 rounded text-slate-400 hover:text-slate-600"
				>
					<X size={14} />
				</button>
			)}
		</div>
	);
};

export default SearchInput;
