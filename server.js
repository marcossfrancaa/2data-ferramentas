// Servidor Express para API de feedback
import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Configuração do transportador Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'marcos.chacrao@gmail.com',
    pass: 'afhhdwmaqkfpfqfc' // App Password do Gmail
  }
});

// Rota para envio de feedback
app.post('/api/send-feedback', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validação básica
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    // Template do email para o administrador (formatação corrigida)
    const adminMailOptions = {
      from: 'marcos.chacrao@gmail.com',
      to: 'marcos.chacrao@gmail.com',
      subject: `🔔 [2DATA] Novo Feedback: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 24px;">📧 2DATA - Novo Feedback</h1>
          </div>
          
          <div style="padding: 25px;">
            <div style="background-color: #f8f9ff; border-left: 4px solid #667eea; padding: 20px; margin-bottom: 20px;">
              <h2 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">📋 Informações do Contato</h2>
              <p style="margin: 5px 0; color: #333;"><strong>👤 Nome:</strong> ${name}</p>
              <p style="margin: 5px 0; color: #333;"><strong>📧 Email:</strong> ${email}</p>
              <p style="margin: 5px 0; color: #333;"><strong>📝 Assunto:</strong> ${subject}</p>
            </div>
            
            <div style="background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 5px; padding: 20px; margin-bottom: 20px;">
              <h3 style="color: #333; margin: 0 0 10px 0; font-size: 16px;">💬 Mensagem:</h3>
              <div style="background-color: white; padding: 15px; border-radius: 3px; line-height: 1.5; color: #555;">
                ${message.replace(/\n/g, '<br>')}
              </div>
            </div>
            
            <div style="text-align: center; margin: 20px 0;">
              <a href="mailto:${email}" style="background-color: #667eea; color: white; padding: 10px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">📧 Responder</a>
            </div>
          </div>
          
          <div style="background-color: #f5f5f5; padding: 15px; text-align: center; border-top: 1px solid #ddd;">
            <p style="margin: 0; font-size: 12px; color: #666;">📅 ${new Date().toLocaleString('pt-BR')} | 🌐 2DATA Brasil</p>
          </div>
        </div>
      `,
      replyTo: email
    };

    // Template do email de confirmação para o usuário
    const userConfirmationOptions = {
      from: 'marcos.chacrao@gmail.com',
      to: email,
      subject: '✅ Feedback Recebido - 2DATA Brasil',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Feedback Recebido - 2DATA</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">✅ 2DATA</h1>
              <p style="color: #e8f5e8; margin: 10px 0 0 0; font-size: 16px;">Feedback Recebido com Sucesso!</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 30px; text-align: center;">
              <div style="background-color: #f8fff9; border: 2px solid #28a745; border-radius: 12px; padding: 25px; margin-bottom: 25px;">
                <h2 style="color: #28a745; margin: 0 0 15px 0; font-size: 24px;">🎉 Obrigado, ${name}!</h2>
                <p style="color: #555; font-size: 16px; line-height: 1.6; margin: 0;">Recebemos seu feedback sobre: <strong>"${subject}"</strong></p>
              </div>
              
              <div style="background-color: #ffffff; border: 1px solid #e9ecef; border-radius: 8px; padding: 25px; margin-bottom: 25px; text-align: left;">
                <h3 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">📝 Sua mensagem:</h3>
                <div style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; color: #666; font-style: italic; border-left: 4px solid #28a745;">
                  "${message.replace(/\n/g, '<br>')}"
                </div>
              </div>
              
              <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
                <h3 style="color: #856404; margin: 0 0 10px 0; font-size: 16px;">⏰ O que acontece agora?</h3>
                <p style="color: #856404; margin: 0; font-size: 14px;">Nossa equipe analisará seu feedback e retornaremos em breve com uma resposta personalizada. Seu feedback é muito importante para melhorarmos continuamente a 2DATA!</p>
              </div>
              
              <div style="margin: 30px 0;">
                <a href="https://2data.com.br" style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block; box-shadow: 0 4px 15px rgba(40, 167, 69, 0.4);">🌐 Voltar ao 2DATA</a>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef;">
              <p style="margin: 0 0 5px 0; font-size: 14px; color: #28a745; font-weight: bold;">💚 Obrigado por usar a 2DATA!</p>
              <p style="margin: 0; font-size: 12px; color: #6c757d;">📧 Este é um email automático, mas nossa resposta será pessoal!</p>
              <p style="margin: 5px 0 0 0; font-size: 12px; color: #6c757d;">📅 ${new Date().toLocaleString('pt-BR')}</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    // Enviar email para o administrador
    await transporter.sendMail(adminMailOptions);
    
    // Enviar email de confirmação para o usuário
    await transporter.sendMail(userConfirmationOptions);

    res.json({ message: 'Feedback enviado com sucesso! Você receberá uma confirmação por email.' });

  } catch (error) {
    console.error('Erro ao enviar feedback:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota de teste
app.get('/api/test', (req, res) => {
  res.json({ message: 'API funcionando!' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});