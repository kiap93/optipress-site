import { PDFDocument } from 'pdf-lib';
import * as pdfjs from 'pdfjs-dist';

// Set worker path for pdfjs
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs`;

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

export async function pdfToWord(file: File): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  let text = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map((item: any) => item.str);
    text += strings.join(' ') + '\n\n';
  }

  // Create a minimal .doc content (actually HTML which Word can open)
  const docContent = `
    <html>
      <head><meta charset="utf-8"></head>
      <body>
        <div style="font-family: Arial, sans-serif; white-space: pre-wrap;">
          ${text}
        </div>
      </body>
    </html>
  `;
  
  return new Blob([docContent], { type: 'application/msword' });
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
  // For the sake of this demo, we'll return a placeholder or use html2pdf if needed.
  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}
