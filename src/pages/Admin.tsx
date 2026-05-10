import { useState, useEffect } from "react";
import { useAuth } from "../lib/auth";
import { useSettings, SiteSettings } from "../lib/settings";
import { LogIn, LogOut, Save, Image as ImageIcon, Settings as SettingsIcon, AlertCircle, CheckCircle, MessageSquare, User, Mail as MailIcon, Calendar, Upload, Plus, X, Megaphone, PlayCircle } from "lucide-react";
import { motion } from "motion/react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";

export default function Admin() {
  const { user, isAdmin, loading: authLoading, login, logout, loginWithCredentials } = useAuth();
  const { settings, updateSettings, loading: settingsLoading } = useSettings();
  const [formData, setFormData] = useState<SiteSettings | null>(null);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'settings' | 'messages'>('settings');
  const [messages, setMessages] = useState<any[]>([]);
  
  // Manual login states
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [manualLoginError, setManualLoginError] = useState("");

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: keyof SiteSettings | string, index?: number, subfield?: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    // Helper for compression
    const compressImage = (base64Str: string): Promise<string> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = base64Str;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            // Use JPEG with 0.6 quality for aggressive compression while maintaining decent look
            resolve(canvas.toDataURL('image/jpeg', 0.6));
          } else {
            resolve(base64Str);
          }
        };
      });
    };

    const reader = new FileReader();
    reader.onloadend = async () => {
      const originalBase64 = reader.result as string;
      const compressedBase64 = await compressImage(originalBase64);
      
      if (!formData) {
        setIsUploading(false);
        return;
      }

      if (index !== undefined && subfield) {
        // Handle array updates like manifesto or updates
        const updatedArray = [...(formData[field as keyof SiteSettings] as any[])];
        updatedArray[index] = { ...updatedArray[index], [subfield]: compressedBase64 };
        setFormData({ ...formData, [field]: updatedArray });
      } else {
        // Handle top-level fields
        setFormData({ ...formData, [field as keyof SiteSettings]: compressedBase64 });
      }
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const addNewsItem = () => {
    if (!formData) return;
    const newItems = [...(formData.breakingNews || []), ""];
    updateField('breakingNews', newItems);
  };

  const removeNewsItem = (index: number) => {
    if (!formData) return;
    const newItems = formData.breakingNews.filter((_, i) => i !== index);
    updateField('breakingNews', newItems);
  };

  const updateNewsItem = (index: number, value: string) => {
    if (!formData) return;
    const newItems = [...formData.breakingNews];
    newItems[index] = value;
    updateField('breakingNews', newItems);
  };

  const FileUploadInput = ({ label, field, index, subfield }: { label: string, field: keyof SiteSettings | string, index?: number, subfield?: string }) => (
    <div>
      <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">{label}</label>
      <div className="flex items-center gap-4">
        <label className={`flex-1 cursor-pointer group ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl group-hover:border-red-400 group-hover:bg-red-50 transition-all">
            <Upload size={18} className={`${isUploading ? 'animate-bounce' : 'text-slate-400 group-hover:text-red-600'}`} />
            <span className="text-sm font-bold text-slate-500 group-hover:text-red-700">
              {isUploading ? 'প্রসেস হচ্ছে...' : 'ছবি সিলেক্ট করুন'}
            </span>
            <input 
              type="file" 
              className="hidden" 
              accept="image/*"
              disabled={isUploading}
              onChange={(e) => handleFileUpload(e, field, index, subfield)}
            />
          </div>
        </label>
        {(index !== undefined && subfield ? (formData?.[field as keyof SiteSettings] as any[])?.[index]?.[subfield] : formData?.[field as keyof SiteSettings]) && (
          <div className="w-12 h-12 rounded-lg bg-slate-100 border overflow-hidden">
            <img 
              src={(index !== undefined && subfield ? (formData?.[field as keyof SiteSettings] as any[])?.[index]?.[subfield] : formData?.[field as keyof SiteSettings]) as string} 
              alt="Preview" 
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );

  if (authLoading || settingsLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 sleek-card">
        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <SettingsIcon size={32} />
        </div>
        <h1 className="text-2xl font-black text-center mb-8">অ্যাডমিন লগইন</h1>
        
        <div className="space-y-4 mb-8">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 ml-1">ইউজার নেম</label>
            <input 
              type="text" 
              placeholder="admin"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-600 outline-none transition-all"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 ml-1">পাসওয়ার্ড</label>
            <input 
              type="password" 
              placeholder="admin123"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-600 outline-none transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          {manualLoginError && (
            <p className="text-red-500 text-xs font-bold text-center mt-2">{manualLoginError}</p>
          )}

          <button 
            onClick={async () => {
              const success = await loginWithCredentials(username, password);
              if (!success) {
                setManualLoginError("ইউজারনেম বা পাসওয়ার্ড ভুল!");
              }
            }}
            className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-black transition-all shadow-lg"
          >
            প্রবেশ করুন
          </button>
        </div>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-4 text-slate-400 font-bold tracking-widest">অথবা</span></div>
        </div>

        <button 
          onClick={async () => {
            try {
              await login();
            } catch (e: any) {
              console.error("Login error:", e);
              alert("গুগল লগইন বর্তমানে ডোমেইন এর কারণে সমস্যা করতে পারে। দয়া করে ওপরের ইউজারনেম ও পাসওয়ার্ড ব্যবহার করুন।");
            }
          }}
          className="w-full flex items-center justify-center gap-2 bg-white border-2 border-slate-100 text-slate-700 py-4 rounded-xl font-bold hover:bg-slate-50 transition-all font-mono"
        >
          <LogIn size={20} className="text-red-600" /> Google Login
        </button>
      </div>
    );
  }

  const handleSave = async () => {
    if (!formData || isSaving) return;
    
    setIsSaving(true);
    setStatus(null);

    // Timeout to prevent infinite loading state
    const timer = setTimeout(() => {
      if (isSaving) {
        setIsSaving(false);
        setStatus({ type: 'error', message: 'সেভ করতে অনেক সময় লাগছে। ছবিগুলোর সাইজ অনেক বড় হতে পারে।' });
      }
    }, 20000);

    try {
      // Check payload size (rough estimate for Base64)
      const payloadSize = JSON.stringify(formData).length;
      console.log("Saving payload size:", payloadSize);
      
      if (payloadSize > 1000000) { // 1MB hard limit for Firestore document
        throw new Error("Payload too large. Too many high-resolution images even after compression.");
      }

      await updateSettings(formData);
      setStatus({ type: 'success', message: 'সেটিংস সফলভাবে সেভ হয়েছে!' });
    } catch (error: any) {
      console.error("Save error:", error);
      let msg = 'সেভ করতে সমস্যা হয়েছে।';
      if (error.message?.includes('too large')) {
        msg = 'সবগুলো ছবির মোট সাইজ অনেক বেশি হয়ে গেছে। দয়া করে কয়েকটা ছবি ডিলিট করুন অথবা আরও ছোট ছবি ব্যবহার করুন।';
      } else if (error.message?.includes('permission-denied')) {
        msg = 'পারমিশন নেই! Firebase-এ Cloud Firestore Rules সঠিকভাবে সেটআপ করুন (Realtime Database নয়)।';
      }
      setStatus({ type: 'error', message: msg });
    } finally {
      clearTimeout(timer);
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
            {/* News Ticker */}
            <section className="sleek-card p-8 bg-white border-t-4 border-t-amber-500">
               <h2 className="text-xl font-bold mb-6 flex items-center gap-2 border-b pb-4">
                <Megaphone size={20} className="text-amber-500" /> ব্রেকিং নিউজ স্লাইডার
              </h2>
              <div className="space-y-4">
                {(formData?.breakingNews || []).map((news, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input 
                      type="text" 
                      className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                      placeholder="নিউজ হেডলাইন..."
                      value={news}
                      onChange={(e) => updateNewsItem(idx, e.target.value)}
                    />
                    <button 
                      onClick={() => removeNewsItem(idx)}
                      className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ))}
                <button 
                  onClick={addNewsItem}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-amber-50 text-amber-700 border border-dashed border-amber-200 rounded-xl font-bold hover:bg-amber-100 transition-all"
                >
                  <Plus size={18} /> নতুন নিউজ যোগ করুন
                </button>
              </div>
            </section>

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

            {/* Media Gallery */}
            <section className="sleek-card p-8 bg-white">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2 border-b pb-4">
                <ImageIcon size={20} className="text-emerald-600" /> ফটো ও মিডিয়া (সরাসরি আপলোড)
              </h2>
              <div className="space-y-8">
                <FileUploadInput label="ব্যানার ছবি" field="bannerImage" />
                <FileUploadInput label="পরিচিতি ছবি" field="aboutImage" />
                
                <div className="border-t pt-8">
                  <h3 className="font-bold text-slate-900 mb-4 uppercase tracking-wider text-sm flex items-center gap-2 text-emerald-700">
                    <ImageIcon size={16} /> নির্বাচনী আপডেট গ্যালারি (ছবি ও ভিডিও)
                  </h3>
                  <div className="grid grid-cols-1 gap-6">
                    {formData?.updates.map((update, idx) => (
                      <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex gap-4 items-start">
                        <div className="flex-1 space-y-4">
                           <input 
                            type="text" 
                            placeholder="শিরোনাম"
                            className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg outline-none"
                            value={update.title}
                            onChange={(e) => {
                              const newUpdates = [...(formData?.updates || [])];
                              newUpdates[idx].title = e.target.value;
                              updateField('updates', newUpdates);
                            }}
                          />
                          <textarea 
                            placeholder="বিস্তারিত বর্ণনা"
                            rows={2}
                            className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg outline-none text-sm"
                            value={update.description}
                            onChange={(e) => {
                              const newUpdates = [...(formData?.updates || [])];
                              newUpdates[idx].description = e.target.value;
                              updateField('updates', newUpdates);
                            }}
                          />
                          <input 
                            type="text" 
                            placeholder="ভিডিও লিংক (ঐচ্ছিক)"
                            className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg outline-none font-mono text-xs"
                            value={update.videoUrl || ""}
                            onChange={(e) => {
                              const newUpdates = [...(formData?.updates || [])];
                              newUpdates[idx].videoUrl = e.target.value;
                              updateField('updates', newUpdates);
                            }}
                          />
                          <FileUploadInput label="আপডেট ছবি (বা ভিডিও থাম্বনেইল)" field="updates" index={idx} subfield="image" />
                        </div>
                        <button 
                          onClick={() => {
                            const newUpdates = (formData?.updates || []).filter((_, i) => i !== idx);
                            updateField('updates', newUpdates);
                          }}
                          className="p-2 text-slate-400 hover:text-red-500"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    ))}
                    <button 
                      onClick={() => {
                        const newUpdates = [...(formData?.updates || []), { title: "নতুন আপডেট", description: "বর্ণনা...", image: "", videoUrl: "" }];
                        updateField('updates', newUpdates);
                      }}
                      className="flex items-center justify-center gap-2 w-full py-4 bg-emerald-50 text-emerald-700 border border-dashed border-emerald-200 rounded-xl font-bold hover:bg-emerald-100 transition-all font-mono"
                    >
                      <Plus size={18} /> ADD NEW ITEM
                    </button>
                  </div>
                </div>

                <div className="border-t pt-8">
                  <h3 className="font-bold text-slate-900 mb-4 uppercase tracking-wider text-sm flex items-center gap-2 text-red-600">
                    <PlayCircle size={16} /> ভিডিও গ্যালারি
                  </h3>
                  <div className="grid grid-cols-1 gap-6">
                    {(formData?.videos || []).map((video, idx) => (
                      <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex gap-4 items-start">
                        <div className="flex-1 space-y-4">
                           <input 
                            type="text" 
                            placeholder="ভিডিও শিরোনাম"
                            className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg outline-none font-bold"
                            value={video.title}
                            onChange={(e) => {
                              const newVideos = [...(formData?.videos || [])];
                              newVideos[idx].title = e.target.value;
                              updateField('videos', newVideos);
                            }}
                          />
                          <input 
                            type="text" 
                            placeholder="ভিডিও ইউআরএল (YouTube)"
                            className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg outline-none font-mono text-xs"
                            value={video.url}
                            onChange={(e) => {
                              const newVideos = [...(formData?.videos || [])];
                              newVideos[idx].url = e.target.value;
                              updateField('videos', newVideos);
                            }}
                          />
                          <FileUploadInput label="থাম্বনেইল ইমেজ" field="videos" index={idx} subfield="thumbnail" />
                        </div>
                        <button 
                          onClick={() => {
                            const newVideos = (formData?.videos || []).filter((_, i) => i !== idx);
                            updateField('videos', newVideos);
                          }}
                          className="p-2 text-slate-400 hover:text-red-500"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    ))}
                    <button 
                      onClick={() => {
                        const newVideos = [...(formData?.videos || []), { title: "নতুন ভিডিও", url: "", thumbnail: "" }];
                        updateField('videos', newVideos);
                      }}
                      className="flex items-center justify-center gap-2 w-full py-4 bg-red-50 text-red-700 border border-dashed border-red-200 rounded-xl font-bold hover:bg-red-100 transition-all"
                    >
                      <Plus size={18} /> নতুন ভিডিও যোগ করুন
                    </button>
                  </div>
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
                 <div>
                   <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1">ফেসবুক লিংক</label>
                   <input 
                      type="text" 
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none font-mono text-xs"
                      value={formData?.facebookUrl || ""}
                      onChange={(e) => updateField('facebookUrl', e.target.value)}
                    />
                 </div>
               </div>
               <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-full mt-8 flex items-center justify-center gap-2 bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-black transition-all shadow-xl disabled:opacity-50"
               >
                 <Save size={20} /> {isSaving ? 'সেভ হচ্ছে...' : 'সেভ করুন'}
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
