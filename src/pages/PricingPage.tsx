import React from "react";
import { Navbar, Footer } from "../components/Layout";
import { Check, Zap, Shield, Globe, Cpu } from "lucide-react";
import { motion } from "motion/react";
import { AdPlaceholder } from "../components/ToolComponents";
import { SEOTags } from "../components/SEOTags";
import { BASE_URL } from "../seo-config";

const PLANS = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for casual users and quick optimizations.",
    features: [
      "Unlimited Local Compression",
      "Batch Processing (up to 20 files)",
      "Zero-Upload Privacy",
      "Standard WebP/PNG formats",
      "Side-by-side Preview"
    ],
    cta: "Current Plan",
    highlighted: false
  },
  {
    name: "Pro",
    price: "$9",
    description: "For creators and developers who need more power.",
    features: [
      "AI-Enhanced Sharpness",
      "Batch Processing (Unlimited)",
      "Remove Watermarks (None exists)",
      "Advanced AVIF/SVG Support",
      "Custom Export Presets",
      "API Access (beta)"
    ],
    cta: "Upgrade to Pro",
    highlighted: true
  }
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-editorial-bg dark:bg-zinc-950 transition-colors duration-300">
      <SEOTags 
        title="Pricing – OptiPress Pro Optimization"
        description="Transparent pricing for OptiPress Pro. Higher batch limits, AI-enhanced sharpness, and developer features."
        canonical={`${BASE_URL}/pricing`}
      />
      <Navbar />
      
      <main className="mx-auto max-w-7xl px-6 py-16">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="serif text-4xl font-bold tracking-tight text-editorial-black dark:text-white sm:text-6xl mb-4"
          >
            Transparent <span className="italic">Pro-Grade</span> Tooling.
          </motion.h1>
          <p className="text-zinc-500 uppercase text-[10px] tracking-[0.3em] font-bold">
            All basic compression is free. Always.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {PLANS.map((plan, i) => (
            <motion.div 
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative border p-10 flex flex-col ${
                plan.highlighted 
                ? "bg-editorial-black text-white border-editorial-black dark:bg-white dark:text-editorial-black" 
                : "bg-white border-editorial-border dark:bg-zinc-900 dark:border-zinc-800"
              }`}
            >
              <div className="mb-8">
                <h3 className="serif text-2xl font-bold italic mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-bold tracking-tighter">{plan.price}</span>
                  <span className={`text-xs uppercase font-bold tracking-widest ${plan.highlighted ? "opacity-60" : "text-zinc-400"}`}>/ month</span>
                </div>
                <p className={`text-sm leading-relaxed ${plan.highlighted ? "opacity-80" : "text-zinc-500"}`}>
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-4 mb-10 flex-grow">
                {plan.features.map(feature => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className={`h-4 w-4 mt-0.5 shrink-0 ${plan.highlighted ? "text-emerald-400" : "text-emerald-600"}`} />
                    <span className="text-xs font-medium uppercase tracking-wide">{feature}</span>
                  </li>
                ))}
              </ul>

              <button className={`w-full py-4 text-[11px] font-bold uppercase tracking-[0.2em] transition-all active:scale-95 ${
                plan.highlighted 
                ? "bg-white text-editorial-black dark:bg-zinc-900 dark:text-white" 
                : "bg-editorial-black text-white dark:bg-white dark:text-editorial-black"
              }`}>
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>

        <div className="mt-24 max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 text-center border-t border-editorial-border pt-16 dark:border-zinc-800">
             <div>
               <div className="flex justify-center mb-4 text-editorial-black dark:text-white"><Shield className="h-6 w-6" /></div>
               <h4 className="text-[10px] font-bold uppercase tracking-widest mb-2 dark:text-white">Enterprise Security</h4>
               <p className="text-[11px] text-zinc-500 leading-relaxed">Private on-premise execution for highly sensitive imagery.</p>
             </div>
             <div>
               <div className="flex justify-center mb-4 text-editorial-black dark:text-white"><Globe className="h-6 w-6" /></div>
               <h4 className="text-[10px] font-bold uppercase tracking-widest mb-2 dark:text-white">Global CDN</h4>
               <p className="text-[11px] text-zinc-500 leading-relaxed">Instant edge delivery for optimized web assets.</p>
             </div>
             <div>
               <div className="flex justify-center mb-4 text-editorial-black dark:text-white"><Cpu className="h-6 w-6" /></div>
               <h4 className="text-[10px] font-bold uppercase tracking-widest mb-2 dark:text-white">API Integration</h4>
               <p className="text-[11px] text-zinc-500 leading-relaxed">Automated pipelines for massive high-volume catalogs.</p>
             </div>
          </div>
        </div>

        <AdPlaceholder position="bottom" />
      </main>

      <Footer />
    </div>
  );
}
