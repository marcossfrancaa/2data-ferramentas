// Google Tag Manager Configuration

const GTM_ID = 'GTM-XXXXXXX'; // Substitua pelo seu ID do GTM

export const initGTM = () => {
  if (typeof window !== 'undefined' && GTM_ID !== 'GTM-XXXXXXX') {
    // GTM Script
    const gtmScript = document.createElement('script');
    gtmScript.innerHTML = `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${GTM_ID}');
    `;
    document.head.appendChild(gtmScript);

    // GTM NoScript (para ser adicionado no body)
    const gtmNoScript = document.createElement('noscript');
    gtmNoScript.innerHTML = `
      <iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}"
      height="0" width="0" style="display:none;visibility:hidden"></iframe>
    `;
    document.body.insertBefore(gtmNoScript, document.body.firstChild);

    console.log('Google Tag Manager inicializado com ID:', GTM_ID);
  }
};

// DataLayer push function
export const gtmPush = (data: Record<string, any>) => {
  if (typeof window !== 'undefined' && (window as any).dataLayer) {
    (window as any).dataLayer.push(data);
  }
};

// Eventos específicos para GTM
export const gtmTrackEvent = (event: string, data: Record<string, any> = {}) => {
  gtmPush({
    event,
    ...data
  });
};

export const gtmTrackPageView = (pagePath: string, pageTitle?: string) => {
  gtmPush({
    event: 'page_view',
    page_path: pagePath,
    page_title: pageTitle || document.title
  });
};

export const gtmTrackToolUsage = (toolName: string, action: string) => {
  gtmPush({
    event: 'tool_usage',
    tool_name: toolName,
    action: action,
    timestamp: new Date().toISOString()
  });
};

export const gtmTrackConversion = (conversionType: string, value?: number) => {
  gtmPush({
    event: 'conversion',
    conversion_type: conversionType,
    value: value || 0,
    currency: 'BRL'
  });
};

// Declare global dataLayer
declare global {
  interface Window {
    dataLayer: any[];
  }
}

// Initialize dataLayer if not exists
if (typeof window !== 'undefined') {
  window.dataLayer = window.dataLayer || [];
}