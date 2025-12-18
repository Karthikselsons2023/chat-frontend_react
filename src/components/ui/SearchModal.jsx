import { Search } from "lucide-react";

export default function SearchModal({
  value,
  onChange,
  placeholder = "Search by Name...",
  className = "",
}) {
  return (
    <div
      className={`mt-3 flex items-center gap-2 rounded-full border-2 border-gray-300 bg-white px-3 py-2 focus-within:border-[#998eff] ${className}`}
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
