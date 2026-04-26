import React from "react";
import { useLocation } from "react-router-dom";
import { 
  Navbar, 
  Footer,
  Logo 
} from "../components/Layout";
import { 
  ImageUploader, 
  ImageCard, 
  AdPlaceholder 
} from "../components/ToolComponents";
import { SEOSection } from "../components/SEOContent";
import { SEO_PAGES, BASE_URL } from "../seo-config";
import { compressImage, downloadFile } from "../lib/compress";
import { motion, AnimatePresence } from "motion/react";
import { Download, Sliders, Zap, Shield, Info, ArrowRight } from "lucide-react";
import { Helmet } from "react-helmet-async";
import JSZip from "jszip";

export default function ToolPage() {
  const location = useLocation();
  const pathKey = location.pathname.split("/").filter(Boolean)[0] || "default";
  const seoContent = SEO_PAGES[pathKey] || SEO_PAGES["default"];

  // Detect initial target format from path
  const initialTargetType = React.useMemo(() => {
    if (pathKey === "png-to-webp") return "image/webp";
    if (pathKey === "jpg-to-png") return "image/png";
    return "original";
  }, [pathKey]);

  const [files, setFiles] = React.useState<Array<{ 
    id: string; 
    file: File; 
    compressed: Blob | null; 
    size: number | null; 
    processing: boolean;
    targetType: string;
  }>>([]);
  const [quality, setQuality] = React.useState(0.8);
  const [globalTargetType, setGlobalTargetType] = React.useState<string>(initialTargetType);
  const deferredQuality = React.useDeferredValue(quality);
  const deferredGlobalTargetType = React.useDeferredValue(globalTargetType);
  const [stats, setStats] = React.useState({ totalOriginal: 0, totalCompressed: 0 });
  const taskVersionRef = React.useRef<Record<string, number>>({});

  // Track Page view
  React.useEffect(() => {
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: "page_view", page: location.pathname, timestamp: Date.now() })
    }).catch(() => {});
  }, [location.pathname]);

  const handleFilesSelected = (newFiles: File[]) => {
    const freshFiles = newFiles.map(f => {
      const id = Math.random().toString(36).substr(2, 9);
      taskVersionRef.current[id] = 0;
      return {
        id,
        file: f,
        compressed: null,
        size: null,
        processing: false,
        targetType: globalTargetType
      };
    });
    setFiles(prev => [...prev, ...freshFiles]);
  };

  const processImage = async (id: string, file: File, currentQuality: number, currentTarget: string) => {
    const version = (taskVersionRef.current[id] || 0) + 1;
    taskVersionRef.current[id] = version;

    setFiles(prev => prev.map(f => f.id === id ? { ...f, processing: true } : f));
    try {
      const isTargetSizePath = pathKey === "compress-image-to-100kb";
      const maxSizeMB = isTargetSizePath 
        ? (currentQuality * 0.2) // Range: 0.02MB to 0.2MB
        : (file.size / (1024 * 1024)) * Math.max(0.1, currentQuality);

      const resolvedTarget = currentTarget === "original" ? file.type : currentTarget;

      const compressed = await compressImage(file, { 
        initialQuality: currentQuality,
        maxSizeMB: maxSizeMB > 0 ? maxSizeMB : 0.1,
        fileType: resolvedTarget 
      });
      
      if (taskVersionRef.current[id] === version) {
        setFiles(prev => prev.map(f => f.id === id ? { 
          ...f, 
          compressed, 
          size: compressed.size, 
          processing: false 
        } : f));
        
        fetch("/api/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ event: "compress", page: location.pathname, timestamp: Date.now() })
        }).catch(() => {});
      }
    } catch (e) {
      if (taskVersionRef.current[id] === version) {
        setFiles(prev => prev.map(f => f.id === id ? { ...f, processing: false } : f));
      }
    }
  };

  // Initial process for newly added files
  React.useEffect(() => {
    files.forEach(f => {
      if (!f.compressed && !f.processing) {
        processImage(f.id, f.file, deferredQuality, f.targetType);
      }
    });
  }, [files.length]);

  // Re-process all files ONLY when quality or global target type changes (DEFERRED)
  React.useEffect(() => {
    if (files.length === 0) return;
    
    // Update all files to follow global target if changed
    setFiles(prev => prev.map(f => ({ ...f, targetType: deferredGlobalTargetType })));
    
    files.forEach(f => {
      processImage(f.id, f.file, deferredQuality, deferredGlobalTargetType);
    });
  }, [deferredQuality, deferredGlobalTargetType]);

  // Initial process when files added OR stats update
  React.useEffect(() => {
    const orig = files.reduce((acc, f) => acc + f.file.size, 0);
    const comp = files.reduce((acc, f) => acc + (f.size || 0), 0);
    setStats({ totalOriginal: orig, totalCompressed: comp });
  }, [files]);

  const getDownloadName = (originalName: string, blob: Blob | null) => {
    if (!blob) return originalName;
    const extension = blob.type.split("/")[1] || "jpg";
    const baseName = originalName.substring(0, originalName.lastIndexOf(".")) || originalName;
    return `optipress_${baseName}.${extension}`;
  };

  const handleDownloadAll = async () => {
    if (files.length === 1 && files[0].compressed) {
      downloadFile(files[0].compressed, getDownloadName(files[0].file.name, files[0].compressed));
      return;
    }

    const zip = new JSZip();
    files.forEach(f => {
      if (f.compressed) {
        zip.file(getDownloadName(f.file.name, f.compressed), f.compressed);
      }
    });
    const content = await zip.generateAsync({ type: "blob" });
    downloadFile(content, "optipress_batch_bundle.zip");
  };

  // Structured Data (JSON-LD)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "OptiPress",
    "url": BASE_URL,
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Web",
    "description": "Smart, private image compression tool that processes everything in your browser.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <div className="min-h-screen bg-editorial-bg dark:bg-zinc-950 transition-colors duration-300">
      <Helmet>
        <title>{seoContent.metaTitle}</title>
        <meta name="description" content={seoContent.metaDesc} />
        <link rel="canonical" href={seoContent.canonical} />
        
        {/* Open Graph */}
        <meta property="og:title" content={seoContent.metaTitle} />
        <meta property="og:description" content={seoContent.metaDesc} />
        <meta property="og:url" content={seoContent.canonical} />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoContent.metaTitle} />
        <meta name="twitter:description" content={seoContent.metaDesc} />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <Navbar />
      
      <main className="mx-auto max-w-7xl px-6 py-6 transition-all duration-300">
        {/* Layout for Top Ad */}
        <AdPlaceholder position="top" />

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Left Column: Tool */}
          <div className="lg:w-3/4 flex flex-col gap-6">
            <div className="control-card bg-white border border-editorial-border p-6 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div className="flex-grow">
                   <div className="flex items-center gap-3 mb-2">
                     <Logo className="w-12 h-12 hidden md:block" />
                     <h1 className="serif text-4xl font-bold tracking-tight text-editorial-black dark:text-white sm:text-5xl">
                       {seoContent.title.includes("OptiPress") ? "Editorial Image Optimization" : seoContent.title}
                     </h1>
                   </div>
                   <p className="text-xs text-zinc-500 uppercase tracking-wide max-w-lg">
                      High-fidelity client-side compression. No uploads. 100% private processing in your local browser cache.
                   </p>
                </div>
                <div className="flex flex-wrap items-end gap-6 shrink-0">
                  <div className="flex flex-col gap-2 shrink-0">
                    <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest">Quality</label>
                    <input 
                      type="range" min="0.1" max="1.0" step="0.1" 
                      value={quality}
                      onChange={(e) => setQuality(parseFloat(e.target.value))}
                      className="w-32 cursor-pointer accent-black dark:accent-white"
                    />
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest">Global Format</label>
                    <select 
                      value={globalTargetType}
                      onChange={(e) => setGlobalTargetType(e.target.value)}
                      className="bg-white border border-editorial-border py-1.5 px-3 text-[10px] font-bold uppercase tracking-widest text-editorial-black dark:bg-zinc-800 dark:border-zinc-700 dark:text-white outline-none cursor-pointer"
                    >
                      <option value="original">Original</option>
                      <option value="image/webp">WebP</option>
                      <option value="image/png">PNG</option>
                      <option value="image/jpeg">JPG</option>
                    </select>
                  </div>
                </div>
              </div>

              {files.length === 0 ? (
                <ImageUploader onFilesSelected={handleFilesSelected} className="h-[400px]" />
              ) : (
                <div className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <AnimatePresence mode="popLayout">
                      {files.map(f => (
                        <ImageCard 
                          key={f.id}
                          originalFile={f.file}
                          compressedFile={f.compressed}
                          compressedSize={f.size}
                          isProcessing={f.processing}
                          targetType={f.targetType}
                          onTargetTypeChange={(newType) => {
                            setFiles(prev => prev.map(item => item.id === f.id ? { ...item, targetType: newType } : item));
                            processImage(f.id, f.file, quality, newType);
                          }}
                          onRemove={() => setFiles(prev => prev.filter(x => x.id !== f.id))}
                          onDownload={() => f.compressed && downloadFile(f.compressed, getDownloadName(f.file.name, f.compressed))}
                        />
                      ))}
                    </AnimatePresence>
                    <button 
                      onClick={() => {
                        const input = document.createElement("input");
                        input.type = "file";
                        input.multiple = true;
                        input.accept = "image/*";
                        input.onchange = (e) => {
                          const newFiles = Array.from((e.target as HTMLInputElement).files || []);
                          if (newFiles.length) handleFilesSelected(newFiles);
                        };
                        input.click();
                      }}
                      className="flex aspect-[3/2] items-center justify-center border-2 border-dashed border-editorial-border hover:border-editorial-black dark:border-zinc-800 dark:hover:border-zinc-400 transition-colors"
                    >
                      <div className="text-center">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Add More Assets</span>
                      </div>
                    </button>
                  </div>
                  
                  <div className="flex justify-end gap-3 border-t border-editorial-border pt-6 dark:border-zinc-800">
                    <button 
                      onClick={() => setFiles([])}
                      className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-red-600 px-4"
                    >
                      Reset Gallery
                    </button>
                    <button 
                      onClick={handleDownloadAll}
                      className="bg-black text-white px-8 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 transition-all active:scale-95"
                    >
                      Download Bundle
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-6 px-2">
               <div className="flex gap-12">
                 <div className="flex flex-col">
                   <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-1">Processing Delay</span>
                   <span className="serif text-xl font-bold dark:text-white">0.4s</span>
                 </div>
                 <div className="flex flex-col">
                   <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-1">Local Identity</span>
                   <span className="serif text-xl font-bold text-emerald-700 dark:text-emerald-400 italic">Active</span>
                 </div>
               </div>
               <div className="flex-grow flex h-12 items-center justify-center bg-editorial-ad-bg border border-dashed border-editorial-ad-border text-[9px] uppercase tracking-widest text-zinc-400 dark:bg-zinc-900/50 dark:border-zinc-800">
                  In-Content Sponsor Slot
               </div>
            </div>

            <SEOSection content={seoContent} />
          </div>

          {/* Right Column: Sidebar */}
          <aside className="lg:w-1/4 flex flex-col gap-6">
            <div className="border-b border-editorial-border pb-6 dark:border-zinc-800">
              <h2 className="serif text-xl font-bold leading-tight mb-3 dark:text-white">Image Intelligence</h2>
              <p className="text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                OptiPress leverages browser-native WASM modules to achieve parity with desktop-class tools. By shifting weight away from the server, we ensure your visual assets remain private and your throughput stays high.
              </p>
            </div>

            <div className="border-b border-editorial-border pb-6 dark:border-zinc-800">
              <h2 className="text-[10px] font-bold uppercase tracking-widest mb-4 text-zinc-400">Technical Specs</h2>
              <div className="flex flex-col gap-4 text-[11px]">
                <div className="flex justify-between">
                  <span className="font-bold dark:text-white">WASM Threads</span>
                  <span className="text-zinc-500">Multi</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold dark:text-white">Max Buffer</span>
                  <span className="text-zinc-500">Auto</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold dark:text-white">Precision</span>
                  <span className="text-zinc-500 text-emerald-600 font-bold italic">Lossless-v2</span>
                </div>
              </div>
            </div>

            <div className="flex-grow min-h-[300px] border border-dashed border-editorial-ad-border bg-editorial-ad-bg flex items-center justify-center dark:bg-zinc-900/50 dark:border-zinc-800">
               <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 vertical-text origin-center rotate-90 shrink-0">TALL BANNER AD SLOT</span>
            </div>
          </aside>
        </div>

        <AdPlaceholder position="bottom" />
      </main>

      <Footer />
    </div>
  );
}
