import React, { useState } from 'react';
import MathBlock from './MathBlock';
import { 
  BookOpen, 
  Layers, 
  TrendingUp, 
  Zap, 
  Flame, 
  Maximize2, 
  Compass, 
  CheckCircle2, 
  Calculator,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function TheorySection({ params, summary, isImperial, theme }) {
  const [expandedSection, setExpandedSection] = useState('all');
  const isDark = theme === 'dark';

  // Sample values from user inputs for live substitutions
  const strokeMm = params?.stroke || 88;
  const rodMm = params?.conRodLength || 145;
  const rpm = params?.rpm || 6000;
  const massKg = params?.reciprocatingMass || 0.45;
  const rMm = strokeMm / 2;
  const rM = rMm / 1000;
  const n = rodMm / rMm;
  const omega = (2 * Math.PI * rpm) / 60;
  const aTdc = rM * Math.pow(omega, 2) * (1 + 1 / n);
  const fTdc = massKg * aTdc;

  const formulaCategories = [
    {
      id: 'displacement',
      title: '1. Piston Displacement x(θ)',
      icon: Maximize2,
      color: 'text-sky-500',
      description: 'Instantaneous distance traveled by the piston downward from Top Dead Center (TDC, x = 0).',
      exactLatex: `x(\\theta) = r \\left[ (1 - \\cos\\theta) + n \\left( 1 - \\sqrt{1 - \\frac{\\sin^2\\theta}{n^2}} \\right) \\right]`,
      approxLatex: `x(\\theta) \\approx r \\left[ (1 - \\cos\\theta) + \\frac{\\lambda}{4} (1 - \\cos 2\\theta) \\right] \\quad \\text{where } n = \\frac{L}{r}, \\; \\lambda = \\frac{1}{n}`,
      derivation: [
        `From the slider-crank geometry loop closure along the cylinder axis:`,
        `x(\\theta) = (r + L) - (r \\cos\\theta + L \\cos\\beta)`,
        `Using the trigonometric identity \\cos\\beta = \\sqrt{1 - \\sin^2\\beta} and Snell's relation \\sin\\beta = \\frac{r}{L} \\sin\\theta = \\frac{\\sin\\theta}{n}:`,
        `x(\\theta) = r(1 - \\cos\\theta) + L \\left(1 - \\sqrt{1 - \\frac{\\sin^2\\theta}{n^2}}\\right)`
      ],
      limits: [
        { angle: `\\theta = 0^\\circ \\; (\\text{TDC})`, value: `x(0) = 0` },
        { angle: `\\theta = 180^\\circ \\; (\\text{BDC})`, value: `x(180^\\circ) = 2r = S \\; (\\text{Full Stroke})` },
        { angle: `\\theta = 90^\\circ`, value: `x(90^\\circ) = r \\left(1 + n - \\sqrt{n^2 - 1}\\right) > r` }
      ]
    },
    {
      id: 'conrod_angle',
      title: '2. Connecting Rod Angle & Obliquity β(θ)',
      icon: Compass,
      color: 'text-indigo-500',
      description: 'Angle of the connecting rod centerline relative to the cylinder bore axis.',
      exactLatex: `\\sin\\beta = \\frac{r}{L} \\sin\\theta = \\frac{\\sin\\theta}{n} \\implies \\beta(\\theta) = \\arcsin\\left(\\frac{\\sin\\theta}{n}\\right)`,
      approxLatex: `\\cos\\beta = \\sqrt{1 - \\frac{\\sin^2\\theta}{n^2}} \\approx 1 - \\frac{\\sin^2\\theta}{2n^2}`,
      derivation: [
        `Connecting rod obliquity causes lateral side-thrust on the cylinder wall:`,
        `F_{thrust}(\\theta) = F_{net}(\\theta) \\cdot \\tan\\beta(\\theta)`
      ],
      limits: [
        { angle: `\\theta = 0^\\circ, 180^\\circ`, value: `\\beta = 0^\\circ \\; (\\text{Inline at Dead Centers})` },
        { angle: `\\theta = 90^\\circ, 270^\\circ`, value: `\\beta_{max} = \\arcsin(1/n)` }
      ]
    },
    {
      id: 'velocity',
      title: '3. Piston Velocity v(θ)',
      icon: TrendingUp,
      color: 'text-emerald-500',
      description: 'Instantaneous linear velocity of the piston obtained by differentiating displacement with respect to time.',
      exactLatex: `v(\\theta) = \\frac{dx}{dt} = r \\omega \\left[ \\sin\\theta + \\frac{\\sin 2\\theta}{2\\sqrt{n^2 - \\sin^2\\theta}} \\right]`,
      approxLatex: `v(\\theta) \\approx r \\omega \\left( \\sin\\theta + \\frac{\\sin 2\\theta}{2n} \\right) \\quad \\text{where } \\omega = \\frac{2\\pi N}{60}`,
      derivation: [
        `Applying chain rule \\frac{dx}{dt} = \\frac{dx}{d\\theta} \\cdot \\frac{d\\theta}{dt} with constant angular velocity \\frac{d\\theta}{dt} = \\omega:`,
        `\\frac{d}{d\\theta}\\left[r(1-\\cos\\theta) + L - \\sqrt{L^2 - r^2\\sin^2\\theta}\\right] = r\\sin\\theta + \\frac{2r^2\\sin\\theta\\cos\\theta}{2\\sqrt{L^2 - r^2\\sin^2\\theta}}`
      ],
      limits: [
        { angle: `\\theta = 0^\\circ, 180^\\circ, 360^\\circ`, value: `v = 0 \\; (\\text{Zero Velocity at TDC and BDC})` },
        { angle: `\\theta = \\theta_{vmax} \\approx 72^\\circ - 77^\\circ`, value: `v_{max} \\approx r\\omega \\sqrt{1 + \\frac{1}{n^2}}` }
      ]
    },
    {
      id: 'acceleration',
      title: '4. Piston Acceleration a(θ) & Harmonics',
      icon: Zap,
      color: 'text-rose-500',
      description: 'Linear acceleration of the piston comprising Primary (engine speed) and Secondary (2x engine speed) harmonics.',
      exactLatex: `a(\\theta) = \\frac{dv}{dt} = r \\omega^2 \\left[ \\cos\\theta + \\frac{n^2 \\cos 2\\theta + \\sin^4\\theta}{\\left(n^2 - \\sin^2\\theta\\right)^{3/2}} \\right]`,
      approxLatex: `a(\\theta) \\approx \\underbrace{r \\omega^2 \\cos\\theta}_{\\text{Primary Harmonic } (1\\omega)} + \\underbrace{r \\omega^2 \\frac{\\cos 2\\theta}{n}}_{\\text{Secondary Harmonic } (2\\omega)}`,
      derivation: [
        `Differentiating velocity \\frac{dv}{dt} = \\omega \\frac{dv}{d\\theta}:`,
        `\\frac{d}{d\\theta}\\left[\\sin\\theta + \\frac{\\sin 2\\theta}{2n}\\right] = \\cos\\theta + \\frac{2\\cos 2\\theta}{2n} = \\cos\\theta + \\frac{\\cos 2\\theta}{n}`
      ],
      limits: [
        { angle: `\\theta = 0^\\circ \\; (\\text{TDC})`, value: `a_{TDC} = r\\omega^2 \\left(1 + \\frac{1}{n}\\right) \\quad \\text{[Maximum Positive Accel]}` },
        { angle: `\\theta = 180^\\circ \\; (\\text{BDC})`, value: `a_{BDC} = -r\\omega^2 \\left(1 - \\frac{1}{n}\\right) \\quad \\text{[Maximum Negative Accel]}` },
        { angle: `a(\\theta) = 0`, value: `\\cos\\theta = -\\frac{1}{4n} + \\sqrt{\\frac{1}{16n^2} + \\frac{1}{2}} \\implies \\theta \\approx 74^\\circ - 78^\\circ` }
      ]
    },
    {
      id: 'inertia_force',
      title: '5. Reciprocating Inertia Force Fi(θ)',
      icon: Flame,
      color: 'text-amber-500',
      description: 'Dynamic reaction force opposing acceleration in accordance with D’Alembert’s dynamic equilibrium principle.',
      exactLatex: `F_i(\\theta) = - m_r \\cdot a(\\theta) = - m_r r \\omega^2 \\left[ \\cos\\theta + \\frac{n^2 \\cos 2\\theta + \\sin^4\\theta}{\\left(n^2 - \\sin^2\\theta\\right)^{3/2}} \\right]`,
      approxLatex: `F_i(\\theta) \\approx - \\underbrace{m_r r \\omega^2 \\cos\\theta}_{F_{i,\\text{primary}}} - \\underbrace{m_r r \\omega^2 \\frac{\\cos 2\\theta}{n}}_{F_{i,\\text{secondary}}}`,
      derivation: [
        `The reciprocating mass m_r comprises:`,
        `m_r = m_{\\text{piston}} + m_{\\text{rings}} + m_{\\text{gudgeon\\_pin}} + \\left(\\frac{1}{3} \\text{ to } \\frac{1}{2}\\right) m_{\\text{connecting\\_rod}}`
      ],
      limits: [
        { angle: `\\theta = 0^\\circ \\; (\\text{TDC})`, value: `F_{i,TDC} = - m_r r \\omega^2 \\left(1 + \\frac{1}{n}\\right) \\quad \\text{[Tensile load on rod]}` },
        { angle: `\\theta = 180^\\circ \\; (\\text{BDC})`, value: `F_{i,BDC} = + m_r r \\omega^2 \\left(1 - \\frac{1}{n}\\right) \\quad \\text{[Compressive load on rod]}` }
      ]
    },
    {
      id: 'engine_kpis',
      title: '6. Key Performance Indicator (KPI) Formulas',
      icon: Calculator,
      color: 'text-blue-500',
      description: 'Standard thermodynamic and mechanical engine design metric equations.',
      exactLatex: `v_{mean} = \\frac{2 \\cdot S \\cdot N}{60} = \\frac{S \\cdot N}{30} \\quad [\\text{m/s}]`,
      approxLatex: `V_d = \\frac{\\pi}{4} D^2 S \\quad [\\text{cm}^3 \\text{ or cc}], \\qquad \\omega = \\frac{2\\pi N}{60} \\quad [\\text{rad/s}]`,
      derivation: [
        `Mean Piston Speed (v_{mean}): In one crank revolution (2 strokes), the piston covers 2S distance.`,
        `Displacement Volume (V_d): Geometric volume swept by the piston cross-sectional area \\frac{\\pi D^2}{4} over stroke S.`
      ],
      limits: [
        { angle: `Production Cars`, value: `v_{mean} \\approx 12 - 18 \\text{ m/s}` },
        { angle: `Sportbikes / F1`, value: `v_{mean} \\approx 22 - 27 \\text{ m/s}` }
      ]
    }
  ];

  return (
    <div className={`p-4 sm:p-6 rounded-xl border transition-colors space-y-6 ${
      isDark ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
    }`}>
      
      {/* Page Title & Intro */}
      <div className="pb-4 border-b border-slate-700/30">
        <div className="flex items-center space-x-2.5 mb-1">
          <BookOpen className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
          <h2 className="text-base sm:text-lg font-bold tracking-tight">Kinematic & Dynamic Formulas Reference</h2>
        </div>
        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Rigorous mathematical derivations, exact geometric equations, harmonic expansion, and live numerical substitutions
        </p>
      </div>

      {/* Live Calculated Equations Inspector (Substituted with User's Live Parameters) */}
      <div className={`p-4 sm:p-5 rounded-xl border space-y-3 ${
        isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calculator className="w-4 h-4 text-emerald-500" />
            <h3 className="text-xs sm:text-sm font-bold">Live Numerical Substitutions (Your Parameters)</h3>
          </div>
          <span className={`text-[11px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            N = {rpm} RPM, S = {strokeMm}mm, L = {rodMm}mm, mr = {massKg}kg
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
          
          <div className={`p-3 rounded-lg border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <span className={`text-[10px] block mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Angular Speed (ω)</span>
            <MathBlock math={`\\omega = \\frac{2\\pi (${rpm})}{60} = ${omega.toFixed(1)} \\text{ rad/s}`} block={false} />
          </div>

          <div className={`p-3 rounded-lg border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <span className={`text-[10px] block mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Rod-to-Crank Ratio (n)</span>
            <MathBlock math={`n = \\frac{${rodMm}}{${rMm}} = ${n.toFixed(3)}`} block={false} />
          </div>

          <div className={`p-3 rounded-lg border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <span className={`text-[10px] block mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Max Accel @ TDC (a_TDC)</span>
            <MathBlock math={`a_{\\text{TDC}} = ${aTdc.toFixed(0)} \\text{ m/s}^2 \\; (${(aTdc / 9.80665).toFixed(0)}g)`} block={false} />
          </div>

          <div className={`p-3 rounded-lg border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <span className={`text-[10px] block mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Peak Inertia Force (F_i)</span>
            <MathBlock math={`F_i = -${fTdc.toFixed(0)} \\text{ N} \\; (${(fTdc / 1000).toFixed(2)} \\text{ kN})`} block={false} />
          </div>

        </div>
      </div>

      {/* Formula Detail Cards */}
      <div className="space-y-4">
        {formulaCategories.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className={`p-4 sm:p-5 rounded-xl border transition-all ${
                isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200 shadow-xs'
              }`}
            >
              {/* Header */}
              <div className="flex items-center space-x-2.5 mb-2">
                <div className={`p-1.5 rounded-lg border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <Icon className={`w-4 h-4 ${item.color}`} />
                </div>
                <div>
                  <h3 className="text-sm font-bold">{item.title}</h3>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{item.description}</p>
                </div>
              </div>

              {/* Exact Formula Box (Rendered with KaTeX) */}
              <div className="my-3 space-y-2">
                <div className={`p-3 sm:p-4 rounded-xl border text-center overflow-x-auto ${
                  isDark ? 'bg-slate-900/90 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900 shadow-xs'
                }`}>
                  <span className={`text-[10px] block font-bold uppercase tracking-wider mb-2 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Exact Analytical Formula:
                  </span>
                  <MathBlock math={item.exactLatex} />
                </div>

                {/* Approximation / Harmonic Formula Box */}
                {item.approxLatex && (
                  <div className={`p-3 rounded-xl border text-center overflow-x-auto ${
                    isDark ? 'bg-slate-900/50 border-slate-800/80 text-slate-300' : 'bg-white/70 border-slate-200 text-slate-700'
                  }`}>
                    <span className={`text-[10px] block font-bold uppercase tracking-wider mb-1 text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Standard Harmonic Series Approximation:
                    </span>
                    <MathBlock math={item.approxLatex} />
                  </div>
                )}
              </div>

              {/* Key Boundary Values & Dead Centers */}
              {item.limits && item.limits.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-700/30">
                  <span className={`text-[10px] font-bold uppercase tracking-wider block mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Critical Boundary Conditions:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
                    {item.limits.map((lim, idx) => (
                      <div 
                        key={idx} 
                        className={`p-2 rounded-lg border ${
                          isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
                        }`}
                      >
                        <div className="font-semibold text-blue-500 mb-0.5">
                          <MathBlock math={lim.angle} block={false} />
                        </div>
                        <div className={isDark ? 'text-slate-300' : 'text-slate-800'}>
                          <MathBlock math={lim.value} block={false} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
}
