import Banner from "../components/ui/Banner";
import { motion } from "motion/react";
import { Play } from "lucide-react";
import { useSettings } from "../lib/settings";

export default function Gallery() {
  const { settings } = useSettings();
  const photos = (settings.updates || []).map(u => u.image).concat(settings.aboutImage, settings.bannerImage);
  const videos = settings.videos || [];

  return (
    <div id="gallery-page">
      <Banner 
        image={settings.bannerImage}
        title="জনগণই আমাদের শক্তি।"
        subtitle="গ্যালারি"
      />

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest mb-4 rounded-full border border-red-100">স্থিরচিত্র</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">গণসংযোগের <span className="text-emerald-700">চিত্রসমূহ</span></h2>
          </div>

          {/* Photo Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
            {(photos || []).filter(p => !!p).map((photo, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="group relative h-80 rounded-[2rem] overflow-hidden cursor-zoom-in shadow-xl hover:shadow-2xl transition-all border-4 border-white"
              >
                <img 
                  src={photo} 
                  alt={`ছবি ${index + 1}`} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-red-900/0 group-hover:bg-red-900/20 transition-colors"></div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest mb-4 rounded-full border border-emerald-100">ভিডিও বার্তা</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">বিশেষ <span className="text-red-600">ভিডিও বার্তা</span></h2>
          </div>

          {/* Video Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {videos.map((vid, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group cursor-pointer sleek-card p-4 border-t-8 border-t-emerald-700"
              >
                <div className="relative h-80 rounded-2xl overflow-hidden mb-6 shadow-xl">
                  <img 
                    src={vid.thumbnail} 
                    alt={vid.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
                    <a 
                      href={vid.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center text-white transform group-hover:scale-110 transition-transform shadow-2xl"
                    >
                      <Play size={32} fill="currentColor" />
                    </a>
                  </div>
                </div>
                <div className="px-2">
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight group-hover:text-emerald-700 transition-colors uppercase">{vid.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
