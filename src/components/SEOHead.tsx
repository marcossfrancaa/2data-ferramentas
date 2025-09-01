import { Helmet } from 'react-helmet-async';
import { GOOGLE_SITE_VERIFICATION, SEO_CONFIG } from '@/lib/searchConsole';

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  structuredData?: object;
}

export const SEOHead = ({ 
  title, 
  description, 
  keywords, 
  canonicalUrl,
  ogImage = "https://2data.com.br/favicon.png",
  structuredData 
}: SEOHeadProps) => {
  const fullTitle = title.includes('Site On Fire') ? title : `${title} | ${SEO_CONFIG.defaultTitle}`;
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords || SEO_CONFIG.defaultKeywords} />
      <meta name="author" content={SEO_CONFIG.author} />
      <meta name="language" content={SEO_CONFIG.language} />
      <meta name="robots" content={SEO_CONFIG.robots} />
      
      {/* Google Search Console Verification */}
      {GOOGLE_SITE_VERIFICATION !== 'your-google-site-verification-code' && (
        <meta name="google-site-verification" content={GOOGLE_SITE_VERIFICATION} />
      )}
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl || SEO_CONFIG.canonical} />
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonicalUrl || SEO_CONFIG.canonical} />
      <meta property="og:site_name" content="Site On Fire" />
      <meta property="og:locale" content="pt_BR" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:site" content="@siteonfire" />
      
      {/* Additional SEO Meta Tags */}
      <meta name="theme-color" content="#3b82f6" />
      <meta name="msapplication-TileColor" content="#3b82f6" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};