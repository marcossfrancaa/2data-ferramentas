import ReactGA from 'react-ga4';

// ID do Google Analytics 4 - Configure com seu ID real
const GA_MEASUREMENT_ID = "G-2HQBK8YBQM"; // ID configurado para 2data.com.br

export const initGA = () => {
  if (typeof window !== 'undefined' && GA_MEASUREMENT_ID !== "G-XXXXXXXXXX") {
    ReactGA.initialize(GA_MEASUREMENT_ID, {
      debug: process.env.NODE_ENV === 'development',
      titleCase: false,
      gaOptions: {
        send_page_view: false // Controle manual do page view
      }
    });
    console.log('Google Analytics inicializado com ID:', GA_MEASUREMENT_ID);
  }
};

export const trackPageView = (path: string, title?: string) => {
  if (typeof window !== 'undefined') {
    ReactGA.send({ 
      hitType: "pageview", 
      page: path,
      title: title 
    });
  }
};

export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== 'undefined') {
    ReactGA.event({
      action,
      category,
      label,
      value
    });
  }
};

// Eventos específicos para ferramentas
export const trackToolUsage = (toolName: string, action: string = 'use') => {
  trackEvent(action, 'Tool Usage', toolName);
};

export const trackToolGeneration = (toolName: string, itemsGenerated?: number) => {
  trackEvent('generate', 'Tool Generation', toolName, itemsGenerated);
};

export const trackToolValidation = (toolName: string, isValid: boolean) => {
  trackEvent('validate', 'Tool Validation', toolName, isValid ? 1 : 0);
};

export const trackToolDownload = (toolName: string, fileType?: string) => {
  trackEvent('download', 'Tool Download', `${toolName}_${fileType || 'file'}`);
};

export const trackToolCopy = (toolName: string) => {
  trackEvent('copy', 'Tool Copy', toolName);
};

export const trackSearch = (query: string, resultsCount?: number) => {
  trackEvent('search', 'Site Search', query, resultsCount);
};

export const trackFavorite = (toolName: string, action: 'add' | 'remove') => {
  trackEvent(action, 'Favorites', toolName);
};

// Rastreamento de conversões e engajamento
export const trackConversion = (conversionType: string, value?: number) => {
  trackEvent('conversion', 'Conversions', conversionType, value);
};

export const trackEngagement = (action: string, element: string) => {
  trackEvent(action, 'Engagement', element);
};

// Rastreamento de erros
export const trackError = (errorType: string, errorMessage: string) => {
  trackEvent('error', 'Errors', `${errorType}: ${errorMessage}`);
};

// Rastreamento de performance
export const trackPerformance = (metric: string, value: number) => {
  trackEvent('performance', 'Performance', metric, value);
};