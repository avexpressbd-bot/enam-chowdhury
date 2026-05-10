import React from "react";
import { Megaphone } from "lucide-react";
import { useSettings } from "../lib/settings";
import { motion } from "motion/react";

export default function BreakingNews() {
  const { settings } = useSettings();
  const news = settings.breakingNews || [];

  const [isPaused, setIsPaused] = React.useState(false);

  if (news.length === 0) return null;

  return (
    <div 
      className="bg-red-600 text-white overflow-hidden relative border-b border-red-700"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto flex items-center"
      >
        <div className="bg-slate-900 px-4 py-2 flex items-center gap-2 font-black text-xs uppercase tracking-widest z-10 relative shadow-[10px_0_15px_rgba(0,0,0,0.2)]">
          <Megaphone size={14} className="text-red-500 animate-pulse" />
          <span className="whitespace-nowrap">ব্রেকিং নিউজ</span>
        </div>
        
        <div className="flex-1 relative h-10 flex items-center overflow-hidden">
          <motion.div 
            className="flex items-center gap-12 whitespace-nowrap absolute left-0"
            initial={{ x: "0%" }}
            animate={isPaused ? {} : {
              x: ["0%", "-100%"]
            }}
            transition={{
              duration: 120, // Slightly faster, still readable
              repeat: Infinity,
              ease: "linear"
            }}
          >
            {news.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <span className="text-sm font-bold text-slate-100">{item}</span>
                <span className="w-2 h-2 bg-white/30 rounded-full"></span>
              </div>
            ))}
            {/* Duplicate for seamless loop */}
            {news.map((item, idx) => (
              <div key={`dup-${idx}`} className="flex items-center gap-4">
                <span className="text-sm font-bold text-slate-100">{item}</span>
                <span className="w-2 h-2 bg-white/30 rounded-full"></span>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
