import { Link, useLocation } from "react-router-dom";
import { Menu, X, Settings as SettingsIcon } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useSettings } from "../../lib/settings";
import { useAuth } from "../../lib/auth";

const navLinks = [
  { name: "হোম", path: "/" },
  { name: "পরিচিতি", path: "/about" },
  { name: "ইশতেহার", path: "/manifesto" },
  { name: "গ্যালারি", path: "/gallery" },
  { name: "যোগাযোগ", path: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { settings } = useSettings();
  const { isAdmin } = useAuth();

  return (
    <nav id="navbar" className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200/50 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-emerald-700 rounded-full flex items-center justify-center text-white font-bold transform group-hover:scale-105 transition-transform text-sm border-2 border-red-600">
              EC
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-slate-900 tracking-tight leading-tight">{settings.siteName}</span>
              <span className="text-[10px] text-red-600 font-bold tracking-widest uppercase">১নং বিষ্ণুপুর ইউনিয়ন</span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link text-sm font-semibold tracking-tight ${
                  location.pathname === link.path ? "text-red-700 after:w-full" : "text-slate-600"
                }`}
              >
                {link.name}
              </Link>
            ))}
            {isAdmin && (
              <Link 
                to="/admin" 
                className="p-2 text-slate-500 hover:text-red-600 bg-slate-100 rounded-full transition-colors"
                title="Admin Panel"
              >
                <SettingsIcon size={20} />
              </Link>
            )}
            <button className="bg-red-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg shadow-red-100 hover:bg-emerald-700 hover:shadow-emerald-100 transition-all">
              সহযোগিতা করুন
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            id="mobile-menu-btn"
            className="md:hidden p-2 text-slate-600"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Links */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-slate-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  id={`mobile-nav-${link.path}`}
                  className={`block px-3 py-4 text-base font-semibold border-b border-slate-50 last:border-0 ${
                    location.pathname === link.path ? "text-emerald-600" : "text-slate-600"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 px-3">
                <button className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold">
                  সহযোগিতা করুন
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
