import React from 'react';
import { 
  Users, 
  Crown, 
  Code2, 
  FileSpreadsheet, 
  Terminal, 
  Cpu, 
  Award,
  BookOpen,
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';

export default function AboutSection({ theme }) {
  const isDark = theme === 'dark';

  const contributors = [
    {
      name: 'Parmar Rahul',
      role: 'Project Lead & Architect',
      isLead: true,
      initials: 'PR',
      avatarBg: 'bg-blue-600',
      tagColor: isDark ? 'bg-blue-500/15 border-blue-500/30 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-700',
      description: ''
    },
    {
      name: 'Patel Nirali',
      role: 'Kinematics & Mathematical Modeling',
      isLead: false,
      initials: 'PN',
      avatarBg: 'bg-emerald-600',
      tagColor: isDark ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-700',
      description: ''
    },
    {
      name: 'Modi Vraj',
      role: 'Dynamics & Simulation Engine',
      isLead: false,
      initials: 'MV',
      avatarBg: 'bg-purple-600',
      tagColor: isDark ? 'bg-purple-500/15 border-purple-500/30 text-purple-400' : 'bg-purple-50 border-purple-200 text-purple-700',
      description: ''
    },
    {
      name: 'Panchal Pinank',
      role: 'Data Analytics & Validation',
      isLead: false,
      initials: 'PP',
      avatarBg: 'bg-amber-600',
      tagColor: isDark ? 'bg-amber-500/15 border-amber-500/30 text-amber-400' : 'bg-amber-50 border-amber-200 text-amber-700',
      description: ''
    }
  ];

  return (
    <div className={`p-5 sm:p-7 rounded-xl border transition-colors space-y-6 ${
      isDark ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
    }`}>
      
      {/* Section Header */}
      <div className="pb-3 border-b border-slate-700/30 flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-bold tracking-tight">About the Project & Engineering Team</h2>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Internal combustion engine slider-crank kinematics, dynamics & balancing platform
          </p>
        </div>
        <div className={`p-2 rounded-lg border hidden sm:flex items-center space-x-1.5 text-xs font-semibold ${
          isDark ? 'bg-slate-950 border-slate-800 text-blue-400' : 'bg-slate-50 border-slate-200 text-blue-600'
        }`}>
          <Sparkles className="w-3.5 h-3.5" />
          <span>v2.0 Pro</span>
        </div>
      </div>

      {/* Project Overview Card */}
      <div className={`p-5 rounded-xl border space-y-2 ${
        isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-blue-500" />
          <h3 className="text-sm font-bold">Project Purpose & Scope</h3>
        </div>
        <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
          <strong>PistonPro</strong> is a precision engineering suite developed to model, simulate, and analyze reciprocating internal combustion engine mechanisms. 
          It solves exact trigonometric equations alongside standard harmonic approximations to compute piston displacement, linear velocity, acceleration harmonics (Primary & Secondary), and reciprocating inertia forces. 
          The application pairs an interactive 2D physics visualizer with degree-by-degree tabular spreadsheets and formatted Excel workbooks.
        </p>
      </div>

      {/* Contributors Team Section */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-blue-500" />
          <h3 className="text-sm font-bold tracking-tight">Project Contributors & Authors</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
          {contributors.map((c, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border transition-all flex flex-col justify-between relative overflow-hidden ${
                c.isLead 
                  ? isDark 
                    ? 'bg-slate-950/90 border-blue-500/40 shadow-sm' 
                    : 'bg-white border-blue-300 shadow-xs'
                  : isDark 
                    ? 'bg-slate-950/50 border-slate-800 hover:border-slate-700' 
                    : 'bg-slate-50/70 border-slate-200 hover:bg-white'
              }`}
            >
              <div>
                {/* Header Row: Avatar + Name + Role Badge */}
                <div className="flex items-start space-x-3 mb-2.5">
                  <div className={`w-11 h-11 rounded-xl ${c.avatarBg} text-white font-bold text-sm flex items-center justify-center shadow-xs flex-shrink-0 relative`}>
                    {c.initials}
                    {c.isLead && (
                      <span className="absolute -top-1 -right-1 bg-amber-400 text-slate-950 rounded-full p-0.5 shadow-xs">
                        <Crown className="w-2.5 h-2.5 fill-slate-950" />
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 flex-grow">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold tracking-tight">{c.name}</h4>
                      {c.isLead && (
                        <span className="text-[10px] text-amber-500 font-bold uppercase tracking-wider flex items-center gap-0.5">
                          <Award className="w-3 h-3" /> Lead
                        </span>
                      )}
                    </div>
                    <div>
                      <span className={`inline-block text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md border ${c.tagColor}`}>
                        {c.role}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {c.description}
                </p>
              </div>
            </div>
          ))}
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

      {/* Python CLI Instructions */}
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

      {/* Footer Credits */}
      <div className={`pt-3 border-t flex flex-col sm:flex-row items-center justify-between text-xs gap-2 ${
        isDark ? 'border-slate-800 text-slate-500' : 'border-slate-200 text-slate-500'
      }`}>
        <div>
          Engineered by <strong>Parmar Rahul, Patel Niraliben, Modi Vraj, Panchal Pinank</strong>
        </div>
        <div className="font-mono text-blue-500 font-semibold">
          PistonPro v2.0 Professional
        </div>
      </div>

    </div>
  );
}
