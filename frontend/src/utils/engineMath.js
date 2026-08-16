/**
 * Engine Kinematics & Reciprocating Dynamics Mathematics
 * Author: Rahul Parmar
 */

export const ENGINE_PRESETS = [
  {
    id: 'f1_v10',
    name: 'Formula 1 3.0L V10 (High Revving)',
    category: 'Motorsport',
    bore: 98.0, // mm
    stroke: 39.7, // mm (ultra-short stroke)
    conRodLength: 102.0, // mm
    rpm: 19000,
    reciprocatingMass: 0.22, // kg (titanium/carbon pin)
    description: 'High-RPM racing engine with extreme piston acceleration (>8,000 g).'
  },
  {
    id: 'turbo_i4',
    name: '2.0L Turbo Inline-4 (Performance Car)',
    category: 'Production',
    bore: 82.5,
    stroke: 92.8,
    conRodLength: 144.0,
    rpm: 6800,
    reciprocatingMass: 0.42,
    description: 'Common performance road car engine (e.g. Golf R / Audi S3).'
  },
  {
    id: 'sportbike_600',
    name: '600cc Supersport Motorcycle',
    category: 'Motorcycle',
    bore: 67.0,
    stroke: 42.5,
    conRodLength: 95.0,
    rpm: 15500,
    reciprocatingMass: 0.16,
    description: 'High-revving inline-4 motorcycle with extreme mean piston speed.'
  },
  {
    id: 'diesel_heavy',
    name: '13.0L Heavy Duty Turbo-Diesel',
    category: 'Commercial',
    bore: 130.0,
    stroke: 160.0,
    conRodLength: 275.0,
    rpm: 2100,
    reciprocatingMass: 3.85,
    description: 'Long-stroke heavy commercial truck engine with huge reciprocating mass & inertia.'
  },
  {
    id: 'v8_muscle',
    name: '5.0L American V8 Muscle',
    category: 'Classic / GT',
    bore: 93.0,
    stroke: 92.7,
    conRodLength: 150.7,
    rpm: 6500,
    reciprocatingMass: 0.58,
    description: 'Naturally aspirated cross-plane V8 engine.'
  }
];

export function calculateSinglePoint(thetaDeg, params, isImperial = false) {
  let { bore, stroke, conRodLength, rpm, reciprocatingMass } = params;

  // Convert imperial inputs to metric internally for clean physics calculation
  if (isImperial) {
    bore = bore * 25.4;
    stroke = stroke * 25.4;
    conRodLength = conRodLength * 25.4;
    reciprocatingMass = reciprocatingMass * 0.45359237; // lb to kg
  }

  const r = stroke / 2.0; // mm
  const l = conRodLength; // mm
  const n = l / r; // rod to crank ratio
  const lambda = 1.0 / n;
  const omega = (2.0 * Math.PI * rpm) / 60.0; // rad/s

  const thetaRad = ((thetaDeg % 360) * Math.PI) / 180.0;
  const sinT = Math.sin(thetaRad);
  const cosT = Math.cos(thetaRad);
  const sin2T = Math.sin(2.0 * thetaRad);
  const cos2T = Math.cos(2.0 * thetaRad);

  const rM = r / 1000.0; // meters

  // Connecting rod angle beta
  const sinBeta = Math.max(-1.0, Math.min(1.0, sinT / n));
  const betaRad = Math.asin(sinBeta);
  const betaDeg = (betaRad * 180.0) / Math.PI;

  // 1. Exact Displacement from TDC (mm & m)
  const termSqrt = Math.sqrt(Math.max(0, 1.0 - Math.pow(sinT / n, 2)));
  const dispExactM = rM * ((1.0 - cosT) + n * (1.0 - termSqrt));
  const dispExactMm = dispExactM * 1000.0;
  const dispApproxMm = (rM * ((1.0 - cosT) + (lambda / 4.0) * (1.0 - cos2T))) * 1000.0;

  // 2. Exact Velocity (m/s)
  const denomV = 2.0 * Math.sqrt(Math.max(1e-9, Math.pow(n, 2) - Math.pow(sinT, 2)));
  const velExactMps = rM * omega * (sinT + sin2T / denomV);
  const velApproxMps = rM * omega * (sinT + sin2T / (2.0 * n));

  // 3. Exact Acceleration (m/s^2)
  const denomA = Math.pow(Math.max(1e-9, Math.pow(n, 2) - Math.pow(sinT, 2)), 1.5);
  const numerA = (n * n) * cos2T + Math.pow(sinT, 4);
  const accExactMps2 = rM * Math.pow(omega, 2) * (cosT + (numerA / denomA));

  const accPrimaryMps2 = rM * Math.pow(omega, 2) * cosT;
  const accSecondaryMps2 = rM * Math.pow(omega, 2) * (cos2T / n);
  const accApproxMps2 = accPrimaryMps2 + accSecondaryMps2;

  // 4. Inertia Force (N) - D'Alembert opposing acceleration
  const inertiaExactN = -reciprocatingMass * accExactMps2;
  const inertiaApproxN = -reciprocatingMass * accApproxMps2;
  const inertiaPrimaryN = -reciprocatingMass * accPrimaryMps2;
  const inertiaSecondaryN = -reciprocatingMass * accSecondaryMps2;

  if (isImperial) {
    return {
      thetaDeg,
      thetaRad,
      betaDeg,
      displacement: dispExactMm / 25.4, // inches
      displacementApprox: dispApproxMm / 25.4,
      velocity: velExactMps * 3.28084, // ft/s
      velocityApprox: velApproxMps * 3.28084,
      acceleration: accExactMps2 * 3.28084, // ft/s²
      accelerationG: accExactMps2 / 9.80665,
      accPrimary: accPrimaryMps2 * 3.28084,
      accSecondary: accSecondaryMps2 * 3.28084,
      inertiaForce: inertiaExactN * 0.224809, // lbf
      inertiaForceApprox: inertiaApproxN * 0.224809,
      inertiaPrimary: inertiaPrimaryN * 0.224809,
      inertiaSecondary: inertiaSecondaryN * 0.224809,
    };
  }

  return {
    thetaDeg,
    thetaRad,
    betaDeg,
    displacement: dispExactMm, // mm
    displacementApprox: dispApproxMm,
    velocity: velExactMps, // m/s
    velocityApprox: velApproxMps,
    acceleration: accExactMps2, // m/s²
    accelerationG: accExactMps2 / 9.80665,
    accPrimary: accPrimaryMps2,
    accSecondary: accSecondaryMps2,
    inertiaForce: inertiaExactN, // N
    inertiaForceApprox: inertiaApproxN,
    inertiaPrimary: inertiaPrimaryN,
    inertiaSecondary: inertiaSecondaryN,
  };
}

