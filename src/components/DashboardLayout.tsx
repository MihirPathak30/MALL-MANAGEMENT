import { ReactNode, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { clearSession, getSession } from "@/utils/storage";
import { toggleTheme, getTheme } from "@/utils/theme";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Moon,
  Sun,
  Menu,
  X,
  Store,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: ReactNode;
}

interface NavItem {
  label: string;
  path: string;
  icon: ReactNode;
  roles: string[];
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
    roles: ["Mall Manager", "Inventory Manager", "Cashier", "Sales Executive"],
  },
  {
    label: "Inventory",
    path: "/inventory",
    icon: <Package className="w-5 h-5" />,
    roles: ["Mall Manager", "Inventory Manager"],
  },
  {
    label: "Billing",
    path: "/billing",
    icon: <ShoppingCart className="w-5 h-5" />,
    roles: ["Mall Manager", "Cashier"],
  },
  {
    label: "Customers",
    path: "/customers",
    icon: <Users className="w-5 h-5" />,
    roles: ["Mall Manager", "Cashier", "Sales Executive"],
  },
  {
    label: "Reports",
    path: "/reports",
    icon: <BarChart3 className="w-5 h-5" />,
    roles: ["Mall Manager", "Inventory Manager", "Cashier", "Sales Executive"],
  },
  {
    label: "Settings",
    path: "/settings",
    icon: <Settings className="w-5 h-5" />,
    roles: ["Mall Manager", "Inventory Manager", "Cashier", "Sales Executive"],
  },
];

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [isDark, setIsDark] = useState(getTheme() === "dark");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = getSession();

  const handleLogout = () => {
    clearSession();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleThemeToggle = () => {
    const newTheme = toggleTheme();
    setIsDark(newTheme === "dark");
  };

  const filteredNavItems = navItems.filter(
    (item) => user && item.roles.includes(user.role)
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full bg-sidebar border-r border-sidebar-border z-50 transition-transform duration-300",
          "w-64 flex flex-col",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="p-2 gradient-primary rounded-lg">
              <Store className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-sidebar-foreground">Mall Manager</h2>
              <p className="text-xs text-sidebar-foreground/60">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {filteredNavItems.map((item) => (
            <Button
              key={item.path}
              variant={location.pathname === item.path ? "default" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 h-11",
                location.pathname !== item.path && "hover:bg-sidebar-accent"
              )}
              onClick={() => {
                navigate(item.path);
                setSidebarOpen(false);
              }}
            >
              {item.icon}
              <span>{item.label}</span>
            </Button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start gap-3"
            onClick={handleThemeToggle}
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            <span>{isDark ? "Light" : "Dark"} Mode</span>
          </Button>
          <Button
            variant="destructive"
            className="w-full justify-start gap-3"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </Button>
        </div>
      </aside>

      {/* Mobile Menu Button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="md:ml-64 min-h-screen">
        <div className="p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
