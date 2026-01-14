
import React from 'react';

interface SpeedGaugeProps {
  value: number;
  label: string;
  unit: string;
  active?: boolean;
}

const SpeedGauge: React.FC<SpeedGaugeProps> = ({ value, label, unit, active }) => {
  const displayValue = value > 0 ? (unit === 'ms' ? Math.round(value) : value.toFixed(1)) : '0';

  return (
    <div 
      className={`
        flex flex-col items-center justify-center 
        py-5 px-3 rounded-2xl
        transition-all duration-500 
        ${active ? 'bg-white/30 scale-105 shadow-[0_0_20px_rgba(255,255,255,0.2)]' : 'bg-black/20'}
        w-full border border-white/10
      `}
    >
      <span className="text-xs font-black uppercase tracking-widest opacity-70 mb-1">
        {label}
      </span>
      <div className="flex items-baseline justify-center gap-1">
        <span className="text-3xl md:text-4xl font-black tracking-tighter">
          {displayValue}
        </span>
        <span className="text-sm font-bold opacity-60">
          {unit}
        </span>
      </div>
    </div>
  );
};

export default SpeedGauge;
