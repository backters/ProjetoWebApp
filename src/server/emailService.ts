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
  reportUrl?: string;
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

/**
 * Generates a high-definition radar chart image URL via QuickChart.
 * Renders in the official Option 1 color palette (Marfim & Magenta Real).
 */
export function generateRadarChartUrl(scores: number[]): string {
  const labels = [
    ['1. Missão', 'e Valores'],
    ['2. Propósito', 'Organizacional'],
    ['3. Cultura', 'e Clima'],
    ['4. Comunicação', 'Interna'],
    ['5. Liderança', 'e Decisão'],
    ['6. Engajamento', 'da Equipe'],
    ['7. Produtividade', 'com Equilíbrio'],
    ['8. Inovação e', 'Criatividade'],
    ['9. Crises e', 'Resiliência'],
    ['10. Fluxo', 'Financeiro'],
    ['11. Reputação', 'da Marca'],
    ['12. Legado e', 'Impacto']
  ];

  const chartConfig = {
    type: 'radar',
    data: {
      labels,
      datasets: [
        {
          label: 'Pontuação (1-10)',
          data: scores,
          backgroundColor: 'rgba(212, 124, 52, 0.38)',
          borderColor: '#88186D',
          borderWidth: 3,
          pointBackgroundColor: '#D47C34',
          pointBorderColor: '#88186D',
          pointBorderWidth: 2,
          pointRadius: 5
        }
      ]
    },
    options: {
      legend: { display: false },
      scale: {
        ticks: {
          beginAtZero: true,
          min: 0,
          max: 10,
          stepSize: 2,
          fontColor: '#706861',
          fontSize: 10,
          backdropColor: 'transparent',
          showLabelBackdrop: false
        },
        gridLines: {
          color: 'rgba(136, 24, 109, 0.20)',
          lineWidth: 1
        },
        angleLines: {
          color: 'rgba(212, 124, 52, 0.32)',
          lineWidth: 1
        },
        pointLabels: {
          fontSize: 10.5,
          fontColor: '#2D2825',
          fontStyle: 'bold',
          fontFamily: 'sans-serif'
        }
      }
    }
  };

  return `https://quickchart.io/chart?w=580&h=520&bkg=%23FAF6F0&devicePixelRatio=2&c=${encodeURIComponent(
    JSON.stringify(chartConfig)
  )}`;
}

