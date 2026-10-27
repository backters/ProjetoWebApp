import React from 'react';

interface SacredGeometryProps {
  className?: string;
  size?: number;
}

export const SacredGeometry: React.FC<SacredGeometryProps> = ({ className = '' }) => {
  const centerCircles: [number, number][] = [
    [0, 0],
    ...Array.from({ length: 6 }, (_, index) => [
      50 * Math.cos((index * Math.PI) / 3),
      50 * Math.sin((index * Math.PI) / 3),
    ] as [number, number]),
  ];

  const triangle1Points = Array.from(
    { length: 3 },
    (_, index) =>
      `${150 * Math.cos(-Math.PI / 2 + (index * 2 * Math.PI) / 3)},${
        150 * Math.sin(-Math.PI / 2 + (index * 2 * Math.PI) / 3)
      }`
  ).join(' ');

  const triangle2Points = Array.from(
    { length: 3 },
    (_, index) =>
      `${150 * Math.cos(Math.PI / 2 + (index * 2 * Math.PI) / 3)},${
        150 * Math.sin(Math.PI / 2 + (index * 2 * Math.PI) / 3)
      }`
  ).join(' ');

  return (
    <svg
      viewBox="-160 -160 320 320"
      className={className}
      aria-hidden="true"
      style={{ overflow: 'visible' }}
    >
      <g fill="none" stroke="var(--gold)" strokeWidth="0.6" opacity="0.5">
        <circle r="150" />
        <circle r="102" />
        {centerCircles.map(([cx, cy], n) => (
          <circle key={n} cx={cx} cy={cy} r="50" />
        ))}
        <polygon points={triangle1Points} />
        <polygon points={triangle2Points} />
      </g>
    </svg>
  );
};
