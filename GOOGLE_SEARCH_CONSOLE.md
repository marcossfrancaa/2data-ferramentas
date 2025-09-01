# Google Search Console - Configuração

## 📋 Checklist de Configuração

### 1. Verificação de Propriedade
- [ ] Acessar [Google Search Console](https://search.google.com/search-console)
- [ ] Adicionar propriedade: `https://2data.com.br`
- [ ] Escolher método de verificação:
  - **Recomendado**: Meta tag HTML (já configurada no código)
  - **Alternativo**: Upload de arquivo HTML
  - **Alternativo**: DNS TXT record

### 2. Meta Tag de Verificação
```html
<meta name="google-site-verification" content="SEU_CODIGO_AQUI" />
```
**Localização**: Já implementada em `src/lib/searchConsole.ts` e `src/components/SEOHead.tsx`

### 3. Submissão do Sitemap
- [ ] No Google Search Console, ir para "Sitemaps"
- [ ] Adicionar sitemap: `https://2data.com.br/sitemap.xml`
- [ ] Verificar se todas as URLs foram indexadas

### 4. Configurações Importantes

#### URLs Canônicas
- Todas as páginas têm URLs canônicas configuradas
- Domínio preferido: `https://2data.com.br`

#### Robots.txt
- Arquivo configurado em `/public/robots.txt`
- Sitemap referenciado corretamente
- Áreas sensíveis bloqueadas

#### Dados Estruturados
- Schema.org implementado para:
  - Website principal
  - Página inicial
  - Páginas de ferramentas individuais

### 5. Monitoramento

#### Métricas Importantes
- **Cobertura**: Páginas indexadas vs. não indexadas
- **Performance**: Impressões, cliques, CTR, posição média
- **Core Web Vitals**: LCP, FID, CLS
- **Mobile Usability**: Problemas de usabilidade móvel

#### Alertas para Configurar
- Problemas de indexação
- Erros de rastreamento
- Problemas de segurança
- Penalizações manuais

### 6. Otimizações Implementadas

#### SEO Técnico
- ✅ Meta tags otimizadas
- ✅ Dados estruturados (Schema.org)
- ✅ URLs canônicas
- ✅ Sitemap XML
- ✅ Robots.txt otimizado
- ✅ Meta tag de verificação

#### Performance
- ✅ Lazy loading de imagens
- ✅ Compressão de assets
- ✅ Cache headers configurados
- ✅ CDN ready

#### Mobile-First
- ✅ Design responsivo
- ✅ Touch-friendly interface
- ✅ Fast loading
- ✅ Viewport configurado

### 7. Próximos Passos

1. **Verificar Propriedade**
   - Obter código de verificação do Google Search Console
   - Atualizar `GOOGLE_SITE_VERIFICATION` em `src/lib/searchConsole.ts`

2. **Submeter Sitemap**
   - Aguardar verificação da propriedade
   - Submeter `https://2data.com.br/sitemap.xml`

3. **Monitorar Indexação**
   - Verificar se todas as 180+ ferramentas foram indexadas
   - Resolver problemas de cobertura

4. **Otimizar Performance**
   - Monitorar Core Web Vitals
   - Otimizar páginas com problemas

### 8. Ferramentas Complementares

#### Google Analytics 4
- ✅ Configurado com ID: `G-2HQBK8YBQM`
- ✅ Enhanced ecommerce tracking
- ✅ Custom events para ferramentas

#### Google Tag Manager
- ✅ Configurado (placeholder: `GTM-XXXXXXX`)
- ✅ DataLayer implementado
- ✅ Event tracking avançado

### 9. Comandos Úteis

#### Testar Robots.txt
```bash
# Verificar se o robots.txt está acessível
curl https://2data.com.br/robots.txt
```

#### Testar Sitemap
```bash
# Verificar se o sitemap está acessível
curl https://2data.com.br/sitemap.xml
```

#### Validar Dados Estruturados
- [Rich Results Test](https://search.google.com/test/rich-results)
- [Schema Markup Validator](https://validator.schema.org/)

### 10. Contatos e Suporte

- **Desenvolvedor**: Marcos França
- **Email**: marcossfrancaa@gmail.com
- **Repositório**: [GitHub](https://github.com/marcossfranca/site-on-fire)

---

## 🚀 Status Atual

- ✅ **Código implementado**: Meta tags, dados estruturados, sitemap
- ⏳ **Pendente**: Verificação no Google Search Console
- ⏳ **Pendente**: Submissão do sitemap
- ⏳ **Pendente**: Monitoramento de indexação

**Última atualização**: Janeiro 2025