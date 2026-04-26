import React from "react";
import { Helmet } from "react-helmet-async";
import { BASE_URL } from "../seo-config";

interface SEOTagsProps {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
  ogType?: string;
  structuredData?: any[];
}

export function SEOTags({ 
  title, 
  description, 
  canonical, 
  ogImage = "https://optipress.ai/logo.png",
  ogType = "website",
  structuredData = []
}: SEOTagsProps) {
  const fullTitle = title.includes("OptiPress") ? title : `${title} | OptiPress`;
  
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Optipress",
    "url": "https://optipress.ai",
    "logo": "https://optipress.ai/logo.png"
  };

  const allStructuredData = [organizationData, ...structuredData];

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonical} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Structured Data */}
      {allStructuredData.map((data, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(data)}
        </script>
      ))}
    </Helmet>
  );
}
