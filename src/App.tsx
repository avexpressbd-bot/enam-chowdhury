/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Manifesto from "./pages/Manifesto";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import BreakingNews from "./components/BreakingNews";
import { AuthProvider, useAuth } from "./lib/auth";
import { SettingsProvider, useSettings } from "./lib/settings";
import { isFirebaseConfigured } from "./lib/firebase";
import { AlertCircle } from "lucide-react";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AppContent() {
  const { loading: authLoading } = useAuth();
  const { loading: settingsLoading } = useSettings();
  const [showTimeout, setShowTimeout] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTimeout(true);
    }, 5000); // 5 seconds timeout for support UI
    return () => clearTimeout(timer);
  }, []);

  if (authLoading || settingsLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-6 p-8 text-center max-w-sm">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-slate-200 border-t-red-600 rounded-full animate-spin"></div>
          </div>
          <div className="space-y-4">
            <div className="space-y-1">
              <h1 className="text-xl font-black text-slate-900 tracking-tight">লোড হচ্ছে...</h1>
              <p className="text-slate-500 text-sm font-medium">অনুগ্রহ করে অপেক্ষা করুন।</p>
            </div>
            
            <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm text-center">
              <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-2">সিস্টেম স্ট্যাটাস</p>
              <div className="flex justify-center gap-4 text-xs font-bold font-mono">
                <span className={authLoading ? "text-amber-500 animate-pulse" : "text-emerald-600"}>
                  {authLoading ? "AUTH..." : "AUTH OK"}
                </span>
                <span className={settingsLoading ? "text-amber-500 animate-pulse" : "text-emerald-600"}>
                  {settingsLoading ? "DATA..." : "DATA OK"}
                </span>
              </div>
            </div>
          </div>
          
          {showTimeout && (
            <div className="mt-4 p-6 bg-slate-900 border border-slate-800 rounded-2xl text-slate-300 text-sm text-left shadow-2xl">
              <div className="flex gap-2 items-start mb-4">
                <AlertCircle className="shrink-0 text-red-500" size={20} />
                <p className="font-bold text-white text-base">বেশি সময় লাগছে!</p>
              </div>
              
              <div className="space-y-4 opacity-90">
                <p className="text-xs leading-relaxed">সাইটটি লোড হেতে স্বাভাবিকের চেয়ে বেশি সময় নিচ্ছে। আপনার ইন্টারনেট কানেকশন চেক করুন।</p>
              </div>

              <button 
                onClick={() => window.location.href = window.location.origin}
                className="w-full mt-6 bg-red-600 text-white px-4 py-3 rounded-xl font-bold text-xs hover:bg-red-700 transition-all flex items-center justify-center gap-2"
              >
                আবার লোড করুন
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <Router>
      <ScrollToTop />
      {!isFirebaseConfigured && (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-red-600 text-white text-[10px] sm:text-xs py-1 px-4 flex items-center justify-center gap-2 font-bold animate-pulse">
          <AlertCircle size={14} /> 
          Firebase not configured. Deployment on Vercel/GitHub requires environment variables.
        </div>
      )}
      <div className="min-h-screen flex flex-col pt-10">
        <div className="fixed top-0 left-0 right-0 z-[60]">
          <BreakingNews />
        </div>
        <Navbar />
        <main className="flex-grow pt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/manifesto" element={<Manifesto />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-white p-8">
          <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-2xl border border-red-100 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-8">
              <AlertCircle size={48} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">রানিং এরর</h1>
            <p className="text-slate-500 mb-10 leading-relaxed font-medium">অ্যাপটি লোড করার সময় একটি ত্রুটি হয়েছে। নিচে বিস্তারিত দেওয়া হলো:</p>
            <div className="w-full bg-slate-900 text-red-400 p-6 rounded-2xl overflow-auto text-xs font-mono mb-10 max-h-48 text-left border border-slate-800 shadow-inner">
              {this.state.error?.stack || this.state.error?.message || "Unknown error occurred"}
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="w-full bg-red-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-slate-900 hover:scale-95 active:scale-90 transition-all shadow-xl shadow-red-100"
            >
              পেজটি রিফ্রেশ করুন
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <SettingsProvider>
          <AppContent />
        </SettingsProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
