import type { IncomingMessage, ServerResponse } from 'http';
import { sendDiagnosisEmail, DiagnosisEmailPayload } from '../src/server/emailService.js';

export default async function handler(req: any, res: any) {
  // Enable CORS if needed
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido. Utilize POST.' });
  }

  try {
    const payload: DiagnosisEmailPayload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    if (!payload || !payload.scores || !Array.isArray(payload.scores)) {
      return res.status(400).json({ error: 'Dados inválidos.' });
    }

    const emailResult = await sendDiagnosisEmail(payload);

    return res.status(200).json({
      success: true,
      emailResult,
      recipient: emailResult.recipient,
      message: 'Diagnóstico enviado para o seu e-mail com sucesso.',
    });
  } catch (err: any) {
    console.error('Erro na Vercel Serverless Function:', err);
    return res.status(500).json({
      success: false,
      error: err?.message || 'Erro interno ao disparar e-mail.',
    });
  }
}
