import { motion } from "motion/react";

interface BannerProps {
  image: string;
  title: string;
  subtitle?: string;
  slogan?: string;
}

export default function Banner({ image, title, subtitle, slogan }: BannerProps) {
  return (
    <div id="banner" className="relative h-[65vh] md:h-[80vh] w-full overflow-hidden flex items-center justify-center bg-slate-100">
      {/* Background with overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${image})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover'
        }}
      >
        <div className="absolute inset-0 bg-white/60"></div>
        <div className="absolute inset-0 bg-linear-to-r from-white via-white/40 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-slate-900 w-full">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-2xl"
        >
          {subtitle && (
            <span className="inline-block px-3 py-1 bg-red-600 text-white text-[10px] font-bold uppercase tracking-[0.2em] mb-6 rounded-full">
              {subtitle}
            </span>
          )}
          <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.1] mb-6 tracking-tight">
            {title.includes("(এনাম)") ? (
              <>
                {title.split("(এনাম)")[0]}
                <span className="text-emerald-700 font-black tracking-tight">(এনাম)</span>
                {title.split("(এনাম)")[1]}
              </>
            ) : title}
          </h1>
          {slogan && (
            <div className="bg-white/50 backdrop-blur-sm border-l-4 border-red-600 pl-6 py-4 rounded-r-2xl max-w-lg mb-8">
              <p className="text-lg md:text-xl font-bold text-slate-900 leading-relaxed italic">
                "{slogan}"
              </p>
            </div>
          )}
          <div className="flex flex-wrap gap-4">
             <button className="bg-emerald-700 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-emerald-800 transition-all shadow-xl shadow-emerald-100">
                ভিডিও বার্তা দেখুন
             </button>
             <button className="bg-red-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-red-700 transition-all shadow-xl shadow-red-100">
                আমাদের পরিকল্পনা
             </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
