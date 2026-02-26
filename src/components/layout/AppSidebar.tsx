import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileImage,
  Calendar,
  Pill,
  User,
  MessageSquare,
  Utensils,
  LogOut,
  Heart,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: FileImage, label: "Prescriptions", path: "/prescriptions" },
  { icon: Calendar, label: "Appointments", path: "/appointments" },
  { icon: Pill, label: "Medicine Tracker", path: "/medicine" },
  { icon: MessageSquare, label: "AI Health Chat", path: "/chat" },
  { icon: Utensils, label: "Diet Plan", path: "/diet" },
  { icon: User, label: "Profile", path: "/profile" },
];

const AppSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-sidebar text-sidebar-foreground flex flex-col z-50">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
          <Heart className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-sidebar-primary-foreground">MediTrack</h1>
          <p className="text-xs text-sidebar-foreground/60">Health Management</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path}>
              <motion.div
                whileHover={{ x: 4 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-glow"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors">
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default AppSidebar;
