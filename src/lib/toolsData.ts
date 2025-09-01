// Lista organizada por categoria - fonte única da verdade para ferramentas
export interface Tool {
  id: string;
  name: string;
  description: string;
}

export const toolsByCategory = {
  'GERADORES': [
    { id: 'password-generator', name: 'Gerador de Senhas', description: 'Gere senhas seguras e personalizáveis' },
    { id: 'qr-generator', name: 'Gerador QR Code', description: 'Crie códigos QR para qualquer texto ou URL' },
    { id: 'hash-generator', name: 'Gerador Hash', description: 'Gere hashes MD5, SHA1, SHA256 e outros' },
    { id: 'cpf-generator', name: 'Gerador CPF', description: 'CPFs válidos para teste' },
    { id: 'cnpj-generator', name: 'Gerador CNPJ', description: 'CNPJs válidos para teste' },
    { id: 'uuid-generator', name: 'Gerador UUID', description: 'Gere identificadores únicos universais' },
    { id: 'pix-generator', name: 'Gerador PIX', description: 'Crie códigos PIX para pagamentos' },
    { id: 'names-generator', name: 'Gerador de Nomes', description: 'Nomes aleatórios brasileiros' },
    { id: 'nick-generator', name: 'Gerador de Nicks', description: 'Nicknames criativos para jogos' },
    { id: 'random-number-generator', name: 'Números Aleatórios', description: 'Gere números aleatórios personalizados' },
    { id: 'email-generator', name: 'Gerador de E-mail', description: 'E-mails temporários para teste' },
    { id: 'temporary-email', name: 'E-mail Temporário', description: 'E-mail descartável com GuerrillaMail' },
    { id: 'credit-card-generator', name: 'Gerador de Cartão', description: 'Cartões válidos para teste' },
    { id: 'lorem-generator', name: 'Lorem Ipsum', description: 'Texto de preenchimento para design' },
    { id: 'cron-generator', name: 'Gerador CRON', description: 'Expressões CRON para agendamento' },
    { id: 'cnh-generator', name: 'Gerador CNH', description: 'CNHs válidas para teste' },
    { id: 'rg-generator', name: 'Gerador RG', description: 'RGs válidos para teste' },
    { id: 'favicon-generator', name: 'Gerador Favicon', description: 'Crie favicons para seu site' },
    { id: 'json-generator', name: 'Gerador JSON', description: 'Gere estruturas JSON válidas' },
    { id: 'pis-generator', name: 'Gerador PIS/PASEP', description: 'PIS/PASEP válidos para teste' },
    { id: 'vehicle-generator', name: 'Gerador de Veículos', description: 'Dados completos de veículos' },
    { id: 'license-plate-generator', name: 'Placas de Veículos', description: 'Placas brasileiras válidas' },
    { id: 'whatsapp-generator', name: 'Link WhatsApp', description: 'Links diretos para WhatsApp' },
    { id: 'barcode-generator', name: 'Código de Barras', description: 'Códigos de barras diversos' },
    { id: 'gradient-generator', name: 'Gerador Gradiente', description: 'Gradientes CSS personalizados' },
    { id: 'css-generator', name: 'Gerador CSS', description: 'Gere código CSS automaticamente' },
    { id: 'color-picker', name: 'Color Picker', description: 'Seletor de cores similar ao Photoshop com compartilhamento' },
    { id: 'meta-tag-generator', name: 'Gerador Meta Tags', description: 'Tags meta para SEO' },
    { id: 'roman-numeral-converter', name: 'Conversor Romano', description: 'Converta números para romanos' },
    { id: 'lottery-generator', name: 'Gerador de Loteria', description: 'Crie jogos para Mega-Sena, Quina e outros' },
    { id: 'tracking-code-generator', name: 'Gerador Código Rastreamento', description: 'Códigos de rastreamento para transportadoras' },
    { id: 'color-palette-generator', name: 'Gerador Paleta de Cores', description: 'Paletas harmoniosas baseadas em teoria das cores' },
    { id: 'email-signature-generator', name: 'Gerador Assinatura Email', description: 'Assinaturas profissionais para email' },
    { id: 'bank-account-generator', name: 'Gerador Conta Bancária', description: 'Contas bancárias válidas para teste' },
    { id: 'company-generator', name: 'Gerador de Empresas', description: 'Dados completos de empresas fictícias' },
    { id: 'person-generator', name: 'Gerador de Pessoas', description: 'Pessoas fictícias com dados completos' },
    { id: 'renavam-generator', name: 'Gerador RENAVAM', description: 'RENAVAMs válidos para teste' },
    { id: 'state-registration-generator', name: 'Gerador Inscrição Estadual', description: 'Inscrições estaduais válidas' },
    { id: 'voter-title-generator', name: 'Gerador Título Eleitor', description: 'Títulos de eleitor válidos para teste' },
    { id: 'ssh-key-generator', name: 'Gerador Chave SSH', description: 'Chaves SSH para autenticação' },
    { id: 'security-key-generator', name: 'Gerador Chaves Segurança', description: 'Chaves de segurança diversas' },
    { id: 'certificate-generator', name: 'Gerador de Certificados', description: 'Certificados digitais para teste' },
    { id: 'lorem-picsum-generator', name: 'Gerador Lorem Picsum', description: 'Imagens placeholder para design' },
    { id: 'wifi-qr-generator', name: 'QR Code WiFi', description: 'QR codes para conexão WiFi' },
    { id: 'custom-card-generator', name: 'Gerador Cartão Personalizado', description: 'Cartões personalizados para eventos' }
  ],
  'VALIDADORES': [
    { id: 'cpf-validator', name: 'Validador CPF', description: 'Valide se um CPF é matematicamente correto' },
    { id: 'cnpj-validator', name: 'Validador CNPJ', description: 'Valide se um CNPJ é matematicamente correto' },
    { id: 'credit-card-validator', name: 'Validador Cartão', description: 'Valide números de cartão de crédito' },
    { id: 'json-validator', name: 'Validador JSON', description: 'Valide e formate código JSON' },
    { id: 'cnh-validator', name: 'Validador CNH', description: 'Valide CNHs brasileiras' },
    { id: 'pis-validator', name: 'Validador PIS', description: 'Valide PIS/PASEP' },
    { id: 'rg-validator', name: 'Validador RG', description: 'Valide RGs brasileiros' },
    { id: 'voter-title-validator', name: 'Validador Título de Eleitor', description: 'Valide títulos de eleitor brasileiros' },
    { id: 'nfc-validator', name: 'Validador NFC', description: 'Valide dados NFC e cartões sem contato' },
    { id: 'boleto-validator', name: 'Validador Código de Boleto', description: 'Valide códigos de barras de boletos' },
    { id: 'password-strength', name: 'Força da Senha', description: 'Teste a força das suas senhas' },
    { id: 'bank-account-validator', name: 'Validador Conta Bancária', description: 'Valide contas bancárias brasileiras' },
    { id: 'renavam-validator', name: 'Validador RENAVAM', description: 'Valide códigos RENAVAM de veículos' },
    { id: 'certificate-validator', name: 'Validador Certificados', description: 'Valide certificados digitais' }
  ],
  'CALCULADORAS': [
    { id: 'calculator', name: 'Calculadora', description: 'Calculadora científica completa' },
    { id: 'age-calculator', name: 'Calculadora Idade', description: 'Calcule idade exata em anos, meses e dias' },
    { id: 'percentage-calculator', name: 'Calculadora %', description: 'Cálculos de porcentagem diversos' },
    { id: 'compound-interest-calculator', name: 'Juros Compostos', description: 'Calcule rendimentos com juros compostos' },
    { id: 'simple-interest-calculator', name: 'Juros Simples', description: 'Calcule juros simples' },
    { id: 'mortgage-calculator', name: 'Financiamento', description: 'Simule financiamentos imobiliários' },
    { id: 'bmi-calculator', name: 'Calculadora IMC', description: 'Calcule seu Índice de Massa Corporal' },
    { id: 'tip-calculator', name: 'Calculadora Gorjeta', description: 'Calcule gorjetas e divisão de conta' },
    { id: 'date-calculator', name: 'Calculadora Datas', description: 'Operações entre datas' },
    { id: 'work-contract-calculator', name: 'Calculadora Rescisão', description: 'Calcule direitos trabalhistas na rescisão' },
    { id: 'vacation-calculator', name: 'Calculadora Férias', description: 'Calcule valor das férias e 1/3 constitucional' },
    { id: 'discount-calculator', name: 'Calculadora Desconto', description: 'Calcule descontos, preços finais e economias' }
  ],
  'CONVERSORES': [
    { id: 'color-converter', name: 'Conversor Cores', description: 'Converta entre HEX, RGB, HSL e outros' },
    { id: 'currency-converter', name: 'Conversor Moedas', description: 'Converta entre diferentes moedas' },
    { id: 'temperature-converter', name: 'Conversor Temperatura', description: 'Converta entre Celsius, Fahrenheit, Kelvin' },
    { id: 'base64-converter', name: 'Base64 Converter', description: 'Codifique e decodifique Base64' },
    { id: 'url-encoder', name: 'Codificador URL', description: 'Codifique e decodifique URLs' },
    { id: 'html-encoder', name: 'HTML Encoder', description: 'Codifique caracteres especiais HTML' },
    { id: 'number-base-converter', name: 'Conversor Bases', description: 'Converta entre bases numéricas' },
    { id: 'unit-converter', name: 'Conversor Unidades', description: 'Conversões de unidades diversas' },
    { id: 'timestamp-converter', name: 'Conversor Timestamp', description: 'Converta timestamps Unix' },
    { id: 'text-case', name: 'Conversor Texto', description: 'Altere maiúsculas e minúsculas' },
    { id: 'text-to-html-converter', name: 'Conversor HTML', description: 'Converta texto para HTML' },
    { id: 'number-to-text-converter', name: 'Número por Extenso', description: 'Escreva números e valores por extenso' },
    { id: 'csv-to-json-converter', name: 'CSV → JSON', description: 'Converta arquivos CSV para formato JSON' },
    { id: 'geocoding-converter', name: 'Geocoding Reverso', description: 'Converta endereços em coordenadas e vice-versa' },
    { id: 'json-formatter', name: 'Formatador JSON', description: 'Formate e valide JSON rapidamente' },
    { id: 'file-size-converter', name: 'Conversor Tamanho Arquivo', description: 'Converta entre diferentes unidades de armazenamento' },
    { id: 'image-converter', name: 'Conversor de Imagem', description: 'Converta formatos de imagem' }
  ],
  'CONSULTAS': [
    { id: 'cep-lookup', name: 'Consulta CEP', description: 'Busque endereços por CEP' },
    { id: 'cnpj-lookup', name: 'Consulta CNPJ', description: 'Dados da Receita Federal' },
    { id: 'ddd-lookup', name: 'Consulta DDD', description: 'Consulte códigos de área' },
    { id: 'fipe-lookup', name: 'Consulta FIPE', description: 'Preços de veículos pela tabela FIPE' },
    { id: 'bank-lookup', name: 'Consulta Bancos', description: 'Informações de bancos brasileiros' },
    { id: 'cpf-origin-lookup', name: 'Origem do CPF', description: 'Descubra a origem de um CPF' },
    { id: 'bin-lookup', name: 'Consulta de Cartão (BIN)', description: 'Informações do cartão por BIN' },
    { id: 'holiday-lookup', name: 'Consulta de Feriados', description: 'Feriados nacionais e regionais' },
    { id: 'cnae-lookup', name: 'Consulta CNAE', description: 'Busque atividades econômicas por código CNAE' }
  ],
  'PRODUTIVIDADE': [
    { id: 'todo-list', name: 'To-Do List Online', description: 'Crie listas de tarefas com exportação TXT/JSON' },
    { id: 'project-time-calculator', name: 'Calculadora Tempo Projeto', description: 'Estime tempo total de projetos a partir de tarefas' },
    { id: 'quick-notes', name: 'Anotador Rápido', description: 'Bloco de notas simples com salvamento automático' },
    { id: 'markdown-editor', name: 'Markdown Editor', description: 'Editor de Markdown com preview em tempo real' },
    { id: 'pomodoro-timer', name: 'Timer Pomodoro', description: 'Organize seu foco em ciclos de trabalho e pausas com a técnica Pomodoro' },
    { id: 'stopwatch', name: 'Cronômetro', description: 'Cronômetro preciso para medição de tempo' },
    { id: 'world-clock', name: 'Relógio Mundial', description: 'Veja horários de diferentes fusos' },
    { id: 'word-counter', name: 'Contador Palavras', description: 'Conte palavras, caracteres e parágrafos' },
    { id: 'text-diff', name: 'Comparar Textos', description: 'Compare diferenças entre textos' },
    { id: 'alphabetical-sorter', name: 'Ordenar Alfabeticamente', description: 'Ordene listas em ordem alfabética' },
    { id: 'word-occurrence-counter', name: 'Contador de Ocorrências', description: 'Conte ocorrências de palavras em texto' },
    { id: 'text-cutter', name: 'Cortar Texto', description: 'Corte texto em partes específicas' },
    { id: 'string-splitter', name: 'Dividir String', description: 'Divida strings por delimitadores' },
    { id: 'text-reverser', name: 'Inverter Texto', description: 'Inverta qualquer texto ou frase' },
    { id: 'accent-remover', name: 'Remover Acentos', description: 'Remova acentos de um texto' },
    { id: 'line-break-remover', name: 'Remover Quebra de Linha', description: 'Substitua quebras de linha facilmente' },
    { id: 'duplicate-line-remover', name: 'Remover Linhas Duplicadas', description: 'Remova linhas duplicadas de texto' },
    { id: 'find-and-replace', name: 'Localizar e Substituir', description: 'Substitua texto com expressões regulares' },
    { id: 'text-case-converter', name: 'Conversor Maiúscula/Minúscula', description: 'Converta entre diferentes casos de texto' },
    { id: 'upside-down-text', name: 'Texto de Cabeça para Baixo', description: 'Inverta texto de cabeça para baixo' },
    { id: 'email-separator', name: 'Separador de E-mails', description: 'Separe e organize listas de e-mails' },
    { id: 'synonym-generator', name: 'Gerador de Sinônimos', description: 'Encontre sinônimos para palavras' }
  ],
  'FERRAMENTAS WEB': [
    { id: 'base64-converter', name: 'Codificador Base64', description: 'Codifique e decodifique texto em Base64' },
    { id: 'word-counter', name: 'Contador Caracteres e Palavras', description: 'Conte palavras, caracteres e parágrafos' },
    { id: 'text-case', name: 'Formatador de Texto', description: 'Altere maiúsculas e minúsculas do texto' },
    { id: 'whatsapp-generator', name: 'Gerador Link WhatsApp', description: 'Crie links diretos para WhatsApp' },
    { id: 'email-separator', name: 'Separador de E-mail', description: 'Separe listas de e-mails' },
    { id: 'phone-generator', name: 'Telefone Temporário', description: 'Gere números de telefone fictícios para teste' },
    { id: 'country-info', name: 'Dados de Países', description: 'Consulte informações detalhadas sobre países' },
    { id: 'link-shortener', name: 'Encurtador de Link', description: 'Encurte URLs longas' },
    { id: 'uuid-generator', name: 'Gerador de UUID/GUID', description: 'Gere identificadores únicos universais' },
    { id: 'json-validator', name: 'Validador de JSON', description: 'Valide e formate código JSON' },
    { id: 'metadata-remover', name: 'Removedor de Metadados', description: 'Remova metadados de arquivos' },
    { id: 'web-playground', name: 'Playground Web', description: 'Editor HTML, CSS e JavaScript online' },
    { id: 'regex-tester', name: 'Testador RegEx', description: 'Teste expressões regulares' },
    { id: 'jwt-decoder', name: 'JWT Decoder', description: 'Decodifique tokens JWT' },
    { id: 'api-tester', name: 'Testador API', description: 'Teste chamadas de API REST' },
    { id: 'image-optimizer', name: 'Otimizador Imagem', description: 'Otimize e comprima imagens' },
    { id: 'color-picker', name: 'Seletor Cores', description: 'Selecione cores com precisão' },
    { id: 'ip-info', name: 'Meu IP', description: 'Veja informações do seu IP' },
    { id: 'ip-lookup', name: 'Consulta IP', description: 'Consulte informações detalhadas de endereços IP' },
    { id: 'dns-lookup', name: 'Consulta DNS', description: 'Resolva registros DNS de domínios' },
    { id: 'dns-propagation-checker', name: 'Propagação DNS', description: 'Verifique propagação DNS global' },
    { id: 'qr-reader', name: 'Leitor QR Code', description: 'Leia códigos QR da câmera' },
    { id: 'password-hasher', name: 'Hasher Senhas', description: 'Crie hashes de senhas' },
    { id: 'hash-checker', name: 'Verificador Hash', description: 'Verifique integridade de arquivos' },
    { id: 'ssl-checker', name: 'Verificador SSL', description: 'Verifique certificados SSL' },
    { id: 'speed-test', name: 'Teste de Velocidade', description: 'Teste velocidade da internet' },
    { id: 'sql-formatter', name: 'Formatador SQL', description: 'Formate e beautifique código SQL' },
    { id: 'character-info', name: 'Informações Caracter', description: 'Informações ASCII e Unicode de caracteres' },
    { id: 'browser-info', name: 'Meu Navegador', description: 'Veja informações detalhadas do navegador' },
    { id: 'system-info', name: 'Meu Sistema', description: 'Informações do sistema e hardware' },
    { id: 'ping-latency-test', name: 'Teste Ping/Latência', description: 'Teste latência e conectividade' },
    { id: 'domain-lookup', name: 'Consulta Domínio', description: 'Informações detalhadas sobre domínios' }
  ]
};

// Função para calcular o total de ferramentas automaticamente
export const getTotalToolsCount = (): number => {
  return Object.values(toolsByCategory).reduce((total, tools) => total + tools.length, 0);
};

// Função para obter contagem por categoria
export const getCategoryCount = (category: string): number => {
  return toolsByCategory[category as keyof typeof toolsByCategory]?.length || 0;
};

// Função para obter todas as ferramentas como array plano
export const getAllTools = () => {
  return Object.values(toolsByCategory).flat();
};