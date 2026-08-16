import React from 'react';
import { CheckCircle2, ArrowRight, Trophy, Truck, Bike, Car } from 'lucide-react';
import { ENGINE_PRESETS } from '../utils/engineMath';

export default function EnginePresets({ currentPresetId, onSelectPreset, isImperial, theme }) {
  const isDark = theme === 'dark';

  const getPresetIcon = (id) => {
    switch (id) {
      case 'f1_v10': return Trophy;
      case 'diesel_heavy': return Truck;
      case 'sportbike_600': return Bike;
      default: return Car;
    }
  };

  return (
    <div className={`p-4 sm:p-5 rounded-xl border transition-colors space-y-4 ${
      isDark ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
    }`}>
      
      {/* Header */}
      <div className="pb-3 border-b border-slate-700/30">
        <h3 className="text-sm font-bold tracking-tight">Engine Benchmark Presets</h3>
        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Select pre-configured real-world engine architectures</p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {ENGINE_PRESETS.map((preset) => {
          const Icon = getPresetIcon(preset.id);
          const isSelected = currentPresetId === preset.id;

          const bore = isImperial ? (preset.bore / 25.4).toFixed(2) : preset.bore;
          const stroke = isImperial ? (preset.stroke / 25.4).toFixed(2) : preset.stroke;
          const rod = isImperial ? (preset.conRodLength / 25.4).toFixed(2) : preset.conRodLength;
          const mass = isImperial ? (preset.reciprocatingMass * 2.20462).toFixed(2) : preset.reciprocatingMass;
          const lenUnit = isImperial ? 'in' : 'mm';
          const massUnit = isImperial ? 'lb' : 'kg';

          return (
            <div
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                isSelected
                  ? isDark 
                    ? 'bg-blue-600/10 border-blue-500 shadow-sm' 
                    : 'bg-blue-50/70 border-blue-400 shadow-xs'
                  : isDark 
                    ? 'bg-slate-950/60 border-slate-800 hover:border-slate-700' 
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-1.5 rounded-lg border ${
                    isDark ? 'bg-slate-900 border-slate-800 text-blue-400' : 'bg-white border-slate-200 text-blue-600'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md ${
                    isDark ? 'bg-slate-900 text-slate-400' : 'bg-white text-slate-600 border border-slate-200'
                  }`}>
                    {preset.category}
                  </span>
                </div>

                <h4 className="text-sm font-bold mb-1">{preset.name}</h4>
                <p className={`text-xs mb-3 line-clamp-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{preset.description}</p>

                {/* Specs */}
                <div className={`grid grid-cols-2 gap-2 text-xs font-mono p-2.5 rounded-lg border mb-3 ${
                  isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-white border-slate-200'
                }`}>
                  <div>
                    <span className={`text-[10px] block ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Bore x Stroke:</span>
                    <span className="font-semibold">{bore} x {stroke} {lenUnit}</span>
                  </div>
                  <div>
                    <span className={`text-[10px] block ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Max RPM:</span>
                    <span className="text-amber-500 font-semibold">{preset.rpm.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className={`text-[10px] block ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Con-Rod:</span>
                    <span className="font-semibold">{rod} {lenUnit}</span>
                  </div>
                  <div>
                    <span className={`text-[10px] block ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Recip. Mass:</span>
                    <span className="text-rose-500 font-semibold">{mass} {massUnit}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs font-semibold">
                {isSelected ? (
                  <span className="flex items-center space-x-1 text-blue-500 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Active Preset</span>
                  </span>
                ) : (
                  <span className={`flex items-center space-x-1 ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>
                    <span>Load Preset</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
