import { PDFDocument, PDFName, PDFRawStream, PDFDict } from 'pdf-lib';

export interface PDFCompressionResult {
  blob: Blob;
  originalSize: number;
  compressedSize: number;
  reductionPercentage: number;
}

export async function compressPdf(
  file: File,
  quality: number = 0.7,
  onProgress?: (progress: number) => void
): Promise<PDFCompressionResult> {
  const originalSize = file.size;
  const arrayBuffer = await file.arrayBuffer();
  
  // Load with ignoreEncryption to detect it or throw
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  
  if (pdfDoc.isEncrypted) {
    throw new Error('Cannot compress encrypted/password-protected PDFs.');
  }
  
  const enumerateIndirectObjects = pdfDoc.context.enumerateIndirectObjects();
  const totalObjects = enumerateIndirectObjects.length;

  for (let i = 0; i < totalObjects; i++) {
    const [ref, pdfObject] = enumerateIndirectObjects[i];
    if (!(pdfObject instanceof PDFRawStream)) continue;

    try {
      const dict = pdfObject.dict;
      const subtype = dict.get(PDFName.of('Subtype'));
      if (subtype !== PDFName.of('Image')) continue;

      const filter = dict.get(PDFName.of('Filter'));
      const isDCT = filter === PDFName.of('DCTDecode') || (filter instanceof Array && filter.includes(PDFName.of('DCTDecode')));
      
      // We only target JPEG streams (DCTDecode) to safely re-compress via Canvas.
      // Modifying FlateDecode (raw pixel data) without a proper decoder often leads to breakage.
      if (!isDCT) continue;

      const imageBytes = pdfObject.contents;
      const blob = new Blob([imageBytes], { type: 'image/jpeg' });
      const img = await createImageFromBlob(blob);
      
      const compressedBytes = await recompressImage(img, quality);
      
      // Update the dictionary for the new content
      dict.set(PDFName.of('Length'), pdfDoc.context.obj(compressedBytes.length));
      dict.set(PDFName.of('Filter'), PDFName.of('DCTDecode'));
      dict.delete(PDFName.of('DecodeParms')); // Clean up parameters that might belong to the old stream

      // Create a replacement stream and assign it to the original reference
      const newStream = pdfDoc.context.stream(compressedBytes, dict as any);
      pdfDoc.context.assign(ref, newStream);
    } catch (e) {
      console.warn('Skipping an unprocessable image object in PDF:', e);
    }

    if (onProgress) {
      onProgress(Math.round((i / totalObjects) * 100));
    }
  }

  // Use compatible save options
  const pdfBytes = await pdfDoc.save({
    useObjectStreams: false,
    addDefaultPage: false,
  });
  const compressedBlob = new Blob([pdfBytes], { type: 'application/pdf' });
  const compressedSize = compressedBlob.size;

  return {
    blob: compressedBlob,
    originalSize,
    compressedSize,
    reductionPercentage: Math.round(((originalSize - compressedSize) / originalSize) * 100),
  };
}

async function createImageFromBlob(blob: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image from PDF'));
    };
    img.src = url;
  });
}

async function recompressImage(img: HTMLImageElement, quality: number): Promise<Uint8Array> {
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Failed to get canvas context');
  
  ctx.drawImage(img, 0, 0);
  
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Canvas toBlob failed'));
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        resolve(new Uint8Array(reader.result as ArrayBuffer));
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(blob);
    }, 'image/jpeg', quality);
  });
}
