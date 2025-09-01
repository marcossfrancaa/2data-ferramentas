# Configuração do EmailJS para 2DATA

## Passos para configurar o EmailJS:

### 1. Criar conta no EmailJS
- Acesse: https://www.emailjs.com/
- Crie uma conta gratuita
- Faça login no dashboard

### 2. Configurar Email Service
- Vá em "Email Services"
- Clique em "Add New Service"
- Escolha "Gmail" 
- Configure com: marcos.chacrao@gmail.com
- Anote o **Service ID** (ex: service_2data)

### 3. Criar Email Template
- Vá em "Email Templates"
- Clique em "Create New Template"
- Use este template:

```html
Assunto: 🔔 [2DATA] Novo Feedback: {{subject}}

De: {{from_name}} ({{from_email}})
Assunto: {{subject}}

Mensagem:
{{message}}

---
Enviado através do site 2DATA Brasil
```

- Anote o **Template ID** (ex: template_feedback)

### 4. Obter Public Key
- Vá em "Account" > "General"
- Copie a **Public Key**

### 5. Atualizar o código
Substitua no arquivo `src/components/FeedbackPopup.tsx`:

```javascript
// Substitua estas linhas:
'service_2data', // Seu Service ID
'template_feedback', // Seu Template ID  
'YOUR_PUBLIC_KEY' // Sua Public Key
```

## Vantagens do EmailJS:
- ✅ Funciona apenas no frontend
- ✅ Compatível com hospedagem estática (Hostinger)
- ✅ Não precisa de servidor Node.js
- ✅ Gratuito até 200 emails/mês
- ✅ Fácil de configurar

## Após configurar:
1. Faça novo build: `npm run build`
2. Envie a pasta `dist` para a Hostinger
3. Teste o formulário de feedback