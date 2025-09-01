import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Monitor, Code, Eye, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const WebPlayground = () => {
  const [html, setHtml] = useState(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Web Playground</title>
</head>
<body>
    <h1>Hello World!</h1>
    <p>Welcome to the Web Playground</p>
</body>
</html>`);
  
  const [css, setCss] = useState(`body {
  font-family: Arial, sans-serif;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  min-height: 100vh;
  margin: 0;
}

h1 {
  color: #fff;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}`);
  
  const [js, setJs] = useState(`console.log("Hello from Web Playground!");

// Add some interactivity
document.addEventListener('DOMContentLoaded', function() {
    const h1 = document.querySelector('h1');
    if (h1) {
        h1.addEventListener('click', function() {
            this.style.color = this.style.color === 'yellow' ? 'white' : 'yellow';
        });
    }
});`);
  
  const [activeTab, setActiveTab] = useState('separate');
  const [combinedCode, setCombinedCode] = useState('');
  const { toast } = useToast();

  const generatePreview = () => {
    let finalHtml = html;

    // Se tem CSS, adiciona no head
    if (css.trim()) {
      const cssTag = `<style>${css}</style>`;
      if (finalHtml.includes('</head>')) {
        finalHtml = finalHtml.replace('</head>', `${cssTag}\n</head>`);
      } else {
        finalHtml = `<style>${css}</style>\n${finalHtml}`;
      }
    }

    // Se tem JS, adiciona antes do </body>
    if (js.trim()) {
      const jsTag = `<script>${js}</script>`;
      if (finalHtml.includes('</body>')) {
        finalHtml = finalHtml.replace('</body>', `${jsTag}\n</body>`);
      } else {
        finalHtml = `${finalHtml}\n<script>${js}</script>`;
      }
    }

    return finalHtml;
  };

  const parseCombinedCode = (code: string) => {
    let htmlContent = '';
    let cssContent = '';
    let jsContent = '';

    // Extrai CSS entre <style> tags
    const cssMatch = code.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
    if (cssMatch) {
      cssContent = cssMatch[1].trim();
      code = code.replace(cssMatch[0], '');
    }

    // Extrai JS entre <script> tags
    const jsMatch = code.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
    if (jsMatch) {
      jsContent = jsMatch[1].trim();
      code = code.replace(jsMatch[0], '');
    }

    // O resto é HTML
    htmlContent = code.trim();

    return { htmlContent, cssContent, jsContent };
  };

  const applyCombinedCode = () => {
    const { htmlContent, cssContent, jsContent } = parseCombinedCode(combinedCode);
    setHtml(htmlContent);
    setCss(cssContent);
    setJs(jsContent);
    
    toast({
      title: "Código aplicado",
      description: "O código foi separado em HTML, CSS e JavaScript",
    });
  };

  const resetCode = () => {
    setHtml(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Web Playground</title>
</head>
<body>
    <h1>Hello World!</h1>
    <p>Welcome to the Web Playground</p>
</body>
</html>`);
    setCss(`body {
  font-family: Arial, sans-serif;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  min-height: 100vh;
  margin: 0;
}

h1 {
  color: #fff;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}`);
    setJs(`console.log("Hello from Web Playground!");

// Add some interactivity
document.addEventListener('DOMContentLoaded', function() {
    const h1 = document.querySelector('h1');
    if (h1) {
        h1.addEventListener('click', function() {
            this.style.color = this.style.color === 'yellow' ? 'white' : 'yellow';
        });
    }
});`);
    setCombinedCode('');
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Monitor className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-card-foreground">Playground Web</h1>
        </div>
        <p className="text-muted-foreground">
          Editor de código HTML, CSS e JavaScript online com preview em tempo real. 
          Teste e desenvolva seus projetos web diretamente no navegador.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor */}
        <div className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-card-foreground flex items-center gap-2">
                <Code className="w-5 h-5" />
                Editor de Código
              </h3>
              <Button variant="outline" size="sm" onClick={resetCode}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="separate">Separado</TabsTrigger>
                <TabsTrigger value="combined">Código Único</TabsTrigger>
              </TabsList>

              <TabsContent value="separate" className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-card-foreground mb-2 block">
                    HTML
                  </label>
                  <Textarea
                    value={html}
                    onChange={(e) => setHtml(e.target.value)}
                    className="min-h-32 font-mono text-sm"
                    placeholder="Cole seu HTML aqui..."
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-card-foreground mb-2 block">
                    CSS
                  </label>
                  <Textarea
                    value={css}
                    onChange={(e) => setCss(e.target.value)}
                    className="min-h-32 font-mono text-sm"
                    placeholder="Cole seu CSS aqui..."
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-card-foreground mb-2 block">
                    JavaScript
                  </label>
                  <Textarea
                    value={js}
                    onChange={(e) => setJs(e.target.value)}
                    className="min-h-32 font-mono text-sm"
                    placeholder="Cole seu JavaScript aqui..."
                  />
                </div>
              </TabsContent>

              <TabsContent value="combined" className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-card-foreground mb-2 block">
                    Código HTML Completo
                  </label>
                  <Textarea
                    value={combinedCode}
                    onChange={(e) => setCombinedCode(e.target.value)}
                    className="min-h-96 font-mono text-sm"
                    placeholder="Cole seu código HTML completo com CSS e JavaScript inclusos..."
                  />
                  <Button 
                    onClick={applyCombinedCode}
                    className="mt-2 w-full"
                    disabled={!combinedCode.trim()}
                  >
                    Aplicar Código
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        {/* Preview */}
        <div className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Eye className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-semibold text-card-foreground">Preview</h3>
            </div>
            
            <div className="border border-border rounded-lg overflow-hidden bg-white">
              <iframe
                srcDoc={generatePreview()}
                title="preview"
                className="w-full h-96 border-0"
                sandbox="allow-scripts"
              />
            </div>
          </Card>
        </div>
      </div>

      <Card className="mt-6 p-4 bg-accent/5 border-accent/20">
        <div className="flex items-start gap-3">
          <Monitor className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <h4 className="font-semibold text-card-foreground mb-1">Dicas de Uso</h4>
            <ul className="text-muted-foreground space-y-1">
              <li>• Use a aba "Separado" para editar HTML, CSS e JavaScript em campos diferentes</li>
              <li>• Use a aba "Código Único" para colar um arquivo HTML completo</li>
              <li>• O preview é atualizado automaticamente conforme você digita</li>
              <li>• Clique no título "Hello World!" no preview para ver o JavaScript em ação</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};