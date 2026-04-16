import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, FileText, History, Menu, LogOut, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/authSlice";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const [open, setOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentDoc } = useSelector((state) => state.docs);

  //  FIX: correct _id (no fallback )
  const docId = currentDoc?._id;

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <Home size={20} />,
    },
    {
      name: "Editor",
      path: docId ? `/editor/${docId}` : "#",
      icon: <FileText size={20} />,
    },
    {
      name: "Versions",
      path: docId ? `/versions/${docId}` : "#",
      icon: <History size={20} />,
    },
  ];

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <>
      {/* OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`fixed md:static z-50 h-screen flex flex-col justify-between transition-all duration-300
        ${open ? "w-56" : "w-20"}
        ${sidebarOpen ? "left-0" : "-left-full"} md:left-0`}
        style={{
          background: "linear-gradient(to bottom, #ffffff, var(--secondary))",
          borderTopRightRadius: "24px",
          borderBottomRightRadius: "24px",
        }}
      >
        {/* TOP */}
        <div>
          {/* Toggle */}
          <div className="p-4 flex justify-between items-center text-gray-700">
            <button onClick={() => setOpen(!open)} className="hidden md:block">
              <Menu />
            </button>

            <button onClick={() => setSidebarOpen(false)} className="md:hidden">
              <X />
            </button>
          </div>

          {/* MENU */}
          <nav className="flex flex-col gap-3 px-2">
            {menuItems.map((item, index) => {
              const isActive = location.pathname.includes(item.path);

              return (
                <Link
                  key={index}
                  to={item.path}
                  onClick={(e) => {
                    //  prevent navigation if no doc selected
                    if (!docId && item.name !== "Dashboard") {
                      e.preventDefault();
                      alert("Open a document first ");
                      return;
                    }

                    setSidebarOpen(false);
                  }}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl transition
                  ${
                    isActive
                      ? "bg-white shadow text-purple-700"
                      : "text-gray-700 hover:bg-white/70"
                  }`}
                >
                  {item.icon}
                  {open && <span>{item.name}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* LOGOUT */}
        <div className="p-3">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-gray-700 hover:bg-red-100 transition"
          >
            <LogOut size={20} />
            {open && <span>Logout</span>}
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
