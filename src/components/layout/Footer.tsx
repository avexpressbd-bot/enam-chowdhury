import { Facebook, Mail, Phone, MapPin, Settings as SettingsIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useSettings } from "../../lib/settings";

export default function Footer() {
  const { settings } = useSettings();

  return (
    <footer id="footer" className="bg-slate-900 text-slate-300 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          <div className="space-y-4">
            <div className="flex items-center justify-center md:justify-start gap-3 text-white">
              <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center font-bold border-2 border-emerald-500">
                EC
              </div>
              <span className="text-xl font-bold tracking-tight">{settings.siteName}</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs mx-auto md:mx-0 opacity-80">
              {settings.address}ের মাটি ও মানুষের প্রিয় নেতা। আমাদের লক্ষ্য একটি আদর্শ ও উন্নত ইউনিয়ন গড়ে তোলা।
            </p>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white tracking-tight border-b border-red-600/30 pb-2 inline-block">দ্রুত লিঙ্ক</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/" className="hover:text-red-500 transition-colors">হোম</Link></li>
              <li><Link to="/about" className="hover:text-red-500 transition-colors">পরিচিতি</Link></li>
              <li><Link to="/manifesto" className="hover:text-red-500 transition-colors">ইশতেহার</Link></li>
              <li><Link to="/gallery" className="hover:text-red-500 transition-colors">গ্যালারি</Link></li>
              <li><Link to="/contact" className="hover:text-red-500 transition-colors">যোগাযোগ</Link></li>
              <li><Link to="/admin" className="hover:text-slate-400 transition-colors flex items-center gap-2 justify-center md:justify-start"><SettingsIcon size={14} /> এডমিন</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white tracking-tight border-b border-emerald-600/30 pb-2 inline-block">যোগাযোগের তথ্য</h3>
            <div className="space-y-4 text-sm justify-center md:justify-start flex flex-col items-center md:items-start text-slate-400">
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-red-500" />
                <span>{settings.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-emerald-500" />
                <span>{settings.email}</span>
              </div>
              <div className="flex items-center gap-3 text-center md:text-left">
                <MapPin size={18} className="text-red-500 shrink-0" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-center gap-4 pt-4">
                <a href={settings.facebookUrl} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-red-600 transition-colors text-white"><Facebook size={20} /></a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-12 pt-8 text-center text-xs text-slate-500">
          <p>© ২০২৬ {settings.siteName}। সর্বস্বত্ব সংরক্ষিত।</p>
        </div>
      </div>
    </footer>
  );
}
