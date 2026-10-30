import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { sendDiagnosisEmail, DiagnosisEmailPayload } from './src/server/emailService';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// In-memory leads storage for dashboard / quick recovery
const capturedLeads: Array<DiagnosisEmailPayload & { id: string; receivedAt: string }> = [];

// API Endpoint to send diagnosis email
app.post('/api/send-diagnosis', async (req, res) => {
  try {
    const payload: DiagnosisEmailPayload = req.body;

    if (!payload || !payload.scores || !Array.isArray(payload.scores)) {
      return res.status(400).json({
        success: false,
        error: 'Dados de diagnóstico inválidos.',
      });
    }

    const leadRecord = {
      ...payload,
      id: Math.random().toString(36).substring(2, 9),
      receivedAt: new Date().toISOString(),
    };
    capturedLeads.unshift(leadRecord);

    const emailResult = await sendDiagnosisEmail(payload);

    return res.json({
      success: true,
      leadId: leadRecord.id,
      emailResult,
      recipient: emailResult.recipient,
      message: 'Diagnóstico processado e enviado com sucesso.',
    });
  } catch (error: any) {
    console.error('Erro ao processar diagnóstico:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Erro interno ao enviar diagnóstico por e-mail.',
    });
  }
});

// API Endpoint to send a test email
app.post('/api/test-email', async (_req, res) => {
  try {
    const testPayload: DiagnosisEmailPayload = {
      leadName: 'Teste de Integração Berkana',
      leadEmail: 'fabianaberkana@gmail.com',
      leadPhone: '(11) 93005-7499',
      companyName: 'Empresa Teste Método Berkana',
      scores: [10, 9, 8, 9, 8, 9, 8, 9, 7, 9, 10, 9],
      averageScore: 8.8,
      lowestThree: [
        { id: 9, name: 'Crises e Resiliência', score: 7 },
        { id: 3, name: 'Cultura e Clima', score: 8 },
        { id: 5, name: 'Liderança e Decisão', score: 8 },
      ],
      highestThree: [
        { id: 1, name: 'Missão e Valores', score: 10 },
        { id: 11, name: 'Reputação da Marca', score: 10 },
        { id: 2, name: 'Propósito Organizacional', score: 9 },
      ],
      primaryUnblockPillar: { id: 9, name: 'Crises e Resiliência' },
      diagnosisText: 'Teste de integração bem-sucedido! O serviço de e-mail está configurado e pronto para receber leads automaticamente.',
      submittedAt: new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
    };

    const emailResult = await sendDiagnosisEmail(testPayload);
    return res.json({ success: true, emailResult });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || 'Erro ao testar envio.' });
  }
});

// API Endpoint to list captured leads
app.get('/api/leads', (_req, res) => {
  return res.json({
    total: capturedLeads.length,
    recipient: process.env.RECIPIENT_EMAIL || 'fabianaberkana@gmail.com',
    leads: capturedLeads,
  });
});

// Health check endpoint
app.get('/api/health', (_req, res) => {
  return res.json({
    status: 'ok',
    recipientEmail: process.env.RECIPIENT_EMAIL || 'fabianaberkana@gmail.com',
    hasResend: !!process.env.RESEND_API_KEY,
    hasSmtp: !!(process.env.SMTP_HOST && process.env.SMTP_USER),
  });
});

// Download project ZIP endpoint
app.get(['/api/download-zip', '/diagnostico-berkana.zip'], (_req, res) => {
  const zipPath = path.resolve(__dirname, 'public', 'diagnostico-berkana.zip');
  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', 'attachment; filename="diagnostico-berkana.zip"');
  return res.sendFile(zipPath);
});

// Download mockup ZIP endpoint
app.get('/mockup-paletas-berkana.zip', (_req, res) => {
  const zipPath = path.resolve(__dirname, 'public', 'mockup-paletas-berkana.zip');
  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', 'attachment; filename="mockup-paletas-berkana.zip"');
  return res.sendFile(zipPath);
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    // In dev: mount Vite middlewares
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In prod: serve dist files
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] Rodando em http://localhost:${PORT}`);
    console.log(`[Server] E-mail de destino configurado: ${process.env.RECIPIENT_EMAIL || 'fabianaberkana@gmail.com'}`);
  });
}

startServer();
