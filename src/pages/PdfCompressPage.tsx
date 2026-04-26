import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Navbar, Footer, Logo } from "../components/Layout";
import { FileUploader, AdPlaceholder } from "../components/ToolComponents";
import { SEOSection } from "../components/SEOContent";
import { motion, AnimatePresence } from "motion/react";
import { FileText, Download, Zap, Shield, Loader2, CheckCircle2, ArrowRight, X, Layers } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { compressPdf, PDFCompressionResult } from "../lib/pdfOptimizer";
import { downloadFile } from "../lib/compress";
import { BASE_URL, SEO_PAGES } from "../seo-config";
import JSZip from "jszip";

interface PdfFileState {
  id: string;
  file: File;
  status: 'idle' | 'processing' | 'completed' | 'error';
  progress: number;
  result?: PDFCompressionResult;
  errorMessage?: string;
}

export default function PdfCompressPage() {
  const [files, setFiles] = useState<PdfFileState[]>([]);
  const [isProcessingAll, setIsProcessingAll] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);
  const location = useLocation();

  const handleFilesSelected = (newFiles: File[]) => {
    const pdfs = newFiles.filter(f => f.type === "application/pdf").map(f => ({
      id: Math.random().toString(36).substring(7),
      file: f,
      status: 'idle' as const,
      progress: 0
    }));
    setFiles(prev => [...prev, ...pdfs]);
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const processBatch = async () => {
    if (files.length === 0 || isProcessingAll) return;
    
    setIsProcessingAll(true);
    const idleFiles = files.filter(f => f.status === 'idle');
    
    for (let i = 0; i < idleFiles.length; i++) {
      const current = idleFiles[i];
      
      setFiles(prev => prev.map(f => 
        f.id === current.id ? { ...f, status: 'processing' } : f
      ));

      try {
        const result = await compressPdf(current.file, 0.7, (progress) => {
          setFiles(prev => prev.map(f => 
            f.id === current.id ? { ...f, progress } : f
          ));
        });

        setFiles(prev => prev.map(f => 
          f.id === current.id ? { ...f, status: 'completed', result, progress: 100 } : f
        ));
      } catch (err) {
        setFiles(prev => prev.map(f => 
          f.id === current.id ? { ...f, status: 'error', errorMessage: 'Compression failed' } : f
        ));
      }
      
      setOverallProgress(Math.round(((i + 1) / idleFiles.length) * 100));
    }
    
    setIsProcessingAll(false);
  };

  const downloadAll = async () => {
    const completed = files.filter(f => f.status === 'completed' && f.result);
    if (completed.length === 0) return;

    const zip = new JSZip();
    completed.forEach(f => {
      zip.file(`optipress_${f.file.name}`, f.result!.blob);
    });

    const content = await zip.generateAsync({ type: "blob" });
    downloadFile(content, "optipress_pdf_bundle.zip");
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const path = location.pathname.substring(1);
  const seoContent = SEO_PAGES[path] || SEO_PAGES["compress-pdf"] || SEO_PAGES["default"];

  return (
    <div className="min-h-screen bg-editorial-bg dark:bg-zinc-950 transition-colors duration-300">
      <Helmet>
        <title>{seoContent.metaTitle}</title>
        <meta name="description" content={seoContent.metaDesc} />
        <link rel="canonical" href={seoContent.canonical} />
      </Helmet>

      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-6 transition-all duration-300">
        <div className="mb-12 flex flex-col gap-2 border-b border-editorial-border pb-8 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="bg-editorial-black px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-widest dark:bg-white dark:text-editorial-black">PDF Batch Toolkit</span>
            <span className="h-px w-12 bg-editorial-border dark:bg-zinc-800"></span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Stable v1.1</span>
          </div>
          <div className="flex items-center gap-4">
            <Logo className="w-16 h-16 hidden md:block" />
            <h1 className="serif text-4xl font-bold italic tracking-tight text-editorial-black dark:text-white md:text-6xl">
              Batch PDF Optimization.
            </h1>
          </div>
          <p className="max-w-xl text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Compress dozens of PDFs simultaneously. Our engine handles asset extraction and re-encoding entirely in your browser's RAM.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="flex flex-col gap-6">
            
            <FileUploader 
              onFilesSelected={handleFilesSelected} 
              multiple={true} 
              accept="application/pdf" 
              className={files.length > 0 ? "py-8" : ""}
            />

            <AnimatePresence>
              {files.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="flex flex-col gap-4"
                >
                  <div className="flex items-center justify-between bg-white p-4 border border-editorial-border dark:bg-zinc-900 dark:border-zinc-800">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-zinc-100 flex items-center justify-center dark:bg-zinc-800">
                        <Layers className="h-5 w-5 text-zinc-400" />
                      </div>
                      <div>
                        <h3 className="text-xs font-black uppercase tracking-widest text-editorial-black dark:text-white">
                          Batch Queue ({files.length} Files)
                        </h3>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">
                          {files.filter(f => f.status === 'completed').length} / {files.length} Processed
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                       {files.some(f => f.status === 'idle') && (
                         <button 
                           onClick={processBatch}
                           disabled={isProcessingAll}
                           className="bg-editorial-black px-6 py-2 text-[10px] font-black uppercase tracking-widest text-white hover:bg-zinc-800 disabled:opacity-50 transition-all"
                         >
                           {isProcessingAll ? 'Processing...' : 'Starts Batch'}
                         </button>
                       )}
                       {files.some(f => f.status === 'completed') && (
                         <button 
                           onClick={downloadAll}
                           className="bg-emerald-600 px-6 py-2 text-[10px] font-black uppercase tracking-widest text-white hover:bg-emerald-700 transition-all"
                         >
                           Download All (.zip)
                         </button>
                       )}
                    </div>
                  </div>

                  <div className="grid gap-3">
                    {files.map((fileState) => (
                      <motion.div 
                        key={fileState.id}
                        layout
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="group relative flex items-center justify-between border border-editorial-border bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
                      >
                        <div className="flex items-center gap-4">
                          <FileText className={`h-5 w-5 ${fileState.status === 'completed' ? 'text-emerald-500' : 'text-zinc-300'}`} />
                          <div>
                            <p className="text-xs font-bold text-editorial-black dark:text-white truncate max-w-[200px] md:max-w-md">{fileState.file.name}</p>
                            <div className="flex gap-2 text-[9px] font-bold uppercase tracking-tight text-zinc-400">
                               <span>{formatBytes(fileState.file.size)}</span>
                               {fileState.result && (
                                 <span className="text-emerald-500">&rarr; {formatBytes(fileState.result.compressedSize)} (-{fileState.result.reductionPercentage}%)</span>
                               )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                           {fileState.status === 'processing' && (
                             <div className="flex items-center gap-2">
                               <Loader2 className="h-3 w-3 animate-spin text-zinc-400" />
                               <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{fileState.progress}%</span>
                             </div>
                           )}
                           
                           {fileState.status === 'completed' && (
                             <button 
                               onClick={() => downloadFile(fileState.result!.blob, `optipress_${fileState.file.name}`)}
                               className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                             >
                               <Download className="h-4 w-4 text-emerald-600" />
                             </button>
                           )}

                           <button 
                              onClick={() => removeFile(fileState.id)}
                              disabled={isProcessingAll && fileState.status === 'processing'}
                              className="p-2 text-zinc-300 hover:text-red-500 transition-colors disabled:opacity-0"
                           >
                              <X className="h-4 w-4" />
                           </button>
                        </div>

                        {fileState.status === 'processing' && (
                          <div className="absolute bottom-0 left-0 h-0.5 bg-editorial-black dark:bg-white transition-all duration-300" style={{ width: `${fileState.progress}%` }} />
                        )}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="border border-editorial-border bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                <Shield className="mb-4 h-6 w-6 text-zinc-400" />
                <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-editorial-black dark:text-white">100% Private</h3>
                <p className="text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400">PDFs are processed locally. Your sensitive documents never leave your computer.</p>
              </div>
              <div className="border border-editorial-border bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                <Layers className="mb-4 h-6 w-6 text-zinc-400" />
                <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-editorial-black dark:text-white">Batch ready</h3>
                <p className="text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400">Our engine can handle complex batches with dozens of PDFs efficiently.</p>
              </div>
              <div className="border border-editorial-border bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                <Zap className="mb-4 h-6 w-6 text-zinc-400" />
                <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-editorial-black dark:text-white">AI-Driven</h3>
                <p className="text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400">Smart image re-encoding specifically targets large embedded objects for max savings.</p>
              </div>
            </div>

            <SEOSection content={seoContent} />
          </div>

          <aside className="flex flex-col gap-6">
            <AdPlaceholder position="top" />
            
            <div className="border border-editorial-border bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <h3 className="mb-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400">How it works</h3>
              <ul className="flex flex-col gap-4">
                {[
                  "Extraction of embedded assets",
                  "Intelligent resampling",
                  "Metadata pruning",
                  "Object re-linking"
                ].map((step, i) => (
                  <li key={i} className="flex items-center gap-3 text-[11px] font-medium text-zinc-600 dark:text-zinc-400">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center bg-zinc-100 text-[10px] dark:bg-zinc-800">{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-editorial-black p-6 dark:bg-white transition-all group cursor-pointer">
              <h3 className="mb-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Need more?</h3>
              <p className="mb-4 text-xs font-bold text-white dark:text-editorial-black">OptiPress Pro offers 2.0x faster WASM-powered compression for extreme workloads.</p>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-400 group-hover:gap-3 transition-all">
                Learn More <ArrowRight className="h-3 w-3" />
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
