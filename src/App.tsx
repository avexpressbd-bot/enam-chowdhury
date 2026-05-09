/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
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

  if (authLoading || settingsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-red-600/20 border-t-red-600 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-bold animate-pulse font-bn">লোডিং হচ্ছে...</p>
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
