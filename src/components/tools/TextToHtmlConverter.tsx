import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { useToast } from '../ui/use-toast';
import { Copy, Code, FileText } from 'lucide-react';

export const TextToHtmlConverter = () => {
  const [textInput, setTextInput] = useState('');
  const [htmlInput, setHtmlInput] = useState('');
  const [encodedResult, setEncodedResult] = useState('');
  const [decodedResult, setDecodedResult] = useState('');
  const { toast } = useToast();

  const encodeToHtml = () => {
    if (!textInput.trim()) {
      toast({
        title: 'Erro',
        description: 'Por favor, digite algum texto para codificar.',
        variant: 'destructive',
      });
      return;
    }

    const htmlEntities: { [key: string]: string } = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      ' ': '&nbsp;',
      'á': '&aacute;',
      'à': '&agrave;',
      'ã': '&atilde;',
      'â': '&acirc;',
      'ä': '&auml;',
      'é': '&eacute;',
      'è': '&egrave;',
      'ê': '&ecirc;',
      'ë': '&euml;',
      'í': '&iacute;',
      'ì': '&igrave;',
      'î': '&icirc;',
      'ï': '&iuml;',
      'ó': '&oacute;',
      'ò': '&ograve;',
      'õ': '&otilde;',
      'ô': '&ocirc;',
      'ö': '&ouml;',
      'ú': '&uacute;',
      'ù': '&ugrave;',
      'û': '&ucirc;',
      'ü': '&uuml;',
      'ç': '&ccedil;',
      'ñ': '&ntilde;',
      'Á': '&Aacute;',
      'À': '&Agrave;',
      'Ã': '&Atilde;',
      'Â': '&Acirc;',
      'Ä': '&Auml;',
      'É': '&Eacute;',
      'È': '&Egrave;',
      'Ê': '&Ecirc;',
      'Ë': '&Euml;',
      'Í': '&Iacute;',
      'Ì': '&Igrave;',
      'Î': '&Icirc;',
      'Ï': '&Iuml;',
      'Ó': '&Oacute;',
      'Ò': '&Ograve;',
      'Õ': '&Otilde;',
      'Ô': '&Ocirc;',
      'Ö': '&Ouml;',
      'Ú': '&Uacute;',
      'Ù': '&Ugrave;',
      'Û': '&Ucirc;',
      'Ü': '&Uuml;',
      'Ç': '&Ccedil;',
      'Ñ': '&Ntilde;'
    };

    let encoded = textInput;
    for (const [char, entity] of Object.entries(htmlEntities)) {
      encoded = encoded.replace(new RegExp(char, 'g'), entity);
    }

    setEncodedResult(encoded);
  };

  const decodeFromHtml = () => {
    if (!htmlInput.trim()) {
      toast({
        title: 'Erro',
        description: 'Por favor, digite algum HTML para decodificar.',
        variant: 'destructive',
      });
      return;
    }

    const htmlEntities: { [key: string]: string } = {
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#39;': "'",
      '&nbsp;': ' ',
      '&aacute;': 'á',
      '&agrave;': 'à',
      '&atilde;': 'ã',
      '&acirc;': 'â',
      '&auml;': 'ä',
      '&eacute;': 'é',
      '&egrave;': 'è',
      '&ecirc;': 'ê',
      '&euml;': 'ë',
      '&iacute;': 'í',
      '&igrave;': 'ì',
      '&icirc;': 'î',
      '&iuml;': 'ï',
      '&oacute;': 'ó',
      '&ograve;': 'ò',
      '&otilde;': 'õ',
      '&ocirc;': 'ô',
      '&ouml;': 'ö',
      '&uacute;': 'ú',
      '&ugrave;': 'ù',
      '&ucirc;': 'û',
      '&uuml;': 'ü',
      '&ccedil;': 'ç',
      '&ntilde;': 'ñ',
      '&Aacute;': 'Á',
      '&Agrave;': 'À',
      '&Atilde;': 'Ã',
      '&Acirc;': 'Â',
      '&Auml;': 'Ä',
      '&Eacute;': 'É',
      '&Egrave;': 'È',
      '&Ecirc;': 'Ê',
      '&Euml;': 'Ë',
      '&Iacute;': 'Í',
      '&Igrave;': 'Ì',
      '&Icirc;': 'Î',
      '&Iuml;': 'Ï',
      '&Oacute;': 'Ó',
      '&Ograve;': 'Ò',
      '&Otilde;': 'Õ',
      '&Ocirc;': 'Ô',
      '&Ouml;': 'Ö',
      '&Uacute;': 'Ú',
      '&Ugrave;': 'Ù',
      '&Ucirc;': 'Û',
      '&Uuml;': 'Ü',
      '&Ccedil;': 'Ç',
      '&Ntilde;': 'Ñ'
    };

    let decoded = htmlInput;
    for (const [entity, char] of Object.entries(htmlEntities)) {
      decoded = decoded.replace(new RegExp(entity, 'g'), char);
    }

    setDecodedResult(decoded);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copiado!',
      description: 'Texto copiado para a área de transferência.',
    });
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Converter Texto para HTML
          </CardTitle>
          <p className="text-muted-foreground">
            Converter todos os caracteres especiais de um texto em entidades html.
            Exemplo: "Á" em entidade html fica Á
          </p>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Codificar Texto to HTML */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Codificar Texto to HTML</h3>
            <p className="text-sm text-muted-foreground">
              Digite a frase, depois clique em "Codificar" e confira o resultado abaixo do botão:
            </p>
            
            <div className="space-y-2">
              <Textarea
                placeholder="Digite o texto para codificar..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="min-h-32 bg-green-50 dark:bg-green-950/20"
              />
            </div>

            <Button onClick={encodeToHtml} className="bg-red-500 hover:bg-red-600 text-white">
              <Code className="h-4 w-4 mr-2" />
              Codificar
            </Button>

            {encodedResult && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Resultado codificado:</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(encodedResult)}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar
                  </Button>
                </div>
                <Textarea
                  value={encodedResult}
                  readOnly
                  className="min-h-32"
                />
              </div>
            )}
          </div>

          {/* Decodificar HTML to Texto */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Decodificar HTML to Texto</h3>
            <p className="text-sm text-muted-foreground">
              Digite a frase, depois clique em "Decodificar" e confira o resultado abaixo do botão:
            </p>
            
            <div className="space-y-2">
              <Textarea
                placeholder="Digite o HTML para decodificar..."
                value={htmlInput}
                onChange={(e) => setHtmlInput(e.target.value)}
                className="min-h-32 bg-green-50 dark:bg-green-950/20"
              />
            </div>

            <Button onClick={decodeFromHtml} className="bg-green-500 hover:bg-green-600 text-white">
              <FileText className="h-4 w-4 mr-2" />
              Decodificar
            </Button>

            {decodedResult && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Resultado decodificado:</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(decodedResult)}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar
                  </Button>
                </div>
                <Textarea
                  value={decodedResult}
                  readOnly
                  className="min-h-32"
                />
              </div>
            )}
          </div>

          <div className="flex items-center justify-center space-x-4 pt-4 border-t">
            <span className="text-sm text-muted-foreground">Esta ferramenta foi útil?</span>
            <Button variant="outline" size="sm">Sim</Button>
            <Button variant="outline" size="sm">Não</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};