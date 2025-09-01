# 🔥 Site On Fire - Ferramentas Online

Um conjunto completo de ferramentas online para desenvolvedores, profissionais e usuários em geral. Site moderno e responsivo construído com React, TypeScript e Tailwind CSS.

## 🚀 Características

- **180+ Ferramentas** organizadas em 6 categorias principais
- **Interface Moderna** com design responsivo e tema escuro/claro
- **PWA Ready** - Funciona offline e pode ser instalado
- **Performance Otimizada** com Vite e React 18
- **Componentes Reutilizáveis** com Radix UI e shadcn/ui
- **SEO Otimizado** com meta tags dinâmicas
- **Acessibilidade** seguindo padrões WCAG

## 📋 Categorias de Ferramentas

### 🎲 Geradores (45 ferramentas)
- Gerador de Senhas, QR Code, Hash, CPF, CNPJ
- UUID, PIX, Nomes, Nicks, Números Aleatórios
- E-mail Temporário, Cartão de Crédito, Lorem Ipsum
- CRON, CNH, RG, Favicon, JSON, PIS
- Veículos, Placas, WhatsApp, Código de Barras
- Gradientes, CSS, Color Picker, Meta Tags
- Números Romanos, Loteria, Rastreamento
- Paletas de Cores, Assinatura Email, Contas Bancárias
- Empresas, Pessoas, RENAVAM, Inscrição Estadual
- Título de Eleitor, Chaves SSH, Certificados
- Lorem Picsum, WiFi QR, Cartões Personalizados

### ✅ Validadores (14 ferramentas)
- CPF, CNPJ, Cartão de Crédito, JSON
- CNH, PIS, RG, Título de Eleitor
- NFC, Boleto, Força da Senha
- Conta Bancária, RENAVAM, Certificados

### 🧮 Calculadoras (12 ferramentas)
- Calculadora Científica, Idade, Porcentagem
- Juros Compostos e Simples, Financiamento
- IMC, Gorjeta, Datas
- Rescisão Trabalhista, Férias, Desconto

### 🔄 Conversores (17 ferramentas)
- Cores (HEX, RGB, HSL), Moedas, Temperatura
- Base64, URL, HTML, Bases Numéricas
- Unidades, Timestamp, Texto
- HTML, Números por Extenso, CSV → JSON
- Geocoding, JSON Formatter, Tamanho de Arquivo
- Conversor de Imagem

### 🔍 Consultas (9 ferramentas)
- CEP, CNPJ, DDD, FIPE
- Bancos, Origem CPF, BIN de Cartão
- Feriados, CNAE

### 📈 Produtividade (23 ferramentas)
- To-Do List, Calculadora Tempo Projeto
- Anotador Rápido, Markdown Editor
- Timer Pomodoro, Cronômetro, Relógio Mundial
- Contador Palavras, Comparar Textos
- Ordenar Alfabeticamente, Contador Ocorrências
- Cortar Texto, Dividir String, Inverter Texto
- Remover Acentos, Quebras de Linha, Linhas Duplicadas
- Localizar e Substituir, Conversor Maiúscula/Minúscula
- Texto de Cabeça para Baixo, Separador E-mails
- Gerador de Sinônimos

### 🌐 Ferramentas Web (32 ferramentas)
- Base64, Contador Caracteres, Formatador Texto
- WhatsApp, Separador E-mail, Telefone Temporário
- Dados de Países, Encurtador Link, UUID
- JSON Validator, Removedor Metadados
- Playground Web, RegEx Tester, JWT Decoder
- API Tester, Otimizador Imagem, Color Picker
- Meu IP, Consulta IP, DNS Lookup
- Propagação DNS, QR Reader, Hash Senhas
- Verificador Hash, SSL Checker, Teste Velocidade
- SQL Formatter, Informações Caracter
- Meu Navegador, Meu Sistema, Teste Ping
- Consulta Domínio

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18** - Biblioteca JavaScript para interfaces
- **TypeScript** - Superset tipado do JavaScript
- **Vite** - Build tool moderna e rápida
- **Tailwind CSS** - Framework CSS utilitário
- **React Router DOM** - Roteamento para React

