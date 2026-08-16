import React, { useState, useMemo } from 'react';
import { 
  FileSpreadsheet, 
  FileText, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Copy, 
  Check, 
  SlidersHorizontal 
} from 'lucide-react';
import { calculateFullCycle } from '../utils/engineMath';
import { exportToCSV, exportToExcel } from '../utils/exportUtils';

export default function SpreadsheetView({ params, summary, isImperial, theme }) {
  const [angleStep, setAngleStep] = useState(2.0);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [copied, setCopied] = useState(false);

  const isDark = theme === 'dark';

  const units = {
    length: isImperial ? 'in' : 'mm',
    speed: isImperial ? 'ft/s' : 'm/s',
    accel: isImperial ? 'ft/s²' : 'm/s²',
    force: isImperial ? 'lbf' : 'N',
  };

  const fullData = useMemo(() => {
    return calculateFullCycle(params, angleStep, 360, isImperial);
  }, [params, angleStep, isImperial]);

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return fullData;
    return fullData.filter(pt => 
      pt.theta.toString().includes(searchTerm) ||
      pt.thetaFormatted.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [fullData, searchTerm]);

  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const handleCopyClipboard = () => {
    const header = "θ (deg)\tθ (rad)\tβ (deg)\tDisplacement\tVelocity\tAcceleration\tInertia Force\n";
    const body = filteredData.map(pt => 
      `${pt.theta}\t${pt.thetaRad.toFixed(4)}\t${pt.betaDeg.toFixed(2)}\t${pt.displacement.toFixed(2)}\t${pt.velocity.toFixed(2)}\t${pt.acceleration.toFixed(1)}\t${pt.inertiaForce.toFixed(1)}`
    ).join('\n');

    navigator.clipboard.writeText(header + body);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`p-4 sm:p-5 rounded-xl border transition-colors space-y-4 ${
      isDark ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
    }`}>
      
      {/* Top Header & Export Actions */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-3 border-b border-slate-700/30">
        <div>
          <h3 className="text-sm font-bold tracking-tight">Kinematics & Dynamics Spreadsheet</h3>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Degree-by-degree analytical tabular dataset</p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => exportToCSV(fullData, `piston_kinematics_${params.rpm}rpm.csv`, isImperial)}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
              isDark 
                ? 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800' 
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>

          <button
            onClick={() => exportToExcel(fullData, params, summary, `piston_kinematics_${params.rpm}rpm.xlsx`, isImperial)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-all"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Download Excel</span>
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 text-xs">
        
        {/* Step & Page Size */}
        <div className="flex items-center space-x-2">
          <div className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg border ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <SlidersHorizontal className="w-3 h-3 text-slate-400" />
            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Step:</span>
            <select
              value={angleStep}
              onChange={(e) => {
                setAngleStep(parseFloat(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-transparent font-mono font-semibold outline-none cursor-pointer"
            >
              <option value="0.5" className={isDark ? 'bg-slate-900' : 'bg-white'}>0.5°</option>
              <option value="1.0" className={isDark ? 'bg-slate-900' : 'bg-white'}>1.0°</option>
              <option value="2.0" className={isDark ? 'bg-slate-900' : 'bg-white'}>2.0°</option>
              <option value="5.0" className={isDark ? 'bg-slate-900' : 'bg-white'}>5.0°</option>
              <option value="10.0" className={isDark ? 'bg-slate-900' : 'bg-white'}>10.0°</option>
            </select>
          </div>

          <div className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg border ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Rows:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(parseInt(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-transparent font-mono font-semibold outline-none cursor-pointer"
            >
              <option value="10" className={isDark ? 'bg-slate-900' : 'bg-white'}>10</option>
              <option value="20" className={isDark ? 'bg-slate-900' : 'bg-white'}>20</option>
              <option value="50" className={isDark ? 'bg-slate-900' : 'bg-white'}>50</option>
            </select>
          </div>
        </div>

        {/* Search & Copy */}
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search angle..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className={`border rounded-lg pl-7 pr-2.5 py-1 text-xs outline-none w-36 font-mono ${
                isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            />
          </div>

          <button
            onClick={handleCopyClipboard}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors ${
              isDark ? 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

      </div>

      {/* Table */}
      <div className={`overflow-x-auto rounded-lg border ${
        isDark ? 'border-slate-800' : 'border-slate-200'
      }`}>
        <table className="w-full text-left text-xs font-mono border-collapse">
          <thead>
            <tr className={`border-b font-bold ${
              isDark ? 'bg-slate-950 text-slate-300 border-slate-800' : 'bg-slate-100 text-slate-700 border-slate-200'
            }`}>
              <th className="py-2.5 px-3">θ (deg)</th>
              <th className="py-2.5 px-3">θ (rad)</th>
              <th className="py-2.5 px-3">β Rod (deg)</th>
              <th className="py-2.5 px-3 text-sky-500">Disp ({units.length})</th>
              <th className="py-2.5 px-3 text-emerald-500">Vel ({units.speed})</th>
              <th className="py-2.5 px-3 text-rose-500">Accel ({units.accel})</th>
              <th className="py-2.5 px-3 text-amber-500">Inertia ({units.force})</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${
            isDark ? 'divide-slate-800/60 text-slate-200' : 'divide-slate-200 text-slate-800'
          }`}>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, idx) => {
                const isTdc = row.theta === 0 || row.theta === 360;
                const isBdc = row.theta === 180;
                return (
                  <tr 
                    key={row.theta} 
                    className={`transition-colors ${
                      isTdc 
                        ? 'bg-red-500/10 font-bold' 
                        : isBdc 
                          ? 'bg-emerald-500/10 font-bold' 
                          : idx % 2 === 0 
                            ? isDark ? 'bg-slate-950/40' : 'bg-slate-50/60'
                            : ''
                    }`}
                  >
                    <td className="py-2 px-3 font-semibold">
                      {row.theta.toFixed(1)}°
                      {isTdc && <span className="ml-1 text-[9px] px-1 py-0.2 bg-red-500/20 text-red-500 rounded font-bold">TDC</span>}
                      {isBdc && <span className="ml-1 text-[9px] px-1 py-0.2 bg-emerald-500/20 text-emerald-500 rounded font-bold">BDC</span>}
                    </td>
                    <td className="py-2 px-3 opacity-70">{row.thetaRad.toFixed(4)}</td>
                    <td className="py-2 px-3">{row.betaDeg.toFixed(2)}°</td>
                    <td className="py-2 px-3 text-sky-500 font-semibold">{row.displacement.toFixed(2)}</td>
                    <td className="py-2 px-3 text-emerald-500 font-semibold">{row.velocity.toFixed(2)}</td>
                    <td className="py-2 px-3 text-rose-500 font-semibold">{row.acceleration.toFixed(0)}</td>
                    <td className="py-2 px-3 text-amber-500 font-semibold">{row.inertiaForce.toFixed(0)}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="py-6 text-center text-slate-400">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className={`flex items-center justify-between pt-1 text-xs ${
        isDark ? 'text-slate-400' : 'text-slate-500'
      }`}>
        <div>
          Showing {filteredData.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to {Math.min(currentPage * pageSize, filteredData.length)} of {filteredData.length}
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`p-1 rounded-md border disabled:opacity-30 ${
              isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="font-mono px-2 font-semibold">
            {currentPage} / {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className={`p-1 rounded-md border disabled:opacity-30 ${
              isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
