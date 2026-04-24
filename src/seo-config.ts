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
