import React from "react";
import { Upload, X, ImageIcon, CheckCircle2, ChevronRight, FileDown, Trash2 } from "lucide-react";
import { cn, formatBytes } from "../lib/utils";
import { motion, AnimatePresence } from "motion/react";

// Ad Placeholder
export function AdPlaceholder({ position }: { position: "top" | "middle" | "bottom" }) {
  return (
    <div className={cn(
      "w-full bg-editorial-ad-bg border border-dashed border-editorial-ad-border flex items-center justify-center overflow-hidden my-8 dark:bg-zinc-900/40 dark:border-zinc-800",
      position === "top" && "h-[90px]",
      position === "middle" && "h-[250px]",
      position === "bottom" && "h-32"
    )}>
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">ADVERTISEMENT: REFRESH FOR NEW OFFERS</span>
    </div>
  );
}

// Image Uploader
export function ImageUploader({ 
  onFilesSelected,
  className 
}: { 
  onFilesSelected: (files: File[]) => void,
  className?: string
}) {
  const [isDragging, setIsDragging] = React.useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter((f: any) => f.type && f.type.startsWith("image/")) as File[];
    if (files.length > 0) onFilesSelected(files);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter((f: any) => f.type && f.type.startsWith("image/")) as File[];
    if (files.length > 0) onFilesSelected(files);
  };

  return (
    <div 
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      className={cn(
        "relative transition-all duration-200 border-2 border-dashed",
        isDragging 
          ? "border-editorial-black bg-white dark:border-white dark:bg-zinc-900" 
          : "border-editorial-border bg-zinc-50/50 hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900/30",
        className
      )}
    >
      <input 
        type="file" 
        multiple 
        accept="image/*" 
        onChange={handleInput}
        className="absolute inset-0 cursor-pointer opacity-0"
      />
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="mb-4 text-3xl text-zinc-300">↑</div>
        <h3 className="mb-1 text-[11px] font-bold uppercase tracking-widest text-editorial-black dark:text-white">Drag Image Here</h3>
        <p className="mb-6 text-[9px] text-zinc-400 uppercase tracking-wider">
          PNG, JPG, WebP up to 20MB
        </p>
        <div className="flex items-center gap-2 border border-editorial-black bg-white px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest text-editorial-black dark:border-zinc-700 dark:bg-zinc-800 dark:text-white">
          Choose Files
        </div>
      </div>
    </div>
  );
}

