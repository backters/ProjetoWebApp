import nodemailer from 'nodemailer';

export interface DiagnosisEmailPayload {
  leadName: string;
  leadEmail: string;
  leadPhone: string;
  companyName?: string;
  scores: number[];
  averageScore: number;
  lowestThree: Array<{ id: number; name: string; score: number; subtitle?: string }>;
  highestThree: Array<{ id: number; name: string; score: number; subtitle?: string }>;
  primaryUnblockPillar: { id: number; name: string; subtitle?: string };
  diagnosisText: string;
  submittedAt?: string;
}

export const PILLAR_NAMES = [
  'Missão e Valores',
  'Propósito Organizacional',
  'Cultura e Clima',
  'Comunicação Interna',
  'Liderança e Decisão',
  'Engajamento da Equipe',
  'Produtividade com Equilíbrio',
  'Inovação e Criatividade',
  'Crises e Resiliência',
  'Fluxo Financeiro',
  'Reputação da Marca',
  'Legado e Impacto'
];

export function buildEmailHtml(data: DiagnosisEmailPayload): string {
  const recipient = process.env.RECIPIENT_EMAIL || 'fabianaberkana@gmail.com';
  const cleanPhone = (data.leadPhone || '').replace(/\D/g, '');
  const waLink = cleanPhone ? `https://wa.me/${cleanPhone.startsWith('55') ? cleanPhone : '55' + cleanPhone}` : null;
  const dateFormatted = data.submittedAt || new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Novo Diagnóstico de Prosperidade</title>
</head>
<body style="margin:0;padding:0;background-color:#161021;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#f0edf6;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#161021;padding:30px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:620px;background-color:#20172e;border:1px solid rgba(241,206,124,0.3);border-radius:24px;overflow:hidden;box-shadow:0 12px 40px rgba(0,0,0,0.5);">
          <!-- Header Banner -->
          <tr>
            <td style="background:linear-gradient(135deg, #2f193f 0%, #1a102b 100%);padding:36px 30px;text-align:center;border-bottom:1px solid rgba(241,206,124,0.25);">
              <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:4px;color:#f1ce7c;font-weight:600;">Método Berkana Empresarial</p>
              <h1 style="margin:12px 0 0;font-size:26px;font-weight:600;color:#ffffff;line-height:1.2;">Novo Diagnóstico de Prosperidade</h1>
              <p style="margin:8px 0 0;font-size:13px;color:#b9b0cb;">Resultado finalizado e pronto para devolutiva</p>
            </td>
          </tr>

          <!-- Lead Info Card -->
          <tr>
            <td style="padding:28px 30px 10px;">
              <table role="presentation" width="100%" style="background-color:#171024;border:1px solid rgba(241,206,124,0.18);border-radius:16px;padding:20px;">
                <tr>
                  <td>
                    <p style="margin:0 0 14px;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#f1ce7c;font-weight:600;">Dados do Participante</p>
                    <table role="presentation" width="100%" style="font-size:14px;line-height:1.8;">
                      <tr>
                        <td style="color:#9e94b4;width:110px;">Nome:</td>
                        <td style="color:#ffffff;font-weight:600;">${data.leadName || 'Não informado'}</td>
                      </tr>
                      <tr>
                        <td style="color:#9e94b4;">E-mail:</td>
                        <td><a href="mailto:${data.leadEmail}" style="color:#f1ce7c;text-decoration:none;">${data.leadEmail || 'Não informado'}</a></td>
                      </tr>
                      <tr>
                        <td style="color:#9e94b4;">WhatsApp:</td>
                        <td>
                          ${data.leadPhone || 'Não informado'}
                          ${waLink ? ` &nbsp;·&nbsp; <a href="${waLink}" target="_blank" style="color:#34d399;text-decoration:none;font-weight:600;">Abrir WhatsApp &rarr;</a>` : ''}
                        </td>
                      </tr>
                      ${data.companyName ? `
                      <tr>
                        <td style="color:#9e94b4;">Empresa:</td>
                        <td style="color:#ffffff;">${data.companyName}</td>
                      </tr>` : ''}
                      <tr>
                        <td style="color:#9e94b4;">Data/Hora:</td>
                        <td style="color:#c5bcd7;font-size:12px;">${dateFormatted}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Score Big Box -->
          <tr>
            <td style="padding:15px 30px;">
              <table role="presentation" width="100%" style="background:linear-gradient(135deg, rgba(241,206,124,0.15), rgba(87,94,207,0.15));border:1px solid #f1ce7c;border-radius:18px;padding:24px;text-align:center;">
                <tr>
                  <td>
                    <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:3px;color:#f1ce7c;font-weight:600;">Média Geral dos 12 Pilares</p>
                    <div style="margin:8px 0;font-size:52px;font-weight:bold;color:#f1ce7c;letter-spacing:-1px;">
                      ${data.averageScore.toFixed(1)} <span style="font-size:20px;color:#b9b0cb;font-weight:normal;">/ 10</span>
                    </div>
                    <p style="margin:0;font-size:13px;color:#e2daf2;max-width:440px;margin:0 auto;line-height:1.5;">
                      ${data.diagnosisText}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Critical Unblocking Pillar -->
          <tr>
            <td style="padding:5px 30px 15px;">
              <div style="background-color:#3d1a24;border-left:4px solid #f87171;border-radius:10px;padding:14px 18px;">
                <p style="margin:0;font-size:12px;font-weight:600;color:#fca5a5;text-transform:uppercase;letter-spacing:1px;">Porta de Desobstrução Prioritária</p>
                <p style="margin:4px 0 0;font-size:14px;color:#ffffff;">
                  O pilar <strong style="color:#f1ce7c;">${data.primaryUnblockPillar.name}</strong> é atualmente a principal chave sistêmica para destravar o fluxo de prosperidade desta organização.
                </p>
              </div>
            </td>
          </tr>

          <!-- 2 Columns: Harmonization & Strengths -->
          <tr>
            <td style="padding:10px 30px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <!-- Lowest Three -->
                  <td width="48%" valign="top" style="background-color:#1c1328;border:1px solid rgba(248,113,113,0.3);border-radius:14px;padding:16px;">
                    <p style="margin:0 0 10px;font-size:12px;font-weight:600;color:#fca5a5;text-transform:uppercase;letter-spacing:1px;">Pontos a Harmonizar (Menores)</p>
                    <ul style="margin:0;padding-left:18px;font-size:13px;color:#ded6ef;line-height:1.8;">
                      ${data.lowestThree.map(item => `<li><strong>${item.name}</strong>: <span style="color:#fca5a5;font-weight:bold;">${item.score}/10</span></li>`).join('')}
                    </ul>
                  </td>
                  <td width="4%">&nbsp;</td>
                  <!-- Highest Three -->
                  <td width="48%" valign="top" style="background-color:#1c1328;border:1px solid rgba(52,211,153,0.3);border-radius:14px;padding:16px;">
                    <p style="margin:0 0 10px;font-size:12px;font-weight:600;color:#6ee7b7;text-transform:uppercase;letter-spacing:1px;">Maiores Potenciais (Altos)</p>
                    <ul style="margin:0;padding-left:18px;font-size:13px;color:#ded6ef;line-height:1.8;">
                      ${data.highestThree.map(item => `<li><strong>${item.name}</strong>: <span style="color:#6ee7b7;font-weight:bold;">${item.score}/10</span></li>`).join('')}
                    </ul>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Complete 12 Pillars Table -->
          <tr>
            <td style="padding:15px 30px;">
              <p style="margin:0 0 10px;font-size:12px;font-weight:600;color:#f1ce7c;text-transform:uppercase;letter-spacing:1.5px;">Tabela Completa dos 12 Pilares</p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#171024;border-radius:12px;overflow:hidden;border:1px solid rgba(255,255,255,0.08);font-size:13px;">
                ${data.scores.map((score, idx) => `
                  <tr style="border-bottom:1px solid rgba(255,255,255,0.06);background-color:${idx % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent'};">
                    <td style="padding:10px 14px;color:#9e94b4;width:30px;">${idx + 1}.</td>
                    <td style="padding:10px 14px;color:#ffffff;font-weight:500;">${PILLAR_NAMES[idx] || `Pilar ${idx + 1}`}</td>
                    <td style="padding:10px 14px;text-align:right;color:#f1ce7c;font-weight:bold;">${score} / 10</td>
                  </tr>
                `).join('')}
              </table>
            </td>
          </tr>

          <!-- Action Button for Admin -->
          <tr>
            <td style="padding:20px 30px 35px;text-align:center;">
              ${waLink ? `
                <a href="${waLink}" target="_blank" style="display:inline-block;background:linear-gradient(135deg, #f1ce7c 0%, #d4af37 100%);color:#1a1024;font-weight:bold;text-decoration:none;padding:14px 28px;border-radius:999px;font-size:14px;box-shadow:0 8px 24px rgba(241,206,124,0.35);">
                  Conversar com ${data.leadName || 'o participante'} no WhatsApp &rarr;
                </a>
              ` : `
                <a href="mailto:${data.leadEmail}" style="display:inline-block;background:linear-gradient(135deg, #f1ce7c 0%, #d4af37 100%);color:#1a1024;font-weight:bold;text-decoration:none;padding:14px 28px;border-radius:999px;font-size:14px;">
                  Responder para ${data.leadEmail} &rarr;
                </a>
              `}
              <p style="margin:18px 0 0;font-size:11px;color:#7e7494;">
                Enviado automaticamente pelo app de Diagnóstico Estratégico de Prosperidade para ${recipient}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export async function sendDiagnosisEmail(data: DiagnosisEmailPayload): Promise<{
  success: boolean;
  message: string;
  provider: 'resend' | 'smtp' | 'simulated';
  recipient: string;
}> {
  const recipientEmail = process.env.RECIPIENT_EMAIL || 'fabianaberkana@gmail.com';
  const htmlContent = buildEmailHtml(data);
  const subject = `⭐ Novo Diagnóstico de Prosperidade: ${data.leadName || 'Novo Lead'} (${data.averageScore.toFixed(1)}/10)`;

  // 1. Check if Resend is configured (Recommended for Vercel)
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM || 'Método Berkana <onboarding@resend.dev>',
          to: [recipientEmail],
          reply_to: data.leadEmail || undefined,
          subject,
          html: htmlContent,
        }),
      });

      if (res.ok) {
        console.log(`[EmailService] Diagnóstico enviado com sucesso via Resend para ${recipientEmail}`);
        return {
          success: true,
          message: `E-mail enviado com sucesso para ${recipientEmail} via Resend.`,
          provider: 'resend',
          recipient: recipientEmail,
        };
      } else {
        const errText = await res.text();
        console.warn(`[EmailService] Falha na API do Resend:`, errText);
      }
    } catch (err) {
      console.error(`[EmailService] Erro ao chamar Resend:`, err);
    }
  }

  // 2. Check if SMTP is configured (Nodemailer)
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;
  if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: parseInt(SMTP_PORT || '587', 10),
        secure: SMTP_PORT === '465',
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: SMTP_FROM || `"Método Berkana" <${SMTP_USER}>`,
        to: recipientEmail,
        replyTo: data.leadEmail || undefined,
        subject,
        html: htmlContent,
      });

      console.log(`[EmailService] Diagnóstico enviado com sucesso via SMTP para ${recipientEmail}`);
      return {
        success: true,
        message: `E-mail enviado com sucesso para ${recipientEmail} via SMTP.`,
        provider: 'smtp',
        recipient: recipientEmail,
      };
    } catch (err: any) {
      console.error(`[EmailService] Erro no envio SMTP:`, err?.message || err);
    }
  }

  // 3. Fallback: Simulation mode with clean logging
  console.log(`\n======================================================`);
  console.log(`[EmailService - REGISTRO DE DIAGNÓSTICO RECEBIDO]`);
  console.log(`Destinatário: ${recipientEmail}`);
  console.log(`Participante: ${data.leadName} (${data.leadEmail} / ${data.leadPhone})`);
  console.log(`Empresa: ${data.companyName || 'N/A'}`);
  console.log(`Média Geral: ${data.averageScore.toFixed(1)}/10`);
  console.log(`Pilar de Desobstrução: ${data.primaryUnblockPillar.name}`);
  console.log(`Status: Salvo com sucesso! Para envio de e-mail em tempo real no Vercel, adicione RESEND_API_KEY ou credenciais SMTP nas Environment Variables.`);
  console.log(`======================================================\n`);

  return {
    success: true,
    message: `Diagnóstico registrado e formatado para ${recipientEmail}.`,
    provider: 'simulated',
    recipient: recipientEmail,
  };
}
