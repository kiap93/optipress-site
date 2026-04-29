import { PDFDocument } from 'pdf-lib';
import * as pdfjs from 'pdfjs-dist';
import { createWorker } from 'tesseract.js';
import { Document, Packer, Paragraph, TextRun } from 'docx';

// Set worker path for pdfjs
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@5.6.205/build/pdf.worker.min.mjs`;

export async function jpgToPdf(files: File[]): Promise<Blob> {
  const pdfDoc = await PDFDocument.create();
  
  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const image = file.type === 'image/jpeg' ? await pdfDoc.embedJpg(arrayBuffer) : await pdfDoc.embedPng(arrayBuffer);
    
    const page = pdfDoc.addPage([image.width, image.height]);
    page.drawImage(image, {
      x: 0,
      y: 0,
      width: image.width,
      height: image.height,
    });
  }
  
  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}

export async function pdfToJpg(file: File): Promise<Blob[]> {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  const imageBlobs: Blob[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 2.0 }); // 2x for better quality
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) continue;

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({
      canvasContext: context,
      viewport: viewport,
      canvas: canvas as any
    }).promise;

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((b) => resolve(b), 'image/jpeg', 0.8);
    });

    if (blob) imageBlobs.push(blob);
  }

  return imageBlobs;
}

export async function pdfToWord(file: File, onProgress?: (msg: string) => void): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  
  const paragraphs: Paragraph[] = [];
  let worker: any = null;

  for (let i = 1; i <= pdf.numPages; i++) {
    onProgress?.(`Processing Page ${i} of ${pdf.numPages}...`);
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    
    let pageText = "";
    
    // Check if page has sufficient text content
    if (content.items.length > 10) {
      const strings = content.items.map((item: any) => item.str);
      pageText = strings.join(" ");
    } else {
      // Fallback to OCR for scanned PDFs
      onProgress?.(`OCR Scanning Page ${i}...`);
      if (!worker) {
        worker = await createWorker("eng");
      }
      
      const viewport = page.getViewport({ scale: 2.0 });
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      
      if (context) {
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        await page.render({
          canvasContext: context,
          viewport: viewport,
          canvas: canvas as any
        }).promise;
        
        const { data: { text } } = await worker.recognize(canvas);
        pageText = text;
      }
    }

    if (pageText.trim()) {
      // Split by newlines to create multiple paragraphs for better formatting
      const lines = pageText.split("\n");
      lines.forEach(line => {
        if (line.trim()) {
          paragraphs.push(
            new Paragraph({
              children: [new TextRun(line.trim())],
              spacing: { after: 200 }
            })
          );
        }
      });
    }
  }

  if (worker) {
    await worker.terminate();
  }

  const doc = new Document({
    sections: [{
      properties: {},
      children: paragraphs,
    }],
  });

  return await Packer.toBlob(doc);
}

export async function pdfToExcel(file: File): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  let csv = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    
    // Group items by their vertical position (y coordinate) to identify "rows"
    const items = content.items as any[];
    const rows: { [key: number]: any[] } = {};
    
    items.forEach(item => {
      const y = Math.round(item.transform[5]);
      if (!rows[y]) rows[y] = [];
      rows[y].push(item);
    });

    // Sort rows by y (descending) and items within rows by x (ascending)
    const sortedY = Object.keys(rows).map(Number).sort((a, b) => b - a);
    sortedY.forEach(y => {
      const rowItems = rows[y].sort((a, b) => a.transform[4] - b.transform[4]);
      csv += rowItems.map(item => `"${item.str.replace(/"/g, '""')}"`).join(',') + '\n';
    });
    
    csv += '\n'; // Page break in csv
  }

  return new Blob([csv], { type: 'text/csv' });
}

export async function pdfToHtml(file: File): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  let html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: sans-serif; line-height: 1.5; padding: 2rem; max-width: 800px; margin: auto; }
          .page { margin-bottom: 3rem; border-bottom: 2px border #eee; padding-bottom: 2rem; }
          .text-item { position: absolute; }
        </style>
      </head>
      <body>
  `;

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    html += `<div class="page"><h2>Page ${i}</h2>`;
    
    // Simple text flow
    const strings = content.items.map((item: any) => item.str);
    html += `<p>${strings.join(' ')}</p>`;
    
    html += `</div>`;
  }

  html += `</body></html>`;
  return new Blob([html], { type: 'text/html' });
}

export async function htmlToPdf(html: string): Promise<Blob> {
  // This is a simplified version. For a real production app, 
  // you'd use something like html2pdf.js but we can try basic implementation
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  page.drawText('HTML to PDF conversion requires a rendering engine or print-to-pdf API.', {
    x: 50,
    y: 700,
    size: 20
  });
  // Since we are client-side only, we might suggest window.print() or use a library
  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}

export async function mergePdfs(files: File[]): Promise<Blob> {
  const mergedPdf = await PDFDocument.create();
  
  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const pdf = await PDFDocument.load(bytes);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }
  
  const pdfBytes = await mergedPdf.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}

export async function getPdfPageCount(file: File): Promise<number> {
  const bytes = await file.arrayBuffer();
  const pdf = await PDFDocument.load(bytes);
  return pdf.getPageCount();
}

export async function splitPdf(file: File, ranges?: { start: number, end: number }[]): Promise<Blob[]> {
  const bytes = await file.arrayBuffer();
  const mainPdf = await PDFDocument.load(bytes);
  const pdfs: Blob[] = [];
  const totalPages = mainPdf.getPageCount();

  // If no ranges provided, default to splitting every page (original behavior)
  const actualRanges = ranges || Array.from({ length: totalPages }, (_, i) => ({ start: i + 1, end: i + 1 }));
  
  for (const range of actualRanges) {
    const singlePdf = await PDFDocument.create();
    // pdf-lib indices are 0-based
    const startIdx = Math.max(0, range.start - 1);
    const endIdx = Math.min(totalPages - 1, range.end - 1);
    
    if (startIdx > endIdx) continue;

    const indices = [];
    for (let i = startIdx; i <= endIdx; i++) {
        indices.push(i);
    }

    const copiedPages = await singlePdf.copyPages(mainPdf, indices);
    copiedPages.forEach(page => singlePdf.addPage(page));
    
    const pdfBytes = await singlePdf.save();
    pdfs.push(new Blob([pdfBytes], { type: 'application/pdf' }));
  }
  
  return pdfs;
}
