import { useState, useEffect } from "react";
import { useAuth } from "../lib/auth";
import { useSettings, SiteSettings } from "../lib/settings";
import { LogIn, LogOut, Save, Image as ImageIcon, Settings as SettingsIcon, AlertCircle, CheckCircle, MessageSquare, User, Mail as MailIcon, Calendar } from "lucide-react";
import { motion } from "motion/react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";

export default function Admin() {
  const { user, isAdmin, loading: authLoading, login, logout } = useAuth();
  const { settings, updateSettings, loading: settingsLoading } = useSettings();
  const [formData, setFormData] = useState<SiteSettings | null>(null);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'settings' | 'messages'>('settings');
  const [messages, setMessages] = useState<any[]>([]);

  // Initialize form data when settings are loaded
  useEffect(() => {
    if (settings && !formData) {
      setFormData(settings);
    }
  }, [settings, formData]);

  // Fetch messages
  useEffect(() => {
    if (isAdmin) {
      const q = query(collection(db, "contacts"), orderBy("createdAt", "desc"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });
      return () => unsubscribe();
    }
  }, [isAdmin]);

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
        {user ? (
          <div className="mb-8 space-y-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <p className="text-sm text-slate-500 mb-1">লগইন করা ইমেইল:</p>
              <p className="font-bold text-slate-900 break-all">{user.email || "No Email Found"}</p>
            </div>
            
            <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
              <p className="text-red-600 text-sm font-bold flex items-center justify-center gap-2">
                <AlertCircle size={16} /> অ্যাডমিন এক্সেস নেই
              </p>
              <p className="text-red-500 text-xs mt-1">আপনার এই ইমেইলটি অ্যাডমিন হিসেবে তালিকাভুক্ত নয়।</p>
            </div>

            <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 text-amber-800 text-xs text-left">
              <p className="font-bold mb-2 flex items-center gap-2">
                <SettingsIcon size={14} /> কী করবেন?
              </p>
              <ol className="list-decimal pl-4 space-y-3">
                <li>আপনার পাঠানো স্ক্রিনশটে যে নীল রঙের <strong>"Save"</strong> বাটন আছে সেটি ক্লিক করুন।</li>
                <li>
                  নিচের ডোমেইনগুলো কপি করে Firebase Console-এ <strong>Authentication {'->'} Settings {'->'} Authorized domains</strong>-এ "Add domain" বাটনে ক্লিক করে একটি একটি করে অ্যাড করুন:
                  <div className="mt-2 space-y-1 font-mono bg-white/50 p-2 rounded-lg border border-amber-200">
                    <p className="select-all">ais-pre-qqwzr5d4nlzk67hdxyd7lw-165413010212.asia-east1.run.app</p>
                    <p className="select-all">ais-dev-qqwzr5d4nlzk67hdxyd7lw-165413010212.asia-east1.run.app</p>
                  </div>
                </li>
                <li>নিশ্চিত করুন আপনি <strong>jummanbepari5@gmail.com</strong> দিয়ে লগইন করেছেন।</li>
              </ol>
            </div>

            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-blue-800 text-xs text-left">
              <p className="font-bold mb-2 flex items-center gap-2">
                <CheckCircle size={14} /> Firestore Rules সেটআপ
              </p>
              <p className="mb-2">Firestore Database-এ গিয়ে "Rules" ট্যাবে নিচের কোডটি কপি করে পেস্ট করুন এবং "Publish" করুন:</p>
              <pre className="p-3 bg-slate-900 text-slate-100 rounded-lg overflow-x-auto text-[10px]">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null && 
      request.auth.token.email == "jummanbepari5@gmail.com";
    }
  }
}`}
              </pre>
            </div>
            
            <div className="text-left text-[10px] text-slate-400 font-mono bg-slate-50 p-3 rounded-lg overflow-auto max-h-40 border border-slate-200">
              <p className="text-slate-500 font-bold border-b pb-1 mb-1">Debug Status:</p>
              <p>Email: {user.email || "No Email Found"}</p>
              <p>User UID: {user.uid}</p>
              <p>IsAdmin (App State): {String(isAdmin)}</p>
              <p>Domain: {window.location.hostname}</p>
            </div>
          </div>
        ) : (
          <p className="text-slate-600 mb-8">এই পৃষ্ঠাটি শুধুমাত্র অ্যাডমিনদের জন্য। অনুগ্রহ করে লগইন করুন।</p>
        )}
        
        {!user ? (
          <button 
            onClick={async () => {
              try {
                await login();
              } catch (e: any) {
                console.error("Login error:", e);
                const errorCode = e.code || "unknown";
                const errorMessage = e.message || "সমস্যা হয়েছে";
                alert(`লগইন করতে সমস্যা হয়েছে।\nError Code: ${errorCode}\nError: ${errorMessage}\n\nপরামর্শ: Firebase-এ Google Auth ইনাবল আছে কি না এবং Authorized Domains-এ আপনার সাইট অ্যাড করা আছে কি না চেক করুন।`);
              }
            }}
            className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-4 rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-100"
          >
            <LogIn size={20} /> গুগল দিয়ে লগইন করুন
          </button>
        ) : (
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 bg-slate-200 text-slate-700 py-4 rounded-xl font-bold hover:bg-slate-300 transition-all"
          >
            <LogOut size={20} /> অন্য একাউন্ট দিয়ে চেষ্টা করুন
          </button>
        )}
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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">অ্যাডমিন প্যানেল</h1>
          <p className="text-slate-600">সাইটের কন্ট্রোল সেন্টার</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button 
              onClick={() => setActiveTab('settings')}
              className={`px-6 py-2 rounded-lg font-bold transition-all ${activeTab === 'settings' ? 'bg-white shadow-sm text-red-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              সেটিংস
            </button>
            <button 
              onClick={() => setActiveTab('messages')}
              className={`px-6 py-2 rounded-lg font-bold transition-all flex items-center gap-2 ${activeTab === 'messages' ? 'bg-white shadow-sm text-red-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              মেসেজ {messages.length > 0 && <span className="bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">{messages.length}</span>}
            </button>
          </div>
          <button 
            onClick={logout}
            className="flex items-center gap-2 text-slate-600 hover:text-red-600 font-bold transition-colors ml-4"
          >
            <LogOut size={20} /> লগআউট
          </button>
        </div>
      </div>

      {status && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-8 p-4 rounded-xl flex items-center gap-3 ${
            status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
          }`}
        >
          {status.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span className="font-bold">{status.message}</span>
        </motion.div>
      )}

      {activeTab === 'settings' ? (
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
                    value={formData?.siteName || ""}
                    onChange={(e) => updateField('siteName', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">স্লোগান</label>
                  <textarea 
                    rows={2}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
                    value={formData?.slogan || ""}
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
                    value={formData?.bannerImage || ""}
                    onChange={(e) => updateField('bannerImage', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">পরিচিতি ইমেজ ইউআরএল</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
                    value={formData?.aboutImage || ""}
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
                  value={formData?.aboutText || ""}
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
                      value={formData?.phone || ""}
                      onChange={(e) => updateField('phone', e.target.value)}
                    />
                 </div>
                 <div>
                   <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1">ইমেইল</label>
                   <input 
                      type="text" 
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                      value={formData?.email || ""}
                      onChange={(e) => updateField('email', e.target.value)}
                    />
                 </div>
                 <div>
                   <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1">ঠিকানা</label>
                   <input 
                      type="text" 
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                      value={formData?.address || ""}
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
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">প্রাপ্ত মেসেজসমূহ ({messages.length})</h2>
          </div>
          {messages.length === 0 ? (
            <div className="p-12 sleek-card bg-white text-center">
              <MessageSquare size={40} className="text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">এখনো কোনো মেসেজ পাওয়া যায়নি।</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {messages.map((msg) => (
                <div key={msg.id} className="sleek-card p-6 bg-white border-l-4 border-l-red-600 hover:shadow-lg transition-shadow">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600">
                        <User size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{msg.name}</h4>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <MailIcon size={12} /> {msg.email}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full uppercase tracking-wider">
                      <Calendar size={12} /> {msg.createdAt?.toDate().toLocaleString('bn-BD')}
                    </div>
                  </div>
                  <div className="pl-14">
                    <div className="bg-slate-50 p-4 rounded-xl">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">আগ্রহের বিষয়: {msg.subject || 'নেই'}</p>
                      <p className="text-slate-700 leading-relaxed font-medium">{msg.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
