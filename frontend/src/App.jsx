import React, { useState, useMemo, useEffect } from 'react';
import Navbar from './components/Navbar';
import ParameterForm from './components/ParameterForm';
import PistonAnimation from './components/PistonAnimation';
import KinematicsCharts from './components/KinematicsCharts';
import SpreadsheetView from './components/SpreadsheetView';
import EnginePresets from './components/EnginePresets';
import TheorySection from './components/TheorySection';
import AboutSection from './components/AboutSection';
import { 
  ENGINE_PRESETS, 
  computeSummaryStatistics, 
  calculateFullCycle 
} from './utils/engineMath';
import { exportToExcel } from './utils/exportUtils';
import { 
  Activity, 
  BarChart2, 
  Table2, 
  Sliders, 
  BookOpen, 
  User, 
  ChevronRight 
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [isImperial, setIsImperial] = useState(false);
  const [currentPresetId, setCurrentPresetId] = useState('turbo_i4');
  
  // Theme state: defaults to dark or reads from localStorage
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('piston_theme') || 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
    }
    localStorage.setItem('piston_theme', theme);
  }, [theme]);

  // Active engine parameters
  const [params, setParams] = useState({
    bore: 82.5,
    stroke: 92.8,
    conRodLength: 144.0,
    rpm: 6800,
    reciprocatingMass: 0.42,
  });

  // Calculate live summary metrics whenever params or units change
  const summary = useMemo(() => {
    return computeSummaryStatistics(params, isImperial);
  }, [params, isImperial]);

  // Handle Preset Change
  const handleSelectPreset = (preset) => {
    setCurrentPresetId(preset.id);
    if (isImperial) {
      setParams({
        bore: parseFloat((preset.bore / 25.4).toFixed(3)),
        stroke: parseFloat((preset.stroke / 25.4).toFixed(3)),
        conRodLength: parseFloat((preset.conRodLength / 25.4).toFixed(3)),
        rpm: preset.rpm,
        reciprocatingMass: parseFloat((preset.reciprocatingMass * 2.20462).toFixed(3)),
      });
    } else {
      setParams({
        bore: preset.bore,
        stroke: preset.stroke,
        conRodLength: preset.conRodLength,
        rpm: preset.rpm,
        reciprocatingMass: preset.reciprocatingMass,
      });
    }
    setActiveTab('visualizer');
  };

  // Handle Units toggle conversion
  const handleUnitToggle = (newImperial) => {
    if (newImperial === isImperial) return;
    setIsImperial(newImperial);

    setParams((prev) => {
      if (newImperial) {
        return {
          bore: parseFloat((prev.bore / 25.4).toFixed(3)),
          stroke: parseFloat((prev.stroke / 25.4).toFixed(3)),
          conRodLength: parseFloat((prev.conRodLength / 25.4).toFixed(3)),
          rpm: prev.rpm,
          reciprocatingMass: parseFloat((prev.reciprocatingMass * 2.20462).toFixed(3)),
        };
      } else {
        return {
          bore: parseFloat((prev.bore * 25.4).toFixed(1)),
          stroke: parseFloat((prev.stroke * 25.4).toFixed(1)),
          conRodLength: parseFloat((prev.conRodLength * 25.4).toFixed(1)),
          rpm: prev.rpm,
          reciprocatingMass: parseFloat((prev.reciprocatingMass * 0.45359237).toFixed(2)),
        };
      }
    });
  };

  // Reset to default
  const handleReset = () => {
    const defaultPreset = ENGINE_PRESETS.find(p => p.id === 'turbo_i4') || ENGINE_PRESETS[0];
    handleSelectPreset(defaultPreset);
  };

  // Quick Excel export
  const handleExportExcel = () => {
    const cycle = calculateFullCycle(params, 2.0, 360, isImperial);
    exportToExcel(cycle, params, summary, `piston_kinematics_${params.rpm}rpm.xlsx`, isImperial);
  };

  // Page Info Metadata
  const getPageInfo = () => {
    switch (activeTab) {
      case 'visualizer':
        return { title: 'Slider-Crank Mechanism Simulator', icon: Activity, subtitle: 'Real-time 2D kinematic engine visualizer with telemetry meters' };
      case 'charts':
        return { title: 'Kinematics & Dynamics Graphs', icon: BarChart2, subtitle: 'Displacement, velocity, acceleration harmonics, and inertia force curves' };
      case 'spreadsheet':
        return { title: 'Degree-by-Degree Spreadsheet', icon: Table2, subtitle: 'Tabular analytical dataset with angle resolution and Excel export' };
      case 'presets':
        return { title: 'Engine Benchmark Presets', icon: Sliders, subtitle: 'Formula 1, Heavy Diesel, 600cc Superbike, 2.0L Turbo, and V8 Muscle' };
      case 'theory':
        return { title: 'Engineering Theory & Formulas', icon: BookOpen, subtitle: 'Exact geometric formulas, trigonometric series, and D’Alembert equilibrium' };
      case 'about':
        return { title: 'About the Project & Author', icon: User, subtitle: 'Developed and architected by Rahul Parmar' };
      default:
        return { title: 'Mechanism Simulator', icon: Activity, subtitle: 'Real-time engine kinematics' };
    }
  };

  const pageInfo = getPageInfo();
  const PageIcon = pageInfo.icon;
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen flex flex-col antialiased transition-colors duration-200 ${
      isDark ? 'bg-[#090d16] text-slate-100' : 'bg-[#f8fafc] text-slate-900'
    }`}>
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isImperial={isImperial}
        setIsImperial={handleUnitToggle}
        theme={theme}
        setTheme={setTheme}
        onExportExcel={handleExportExcel}
      />

      {/* Main Container */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-5 sm:space-y-6">
        
        {/* Simple & Professional Page Header */}
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 sm:p-4 rounded-xl border transition-colors ${
          isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              isDark ? 'bg-blue-600/15 text-blue-400 border border-blue-500/20' : 'bg-blue-50 text-blue-600 border border-blue-100'
            }`}>
              <PageIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5 text-[10px] sm:text-[11px] font-mono">
                <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>PistonPro</span>
                <ChevronRight className={`w-3 h-3 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
                <span className="font-bold text-blue-500 uppercase">{activeTab}</span>
              </div>
              <h1 className="text-sm sm:text-lg font-bold tracking-tight">{pageInfo.title}</h1>
            </div>
          </div>

          <div className={`text-xs hidden md:block max-w-md text-right ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {pageInfo.subtitle}
          </div>
        </div>

        {/* Global Input Parameters Panel (Only shown on calculation pages) */}
        {activeTab !== 'about' && activeTab !== 'theory' && (
          <ParameterForm
            params={params}
            setParams={setParams}
            summary={summary}
            isImperial={isImperial}
            theme={theme}
            onReset={handleReset}
          />
        )}

        {/* Dedicated Page Views */}
        {activeTab === 'visualizer' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <PistonAnimation
              params={params}
              summary={summary}
              isImperial={isImperial}
              theme={theme}
            />
          </div>
        )}

        {activeTab === 'charts' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <KinematicsCharts
              params={params}
              summary={summary}
              isImperial={isImperial}
              theme={theme}
            />
          </div>
        )}

        {activeTab === 'spreadsheet' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <SpreadsheetView
              params={params}
              summary={summary}
              isImperial={isImperial}
              theme={theme}
            />
          </div>
        )}

        {activeTab === 'presets' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <EnginePresets
              currentPresetId={currentPresetId}
              onSelectPreset={handleSelectPreset}
              isImperial={isImperial}
              theme={theme}
            />
          </div>
        )}

        {activeTab === 'theory' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <TheorySection
              params={params}
              summary={summary}
              isImperial={isImperial}
              theme={theme}
            />
          </div>
        )}

        {activeTab === 'about' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <AboutSection theme={theme} />
          </div>
        )}

      </main>

      {/* Clean Professional Footer */}
      <footer className={`border-t py-6 px-4 text-center text-xs transition-colors ${
        isDark ? 'border-slate-800/80 bg-slate-950/80 text-slate-400' : 'border-slate-200 bg-white text-slate-500'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-bold">PistonPro Kinematics Suite</span>
            <span>&bull;</span>
            <span>Slider-Crank Dynamics & Balancer</span>
          </div>
          <div>
            Project Architect: <strong className={isDark ? 'text-slate-200' : 'text-slate-800'}>Rahul Parmar</strong>
          </div>
        </div>
      </footer>

    </div>
  );
}
