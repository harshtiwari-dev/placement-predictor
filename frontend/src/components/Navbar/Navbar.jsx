import { motion } from "framer-motion";
import { Brain, LogOut } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";


function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-50 backdrop-blur-xl bg-[#0B1020]/80 border-b border-white/10"
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
            <Brain size={18} className="text-white" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-tight">Placement Prediction Portal</p>
            <div className="flex items-center gap-1.5">
              <motion.span
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-green-400"
              />
              <span className="text-green-400 text-xs">ML Model Online</span>
            </div>
          </div>
        </div>

        {user && (
          <div className="flex items-center gap-4">
            <span className="text-slate-300 text-sm hidden sm:block">
              Hi, {user.name}
            </span>
            
            <Link
              to="/dashboard"
              className="text-slate-400 hover:text-white text-sm transition"
            >
              Dashboard
            </Link>

            <Link
              to="/history"
              className="text-slate-400 hover:text-white text-sm transition"
            >
              History
            </Link>

            {user.role === "admin" && (
              <Link
                to="/admin"
                className="text-slate-400 hover:text-white text-sm transition"
              >
                Admin
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        )}
      </div>
    </motion.nav>
  );
}

export default Navbar;