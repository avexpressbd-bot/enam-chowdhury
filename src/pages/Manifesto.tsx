import Banner from "../components/ui/Banner";
import { motion } from "motion/react";
import { Zap, Map, HeartHandshake, BookOpen } from "lucide-react";
import { useSettings } from "../lib/settings";

export default function Manifesto() {
  const { settings } = useSettings();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Zap': return <Zap size={32} />;
      case 'Map': return <Map size={32} />;
      case 'HeartHandshake': return <HeartHandshake size={32} />;
      case 'BookOpen': return <BookOpen size={32} />;
      default: return <Zap size={32} />;
    }
  };

  return (
    <div id="manifesto-page">
      <Banner 
        image="https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=2000"
        title="আমাদের স্বপ্ন: আপনার ভবিষ্যৎ।"
        subtitle="ইশতেহার"
      />

      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-widest mb-4 rounded-full border border-emerald-200">পরিবেশ ও পরিকল্পনা</span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">অঙ্গীকারের <span className="text-red-700">পয়েন্টসমূহ</span></h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed font-medium">
              আগামী দিনের উন্নত বিষ্ণুপুর গড়ার লক্ষ্যে আমাদের সুনির্দিষ্ট ৪টি পরিকল্পনা যা আপনার জীবনযাত্রার মান পরিবর্তন করবে।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {(settings.manifesto || []).map((point, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="sleek-card p-8 group overflow-hidden border-b-4 border-b-red-600 bg-white"
              >
                <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-8 border border-red-100 group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
                  {getIcon(point.icon)}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-emerald-700 transition-all tracking-tight">{point.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm font-medium">
                  {point.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Statement */}
      <section className="py-24 bg-slate-900 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px]"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="space-y-10"
          >
            <div className="inline-block p-6 bg-red-600 text-white rounded-3xl shadow-2xl shadow-red-500/20">
              <HeartHandshake size={48} />
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight italic">
               "বিষ্ণুপুর হবে শান্তির জনপদ, <br/>
               <span className="text-emerald-500 uppercase not-italic tracking-wider text-5xl md:text-6xl mt-4 block">উন্নয়নের রোল মডেল</span>"
            </h2>
            <p className="text-xl text-slate-400 leading-loose font-medium">
              আমরা কেবল প্রতিশ্রুতি দেওয়ায় বিশ্বাসী নই, বরং কাজ করার মাধ্যমে আপনাদের বিশ্বাস অর্জন করতে চাই। আপনাদের একটি ভোট হবে বিষ্ণুপুরের ভবিষ্যৎ পরিবর্তনের মূল শক্তি।
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
