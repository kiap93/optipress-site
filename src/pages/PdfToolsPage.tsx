import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Footer } from "../components/Layout";
import { SEOTags } from "../components/SEOTags";
import { motion } from "motion/react";
import { 
  Repeat, 
  Layers, 
  Zap, 
  Shield, 
  ArrowRight,
  FileText,
  MousePointerClick
} from "lucide-react";
import { SEO_PAGES, BASE_URL } from "../seo-config";
import { SEOSection } from "../components/SEOContent";

const PDF_TOOLS = [
  {
    title: "Merge PDF",
    desc: "Combine multiple PDF files into one easily.",
    path: "/merge-pdf",
    icon: Repeat,
    color: "text-blue-500",
    bg: "bg-blue-50 dark:bg-blue-900/20"
  },
  {
    title: "Split PDF",
    desc: "Extract individual pages from any PDF.",
    path: "/split-pdf",
    icon: Layers,
    color: "text-purple-500",
    bg: "bg-purple-50 dark:bg-purple-900/20"
  },
  {
    title: "PDF Compression",
    desc: "Reduce file size while keeping high quality.",
    path: "/compress-pdf",
    icon: Zap,
    color: "text-amber-500",
    bg: "bg-amber-50 dark:bg-amber-900/20"
  }
];

export default function PdfToolsPage() {
  const seoContent = SEO_PAGES["pdf-tools"];

  return (
    <div className="min-h-screen bg-editorial-bg dark:bg-zinc-950 transition-colors duration-300">
      <SEOTags 
        title={seoContent.metaTitle}
        description={seoContent.metaDesc}
        canonical={seoContent.canonical}
      />

      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-16 max-w-2xl">
          <div className="mb-6 flex items-center gap-3">
            <span className="h-px w-12 bg-editorial-border dark:bg-zinc-800"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Toolkit v2.0</span>
          </div>
          <h1 className="serif mb-6 text-5xl font-bold italic tracking-tight text-editorial-black dark:text-white md:text-7xl">
            Professional PDF <br />Manipulation.
          </h1>
          <p className="text-lg font-medium text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Fast, secure, and entirely client-side. Your documents never touch our servers, 
            guaranteeing 100% privacy for sensitive editorial content.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {PDF_TOOLS.map((tool, idx) => (
            <motion.div
              key={tool.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link 
                to={tool.path}
                className="group block h-full border border-editorial-border bg-white p-8 transition-all hover:-translate-y-1 hover:border-editorial-black dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-white shadow-sm"
              >
                <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-xl ${tool.bg}`}>
                  <tool.icon className={`h-7 w-7 ${tool.color}`} />
                </div>
                <h3 className="serif mb-3 text-2xl font-bold text-editorial-black dark:text-white group-hover:italic transition-all">
                  {tool.title}
                </h3>
                <p className="mb-8 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                  {tool.desc}
                </p>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-editorial-black dark:text-white">
                  Launch Tool <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <section className="mt-32 grid gap-12 md:grid-cols-3 border-t border-editorial-border dark:border-zinc-800 pt-16">
          <div className="flex flex-col gap-4">
             <Shield className="h-6 w-6 text-emerald-500" />
             <h4 className="serif text-xl font-bold text-editorial-black dark:text-white">Zero Cloud Risk</h4>
             <p className="text-xs uppercase tracking-wider leading-relaxed text-zinc-500">
               Unlike other tools, OptiPress performs every calculation on your local CPU. No document is ever uploaded to a server.
             </p>
          </div>
          <div className="flex flex-col gap-4">
             <Layers className="h-6 w-6 text-blue-500" />
             <h4 className="serif text-xl font-bold text-editorial-black dark:text-white">Batch Pipeline</h4>
             <p className="text-xs uppercase tracking-wider leading-relaxed text-zinc-500">
               Merge dozens of PDF pages or split books in seconds using our multi-threaded WASM execution engine.
             </p>
          </div>
          <div className="flex flex-col gap-4">
             <MousePointerClick className="h-6 w-6 text-purple-500" />
             <h4 className="serif text-xl font-bold text-editorial-black dark:text-white">Intuitive Interface</h4>
             <p className="text-xs uppercase tracking-wider leading-relaxed text-zinc-500">
               Designed for humans. Drag and drop your documents and get results instantly without complex configurations.
             </p>
          </div>
        </section>

        <SEOSection content={seoContent} />
      </main>

      <Footer />
    </div>
  );
}
