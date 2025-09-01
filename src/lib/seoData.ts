interface ToolSEO {
  title: string;
  description: string;
  keywords: string;
  content: {
    title: string;
    introduction: string;
    howToUse: string;
    features: string[];
    faq: Array<{
      question: string;
      answer: string;
    }>;
  };
}

export const toolSEOData: Record<string, ToolSEO> = {
  'password-generator': {
    title: 'Gerador de Senhas Fortes e Seguras - 2Data',
    description: 'Crie senhas seguras e personalizadas com nosso gerador avançado. Configure comprimento, caracteres especiais e mais. 100% gratuito.',
    keywords: 'gerador senha, senha segura, gerador senha forte, criar senha, senha aleatória, segurança digital',
    content: {
      title: 'Gerador de Senhas Fortes e Seguras',
      introduction: 'Proteja suas contas online com senhas verdadeiramente seguras. Nosso gerador de senhas cria combinações únicas e robustas que são praticamente impossíveis de quebrar.',
      howToUse: 'Selecione o comprimento desejado, escolha os tipos de caracteres (maiúsculas, minúsculas, números, símbolos) e clique em "Gerar". Sua nova senha segura estará pronta para uso.',
      features: [
        'Senhas de 4 a 128 caracteres',
        'Controle total sobre tipos de caracteres',
        'Geração instantânea e segura',
        'Cópia com um clique',
        'Indicador de força da senha',
        'Sem armazenamento de dados'
      ],
      faq: [
        {
          question: 'É seguro usar um gerador de senhas online?',
          answer: 'Sim, nosso gerador é 100% seguro. As senhas são geradas localmente no seu navegador e nunca são enviadas ou armazenadas em nossos servidores.'
        },
        {
          question: 'Qual o tamanho ideal para uma senha segura?',
          answer: 'Recomendamos senhas com pelo menos 12 caracteres. Quanto maior, mais segura. Para contas importantes, use 16+ caracteres.'
        },
        {
          question: 'Devo incluir caracteres especiais?',
          answer: 'Sim, caracteres especiais aumentam significativamente a segurança da senha, dificultando ataques de força bruta.'
        }
      ]
    }
  },
  'cpf-generator': {
    title: 'Gerador de CPF Válido para Teste - 2Data',
    description: 'Gere CPFs válidos para desenvolvimento e testes. Ferramenta gratuita que cria CPFs com dígitos verificadores corretos.',
    keywords: 'gerador cpf, cpf válido, cpf teste, gerar cpf, cpf falso, desenvolvimento cpf',
    content: {
      title: 'Gerador de CPF Válido para Teste',
      introduction: 'Ferramenta essencial para desenvolvedores e testadores. Gera CPFs com formatação e dígitos verificadores corretos, ideais para testes de sistemas.',
      howToUse: 'Clique em "Gerar CPF" para criar um número válido. Você pode gerar quantos precisar e copiar facilmente para seus testes.',
      features: [
        'CPFs com dígitos verificadores válidos',
        'Formatação automática (000.000.000-00)',
        'Geração ilimitada',
        'Validação matemática garantida',
        'Interface simples e rápida',
        'Ideal para desenvolvimento'
      ],
      faq: [
        {
          question: 'Os CPFs gerados são reais?',
          answer: 'Não, são números fictícios com algoritmo válido, criados apenas para testes. Nunca correspondem a pessoas reais.'
        },
        {
          question: 'Posso usar estes CPFs em produção?',
          answer: 'Estes CPFs são exclusivamente para desenvolvimento e testes. Nunca use em sistemas de produção.'
        },
        {
          question: 'Como funciona a validação do CPF?',
          answer: 'O CPF usa dois dígitos verificadores calculados por algoritmo matemático específico que validamos em nosso gerador.'
        }
      ]
    }
  },
  'qr-generator': {
    title: 'Gerador de QR Code Gratuito - Texto, URL, WiFi - 2Data',
    description: 'Crie códigos QR personalizados para qualquer texto, URL ou WiFi. Gerador rápido, gratuito e sem limites. Download em alta qualidade.',
    keywords: 'gerador qr code, criar qr code, qr code gratuito, gerador código qr, qr wifi, qr url',
    content: {
      title: 'Gerador de QR Code Gratuito e Personalizável',
      introduction: 'Transforme qualquer texto, URL ou informação em um código QR escaneável. Ferramenta profissional e gratuita para criar QR codes em segundos.',
      howToUse: 'Digite o texto ou URL desejado, personalize o tamanho e cor se necessário, e clique em "Gerar QR Code". Faça download da imagem em alta qualidade.',
      features: [
        'QR codes para texto, URLs e WiFi',
        'Personalização de tamanho e cor',
        'Download em alta resolução',
        'Geração instantânea',
        'Interface intuitiva',
        'Sem marcas d\'água'
      ],
      faq: [
        {
          question: 'Qual o limite de caracteres para QR Code?',
          answer: 'QR codes podem armazenar até 4.296 caracteres alfanuméricos, mas recomendamos textos menores para melhor legibilidade.'
        },
        {
          question: 'Os QR codes gerados expiram?',
          answer: 'Não, os QR codes são estáticos e funcionam indefinidamente. Eles contêm a informação diretamente no código.'
        },
        {
          question: 'Posso personalizar a aparência do QR Code?',
          answer: 'Sim, você pode ajustar tamanho, cor de fundo e cor do código para combinar com sua marca ou design.'
        }
      ]
    }
  }
};

export const getToolSEO = (toolId: string): ToolSEO | null => {
  return toolSEOData[toolId] || null;
};

export const generateStructuredData = (toolId: string, toolName: string, description: string) => {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": toolName,
    "description": description,
    "url": `https://2data.com.br/ferramenta/${toolId}`,
    "applicationCategory": "WebApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "BRL"
    },
    "author": {
      "@type": "Organization",
      "name": "2Data",
      "url": "https://2data.com.br"
    }
  };
};

export const generateFAQStructuredData = (faqs: Array<{question: string, answer: string}>) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
};