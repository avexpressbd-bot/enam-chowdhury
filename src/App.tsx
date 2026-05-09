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
    }, 10000); // 10 seconds timeout
    return () => clearTimeout(timer);
  }, []);

  if (authLoading || settingsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-6 p-8 text-center max-w-sm">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-red-100 border-t-red-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-red-50 rounded-full"></div>
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-bold text-slate-800">লোড করা হচ্ছে...</h1>
            <p className="text-slate-500 text-sm">অনুগ্রহ করে কিছুক্ষণ অপেক্ষা করুন। এটি প্রথমবার লোড হতে একটু সময় নিতে পারে।</p>
          </div>
          
          {showTimeout && (
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm">
              <p className="font-bold mb-2">বেশি সময় লাগছে?</p>
              <p className="mb-4">আপনার ইন্টারনেট কানেকশন চেক করুন বা পেজটি রিফ্রেশ করুন।</p>
              <button 
                onClick={() => window.location.reload()}
                className="bg-amber-600 text-white px-4 py-2 rounded-lg font-bold text-xs"
              >
                আবার চেষ্টা করুন
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
      <div className="min-h-screen flex flex-col">
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

export default function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <AppContent />
      </SettingsProvider>
    </AuthProvider>
  );
}
