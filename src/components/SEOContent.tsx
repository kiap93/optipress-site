import React from "react";

export interface FAQItem {
  question: string;
  answer: string;
}

export interface SEOContentProps {
  title: string;
  subtitle: string;
  paragraphs: string[];
  faqs: FAQItem[];
}

export function SEOSection({ content }: { content: SEOContentProps }) {
  // Generate JSON-LD for FAQs
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": content.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <div className="py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="max-w-3xl">
        <h2 className="serif text-3xl font-bold tracking-tight text-editorial-black dark:text-white sm:text-4xl mb-6">
          {content.title}
        </h2>
        
        <p className="serif italic text-lg text-zinc-500 dark:text-zinc-400 mb-8 border-l-2 border-editorial-border pl-6">
          {content.subtitle}
        </p>

        <div className="space-y-6">
          {content.paragraphs.map((p, i) => (
            <p key={i} className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-sm">
              {p}
            </p>
          ))}
        </div>

        <div className="mt-20">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-zinc-400 mb-10 text-center">Frequently Asked Questions</h3>
          <div className="grid gap-6 md:grid-cols-2">
            {content.faqs.map((faq, i) => (
              <div key={i} className="border-t border-editorial-border pt-6 dark:border-zinc-800">
                <h4 className="serif text-lg font-bold text-editorial-black dark:text-white mb-3 italic">{faq.question}</h4>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
