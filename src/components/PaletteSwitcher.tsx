import React, { useState } from 'react';
import { Palette, Check, ChevronDown, ChevronUp, Sparkles, Sun, Moon } from 'lucide-react';

export type ThemeId =
  | 'marfim-magenta'
  | 'champagne-oliva'
  | 'perola-terracota'
  | 'quartzo-vinho'
  | 'salvia-ouro'
  | 'ameixa-ouro'
  | 'esmeralda-bronze'
  | 'cacau-cobre'
  | 'violeta-veludo'
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
  const [filter, setFilter] = useState<'todas' | 'claras' | 'escuras'>('todas');

  const palettes: Array<{
    id: ThemeId;
    name: string;
    subtitle: string;
    type: 'Clara' | 'Escura';
    swatches: string[];
    isRecommended?: boolean;
  }> = [
    // 5 OPÇÕES CLARAS
    {
      id: 'marfim-magenta',
      name: '1. Marfim & Magenta Real',
      subtitle: 'Fundo marfim com o magenta e âmbar solar do logo',
      type: 'Clara',
      swatches: ['#88186D', '#D47C34', '#769043', '#FAF6F0'],
      isRecommended: true,
    },
    {
      id: 'champagne-oliva',
      name: '2. Champagne & Oliva Dourado',
      subtitle: 'Areia quente com verde oliva sagrado e âmbar terroso',
      type: 'Clara',
      swatches: ['#6E873C', '#D47C34', '#DE7A85', '#F6F2EB'],
    },
    {
      id: 'perola-terracota',
      name: '3. Pérola & Terracota Solar',
      subtitle: 'Tons calorosos de terracota solar e magenta delicado',
      type: 'Clara',
      swatches: ['#C86628', '#88186D', '#DE7A85', '#FDF8F3'],
    },
    {
      id: 'quartzo-vinho',
      name: '4. Quartzo Rosa & Vinho',
      subtitle: 'Suavidade acolhedora de quartzo rosa com vinho aveludado',
      type: 'Clara',
      swatches: ['#8E1E5E', '#DE7A85', '#D47C34', '#FAF4F6'],
    },
    {
      id: 'salvia-ouro',
      name: '5. Sálvia Serena & Ouro Nobre',
      subtitle: 'Harmonia límpida de verde sálvia com dourado imperial',
      type: 'Clara',
      swatches: ['#5C7836', '#D98838', '#851C6A', '#F4F6F2'],
    },

    // 5 OPÇÕES ESCURAS
    {
      id: 'ameixa-ouro',
      name: '6. Ameixa Imperial & Ouro',
      subtitle: 'Fundo ameixa místico com magenta e âmbar iluminados',
      type: 'Escura',
      swatches: ['#D43CA8', '#E28D3E', '#8FA74B', '#1C0F1E'],
      isRecommended: true,
    },
    {
      id: 'esmeralda-bronze',
      name: '7. Esmeralda Noturna & Bronze',
      subtitle: 'Floresta profunda com oliva dourado e bronze quente',
      type: 'Escura',
      swatches: ['#8FB246', '#E28D3E', '#DE7A85', '#0E1813'],
    },
    {
      id: 'cacau-cobre',
      name: '8. Cacau Nobre & Cobre Dourado',
      subtitle: 'Café aveludado profundo com cobre e vinho rubi',
      type: 'Escura',
      swatches: ['#E5873E', '#B52B78', '#8FA74B', '#1A120E'],
    },
    {
      id: 'violeta-veludo',
      name: '9. Violeta Veludo & Magenta',
      subtitle: 'Noite violeta intensa com orquídea e rosa de alta vibração',
      type: 'Escura',
      swatches: ['#E044B2', '#F3A648', '#F08BA2', '#140816'],
    },
    {
      id: 'cosmica-original',
      name: '10. Cósmica Noturna Original',
      subtitle: 'O visual clássico violeta com dourado celestial original',
      type: 'Escura',
      swatches: ['#f1ce7c', '#5f1e42', '#2c1445', '#161021'],
    },
  ];

  const filteredPalettes = palettes.filter((p) => {
    if (filter === 'claras') return p.type === 'Clara';
    if (filter === 'escuras') return p.type === 'Escura';
    return true;
  });

  return (
    <aside
      aria-label="Seletor de paletas de cores para avaliação da cliente"
      className="fixed bottom-4 right-4 z-50 max-w-sm w-[calc(100vw-2rem)] select-none animate-rise"
    >
      <div className="rounded-3xl border border-primary/30 bg-card/95 p-3.5 backdrop-blur-xl shadow-2xl transition-all">
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
                  10 Opções
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

        {/* Options Body */}
        {isOpen && (
          <div className="mt-2.5 border-t border-border pt-2.5 space-y-2">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/60 text-[11px]">
              <button
                type="button"
                onClick={() => setFilter('todas')}
                className={`flex-1 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  filter === 'todas'
                    ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Todas (10)
              </button>
              <button
                type="button"
                onClick={() => setFilter('claras')}
                className={`flex-1 py-1 rounded-lg font-medium transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  filter === 'claras'
                    ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Sun className="w-3 h-3" />
                <span>Claras (5)</span>
              </button>
              <button
                type="button"
                onClick={() => setFilter('escuras')}
                className={`flex-1 py-1 rounded-lg font-medium transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  filter === 'escuras'
                    ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Moon className="w-3 h-3" />
                <span>Escuras (5)</span>
              </button>
            </div>

            {/* List with Smooth Scroll */}
            <div className="space-y-1.5 max-h-[50vh] overflow-y-auto pr-1">
              {filteredPalettes.map((p) => {
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
                      <div className="flex items-center gap-2 truncate">
                        <div
                          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-all ${
                            isSelected
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-muted-foreground/40'
                          }`}
                        >
                          {isSelected && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                        </div>
                        <span className="text-xs font-semibold text-foreground truncate">
                          {p.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {p.isRecommended && (
                          <span className="rounded-full bg-primary/20 px-1.5 py-0.5 text-[9px] font-bold text-primary flex items-center gap-0.5">
                            <Sparkles className="w-2.5 h-2.5" />
                            <span>Destaque</span>
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
          </div>
        )}
      </div>
    </aside>
  );
};
