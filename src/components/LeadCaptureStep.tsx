import React, { useState } from 'react';
import { Mail, User, Phone, Sparkles, ArrowRight, Shield } from 'lucide-react';
import { SacredGeometry } from './SacredGeometry';

export interface LeadFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
}

interface LeadCaptureStepProps {
  initialData: LeadFormData;
  onSubmit: (data: LeadFormData) => void;
  averageScore: number;
}

export const LeadCaptureStep: React.FC<LeadCaptureStepProps> = ({
  initialData,
  onSubmit,
  averageScore,
}) => {
  const [formData, setFormData] = useState<LeadFormData>(initialData);

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '').slice(0, 11);
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 10) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setFormData((prev) => ({ ...prev, phone: formatted }));
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <section className="flex min-h-[78vh] flex-col justify-center animate-rise">
      <div className="relative mx-auto w-full max-w-xl rounded-3xl border border-border bg-card/90 p-6 sm:p-10 backdrop-blur-xl shadow-2xl overflow-hidden">
        {/* Subtle Background Geometry */}
        <div className="absolute -right-16 -top-16 opacity-15 pointer-events-none">
          <SacredGeometry className="w-48" />
        </div>

        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs text-primary font-medium uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Diagnóstico Concluído</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-foreground">
            Seu Mapa de Prosperidade <span className="text-gold-gradient italic">está pronto</span>
          </h2>

          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            Se desejar, preencha seus dados para personalizar sua devolutiva e facilitar o contato com a equipe Berkana.
          </p>
        </div>

        {/* Score Teaser */}
        <div className="my-6 p-4 rounded-2xl bg-muted/40 border border-border flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Média Calculada</p>
            <p className="text-2xl font-bold font-display text-primary">
              {averageScore.toFixed(1)} <span className="text-xs text-muted-foreground font-normal">/ 10</span>
            </p>
          </div>
          <div className="text-right text-xs text-muted-foreground">
            <p className="text-foreground font-medium">12 Pilares Avaliados</p>
            <p className="text-[11px] text-muted-foreground/80">Campos opcionais</p>
          </div>
        </div>

        {/* Lead Capture Form - Exactly 3 fields: Nome, Telefone e E-mail */}
        <form onSubmit={handleContinue} className="space-y-4">
          {/* 1. Nome Completo (Opcional) */}
          <div>
            <label htmlFor="lead-name" className="block text-xs uppercase tracking-wider text-muted-foreground mb-1 ml-1">
              Nome Completo <span className="text-muted-foreground/60 font-normal lowercase">(opcional)</span>
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                id="lead-name"
                type="text"
                placeholder="Ex: Ana Silva"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full rounded-2xl border border-border bg-background/60 pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* 2. Telefone / WhatsApp (Opcional) */}
          <div>
            <label htmlFor="lead-phone" className="block text-xs uppercase tracking-wider text-muted-foreground mb-1 ml-1">
              Telefone / WhatsApp <span className="text-muted-foreground/60 font-normal lowercase">(opcional)</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                id="lead-phone"
                type="tel"
                placeholder="(11) 99999-9999"
                value={formData.phone}
                onChange={handlePhoneChange}
                className="w-full rounded-2xl border border-border bg-background/60 pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* 3. E-mail (Opcional) */}
          <div>
            <label htmlFor="lead-email" className="block text-xs uppercase tracking-wider text-muted-foreground mb-1 ml-1">
              E-mail <span className="text-muted-foreground/60 font-normal lowercase">(opcional)</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                id="lead-email"
                type="email"
                placeholder="Ex: ana@empresa.com.br"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                className="w-full rounded-2xl border border-border bg-background/60 pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Main Action Button */}
          <button
            type="submit"
            className="w-full mt-6 rounded-full bg-gold-gradient py-4 font-semibold text-primary-foreground shadow-glow transition-all duration-300 hover:scale-[1.02] active:scale-98 flex items-center justify-center gap-2 cursor-pointer text-base"
          >
            <span>Ver Meu Mapa de Prosperidade</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Privacy Note */}
          <div className="flex items-center justify-center pt-2 text-xs text-muted-foreground gap-1.5">
            <Shield className="w-3.5 h-3.5 text-primary" />
            <span>Seus dados são confidenciais e protegidos.</span>
          </div>
        </form>
      </div>
    </section>
  );
};
