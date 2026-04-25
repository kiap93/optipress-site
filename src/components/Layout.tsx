import React from "react";
import { Link } from "react-router-dom";
import { Maximize2, Zap, Shield, Moon, Sun } from "lucide-react";
import { cn } from "../lib/utils";

export function Navbar() {
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

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-editorial-border bg-white transition-colors duration-300 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex h-[50px] max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-1">
            <span className="serif text-xl font-bold italic tracking-tight text-editorial-black dark:text-white">OptiPress.</span>
          </Link>
          <div className="hidden items-center gap-6 md:flex">
            <Link to="/compress-image" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-editorial-black dark:text-zinc-400 dark:hover:text-white transition-colors">Images</Link>
            <Link to="/compress-pdf" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-editorial-black dark:text-zinc-400 dark:hover:text-white transition-colors">PDF Tools</Link>
            <Link to="/jpg-to-pdf" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-editorial-black dark:text-zinc-400 dark:hover:text-white transition-colors">Converters</Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 md:flex">
            {/* <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 border border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-800 dark:text-emerald-400">PRO Upgrade</span> */}
          </div>
          <button 
            onClick={() => setIsDark(!isDark)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-editorial-border bg-white hover:bg-gray-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800 transition-all"
          >
            {isDark ? <Sun className="h-4 w-4 text-orange-500" /> : <Moon className="h-4 w-4 text-zinc-600" />}
          </button>
        </div>
      </div>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="w-full border-t border-editorial-border bg-white py-8 transition-colors duration-300 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8 grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <h4 className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-editorial-black dark:text-white">Compression</h4>
            <ul className="flex flex-col gap-2">
              <li><Link to="/compress-image" className="text-[10px] uppercase tracking-widest text-zinc-400 hover:text-editorial-black dark:hover:text-white transition-colors">Image Compression</Link></li>
              <li><Link to="/compress-pdf" className="text-[10px] uppercase tracking-widest text-zinc-400 hover:text-editorial-black dark:hover:text-white transition-colors">PDF Compression</Link></li>
              <li><Link to="/compress-pdf-to-1mb" className="text-[10px] uppercase tracking-widest text-zinc-400 hover:text-editorial-black dark:hover:text-white transition-colors">PDF to 1MB</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-editorial-black dark:text-white">Converter</h4>
            <ul className="flex flex-col gap-2">
              <li><Link to="/jpg-to-pdf" className="text-[10px] uppercase tracking-widest text-zinc-400 hover:text-editorial-black dark:hover:text-white transition-colors">JPG to PDF</Link></li>
              <li><Link to="/pdf-to-jpg" className="text-[10px] uppercase tracking-widest text-zinc-400 hover:text-editorial-black dark:hover:text-white transition-colors">PDF to JPG</Link></li>
              <li><Link to="/html-to-pdf" className="text-[10px] uppercase tracking-widest text-zinc-400 hover:text-editorial-black dark:hover:text-white transition-colors">HTML to PDF</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-editorial-black dark:text-white">Office Tools</h4>
            <ul className="flex flex-col gap-2">
              <li><Link to="/word-to-pdf" className="text-[10px] uppercase tracking-widest text-zinc-400 hover:text-editorial-black dark:hover:text-white transition-colors">Word to PDF</Link></li>
              <li><Link to="/excel-to-pdf" className="text-[10px] uppercase tracking-widest text-zinc-400 hover:text-editorial-black dark:hover:text-white transition-colors">Excel to PDF</Link></li>
              <li><Link to="/pdf-to-word" className="text-[10px] uppercase tracking-widest text-zinc-400 hover:text-editorial-black dark:hover:text-white transition-colors">PDF to Word</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-editorial-black dark:text-white">Professional</h4>
            <ul className="flex flex-col gap-2">
              <li><Link to="/pricing" className="text-[10px] uppercase tracking-widest text-zinc-400 hover:text-editorial-black dark:hover:text-white transition-colors">Pricing</Link></li>
              <li className="text-[10px] uppercase tracking-widest text-zinc-400 italic">API Integration</li>
            </ul>
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
