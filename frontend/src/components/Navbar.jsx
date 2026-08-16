import React, { useState } from 'react';
import { 
  Activity, 
  BarChart2, 
  Table2, 
  Sliders, 
  BookOpen, 
  User, 
  Sun, 
  Moon, 
  FileSpreadsheet, 
  Menu, 
  X,
  Zap
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  isImperial, 
  setIsImperial, 
  theme, 
  setTheme, 
  onExportExcel 
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'visualizer', label: 'Simulator', icon: Activity },
    { id: 'charts', label: 'Graphs', icon: BarChart2 },
    { id: 'spreadsheet', label: 'Spreadsheet', icon: Table2 },
    { id: 'presets', label: 'Presets', icon: Sliders },
    { id: 'theory', label: 'Formulas', icon: BookOpen },
    { id: 'about', label: 'About', icon: User },
  ];

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isDark = theme === 'dark';

  return (
    <header className={`sticky top-0 z-50 border-b transition-colors duration-200 ${
      isDark 
        ? 'bg-slate-950/90 border-slate-800 text-slate-100 backdrop-blur-md' 
        : 'bg-white/95 border-slate-200 text-slate-900 backdrop-blur-md shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Author */}
          <div 
            className="flex items-center space-x-3 cursor-pointer select-none"
            onClick={() => handleNavClick('visualizer')}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-base shadow-sm transition-all ${
              isDark 
                ? 'bg-blue-600 text-white' 
                : 'bg-slate-900 text-white'
            }`}>
              <Zap className="w-5 h-5 text-cyan-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight">PistonPro</span>
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                  isDark ? 'bg-slate-800 text-blue-400 border border-slate-700' : 'bg-slate-100 text-slate-700 border border-slate-200'
                }`}>
                  v2.0
                </span>
              </div>
              <p className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                By <span className="font-bold text-blue-500">Rahul Parmar</span>
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links (Segmented Pills) */}
          <nav className={`hidden md:flex items-center p-1 rounded-xl border ${
            isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? isDark 
                        ? 'bg-blue-600 text-white shadow-sm' 
                        : 'bg-white text-slate-900 shadow-sm border border-slate-200'
                      : isDark
                        ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? (isDark ? 'text-white' : 'text-blue-600') : ''}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Tools: Unit Switcher + Theme Toggle + Export */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Unit Switcher */}
            <div className={`flex items-center p-0.5 rounded-lg border text-xs font-semibold ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
            }`}>
              <button
                onClick={() => setIsImperial(false)}
                className={`px-2 py-1 rounded-md transition-all text-[11px] ${
                  !isImperial
                    ? isDark ? 'bg-blue-600 text-white' : 'bg-white text-slate-900 shadow-xs'
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Metric (mm, m/s, N)"
              >
                SI
              </button>
              <button
                onClick={() => setIsImperial(true)}
                className={`px-2 py-1 rounded-md transition-all text-[11px] ${
                  isImperial
                    ? isDark ? 'bg-blue-600 text-white' : 'bg-white text-slate-900 shadow-xs'
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Imperial (in, ft/s, lbf)"
              >
                Imp
              </button>
            </div>

            {/* Light / Dark Theme Toggle Button */}
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className={`p-2 rounded-lg border transition-all ${
                isDark 
                  ? 'bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-800' 
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
              }`}
              title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Quick Export Excel (Desktop) */}
            <button
              onClick={onExportExcel}
              className={`hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                isDark
                  ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-600/30'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
              }`}
              title="Download Excel Sheet"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Excel</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg border ${
                isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className={`md:hidden border-t px-4 py-3 space-y-1 ${
          isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? isDark ? 'bg-blue-600 text-white' : 'bg-slate-900 text-white'
                    : isDark ? 'text-slate-300 hover:bg-slate-900' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
          
          <div className="pt-2 border-t mt-2 flex items-center justify-between">
            <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Author: <strong>Rahul Parmar</strong>
            </span>
            <button
              onClick={onExportExcel}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Export .XLSX</span>
            </button>
          </div>
        </div>
      )}

      {/* Mobile Bottom Quick Switcher */}
      <div className={`md:hidden flex items-center justify-around border-t py-1.5 px-2 text-[10px] font-medium ${
        isDark ? 'bg-slate-950/95 border-slate-800/80' : 'bg-white/95 border-slate-200'
      }`}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`flex flex-col items-center py-1 px-2 rounded-md ${
                isActive
                  ? 'text-blue-500 font-bold'
                  : isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              <Icon className="w-4 h-4 mb-0.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

    </header>
  );
}
