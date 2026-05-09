import { motion } from "motion/react";
import Banner from "../components/ui/Banner";
import { PlayCircle, Image as ImageIcon, MessageCircle } from "lucide-react";
import { useSettings } from "../lib/settings";

export default function Home() {
  const { settings } = useSettings();

  return (
    <div id="home-page">
      <Banner 
        image={settings.bannerImage}
        title={`${settings.address}ের মাটি ও মানুষের প্রিয় নেতা ${settings.siteName}-এর অফিসিয়াল ওয়েবসাইট।`}
        slogan={settings.slogan}
        subtitle="অফিসিয়াল পোর্টাল"
      />

      {/* Latest Updates Section */}
      <section id="updates" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div>
              <span className="inline-block px-3 py-1 bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-widest mb-4 rounded-full border border-red-100">সাম্প্রতিক</span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">সর্বশেষ <span className="text-emerald-700">আপডেট</span></h2>
            </div>
            <p className="text-slate-600 max-w-md text-lg font-medium leading-relaxed">এনাম ভাইয়ের সর্বশেষ নির্বাচনী সভার ভিডিও এবং কর্মকাণ্ডের একঝলক দেখুন।</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {settings.updates.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="sleek-card p-4 group cursor-pointer border-t-4 border-t-red-600"
              >
                <div className="relative overflow-hidden rounded-xl mb-6 shadow-sm lg:aspect-video">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-red-900/0 group-hover:bg-red-900/40 transition-colors flex items-center justify-center">
                    <PlayCircle size={48} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                <div className="px-2 pb-2">
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Quick Links / Highlights */}
      <section id="highlights" className="bg-slate-900 py-20 text-white text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-10 left-10 w-64 h-64 bg-red-600 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-64 h-64 bg-emerald-600 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 tracking-tight">আমাদের সাথে <span className="text-red-500">যুক্ত</span> থাকুন</h2>
          <div className="flex flex-wrap justify-center gap-12 md:gap-20">
            <div className="flex flex-col items-center gap-4 group cursor-pointer">
              <div className="w-20 h-20 bg-emerald-700/20 border border-emerald-500/30 rounded-2xl flex items-center justify-center backdrop-blur-md transform group-hover:scale-110 group-hover:bg-emerald-600 transition-all">
                <ImageIcon size={32} className="text-emerald-400" />
              </div>
              <span className="font-bold tracking-tight text-emerald-400">গ্যালারি</span>
            </div>
            <div className="flex flex-col items-center gap-4 group cursor-pointer">
              <div className="w-20 h-20 bg-red-700/20 border border-red-500/30 rounded-2xl flex items-center justify-center backdrop-blur-md transform group-hover:scale-110 group-hover:bg-red-600 transition-all">
                <PlayCircle size={32} className="text-red-400" />
              </div>
              <span className="font-bold tracking-tight text-red-400">ভিডিও বার্তা</span>
            </div>
            <div className="flex flex-col items-center gap-4 group cursor-pointer">
              <div className="w-20 h-20 bg-emerald-700/20 border border-emerald-500/30 rounded-2xl flex items-center justify-center backdrop-blur-md transform group-hover:scale-110 group-hover:bg-emerald-600 transition-all">
                <MessageCircle size={32} className="text-emerald-400" />
              </div>
              <span className="font-bold tracking-tight text-emerald-400">মতামত</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
