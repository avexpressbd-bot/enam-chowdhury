import React, { createContext, useContext, useEffect, useState } from "react";
import { doc, onSnapshot, setDoc, getDoc } from "firebase/firestore";
import { db, handleFirestoreError, OperationType, isFirebaseConfigured } from "./firebase";

export interface SiteSettings {
  siteName: string;
  slogan: string;
  bannerImage: string;
  aboutText: string;
  aboutImage: string;
  phone: string;
  email: string;
  address: string;
  facebookUrl: string;
  breakingNews: string[];
  manifesto: {
    title: string;
    description: string;
    icon: string;
  }[];
  updates: {
    title: string;
    description: string;
    image: string;
    videoUrl?: string;
  }[];
  videos: {
    title: string;
    url: string;
    thumbnail: string;
  }[];
}

const defaultSettings: SiteSettings = {
  siteName: "ইয়াজদানী চৌধুরী (এনাম)",
  slogan: "শান্ত, উন্নত ও মাদকমুক্ত মডেল বিষ্ণুপুর গড়ার অঙ্গীকার।",
  bannerImage: "https://images.unsplash.com/photo-1577416416829-d4368c6b91f1?q=80&w=2000",
  aboutText: "বিষ্ণুপুরের ঐতিহ্যবাহী পরিবারে জন্ম। ছাত্রজীবন থেকেই অন্যায়ের বিরুদ্ধে সোচ্চার। ওনার রাজনৈতিক জীবন উৎসর্গ করা হয়েছে সাধারণ মানুষের সেবায়।",
  aboutImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800",
  phone: "+৮৮০ ১৭১২-৩৪৫৬৭৮",
  email: "enam.bishnupur@gmail.com",
  address: "বিষ্ণুপুর ইউনিয়ন কার্যালয়, চাঁদপুর",
  facebookUrl: "#",
  breakingNews: [
    "বিষ্ণুপুর ইউনিয়নের উন্নয়নে এনাম ভাইয়ের নতুন উদ্যোগ।",
    "আগামীকাল বিকাল ৪টায় ৩নং ওয়ার্ডে বিশেষ পথসভা অনুষ্ঠিত হবে।",
    "তরুণ সমাজের উন্নয়নে পাঠাগার নির্মাণের কাজ শুরু হলো।"
  ],
  manifesto: [
    { title: "মাদকমুক্ত বিষ্ণুপুর", description: "তরুণদের খেলাধুলার সুযোগ এবং মাদকের বিরুদ্ধে জিরো টলারেন্স নীতি।", icon: "Zap" },
    { title: "আধুনিক যাতায়াত", description: "ইউনিয়নের প্রতিটি রাস্তা মেরামত ও নতুন রাস্তা নির্মাণ।", icon: "Map" },
    { title: "সামাজিক সুরক্ষা", description: "সঠিক ব্যক্তির কাছে ফ্যামিলি কার্ড, টিসিবি কার্ড এবং কৃষক কার্ড পৌঁছে দেওয়া।", icon: "HeartHandshake" },
    { title: "শিক্ষা ও স্বাস্থ্য", description: "স্কুল-মাদ্রাসার উন্নয়ন এবং ইউনিয়ন স্বাস্থ্য কেন্দ্রের মান বৃদ্ধি।", icon: "BookOpen" }
  ],
  updates: [
    { title: "বড় নির্বাচনী জনসভা", description: "বিষ্ণুপুর হাই স্কুল মাঠে আয়োজিত নির্বাচনী জনসভায় এনাম ভাইয়ের বক্তব্য।", image: "https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?q=80&w=800" },
    { title: "গণসংযোগ ও উঠান বৈঠক", description: "বিষ্ণুপুর ৩নং ওয়ার্ডের সাধারণ মানুষের সাথে মতবিনিময় সভা।", image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800" },
    { title: "তারুণ্যের কথা", description: "ইউনিয়নের তরুণ প্রজন্মের সাথে সমৃদ্ধ বিষ্ণুপুর বিনির্মাণে আলোচনা।", image: "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?q=80&w=800" }
  ],
  videos: [
    { title: "বিষ্ণুপুরের উন্নয়নের রোডম্যাপ", url: "#", thumbnail: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=800" },
    { title: "সাধারণ মানুষের অধিকার নিয়ে বক্তব্য", url: "#", thumbnail: "https://images.unsplash.com/photo-1577563906417-45bc460599a7?q=80&w=800" }
  ]
};

interface SettingsContextType {
  settings: SiteSettings;
  updateSettings: (newSettings: SiteSettings) => Promise<void>;
  loading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured || !db) {
      console.warn("Firebase Firestore not initialized correctly");
      setLoading(false);
      return;
    }

    try {
      const docRef = doc(db, "settings", "global");
      
      const unsubscribe = onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
          setSettings(doc.data() as SiteSettings);
        }
        setLoading(false);
      }, (error) => {
        console.error("Settings load failed:", error);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error("Failed to setup settings snapshot:", error);
      setLoading(false);
    }
  }, []);

  const updateSettings = async (newSettings: SiteSettings) => {
    const docRef = doc(db, "settings", "global");
    try {
      await setDoc(docRef, newSettings);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "settings/global");
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
