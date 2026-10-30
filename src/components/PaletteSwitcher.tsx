import React, { useState } from 'react';
import { Palette, Check, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

export type ThemeId =
  | 'marfim-magenta'
  | 'champagne-oliva'
  | 'ameixa-ouro'
  | 'esmeralda-bronze'
  | 'cosmica-original';

interface PaletteSwitcherProps {
  currentTheme: ThemeId;
  onThemeChange: (theme: ThemeId) => void;
}

export const PaletteSwitcher: React.FC<PaletteSwitcherProps> = ({
  currentTheme,
  onThemeChange,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const palettes: Array<{
    id: ThemeId;
    name: string;
    subtitle: string;
    type: 'Clara' | 'Escura';
    swatches: string[];
    isRecommended?: boolean;
  }> = [
    {
      id: 'marfim-magenta',
      name: '1. Marfim & Magenta Real',
      subtitle: 'Fundo marfim com o magenta vibrante e âmbar solar do logo',
      type: 'Clara',
      swatches: ['#88186D', '#D47C34', '#769043', '#FAF6F0'],
      isRecommended: true,
    },
    {
      id: 'champagne-oliva',
      name: '2. Champagne & Oliva Dourado',
      subtitle: 'Tons acolhedores de areia quente, verde oliva e ouro âmbar',
      type: 'Clara',
      swatches: ['#6E873C', '#D47C34', '#DE7A85', '#F6F2EB'],
    },
    {
      id: 'ameixa-ouro',
      name: '3. Ameixa Imperial & Ouro',
      subtitle: 'Fundo ameixa noturno místico com magenta e âmbar iluminados',
      type: 'Escura',
      swatches: ['#D43CA8', '#E28D3E', '#8FA74B', '#1C0F1E'],
    },
    {
      id: 'esmeralda-bronze',
      name: '4. Esmeralda Noturna & Bronze',
      subtitle: 'Fundo floresta profunda com verde oliva dourado e bronze',
      type: 'Escura',
      swatches: ['#8FB246', '#E28D3E', '#DE7A85', '#0E1813'],
    },
    {
      id: 'cosmica-original',
      name: '5. Cósmica Noturna Original',
      subtitle: 'O visual clássico violeta com dourado celestial anterior',
      type: 'Escura',
      swatches: ['#f1ce7c', '#5f1e42', '#2c1445', '#161021'],
    },
  ];

  return (
    <aside
      aria-label="Seletor de paletas de cores para avaliação da cliente"
      className="fixed bottom-4 right-4 z-50 max-w-sm w-[calc(100vw-2rem)] select-none animate-rise"
    >
      <div className="rounded-3xl border border-primary/30 bg-card/95 p-3 sm:p-3.5 backdrop-blur-xl shadow-2xl transition-all">
        {/* Toggle Bar Header */}
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-glow">
              <Palette className="h-3.5 w-3.5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <span>Escolher Paleta de Cores</span>
                <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold text-primary">
                  5 Opções
                </span>
              </p>
              <p className="text-[11px] text-muted-foreground">Clique para testar cada cor no app</p>
            </div>
          </div>

          <button
            type="button"
            className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label={isOpen ? 'Recolher opções' : 'Expandir opções'}
          >
            {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </button>
        </div>

        {/* Options List */}
        {isOpen && (
          <div className="mt-2.5 space-y-1.5 border-t border-border pt-2 max-h-[55vh] overflow-y-auto pr-0.5">
            {palettes.map((p) => {
              const isSelected = currentTheme === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => onThemeChange(p.id)}
                  className={`group flex cursor-pointer flex-col rounded-2xl p-2 transition-all duration-200 border ${
                    isSelected
                      ? 'border-primary bg-primary/10 shadow-xs'
                      : 'border-border/60 hover:border-primary/40 hover:bg-muted/40'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-all ${
                          isSelected
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-muted-foreground/40'
                        }`}
                      >
                        {isSelected && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                      </div>
                      <span className="text-xs font-semibold text-foreground">
                        {p.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {p.isRecommended && (
                        <span className="rounded-full bg-primary/20 px-1.5 py-0.5 text-[9px] font-bold text-primary flex items-center gap-0.5">
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>Oficial</span>
                        </span>
                      )}
                      <span
                        className={`rounded-full px-1.5 py-0.5 text-[9px] font-medium ${
                          p.type === 'Clara'
                            ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                            : 'bg-purple-500/15 text-purple-600 dark:text-purple-400'
                        }`}
                      >
                        {p.type}
                      </span>
                    </div>
                  </div>

                  <p className="mt-0.5 text-[11px] text-muted-foreground pl-6 leading-tight">
                    {p.subtitle}
                  </p>

                  {/* Swatches */}
                  <div className="mt-1.5 flex items-center gap-1.5 pl-6">
                    {p.swatches.map((color, idx) => (
                      <span
                        key={idx}
                        className="h-3 w-3 rounded-full border border-black/15 shadow-2xs"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
};
