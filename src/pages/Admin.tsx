import { useState } from "react";
import { useAuth } from "../lib/auth";
import { useSettings, SiteSettings } from "../lib/settings";
import { LogIn, LogOut, Save, Image as ImageIcon, Settings as SettingsIcon, AlertCircle, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

export default function Admin() {
  const { user, isAdmin, loading: authLoading, login, logout } = useAuth();
  const { settings, updateSettings, loading: settingsLoading } = useSettings();
  const [formData, setFormData] = useState<SiteSettings | null>(null);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize form data when settings are loaded
  if (!formData && settings) {
    setFormData(settings);
  }

  if (authLoading || settingsLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 sleek-card text-center">
        <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <SettingsIcon size={40} />
        </div>
        <h1 className="text-2xl font-bold mb-4">অ্যাডমিন প্যানেল</h1>
        <p className="text-slate-600 mb-8">এই পৃষ্ঠাটি শুধুমাত্র অ্যাডমিনদের জন্য। অনুগ্রহ করে লগইন করুন।</p>
        <button 
          onClick={login}
          className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-4 rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-100"
        >
          <LogIn size={20} /> গুগল দিয়ে লগইন করুন
        </button>
      </div>
    );
  }

  const handleSave = async () => {
    if (!formData) return;
    setIsSaving(true);
    setStatus(null);
    try {
      await updateSettings(formData);
      setStatus({ type: 'success', message: 'সেটিংস সফলভাবে সেভ হয়েছে!' });
    } catch (error) {
      setStatus({ type: 'error', message: 'সেভ করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।' });
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = (field: keyof SiteSettings, value: any) => {
    if (!formData) return;
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">অ্যাডমিন প্যানেল</h1>
          <p className="text-slate-600">সাইটের কন্টেন্ট এখান থেকে পরিবর্তন করুন</p>
        </div>
        <button 
          onClick={logout}
          className="flex items-center gap-2 text-slate-600 hover:text-red-600 font-bold transition-colors"
        >
          <LogOut size={20} /> লগআউট
        </button>
      </div>

      {status && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-8 p-4 rounded-xl flex items-center gap-3 ${
            status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
          }`}
        >
          {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <span className="font-bold">{status.message}</span>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          {/* General Settings */}
          <section className="sleek-card p-8 bg-white">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 border-b pb-4">
              <SettingsIcon size={20} className="text-red-600" /> সাধারণ সেটিংস
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">সাইটের নাম</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
                  value={formData?.siteName}
                  onChange={(e) => updateField('siteName', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">স্লোগান</label>
                <textarea 
                  rows={2}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
                  value={formData?.slogan}
                  onChange={(e) => updateField('slogan', e.target.value)}
                />
              </div>
            </div>
          </section>

          {/* Contact Info */}
          <section className="sleek-card p-8 bg-white">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 border-b pb-4">
              <ImageIcon size={20} className="text-emerald-600" /> ফটো ও মিডিয়া
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">ব্যানার ইমেজ ইউআরএল</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
                  value={formData?.bannerImage}
                  onChange={(e) => updateField('bannerImage', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">পরিচিতি ইমেজ ইউআরএল</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
                  value={formData?.aboutImage}
                  onChange={(e) => updateField('aboutImage', e.target.value)}
                />
              </div>
            </div>
          </section>

          {/* About Section */}
          <section className="sleek-card p-8 bg-white">
            <h2 className="text-xl font-bold mb-6 border-b pb-4">জীবনবৃত্তান্ত</h2>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">পরিচিতি লেখা</label>
              <textarea 
                rows={6}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
                value={formData?.aboutText}
                onChange={(e) => updateField('aboutText', e.target.value)}
              />
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section className="sleek-card p-8 bg-white sticky top-24">
             <h2 className="text-xl font-bold mb-6 border-b pb-4">যোগাযোগ</h2>
             <div className="space-y-4">
               <div>
                 <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1">ফোন</label>
                 <input 
                    type="text" 
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                    value={formData?.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                  />
               </div>
               <div>
                 <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1">ইমেইল</label>
                 <input 
                    type="text" 
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                    value={formData?.email}
                    onChange={(e) => updateField('email', e.target.value)}
                  />
               </div>
               <div>
                 <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1">ঠিকানা</label>
                 <input 
                    type="text" 
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                    value={formData?.address}
                    onChange={(e) => updateField('address', e.target.value)}
                  />
               </div>
             </div>
             <button 
                onClick={handleSave}
                disabled={isSaving}
                className="w-full mt-8 flex items-center justify-center gap-2 bg-emerald-700 text-white py-4 rounded-xl font-bold hover:bg-emerald-800 transition-all shadow-lg disabled:opacity-50"
             >
               <Save size={20} /> {isSaving ? 'সেভ হচ্ছে...' : 'পরিবর্তন সেভ করুন'}
             </button>
          </section>
        </div>
      </div>
    </div>
  );
}
