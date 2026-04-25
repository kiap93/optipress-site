import { SEOContentProps } from "./components/SEOContent";

export const BASE_URL = "https://optipress.ai";

export const SEO_PAGES: Record<string, SEOContentProps & { metaTitle: string; metaDesc: string; canonical: string }> = {
  "default": {
    metaTitle: "OptiPress – Compress Images Without Losing Quality",
    metaDesc: "Free online image compression tool. Reduce image size without losing quality using smart AI compression. 100% private and secure.",
    canonical: BASE_URL,
    title: "How OptiPress Revolutionizes Image Optimization",
    subtitle: "High-fidelity client-side compression. No uploads. 100% private processing.",
    paragraphs: [
      "OptiPress was built with a single mission: to make image optimization fast, secure, and accessible to everyone. Unlike traditional tools that upload your sensitive data to remote servers, OptiPress uses cutting-edge browser APIs to process everything right on your device.",
      "Whether you are a developer looking to improve Web Vitals, a marketer optimizing social media assets, or a photographer managing large galleries, our tool ensures your images maintain exceptional clarity while shedding unnecessary kilobytes in seconds.",
      "Our multi-threaded engine handles batch processing effortlessly, allowing you to optimize dozens of images simultaneously without any lag."
    ],
    faqs: [
      { question: "Is my data safe?", answer: "Yes. Your images never leave your browser. All processing happens locally on your computer." },
      { question: "What formats do you support?", answer: "We support PNG, JPG, and WebP formats for both input and output." },
      { question: "Is there a file size limit?", answer: "The browser's memory is your only limit, but we recommend files under 50MB for the best experience." }
    ]
  },
  "compress-image": {
    metaTitle: "Compress Image Online – Reduce Image Size Fast",
    metaDesc: "The fastest way to compress images for web. OptiPress reduces file size by up to 90% without compromising visual quality.",
    canonical: `${BASE_URL}/compress-image`,
    title: "Professional Image Compression",
    subtitle: "Smart AI-driven optimization for faster loading times.",
    paragraphs: [
      "Image size is the #1 factor affecting web performance. With OptiPress, you can optimize your site speed instantly. We use advanced compression algorithms that target redundant data while preserving the perceptual details that matter to the human eye.",
      "Drop your files, adjust the quality, and download perfectly optimized versions in seconds. Every byte saved is a step toward a faster, more efficient internet."
    ],
    faqs: [
      { question: "How much space can I save?", answer: "Users typically see 60-90% reduction in file size for PNG and JPEG files." },
      { question: "Do I need an account?", answer: "No. OptiPress is a free, no-login-required utility for everyone." }
    ]
  },
  "compress-pdf": {
    metaTitle: "Compress PDF Online – Shrink PDF Size Locally | OptiPress",
    metaDesc: "Reduce PDF file size without sacrificing quality. Our client-side optimization compresses images inside your PDF 100% privately.",
    canonical: `${BASE_URL}/compress-pdf`,
    title: "Secure PDF Optimization",
    subtitle: "Privacy-first compression that happens entirely on your device.",
    paragraphs: [
      "PDF files can be notoriously large, especially when they contain high-resolution images or embedded graphics. OptiPress uses smart extraction techniques to identify these assets and optimize them without altering the original text or document structure.",
      "By processing everything in the browser, OptiPress ensures that your confidential documents, legal contracts, and personal records never touch a cloud server. This is the new standard of online processing: power without the privacy risk."
    ],
    faqs: [
      { question: "Are my PDFs safe?", answer: "Yes. They are processed entirely in your browser's RAM and never uploaded to any server." },
      { question: "Does it affect text quality?", answer: "No. We only target embedded images and redundant metadata. Your text remains perfectly sharp." }
    ]
  },
  "compress-pdf-to-1mb": {
    metaTitle: "Compress PDF to 1MB Online – Shrink Documents Fast | OptiPress",
    metaDesc: "The best tool to compress PDF to 1MB or less. Professional documents optimized for online uploads, government portals, and school applications.",
    canonical: `${BASE_URL}/compress-pdf-to-1mb`,
    title: "Expert Tool to Compress PDF to 1MB",
    subtitle: "Precise size reduction for critical document uploads.",
    paragraphs: [
      "Many online portals and government websites enforce a strict 1MB limit for PDF uploads. When your high-resolution scan or graphics-heavy report exceeds this limit, OptiPress provides the precision needed to shrink your file without rendering it illegible.",
      "Our compression algorithm selectively targets resource-heavy elements like high-DPI images and unnecessary document metadata. Unlike generic compressors that simply lower the overall resolution, OptiPress uses smart pixel-detection to ensure that text remains crisp and signatures stay clear even at significantly reduced file sizes.",
      "By utilizing client-side processing, we eliminate the risk of sensitive information leaking during a server transfer. You can safely compress tax documents, medical records, or identity proofs directly in your browser tab. Our speed is unmatched because there is no upload wait time—your 1MB goal is reached in seconds.",
      "If 1MB is still too large, our professional-grade settings allow you to further adjust quality sliders, giving you total control over the balance between visual fidelity and storage footprint."
    ],
    faqs: [
      { question: "How can I get my PDF under 1MB exactly?", answer: "Start with our standard compression. If it is still over 1MB, try reducing the quality slider slightly to see better results on scanned documents." },
      { question: "Is this tool free?", answer: "Yes, OptiPress is a free utility with no hidden subscriptions or watermarks." }
    ]
  },
  "compress-pdf-for-email": {
    metaTitle: "Compress PDF for Email Online – Send Large Files Easily",
    metaDesc: "Stop hitting email size limits. Compress your PDFs for Outlook, Gmail, and other mail clients with one click. 100% private and fast.",
    canonical: `${BASE_URL}/compress-pdf-for-email`,
    title: "Optimized PDF Compression for Email Attachments",
    subtitle: "Ensure your documents reach their destination every time.",
    paragraphs: [
      "Email providers like Gmail and Outlook often have attachment limits around 20-25MB. If you are trying to send a portfolio, a legal brief, or a project presentation that exceeds these limits, your email will bounce or get stuck in the outbox. OptiPress is designed specifically to solve this 'attachment too large' headache.",
      "Our email-optimization mode focuses on stripping away invisible 'bloat' from PDF files. This includes duplicate objects, unused fonts, and legacy metadata that serves no purpose in a modern document. We re-encode embedded JPEG assets inside the PDF to a web-ready resolution that looks professional on modern screens while occupying a fraction of the space.",
      "Why use OptiPress instead of file sharing links? Because many corporate firewalls block links to Dropbox or WeTransfer. Sending a compressed PDF directly as an attachment is the most reliable way to ensure your client or colleague actually sees the file without jumping through hoops.",
      "Because OptiPress runs locally, you can use it even when your internet connection is slow or unstable. You don't have to wait for a 50MB file to upload just to receive a 2MB version back—the compression happens at the speed of your device's processor."
    ],
    faqs: [
      { question: "Will my client notice the compression?", answer: "Most users won't notice a difference on computer screens or mobile devices. We prioritize 'perceptual quality' so the document looks original." },
      { question: "Does this work for multi-page PDFs?", answer: "Yes, we handle PDFs with hundreds of pages and thousands of internal objects simultaneously." }
    ]
  },
  "jpg-to-pdf": {
    metaTitle: "Convert JPG to PDF Online - Fast & Free | OptiPress",
    metaDesc: "Turn your photos or scanned JPGs into a professional PDF document. Batch processing supported, 100% private in-browser tool.",
    canonical: `${BASE_URL}/jpg-to-pdf`,
    title: "JPG to PDF Converter",
    subtitle: "Merge your images into a single, high-quality document.",
    paragraphs: [
      "Converting static images into a dynamic PDF document is essential for creating portfolios, submission packages, or digital archives. OptiPress offers a seamless way to stack multiple JPG files into a single, unified PDF file. Unlike other tools that might compress your images or compromise color accuracy, OptiPress embeds your files at their original resolution to ensure zero loss in quality.",
      "The process is entirely local. When you drag your images into our converter, they are handled by your browser's RAM, not a distant server. This means your private photos, identity documents, and sensitive scans stay exactly where they belong: on your computer. After the conversion is complete, you can download the final PDF instantly.",
      "Our JPG to PDF tool handles various image formats including PNG and WebP as well, automatically adjusting page sizes to match your input aspect ratios. Whether you are building a professional project brief or just organizing receipts, OptiPress provides the minimalist, secure workflow you need."
    ],
    faqs: [
      { question: "Can I convert multiple JPGs at once?", answer: "Yes, just select all your images and they will be merged into a single multi-page PDF." },
      { question: "Is there a limit on image resolution?", answer: "No, OptiPress handles high-res images, though extremely large files may take a few seconds to process depending on your CPU." }
    ]
  },
  "pdf-to-jpg": {
    metaTitle: "Convert PDF to JPG Online - High Quality Images | OptiPress",
    metaDesc: "Extract pages from your PDF as high-quality JPG images. Every page is rendered with precision 100% locally in your browser.",
    canonical: `${BASE_URL}/pdf-to-jpg`,
    title: "PDF to JPG Extractor",
    subtitle: "Turn document pages into shareable image files.",
    paragraphs: [
      "Sometimes a PDF is too rigid for quick sharing on social media or in presentations. OptiPress allows you to burst any PDF into a series of high-quality JPG images. Each page of your document is rendered using our advanced vector engine to ensure that text remains legible and graphics stay sharp.",
      "Privacy is our priority. Most online 'PDF to JPG' tools upload your sensitive documents to a server, where they might be stored or analyzed. OptiPress performs the rendering locally using modern web technologies. Your document stays in your browser, and the images are generated on demand.",
      "If your PDF has multiple pages, OptiPress will automatically package the resulting images into a single ZIP file for easy downloading. This saves you the hassle of clicking 'Save' dozens of times. It's the fastest, most secure way to convert PDF contents into a visual format ready for any platform."
    ],
    faqs: [
      { question: "What is the resolution of the JPGs?", answer: "We render pages at 2x scale (approx 150-200 DPI equivalent) to balance file size and visual clarity." },
      { question: "Can I convert protected PDFs?", answer: "No, for security reasons, we do not support password-protected PDFs without the owner unlocking them first." }
    ]
  },
  "word-to-pdf": {
    metaTitle: "Convert Word to PDF Online - Preserve Layout | OptiPress",
    metaDesc: "Convert DOC and DOCX files to professional PDF documents. Maintain your styling and fonts with our secure client-side tool.",
    canonical: `${BASE_URL}/word-to-pdf`,
    title: "Word to PDF Pro",
    subtitle: "Turn your documents into universally compatible PDFs.",
    paragraphs: [
      "Microsoft Word is the standard for editing, but PDF is the standard for sharing. OptiPress bridges the gap with an easy-to-use Word to PDF converter. We aim to preserve your headings, tables, and formatting so the recipient sees exactly what you intended.",
      "Because document integrity matters, our engine analyzes the DOCX structure to rebuild it as a PDF. Note: For extremely complex layouts with custom fonts, we recommend using the 'Save as PDF' feature in Word itself for the highest fidelity. OptiPress is perfect for quick conversions when you don't have Word installed.",
      "As always, your document is never uploaded. We respect your confidentiality. Whether it's a resume, a contract, or a school paper, handle your conversion with OptiPress for peace of mind."
    ],
    faqs: [
      { question: "Does it support older .doc files?", answer: "We primarily support the modern .docx format, which is XML-based and more stable for web-based conversion." },
      { question: "Are fonts embedded?", answer: "We substitute standard fonts with web-safe equivalents to ensure the PDF looks consistent across all devices." }
    ]
  },
  "excel-to-pdf": {
    metaTitle: "Convert Excel to PDF Online - Clean Data Layouts | OptiPress",
    metaDesc: "Turn spreadsheets into readable PDF reports. Perfect for sharing financial statements and data tables securely.",
    canonical: `${BASE_URL}/excel-to-pdf`,
    title: "Excel to PDF Reporting",
    subtitle: "Transform raw data into professional PDF documents.",
    paragraphs: [
      "Sharing an Excel file can be risky—formulas can break, and data can be accidentally edited. Converting your spreadsheets to PDF ensures that your data remains fixed and professional. OptiPress helps you turn your XLS and XLSX files into print-ready PDF reports.",
      "Our tool handles grid layout and basic cell styling, making it ideal for invoices, data summaries, and charts. By converting locally, you ensure that your sensitive financial or business data never touches our servers.",
      "Tip: Ensure your Excel sheets are formatted with clear margins and headers for the best result. Our converter will attempt to fit your columns onto standard A4 or Letter sizes automatically."
    ],
    faqs: [
      { question: "Will my formulas be visible?", answer: "No, only the calculated values appearing in the cells will be converted to the PDF." },
      { question: "Can I convert large workbooks?", answer: "Yes, but we recommend optimizing sheet layouts first to avoid excessive page counts in the PDF." }
    ]
  },
  "ppt-to-pdf": {
    metaTitle: "Convert PowerPoint to PDF Online - Slides to Document | OptiPress",
    metaDesc: "Turn your presentations into shareable PDF handouts. High-fidelity slide conversion 100% locally.",
    canonical: `${BASE_URL}/ppt-to-pdf`,
    title: "PowerPoint to PDF Handouts",
    subtitle: "Share your slides without requiring presentation software.",
    paragraphs: [
      "PowerPoint files are great for presenting but can be bulky and hard to open on mobile devices. Converting your slides to PDF turns your pitch deck into a lightweight document that anyone can view. OptiPress makes this transition effortless.",
      "Each slide is converted into a full-size PDF page. This is the best way to share meeting notes, lecture slides, or portfolio decks without worrying about font discrepancies or missing assets on the recipient's end.",
      "Our PowerPoint to PDF tool is built for security-conscious professionals who need to share proprietary ideas without risking data leaks on cloud-based conversion platforms."
    ],
    faqs: [
      { question: "Will animations be preserved?", answer: "No, PDF is a static format. Animations and transitions will be removed, leaving the final 'static' version of each slide." },
      { question: "Can I print the resulting PDF?", answer: "Absolutely. The PDF will be high-resolution and perfectly sized for standard printing." }
    ]
  },
  "html-to-pdf": {
    metaTitle: "Convert HTML to PDF Online - Web to Print | OptiPress",
    metaDesc: "Turn web pages or HTML code into professional PDF documents. Preserve styles and layout with precision.",
    canonical: `${BASE_URL}/html-to-pdf`,
    title: "HTML to PDF Converter",
    subtitle: "Capture web content as a high-quality document.",
    paragraphs: [
      "Web content is transient, but PDFs are forever. Whether you are archiving a blog post, a receipt, or a documentation page, OptiPress allows you to capture HTML content as a PDF. Our engine tries to respect CSS layouts to give you a result that looks exactly like the source.",
      "For developers and researchers, this tool is invaluable for creating PDF mirrors of online environments. Since it's a browser-based tool, you can even convert code snippets or local HTML files that aren't yet live on the web.",
      "Privacy is baked in. Since your browser is already rendering the HTML, we simply capture that render state to generate the PDF. No external scraping bots or data-harvesting servers involved."
    ],
    faqs: [
      { question: "Does it support JavaScript-rendered content?", answer: "Yes, since the tool runs in your own browser, it can capture content that has been dynamically loaded by JS." },
      { question: "Can I convert full websites?", answer: "You can convert the currently loaded page or upload a local HTML file for conversion." }
    ]
  },
  "pdf-to-word": {
    metaTitle: "Convert PDF to Word Online - Document Reconstruction | OptiPress",
    metaDesc: "Convert PDF back to editable Word documents. Best-effort layout reconstruction 100% privately.",
    canonical: `${BASE_URL}/pdf-to-word`,
    title: "PDF to Word Converter",
    subtitle: "Make your PDF documents editable again.",
    paragraphs: [
      "Locked PDFs can be frustrating when you need to make quick edits. OptiPress uses smart text extraction to rebuild your PDF as a DOCX file. While layout reconstruction is complex, our engine prioritizes text flow and heading hierarchy.",
      "This tool is perfect for extracting content from legacy documents where the original Word file has been lost. We focus on recovering as much editable content as possible without sending your file to a server for heavy OCR.",
      "Security is paramount for legal and administrative documents. With OptiPress, your sensitive PDF never leaves your local environment during the reconstruction process."
    ],
    faqs: [
      { question: "Will the formatting be identical?", answer: "Document reconstruction from PDF to Word is a best-effort process. Simple documents convert beautifully; complex layouts might require some manual tweaks in Word." },
      { question: "Can it handle scanned images?", answer: "Currently, we focus on 'native' PDFs (text-based). Scanned PDFs that are just images will require OCR which is currently a Pro feature." }
    ]
  },
  "pdf-to-excel": {
    metaTitle: "Convert PDF to Excel Online - Data Extraction | OptiPress",
    metaDesc: "Extract tables from PDF to editable Excel spreadsheets. No more manual data entry. 100% Private.",
    canonical: `${BASE_URL}/pdf-to-excel`,
    title: "PDF to Excel Data Extractor",
    subtitle: "Turn static tables into dynamic spreadsheets.",
    paragraphs: [
      "Data locked in a PDF is hard to analyze. OptiPress helps you extract tabular data from PDF files directly into Excel worksheets. Our algorithm searches for row and column structures to accurately group your data.",
      "Perfect for financial analysts, researchers, and administrators who need to move data into spreadsheets for further calculation. Stop typing out numbers by hand and let OptiPress handle the heavy lifting safely in your browser.",
      "Because we handle the extraction locally, your proprietary data, budget sheets, and private lists remain 100% confidential. No server-side processing means zero risk of data harvesting."
    ],
    faqs: [
      { question: "Can it handle multiple tables?", answer: "Yes, our algorithm attempts to identify separate table regions on each page and output them into the same spreadsheet." },
      { question: "What if there are no tables?", answer: "If the PDF is mostly free-flowing text, the Excel output might be less structured. It works best on documents with clear grid-like data." }
    ]
  },
  "pdf-to-ppt": {
    metaTitle: "Convert PDF to PowerPoint Online - PDF to Slides | OptiPress",
    metaDesc: "Turn PDF pages into PowerPoint slides. Reconstruction for editable presentations 100% locally.",
    canonical: `${BASE_URL}/pdf-to-ppt`,
    title: "PDF to PowerPoint Rebuilder",
    subtitle: "Convert documents into presentation-ready slide decks.",
    paragraphs: [
      "If you have a document that needs to be presented, OptiPress can turn your PDF pages into PowerPoint slides. This allows you to add transitions and present your content in a native slide-show format.",
      "Each page is imported as a high-quality slide. This is ideal for portfolios, reports, and brief documents that you want to walk people through in a meeting environment.",
      "Privacy is built-in. Convert your confidential business proposals or internal decks without ever uploading them to a third-party server. Speed and security combined."
    ],
    faqs: [
      { question: "Is the text editable in PPT?", answer: "We import content as a mix of editable text blocks and high-res images to preserve the original look while allowing some changes." },
      { question: "Can I change slide dimensions?", answer: "The converter will match the slide size to the PDF page aspect ratio (usually 4:3 or 16:9)." }
    ]
  },
  "pdf-to-html": {
    metaTitle: "Convert PDF to HTML Online - Document to Web | OptiPress",
    metaDesc: "Turn PDF files into clean HTML code. Perfect for web archiving and digital displays. 100% Private.",
    canonical: `${BASE_URL}/pdf-to-html`,
    title: "PDF to HTML Web Converter",
    subtitle: "Convert static documents into responsive web content.",
    paragraphs: [
      "PDFs aren't always great for web accessibility or SEO. Converting your PDF to HTML makes the content readable by screen readers and indexable by search engines. OptiPress creates a clean HTML mirror of your document structure.",
      "This tool is essential for teams looking to publish reports or documentation online without forcing users to download large files. The HTML output is lightweight and fast-loading.",
      "Your documents stay private. By converting PDF to HTML locally in your browser, you bypass the privacy issues inherent in traditional cloud-based conversion tools. Fast, secure, and modern."
    ],
    faqs: [
      { question: "Will the HTML look exactly like the PDF?", answer: "We use a 'best-fit' rendering that prioritizes readability and standard web structures over exact pixel-positioning." },
      { question: "Is the CSS inline?", answer: "Yes, for maximum compatibility, styles are included directly so you can drop the HTML anywhere." }
    ]
  },
  "compress-image-to-100kb": {
    metaTitle: "Compress Image to 100KB Online – Free & Fast | OptiPress",
    metaDesc: "Need to shrink an image to 100KB for an online form? Our tool handles it in seconds with the perfect balance of size and quality.",
    canonical: `${BASE_URL}/compress-image-to-100kb`,
    title: "The Ultimate Tool to Compress Images to 100KB",
    subtitle: "Perfect for government portals, application forms, and fast web pages.",
    paragraphs: [
      "Optimizing images to a specific file size like 100KB is often a requirement for many online submission forms. OptiPress uses smart algorithms to calculate the best quality-to-size ratio that gets you as close as possible to your target without sacrificing visual integrity.",
      "Most government and academic portals have strict file size limits. Using our specialized 100KB optimizer, you can quickly resize and compress your documents, photos, and signatures to meet these requirements instantly."
    ],
    faqs: [
      { question: "How do I get an image exactly under 100KB?", answer: "Adjust the quality slider while looking at the 'Compressed Size' metric on our tool." },
      { question: "Will the image look blurry?", answer: "Our engine uses advanced resampling to maintain sharpness even at high compression levels." }
    ]
  },
  "png-to-webp": {
    metaTitle: "Convert PNG to WebP Online – Boost Your SEO | OptiPress",
    metaDesc: "Convert PNG files to WebP instantly. Reduce file size by up to 80% while keeping transparency. Optimize your SEO ranking.",
    canonical: `${BASE_URL}/png-to-webp`,
    title: "Convert PNG to WebP with Transparency",
    subtitle: "Unlock the power of Next-Gen image formats.",
    paragraphs: [
      "WebP is the modern standard for web imagery. By converting your bulky PNG files to WebP, you can drastically reduce page load times and improve your site's SEO rankings. WebP supports both lossy and lossless compression, as well as alpha channel transparency.",
      "OptiPress makes the conversion process seamless. Simply drop your PNG files, and our converter will handle the rest, preserving your transparency while slashing the file size by up to 80% on average."
    ],
    faqs: [
      { question: "Do all browsers support WebP?", answer: "Yes, all modern browsers including Chrome, Safari, Firefox, and Edge fully support WebP." },
      { question: "Does WebP support transparent backgrounds?", answer: "Yes, WebP is an excellent replacement for PNG for images with transparency." }
    ]
  }
};
