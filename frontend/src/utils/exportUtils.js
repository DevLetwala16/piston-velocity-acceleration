/**
 * Spreadsheet & CSV Export Utilities
 * Author: Rahul Parmar
 */
import * as XLSX from 'xlsx';

export function exportToCSV(data, filename = 'piston_kinematics_data.csv', isImperial = false) {
  const headers = [
    `Crank Angle (deg)`,
    `Crank Angle (rad)`,
    `Con-Rod Angle (deg)`,
    `Displacement (${isImperial ? 'in' : 'mm'})`,
    `Velocity (${isImperial ? 'ft/s' : 'm/s'})`,
    `Total Accel (${isImperial ? 'ft/s2' : 'm/s2'})`,
    `Accel (g)`,
    `Primary Accel (${isImperial ? 'ft/s2' : 'm/s2'})`,
    `Secondary Accel (${isImperial ? 'ft/s2' : 'm/s2'})`,
    `Inertia Force (${isImperial ? 'lbf' : 'N'})`,
  ];

  const rows = data.map(pt => [
    pt.theta.toFixed(1),
    pt.thetaRad.toFixed(4),
    pt.betaDeg.toFixed(3),
    pt.displacement.toFixed(3),
    pt.velocity.toFixed(3),
    pt.acceleration.toFixed(2),
    pt.accelerationG.toFixed(2),
    pt.accPrimary.toFixed(2),
    pt.accSecondary.toFixed(2),
    pt.inertiaForce.toFixed(2)
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(r => r.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToExcel(data, params, summary, filename = 'piston_kinematics_sheet.xlsx', isImperial = false) {
  const wb = XLSX.utils.book_new();

  // 1. Summary Sheet
  const summaryRows = [
    ["PISTON KINEMATICS & DYNAMICS ANALYSIS"],
    ["Author: Rahul Parmar | Advanced Slider-Crank Analysis Engine"],
    [],
    ["1. ENGINE INPUT PARAMETERS", "", ""],
    ["Parameter", "Value", "Unit"],
    ["Cylinder Bore", params.bore, isImperial ? "in" : "mm"],
    ["Piston Stroke", params.stroke, isImperial ? "in" : "mm"],
    ["Connecting Rod Length", params.conRodLength, isImperial ? "in" : "mm"],
    ["Engine Speed", params.rpm, "RPM"],
    ["Reciprocating Mass", params.reciprocatingMass, isImperial ? "lb" : "kg"],
    ["Rod-to-Crank Ratio (n)", summary.rodRatioN.toFixed(3), "ratio"],
    [],
    ["2. CRITICAL PERFORMANCE METRICS", "", ""],
    ["Metric", "Value", "Unit"],
    ["Displacement Volume", summary.displacementCc.toFixed(1), "cc"],
    ["Angular Velocity (omega)", summary.omegaRadS.toFixed(2), "rad/s"],
    ["Mean Piston Speed", summary.meanPistonSpeed.toFixed(2), isImperial ? "ft/s" : "m/s"],
    ["Max Piston Velocity", summary.maxVelocity.toFixed(2), isImperial ? "ft/s" : "m/s"],
    ["Angle @ Max Velocity", summary.angleMaxVelocity.toFixed(1), "deg ATDC"],
    ["Max Acceleration @ TDC", summary.accelTdc.toFixed(1), isImperial ? "ft/s2" : "m/s2"],
    ["Acceleration @ TDC (g's)", summary.accelTdcG.toFixed(1), "g"],
    ["Acceleration @ BDC", summary.accelBdc.toFixed(1), isImperial ? "ft/s2" : "m/s2"],
    ["Inertia Force @ TDC", summary.inertiaTdc.toFixed(1), isImperial ? "lbf" : "N"],
    ["Inertia Force @ BDC", summary.inertiaBdc.toFixed(1), isImperial ? "lbf" : "N"],
    ["Max Inertia Force", summary.maxInertiaForce.toFixed(1), isImperial ? "lbf" : "N"],
  ];

  const wsSummary = XLSX.utils.aoa_to_sheet(summaryRows);
  XLSX.utils.book_append_sheet(wb, wsSummary, "Engine Summary");

  // 2. Kinematics Data Sheet
  const dataHeader = [
    `Crank Angle (deg)`,
    `Crank Angle (rad)`,
    `Con-Rod Angle (deg)`,
    `Displacement (${isImperial ? 'in' : 'mm'})`,
    `Velocity (${isImperial ? 'ft/s' : 'm/s'})`,
    `Acceleration (${isImperial ? 'ft/s2' : 'm/s2'})`,
    `Acceleration (g)`,
    `Primary Harmonic (${isImperial ? 'ft/s2' : 'm/s2'})`,
    `Secondary Harmonic (${isImperial ? 'ft/s2' : 'm/s2'})`,
    `Inertia Force (${isImperial ? 'lbf' : 'N'})`,
  ];

  const dataRows = data.map(pt => [
    pt.theta,
    parseFloat(pt.thetaRad.toFixed(4)),
    parseFloat(pt.betaDeg.toFixed(3)),
    parseFloat(pt.displacement.toFixed(3)),
    parseFloat(pt.velocity.toFixed(3)),
    parseFloat(pt.acceleration.toFixed(2)),
    parseFloat(pt.accelerationG.toFixed(2)),
    parseFloat(pt.accPrimary.toFixed(2)),
    parseFloat(pt.accSecondary.toFixed(2)),
    parseFloat(pt.inertiaForce.toFixed(2))
  ]);

  const wsData = XLSX.utils.aoa_to_sheet([dataHeader, ...dataRows]);
  XLSX.utils.book_append_sheet(wb, wsData, "Kinematics Data");

  XLSX.writeFile(wb, filename);
}
