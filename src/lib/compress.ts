import imageCompression from "browser-image-compression";

export interface CompressionOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  useWebWorker?: boolean;
  initialQuality?: number;
  fileType?: string;
}

export async function compressImage(file: File, options: CompressionOptions) {
  try {
    const config = {
      maxSizeMB: options.maxSizeMB || 1024, // High default to avoid forced compression unless specified
      maxWidthOrHeight: options.maxWidthOrHeight || 4096, // Increase default bound
      useWebWorker: true,
      initialQuality: options.initialQuality || 0.8,
      onProgress: (progress: number) => {
        // console.log(`Compression progress: ${progress}%`);
      },
      ...options
    };

    const compressedFile = await imageCompression(file, config);
    return compressedFile;
  } catch (error) {
    console.error("Compression error:", error);
    throw error;
  }
}

export function downloadFile(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
