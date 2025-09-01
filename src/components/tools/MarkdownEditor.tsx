import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Copy, Eye, Edit, FileCode } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const MarkdownEditor = () => {
  const [markdown, setMarkdown] = useState(`# Bem-vindo ao Editor Markdown

Este é um **editor de Markdown** com preview em tempo real!

## Recursos Suportados

### Formatação de Texto
- **Texto em negrito**
- *Texto em itálico*
- ~~Texto riscado~~
- \`código inline\`

### Listas
1. Item numerado 1
2. Item numerado 2
3. Item numerado 3

- Item com marcador
- Outro item
  - Sub-item
  - Outro sub-item

### Links e Imagens
[Link para o Google](https://google.com)

### Código
\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

### Tabelas
| Coluna 1 | Coluna 2 | Coluna 3 |
|----------|----------|----------|
| Valor 1  | Valor 2  | Valor 3  |
| Valor A  | Valor B  | Valor C  |

### Citações
> Esta é uma citação em Markdown.
> Pode ter múltiplas linhas.

---

**Dica:** Use este editor para criar README.md, documentação ou qualquer conteúdo em Markdown!
`);
  const [htmlPreview, setHtmlPreview] = useState('');
  const { toast } = useToast();

  // Converter Markdown para HTML básico
  const convertMarkdownToHtml = (md: string) => {
    let html = md;
    
    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    
    // Bold
    html = html.replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>');
    
    // Italic
    html = html.replace(/\*(.*)\*/gim, '<em>$1</em>');
    
    // Strikethrough
    html = html.replace(/~~(.*)~~/gim, '<del>$1</del>');
    
    // Inline code
    html = html.replace(/`([^`]*)`/gim, '<code>$1</code>');
    
    // Code blocks
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/gim, (match, lang, code) => {
      return `<pre><code class="language-${lang || 'text'}">${code}</code></pre>`;
    });
    
    // Links
    html = html.replace(/\[([^\]]*)\]\(([^\)]*)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    
    // Horizontal rule
    html = html.replace(/^---$/gim, '<hr>');
    
    // Tables
    html = html.replace(/\|(.+)\|/gim, (match) => {
      const cells = match.split('|').filter(cell => cell.trim() !== '').map(cell => cell.trim());
      return '<tr>' + cells.map(cell => `<td>${cell}</td>`).join('') + '</tr>';
    });
    html = html.replace(/(<tr>.*<\/tr>)/gims, '<table border="1" style="border-collapse: collapse; width: 100%; margin: 10px 0;">$1</table>');
    
    // Blockquotes
    html = html.replace(/^> (.*)$/gim, '<blockquote>$1</blockquote>');
    
    // Ordered lists
    html = html.replace(/^\d+\. (.*)$/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/gims, '<ol>$1</ol>');
    
    // Unordered lists
    html = html.replace(/^[\-\*\+] (.*)$/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/gims, (match) => {
      if (!match.includes('<ol>')) {
        return '<ul>' + match + '</ul>';
      }
      return match;
    });
    
    // Line breaks
    html = html.replace(/\n/gim, '<br>');
    
    return html;
  };

  useEffect(() => {
    const html = convertMarkdownToHtml(markdown);
    setHtmlPreview(html);
  }, [markdown]);

  const downloadMarkdown = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `documento-${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Markdown baixado!",
      description: "Seu arquivo .md foi salvo com sucesso.",
    });
  };

  const downloadHtml = () => {
    const fullHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Documento Markdown</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
        h1, h2, h3 { color: #333; }
        code { background: #f4f4f4; padding: 2px 4px; border-radius: 3px; }
        pre { background: #f4f4f4; padding: 10px; border-radius: 5px; overflow-x: auto; }
        blockquote { border-left: 4px solid #ddd; margin: 0; padding-left: 20px; color: #666; }
        table { border-collapse: collapse; width: 100%; margin: 10px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f4f4f4; }
    </style>
</head>
<body>
    ${htmlPreview}
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `documento-${new Date().toISOString().split('T')[0]}.html`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "HTML baixado!",
      description: "Seu arquivo .html foi salvo com sucesso.",
    });
  };

  const copyMarkdown = () => {
    navigator.clipboard.writeText(markdown);
    toast({
      title: "Copiado!",
      description: "Markdown copiado para a área de transferência.",
    });
  };

  const copyHtml = () => {
    navigator.clipboard.writeText(htmlPreview);
    toast({
      title: "HTML copiado!",
      description: "HTML copiado para a área de transferência.",
    });
  };

  const loadTemplate = (template: string) => {
    const templates = {
      readme: `# Nome do Projeto

## Descrição
Breve descrição do que o projeto faz.

## Instalação
\`\`\`bash
npm install projeto
\`\`\`

## Uso
\`\`\`javascript
const projeto = require('projeto');
projeto.executar();
\`\`\`

## Contribuição
1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## Licença
MIT`,
      
      documentation: `# Documentação da API

## Visão Geral
Esta documentação descreve como usar nossa API.

## Autenticação
Use uma chave API no header:
\`\`\`
Authorization: Bearer SUA_CHAVE_API
\`\`\`

## Endpoints

### GET /usuarios
Lista todos os usuários.

**Resposta:**
\`\`\`json
{
  "usuarios": [
    {
      "id": 1,
      "nome": "João",
      "email": "joao@email.com"
    }
  ]
}
\`\`\`

### POST /usuarios
Cria um novo usuário.

**Parâmetros:**
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| nome  | string | Sim | Nome do usuário |
| email | string | Sim | Email do usuário |`,
      
      article: `# Título do Artigo

*Publicado em ${new Date().toLocaleDateString('pt-BR')}*

## Introdução
Esta é a introdução do seu artigo...

## Desenvolvimento
Aqui você desenvolve suas ideias principais...

### Subtópico 1
Conteúdo do primeiro subtópico.

### Subtópico 2
Conteúdo do segundo subtópico.

## Conclusão
Suas considerações finais...

---
*Artigo escrito com o Editor Markdown do 2Data Brasil*`
    };
    
    setMarkdown(templates[template as keyof typeof templates]);
    toast({
      title: "Template carregado!",
      description: "Template foi carregado no editor.",
    });
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <FileCode className="w-6 h-6" />
            Markdown Editor com Preview
          </CardTitle>
          <CardDescription className="text-center">
            Editor de Markdown com visualização em tempo real - ideal para README.md e documentação
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Barra de ferramentas */}
          <div className="flex flex-wrap gap-2 p-3 bg-muted/30 rounded-lg">
            <div className="flex gap-2">
              <Button onClick={() => loadTemplate('readme')} variant="outline" size="sm">
                README.md
              </Button>
              <Button onClick={() => loadTemplate('documentation')} variant="outline" size="sm">
                Documentação
              </Button>
              <Button onClick={() => loadTemplate('article')} variant="outline" size="sm">
                Artigo
              </Button>
            </div>
            <div className="flex gap-2 ml-auto">
              <Button onClick={copyMarkdown} variant="outline" size="sm">
                <Copy className="w-3 h-3 mr-1" />
                Copiar MD
              </Button>
              <Button onClick={copyHtml} variant="outline" size="sm">
                <Copy className="w-3 h-3 mr-1" />
                Copiar HTML
              </Button>
              <Button onClick={downloadMarkdown} variant="outline" size="sm">
                <Download className="w-3 h-3 mr-1" />
                .md
              </Button>
              <Button onClick={downloadHtml} variant="outline" size="sm">
                <Download className="w-3 h-3 mr-1" />
                .html
              </Button>
            </div>
          </div>

          {/* Editor e Preview */}
          <Tabs defaultValue="split" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="edit" className="flex items-center gap-2">
                <Edit className="w-4 h-4" />
                Editor
              </TabsTrigger>
              <TabsTrigger value="split" className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Split View
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Preview
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="edit" className="space-y-4">
              <Textarea
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                placeholder="Digite seu Markdown aqui..."
                className="min-h-[500px] font-mono text-sm"
              />
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>{markdown.length} caracteres • {markdown.split('\n').length} linhas</span>
                <Badge variant="outline">Markdown</Badge>
              </div>
            </TabsContent>
            
            <TabsContent value="split" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold">Editor</h3>
                    <Badge variant="outline" className="text-xs">Markdown</Badge>
                  </div>
                  <Textarea
                    value={markdown}
                    onChange={(e) => setMarkdown(e.target.value)}
                    placeholder="Digite seu Markdown aqui..."
                    className="min-h-[500px] font-mono text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold">Preview</h3>
                    <Badge variant="secondary" className="text-xs">HTML</Badge>
                  </div>
                  <div 
                    className="min-h-[500px] p-4 border rounded-md bg-background prose prose-sm max-w-none overflow-auto"
                    dangerouslySetInnerHTML={{ __html: htmlPreview }}
                    style={{
                      lineHeight: '1.6',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
                    }}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="preview" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Preview</h3>
                <Badge variant="secondary" className="text-xs">HTML</Badge>
              </div>
              <div 
                className="min-h-[500px] p-6 border rounded-md bg-background prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: htmlPreview }}
                style={{
                  lineHeight: '1.6',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
                }}
              />
            </TabsContent>
          </Tabs>

          <div className="text-xs text-muted-foreground space-y-1 pt-4 border-t">
            <p>💡 <strong>Recursos suportados:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Headers (# ## ###), texto em **negrito** e *itálico*</li>
              <li>Listas numeradas e com marcadores</li>
              <li>Links [texto](url) e código `inline` e ```blocos```</li>
              <li>Tabelas, citações {'>'} e linhas horizontais ---</li>
              <li>Templates prontos para README, documentação e artigos</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};