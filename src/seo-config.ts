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
