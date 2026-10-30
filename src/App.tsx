import React, { useState, useEffect, useMemo, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Share2,
  Copy,
  Check,
  Printer,
  RotateCcw,
  Sparkles,
  Info,
  ChevronRight,
  MessageCircle,
  Building2,
  User,
} from 'lucide-react';
import { PILLARS, Pillar, WHATSAPP_PHONE, getDiagnosis } from './data/pillars';
import { SacredGeometry } from './components/SacredGeometry';
import { RadarChart } from './components/RadarChart';
import { PillarModal } from './components/PillarModal';
import { LeadCaptureStep, LeadFormData } from './components/LeadCaptureStep';

type AppStep = 'welcome' | 'quiz' | 'lead_capture' | 'result';

interface CompletedDiagnosis {
  scores: number[];
  averageScore: number;
  lowestThree: Array<{ score: number; pillar: Pillar; index: number }>;
  highestThree: Array<{ score: number; pillar: Pillar; index: number }>;
  primaryUnblockPillar: Pillar;
  leadName?: string;
  companyName?: string;
  whatsAppUrl: string;
}

export default function App() {
  const [step, setStep] = useState<AppStep>('welcome');
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Initial state: all 12 pillars in the middle (5)
  const [scores, setScores] = useState<number[]>(() => Array(12).fill(5));

  // Initial state: all input fields blank
  const [leadInfo, setLeadInfo] = useState<LeadFormData>(() => ({
    name: '',
    email: '',
    phone: '',
    company: '',
  }));

  // Holds the completed report snapshot for the result screen while active inputs are reset
  const [completedDiagnosis, setCompletedDiagnosis] = useState<CompletedDiagnosis | null>(null);

  const [selectedPillarForModal, setSelectedPillarForModal] = useState<Pillar | null>(null);
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);
  const hasSentInitialEmail = useRef<boolean>(false);

  // Check URL parameters on mount to load shared/emailed diagnosis or start fresh
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const sParam = params.get('s');
      if (sParam) {
        const parsedScores = sParam
          .split(',')
          .map((v) => Math.min(10, Math.max(1, parseInt(v, 10) || 5)));

        if (parsedScores.length === 12) {
          const nameParam = params.get('nome') || '';
          const companyParam = params.get('empresa') || '';
          const phoneParam = params.get('tel') || '';
          const emailParam = params.get('email') || '';

          const avg = parsedScores.reduce((a, b) => a + b, 0) / 12;
          const sorted = parsedScores
            .map((score, index) => ({ score, pillar: PILLARS[index], index }))
            .sort((a, b) => a.score - b.score);
          const low3 = sorted.slice(0, 3);
          const high3 = sorted.slice(-3).reverse();
          const unblock = low3[0]?.pillar || PILLARS[0];

          const targetText = `Olá Fabiana! Fiz o Diagnóstico Estratégico de Prosperidade${
            companyParam ? ` para a empresa "${companyParam}"` : ''
          }${nameParam ? ` (${nameParam})` : ''} com média geral de ${avg.toFixed(
            1
          )}/10. O principal ponto a harmonizar foi "${
            unblock.name
          }" e quero agendar minha devolutiva completa.`;
          const finalWhatsAppUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(targetText)}`;

          setCompletedDiagnosis({
            scores: parsedScores,
            averageScore: avg,
            lowestThree: low3,
            highestThree: high3,
            primaryUnblockPillar: unblock,
            leadName: nameParam,
            companyName: companyParam,
            whatsAppUrl: finalWhatsAppUrl,
          });

          setLeadInfo({
            name: nameParam,
            company: companyParam,
            phone: phoneParam,
            email: emailParam,
          });

          setStep('result');
          return;
        }
      }

      // If no query parameter, clean up legacy session data to ensure blank state
      localStorage.removeItem('berkana_scores');
      localStorage.removeItem('berkana_lead');
      localStorage.removeItem('berkana_company');
    } catch {
      // Ignore
    }
  }, []);

  // Average score & sorted pillars for active quiz
  const averageScore = useMemo(() => {
    const sum = scores.reduce((acc, curr) => acc + curr, 0);
    return sum / 12;
  }, [scores]);

  const sortedPillars = useMemo(() => {
    return scores
      .map((score, index) => ({ score, pillar: PILLARS[index], index }))
      .sort((a, b) => a.score - b.score);
  }, [scores]);

  const lowestThree = sortedPillars.slice(0, 3);
  const highestThree = sortedPillars.slice(-3).reverse();
  const primaryUnblockPillar = lowestThree[0]?.pillar || PILLARS[0];

  // Silently dispatch email to fabianaberkana@gmail.com with radar chart and online link
  const silentDispatchEmail = async (contactData: LeadFormData, activeScores = scores, customReportUrl?: string) => {
    try {
      const activeAvg = activeScores.reduce((a, b) => a + b, 0) / 12;
      const sorted = activeScores
        .map((score, index) => ({ score, pillar: PILLARS[index], index }))
        .sort((a, b) => a.score - b.score);
      const low3 = sorted.slice(0, 3);
      const high3 = sorted.slice(-3).reverse();
      const unblock = low3[0]?.pillar || PILLARS[0];

      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const generatedReportUrl = customReportUrl || `${origin}?resultado=1&s=${activeScores.join(',')}${
        contactData.company ? `&empresa=${encodeURIComponent(contactData.company)}` : ''
      }${contactData.name ? `&nome=${encodeURIComponent(contactData.name)}` : ''}`;

      const payload = {
        leadName: contactData.name || (contactData.company ? `Empresa ${contactData.company}` : 'Participante (Pendente/Opcional)'),
        leadEmail: contactData.email || '',
        leadPhone: contactData.phone || '',
        companyName: contactData.company || '',
        scores: activeScores,
        averageScore: activeAvg,
        lowestThree: low3.map((item) => ({
          id: item.pillar.id,
          name: item.pillar.name,
          score: item.score,
          subtitle: item.pillar.subtitle,
        })),
        highestThree: high3.map((item) => ({
          id: item.pillar.id,
          name: item.pillar.name,
          score: item.score,
          subtitle: item.pillar.subtitle,
        })),
        primaryUnblockPillar: {
          id: unblock.id,
          name: unblock.name,
          subtitle: unblock.subtitle,
        },
        diagnosisText: getDiagnosis(activeAvg),
        submittedAt: new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
        reportUrl: generatedReportUrl,
      };

      await fetch('/api/send-diagnosis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      // Fail silently - never disrupt user experience
      console.warn('Silent email delivery processed:', err);
    }
  };

  // Called immediately when quiz reaches the end
  const handleFinishQuiz = () => {
    hasSentInitialEmail.current = true;
    silentDispatchEmail(leadInfo, scores);
    setStep('lead_capture');
  };

  // Keyboard navigation for quiz
  useEffect(() => {
    if (step !== 'quiz') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        setScores((prev) =>
          prev.map((val, i) => (i === currentIndex ? Math.min(10, val + 1) : val))
        );
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        setScores((prev) =>
          prev.map((val, i) => (i === currentIndex ? Math.max(1, val - 1) : val))
        );
      } else if (e.key === 'Enter') {
        if (currentIndex === 11) {
          handleFinishQuiz();
        } else {
          setCurrentIndex((prev) => prev + 1);
        }
      } else if (/^[1-9]$/.test(e.key)) {
        const num = parseInt(e.key, 10);
        setScores((prev) => prev.map((val, i) => (i === currentIndex ? num : val)));
      } else if (e.key === '0') {
        setScores((prev) => prev.map((val, i) => (i === currentIndex ? 10 : val)));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [step, currentIndex, leadInfo, scores]);

  // Trigger celebration confetti upon reaching result
  useEffect(() => {
    if (step === 'result') {
      try {
        confetti({
          particleCount: 65,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#88186D', '#D47C34', '#DE7A85', '#FAF6F0'],
        });
      } catch {
        // Safe fallback
      }
    }
  }, [step]);

  const updateCurrentScore = (value: number) => {
    setScores((prev) => prev.map((val, idx) => (idx === currentIndex ? value : val)));
  };

  const currentScore = scores[currentIndex] ?? 5;
  const currentPillar = PILLARS[currentIndex];

  // Finalize diagnosis: send email, snapshot result, and restore all inputs to blank and selections to 5
  const handleLeadSubmit = (formData: LeadFormData) => {
    const currentScoresSnapshot = [...scores];
    const currentAverageSnapshot = averageScore;
    const currentLowestSnapshot = [...lowestThree];
    const currentHighestSnapshot = [...highestThree];
    const currentUnblockSnapshot = primaryUnblockPillar;

    const targetText = `Olá Fabiana! Fiz o Diagnóstico Estratégico de Prosperidade${
      formData.company ? ` para a empresa "${formData.company}"` : ''
    }${formData.name ? ` (${formData.name})` : ''} com média geral de ${currentAverageSnapshot.toFixed(
      1
    )}/10. O principal ponto a harmonizar foi "${
      currentUnblockSnapshot.name
    }" e quero agendar minha devolutiva completa.`;
    const finalWhatsAppUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(targetText)}`;

    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const fullReportUrl = `${origin}?resultado=1&s=${currentScoresSnapshot.join(',')}${
      formData.company ? `&empresa=${encodeURIComponent(formData.company)}` : ''
    }${formData.name ? `&nome=${encodeURIComponent(formData.name)}` : ''}`;

    // 1. Snapshot the completed diagnosis for display
    setCompletedDiagnosis({
      scores: currentScoresSnapshot,
      averageScore: currentAverageSnapshot,
      lowestThree: currentLowestSnapshot,
      highestThree: currentHighestSnapshot,
      primaryUnblockPillar: currentUnblockSnapshot,
      leadName: formData.name,
      companyName: formData.company,
      whatsAppUrl: finalWhatsAppUrl,
    });

    // 2. Send email with the final completed contact data, radar chart, and direct link
    if (formData.name || formData.email || formData.phone || formData.company) {
      silentDispatchEmail(formData, currentScoresSnapshot, fullReportUrl);
    }

    // 3. RESTORE ALL FORM INPUTS AND ALL SELECTIONS TO INITIAL STATE:
    // Dados em branco e seleções no meio (5)
    setScores(Array(12).fill(5));
    setLeadInfo({
      name: '',
      email: '',
      phone: '',
      company: '',
    });
    setCurrentIndex(0);
    hasSentInitialEmail.current = false;

    try {
      localStorage.removeItem('berkana_scores');
      localStorage.removeItem('berkana_lead');
      localStorage.removeItem('berkana_company');
    } catch {
      // Ignore
    }

    // 4. Move to result view
    setStep('result');
  };

  // Data displayed on result screen (from snapshot or active)
  const displayScores = completedDiagnosis ? completedDiagnosis.scores : scores;
  const displayAverage = completedDiagnosis ? completedDiagnosis.averageScore : averageScore;
  const displayLowest = completedDiagnosis ? completedDiagnosis.lowestThree : lowestThree;
  const displayHighest = completedDiagnosis ? completedDiagnosis.highestThree : highestThree;
  const displayUnblock = completedDiagnosis ? completedDiagnosis.primaryUnblockPillar : primaryUnblockPillar;
  const displayCompanyName = completedDiagnosis ? completedDiagnosis.companyName : leadInfo.company;
  const displayLeadName = completedDiagnosis ? completedDiagnosis.leadName : leadInfo.name;
  const displayWhatsAppUrl = completedDiagnosis
    ? completedDiagnosis.whatsAppUrl
    : `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(
        `Olá Fabiana! Fiz o Diagnóstico Estratégico de Prosperidade com média geral de ${displayAverage.toFixed(1)}/10.`
      )}`;

  // Copy textual summary to clipboard
  const handleCopySummary = () => {
    const lines = [
      `🌟 Diagnóstico Estratégico de Prosperidade | Método Berkana`,
      displayLeadName ? `Participante: ${displayLeadName}` : '',
      displayCompanyName ? `Empresa: ${displayCompanyName}` : '',
      `Média Geral: ${displayAverage.toFixed(1)}/10`,
      ``,
      `✨ Maiores Potenciais:`,
      ...displayHighest.map((item) => `• ${item.pillar.name}: ${item.score}/10`),
      ``,
      `🎯 Pontos de Harmonização:`,
      ...displayLowest.map((item) => `• ${item.pillar.name}: ${item.score}/10`),
      ``,
      `⚡ Principal Porta de Desobstrução: ${displayUnblock.name}`,
      `Orientação: ${getDiagnosis(displayAverage)}`,
      ``,
      `Realizado com o Método Berkana de Fabiana Berkana.`,
    ]
      .filter(Boolean)
      .join('\n');

    navigator.clipboard.writeText(lines);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  // Restart diagnosis: everything back to blank and 5
  const handleRestart = () => {
    setScores(Array(12).fill(5));
    setLeadInfo({
      name: '',
      email: '',
      phone: '',
      company: '',
    });
    setCurrentIndex(0);
    hasSentInitialEmail.current = false;
    setCompletedDiagnosis(null);
    try {
      localStorage.removeItem('berkana_scores');
      localStorage.removeItem('berkana_lead');
      localStorage.removeItem('berkana_company');
      // Clean query string from browser bar if present
      if (window.history.replaceState) {
        window.history.replaceState(null, '', window.location.pathname);
      }
    } catch {
      // Ignore
    }
    setStep('welcome');
  };

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-8 sm:px-6 sm:py-10 text-foreground selection:bg-primary/30">
      {/* Background Sacred Geometry Watermarks with Smooth Cosmic Rotation */}
      <SacredGeometry className="pointer-events-none absolute -right-36 -top-36 w-[32rem] sm:w-[38rem] animate-spin-slow opacity-35" />
      <SacredGeometry className="pointer-events-none absolute -bottom-48 -left-48 w-[34rem] sm:w-[42rem] animate-spin-slow opacity-25" />

      <div className="relative mx-auto max-w-2xl">
        {/* ===================== WELCOME VIEW ===================== */}
        {step === 'welcome' && (
          <section className="flex min-h-[78vh] animate-rise flex-col items-center justify-center text-center">
            {/* Sacred Geometry Center Emblem */}
            <div className="relative mb-6">
              <SacredGeometry className="w-28 sm:w-32 mx-auto drop-shadow-[0_0_20px_rgba(212,124,52,0.3)]" />
            </div>

            <p className="text-xs uppercase tracking-[0.35em] text-primary font-medium">
              Método Berkana Empresarial
            </p>

            <h1 className="mt-4 text-4xl sm:text-6xl font-medium leading-[1.15] tracking-tight">
              Diagnóstico Estratégico de{' '}
              <span className="text-gold-gradient italic font-normal">Prosperidade</span>
            </h1>

            <p className="mt-6 max-w-lg text-base sm:text-lg leading-relaxed text-muted-foreground font-light">
              Criado por Fabiana Berkana, este diagnóstico une a sua percepção prática de empresário à harmonização sistêmica e à radiestesia, revelando potenciais de crescimento e pontos ocultos nos 12 pilares do seu negócio.
            </p>

            {/* Optional Initial Identification (Blank by default) */}
            <div className="mt-8 w-full max-w-sm space-y-3 text-left">
              <div>
                <label htmlFor="company" className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5 ml-1">
                  Nome da Empresa ou Negócio <span className="text-muted-foreground/60 font-normal lowercase">(opcional)</span>
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    id="company"
                    type="text"
                    placeholder="Ex: Minha Empresa ou Clínica"
                    value={leadInfo.company}
                    onChange={(e) =>
                      setLeadInfo((prev) => ({ ...prev, company: e.target.value }))
                    }
                    className="w-full rounded-2xl border border-border bg-card/80 pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none backdrop-blur-sm transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="initial-name" className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5 ml-1">
                  Seu Nome <span className="text-muted-foreground/60 font-normal lowercase">(opcional)</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    id="initial-name"
                    type="text"
                    placeholder="Ex: Ana Silva"
                    value={leadInfo.name}
                    onChange={(e) =>
                      setLeadInfo((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="w-full rounded-2xl border border-border bg-card/80 pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none backdrop-blur-sm transition-colors"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep('quiz')}
              className="mt-8 rounded-full bg-gold-gradient px-9 py-4 font-semibold text-primary-foreground shadow-glow transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer text-base sm:text-lg"
            >
              Iniciar Diagnóstico Estratégico
            </button>

            <p className="mt-4 text-xs text-muted-foreground tracking-wide">
              12 pilares · menos de 2 minutos
            </p>
          </section>
        )}

        {/* ===================== QUIZ VIEW ===================== */}
        {step === 'quiz' && currentPillar && (
          <section className="flex min-h-[78vh] flex-col justify-center animate-rise">
            {/* Step Progress Bar */}
            <div className="mb-8 flex items-center gap-3">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-gold-gradient transition-all duration-500 rounded-full"
                  style={{ width: `${((currentIndex + 1) / 12) * 100}%` }}
                />
              </div>
              <span className="text-xs font-mono font-medium text-muted-foreground">
                {currentIndex + 1} / 12
              </span>
            </div>

            {/* Main Question Card */}
            <div
              key={currentIndex}
              className="animate-rise rounded-3xl border border-border bg-card/90 p-6 sm:p-10 backdrop-blur-xl shadow-2xl relative"
            >
              <div className="flex justify-between items-start">
                <p className="text-xs uppercase tracking-[0.3em] text-primary font-medium">
                  Pilar {currentIndex + 1} de 12
                </p>
                <button
                  onClick={() => setSelectedPillarForModal(currentPillar)}
                  className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                  title="Ver detalhes e reflexão deste pilar"
                >
                  <Info className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Reflexão</span>
                </button>
              </div>

              <h2 className="mt-3 text-3xl sm:text-4xl font-medium tracking-tight text-foreground">
                {currentPillar.name}
              </h2>
              <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed">
                {currentPillar.subtitle}
              </p>

              {/* Big Score Display */}
              <div className="my-8 text-center font-display text-7xl sm:text-8xl text-gold-gradient drop-shadow-sm font-semibold select-none">
                {currentScore}
              </div>

              {/* Interactive Smooth Range Slider (Centered at 5 initially) */}
              <div className="px-1">
                <input
                  type="range"
                  min={1}
                  max={10}
                  step={1}
                  value={currentScore}
                  onChange={(e) => updateCurrentScore(Number(e.target.value))}
                  className="pillar"
                  style={{
                    ['--p' as string]: `${((currentScore - 1) / 9) * 100}%`,
                  }}
                  aria-label={currentPillar.name}
                />
              </div>

              {/* Direct Numeric Buttons 1 to 10 */}
              <div className="mt-6 grid grid-cols-10 gap-1 sm:gap-1.5">
                {Array.from({ length: 10 }, (_, i) => i + 1).map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => updateCurrentScore(val)}
                    className={`rounded-lg py-2.5 text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                      val === currentScore
                        ? 'bg-primary text-primary-foreground font-bold shadow-glow scale-105'
                        : 'bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>

              {/* Scale Labels */}
              <div className="mt-3 flex justify-between text-xs text-muted-foreground select-none px-1">
                <span>1 · Frágil / Bloqueado</span>
                <span>10 · Pleno / Fluido</span>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="mt-6 flex justify-between items-center">
              <button
                type="button"
                onClick={() => {
                  if (currentIndex === 0) {
                    setStep('welcome');
                  } else {
                    setCurrentIndex((prev) => prev - 1);
                  }
                }}
                className="rounded-full border border-border px-6 py-3 text-sm text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors cursor-pointer"
              >
                Voltar
              </button>

              <button
                type="button"
                onClick={() => {
                  if (currentIndex === 11) {
                    handleFinishQuiz();
                  } else {
                    setCurrentIndex((prev) => prev + 1);
                  }
                }}
                className="rounded-full bg-gold-gradient px-8 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <span>{currentIndex === 11 ? 'Finalizar e Ver Resultado' : 'Próximo'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <p className="mt-4 text-center text-[11px] text-muted-foreground/60">
              Dica: Você também pode usar as setas do teclado e a tecla Enter para avançar.
            </p>
          </section>
        )}

        {/* ===================== OPTIONAL LEAD DETAILS STEP ===================== */}
        {step === 'lead_capture' && (
          <LeadCaptureStep
            initialData={leadInfo}
            onSubmit={handleLeadSubmit}
            averageScore={averageScore}
          />
        )}

        {/* ===================== RESULT VIEW ===================== */}
        {step === 'result' && (
          <section className="animate-rise space-y-6 pb-12">
            {/* Header / Score Average */}
            <div className="text-center pt-2">
              <p className="text-xs uppercase tracking-[0.35em] text-primary font-medium">
                Seu Mapa de Prosperidade
              </p>
              {displayCompanyName && (
                <p className="text-sm text-muted-foreground mt-1">
                  Avaliação para: <strong className="text-foreground">{displayCompanyName}</strong>
                  {displayLeadName ? ` · Líder: ${displayLeadName}` : ''}
                </p>
              )}
              <h1 className="mt-3 text-4xl sm:text-5xl font-medium tracking-tight">
                Média geral <span className="text-gold-gradient font-bold">{displayAverage.toFixed(1)}</span>
              </h1>
              <p className="mt-1 text-xs text-muted-foreground">
                Baseado na harmonia sistêmica dos 12 pilares empresariais
              </p>
            </div>

            {/* Radar Chart Display */}
            <div className="flex flex-col items-center rounded-3xl border border-border bg-card/90 p-5 sm:p-6 backdrop-blur-md shadow-2xl">
              <RadarChart
                scores={displayScores}
                onSelectPillar={(index) => setSelectedPillarForModal(PILLARS[index])}
              />
              <p className="mt-3 text-[11px] text-muted-foreground text-center">
                Clique nos números ao redor da teia ou nos pilares abaixo para ler a reflexão sistêmica detalhada.
              </p>
            </div>

            {/* Numbered List of all 12 Pillars with Click Action */}
            <div className="rounded-2xl border border-border/80 bg-card/60 p-4 backdrop-blur-sm">
              <ol className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-muted-foreground sm:grid-cols-3">
                {PILLARS.map((pillar, idx) => (
                  <li
                    key={pillar.id}
                    onClick={() => setSelectedPillarForModal(pillar)}
                    className="flex items-center justify-between p-1.5 rounded-lg hover:bg-muted/40 cursor-pointer transition-colors"
                  >
                    <span className="truncate pr-1">
                      <span className="text-primary font-medium">{idx + 1}.</span> {pillar.name}
                    </span>
                    <span className="text-foreground font-semibold shrink-0">
                      {displayScores[idx]}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Breakdown Cards: Harmonization vs Potentials */}
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Harmonization Points (Top 3 Lowest) */}
              <div className="rounded-3xl border border-red-200/40 p-6 bg-red-50/40 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-medium text-foreground">Pontos de harmonização</h3>
                  <span className="text-xs uppercase tracking-wider text-red-600 font-semibold">Prioridades</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 mb-3">
                  Pilares que pedem atenção e destravamento para desbloquear o fluxo:
                </p>
                <ul className="space-y-2.5">
                  {displayLowest.map(({ pillar, score }) => (
                    <li
                      key={pillar.id}
                      onClick={() => setSelectedPillarForModal(pillar)}
                      className="flex items-center justify-between p-2 rounded-xl bg-card/80 hover:bg-card border border-red-200/50 text-sm cursor-pointer transition-colors"
                    >
                      <div>
                        <span className="font-medium text-foreground">{pillar.name}</span>
                        <p className="text-[11px] text-muted-foreground line-clamp-1">{pillar.subtitle}</p>
                      </div>
                      <span className="text-red-600 font-bold text-base px-2">{score}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Potentials (Top 3 Highest) */}
              <div className="rounded-3xl border border-emerald-200/40 p-6 bg-emerald-50/40 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-medium text-foreground">Maiores potenciais</h3>
                  <span className="text-xs uppercase tracking-wider text-emerald-700 font-semibold">Fortalezas</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 mb-3">
                  Pilares sólidos e de alta vibração que impulsionam o seu negócio:
                </p>
                <ul className="space-y-2.5">
                  {displayHighest.map(({ pillar, score }) => (
                    <li
                      key={pillar.id}
                      onClick={() => setSelectedPillarForModal(pillar)}
                      className="flex items-center justify-between p-2 rounded-xl bg-card/80 hover:bg-card border border-emerald-200/50 text-sm cursor-pointer transition-colors"
                    >
                      <div>
                        <span className="font-medium text-foreground">{pillar.name}</span>
                        <p className="text-[11px] text-muted-foreground line-clamp-1">{pillar.subtitle}</p>
                      </div>
                      <span className="text-emerald-700 font-bold text-base px-2">{score}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Energetic Diagnosis & Berkana Directive */}
            <div className="rounded-3xl border border-border bg-card/90 p-7 sm:p-8 backdrop-blur-md shadow-xl relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 opacity-15 pointer-events-none">
                <SacredGeometry className="w-48" />
              </div>

              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <h3 className="text-2xl sm:text-3xl italic text-primary font-display">
                  Direcionamento energético
                </h3>
              </div>

              <p className="mt-4 leading-relaxed text-base sm:text-lg text-foreground/95">
                {getDiagnosis(displayAverage)}
              </p>

              <div className="mt-4 p-4 rounded-2xl bg-muted/60 border border-border/80">
                <p className="leading-relaxed text-sm text-foreground/80">
                  O pilar <strong className="text-primary font-semibold">{displayUnblock.name}</strong> é hoje a principal porta de desobstrução — ao harmonizá-lo, toda a roda se reequilibra.
                </p>
              </div>

              <p className="mt-6 font-display text-lg italic text-primary/90">
                — Método Berkana · Fabiana Berkana
              </p>
            </div>

            {/* Primary Action Button (WhatsApp Devolutiva) */}
            <div className="text-center space-y-4 pt-2">
              <a
                href={displayWhatsAppUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gold-gradient px-8 py-4 font-semibold text-primary-foreground shadow-glow hover:scale-105 active:scale-95 transition-all text-base sm:text-lg cursor-pointer w-full sm:w-auto"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Agendar minha devolutiva completa</span>
              </a>

              {/* Utility Tools: Copy summary, Print/PDF, Refazer */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCopySummary}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs rounded-full border border-border bg-card/80 text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
                >
                  {copiedNotification ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600 font-medium">Resumo Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar Resumo</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs rounded-full border border-border bg-card/80 text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimir / Salvar PDF</span>
                </button>

                <button
                  type="button"
                  onClick={handleRestart}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs rounded-full border border-border bg-card/80 text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Refazer Diagnóstico</span>
                </button>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Deep Reflection Modal for selected pillar */}
      <PillarModal
        pillar={selectedPillarForModal}
        score={selectedPillarForModal ? displayScores[selectedPillarForModal.id - 1] : 5}
        onClose={() => setSelectedPillarForModal(null)}
      />
    </main>
  );
}
