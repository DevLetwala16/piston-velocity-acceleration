import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from 'recharts';
import { 
  TrendingUp, 
  Zap, 
  Flame, 
  Layers, 
  Maximize2
} from 'lucide-react';
import { calculateFullCycle } from '../utils/engineMath';

export default function KinematicsCharts({ params, summary, isImperial, theme }) {
  const [activeChartTab, setActiveChartTab] = useState('all');
  const [cycleRange, setCycleRange] = useState(360);
  const [showHarmonics, setShowHarmonics] = useState(true);

  const isDark = theme === 'dark';

  const units = {
    length: isImperial ? 'in' : 'mm',
    speed: isImperial ? 'ft/s' : 'm/s',
    accel: isImperial ? 'ft/s²' : 'm/s²',
    force: isImperial ? 'lbf' : 'N',
  };

  const data = calculateFullCycle(params, 2.0, cycleRange, isImperial);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-3 rounded-lg border text-xs font-mono shadow-lg ${
          isDark 
            ? 'bg-slate-950/95 border-slate-700 text-slate-100' 
            : 'bg-white/95 border-slate-200 text-slate-900 shadow-md'
        }`}>
          <div className={`font-bold border-b pb-1 mb-1 flex justify-between gap-3 ${
            isDark ? 'border-slate-800 text-slate-300' : 'border-slate-200 text-slate-700'
          }`}>
            <span>Crank Angle (θ):</span>
            <span className="text-blue-500">{label}°</span>
          </div>
          {payload.map((entry, index) => (
            <div key={`item-${index}`} className="flex justify-between items-center space-x-3">
              <span style={{ color: entry.color }} className="font-medium">
                {entry.name}:
              </span>
              <span className="font-bold">
                {typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`p-4 sm:p-5 rounded-xl border transition-colors space-y-4 ${
      isDark ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
    }`}>
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-3 border-b border-slate-700/30">
        <div>
          <h3 className="text-sm font-bold tracking-tight">Kinematics & Dynamic Graphs</h3>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Analytical curves vs crank angle</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          
          <div className={`flex items-center p-0.5 rounded-lg border ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              onClick={() => setCycleRange(360)}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                cycleRange === 360 
                  ? isDark ? 'bg-blue-600 text-white' : 'bg-white text-slate-900 shadow-xs' 
                  : isDark ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              1 Rev (360°)
            </button>
            <button
              onClick={() => setCycleRange(720)}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                cycleRange === 720 
                  ? isDark ? 'bg-blue-600 text-white' : 'bg-white text-slate-900 shadow-xs' 
                  : isDark ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              4-Stroke (720°)
            </button>
          </div>

          <button
            onClick={() => setShowHarmonics(!showHarmonics)}
            className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-all ${
              showHarmonics
                ? isDark ? 'bg-purple-600/20 text-purple-300 border-purple-500/40' : 'bg-purple-50 text-purple-700 border-purple-200'
                : isDark ? 'bg-slate-950 text-slate-400 border-slate-800' : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}
          >
            {showHarmonics ? '✓ Harmonics' : '+ Harmonics'}
          </button>

        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'all', label: 'All Curves', icon: Layers },
          { id: 'velocity', label: `Velocity (${units.speed})`, icon: TrendingUp },
          { id: 'acceleration', label: `Acceleration (${units.accel})`, icon: Zap },
          { id: 'force', label: `Inertia Force (${units.force})`, icon: Flame },
          { id: 'displacement', label: `Displacement (${units.length})`, icon: Maximize2 },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeChartTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveChartTab(tab.id)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all border ${
                isActive
                  ? isDark ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-900 text-white border-slate-900'
                  : isDark ? 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-white' : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Chart Canvas */}
      <div className={`h-[360px] w-full rounded-xl p-3 sm:p-4 border ${
        isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50/70 border-slate-200'
      }`}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 15 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1e293b' : '#e2e8f0'} />
            
            <XAxis 
              dataKey="theta" 
              stroke={isDark ? '#64748b' : '#94a3b8'} 
              tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 11 }}
              tickFormatter={(val) => `${val}°`}
              interval={cycleRange === 360 ? 44 : 89}
            />

            <YAxis 
              stroke={isDark ? '#64748b' : '#94a3b8'} 
              tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 11 }}
              domain={['auto', 'auto']}
            />

            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: '8px', fontSize: '12px' }} />

            <ReferenceLine x={0} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'TDC', fill: '#ef4444', fontSize: 10 }} />
            <ReferenceLine x={180} stroke="#22c55e" strokeDasharray="3 3" label={{ value: 'BDC', fill: '#22c55e', fontSize: 10 }} />
            <ReferenceLine x={360} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'TDC', fill: '#ef4444', fontSize: 10 }} />
            <ReferenceLine y={0} stroke={isDark ? '#475569' : '#cbd5e1'} />

            {(activeChartTab === 'all' || activeChartTab === 'displacement') && (
              <Line
                type="monotone"
                dataKey="displacement"
                name={`Displacement (${units.length})`}
                stroke="#0ea5e9"
                strokeWidth={2}
                dot={false}
              />
            )}

            {(activeChartTab === 'all' || activeChartTab === 'velocity') && (
              <Line
                type="monotone"
                dataKey="velocity"
                name={`Velocity (${units.speed})`}
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
              />
            )}

            {(activeChartTab === 'all' || activeChartTab === 'acceleration') && (
              <Line
                type="monotone"
                dataKey="acceleration"
                name={`Total Accel (${units.accel})`}
                stroke="#ef4444"
                strokeWidth={2}
                dot={false}
              />
            )}

            {showHarmonics && (activeChartTab === 'all' || activeChartTab === 'acceleration') && (
              <>
                <Line
                  type="monotone"
                  dataKey="accPrimary"
                  name={`Primary (${units.accel})`}
                  stroke="#f97316"
                  strokeWidth={1.5}
                  strokeDasharray="3 3"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="accSecondary"
                  name={`Secondary (${units.accel})`}
                  stroke="#a855f7"
                  strokeWidth={1.5}
                  strokeDasharray="2 2"
                  dot={false}
                />
              </>
            )}

            {(activeChartTab === 'all' || activeChartTab === 'force') && (
              <Line
                type="monotone"
                dataKey="inertiaForce"
                name={`Inertia Force (${units.force})`}
                stroke="#f59e0b"
                strokeWidth={2}
                dot={false}
              />
            )}

          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}
