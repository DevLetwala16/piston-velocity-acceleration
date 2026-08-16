"""
Interactive CLI Calculator & Plotter for Piston Kinematics
Author: Rahul Parmar
Description:
    Command-line interface to compute engine kinematics, plot curves with matplotlib,
    and generate Excel reports.
"""

import argparse
import sys
import numpy as np

try:
    import matplotlib.pyplot as plt
    MATPLOTLIB_AVAILABLE = True
except ImportError:
    MATPLOTLIB_AVAILABLE = False

from engine_kinematics import SliderCrankKinematics
from generate_spreadsheet import generate_piston_spreadsheet


def print_banner():
    banner = r"""
  ╔═══════════════════════════════════════════════════════════════════╗
  ║      PISTON KINEMATICS & RECIPROCATING DYNAMICS CALCULATOR        ║
  ║      Author: Rahul Parmar | Advanced Slider-Crank Analysis        ║
  ╚═══════════════════════════════════════════════════════════════════╝
    """
    print(banner)


def plot_kinematics(calc: SliderCrankKinematics, cycle_data: dict):
    if not MATPLOTLIB_AVAILABLE:
        print("[!] Matplotlib is not installed. Skipping plot generation.")
        return

    theta = cycle_data["crank_angle_deg"]
    disp = cycle_data["displacement_mm"]
    vel = cycle_data["velocity_mps"]
    acc = cycle_data["acceleration_mps2"]
    acc_p = cycle_data["acceleration_primary_mps2"]
    acc_s = cycle_data["acceleration_secondary_mps2"]
    inertia = cycle_data["inertia_force_N"] / 1000.0  # kN

    plt.style.use("seaborn-v0_8-whitegrid" if "seaborn-v0_8-whitegrid" in plt.style.available else "default")
    fig, axs = plt.subplots(2, 2, figsize=(14, 9))
    fig.suptitle(f"Engine Kinematics & Dynamics ({calc.rpm:.0f} RPM, Bore: {calc.bore}mm, Stroke: {calc.stroke}mm)\nAuthor: Rahul Parmar", fontsize=14, fontweight='bold')

    # 1. Displacement
    axs[0, 0].plot(theta, disp, color="#2563EB", lw=2, label="Exact Displacement")
    axs[0, 0].set_title("Piston Displacement vs Crank Angle", fontweight='bold')
    axs[0, 0].set_xlabel("Crank Angle θ (°)")
    axs[0, 0].set_ylabel("Displacement x (mm)")
    axs[0, 0].set_xlim(0, 360)
    axs[0, 0].grid(True, linestyle="--", alpha=0.6)
    axs[0, 0].legend()

    # 2. Velocity
    axs[0, 1].plot(theta, vel, color="#059669", lw=2, label="Velocity (m/s)")
    axs[0, 1].axhline(0, color="gray", linestyle="--", alpha=0.7)
    axs[0, 1].set_title("Piston Velocity vs Crank Angle", fontweight='bold')
    axs[0, 1].set_xlabel("Crank Angle θ (°)")
    axs[0, 1].set_ylabel("Velocity v (m/s)")
    axs[0, 1].set_xlim(0, 360)
    axs[0, 1].grid(True, linestyle="--", alpha=0.6)
    axs[0, 1].legend()

    # 3. Acceleration
    axs[1, 0].plot(theta, acc, color="#DC2626", lw=2, label="Total Acceleration")
    axs[1, 0].plot(theta, acc_p, color="#EA580C", linestyle=":", label="Primary Harmonic")
    axs[1, 0].plot(theta, acc_s, color="#9333EA", linestyle="--", label="Secondary Harmonic")
    axs[1, 0].axhline(0, color="gray", linestyle="--", alpha=0.7)
    axs[1, 0].set_title("Piston Acceleration vs Crank Angle", fontweight='bold')
    axs[1, 0].set_xlabel("Crank Angle θ (°)")
    axs[1, 0].set_ylabel("Acceleration a (m/s²)")
    axs[1, 0].set_xlim(0, 360)
    axs[1, 0].grid(True, linestyle="--", alpha=0.6)
    axs[1, 0].legend()

    # 4. Inertia Force
    axs[1, 1].plot(theta, inertia, color="#4F46E5", lw=2, label="Reciprocating Inertia Force")
    axs[1, 1].axhline(0, color="gray", linestyle="--", alpha=0.7)
    axs[1, 1].set_title("Inertia Force vs Crank Angle", fontweight='bold')
    axs[1, 1].set_xlabel("Crank Angle θ (°)")
    axs[1, 1].set_ylabel("Inertia Force Fi (kN)")
    axs[1, 1].set_xlim(0, 360)
    axs[1, 1].grid(True, linestyle="--", alpha=0.6)
    axs[1, 1].legend()

    plt.tight_layout()
    plt.show()


