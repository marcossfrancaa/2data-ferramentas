// Google Search Console Configuration

// Meta tag de verificação do Google Search Console
// Substitua pelo seu código de verificação real
export const GOOGLE_SITE_VERIFICATION = 'your-google-site-verification-code';

// Função para adicionar meta tag de verificação
export const addGoogleSiteVerification = () => {
  if (typeof window !== 'undefined' && GOOGLE_SITE_VERIFICATION !== 'your-google-site-verification-code') {
    // Verificar se a meta tag já existe
    const existingTag = document.querySelector('meta[name="google-site-verification"]');
    
    if (!existingTag) {
      const metaTag = document.createElement('meta');
      metaTag.name = 'google-site-verification';
      metaTag.content = GOOGLE_SITE_VERIFICATION;
      document.head.appendChild(metaTag);
      console.log('Google Site Verification meta tag adicionada');
    }
  }
};

// Configurações do sitemap para Search Console
export const SITEMAP_CONFIG = {
  sitemapUrl: 'https://2data.com.br/sitemap.xml',
  robotsUrl: 'https://2data.com.br/robots.txt',
  domain: '2data.com.br',
  protocol: 'https'
};

// Função para submeter sitemap programaticamente (via API)
export const submitSitemapToGoogle = async () => {
  try {
    // Esta função seria usada com a API do Google Search Console
    // Requer autenticação OAuth2 e configuração de API
    console.log('Para submeter o sitemap, acesse:');
    console.log('https://search.google.com/search-console');
    console.log('E adicione:', SITEMAP_CONFIG.sitemapUrl);
    
    return {
      success: true,
      message: 'Instruções para submissão do sitemap exibidas no console'
    };
  } catch (error) {
    console.error('Erro ao submeter sitemap:', error);
    return {
      success: false,
      message: 'Erro ao submeter sitemap'
    };
  }
};

// Função para gerar dados estruturados (Schema.org)
export const generateStructuredData = (pageType: string, data: any) => {
  const baseStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Site On Fire - Ferramentas Online',
    description: 'Mais de 180 ferramentas online gratuitas para desenvolvedores, designers e profissionais.',
    url: 'https://2data.com.br',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://2data.com.br/?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };

  switch (pageType) {
    case 'tool':
      return {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: data.name,
        description: data.description,
        url: data.url,
        applicationCategory: 'WebApplication',
        operatingSystem: 'Web Browser',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'BRL'
        }
      };
    
    case 'homepage':
      return {
        ...baseStructuredData,
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: data.toolCount || 180,
          itemListElement: data.tools?.map((tool: any, index: number) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
              '@type': 'SoftwareApplication',
              name: tool.name,
              url: tool.url
            }
          })) || []
        }
      };
    
    default:
      return baseStructuredData;
  }
};

// Função para adicionar dados estruturados à página
export const addStructuredData = (structuredData: any) => {
  if (typeof window !== 'undefined') {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
  }
};

// Configurações de SEO para Search Console
export const SEO_CONFIG = {
  defaultTitle: 'Site On Fire - Ferramentas Online Gratuitas',
  defaultDescription: 'Mais de 180 ferramentas online gratuitas para desenvolvedores, designers e profissionais. Geradores, validadores, calculadoras e muito mais.',
  defaultKeywords: 'ferramentas online, geradores, validadores, calculadoras, desenvolvimento web, design, SEO',
  author: 'Site On Fire',
  language: 'pt-BR',
  region: 'BR',
  robots: 'index, follow',
  canonical: 'https://2data.com.br'
};

// Função para otimizar meta tags para SEO
export const optimizeMetaTags = (pageData: {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
}) => {
  if (typeof window !== 'undefined') {
    // Title
    if (pageData.title) {
      document.title = `${pageData.title} | ${SEO_CONFIG.defaultTitle}`;
    }
    
    // Meta description
    const metaDescription = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    if (metaDescription) {
      metaDescription.content = pageData.description || SEO_CONFIG.defaultDescription;
    }
    
    // Meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]') as HTMLMetaElement;
    if (metaKeywords) {
      metaKeywords.content = pageData.keywords || SEO_CONFIG.defaultKeywords;
    }
    
    // Canonical URL
    const canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (canonicalLink) {
      canonicalLink.href = pageData.canonical || SEO_CONFIG.canonical;
    }
  }
};