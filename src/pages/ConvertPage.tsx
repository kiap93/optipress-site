import React, { useState, useMemo } from "react";
import { Navbar, Footer, Logo } from "../components/Layout";
import { FileUploader, AdPlaceholder } from "../components/ToolComponents";
import { SEOSection } from "../components/SEOContent";
import { motion, AnimatePresence } from "motion/react";
import { 
  FileText, Download, Zap, Shield, Loader2, CheckCircle2, 
  ArrowRight, FileImage, FileCode, FileSpreadsheet, 
  FileBox, FileDigit, Repeat, ChevronRight, X
} from "lucide-react";
import { SEOTags } from "../components/SEOTags";
import { useLocation, useNavigate } from "react-router-dom";
import { jpgToPdf, pdfToJpg, pdfToWord, pdfToExcel, pdfToHtml, mergePdfs, splitPdf, getPdfPageCount } from "../lib/pdfConverter";
import { downloadFile } from "../lib/compress";
import { BASE_URL, SEO_PAGES } from "../seo-config";
import { cn } from "../lib/utils";
import JSZip from "jszip";
import { Plus, Trash2 } from "lucide-react";

type ConversionFormat = 'jpg' | 'pdf' | 'docx' | 'excel' | 'ppt' | 'html' | 'pdf-merge' | 'pdf-split';

interface ConversionRule {
  from: ConversionFormat;
  to: ConversionFormat;
  label: string;
  icon: React.ElementType;
}

interface SplitRange {
  start: number;
  end: number;
}

