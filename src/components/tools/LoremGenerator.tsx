import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Copy, FileText, RefreshCw, ChevronDown, Languages } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { faker } from '@faker-js/faker';

export const LoremGenerator = () => {
  const [generatedText, setGeneratedText] = useState('');
  const [count, setCount] = useState('1');
  const [type, setType] = useState('paragraphs');
  const [language, setLanguage] = useState('latin');
  const [useHtml, setUseHtml] = useState(false);
  const [alwaysStartWithLorem, setAlwaysStartWithLorem] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const { toast } = useToast();

  const loremWords = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
    'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
    'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
    'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
    'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
    'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
    'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
    'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
  ];

  // Portuguese text generator function using faker
  const generatePortugueseText = (type: string, count: number) => {
    switch (type) {
      case 'words':
        return faker.lorem.words(count);
      case 'sentences':
        const sentences = [];
        for (let i = 0; i < count; i++) {
          sentences.push(faker.lorem.sentence());
        }
        return sentences.join(' ');
      case 'paragraphs':
        const paragraphs = [];
        for (let i = 0; i < count; i++) {
          paragraphs.push(faker.lorem.paragraph());
        }
        return paragraphs.join('\n\n');
      default:
        return faker.lorem.paragraph();
    }
  };

  // Auto-generate on component mount and when parameters change
  useEffect(() => {
    generateLorem();
  }, [count, type, language, useHtml, alwaysStartWithLorem]);

  // Update counters when text changes
  useEffect(() => {
    if (generatedText) {
      const words = generatedText.trim().split(/\s+/).length;
      const chars = generatedText.length;
      setWordCount(words);
      setCharCount(chars);
    } else {
      setWordCount(0);
      setCharCount(0);
    }
  }, [generatedText]);

  const generateWords = (wordCount: number) => {
    if (language === 'portuguese') {
      return faker.lorem.words(wordCount);
    }
    
    const words = [];
    for (let i = 0; i < wordCount; i++) {
      words.push(loremWords[Math.floor(Math.random() * loremWords.length)]);
    }
    return words.join(' ');
  };

  const generateSentence = () => {
    if (language === 'portuguese') {
      return faker.lorem.sentence();
    }
    
    const wordCount = Math.floor(Math.random() * 10) + 5; // 5-15 words
    let words = generateWords(wordCount);
    
    if (alwaysStartWithLorem && words.toLowerCase().indexOf('lorem') === -1) {
      words = 'lorem ipsum ' + words;
    }
    
    return words.charAt(0).toUpperCase() + words.slice(1) + '.';
  };

  const generateParagraph = () => {
    if (language === 'portuguese') {
      return faker.lorem.paragraph();
    }
    
    const sentenceCount = Math.floor(Math.random() * 5) + 3; // 3-8 sentences
    const sentences = [];
    for (let i = 0; i < sentenceCount; i++) {
      sentences.push(generateSentence());
    }
    let paragraph = sentences.join(' ');
    
    if (alwaysStartWithLorem && paragraph.toLowerCase().indexOf('lorem ipsum') === -1) {
      paragraph = 'Lorem ipsum dolor sit amet, ' + paragraph.toLowerCase();
    }
    
    return paragraph;
  };

  const generateLorem = () => {
    const num = parseInt(count);
    if (isNaN(num) || num < 1) {
      toast({
        title: "Erro",
        description: "Digite um número válido maior que 0",
        variant: "destructive",
      });
      return;
    }

    let result = '';

    // Use Portuguese generator if Portuguese is selected
    if (language === 'portuguese') {
      result = generatePortugueseText(type, num);
    } else {
      // Original Latin Lorem Ipsum logic
      switch (type) {
        case 'words':
          result = generateWords(num);
          break;
        case 'sentences':
          const sentences = [];
          for (let i = 0; i < num; i++) {
            sentences.push(generateSentence());
          }
          result = sentences.join(' ');
          break;
        case 'paragraphs':
          const paragraphs = [];
          for (let i = 0; i < num; i++) {
            paragraphs.push(generateParagraph());
          }
          result = paragraphs.join('\n\n');
          break;
        default:
          result = generateParagraph();
      }
    }

    // Apply HTML formatting if enabled
    if (useHtml) {
      if (type === 'paragraphs') {
        result = result.split('\n\n').map(p => `<p>${p}</p>`).join('\n');
      } else if (type === 'sentences') {
        const sentenceArray = result.split('. ').filter(s => s.trim());
        result = '<ul>\n' + sentenceArray.map(s => `  <li>${s}${s.endsWith('.') ? '' : '.'}</li>`).join('\n') + '\n</ul>';
      } else if (type === 'words') {
        const wordArray = result.split(' ');
        result = '<ul>\n' + wordArray.map(w => `  <li>${w}</li>`).join('\n') + '\n</ul>';
      }
    }

    setGeneratedText(result);
  };

  const copyToClipboard = async () => {
    if (!generatedText) return;
    
    try {
      await navigator.clipboard.writeText(generatedText);
      toast({
        title: "Copiado!",
        description: "Texto Lorem Ipsum copiado para a área de transferência",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar o texto",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-card-foreground">Gerador Lorem Ipsum</h1>
        </div>
        <p className="text-muted-foreground">
          Gera texto placeholder Lorem Ipsum para uso em layouts, mockups e desenvolvimento.
        </p>
      </div>

      <Card className="p-6 mb-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">
          Configurações
        </h3>
        
        {/* Language selector */}
        <div className="mb-6">
          <Label className="text-sm font-medium text-card-foreground mb-3 flex items-center gap-2">
            <Languages className="w-4 h-4" />
            Idioma do Texto
          </Label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latin">Lorem Ipsum (Latim)</SelectItem>
              <SelectItem value="portuguese">Texto Aleatório (PT-BR)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <Label className="text-sm font-medium text-card-foreground mb-2">
              Quantidade
            </Label>
            <Input
              type="number"
              value={count}
              onChange={(e) => setCount(e.target.value)}
              min="1"
              max="100"
              placeholder="1"
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-card-foreground mb-2">
              Tipo
            </Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="words">Palavras</SelectItem>
                <SelectItem value="sentences">Frases</SelectItem>
                <SelectItem value="paragraphs">Parágrafos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button
              onClick={generateLorem}
              className="w-full"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Gerar Novamente
            </Button>
          </div>
        </div>

        {/* Advanced Options */}
        <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full">
              <ChevronDown className={`w-4 h-4 mr-2 transition-transform ${advancedOpen ? 'rotate-180' : ''}`} />
              Opções Avançadas
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4 space-y-4 p-4 border rounded-lg bg-accent/5">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="html-tags" 
                checked={useHtml}
                onCheckedChange={(checked) => setUseHtml(checked === true)}
              />
              <Label htmlFor="html-tags" className="text-sm">
                Gerar com tags HTML
              </Label>
            </div>
            
            {language === 'latin' && (
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="always-lorem" 
                  checked={alwaysStartWithLorem}
                  onCheckedChange={(checked) => setAlwaysStartWithLorem(checked === true)}
                />
                <Label htmlFor="always-lorem" className="text-sm">
                  Sempre começar com "Lorem ipsum..."
                </Label>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-card-foreground">
            Texto Lorem Ipsum
          </h3>
          {generatedText && (
            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
            >
              <Copy className="w-4 h-4 mr-2" />
              Copiar
            </Button>
          )}
        </div>
        
        <Textarea
          value={generatedText}
          readOnly
          placeholder="Texto Lorem Ipsum aparecerá aqui após gerar..."
          className="min-h-64 text-sm"
        />
        
        {generatedText && (
          <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
            <span>Palavras: <strong className="text-card-foreground">{wordCount}</strong></span>
            <span>Caracteres: <strong className="text-card-foreground">{charCount}</strong></span>
          </div>
        )}
      </Card>

      <Card className="mt-6 p-4 bg-accent/5 border-accent/20">
        <div className="flex items-start gap-3">
          <FileText className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <h4 className="font-semibold text-card-foreground mb-1">Sobre Lorem Ipsum</h4>
            <p className="text-muted-foreground">
              Lorem Ipsum é um texto placeholder padrão usado na indústria gráfica desde os anos 1500. 
              É útil para focar no design sem se distrair com o conteúdo real.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};