def main():
    parser = argparse.ArgumentParser(description="Piston Kinematics & Dynamics Calculator (by Rahul Parmar)")
    parser.add_argument("--bore", type=float, default=85.0, help="Cylinder bore in mm (default: 85.0)")
    parser.add_argument("--stroke", type=float, default=88.0, help="Piston stroke in mm (default: 88.0)")
    parser.add_argument("--rod", type=float, default=145.0, help="Connecting rod length in mm (default: 145.0)")
    parser.add_argument("--rpm", type=float, default=6000.0, help="Engine speed in RPM (default: 6000.0)")
    parser.add_argument("--mass", type=float, default=0.45, help="Reciprocating mass in kg (default: 0.45)")
    parser.add_argument("--plot", action="store_true", help="Display Matplotlib graphical plots")
    parser.add_argument("--excel", action="store_true", help="Generate Excel spreadsheet")
    parser.add_argument("--output", type=str, default="piston_kinematics.xlsx", help="Excel output path")

    args = parser.parse_args()

    print_banner()

    calc = SliderCrankKinematics(
        bore=args.bore,
        stroke=args.stroke,
        con_rod_length=args.rod,
        rpm=args.rpm,
        reciprocating_mass=args.mass
    )

    summary = calc.get_summary_statistics()

    print("ENGINE PARAMETERS:")
    print(f"  • Bore:                {args.bore:8.2f} mm")
    print(f"  • Stroke:              {args.stroke:8.2f} mm")
    print(f"  • Connecting Rod:      {args.rod:8.2f} mm")
    print(f"  • Engine Speed:        {args.rpm:8.0f} RPM")
    print(f"  • Reciprocating Mass:  {args.mass:8.3f} kg")
    print(f"  • Rod / Crank Ratio n: {summary['rod_to_crank_ratio_n']:8.3f}")
    print(f"  • Displacement:        {summary['displacement_volume_cc']:8.2f} cc")
    print("-" * 65)
    print("KEY PERFORMANCE RESULTS:")
    print(f"  • Mean Piston Speed:   {summary['mean_piston_speed_mps']:8.2f} m/s")
    print(f"  • Max Piston Velocity: {summary['max_velocity_mps']:8.2f} m/s (at {summary['angle_at_max_velocity_deg']:.1f}°)")
    print(f"  • Max Accel at TDC:    {summary['accel_at_tdc_mps2']:8.1f} m/s² ({summary['accel_at_tdc_g']:.1f} g)")
    print(f"  • Accel at BDC:        {summary['accel_at_bdc_mps2']:8.1f} m/s² ({summary['accel_at_bdc_g']:.1f} g)")
    print(f"  • Inertia Force @ TDC: {summary['inertia_force_at_tdc_kN']:8.3f} kN ({summary['inertia_force_at_tdc_N']:.1f} N)")
    print(f"  • Inertia Force @ BDC: {summary['inertia_force_at_bdc_kN']:8.3f} kN ({summary['inertia_force_at_bdc_N']:.1f} N)")
    print("=" * 65)

    if args.excel:
        generate_piston_spreadsheet(
            bore=args.bore,
            stroke=args.stroke,
            con_rod_length=args.rod,
            rpm=args.rpm,
            reciprocating_mass=args.mass,
            output_filepath=args.output
        )

    if args.plot:
        cycle = calc.compute_cycle(angle_step=1.0)
        plot_kinematics(calc, cycle)


if __name__ == "__main__":
    main()
