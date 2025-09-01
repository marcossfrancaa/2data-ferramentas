import { getToolSEO, generateStructuredData, generateFAQStructuredData } from '@/lib/seoData';
import { AdSenseAd } from './AdSenseAd';

interface ToolContentProps {
  toolId: string;
  toolName: string;
  toolDescription: string;
  children: React.ReactNode;
}

export const ToolContent = ({ toolId, toolName, toolDescription, children }: ToolContentProps) => {
  const seoData = getToolSEO(toolId);
  
  if (!seoData) {
    return <>{children}</>;
  }

  const structuredData = generateStructuredData(toolId, toolName, toolDescription);
  const faqStructuredData = generateFAQStructuredData(seoData.content.faq);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([structuredData, faqStructuredData])
        }}
      />
      
      <div className="max-w-4xl mx-auto">
        {/* Ferramenta Principal */}
        <div className="mb-8">
          {children}
        </div>

        {/* Anúncio após a ferramenta */}
        <div className="mb-8">
          <AdSenseAd 
            adSlot="1234567890" 
            adFormat="rectangle"
            className="flex justify-center"
          />
        </div>

        {/* Conteúdo SEO */}
        <div className="bg-card rounded-lg p-6 mb-8">
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <h1 className="text-3xl font-bold mb-4">{seoData.content.title}</h1>
            
            <p className="text-lg text-muted-foreground mb-6">
              {seoData.content.introduction}
            </p>

            <h2 className="text-2xl font-semibold mb-4">Como Usar</h2>
            <p className="mb-6">{seoData.content.howToUse}</p>

            <h2 className="text-2xl font-semibold mb-4">Principais Recursos</h2>
            <ul className="list-disc list-inside mb-8 space-y-2">
              {seoData.content.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>

            <h2 className="text-2xl font-semibold mb-4">Perguntas Frequentes</h2>
            <div className="space-y-6">
              {seoData.content.faq.map((faq, index) => (
                <div key={index}>
                  <h3 className="text-lg font-medium mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Anúncio no final da página */}
        <div className="mb-8">
          <AdSenseAd 
            adSlot="0987654321" 
            adFormat="horizontal"
            className="flex justify-center"
          />
        </div>
      </div>
    </>
  );
};