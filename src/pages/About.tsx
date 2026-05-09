import Banner from "../components/ui/Banner";
import { motion } from "motion/react";
import { User, Award, ShieldCheck } from "lucide-react";
import { useSettings } from "../lib/settings";

export default function About() {
  const { settings } = useSettings();

  return (
    <div id="about-page">
      <Banner 
        image={settings.aboutImage}
        title={`${settings.siteName}: আমাদের স্বপ্নের কাণ্ডারি।`}
        subtitle="পরিচিতি"
      />

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
                <img 
                  src={settings.aboutImage} 
                  alt={settings.siteName} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-10 -right-10 bg-emerald-800 text-white p-10 rounded-[2rem] hidden md:block shadow-2xl border-4 border-red-600">
                <p className="text-4xl font-black text-red-500 mb-1">২০+</p>
                <p className="text-xs font-bold uppercase tracking-widest opacity-70">বছরের রাজনৈতিক অভিজ্ঞতা</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-10"
            >
              <div>
                <span className="inline-block px-3 py-1 bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-widest mb-4 rounded-full border border-red-100">আমাদের নেতা</span>
                <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">জীবনী ও রাজনৈতিক যাত্রা</h2>
              </div>

              <div className="space-y-8 text-slate-600 leading-relaxed text-lg">
                <p>
                  {settings.aboutText}
                </p>
                <div className="sleek-card p-8 bg-white relative overflow-hidden border-l-8 border-l-red-600">
                   <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-bl-full"></div>
                   <p className="relative z-10 font-bold italic text-slate-800">
                    "ওনার বিশ্বাস, একতাবদ্ধ হয়ে কাজ করলে {settings.address}কে দেশের অন্যতম সেরা ইউনিয়ন হিসেবে গড়ে তোলা সম্ভব। বিগত কয়েক দশকে তিনি শিক্ষা, উন্নয়ন এবং সামাজিক ন্যায়বিচারের পক্ষে নিরলসভাবে কাজ করে যাচ্ছেন।"
                   </p>
                </div>
              </div>
                <p>
                  একজন সুযোগ্য নেতৃত্বের সবচেয়ে বড় গুণ হলো মানুষের পাশে থাকা—এই নীতিতেই তিনি অটল। বিষ্ণুপুরবাসীর প্রতিটি হাসিকান্নায় তিনি সর্বদা অগ্রভাগে থেকে নেতৃত্ব দিয়েছেন।
                </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
                <div className="sleek-card p-5 flex flex-col items-center text-center gap-3 border-b-4 border-emerald-700">
                  <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
                    <User size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm italic">জনবান্ধব</h4>
                  </div>
                </div>
                <div className="sleek-card p-5 flex flex-col items-center text-center gap-3 border-b-4 border-red-600">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center">
                    <Award size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm italic">অভিজ্ঞ</h4>
                  </div>
                </div>
                <div className="sleek-card p-5 flex flex-col items-center text-center gap-3 border-b-4 border-emerald-700">
                  <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm italic">সৎ ও সাহসী</h4>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
