import { sendDiagnosisEmail, DiagnosisEmailPayload } from '../src/server/emailService.js';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido. Utilize POST.' });
  }

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
    return res.status(200).json({ success: true, emailResult });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || 'Erro ao testar envio.' });
  }
}
