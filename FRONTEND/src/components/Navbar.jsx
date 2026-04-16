import { TEXT } from "../utils/constants";
import { Menu } from "lucide-react";
import { useSelector } from "react-redux";

const Navbar = ({ setSidebarOpen }) => {
  const { user } = useSelector((state) => state.auth);

  //  fallback from localStorage (instant)
  const storedUser = JSON.parse(localStorage.getItem("user"));

  const finalUser = user || storedUser;

  const getInitials = (name) => {
    if (!name) return "";

    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const initials = getInitials(finalUser?.name);

  return (
    <div className="p-3">
      <div
        className="h-14 flex items-center justify-between px-6 rounded-3xl shadow-md border border-gray-200"
        style={{
          background: "linear-gradient(135deg, var(--secondary), #ffffff)",
        }}
      >
        {/* LEFT */}
        <div className="flex items-center gap-3">
          <button
            className="md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu />
          </button>

          <h1 className="font-bold text-lg text-gray-800">
            {TEXT.appName}
          </h1>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold shadow">
            {initials || "?"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;