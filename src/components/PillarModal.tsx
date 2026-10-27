import React from 'react';
import { X, Sparkles, HelpCircle, CheckCircle2 } from 'lucide-react';
import { Pillar } from '../data/pillars';

interface PillarModalProps {
  pillar: Pillar | null;
  score: number;
  onClose: () => void;
}

export const PillarModal: React.FC<PillarModalProps> = ({ pillar, score, onClose }) => {
  if (!pillar) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-rise"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-3xl border border-border bg-card p-6 sm:p-8 backdrop-blur-xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Category & Pillar Number */}
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-primary">
          <span>Pilar {pillar.id}</span>
          <span>·</span>
          <span>{pillar.category}</span>
        </div>

        {/* Title */}
        <h3 className="mt-3 text-3xl font-medium text-foreground">{pillar.name}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{pillar.subtitle}</p>

        {/* Score Badge */}
        <div className="my-5 flex items-center gap-3 p-3.5 rounded-2xl bg-muted/60 border border-border">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gold-gradient text-primary-foreground font-display text-2xl font-bold shadow-glow">
            {score}
          </div>
          <div className="text-xs">
            <p className="font-medium text-foreground">
              {score >= 8 ? 'Nível de Alta Vibração' : score >= 6 ? 'Nível Estável / Em Expansão' : score >= 4 ? 'Atenção Necessária' : 'Ponto de Desobstrução Crítico'}
            </p>
            <p className="text-muted-foreground">Nota atribuída neste diagnóstico (escala de 1 a 10)</p>
          </div>
        </div>

        {/* Reflection */}
        <div className="space-y-4 text-sm">
          <div className="p-4 rounded-2xl bg-background/50 border border-border/80">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary mb-1.5">
              <HelpCircle className="w-4 h-4" /> Pergunta de Reflexão Sistêmica
            </div>
            <p className="leading-relaxed text-foreground/90 italic">
              "{pillar.reflection}"
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-accent/20 border border-border/80">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary mb-1.5">
              <CheckCircle2 className="w-4 h-4" /> Ação de Harmonização Recomendada
            </div>
            <p className="leading-relaxed text-foreground/90">
              {pillar.unblockAction}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-border flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Método Berkana Empresarial</span>
          <button
            onClick={onClose}
            className="rounded-full bg-gold-gradient px-5 py-2 text-xs font-semibold text-primary-foreground shadow-glow hover:opacity-90 transition-opacity"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
