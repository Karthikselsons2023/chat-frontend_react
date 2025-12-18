import { X, LogOut } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";

function DetailRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-gray-500 text-[13px]">{label}</span>
      <span className="text-gray-900 text-right break-all font-medium">
        {value || "-"}
      </span>
    </div>
  );
}


export default function ProfileDetailsModal({ open, onClose }) {
  const { authUser, logout } = useAuthStore();

  if (!authUser) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center
        ${open ? "pointer-events-auto" : "pointer-events-none"}
      `}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`
          absolute inset-0 bg-black/40
          transition-all duration-200
          ${open ? "backdrop-blur-sm opacity-100" : "backdrop-blur-0 opacity-0"}
        `}
      />

      {/* Modal */}
      <div
        className={`
          relative z-10 sm:w-full w-[80%] max-w-sm
          rounded-xl bg-white p-6 shadow-xl
          transform transition-all duration-200 ease-out
          ${open ? "scale-100 opacity-100" : "scale-95 opacity-0"}
          flex flex-col items-center
        `}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={18} />
        </button>

        {/* Avatar */}
        <img
          src={authUser.profile}
          alt={authUser.name}
          className="h-20 w-20 rounded-full object-cover mb-3"
        />

        {/* Name */}
        <h2 className="text-lg font-semibold">{authUser.name}</h2>

        {/* Meta */}
        <div className="mt-5 w-full space-y-3 text-sm">
  <DetailRow label="Name" value={authUser.name} />
  <DetailRow label="Email" value={authUser.email} />
  <DetailRow label="Phone" value={authUser.phone} />
  <DetailRow label="User ID" value={authUser.user_id} />
</div>


        {/* Divider */}
        <div className="w-full h-px bg-gray-200 my-5" />

        {/* Logout */}
        <button
          onClick={() => {
            logout();
            onClose();
          }}
          className="w-full flex items-center justify-center gap-2
            rounded-lg bg-red-500 py-2 text-sm font-medium text-white
            hover:bg-red-600 transition cursor-pointer"
        >
       
            <LogOut size={16}  />
       
          Logout
        </button>
      </div>
    </div>
  );
}