// Side-by-side Preview (Individual Image Card)
export function ImageCard({ 
  originalFile, 
  compressedFile, 
  compressedSize,
  isProcessing,
  targetType,
  onTargetTypeChange,
  onRemove,
  onDownload
}: { 
  originalFile: File,
  compressedFile: Blob | null,
  compressedSize: number | null,
  isProcessing: boolean,
  targetType: string,
  onTargetTypeChange: (newType: string) => void,
  onRemove: () => void,
  onDownload: () => void,
  key?: string | number
}) {
  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);
  const originalUrl = React.useMemo(() => URL.createObjectURL(originalFile), [originalFile]);
  const compressedUrl = React.useMemo(() => compressedFile ? URL.createObjectURL(compressedFile) : null, [compressedFile]);

  const reduction = React.useMemo(() => {
    if (!compressedSize || !originalFile.size) return 0;
    return Math.round(((originalFile.size - compressedSize) / originalFile.size) * 100);
  }, [originalFile.size, compressedSize]);

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98 }}
        className="group relative overflow-hidden bg-white border border-editorial-border p-5 transition-all dark:border-zinc-800 dark:bg-zinc-900"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="h-8 w-8 shrink-0 overflow-hidden bg-zinc-100 dark:bg-zinc-800">
              <img src={originalUrl} alt={`Original version of ${originalFile.name}`} className="h-full w-full object-cover" />
            </div>
            <div className="overflow-hidden">
              <h4 className="truncate text-xs font-bold uppercase tracking-tight text-editorial-black dark:text-white">{originalFile.name}</h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[9px] font-bold uppercase text-zinc-400 border border-zinc-200 px-1 dark:border-zinc-800 shrink-0">
                  {originalFile.type.split('/')[1] || 'img'}
                </span>
                <span className="text-[10px] text-zinc-300">→</span>
                <select 
                  value={targetType}
                  onChange={(e) => onTargetTypeChange(e.target.value)}
                  className="bg-transparent border-none p-0 text-[9px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 outline-none cursor-pointer hover:underline"
                >
                  <option value="original">Original</option>
                  <option value="image/webp">WebP</option>
                  <option value="image/png">PNG</option>
                  <option value="image/jpeg">JPG</option>
                </select>
                <div className="w-[1px] h-2 bg-zinc-200 dark:bg-zinc-800" />
                <p className="text-[10px] text-zinc-500 uppercase tracking-tighter">{formatBytes(originalFile.size)}</p>
              </div>
            </div>
          </div>
          <button 
            onClick={onRemove}
            className="text-zinc-400 hover:text-editorial-black transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="relative aspect-[3/2] w-full overflow-hidden border border-editorial-border bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800">
          {compressedUrl ? (
            <div className="grid h-full grid-cols-2 gap-px bg-editorial-border dark:bg-zinc-700">
               <div className="relative overflow-hidden group/img">
                 <img src={originalUrl} alt="Before optimization" className="h-full w-full object-cover" />
                 <div className="absolute top-3 left-3 bg-editorial-black/80 px-2 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider">Before</div>
                 <button 
                  onClick={() => setIsPreviewOpen(true)}
                  className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity"
                 >
                   <div className="rounded-full bg-white/90 p-2 text-editorial-black shadow-lg">
                     <ChevronRight className="h-4 w-4" />
                   </div>
                 </button>
               </div>
               <div className="relative overflow-hidden group/img-comp">
                 <img src={compressedUrl} alt="After optimization" className="h-full w-full object-cover" />
                 <div className="absolute top-3 left-3 bg-emerald-700 px-2 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider">After</div>
                 <button 
                  onClick={() => setIsPreviewOpen(true)}
                  className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover/img-comp:opacity-100 transition-opacity"
                 >
                   <div className="rounded-full bg-white/90 p-2 text-editorial-black shadow-lg">
                     <ChevronRight className="h-4 w-4" />
                   </div>
                 </button>
               </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center">
              {isProcessing ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-editorial-black border-t-transparent dark:border-white" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Processing</span>
                </div>
              ) : (
                 <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Queued</span>
              )}
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div>
            {compressedSize && (
              <div className="flex flex-col gap-0.5">
                 <span className="serif text-sm font-bold text-emerald-700 dark:text-emerald-400">-{reduction}% Reduction</span>
                 <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-tighter">{formatBytes(compressedSize)}</span>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <button 
              disabled={!compressedUrl || isProcessing}
              onClick={() => setIsPreviewOpen(true)}
              className="bg-white border border-editorial-border py-2.5 px-4 text-[10px] font-bold uppercase tracking-widest text-editorial-black transition-all hover:bg-zinc-50 dark:bg-zinc-800 dark:text-white dark:border-zinc-700 disabled:opacity-30"
            >
              View
            </button>
            <button 
              disabled={!compressedUrl || isProcessing}
              onClick={onDownload}
              className="bg-editorial-black py-2.5 px-5 text-[10px] font-bold uppercase tracking-widest text-white transition-all hover:bg-zinc-800 dark:bg-white dark:text-editorial-black dark:hover:bg-zinc-200 disabled:opacity-30"
            >
              Download
            </button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isPreviewOpen && compressedUrl && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPreviewOpen(false)}
              className="absolute inset-0 bg-editorial-black/40 backdrop-blur-sm dark:bg-black/60"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-6xl overflow-hidden bg-white dark:bg-zinc-950 border border-editorial-border dark:border-zinc-800 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-editorial-border p-4 dark:border-zinc-800">
                <div className="flex items-center gap-4">
                   <h3 className="serif text-xl font-bold italic dark:text-white">{originalFile.name}</h3>
                   <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 uppercase tracking-widest">
                     -{reduction}% Optimized
                   </span>
                </div>
                <button 
                  onClick={() => setIsPreviewOpen(false)}
                  className="rounded-full p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-editorial-black dark:hover:bg-zinc-900 dark:hover:text-white"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
                            <div className="grid md:grid-cols-2 bg-editorial-border dark:bg-zinc-800 gap-px h-[70vh]">
                 <div className="relative group overflow-hidden bg-white dark:bg-zinc-900">
                    <img src={originalUrl} alt="Full scale original" className="h-full w-full object-contain" />
                    <div className="absolute top-6 left-6 flex flex-col gap-1">
                      <span className="bg-editorial-black px-3 py-1 text-[11px] font-bold text-white uppercase tracking-widest">Original</span>
                      <span className="text-[10px] text-zinc-500 font-bold uppercase dark:text-zinc-400">{formatBytes(originalFile.size)}</span>
                    </div>
                 </div>
                 <div className="relative group overflow-hidden bg-white dark:bg-zinc-900">
                    <img src={compressedUrl} alt="Full scale compressed" className="h-full w-full object-contain" />
                    <div className="absolute top-6 left-6 flex flex-col gap-1">
                      <span className="bg-emerald-700 px-3 py-1 text-[11px] font-bold text-white uppercase tracking-widest">Compressed</span>
                      <span className="text-[10px] text-zinc-500 font-bold uppercase dark:text-zinc-400">{formatBytes(compressedSize || 0)}</span>
                    </div>
                 </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-900/50">
                 <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">
                   All optimization performed locally. Compare quality side-by-side.
                 </p>
                 <button 
                    onClick={onDownload}
                    className="bg-editorial-black text-white px-8 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-800 dark:bg-white dark:text-black transition-all"
                 >
                   Download Resolution
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
