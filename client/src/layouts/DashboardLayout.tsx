import { useEffect, useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Wrench,
  FileText,
  LogOut,
  Menu,
  X,
  Moon,
  Sun
} from 'lucide-react';
import clsx from 'clsx';
import logo from '../assets/icono.png';

function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false;
    const stored = localStorage.getItem('theme');
    if (stored === 'dark') return true;
    if (stored === 'light') return false;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/');
  };

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Inicio', exact: true },
    { path: '/dashboard/citas', icon: CalendarDays, label: 'Citas' },
    { path: '/dashboard/servicios', icon: Wrench, label: 'Servicios' },
    { path: '/dashboard/clientes', icon: Users, label: 'Clientes' },
    { path: '/dashboard/facturacion', icon: FileText, label: 'Facturación' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        initial={{ width: 280 }}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="bg-white/95 dark:bg-slate-900/95 border-r border-slate-200 dark:border-slate-800 shadow-sm z-20 flex flex-col relative backdrop-blur"
      >
        {/* Logo */}
        <div className="h-20 flex items-center px-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg overflow-hidden shadow-md bg-white dark:bg-slate-900 p-1 shrink-0">
              <img src={logo} alt="FMSS Logo" className="w-full h-full object-contain" />
            </div>
            {isSidebarOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 3 }}
                className="font-bold text-xl text-slate-800 dark:text-slate-100 tracking-tight"
              >
                FMSS
              </motion.span>
            )}
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="absolute -right-3 top-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 shadow-sm hover:shadow transition-all"
          >
            {isSidebarOpen ? <X size={14} /> : <Menu size={14} />}
          </button>

        </div>

        {/* Nav */}
        <nav className="flex-1 py-6 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              className={({ isActive }) => clsx(
                "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                isActive
                  ? "bg-blue-50 text-blue-600 font-medium shadow-sm dark:bg-blue-500/20 dark:text-blue-200"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800/80 dark:hover:text-slate-100"
              )}
            >
              <item.icon size={22} className="shrink-0" />
              {isSidebarOpen && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className="whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              )}

              {/* Indicador activo estilo iOS */}
              <NavLink to={item.path} end={item.exact}>
                {({ isActive }) => isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-full"
                  />
                )}
              </NavLink>
            </NavLink>
          ))}
        </nav>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-slate-100">
          <div className={clsx("flex items-center gap-3", !isSidebarOpen && "justify-center")}>
            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-200 font-bold shrink-0">
              {(localStorage.getItem('userName') || 'AD').substring(0, 2).toUpperCase()}
            </div>
            {isSidebarOpen && (
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-100 truncate">{localStorage.getItem('userName') || 'Usuario'}</p>
                <p className="text-xs text-slate-400 dark:text-slate-400 truncate">{localStorage.getItem('userEmail') || 'Sin correo'}</p>
              </div>
            )}
            {isSidebarOpen && (
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-400 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 rounded-lg transition-colors"
                title="Cerrar Sesión"
              >
                <LogOut size={20} />
              </button>
            )}
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative bg-slate-50/50 dark:bg-slate-950/80">
        <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 px-8 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
            {/* Aquí podríamos poner el título dinámico según la ruta */}
            Panel de Control
          </h2>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDarkMode((prev) => !prev)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-900/60 text-slate-600 dark:text-slate-200 text-xs font-medium shadow-sm hover:shadow-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isDarkMode ? (
                <Sun size={16} className="text-amber-400" />
              ) : (
                <Moon size={16} className="text-sky-400" />
              )}
              <span>{isDarkMode ? 'Modo claro' : 'Modo oscuro'}</span>
            </button>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium border border-green-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/40">
              Sistema Activo
            </span>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout;
