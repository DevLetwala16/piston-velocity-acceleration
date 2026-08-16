import React from 'react';
import { 
  RotateCw, 
  AlertCircle, 
  Sliders,
  Gauge, 
  TrendingUp, 
  Zap, 
  Flame, 
  Maximize2, 
  Compass, 
  Weight 
} from 'lucide-react';

export default function ParameterForm({ 
  params, 
  setParams, 
  summary, 
  isImperial, 
  theme, 
  onReset 
}) {
  const isDark = theme === 'dark';

  const units = {
    length: isImperial ? 'in' : 'mm',
    speed: isImperial ? 'ft/s' : 'm/s',
    accel: isImperial ? 'ft/s²' : 'm/s²',
    force: isImperial ? 'lbf' : 'N',
    mass: isImperial ? 'lb' : 'kg',
  };

  const handleInputChange = (field, value) => {
    const num = parseFloat(value);
    setParams(prev => ({
      ...prev,
      [field]: isNaN(num) ? '' : num
    }));
  };

  const r = (params.stroke || 0) / 2.0;
  const isGeometryValid = (params.conRodLength || 0) >= r && r > 0;

  return (
    <div className="space-y-4">
      
      {/* Parameters Header & Inputs Card */}
      <div className={`p-4 sm:p-5 rounded-xl border transition-colors ${
        isDark ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center space-x-2">
            <Sliders className={`w-4 h-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
            <h2 className="text-sm font-bold tracking-tight">Engine Parameters</h2>
          </div>

          <button
            onClick={onReset}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
              isDark 
                ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800' 
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
            title="Reset parameters"
          >
            <RotateCw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>

        {/* Input Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          
          {/* 1. Bore */}
          <div className="space-y-1">
            <div className={`flex justify-between items-center text-xs font-semibold ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>
              <span>Cylinder Bore (D)</span>
              <span className="text-[11px] font-mono opacity-70">{units.length}</span>
            </div>
            <input
              type="number"
              step={isImperial ? "0.01" : "0.5"}
              min="10"
              max="300"
              value={params.bore}
              onChange={(e) => handleInputChange('bore', e.target.value)}
              className={`w-full rounded-lg px-3 py-1.5 text-xs sm:text-sm font-semibold font-mono border transition-all outline-none ${
                isDark 
                  ? 'bg-slate-950/80 border-slate-800 text-white focus:border-blue-500' 
                  : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-600 focus:bg-white'
              }`}
            />
          </div>

          {/* 2. Stroke */}
          <div className="space-y-1">
            <div className={`flex justify-between items-center text-xs font-semibold ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>
              <span>Piston Stroke (S)</span>
              <span className="text-[11px] font-mono opacity-70">{units.length}</span>
            </div>
            <input
              type="number"
              step={isImperial ? "0.01" : "0.5"}
              min="10"
              max="400"
              value={params.stroke}
              onChange={(e) => handleInputChange('stroke', e.target.value)}
              className={`w-full rounded-lg px-3 py-1.5 text-xs sm:text-sm font-semibold font-mono border transition-all outline-none ${
                isDark 
                  ? 'bg-slate-950/80 border-slate-800 text-white focus:border-blue-500' 
                  : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-600 focus:bg-white'
              }`}
            />
          </div>

          {/* 3. Connecting Rod */}
          <div className="space-y-1">
            <div className={`flex justify-between items-center text-xs font-semibold ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>
              <span>Con-Rod Length (L)</span>
              <span className="text-[11px] font-mono opacity-70">{units.length}</span>
            </div>
            <input
              type="number"
              step={isImperial ? "0.01" : "0.5"}
              min={r}
              max="600"
              value={params.conRodLength}
              onChange={(e) => handleInputChange('conRodLength', e.target.value)}
              className={`w-full rounded-lg px-3 py-1.5 text-xs sm:text-sm font-semibold font-mono border transition-all outline-none ${
                !isGeometryValid
                  ? 'border-red-500 focus:border-red-500'
                  : isDark 
                    ? 'bg-slate-950/80 border-slate-800 text-white focus:border-blue-500' 
                    : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-600 focus:bg-white'
              }`}
            />
          </div>

          {/* 4. Engine RPM */}
          <div className="space-y-1">
            <div className={`flex justify-between items-center text-xs font-semibold ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>
              <span>Engine Speed (N)</span>
              <span className="text-[11px] font-mono opacity-70">RPM</span>
            </div>
            <input
              type="number"
              step="50"
              min="100"
              max="25000"
              value={params.rpm}
              onChange={(e) => handleInputChange('rpm', e.target.value)}
              className={`w-full rounded-lg px-3 py-1.5 text-xs sm:text-sm font-semibold font-mono border transition-all outline-none ${
                isDark 
                  ? 'bg-slate-950/80 border-slate-800 text-white focus:border-blue-500' 
                  : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-600 focus:bg-white'
              }`}
            />
          </div>

          {/* 5. Reciprocating Mass */}
          <div className="space-y-1">
            <div className={`flex justify-between items-center text-xs font-semibold ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>
              <span>Recip. Mass (m_r)</span>
              <span className="text-[11px] font-mono opacity-70">{units.mass}</span>
            </div>
            <input
              type="number"
              step={isImperial ? "0.01" : "0.01"}
              min="0.01"
              max="50"
              value={params.reciprocatingMass}
              onChange={(e) => handleInputChange('reciprocatingMass', e.target.value)}
              className={`w-full rounded-lg px-3 py-1.5 text-xs sm:text-sm font-semibold font-mono border transition-all outline-none ${
                isDark 
                  ? 'bg-slate-950/80 border-slate-800 text-white focus:border-blue-500' 
                  : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-600 focus:bg-white'
              }`}
            />
          </div>

        </div>

        {/* Validation Warning */}
        {!isGeometryValid && (
          <div className="mt-3 p-2.5 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center space-x-2 text-red-500 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>Geometry Error: Connecting Rod Length ({params.conRodLength}) must be greater than Crank Radius ({(params.stroke/2).toFixed(1)}).</span>
          </div>
        )}

      </div>

      {/* KPI Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
        
        {/* Metric 1: Mean Piston Speed */}
        <div className={`p-3 rounded-xl border transition-colors ${
          isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <span className={`text-[11px] block font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Mean Speed</span>
          <div className="text-base sm:text-lg font-bold font-mono text-cyan-500 mt-0.5">
            {summary.meanPistonSpeed.toFixed(2)}
            <span className="text-[10px] font-normal ml-1 opacity-70">{units.speed}</span>
          </div>
        </div>

        {/* Metric 2: Max Velocity */}
        <div className={`p-3 rounded-xl border transition-colors ${
          isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <span className={`text-[11px] block font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Max Velocity</span>
          <div className="text-base sm:text-lg font-bold font-mono text-emerald-500 mt-0.5">
            {summary.maxVelocity.toFixed(2)}
            <span className="text-[10px] font-normal ml-1 opacity-70">{units.speed}</span>
          </div>
          <span className={`text-[10px] block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>@ {summary.angleMaxVelocity.toFixed(0)}°</span>
        </div>

        {/* Metric 3: Max Acceleration */}
        <div className={`p-3 rounded-xl border transition-colors ${
          isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <span className={`text-[11px] block font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Max Accel @ TDC</span>
          <div className="text-base sm:text-lg font-bold font-mono text-rose-500 mt-0.5">
            {Math.abs(summary.accelTdcG).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            <span className="text-[10px] font-normal ml-1">g</span>
          </div>
        </div>

        {/* Metric 4: Peak Inertia Force */}
        <div className={`p-3 rounded-xl border transition-colors ${
          isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <span className={`text-[11px] block font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Peak Inertia</span>
          <div className="text-base sm:text-lg font-bold font-mono text-amber-500 mt-0.5">
            {isImperial 
              ? `${Math.abs(summary.maxInertiaForce).toFixed(0)} lbf`
              : `${(Math.abs(summary.maxInertiaForce) / 1000).toFixed(2)} kN`
            }
          </div>
        </div>

        {/* Metric 5: Single Cylinder Displacement */}
        <div className={`p-3 rounded-xl border transition-colors ${
          isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <span className={`text-[11px] block font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Swept Volume</span>
          <div className="text-base sm:text-lg font-bold font-mono text-blue-500 mt-0.5">
            {summary.displacementCc.toFixed(1)}
            <span className="text-[10px] font-normal ml-1">cc</span>
          </div>
        </div>

        {/* Metric 6: Rod Ratio n */}
        <div className={`p-3 rounded-xl border transition-colors ${
          isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <span className={`text-[11px] block font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Rod Ratio (n)</span>
          <div className="text-base sm:text-lg font-bold font-mono text-indigo-500 mt-0.5">
            {summary.rodRatioN.toFixed(2)}
          </div>
        </div>

      </div>

    </div>
  );
}
