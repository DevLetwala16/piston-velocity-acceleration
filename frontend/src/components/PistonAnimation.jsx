import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Clock, 
  Infinity as InfinityIcon, 
  Flame, 
  Activity, 
  ChevronRight,
  Sliders
} from 'lucide-react';
import { calculateSinglePoint } from '../utils/engineMath';

export default function PistonAnimation({ params, summary, isImperial, theme }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  
  const isDark = theme === 'dark';

  // Animation state
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentAngle, setCurrentAngle] = useState(0);
  const [animationMode, setAnimationMode] = useState('infinite');
  const [targetDuration, setTargetDuration] = useState(10);
  const [remainingTime, setRemainingTime] = useState(10);
  const [speedMultiplier, setSpeedMultiplier] = useState(0.05);
  const [cycleCount, setCycleCount] = useState(0);
  const [showCombustionFlash, setShowCombustionFlash] = useState(true);
  const [canvasDim, setCanvasDim] = useState({ width: 440, height: 400 });

  const requestRef = useRef();
  const lastTimeRef = useRef();
  const angleRef = useRef(0);
  const cycleCountRef = useRef(0);
  const timerRef = useRef(targetDuration);

  // Resize observer
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const availableW = Math.min(460, Math.max(280, rect.width - 24));
        const aspectH = Math.min(420, Math.max(320, availableW * 0.92));
        setCanvasDim({ width: availableW, height: aspectH });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleAngleScrub = (newAngle) => {
    setIsPlaying(false);
    angleRef.current = newAngle;
    setCurrentAngle(newAngle);
  };

  const handleReset = () => {
    setIsPlaying(false);
    angleRef.current = 0;
    cycleCountRef.current = 0;
    timerRef.current = targetDuration;
    setCurrentAngle(0);
    setCycleCount(0);
    setRemainingTime(targetDuration);
  };

  const instantMetrics = calculateSinglePoint(currentAngle, params, isImperial);

  const units = {
    length: isImperial ? 'in' : 'mm',
    speed: isImperial ? 'ft/s' : 'm/s',
    accel: isImperial ? 'ft/s²' : 'm/s²',
    force: isImperial ? 'lbf' : 'N',
  };

  // Canvas Drawing Loop
  const renderEngine = useCallback((ctx, angle, width, height) => {
    ctx.clearRect(0, 0, width, height);

    // Canvas background
    ctx.fillStyle = isDark ? '#0b1120' : '#f8fafc';
    ctx.fillRect(0, 0, width, height);

    const strokeMm = isImperial ? params.stroke * 25.4 : params.stroke;
    const conRodMm = isImperial ? params.conRodLength * 25.4 : params.conRodLength;
    const boreMm = isImperial ? params.bore * 25.4 : params.bore;

    const totalMechanismHeight = strokeMm + conRodMm + strokeMm * 0.5 + 30;
    const availableHeight = height * 0.70;
    const scale = Math.min(availableHeight / totalMechanismHeight, (width * 0.42) / boreMm);

    const crankRadiusPx = (strokeMm / 2.0) * scale;
    const conRodLengthPx = conRodMm * scale;
    const boreRadiusPx = (boreMm / 2.0) * scale;
    const pistonHeightPx = Math.max(30, boreRadiusPx * 1.05);

    const crankCenterX = width / 2;
    const crankCenterY = height - crankRadiusPx - 38;

    const thetaRad = ((angle % 360) * Math.PI) / 180.0;
    
    const crankPinX = crankCenterX + crankRadiusPx * Math.sin(thetaRad);
    const crankPinY = crankCenterY - crankRadiusPx * Math.cos(thetaRad);

    const rodDx = crankPinX - crankCenterX;
    const rodDy = Math.sqrt(Math.max(0, Math.pow(conRodLengthPx, 2) - Math.pow(rodDx, 2)));
    const wristPinX = crankCenterX;
    const wristPinY = crankPinY - rodDy;

    const tdcWristY = crankCenterY - (crankRadiusPx + conRodLengthPx);
    const bdcWristY = crankCenterY - (conRodLengthPx - crankRadiusPx);

    // Grid lines
    ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 35) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 35) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Cylinder Bore Walls & Cooling Fins
    const cylinderTopY = tdcWristY - pistonHeightPx - 20;
    const cylinderBottomY = bdcWristY + 15;
    const leftWallX = crankCenterX - boreRadiusPx - 2;
    const rightWallX = crankCenterX + boreRadiusPx + 2;

    // Cooling Fins
    ctx.strokeStyle = isDark ? '#475569' : '#cbd5e1';
    ctx.lineWidth = 2;
    for (let finY = cylinderTopY + 12; finY < cylinderBottomY; finY += 15) {
      ctx.beginPath();
      ctx.moveTo(leftWallX - 16, finY);
      ctx.lineTo(leftWallX, finY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(rightWallX, finY);
      ctx.lineTo(rightWallX + 16, finY);
      ctx.stroke();
    }

    // Cylinder Liner Walls
    ctx.strokeStyle = isDark ? '#60a5fa' : '#3b82f6';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(leftWallX, cylinderTopY);
    ctx.lineTo(leftWallX, cylinderBottomY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(rightWallX, cylinderTopY);
    ctx.lineTo(rightWallX, cylinderBottomY);
    ctx.stroke();

    // Cylinder Head Deck
    ctx.fillStyle = isDark ? '#1e293b' : '#e2e8f0';
    ctx.strokeStyle = isDark ? '#94a3b8' : '#94a3b8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.rect(leftWallX - 20, cylinderTopY - 15, (boreRadiusPx + 22) * 2, 16);
    ctx.fill();
    ctx.stroke();

    // Spark Plug
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(crankCenterX - 3, cylinderTopY - 22, 6, 10);
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(crankCenterX, cylinderTopY - 2, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Combustion Flash
    const isNearTdcCombustion = (angle <= 25 || angle >= 335) && showCombustionFlash;
    if (isNearTdcCombustion) {
      const flashOpacity = angle <= 25 ? (1 - angle / 25) : ((angle - 335) / 25);
      const grad = ctx.createRadialGradient(
        crankCenterX, cylinderTopY + 8, 4,
        crankCenterX, cylinderTopY + 20, boreRadiusPx * 1.2
      );
      grad.addColorStop(0, `rgba(255, 255, 255, ${0.9 * flashOpacity})`);
      grad.addColorStop(0.2, `rgba(251, 146, 60, ${0.8 * flashOpacity})`);
      grad.addColorStop(0.6, `rgba(239, 68, 68, ${0.5 * flashOpacity})`);
      grad.addColorStop(1, 'rgba(239, 68, 68, 0)');

      ctx.fillStyle = grad;
      ctx.fillRect(leftWallX + 1, cylinderTopY + 2, (boreRadiusPx * 2) - 2, wristPinY - pistonHeightPx + 10 - cylinderTopY);
    }

    // TDC & BDC Reference Lines
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.7)';
    ctx.setLineDash([3, 3]);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(leftWallX - 30, tdcWristY);
    ctx.lineTo(rightWallX + 30, tdcWristY);
    ctx.stroke();

    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'right';
    ctx.fillText('TDC', leftWallX - 4, tdcWristY - 2);

    ctx.strokeStyle = 'rgba(34, 197, 94, 0.7)';
    ctx.beginPath();
    ctx.moveTo(leftWallX - 30, bdcWristY);
    ctx.lineTo(rightWallX + 30, bdcWristY);
    ctx.stroke();

    ctx.fillStyle = '#22c55e';
    ctx.fillText('BDC', leftWallX - 4, bdcWristY + 9);
    ctx.setLineDash([]);

    // Crank Orbit Circle
    ctx.strokeStyle = isDark ? 'rgba(59, 130, 246, 0.25)' : 'rgba(59, 130, 246, 0.2)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.arc(crankCenterX, crankCenterY, crankRadiusPx, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Counterweight
    ctx.save();
    ctx.translate(crankCenterX, crankCenterY);
    ctx.rotate(thetaRad);

    ctx.fillStyle = isDark ? '#334155' : '#cbd5e1';
    ctx.strokeStyle = isDark ? '#64748b' : '#94a3b8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, crankRadiusPx * 0.95, 0.25 * Math.PI, 0.75 * Math.PI, false);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Crank Arm
    ctx.fillStyle = isDark ? '#475569' : '#94a3b8';
    ctx.beginPath();
    ctx.roundRect(-crankRadiusPx * 0.35, -crankRadiusPx - 4, crankRadiusPx * 0.7, crankRadiusPx + 8, 6);
    ctx.fill();
    ctx.stroke();

    // Center Journal
    ctx.fillStyle = isDark ? '#1e293b' : '#64748b';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, Math.max(9, crankRadiusPx * 0.3), 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.restore();

    // Connecting Rod
    const rodAngle = Math.atan2(wristPinY - crankPinY, wristPinX - crankPinX);
    const rodLength = Math.hypot(wristPinX - crankPinX, wristPinY - crankPinY);

    ctx.save();
    ctx.translate(crankPinX, crankPinY);
    ctx.rotate(rodAngle);

    const beamGrad = ctx.createLinearGradient(0, -6, 0, 6);
    beamGrad.addColorStop(0, isDark ? '#94a3b8' : '#64748b');
    beamGrad.addColorStop(0.5, isDark ? '#475569' : '#94a3b8');
    beamGrad.addColorStop(1, isDark ? '#1e293b' : '#cbd5e1');

    ctx.fillStyle = beamGrad;
    ctx.strokeStyle = isDark ? '#cbd5e1' : '#475569';
    ctx.lineWidth = 1.5;

    ctx.beginPath();
    ctx.moveTo(10, -5);
    ctx.lineTo(rodLength - 7, -3.5);
    ctx.lineTo(rodLength - 7, 3.5);
    ctx.lineTo(10, 5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Big End
    ctx.fillStyle = isDark ? '#334155' : '#e2e8f0';
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, Math.max(7, crankRadiusPx * 0.28), 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Small End
    ctx.fillStyle = isDark ? '#334155' : '#e2e8f0';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(rodLength, 0, Math.max(5, crankRadiusPx * 0.18), 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.restore();

    // Piston Assembly
    const pistonTopY = wristPinY - pistonHeightPx * 0.55;
    const pistonLeftX = crankCenterX - boreRadiusPx + 1;
    const pistonWidth = (boreRadiusPx - 1) * 2;

    const pistonGrad = ctx.createLinearGradient(pistonLeftX, 0, pistonLeftX + pistonWidth, 0);
    pistonGrad.addColorStop(0, isDark ? '#64748b' : '#94a3b8');
    pistonGrad.addColorStop(0.3, isDark ? '#cbd5e1' : '#f1f5f9');
    pistonGrad.addColorStop(0.7, isDark ? '#94a3b8' : '#e2e8f0');
    pistonGrad.addColorStop(1, isDark ? '#475569' : '#cbd5e1');

    ctx.fillStyle = pistonGrad;
    ctx.strokeStyle = isDark ? '#e2e8f0' : '#475569';
    ctx.lineWidth = 1.5;

    ctx.beginPath();
    ctx.moveTo(pistonLeftX, pistonTopY);
    ctx.lineTo(pistonLeftX + pistonWidth, pistonTopY);
    ctx.lineTo(pistonLeftX + pistonWidth, pistonTopY + pistonHeightPx);
    ctx.lineTo(pistonLeftX + pistonWidth - 8, pistonTopY + pistonHeightPx);
    ctx.lineTo(pistonLeftX + pistonWidth - 12, pistonTopY + pistonHeightPx - 6);
    ctx.lineTo(pistonLeftX + 12, pistonTopY + pistonHeightPx - 6);
    ctx.lineTo(pistonLeftX + 8, pistonTopY + pistonHeightPx);
    ctx.lineTo(pistonLeftX, pistonTopY + pistonHeightPx);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Piston Rings
    ctx.fillStyle = isDark ? '#0f172a' : '#334155';
    for (let rIdx = 0; rIdx < 3; rIdx++) {
      const ringY = pistonTopY + 5 + rIdx * 5;
      ctx.fillRect(pistonLeftX, ringY, 2.5, 2);
      ctx.fillRect(pistonLeftX + pistonWidth - 2.5, ringY, 2.5, 2);
    }

    // Wrist Pin
    ctx.fillStyle = isDark ? '#1e293b' : '#ffffff';
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(wristPinX, wristPinY, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

  }, [params, isImperial, isDark, showCombustionFlash]);

  // Main Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const animate = (timestamp) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const deltaTime = (timestamp - lastTimeRef.current) / 1000.0;
      lastTimeRef.current = timestamp;

      if (isPlaying) {
        const degPerSec = params.rpm * 6.0 * speedMultiplier;
        const deltaAngle = degPerSec * deltaTime;

        angleRef.current = (angleRef.current + deltaAngle) % 360;
        setCurrentAngle(angleRef.current);

        const currentRevs = Math.floor((cycleCountRef.current * 360 + angleRef.current + deltaAngle) / 360);
        if (currentRevs > cycleCountRef.current) {
          cycleCountRef.current = currentRevs;
          setCycleCount(cycleCountRef.current);
        }

        if (animationMode === 'timed') {
          timerRef.current -= deltaTime;
          setRemainingTime(Math.max(0, timerRef.current));
          if (timerRef.current <= 0) {
            setIsPlaying(false);
            timerRef.current = targetDuration;
          }
        }
      }

      renderEngine(ctx, angleRef.current, canvas.width, canvas.height);
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, params.rpm, speedMultiplier, animationMode, targetDuration, renderEngine]);

  return (
    <div className={`p-4 sm:p-5 rounded-xl border transition-colors ${
      isDark ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
    }`}>
      
      {/* Top Header & Simulation Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-700/40">
        <div>
          <h3 className="text-sm font-bold tracking-tight">Slider-Crank Mechanism Simulation</h3>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Kinematic visualizer & instantaneous forces</p>
        </div>

        {/* Mode Selector */}
        <div className={`flex items-center p-0.5 rounded-lg border text-xs font-semibold ${
          isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
        }`}>
          <button
            onClick={() => {
              setAnimationMode('infinite');
              setRemainingTime(targetDuration);
              timerRef.current = targetDuration;
            }}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-md transition-all ${
              animationMode === 'infinite'
                ? isDark ? 'bg-blue-600 text-white' : 'bg-white text-slate-900 shadow-xs'
                : isDark ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            <InfinityIcon className="w-3.5 h-3.5" />
            <span>Infinite</span>
          </button>

          <button
            onClick={() => {
              setAnimationMode('timed');
              setRemainingTime(targetDuration);
              timerRef.current = targetDuration;
            }}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-md transition-all ${
              animationMode === 'timed'
                ? isDark ? 'bg-blue-600 text-white' : 'bg-white text-slate-900 shadow-xs'
                : isDark ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Timed</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Canvas & Gauges */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 my-4 items-center">
        
        {/* Left: Canvas */}
        <div 
          ref={containerRef}
          className={`lg:col-span-7 flex flex-col items-center justify-center rounded-xl p-2 sm:p-3 relative border ${
            isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <canvas
            ref={canvasRef}
            width={canvasDim.width}
            height={canvasDim.height}
            className="max-w-full h-auto rounded-lg"
          />

          {/* Floating Angle Badge */}
          <div className={`absolute top-3 left-3 px-2 py-0.5 rounded-md border text-xs font-mono font-bold ${
            isDark ? 'bg-slate-900/90 border-slate-700 text-blue-400' : 'bg-white/95 border-slate-300 text-blue-600 shadow-xs'
          }`}>
            θ: {currentAngle.toFixed(1)}°
          </div>

          {animationMode === 'timed' && (
            <div className="absolute top-3 right-3 bg-amber-500/10 border border-amber-500/30 text-amber-500 px-2 py-0.5 rounded-md text-xs font-mono font-bold">
              {remainingTime.toFixed(1)}s
            </div>
          )}
        </div>

        {/* Right: Telemetry Gauges */}
        <div className="lg:col-span-5 space-y-2.5">
          
          <div className="flex justify-between items-center text-xs pb-1 border-b border-slate-700/30 font-semibold">
            <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Instantaneous Telemetry</span>
            <span className="text-blue-500 font-mono">@ {currentAngle.toFixed(1)}°</span>
          </div>

          {/* Velocity */}
          <div className={`p-2.5 rounded-lg border ${
            isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex justify-between text-xs mb-1">
              <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Piston Velocity</span>
              <span className="font-mono font-bold text-emerald-500">{instantMetrics.velocity.toFixed(2)} {units.speed}</span>
            </div>
            <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
              <div 
                className="h-full bg-emerald-500 transition-all duration-75"
                style={{ width: `${Math.min(100, (Math.abs(instantMetrics.velocity) / (summary.maxVelocity || 1)) * 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Acceleration */}
          <div className={`p-2.5 rounded-lg border ${
            isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex justify-between text-xs mb-1">
              <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Acceleration</span>
              <span className="font-mono font-bold text-rose-500">{instantMetrics.acceleration.toFixed(0)} {units.accel}</span>
            </div>
            <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
              <div 
                className="h-full bg-rose-500 transition-all duration-75"
                style={{ width: `${Math.min(100, (Math.abs(instantMetrics.acceleration) / (Math.abs(summary.accelTdc) || 1)) * 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Inertia Force */}
          <div className={`p-2.5 rounded-lg border ${
            isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex justify-between text-xs mb-1">
              <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Inertia Force</span>
              <span className="font-mono font-bold text-amber-500">{instantMetrics.inertiaForce.toFixed(1)} {units.force}</span>
            </div>
            <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
              <div 
                className="h-full bg-amber-500 transition-all duration-75"
                style={{ width: `${Math.min(100, (Math.abs(instantMetrics.inertiaForce) / (Math.abs(summary.maxInertiaForce) || 1)) * 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Displacement & Rod Angle */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className={`p-2 rounded-lg border ${
              isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className={`text-[10px] block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Displacement</span>
              <span className="text-sm font-bold font-mono text-blue-500">{instantMetrics.displacement.toFixed(2)} {units.length}</span>
            </div>

            <div className={`p-2 rounded-lg border ${
              isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className={`text-[10px] block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Rod Angle (β)</span>
              <span className="text-sm font-bold font-mono text-indigo-500">{instantMetrics.betaDeg.toFixed(2)}°</span>
            </div>
          </div>

          {/* Combustion Toggle */}
          <div className={`flex items-center justify-between px-3 py-1.5 rounded-lg border text-xs ${
            isDark ? 'bg-slate-950/40 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}>
            <span className="flex items-center space-x-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>Simulate TDC Combustion</span>
            </span>
            <input
              type="checkbox"
              checked={showCombustionFlash}
              onChange={(e) => setShowCombustionFlash(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 cursor-pointer"
            />
          </div>

        </div>

      </div>

      {/* Scrubbing & Controls */}
      <div className="space-y-2.5 pt-2 border-t border-slate-700/30">
        
        {/* Scrubber */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-xs font-semibold">
            <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Manual Crank Angle Scrub (0° → 360°)</span>
            <span className="text-blue-500 font-mono">{currentAngle.toFixed(1)}°</span>
          </div>
          <input
            type="range"
            min="0"
            max="360"
            step="0.5"
            value={currentAngle}
            onChange={(e) => handleAngleScrub(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-700/40 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-bold text-xs text-white transition-all ${
                isPlaying ? 'bg-amber-600 hover:bg-amber-500' : 'bg-emerald-600 hover:bg-emerald-500'
              }`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
              <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
            </button>

            <button
              onClick={handleReset}
              className={`p-1.5 rounded-lg border ${
                isDark ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
              title="Reset"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => handleAngleScrub((currentAngle + 5) % 360)}
              className={`flex items-center space-x-0.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono ${
                isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>+5°</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* Speed */}
          <div className="flex items-center space-x-1 text-xs">
            <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Speed:</span>
            {[
              { label: '0.01x', val: 0.01 },
              { label: '0.05x', val: 0.05 },
              { label: '0.1x', val: 0.1 },
              { label: '1.0x', val: 1.0 },
            ].map((spd) => (
              <button
                key={spd.val}
                onClick={() => setSpeedMultiplier(spd.val)}
                className={`px-2 py-0.5 rounded-md font-mono text-[10px] sm:text-[11px] transition-all border ${
                  speedMultiplier === spd.val
                    ? 'bg-blue-600 text-white border-blue-600'
                    : isDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
                }`}
              >
                {spd.label}
              </button>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
}