### UI/UX
- **Radix UI** - Componentes acessíveis e não estilizados
- **shadcn/ui** - Componentes reutilizáveis
- **Lucide React** - Ícones modernos
- **next-themes** - Sistema de temas
- **Tailwind Animate** - Animações CSS

### Funcionalidades
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de esquemas
- **TanStack Query** - Gerenciamento de estado servidor
- **date-fns** - Manipulação de datas
- **QRCode** - Geração de códigos QR
- **Recharts** - Gráficos e visualizações

### Desenvolvimento
- **ESLint** - Linter para JavaScript/TypeScript
- **PostCSS** - Processador CSS
- **Autoprefixer** - Prefixos CSS automáticos

## 📦 Instalação

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Passos

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd site-on-fire-80-main
```

2. **Instale as dependências**
```bash
npm install
# ou
yarn install
```

3. **Execute em desenvolvimento**
```bash
npm run dev
# ou
yarn dev
```

4. **Acesse o projeto**
- Local: http://localhost:8080
- Rede: http://192.168.x.x:8080
- Produção: https://2data.com.br

## 🏗️ Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Build para desenvolvimento
npm run build:dev

# Preview da build
npm run preview

# Linting
npm run lint
```

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── ui/             # Componentes base (shadcn/ui)
│   ├── calculators/    # Componentes de calculadoras
│   ├── tools/          # Componentes de ferramentas
│   ├── validators/     # Componentes de validadores
│   ├── Header.tsx      # Cabeçalho do site
│   ├── Footer.tsx      # Rodapé do site
│   └── ...
├── pages/              # Páginas da aplicação
│   ├── Index.tsx       # Página inicial
│   ├── ToolPage.tsx    # Página de ferramenta
│   ├── Sobre.tsx       # Página sobre
│   └── ...
├── lib/                # Utilitários e dados
│   ├── toolsData.ts    # Dados das ferramentas
│   └── utils.ts        # Funções utilitárias
├── hooks/              # Hooks customizados
└── ...
```

## 🎨 Personalização

### Temas
O projeto suporta tema claro e escuro automaticamente. A configuração está em:
- `src/hooks/use-theme.tsx`
- `tailwind.config.ts`

### Cores
Personalize as cores no arquivo `tailwind.config.ts`:
```typescript
theme: {
  extend: {
    colors: {
      // Suas cores personalizadas
    }
  }
}
```

### Componentes
Todos os componentes seguem o padrão shadcn/ui e podem ser personalizados em `src/components/ui/`.

## 🚀 Deploy

### Build
```bash
npm run build
```

### Arquivos gerados
Os arquivos de produção ficam na pasta `dist/` e incluem:
- HTML, CSS e JS otimizados
- Service Worker para PWA
- Manifest.json
- Favicons
- Sitemap.xml
- .htaccess

### Hospedagem
O projeto pode ser hospedado em:
- **Vercel** (recomendado)
- **Netlify**
- **GitHub Pages**
- **Apache/Nginx**

## 🔧 Configurações

### PWA
Configuração do Progressive Web App em:
- `public/manifest.json`
- `public/sw.js`

### SEO
Meta tags dinâmicas configuradas em cada página.

### Analytics
Pronto para Google Analytics, Google Tag Manager, etc.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Adicionando Novas Ferramentas

1. **Adicione a ferramenta em `src/lib/toolsData.ts`**
2. **Crie o componente em `src/components/tools/`**
3. **Teste a funcionalidade**
4. **Atualize a documentação**

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

- **Issues**: Use o sistema de issues do GitHub
- **Documentação**: README.md e comentários no código
- **Comunidade**: Discussões no GitHub

## 🎯 Roadmap

- [ ] Mais ferramentas de desenvolvimento
- [ ] API para integração externa
- [ ] Modo offline completo
- [ ] Temas personalizáveis
- [ ] Exportação de dados
- [ ] Integração com serviços externos
- [ ] Aplicativo mobile

## 📊 Estatísticas

- **180+ Ferramentas** em 6 categorias
- **100% Responsivo** para todos os dispositivos
- **PWA Ready** com suporte offline
- **Performance A+** no Lighthouse
- **Acessibilidade AA** seguindo WCAG

---

**Desenvolvido com ❤️ usando React + TypeScript + Tailwind CSS**
