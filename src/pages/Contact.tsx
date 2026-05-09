import Banner from "../components/ui/Banner";
import { motion } from "motion/react";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import { useState, FormEvent, useEffect } from "react";
import { collection, addDoc, serverTimestamp, doc, getDocFromServer } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useSettings } from "../lib/settings";

export default function Contact() {
  const { settings } = useSettings();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if(error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    }
    testConnection();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const path = 'contacts';
    try {
      await addDoc(collection(db, path), {
        ...formData,
        createdAt: serverTimestamp(),
      });
      alert("আপনার বার্তা পাঠানোর জন্য ধন্যবাদ। আমরা দ্রুত আপনার সাথে যোগাযোগ করব।");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
      alert("দুঃখিত, বার্তা পাঠানো সম্ভব হয়নি। দয়া করে পরে চেষ্টা করুন।");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="contact-page">
      <Banner 
        image="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=2000"
        title="আপনার মতামত আমাদের কাছে মূল্যবান।"
        subtitle="যোগাযোগ"
      />

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-12">
              <div>
                <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-widest mb-4 rounded-full border border-emerald-200">যোগাযোগ</span>
                <h2 className="text-3xl font-extrabold text-slate-900 mb-6 tracking-tight">আমাদের সাথে <span className="text-red-600">যোগাযোগ</span> করুন</h2>
                <p className="text-slate-600 leading-relaxed font-bold uppercase text-xs tracking-[0.2em] mb-8">
                  আপনার পরামর্শ বা মতামত দিন
                </p>
                
                <div className="space-y-8">
                  <div className="flex items-start gap-6">
                    <div className="bg-red-50 p-4 rounded-2xl text-red-600 border border-red-100">
                      <Phone size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 tracking-tight">ফোন নম্বর</h4>
                      <p className="text-slate-600 font-medium">{settings.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6">
                    <div className="bg-emerald-50 p-4 rounded-2xl text-emerald-700 border border-emerald-100">
                      <Mail size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 tracking-tight">ইমেইল</h4>
                      <p className="text-slate-600 font-medium">{settings.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6">
                    <div className="bg-red-50 p-4 rounded-2xl text-red-600 border border-red-100">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 tracking-tight">অফিস ঠিকানা</h4>
                      <p className="text-slate-600 font-medium">{settings.address} সদর, চাঁদপুর।</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Link Card */}
              <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-bl-full"></div>
                <h4 className="text-xl font-bold mb-4 tracking-tight">সামাজিক যোগাযোগ</h4>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">ফেইসবুক পেজে আমাদের নতুন ছবি ও আপডেট নিয়মিত দেখতে পাবেন।</p>
                <a href="#" className="inline-flex items-center gap-2 text-red-500 font-black hover:text-red-400 transition-colors uppercase text-xs tracking-widest">
                  আমাদের ফেইসবুক পেজ →
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white p-8 md:p-12 rounded-[3rem] shadow-xl border border-slate-100 border-t-8 border-t-emerald-700"
              >
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">আপনার নাম</label>
                      <input 
                        type="text" 
                        required
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-red-100 focus:border-red-600 transition-all outline-none font-medium"
                        placeholder="নাম লিখুন"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">ইমেইল ঠিকানা</label>
                      <input 
                        type="email" 
                        required
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-red-100 focus:border-red-600 transition-all outline-none font-medium"
                        placeholder="example@mail.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">বিষয়</label>
                    <input 
                      type="text" 
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-red-100 focus:border-red-600 transition-all outline-none font-medium"
                      placeholder="কি বিষয়ে জানতে চান?"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">আপনার বার্তা</label>
                    <textarea 
                      rows={6}
                      required
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-red-100 focus:border-red-600 transition-all outline-none resize-none font-medium"
                      placeholder="আপনার মতামত বিস্তারিত লিখুন..."
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                    ></textarea>
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full md:w-auto px-12 py-5 bg-emerald-700 text-white font-black rounded-2xl hover:bg-emerald-800 transform hover:-translate-y-1 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-emerald-200 uppercase tracking-widest text-sm ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? 'পাঠানো হচ্ছে...' : 'বার্তা পাঠান'} <Send size={20} />
                  </button>
                </form>
              </motion.div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
