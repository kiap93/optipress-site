import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Maximize2, Zap, Shield, Moon, Sun, Menu, X, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";

export function Logo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" className={cn("transition-transform", className)}>
      <rect x="8" y="10" width="8" height="20" fill="currentColor" className="text-[#111] dark:text-white" />
      <rect x="18" y="14" width="6" height="12" fill="currentColor" className="text-[#555] dark:text-zinc-400" />
      <rect x="26" y="17" width="4" height="6" fill="currentColor" className="text-[#999] dark:text-zinc-600" />
    </svg>
  );
}

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();
  const [isDark, setIsDark] = React.useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved) return saved === "dark";
    }
    return false;
  });

  React.useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const navLinks = [
    { name: "Images", path: "/compress-image" },
    { name: "PDF Tools", path: "/pdf-tools" },
    { name: "Converters", path: "/jpg-to-pdf" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-editorial-border bg-white/80 backdrop-blur-md transition-colors duration-300 dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-[60px] max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 group">
            <Logo className="group-hover:scale-105" />
            <span className="serif text-xl font-bold italic tracking-tight text-editorial-black dark:text-white transition-transform group-hover:-rotate-2">OptiPress.</span>
          </Link>
          <div className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <Link 
                key={link.path}
                to={link.path} 
                className={cn(
                  "text-[10px] font-bold uppercase tracking-widest transition-colors",
                  location.pathname.startsWith(link.path)
                    ? "text-editorial-black dark:text-white"
                    : "text-zinc-500 hover:text-editorial-black dark:text-zinc-400 dark:hover:text-white"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsDark(!isDark)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-editorial-border bg-white hover:bg-gray-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800 transition-all"
          >
            {isDark ? <Sun className="h-4 w-4 text-orange-500" /> : <Moon className="h-4 w-4 text-zinc-600" />}
          </button>
          
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-8 w-8 items-center justify-center md:hidden text-editorial-black dark:text-white"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-b border-editorial-border bg-white dark:border-zinc-800 dark:bg-zinc-950 md:hidden overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between group py-2"
                >
                  <span className={cn(
                    "text-xs font-black uppercase tracking-[0.2em]",
                    location.pathname.startsWith(link.path)
                      ? "text-editorial-black dark:text-white"
                      : "text-zinc-400 group-hover:text-editorial-black dark:group-hover:text-white"
                  )}>
                    {link.name}
                  </span>
                  <ChevronRight className="h-4 w-4 text-zinc-300 group-hover:text-editorial-black dark:group-hover:text-white transition-all transform group-hover:translate-x-1" />
                </Link>
              ))}
              <div className="mt-4 border-t border-zinc-100 pt-6 dark:border-zinc-800">
                <Link 
                  to="/pricing" 
                  onClick={() => setIsOpen(false)}
                  className="block text-[10px] font-black uppercase tracking-widest text-zinc-500"
                >
                  Upgrade to Pro
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="w-full border-t border-editorial-border bg-white py-12 transition-colors duration-300 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="flex flex-col gap-4 max-w-xs">
            <Link to="/" className="flex items-center gap-2 group">
              <Logo className="w-8 h-8 group-hover:rotate-6 transition-transform" />
              <span className="serif text-xl font-bold italic tracking-tight text-editorial-black dark:text-white">OptiPress.</span>
            </Link>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed uppercase tracking-wider">
              Premium browser-based optimization suite for editorial teams and high-fidelity output.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-12 md:grid-cols-4 flex-grow">
            <div>
              <h4 className="mb-6 text-[10px] font-black uppercase tracking-[0.2em] text-editorial-black dark:text-white">PDF Tools</h4>
              <ul className="flex flex-col gap-3">
                <li><Link to="/pdf-tools" className="text-[10px] uppercase tracking-widest text-zinc-400 hover:text-editorial-black dark:hover:text-white transition-colors">All PDF Tools</Link></li>
                <li><Link to="/merge-pdf" className="text-[10px] uppercase tracking-widest text-zinc-400 hover:text-editorial-black dark:hover:text-white transition-colors">Merge PDF</Link></li>
                <li><Link to="/split-pdf" className="text-[10px] uppercase tracking-widest text-zinc-400 hover:text-editorial-black dark:hover:text-white transition-colors">Split PDF</Link></li>
                <li><Link to="/compress-pdf" className="text-[10px] uppercase tracking-widest text-zinc-400 hover:text-editorial-black dark:hover:text-white transition-colors">Compression</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-6 text-[10px] font-black uppercase tracking-[0.2em] text-editorial-black dark:text-white">Image Tools</h4>
              <ul className="flex flex-col gap-3">
                <li><Link to="/compress-image" className="text-[10px] uppercase tracking-widest text-zinc-400 hover:text-editorial-black dark:hover:text-white transition-colors">Compression</Link></li>
                <li><Link to="/png-to-webp" className="text-[10px] uppercase tracking-widest text-zinc-400 hover:text-editorial-black dark:hover:text-white transition-colors">PNG to WebP</Link></li>
                <li><Link to="/jpg-to-png" className="text-[10px] uppercase tracking-widest text-zinc-400 hover:text-editorial-black dark:hover:text-white transition-colors">JPG to PNG</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-6 text-[10px] font-black uppercase tracking-[0.2em] text-editorial-black dark:text-white">Converters</h4>
              <ul className="flex flex-col gap-3">
                <li><Link to="/jpg-to-pdf" className="text-[10px] uppercase tracking-widest text-zinc-400 hover:text-editorial-black dark:hover:text-white transition-colors">JPG to PDF</Link></li>
                <li><Link to="/pdf-to-word" className="text-[10px] uppercase tracking-widest text-zinc-400 hover:text-editorial-black dark:hover:text-white transition-colors">PDF to Word</Link></li>
                <li><Link to="/pdf-to-excel" className="text-[10px] uppercase tracking-widest text-zinc-400 hover:text-editorial-black dark:hover:text-white transition-colors">PDF to Excel</Link></li>
                <li><Link to="/html-to-pdf" className="text-[10px] uppercase tracking-widest text-zinc-400 hover:text-editorial-black dark:hover:text-white transition-colors">HTML to PDF</Link></li>
              </ul>
            </div>
            <div className="hidden md:block">
              <h4 className="mb-6 text-[10px] font-black uppercase tracking-[0.2em] text-editorial-black dark:text-white">Product</h4>
              <ul className="flex flex-col gap-3">
                <li><Link to="/pricing" className="text-[10px] uppercase tracking-widest text-zinc-400 hover:text-editorial-black dark:hover:text-white transition-colors">Pricing</Link></li>
                <li><span className="text-[10px] uppercase tracking-widest text-zinc-400 italic">API Access</span></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-6 md:flex-row border-t border-editorial-border pt-8 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <span className="rounded bg-editorial-black px-2 py-0.5 text-[10px] font-bold text-white dark:bg-white dark:text-editorial-black uppercase">Privacy First</span>
            <span className="text-[10px] tracking-tighter text-zinc-500 uppercase dark:text-zinc-400">Your data remains on your device. 0 bytes transferred.</span>
          </div>
          
          <div className="text-[10px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
            © {new Date().getFullYear()} OptiPress – optipress.ai
          </div>

          <div className="flex gap-4">
            <div className="flex h-8 w-32 items-center justify-center border border-dashed border-editorial-ad-border bg-editorial-ad-bg text-[10px] uppercase tracking-widest text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900/50">
              Footer Ad
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
