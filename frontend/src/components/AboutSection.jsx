import React from 'react';
import { User, Code2, FileSpreadsheet, Terminal, Cpu, CheckCircle } from 'lucide-react';

export default function AboutSection({ theme }) {
  const isDark = theme === 'dark';

  return (
    <div className={`p-5 sm:p-7 rounded-xl border transition-colors space-y-6 ${
      isDark ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
    }`}>
      
      {/* Author Header */}
      <div className={`flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 p-5 rounded-xl border ${
        isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
      }`}>
        
        {/* Avatar */}
        <div className="w-16 h-16 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-xl shadow-sm flex-shrink-0">
          RP
        </div>

        {/* Details */}
        <div className="text-center sm:text-left space-y-1.5 flex-grow">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="text-xl font-bold tracking-tight">Rahul Parmar</h2>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
              isDark ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-700'
            }`}>
              Project Lead & Architect
            </span>
          </div>

          <p className={`text-xs leading-relaxed max-w-2xl ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Comprehensive Slider-Crank Kinematics & Dynamic Balancing System for internal combustion engine design. 
            Features real-time 2D physics simulation, degree-by-degree analytical Excel workbook generation, and harmonic analysis.
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1 text-[11px] font-mono">
            <span className={`px-2.5 py-0.5 rounded-md border ${
              isDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-600'
            }`}>
              Stack: React 18 + Vite + Tailwind + Python
            </span>
            <span className={`px-2.5 py-0.5 rounded-md border ${
              isDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-600'
            }`}>
              Spreadsheet Engine: OpenPyXL & SheetJS
            </span>
          </div>
        </div>

      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
        
        <div className={`p-4 rounded-xl border space-y-1.5 ${
          isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center space-x-2 font-bold text-xs">
            <Cpu className="w-4 h-4 text-cyan-500" />
            <span>1. Real-time Calculation</span>
          </div>
          <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Auto-calculates piston displacement, velocity, acceleration, and inertia forces with unit conversion (SI & Imperial).
          </p>
        </div>

        <div className={`p-4 rounded-xl border space-y-1.5 ${
          isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center space-x-2 font-bold text-xs">
            <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
            <span>2. Excel & CSV Exporter</span>
          </div>
          <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            One-click formatted <code>.xlsx</code> generation directly in browser or via the Python OpenPyXL script.
          </p>
        </div>

        <div className={`p-4 rounded-xl border space-y-1.5 ${
          isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center space-x-2 font-bold text-xs">
            <Terminal className="w-4 h-4 text-purple-500" />
            <span>3. Python Scientific Suite</span>
          </div>
          <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Standalone NumPy calculation package and interactive CLI for terminal batch computing.
          </p>
        </div>

      </div>

      {/* Python Quick Run Instructions */}
      <div className={`p-4 rounded-xl border space-y-2 font-mono text-xs ${
        isDark ? 'bg-slate-950/90 border-slate-800' : 'bg-slate-100 border-slate-200'
      }`}>
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="flex items-center space-x-1.5">
            <Terminal className="w-3.5 h-3.5 text-blue-500" />
            <span>Python CLI Commands</span>
          </span>
          <span className="text-[11px] opacity-70">Workspace /python/</span>
        </div>

        <div className="space-y-1 pt-1">
          <div className={`p-2 rounded-md ${isDark ? 'bg-slate-900 text-cyan-300' : 'bg-white text-slate-800 border border-slate-200'}`}>
            python cli_calculator.py --bore 85 --stroke 88 --rod 145 --rpm 6000
          </div>
          <div className={`p-2 rounded-md ${isDark ? 'bg-slate-900 text-emerald-300' : 'bg-white text-slate-800 border border-slate-200'}`}>
            python generate_spreadsheet.py
          </div>
        </div>
      </div>

      {/* Signature */}
      <div className={`pt-3 border-t flex flex-col sm:flex-row items-center justify-between text-xs gap-2 ${
        isDark ? 'border-slate-800 text-slate-500' : 'border-slate-200 text-slate-500'
      }`}>
        <div>
          Designed & Engineered by <strong>Rahul Parmar</strong>
        </div>
        <div className="font-mono text-blue-500 font-semibold">
          PistonPro v2.0 Professional
        </div>
      </div>

    </div>
  );
}
