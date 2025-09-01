// API para envio de feedback por email
import nodemailer from 'nodemailer';

// Configuração do transportador Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'marcos.chacrao@gmail.com',
    pass: 'afhhdwmaqkfpfqfc' // App Password do Gmail
  }
});

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json();

    // Validação básica
    if (!name || !email || !subject || !message) {
      return new Response(
        JSON.stringify({ error: 'Todos os campos são obrigatórios' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Configuração do email
    const mailOptions = {
      from: 'marcos.chacrao@gmail.com',
      to: 'marcos.chacrao@gmail.com',
      subject: `[2Data Brasil] ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
            Novo Feedback - 2Data Brasil
          </h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #007bff; margin-top: 0;">Informações do Contato:</h3>
            <p><strong>Nome:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Assunto:</strong> ${subject}</p>
          </div>
          
          <div style="background-color: #ffffff; padding: 20px; border: 1px solid #dee2e6; border-radius: 5px;">
            <h3 style="color: #333; margin-top: 0;">Mensagem:</h3>
            <p style="line-height: 1.6; color: #555;">${message.replace(/\n/g, '<br>')}</p>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background-color: #e9ecef; border-radius: 5px; font-size: 12px; color: #6c757d;">
            <p>Este email foi enviado através do formulário de feedback do site 2Data Brasil.</p>
            <p>Data/Hora: ${new Date().toLocaleString('pt-BR')}</p>
          </div>
        </div>
      `,
      replyTo: email
    };

    // Enviar email
    await transporter.sendMail(mailOptions);

    return new Response(
      JSON.stringify({ message: 'Feedback enviado com sucesso!' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erro ao enviar feedback:', error);
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}