import { Search } from "lucide-react";

export default function SearchSidebar({
  value,
  onChange,
  placeholder = "Search by Contact...",
  className = "",
}) {
  return (
    <div
      className={`mx-3 mt-3 flex items-center gap-2 rounded-xl border-2 border-gray-300 bg-white px-3 py-[7px] focus-within:border-[#b766f9] ${className}`}
    >
      <Search size={18} className="text-gray-500" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
      />
    </div>
  );
}
