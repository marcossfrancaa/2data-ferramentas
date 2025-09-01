<?php
// Script PHP para envio de emails - Compatível com Hostinger
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Configurações
$admin_email = 'marcos.chacrao@gmail.com';
$site_name = '2Data Brasil';
$site_url = 'https://2databrasil.com';

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método não permitido']);
    exit();
}

// Template HTML para o ADMIN
function getAdminEmailTemplate($name, $email, $subject, $message, $site_name, $site_url) {
    return '
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Novo Contato - ' . htmlspecialchars($site_name) . '</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8fafc; }
            .container { max-width: 650px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 10px 30px rgba(0,0,0,0.1); border-radius: 12px; overflow: hidden; }
            .header { background: linear-gradient(135deg, #3b82f6 0%, #10b981 50%, #f59e0b 100%); color: white; padding: 30px 20px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; font-weight: 700; }
            .header p { margin: 5px 0 0 0; font-size: 16px; opacity: 0.9; }
            .content { padding: 30px; }
            .field { margin-bottom: 20px; }
            .label { font-weight: 600; color: #475569; font-size: 14px; margin-bottom: 5px; display: block; text-transform: uppercase; letter-spacing: 0.5px; }
            .value { background: #f8fafc; padding: 15px; border-radius: 8px; border-left: 4px solid #3b82f6; font-size: 15px; line-height: 1.5; }
            .footer { background: #f1f5f9; padding: 20px; text-align: center; color: #64748b; font-size: 13px; border-top: 1px solid #e2e8f0; }
            .badge { background: #3b82f6; color: white; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 600; text-transform: uppercase; }
            .highlight { background: linear-gradient(135deg, #3b82f6, #10b981); color: white; padding: 3px 10px; border-radius: 6px; font-weight: 600; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>📧 ' . htmlspecialchars($site_name) . '</h1>
                <p><span class="badge">NOVO CONTATO</span></p>
            </div>
            <div class="content">
                <div style="background: #f0f9ff; border: 2px solid #bae6fd; padding: 15px; border-radius: 8px; margin-bottom: 25px; text-align: center;">
                    <p style="margin: 0; color: #0369a1; font-weight: 600;">
                        📅 <strong>Novo contato recebido</strong>
                    </p>
                </div>

                <div class="field">
                    <label class="label">👤 Cliente</label>
                    <div class="value"><strong style="font-size: 17px;">' . htmlspecialchars($name) . '</strong></div>
                </div>
                <div class="field">
                    <label class="label">📧 Email para Resposta</label>
                    <div class="value">
                        <a href="mailto:' . htmlspecialchars($email) . '" style="color: #3b82f6; text-decoration: none; font-weight: 600; font-size: 16px;">' . htmlspecialchars($email) . '</a>
                        <br><small style="color: #64748b;">Clique para responder diretamente</small>
                    </div>
                </div>
                <div class="field">
                    <label class="label">📝 Assunto</label>
                    <div class="value"><span class="highlight">' . htmlspecialchars($subject) . '</span></div>
                </div>
                <div class="field">
                    <label class="label">💬 Mensagem Completa</label>
                    <div class="value" style="border-left-color: #10b981; background: #f0fdf4; font-size: 16px;">' . nl2br(htmlspecialchars($message)) . '</div>
                </div>
                <div class="field">
                    <label class="label">🌐 Informações Técnicas</label>
                    <div class="value" style="font-size: 13px; color: #64748b;">
                        <strong>IP:</strong> ' . $_SERVER["REMOTE_ADDR"] . '<br>
                        <strong>Data/Hora:</strong> ' . date("d/m/Y H:i:s") . ' (UTC-3)<br>
                        <strong>Referrer:</strong> ' . (isset($_SERVER["HTTP_REFERER"]) ? htmlspecialchars($_SERVER["HTTP_REFERER"]) : 'Direto') . '
                    </div>
                </div>
            </div>
            <div class="footer">
                <p style="color: #0369a1; font-weight: 600;">📧 <strong>Novo contato para resposta</strong></p>
                <p>Mensagem recebida via formulário de contato do <strong>' . htmlspecialchars($site_name) . '</strong></p>
                <p><a href="' . htmlspecialchars($site_url) . '" style="color: #3b82f6; text-decoration: none; font-weight: 600;">🔗 Acessar ' . htmlspecialchars($site_name) . '</a></p>
                <p style="margin-top: 10px; font-size: 11px; color: #94a3b8;">
                    📝 Para responder: clique no email do cliente acima ou use Reply
                </p>
            </div>
        </div>
    </body>
    </html>';
}

// Template HTML para o USUÁRIO (confirmação)
function getUserEmailTemplate($name, $subject, $site_name, $site_url) {
    return '
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Mensagem Recebida - ' . htmlspecialchars($site_name) . '</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8fafc; }
            .container { max-width: 650px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 10px 30px rgba(0,0,0,0.1); border-radius: 12px; overflow: hidden; }
            .header { background: linear-gradient(135deg, #10b981 0%, #3b82f6 50%, #8b5cf6 100%); color: white; padding: 30px 20px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; font-weight: 700; }
            .header p { margin: 5px 0 0 0; font-size: 16px; opacity: 0.9; }
            .content { padding: 30px; }
            .message-box { background: linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%); padding: 25px; border-radius: 12px; border-left: 4px solid #10b981; margin: 20px 0; text-align: center; }
            .highlight { background: linear-gradient(135deg, #10b981, #3b82f6); color: white; padding: 3px 10px; border-radius: 6px; font-weight: 600; }
            .footer { background: #f1f5f9; padding: 20px; text-align: center; color: #64748b; font-size: 13px; border-top: 1px solid #e2e8f0; }
            .social-links { margin: 15px 0; }
            .social-links a { display: inline-block; margin: 0 10px; color: #3b82f6; text-decoration: none; font-weight: 500; padding: 8px 15px; background: #f1f5f9; border-radius: 6px; }
            .cta-button { background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 15px 30px; border-radius: 8px; text-decoration: none; display: inline-block; font-weight: 600; margin: 20px 0; }
            .features { display: flex; justify-content: space-around; margin: 25px 0; flex-wrap: wrap; }
            .feature { text-align: center; padding: 10px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>📧 ' . htmlspecialchars($site_name) . '</h1>
                <p><span style="background: rgba(255,255,255,0.2); padding: 5px 15px; border-radius: 20px;">Mensagem Recebida!</span></p>
            </div>
            <div class="content">
                <h2 style="color: #1e293b; margin-bottom: 15px; text-align: center;">Olá, <span class="highlight">' . htmlspecialchars($name) . '</span>! 👋</h2>
                
                <div class="message-box">
                    <h3 style="margin: 0 0 10px 0; color: #1e293b; font-size: 20px;">📧 Obrigado pelo seu contato!</h3>
                    <p style="margin: 0; font-size: 16px; color: #475569;">
                        Recebemos sua mensagem sobre:<br>
                        <strong style="color: #1e293b; font-size: 18px;">"' . htmlspecialchars($subject) . '"</strong>
                    </p>
                </div>

                <p style="font-size: 15px; color: #475569; margin: 25px 0; text-align: center;">
                    Nossa equipe analisará sua mensagem e <strong>responderemos em até 24 horas</strong>. 
                    Agradecemos seu contato e interesse em nossos serviços! 🚀
                </p>

                <div class="features">
                    <div class="feature">
                        <div style="font-size: 24px; margin-bottom: 5px;">⚡</div>
                        <div style="font-size: 12px; color: #64748b;">Resposta Rápida</div>
                    </div>
                    <div class="feature">
                        <div style="font-size: 24px; margin-bottom: 5px;">🎯</div>
                        <div style="font-size: 12px; color: #64748b;">Suporte Dedicado</div>
                    </div>
                    <div class="feature">
                        <div style="font-size: 24px; margin-bottom: 5px;">📱</div>
                        <div style="font-size: 12px; color: #64748b;">App PWA</div>
                    </div>
                </div>

                <div style="background: #f0fdf4; padding: 20px; border-radius: 10px; border: 2px dashed #22c55e; text-align: center; margin: 25px 0;">
                    <p style="margin: 0; color: #166534; font-size: 14px;">
                        💡 <strong>Dica:</strong> Instale nosso app PWA para acesso rápido!
                    </p>
                </div>

                <div style="text-align: center;">
                    <a href="' . htmlspecialchars($site_url) . '" class="cta-button">
                        🔗 Voltar ao ' . htmlspecialchars($site_name) . '
                    </a>
                </div>
            </div>
            <div class="footer">
                <p><strong>📧 Precisa de ajuda?</strong> Responda este email diretamente!</p>
                <div class="social-links">
                    <a href="' . htmlspecialchars($site_url) . '">🌐 Site</a>
                    <a href="' . htmlspecialchars($site_url) . '/sobre">ℹ️ Sobre</a>
                </div>
                <p style="margin-top: 15px; font-size: 12px;">
                    © ' . date("Y") . ' ' . htmlspecialchars($site_name) . ' - Todos os direitos reservados<br>
                    <span style="color: #94a3b8;">Este é um email automático, mas você pode responder diretamente.</span>
                </p>
            </div>
        </div>
    </body>
    </html>';
}

try {
    // Receber dados do POST
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        throw new Exception('Dados inválidos');
    }
    
    $name = isset($input['name']) ? trim($input['name']) : '';
    $email = isset($input['email']) ? trim($input['email']) : '';
    $subject = isset($input['subject']) ? trim($input['subject']) : '';
    $message = isset($input['message']) ? trim($input['message']) : '';
    
    // Validações básicas
    if (empty($name) || empty($email) || empty($subject) || empty($message)) {
        throw new Exception('Todos os campos são obrigatórios');
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Email inválido');
    }
    
    // EMAIL PARA ADMIN
    $admin_subject = 'Novo Contato de ' . $name . ' - ' . $subject;
    $admin_body = getAdminEmailTemplate($name, $email, $subject, $message, $site_name, $site_url);
    
    // Headers para email do admin - otimizado anti-spam
    $admin_headers = "MIME-Version: 1.0" . "\r\n";
    $admin_headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $admin_headers .= "From: 2Data Brasil <" . $admin_email . ">" . "\r\n";
    $admin_headers .= "Reply-To: " . $name . " <" . $email . ">" . "\r\n";
    $admin_headers .= "Return-Path: " . $admin_email . "\r\n";
    $admin_headers .= "X-Mailer: 2Data Brasil Contact Form" . "\r\n";
    $admin_headers .= "List-Unsubscribe: <mailto:" . $admin_email . "?subject=Unsubscribe>" . "\r\n";
    $admin_headers .= "Message-ID: <" . uniqid() . "@2databrasil.local>" . "\r\n";
    
    // EMAIL PARA USUÁRIO (confirmação)
    $user_subject = 'Obrigado pelo seu contato - ' . $site_name;
    $user_body = getUserEmailTemplate($name, $subject, $site_name, $site_url);
    
    // Headers para email do usuário - otimizado anti-spam
    $user_headers = "MIME-Version: 1.0" . "\r\n";
    $user_headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $user_headers .= "From: Marcos - 2Data Brasil <" . $admin_email . ">" . "\r\n";
    $user_headers .= "Reply-To: Marcos - 2Data Brasil <" . $admin_email . ">" . "\r\n";
    $user_headers .= "Return-Path: " . $admin_email . "\r\n";
    $user_headers .= "X-Mailer: 2Data Brasil Notification System" . "\r\n";
    $user_headers .= "List-Unsubscribe: <mailto:" . $admin_email . "?subject=Unsubscribe>" . "\r\n";
    $user_headers .= "X-Entity-ID: 2data-brasil-confirmation" . "\r\n";
    $user_headers .= "Message-ID: <" . uniqid() . "@2databrasil.local>" . "\r\n";
    $user_headers .= "References: <contact-form@2databrasil.local>" . "\r\n";
    
    // Log para debug
    error_log("Enviando email admin para: " . $admin_email);
    error_log("Enviando email usuário para: " . $email);
    
    // Enviar ambos os emails
    $admin_sent = mail($admin_email, $admin_subject, $admin_body, $admin_headers);
    $user_sent = mail($email, $user_subject, $user_body, $user_headers);
    
    // Log dos resultados
    error_log("Admin email sent: " . ($admin_sent ? 'YES' : 'NO'));
    error_log("User email sent: " . ($user_sent ? 'YES' : 'NO'));
    
    if ($admin_sent && $user_sent) {
        echo json_encode([
            'success' => true,
            'message' => '📧 Mensagem enviada com sucesso! Você receberá uma confirmação por email.'
        ]);
    } else if ($admin_sent && !$user_sent) {
        echo json_encode([
            'success' => true,
            'message' => '✅ Mensagem enviada! (Email de confirmação pode demorar alguns minutos)'
        ]);
    } else if (!$admin_sent && $user_sent) {
        echo json_encode([
            'success' => false,
            'message' => '⚠️ Email de confirmação enviado, mas falha ao notificar admin. Tente novamente.'
        ]);
    } else {
        throw new Exception('Falha ao enviar emails. Verifique sua conexão e tente novamente.');
    }
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => '❌ Erro: ' . $e->getMessage()
    ]);
}
?>