export function buildEmailHtml(data: DiagnosisEmailPayload): string {
  const recipient = process.env.RECIPIENT_EMAIL || 'fabianaberkana@gmail.com';
  const cleanPhone = (data.leadPhone || '').replace(/\D/g, '');
  const waLink = cleanPhone ? `https://wa.me/${cleanPhone.startsWith('55') ? cleanPhone : '55' + cleanPhone}` : null;
  const dateFormatted = data.submittedAt || new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

  // Generate the online interactive diagnosis link if provided or generate fallback
  const safeScoresParam = (data.scores || []).join(',');
  const appBaseUrl = data.reportUrl || `https://ais-pre-vtsujryqougixgeasmodfg-363334807308.us-east1.run.app?resultado=1&s=${safeScoresParam}${
    data.companyName ? `&empresa=${encodeURIComponent(data.companyName)}` : ''
  }${data.leadName ? `&nome=${encodeURIComponent(data.leadName)}` : ''}`;

  // Generate the radar chart image URL
  const radarChartUrl = generateRadarChartUrl(data.scores || Array(12).fill(5));

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Diagnóstico Estratégico de Prosperidade - Método Berkana</title>
</head>
<body style="margin:0;padding:0;background-color:#FAF6F0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#2D2825;-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#FAF6F0;padding:30px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:620px;background-color:#FFFFFF;border:1px solid rgba(136,24,109,0.22);border-radius:24px;overflow:hidden;box-shadow:0 12px 35px rgba(136,24,109,0.08);">
          
          <!-- Header Banner (Opção 1: Magenta Real & Âmbar Solar) -->
          <tr>
            <td style="background:linear-gradient(135deg, #88186D 0%, #630E4E 100%);padding:36px 28px;text-align:center;border-bottom:3px solid #D47C34;">
              <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:4px;color:#FBD38D;font-weight:700;">Método Berkana Empresarial</p>
              <h1 style="margin:12px 0 0;font-size:25px;font-weight:700;color:#FFFFFF;line-height:1.2;font-family:Georgia,serif;">
                Diagnóstico Estratégico de Prosperidade
              </h1>
              <p style="margin:8px 0 0;font-size:13px;color:#FCD5DF;">Relatório sistêmico completo com gráfico e devolutiva</p>
            </td>
          </tr>

          <!-- Link Direct Banner -->
          <tr>
            <td style="background-color:#F5EBE6;padding:12px 24px;text-align:center;border-bottom:1px solid rgba(136,24,109,0.12);">
              <span style="font-size:12px;color:#706861;">🌐 Relatório Interativo Online: </span>
              <a href="${appBaseUrl}" target="_blank" style="font-size:12px;font-weight:700;color:#88186D;text-decoration:none;">
                Visualizar no Navegador com Teia Interativa &rarr;
              </a>
            </td>
          </tr>

          <!-- Lead Info Card -->
          <tr>
            <td style="padding:26px 26px 10px;">
              <table role="presentation" width="100%" style="background-color:#FAF6F0;border:1px solid rgba(136,24,109,0.16);border-radius:18px;padding:20px;">
                <tr>
                  <td>
                    <p style="margin:0 0 14px;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#88186D;font-weight:700;">Dados do Participante</p>
                    <table role="presentation" width="100%" style="font-size:14px;line-height:1.8;">
                      <tr>
                        <td style="color:#706861;width:110px;font-weight:500;">Nome:</td>
                        <td style="color:#2D2825;font-weight:700;">${data.leadName || 'Não informado'}</td>
                      </tr>
                      <tr>
                        <td style="color:#706861;font-weight:500;">E-mail:</td>
                        <td><a href="mailto:${data.leadEmail}" style="color:#88186D;font-weight:600;text-decoration:none;">${data.leadEmail || 'Não informado'}</a></td>
                      </tr>
                      <tr>
                        <td style="color:#706861;font-weight:500;">WhatsApp:</td>
                        <td>
                          <span style="color:#2D2825;font-weight:600;">${data.leadPhone || 'Não informado'}</span>
                          ${waLink ? ` &nbsp;·&nbsp; <a href="${waLink}" target="_blank" style="display:inline-block;color:#059669;font-weight:700;text-decoration:none;background:#ECFDF5;padding:2px 8px;border-radius:6px;border:1px solid #A7F3D0;font-size:12px;">Abrir WhatsApp &rarr;</a>` : ''}
                        </td>
                      </tr>
                      ${data.companyName ? `
                      <tr>
                        <td style="color:#706861;font-weight:500;">Empresa:</td>
                        <td style="color:#2D2825;font-weight:600;">${data.companyName}</td>
                      </tr>` : ''}
                      <tr>
                        <td style="color:#706861;font-weight:500;">Data e Hora:</td>
                        <td style="color:#706861;font-size:12px;">${dateFormatted}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Score Big Box -->
          <tr>
            <td style="padding:10px 26px;">
              <table role="presentation" width="100%" style="background:linear-gradient(135deg, #FFF7ED 0%, #FAF6F0 100%);border:2px solid #D47C34;border-radius:18px;padding:22px;text-align:center;">
                <tr>
                  <td>
                    <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:3px;color:#D47C34;font-weight:700;">Média Geral dos 12 Pilares</p>
                    <div style="margin:8px 0;font-size:52px;font-weight:bold;color:#88186D;letter-spacing:-1px;font-family:Georgia,serif;">
                      ${data.averageScore.toFixed(1)} <span style="font-size:20px;color:#706861;font-weight:normal;">/ 10</span>
                    </div>
                    <p style="margin:0;font-size:14px;color:#2D2825;max-width:480px;margin:0 auto;line-height:1.6;">
                      ${data.diagnosisText}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ========================================================
               GRÁFICO DE RAIO / TEIA DOS 12 PILARES EMPRESARIAIS
               ======================================================== -->
          <tr>
            <td style="padding:14px 26px;">
              <table role="presentation" width="100%" style="background-color:#FAF6F0;border:1px solid rgba(136,24,109,0.20);border-radius:20px;overflow:hidden;box-shadow:0 4px 16px rgba(136,24,109,0.05);">
                <tr>
                  <td style="padding:20px 20px 10px;text-align:center;">
                    <div style="display:inline-block;padding:3px 12px;background-color:rgba(136,24,109,0.10);border:1px solid rgba(136,24,109,0.22);border-radius:20px;margin-bottom:8px;">
                      <span style="font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#88186D;font-weight:700;">Mapa Visual dos 12 Pilares</span>
                    </div>
                    <h2 style="margin:4px 0 0;font-size:19px;font-weight:700;color:#2D2825;font-family:Georgia,serif;">
                      Gráfico de Raio (Teia da Prosperidade)
                    </h2>
                    <p style="margin:4px 0 16px;font-size:12px;color:#706861;">
                      Visualização completa da harmonia energética de cada pilar avaliado
                    </p>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding:0 12px 18px;">
                    <!-- QuickChart High-DPI Radar Chart -->
                    <a href="${appBaseUrl}" target="_blank" title="Clique para abrir o gráfico interativo completo" style="text-decoration:none;display:block;">
                      <img
                        src="${radarChartUrl}"
                        width="540"
                        style="display:block;margin:0 auto;max-width:100%;height:auto;border-radius:14px;border:1px solid rgba(136,24,109,0.12);"
                        alt="Gráfico de Raio dos 12 Pilares - Método Berkana"
                      />
                    </a>
                    <div style="margin-top:12px;text-align:center;">
                      <a href="${appBaseUrl}" target="_blank" style="font-size:12px;font-weight:600;color:#88186D;text-decoration:none;">
                        🔍 Clique no gráfico para abrir e interagir online &rarr;
                      </a>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Critical Unblocking Pillar -->
          <tr>
            <td style="padding:6px 26px 14px;">
              <div style="background-color:#FFF5F5;border-left:5px solid #88186D;border-radius:12px;padding:16px 20px;border:1px solid rgba(136,24,109,0.15);border-left-width:5px;">
                <p style="margin:0;font-size:11px;font-weight:700;color:#88186D;text-transform:uppercase;letter-spacing:1.5px;">Porta de Desobstrução Prioritária</p>
                <p style="margin:6px 0 0;font-size:14px;color:#2D2825;line-height:1.5;">
                  O pilar <strong style="color:#88186D;font-weight:700;">${data.primaryUnblockPillar.name}</strong> é hoje a principal chave para destravar o fluxo de prosperidade. Ao harmonizá-lo, todos os outros pilares voltam a fluir com facilidade.
                </p>
              </div>
            </td>
          </tr>

          <!-- 2 Columns: Harmonization & Strengths -->
          <tr>
            <td style="padding:8px 26px 14px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <!-- Lowest Three -->
                  <td width="48%" valign="top" style="background-color:#FFF7F7;border:1px solid rgba(220,38,38,0.25);border-radius:16px;padding:16px;">
                    <p style="margin:0 0 10px;font-size:11px;font-weight:700;color:#DC2626;text-transform:uppercase;letter-spacing:1px;">Pontos a Harmonizar (Prioridades)</p>
                    <ul style="margin:0;padding-left:18px;font-size:13px;color:#450A0A;line-height:1.8;">
                      ${data.lowestThree.map(item => `<li><strong style="color:#2D2825;">${item.name}</strong>: <span style="color:#DC2626;font-weight:bold;">${item.score}/10</span></li>`).join('')}
                    </ul>
                  </td>
                  <td width="4%">&nbsp;</td>
                  <!-- Highest Three -->
                  <td width="48%" valign="top" style="background-color:#F0FDF4;border:1px solid rgba(22,101,52,0.25);border-radius:16px;padding:16px;">
                    <p style="margin:0 0 10px;font-size:11px;font-weight:700;color:#16A34A;text-transform:uppercase;letter-spacing:1px;">Maiores Potenciais (Fortalezas)</p>
                    <ul style="margin:0;padding-left:18px;font-size:13px;color:#064E3B;line-height:1.8;">
                      ${data.highestThree.map(item => `<li><strong style="color:#2D2825;">${item.name}</strong>: <span style="color:#16A34A;font-weight:bold;">${item.score}/10</span></li>`).join('')}
                    </ul>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Complete 12 Pillars Breakdown Table with Visual Bars -->
          <tr>
            <td style="padding:10px 26px 20px;">
              <p style="margin:0 0 12px;font-size:12px;font-weight:700;color:#88186D;text-transform:uppercase;letter-spacing:1.5px;">Tabela Completa das Notas dos 12 Pilares</p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#FAF6F0;border-radius:14px;overflow:hidden;border:1px solid rgba(136,24,109,0.18);font-size:13px;">
                ${(data.scores || []).map((score, idx) => {
                  const pct = Math.round((score / 10) * 100);
                  const isLow = score <= 6;
                  const isHigh = score >= 9;
                  const barColor = isLow ? '#DC2626' : isHigh ? '#769043' : '#D47C34';
                  return `
                  <tr style="border-bottom:1px solid rgba(136,24,109,0.08);background-color:${idx % 2 === 0 ? '#FFFFFF' : 'transparent'};">
                    <td style="padding:10px 12px;color:#706861;width:24px;font-weight:600;">${idx + 1}.</td>
                    <td style="padding:10px 12px;color:#2D2825;font-weight:600;width:45%;">${PILLAR_NAMES[idx] || `Pilar ${idx + 1}`}</td>
                    <td style="padding:10px 12px;width:35%;">
                      <div style="background-color:#EBE4D8;height:8px;border-radius:999px;overflow:hidden;width:100%;">
                        <div style="background-color:${barColor};height:100%;width:${pct}%;border-radius:999px;"></div>
                      </div>
                    </td>
                    <td style="padding:10px 12px;text-align:right;color:#88186D;font-weight:700;font-size:14px;">${score}/10</td>
                  </tr>
                  `;
                }).join('')}
              </table>
            </td>
          </tr>

          <!-- Action Buttons / Next Steps -->
          <tr>
            <td style="padding:10px 26px 36px;text-align:center;background-color:#FAF6F0;border-top:1px solid rgba(136,24,109,0.12);">
              <div style="margin-bottom:16px;">
                <a href="${appBaseUrl}" target="_blank" style="display:inline-block;background:linear-gradient(135deg, #88186D 0%, #D47C34 100%);color:#FFFFFF;font-weight:bold;text-decoration:none;padding:14px 30px;border-radius:999px;font-size:14px;box-shadow:0 8px 24px rgba(136,24,109,0.25);">
                  🌐 Abrir Diagnóstico Completo Interativo no Navegador &rarr;
                </a>
              </div>

              ${waLink ? `
              <div style="margin-bottom:14px;">
                <a href="${waLink}" target="_blank" style="display:inline-block;background-color:#059669;color:#FFFFFF;font-weight:bold;text-decoration:none;padding:11px 24px;border-radius:999px;font-size:13px;">
                  💬 Conversar com ${data.leadName || 'o participante'} no WhatsApp &rarr;
                </a>
              </div>
              ` : ''}

              <p style="margin:16px 0 0;font-size:11px;color:#706861;line-height:1.5;">
                Este relatório foi gerado e enviado automaticamente pelo app <strong>Diagnóstico Estratégico de Prosperidade</strong> para <strong>${recipient}</strong>.<br>
                Método Berkana · Fabiana Berkana
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
        const errJson = await res.json().catch(() => ({}));
        console.warn(`[EmailService] Resend API retornou status ${res.status}:`, errJson);

        // Se o Resend bloquear porque o domínio ainda não foi verificado na conta gratuita:
        if (
          errJson?.statusCode === 403 &&
          errJson?.message?.includes('You can only send testing emails to your own email address')
        ) {
          const match = errJson.message.match(/your own email address \(([^)]+)\)/);
          const accountEmail = match ? match[1] : null;

          if (accountEmail && accountEmail !== recipientEmail) {
            console.log(`[EmailService] Entregando na conta Resend (${accountEmail}) devido à política de teste...`);
            const fallbackRes = await fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${resendApiKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                from: process.env.RESEND_FROM || 'onboarding@resend.dev',
                to: [accountEmail],
                reply_to: data.leadEmail || undefined,
                subject: `[Para: ${recipientEmail}] ${subject}`,
                html: `
                  <div style="background-color:#fff1f2;border:1px solid #f43f5e;border-radius:12px;padding:16px;margin-bottom:20px;font-family:sans-serif;color:#9f1239;font-size:13px;line-height:1.6;">
                    <strong style="font-size:14px;display:block;margin-bottom:4px;">📌 Aviso de Configuração do Resend:</strong>
                    Este diagnóstico foi direcionado para <strong>${recipientEmail}</strong>. No entanto, como a conta do Resend ainda não possui um domínio próprio verificado, a política de testes do Resend entrega apenas no e-mail do titular da conta (<strong>${accountEmail}</strong>).<br><br>
                    <strong>Como enviar direto para ${recipientEmail}:</strong><br>
                    1. Crie a conta no Resend diretamente com ${recipientEmail}, <strong>OU</strong><br>
                    2. Verifique seu domínio (ex: seusite.com.br) no menu <em>Domains</em> do Resend, <strong>OU</strong><br>
                    3. Configure uma regra de encaminhamento no Gmail de ${accountEmail} para ${recipientEmail}.
                  </div>
                ` + htmlContent,
              }),
            });

            if (fallbackRes.ok) {
              console.log(`[EmailService] Entregue com sucesso na conta vinculada: ${accountEmail}`);
              return {
                success: true,
                message: `E-mail entregue em ${accountEmail} (o Resend no plano de testes sem domínio entrega na conta do titular).`,
                provider: 'resend',
                recipient: accountEmail,
              };
            }
          }
        }
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

      console.log(`[EmailService] E-mail enviado com sucesso via SMTP para ${recipientEmail}`);
      return {
        success: true,
        message: `E-mail enviado com sucesso para ${recipientEmail} via SMTP.`,
        provider: 'smtp',
        recipient: recipientEmail,
      };
    } catch (err) {
      console.error(`[EmailService] Erro ao enviar via SMTP:`, err);
    }
  }

  // 3. Simulated fallback (logged locally)
  const chartPreview = generateRadarChartUrl(data.scores || []);
  console.log(`=========================================`);
  console.log(`[EmailService - Simulação de Envio Local]`);
  console.log(`Destinatário: ${recipientEmail}`);
  console.log(`Assunto: ${subject}`);
  console.log(`Participante: ${data.leadName || 'Pendente'}`);
  console.log(`Média Geral: ${data.averageScore.toFixed(1)}/10`);
  console.log(`Gráfico de Raio Gerado: ${chartPreview}`);
  console.log(`=========================================`);

  return {
    success: true,
    message: `Diagnóstico registrado e simulado para ${recipientEmail}.`,
    provider: 'simulated',
    recipient: recipientEmail,
  };
}