export function calculateFullCycle(params, angleStep = 1.0, maxAngle = 360, isImperial = false) {
  const points = [];
  for (let theta = 0; theta <= maxAngle; theta += angleStep) {
    const pt = calculateSinglePoint(theta, params, isImperial);
    points.push({
      theta: Math.round(theta * 10) / 10,
      thetaFormatted: `${theta}°`,
      ...pt
    });
  }
  return points;
}

export function computeSummaryStatistics(params, isImperial = false) {
  const cycle = calculateFullCycle(params, 0.2, 360, isImperial);
  
  let maxV = -Infinity;
  let angleMaxV = 0;
  let minV = Infinity;
  let angleMinV = 0;
  let maxAcc = -Infinity;
  let minAcc = Infinity;
  let maxForce = -Infinity;

  cycle.forEach(p => {
    if (p.velocity > maxV) {
      maxV = p.velocity;
      angleMaxV = p.theta;
    }
    if (p.velocity < minV) {
      minV = p.velocity;
      angleMinV = p.theta;
    }
    if (Math.abs(p.acceleration) > maxAcc) {
      maxAcc = Math.abs(p.acceleration);
    }
    if (Math.abs(p.inertiaForce) > maxForce) {
      maxForce = Math.abs(p.inertiaForce);
    }
  });

  const tdcPt = calculateSinglePoint(0, params, isImperial);
  const bdcPt = calculateSinglePoint(180, params, isImperial);

  const strokeM = (isImperial ? params.stroke * 25.4 : params.stroke) / 1000.0;
  const meanPistonSpeedMps = 2.0 * strokeM * (params.rpm / 60.0);
  const meanPistonSpeed = isImperial ? meanPistonSpeedMps * 3.28084 : meanPistonSpeedMps;

  const boreMm = isImperial ? params.bore * 25.4 : params.bore;
  const strokeMm = isImperial ? params.stroke * 25.4 : params.stroke;
  const dispCc = (Math.PI / 4.0) * Math.pow(boreMm / 10.0, 2) * (strokeMm / 10.0);

  const r = strokeMm / 2.0;
  const l = isImperial ? params.conRodLength * 25.4 : params.conRodLength;
  const n = l / r;

  return {
    displacementCc: dispCc,
    rodRatioN: n,
    meanPistonSpeed,
    maxVelocity: maxV,
    angleMaxVelocity: angleMaxV,
    minVelocity: minV,
    angleMinVelocity: angleMinV,
    accelTdc: tdcPt.acceleration,
    accelTdcG: tdcPt.accelerationG,
    accelBdc: bdcPt.acceleration,
    accelBdcG: bdcPt.accelerationG,
    inertiaTdc: tdcPt.inertiaForce,
    inertiaBdc: bdcPt.inertiaForce,
    maxInertiaForce: maxForce,
    omegaRadS: (2.0 * Math.PI * params.rpm) / 60.0
  };
}
