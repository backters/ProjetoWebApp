import React, { useState } from 'react';
import { PILLARS } from '../data/pillars';

interface RadarChartProps {
  scores: number[];
  onSelectPillar?: (index: number) => void;
  selectedPillar?: number | null;
}

export const RadarChart: React.FC<RadarChartProps> = ({
  scores,
  onSelectPillar,
  selectedPillar = null,
}) => {
  const [hoveredPillar, setHoveredPillar] = useState<number | null>(null);
  const total = scores.length;

  const getCoordinates = (index: number, score: number): [number, number] => {
    const angle = -Math.PI / 2 + (index * 2 * Math.PI) / total;
    return [(120 * score * Math.cos(angle)) / 10, (120 * score * Math.sin(angle)) / 10];
  };

  const activeIndex = hoveredPillar !== null ? hoveredPillar : selectedPillar;

  return (
    <div className="relative flex flex-col items-center w-full">
      <svg
        viewBox="-175 -165 350 330"
        className="w-full max-w-md select-none"
        role="img"
        aria-label="Mapa dos 12 pilares empresariais em gráfico de teia"
      >
        <defs>
          <filter id="gold-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Concentric Reference Grid */}
        <g fill="none" stroke="var(--border)">
          {[2, 4, 6, 8, 10].map((level) => (
            <polygon
              key={level}
              points={scores.map((_, i) => getCoordinates(i, level).join(',')).join(' ')}
              strokeOpacity={level === 10 ? 0.7 : 0.35}
              strokeDasharray={level % 4 === 0 ? 'none' : '3,3'}
            />
          ))}

          {/* Radial Axis Lines */}
          {scores.map((_, i) => {
            const [x, y] = getCoordinates(i, 10);
            const isHovered = activeIndex === i;
            return (
              <line
                key={i}
                x1={0}
                y1={0}
                x2={x}
                y2={y}
                stroke={isHovered ? 'var(--gold)' : 'var(--border)'}
                strokeWidth={isHovered ? 1.5 : 0.8}
                strokeOpacity={isHovered ? 0.9 : 0.4}
              />
            );
          })}
        </g>

        {/* Data Area Polygon */}
        <polygon
          points={scores.map((score, i) => getCoordinates(i, score).join(',')).join(' ')}
          fill="var(--gold)"
          fillOpacity="0.28"
          stroke="var(--gold)"
          strokeWidth="2"
          className="transition-all duration-300"
        />

        {/* Vertex Markers & Interactive touch points */}
        {scores.map((score, i) => {
          const [x, y] = getCoordinates(i, score);
          const isSelected = activeIndex === i;
          return (
            <g
              key={i}
              className="cursor-pointer transition-transform duration-200"
              onMouseEnter={() => setHoveredPillar(i)}
              onMouseLeave={() => setHoveredPillar(null)}
              onClick={() => onSelectPillar?.(i)}
            >
              {isSelected && (
                <circle
                  cx={x}
                  cy={y}
                  r="9"
                  fill="none"
                  stroke="var(--gold)"
                  strokeWidth="1.5"
                  opacity="0.8"
                  className="animate-pulse"
                />
              )}
              <circle
                cx={x}
                cy={y}
                r={isSelected ? '5' : '3.5'}
                fill="var(--gold)"
                filter={isSelected ? 'url(#gold-glow)' : undefined}
                className="transition-all duration-150"
              />
            </g>
          );
        })}

        {/* Axis Number Badges (1 to 12) */}
        {scores.map((_, i) => {
          const [x, y] = getCoordinates(i, 11.6);
          const isSelected = activeIndex === i;
          return (
            <g
              key={i}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredPillar(i)}
              onMouseLeave={() => setHoveredPillar(null)}
              onClick={() => onSelectPillar?.(i)}
            >
              {isSelected && (
                <circle
                  cx={x}
                  cy={y}
                  r="10"
                  fill="var(--muted)"
                  stroke="var(--gold)"
                  strokeWidth="1"
                />
              )}
              <text
                x={x}
                y={y}
                fontSize={isSelected ? '14' : '13'}
                fontWeight={isSelected ? '600' : '400'}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={isSelected ? 'var(--gold)' : 'var(--muted-foreground)'}
                className="font-display select-none transition-all duration-150"
              >
                {i + 1}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Floating detail tag when hovering or selecting */}
      {activeIndex !== null && (
        <div className="mt-2 text-center text-xs animate-rise">
          <span className="font-semibold text-primary">{activeIndex + 1}. {PILLARS[activeIndex].name}:</span>{' '}
          <span className="font-medium text-foreground">{scores[activeIndex]}/10</span>
          <span className="text-muted-foreground ml-1">· {PILLARS[activeIndex].subtitle}</span>
        </div>
      )}
    </div>
  );
};