const formatBytes = (bytes: number, decimals: number = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

interface ConversionFileState {
  id: string;
  file: File;
  status: 'idle' | 'processing' | 'completed' | 'error';
  progress: number;
  message?: string;
  result?: Blob | Blob[];
  errorMessage?: string;
  pageCount?: number;
  splitRanges?: SplitRange[];
}

const CONVERSIONS: (ConversionRule & { path: string })[] = [
  { from: 'jpg', to: 'pdf', label: 'JPG to PDF', icon: FileImage, path: 'jpg-to-pdf' },
  { from: 'pdf', to: 'jpg', label: 'PDF to JPG', icon: FileText, path: 'pdf-to-jpg' },
  { from: 'docx', to: 'pdf', label: 'Word to PDF', icon: FileBox, path: 'word-to-pdf' },
  { from: 'excel', to: 'pdf', label: 'Excel to PDF', icon: FileSpreadsheet, path: 'excel-to-pdf' },
  { from: 'ppt', to: 'pdf', label: 'PowerPoint to PDF', icon: FileDigit, path: 'ppt-to-pdf' },
  { from: 'html', to: 'pdf', label: 'HTML to PDF', icon: FileCode, path: 'html-to-pdf' },
  { from: 'pdf', to: 'docx', label: 'PDF to Word', icon: FileBox, path: 'pdf-to-word' },
  { from: 'pdf', to: 'excel', label: 'PDF to Excel', icon: FileSpreadsheet, path: 'pdf-to-excel' },
  { from: 'pdf', to: 'ppt', label: 'PDF to PPT', icon: FileDigit, path: 'pdf-to-ppt' },
  { from: 'pdf', to: 'html', label: 'PDF to HTML', icon: FileCode, path: 'pdf-to-html' },
];

const PDF_UTILITIES: (ConversionRule & { path: string })[] = [
  { from: 'pdf', to: 'pdf-merge', label: 'Merge PDF', icon: Repeat, path: 'merge-pdf' },
  { from: 'pdf', to: 'pdf-split', label: 'Split PDF', icon: Repeat, path: 'split-pdf' },
];

const ALL_CONVERSIONS = [...CONVERSIONS, ...PDF_UTILITIES];

export default function ConvertPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname.substring(1);

  const selectedRule = useMemo(() => {
    return ALL_CONVERSIONS.find(c => c.path === currentPath) || CONVERSIONS[0];
  }, [currentPath]);

  const isPdfUtility = PDF_UTILITIES.some(u => u.path === currentPath);
  const displayList = isPdfUtility ? PDF_UTILITIES : CONVERSIONS;

  const [files, setFiles] = useState<ConversionFileState[]>([]);
  const [isProcessingAll, setIsProcessingAll] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const seoContent = useMemo(() => SEO_PAGES[currentPath] || SEO_PAGES["default"], [currentPath]);

  const handleFilesSelected = async (newFiles: File[]) => {
    const queue: ConversionFileState[] = [];
    
    for (const f of newFiles) {
      const id = Math.random().toString(36).substring(7);
      let pageCount: number | undefined;
      let splitRanges: SplitRange[] | undefined;

      if (selectedRule.to === 'pdf-split' && f.type === 'application/pdf') {
        try {
          pageCount = await getPdfPageCount(f);
          splitRanges = [{ start: 1, end: pageCount }];
        } catch (e) {
          console.error("Failed to get page count", e);
        }
      }

      queue.push({
        id,
        file: f,
        status: 'idle',
        progress: 0,
        pageCount,
        splitRanges
      });
    }

    setFiles(prev => [...prev, ...queue]);
    setError(null);
  };

  const addRange = (fileId: string) => {
    setFiles(prev => prev.map(f => {
      if (f.id === fileId && f.splitRanges && f.pageCount) {
        const lastRange = f.splitRanges[f.splitRanges.length - 1];
        const nextStart = Math.min(f.pageCount, lastRange.end + 1);
        return {
          ...f,
          splitRanges: [...f.splitRanges, { start: nextStart, end: f.pageCount }]
        };
      }
      return f;
    }));
  };

  const removeRange = (fileId: string, rangeIndex: number) => {
    setFiles(prev => prev.map(f => {
      if (f.id === fileId && f.splitRanges && f.splitRanges.length > 1) {
        return {
          ...f,
          splitRanges: f.splitRanges.filter((_, i) => i !== rangeIndex)
        };
      }
      return f;
    }));
  };

  const updateRange = (fileId: string, rangeIndex: number, field: 'start' | 'end', value: number) => {
    setFiles(prev => prev.map(f => {
      if (f.id === fileId && f.splitRanges && f.pageCount) {
        const newRanges = [...f.splitRanges];
        const val = Math.max(1, Math.min(f.pageCount, value));
        newRanges[rangeIndex] = { ...newRanges[rangeIndex], [field]: val };
        return { ...f, splitRanges: newRanges };
      }
      return f;
    }));
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const runSingleConversion = async (fileState: ConversionFileState): Promise<Blob | Blob[]> => {
    const updateMsg = (msg: string) => {
      setFiles(prev => prev.map(f => f.id === fileState.id ? { ...f, message: msg } : f));
    };

    if (selectedRule.from === 'jpg' && selectedRule.to === 'pdf') {
      return await jpgToPdf([fileState.file]);
    } else if (selectedRule.from === 'pdf' && selectedRule.to === 'jpg') {
      return await pdfToJpg(fileState.file);
    } else if (selectedRule.from === 'pdf' && selectedRule.to === 'docx') {
      return await pdfToWord(fileState.file, updateMsg);
    } else if (selectedRule.from === 'pdf' && selectedRule.to === 'excel') {
      return await pdfToExcel(fileState.file);
    } else if (selectedRule.from === 'pdf' && selectedRule.to === 'html') {
      return await pdfToHtml(fileState.file);
    } else if (selectedRule.to === 'pdf-split') {
      return await splitPdf(fileState.file, fileState.splitRanges);
    }
    throw new Error(`The ${selectedRule.label} conversion is currently being optimized.`);
  };

  const processBatch = async () => {
    if (files.length === 0 || isProcessingAll) return;
    setIsProcessingAll(true);
    setError(null);

    // Special case for Merge PDF (Batch-to-One)
    if (selectedRule.to === 'pdf-merge') {
      if (files.length < 2) {
        setError("Please add at least 2 PDF files to merge.");
        setIsProcessingAll(false);
        return;
      }
      
      setFiles(prev => prev.map(f => ({ ...f, status: 'processing', progress: 50, message: 'Merging...' })));
      try {
        const mergedBlob = await mergePdfs(files.map(f => f.file));
        // Update the first file with the result and mark others as done or handled
        setFiles(prev => prev.map((f, i) => i === 0 
          ? { ...f, status: 'completed', result: mergedBlob, progress: 100, message: 'Merged!' }
          : { ...f, status: 'completed', progress: 100, message: 'Included in merge' }
        ));
      } catch (err: any) {
        setError(err.message || "Merge failed");
        setFiles(prev => prev.map(f => ({ ...f, status: 'error' })));
      }
      setIsProcessingAll(false);
      return;
    }

    const idleFiles = files.filter(f => f.status === 'idle');

    for (const current of idleFiles) {
      setFiles(prev => prev.map(f => 
        f.id === current.id ? { ...f, status: 'processing', progress: 30 } : f
      ));

      try {
        const output = await runSingleConversion(current);
        setFiles(prev => prev.map(f => 
          f.id === current.id ? { ...f, status: 'completed', result: output, progress: 100 } : f
        ));
      } catch (err: any) {
        setFiles(prev => prev.map(f => 
          f.id === current.id ? { ...f, status: 'error', errorMessage: err.message || 'Failed' } : f
        ));
      }
    }
    setIsProcessingAll(false);
  };

  const handleDownloadSingle = async (fileState: ConversionFileState) => {
    if (!fileState.result) return;
    const res = fileState.result;

    if (Array.isArray(res)) {
      const ext = res[0].type === 'application/pdf' ? 'pdf' : 'jpg';
      if (res.length === 1) {
        downloadFile(res[0], `optipress_${fileState.file.name.split('.')[0]}_part_1.${ext}`);
      } else {
        const zip = new JSZip();
        res.forEach((blob, i) => zip.file(`part_${i + 1}.${ext}`, blob));
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        downloadFile(zipBlob, `optipress_${fileState.file.name.split('.')[0]}_bundle.zip`);
      }
    } else {
      const ext = selectedRule.to === 'pdf-merge' ? 'pdf' : selectedRule.to;
      const fileName = selectedRule.to === 'pdf-merge' ? 'optipress_merged.pdf' : `optipress_${fileState.file.name.split('.')[0]}.${ext}`;
      downloadFile(res, fileName);
    }
  };

  const downloadAll = async () => {
    const completed = files.filter(f => f.status === 'completed' && f.result);
    if (completed.length === 0) return;

    if (completed.length === 1) {
      handleDownloadSingle(completed[0]);
      return;
    }

    const zip = new JSZip();
    for (const f of completed) {
      const res = f.result!;
      if (Array.isArray(res)) {
        const subZip = new JSZip();
        res.forEach((b, i) => subZip.file(`page_${i+1}.jpg`, b));
        const subBlob = await subZip.generateAsync({ type: 'blob' });
        zip.file(`${f.file.name.split('.')[0]}_images.zip`, subBlob);
      } else {
        zip.file(`${f.file.name.split('.')[0]}.${selectedRule.to}`, res);
      }
    }

    const content = await zip.generateAsync({ type: "blob" });
    downloadFile(content, `optipress_batch_conversion_${selectedRule.to}.zip`);
  };

  return (
    <div className="min-h-screen bg-editorial-bg dark:bg-zinc-950 transition-colors duration-300">
      <SEOTags 
        title={seoContent.metaTitle || "Premium PDF Converter Tool | OptiPress"}
        description={seoContent.metaDesc}
        canonical={`${BASE_URL}/${currentPath}`}
      />

      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-6 transition-all duration-300">
        <div className="mb-12 flex flex-col gap-2 border-b border-editorial-border pb-8 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="bg-editorial-black px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-widest dark:bg-white dark:text-editorial-black">File Conversion</span>
            <span className="h-px w-12 bg-editorial-border dark:bg-zinc-800"></span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Stable v2.0</span>
          </div>
          <div className="flex items-center gap-4">
            <Logo className="w-16 h-16 hidden md:block" />
            <h1 className="serif text-4xl font-bold italic tracking-tight text-editorial-black dark:text-white md:text-6xl">
              {selectedRule.label}
            </h1>
          </div>
          <p className="max-w-xl text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Convert files with pixel-perfect precision. Our client-side engine handles everything in your browser for maximum security.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="flex flex-col gap-6">
            
            {/* Quick Select Grid */}
            <div className="flex overflow-x-auto pb-4 gap-2 md:grid md:grid-cols-5 md:overflow-visible md:pb-0 scrollbar-hide">
              {displayList.slice(0, 10).map((rule) => {
                const Icon = rule.icon;
                const isActive = selectedRule.path === rule.path;
                return (
                  <button
                    key={rule.label}
                    onClick={() => { navigate(`/${rule.path}`); setFiles([]); setError(null); }}
                    className={cn(
                      "flex min-w-[120px] flex-col items-center gap-3 border p-4 transition-all md:min-w-0",
                      isActive 
                        ? "border-editorial-black bg-white dark:border-white dark:bg-zinc-900 shadow-sm" 
                        : "border-editorial-border bg-zinc-50/50 hover:bg-white dark:border-zinc-800 dark:bg-zinc-900/30 dark:hover:bg-zinc-900"
                    )}
                  >
                    <Icon className={cn("h-6 w-6", isActive ? 'text-editorial-black dark:text-white' : 'text-zinc-400')} />
                    <span className={cn(
                      "text-[10px] font-bold uppercase tracking-tight text-center",
                      isActive ? 'text-editorial-black dark:text-white' : 'text-zinc-500'
                    )}>
                      {rule.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="border border-editorial-border bg-white p-6 md:p-8 dark:border-zinc-800 dark:bg-zinc-900">
              <FileUploader 
                 onFilesSelected={handleFilesSelected} 
                 multiple={true} 
                 accept={selectedRule.from === 'pdf' ? "application/pdf" : "image/*,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.html"}
                 className={files.length > 0 ? "py-8" : ""}
              />
            </div>

            <AnimatePresence>
              {files.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col gap-4"
                >
                  <div className="flex items-center justify-between bg-white p-4 border border-editorial-border dark:bg-zinc-900 dark:border-zinc-800">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-zinc-100 flex items-center justify-center dark:bg-zinc-800">
                        <selectedRule.icon className="h-5 w-5 text-zinc-400" />
                      </div>
                      <div>
                        <h3 className="text-xs font-black uppercase tracking-widest text-editorial-black dark:text-white">
                          Convert Queue ({files.length} Files)
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
                           className="bg-editorial-black px-6 py-2 text-[10px] font-black uppercase tracking-widest text-white hover:bg-zinc-800 disabled:opacity-50 transition-all font-mono"
                         >
                           {isProcessingAll ? 'Converting...' : 'Start Batch'}
                         </button>
                       )}
                       {files.some(f => f.status === 'completed' && f.result) && (
                         <button 
                           onClick={downloadAll}
                           className="bg-emerald-600 px-6 py-2 text-[10px] font-black uppercase tracking-widest text-white hover:bg-emerald-700 transition-all"
                         >
                           {selectedRule.to === 'pdf-merge' ? 'Download Merged PDF' : 'Download All (.zip)'}
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
                        <div className="flex flex-col flex-1 gap-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <FileText className={`h-5 w-5 ${fileState.status === 'completed' ? 'text-emerald-500' : 'text-zinc-300'}`} />
                              <div>
                                <p className="text-xs font-bold text-editorial-black dark:text-white truncate max-w-[200px] md:max-w-md">{fileState.file.name}</p>
                                <div className="flex gap-2 text-[9px] font-bold uppercase tracking-tight text-zinc-400">
                                   <span>{formatBytes(fileState.file.size)}</span>
                                   <span>&rarr; {selectedRule.to.toUpperCase()}</span>
                                   {fileState.pageCount && <span>• {fileState.pageCount} Pages</span>}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-4">
                               {fileState.status === 'processing' && (
                                 <div className="flex items-center gap-2">
                                   <Loader2 className="h-3 w-3 animate-spin text-zinc-400" />
                                   <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                                     {fileState.message || `${fileState.progress}%`}
                                   </span>
                                 </div>
                               )}
                               
                               {fileState.status === 'completed' && fileState.result && selectedRule.to !== 'pdf-merge' && (
                                 <button 
                                   onClick={() => handleDownloadSingle(fileState)}
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
                          </div>

                          {selectedRule.to === 'pdf-split' && fileState.splitRanges && fileState.status === 'idle' && (
                            <div className="mt-4 border-t border-editorial-border pt-4 dark:border-zinc-800">
                              <div className="mb-2 flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Split Ranges</span>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); addRange(fileState.id); }}
                                  className="flex items-center gap-1 text-[10px] font-bold text-editorial-black hover:underline dark:text-white"
                                >
                                  <Plus className="h-3 w-3" /> Add Range
                                </button>
                              </div>
                              <div className="flex flex-col gap-2">
                                {fileState.splitRanges.map((range, idx) => (
                                  <div key={idx} className="flex items-center gap-3">
                                    <div className="flex items-center gap-2">
                                      <label className="text-[10px] font-bold text-zinc-400 uppercase">From</label>
                                      <input 
                                        type="number" 
                                        value={range.start}
                                        min={1}
                                        max={fileState.pageCount}
                                        onChange={(e) => updateRange(fileState.id, idx, 'start', parseInt(e.target.value))}
                                        className="w-16 border border-editorial-border bg-zinc-50 px-2 py-1 text-[11px] font-mono focus:border-editorial-black focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                                      />
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <label className="text-[10px] font-bold text-zinc-400 uppercase">To</label>
                                      <input 
                                        type="number" 
                                        value={range.end}
                                        min={1}
                                        max={fileState.pageCount}
                                        onChange={(e) => updateRange(fileState.id, idx, 'end', parseInt(e.target.value))}
                                        className="w-16 border border-editorial-border bg-zinc-50 px-2 py-1 text-[11px] font-mono focus:border-editorial-black focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                                      />
                                    </div>
                                    {fileState.splitRanges!.length > 1 && (
                                      <button 
                                        onClick={(e) => { e.stopPropagation(); removeRange(fileState.id, idx); }}
                                        className="p-1 text-zinc-300 hover:text-red-500 transition-colors"
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </button>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {fileState.status === 'processing' && (
                          <div className="absolute bottom-0 left-0 h-0.5 bg-editorial-black dark:bg-white transition-all duration-300" style={{ width: `${fileState.progress}%` }} />
                        )}

                        {fileState.status === 'error' && (
                          <div className="absolute bottom-0 left-0 h-0.5 bg-red-500 w-full" />
                        )}
                      </motion.div>
                    ))}
                  </div>

                  {error && (
                     <div className="border border-red-100 bg-red-50 p-4 dark:bg-red-950/10 dark:border-red-900/50">
                        <p className="text-[10px] font-bold text-red-600 uppercase tracking-tight">{error}</p>
                     </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="border border-editorial-border bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                <Shield className="mb-4 h-6 w-6 text-zinc-400" />
                <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-editorial-black dark:text-white">Encrypted Flow</h3>
                <p className="text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400">All conversion logic occurs in client-side memory. No data is ever persisted to our servers.</p>
              </div>
              <div className="border border-editorial-border bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                <Zap className="mb-4 h-6 w-6 text-zinc-400" />
                <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-editorial-black dark:text-white">Lossless Engine</h3>
                <p className="text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400">Our converters use high-fidelity libraries to ensure your document layout remains intact.</p>
              </div>
              <div className="border border-editorial-border bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                <Repeat className="mb-4 h-6 w-6 text-zinc-400" />
                <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-editorial-black dark:text-white">Batch Mode</h3>
                <p className="text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400">Select dozens of images and merge them into a single PDF instantly.</p>
              </div>
            </div>

            <SEOSection content={seoContent} />
          </div>

          <aside className="flex flex-col gap-6">
            <AdPlaceholder position="top" />
            
            <div className="border border-editorial-border bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <h3 className="mb-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Popular Tools</h3>
              <div className="flex flex-col gap-2">
                {displayList.slice(0, 6).map((rule) => (
                  <button 
                    key={rule.label}
                    onClick={() => { navigate(`/${rule.path}`); setFiles([]); setError(null); }}
                    className="flex items-center justify-between group py-2"
                  >
                    <span className="text-[11px] font-medium text-zinc-600 dark:text-zinc-400 group-hover:text-editorial-black dark:group-hover:text-white transition-colors">{rule.label}</span>
                    <ChevronRight className="h-3 w-3 text-zinc-300 group-hover:text-editorial-black dark:group-hover:text-white transition-all transform group-hover:translate-x-1" />
                  </button>
                ))}
              </div>
            </div>
            
            <div className="bg-editorial-black p-6 dark:bg-white group cursor-pointer transition-all">
              <h3 className="mb-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Upgrade to Pro</h3>
              <p className="mb-4 text-xs font-bold text-white dark:text-editorial-black">Faster processing for large Office documents and OCR capabilities.</p>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-400 transition-all group-hover:gap-3">
                See pricing <ArrowRight className="h-3 w-3" />
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
