"""
Piston Kinematics and Dynamics Engine
Author: Rahul Parmar
Description:
    Accurate analytical and numerical calculation of slider-crank mechanism
    kinematics: Piston displacement, velocity, acceleration, and reciprocating inertia forces.
"""

import math
import numpy as np
from typing import Dict, Any, Tuple, Optional


class SliderCrankKinematics:
    """
    Slider-Crank Mechanism Kinematics & Reciprocating Inertia Force Calculator.
    
    Parameters:
    -----------
    bore : float
        Cylinder bore diameter in mm.
    stroke : float
        Piston stroke in mm.
    con_rod_length : float
        Connecting rod length (center to center) in mm.
    rpm : float
        Engine rotational speed in Revolutions Per Minute.
    reciprocating_mass : float
        Mass of reciprocating components (piston head, rings, pin, ~1/3 rod) in kg.
    pin_offset : float, optional
        Piston pin offset in mm (default = 0.0 for inline cylinder).
    """

    def __init__(
        self,
        bore: float = 85.0,
        stroke: float = 88.0,
        con_rod_length: float = 145.0,
        rpm: float = 6000.0,
        reciprocating_mass: float = 0.45,
        pin_offset: float = 0.0
    ):
        self.bore = float(bore)
        self.stroke = float(stroke)
        self.con_rod_length = float(con_rod_length)
        self.rpm = float(rpm)
        self.reciprocating_mass = float(reciprocating_mass)
        self.pin_offset = float(pin_offset)

        # Validate geometry
        self.crank_radius = self.stroke / 2.0  # r in mm
        if self.con_rod_length < self.crank_radius:
            raise ValueError(
                f"Connecting rod length ({self.con_rod_length} mm) must be greater than "
                f"crank radius ({self.crank_radius} mm)."
            )

        # Dimensionless rod-to-crank ratio: n = L / r, or lambda = r / L
        self.n = self.con_rod_length / self.crank_radius
        self.rod_ratio = 1.0 / self.n  # lambda = r / L

        # Angular velocity omega in rad/s: omega = 2 * pi * N / 60
        self.omega = (2.0 * math.pi * self.rpm) / 60.0

        # Derived basic engine parameters
        self.displacement_volume_cc = (math.pi / 4.0) * (self.bore / 10.0)**2 * (self.stroke / 10.0)  # cm3
        self.mean_piston_speed_mps = 2.0 * (self.stroke / 1000.0) * (self.rpm / 60.0)  # m/s

    def compute_single_point(self, theta_deg: float) -> Dict[str, float]:
        """
        Compute instantaneous values at a specific crank angle theta in degrees.
        Theta = 0 deg is Top Dead Center (TDC), 180 deg is Bottom Dead Center (BDC).
        """
        theta_rad = math.radians(theta_deg % 360.0)
        sin_t = math.sin(theta_rad)
        cos_t = math.cos(theta_rad)
        cos_2t = math.cos(2.0 * theta_rad)
        sin_2t = math.sin(2.0 * theta_rad)

        r_m = self.crank_radius / 1000.0  # meters
        l_m = self.con_rod_length / 1000.0  # meters
        n = self.n

        # Connecting rod obliquity angle beta: sin(beta) = (r / l) * sin(theta)
        sin_beta = sin_t / n
        sin_beta = max(-1.0, min(1.0, sin_beta))
        beta_rad = math.asin(sin_beta)
        beta_deg = math.degrees(beta_rad)

        # 1. Exact Displacement from TDC (m and mm):
        # x(theta) = r * ( (1 - cos(theta)) + n * (1 - sqrt(1 - (sin(theta)/n)^2)) )
        term_sqrt = math.sqrt(max(0.0, 1.0 - (sin_t / n)**2))
        disp_exact_m = r_m * ((1.0 - cos_t) + n * (1.0 - term_sqrt))
        disp_exact_mm = disp_exact_m * 1000.0

        # Approximate Displacement:
        # x_approx = r * ( (1 - cos(theta)) + (lambda/4)*(1 - cos(2*theta)) )
        disp_approx_m = r_m * ((1.0 - cos_t) + (self.rod_ratio / 4.0) * (1.0 - cos_2t))
        disp_approx_mm = disp_approx_m * 1000.0

        # 2. Exact Piston Velocity (m/s):
        # v(theta) = r * omega * [ sin(theta) + sin(2*theta) / (2 * sqrt(n^2 - sin^2(theta))) ]
        denom_v = 2.0 * math.sqrt(max(1e-9, n**2 - sin_t**2))
        vel_exact_mps = r_m * self.omega * (sin_t + sin_2t / denom_v)

        # Approximate Piston Velocity:
        # v_approx = r * omega * [ sin(theta) + sin(2*theta)/(2*n) ]
        vel_approx_mps = r_m * self.omega * (sin_t + sin_2t / (2.0 * n))

        # 3. Exact Piston Acceleration (m/s^2):
        # a(theta) = r * omega^2 * [ cos(theta) + (n^2*cos(2*theta) + sin^4(theta)) / (n^2 - sin^2(theta))^(3/2) ]
        denom_a = (max(1e-9, n**2 - sin_t**2))**1.5
        numer_a = (n**2) * cos_2t + (sin_t**4)
        acc_exact_mps2 = r_m * (self.omega**2) * (cos_t + (numer_a / denom_a))

        # Approximate Piston Acceleration:
        # a_approx = r * omega^2 * [ cos(theta) + cos(2*theta)/n ]
        # Primary acceleration: r * omega^2 * cos(theta)
        # Secondary acceleration: r * omega^2 * (cos(2*theta)/n)
        acc_primary_mps2 = r_m * (self.omega**2) * cos_t
        acc_secondary_mps2 = r_m * (self.omega**2) * (cos_2t / n)
        acc_approx_mps2 = acc_primary_mps2 + acc_secondary_mps2

        # 4. Reciprocating Inertia Force (N):
        # F_inertia = - m_r * a(theta)
        # (Opposes acceleration according to D'Alembert's principle)
        inertia_force_exact_N = - self.reciprocating_mass * acc_exact_mps2
        inertia_force_approx_N = - self.reciprocating_mass * acc_approx_mps2
        inertia_force_primary_N = - self.reciprocating_mass * acc_primary_mps2
        inertia_force_secondary_N = - self.reciprocating_mass * acc_secondary_mps2

        return {
            "crank_angle_deg": theta_deg,
            "crank_angle_rad": theta_rad,
            "conrod_angle_deg": beta_deg,
            "displacement_mm": disp_exact_mm,
            "displacement_approx_mm": disp_approx_mm,
            "velocity_mps": vel_exact_mps,
            "velocity_approx_mps": vel_approx_mps,
            "acceleration_mps2": acc_exact_mps2,
            "acceleration_approx_mps2": acc_approx_mps2,
            "acceleration_primary_mps2": acc_primary_mps2,
            "acceleration_secondary_mps2": acc_secondary_mps2,
            "inertia_force_N": inertia_force_exact_N,
            "inertia_force_approx_N": inertia_force_approx_N,
            "inertia_force_primary_N": inertia_force_primary_N,
            "inertia_force_secondary_N": inertia_force_secondary_N,
        }

    def compute_cycle(self, angle_step: float = 1.0, max_angle: float = 360.0) -> Dict[str, np.ndarray]:
        """
        Compute kinematics and dynamics across an entire cycle using vectorized NumPy.
        """
        angles_deg = np.arange(0.0, max_angle + angle_step / 2.0, angle_step)
        theta_rad = np.radians(angles_deg % 360.0)

        sin_t = np.sin(theta_rad)
        cos_t = np.cos(theta_rad)
        sin_2t = np.sin(2.0 * theta_rad)
        cos_2t = np.cos(2.0 * theta_rad)

        r_m = self.crank_radius / 1000.0
        n = self.n
        omega = self.omega
        m_r = self.reciprocating_mass

        # Obliquity angle
        sin_beta = np.clip(sin_t / n, -1.0, 1.0)
        beta_deg = np.degrees(np.arcsin(sin_beta))

        # Displacement (mm)
        term_sqrt = np.sqrt(np.maximum(0.0, 1.0 - (sin_t / n)**2))
        disp_exact_mm = (r_m * ((1.0 - cos_t) + n * (1.0 - term_sqrt))) * 1000.0
        disp_approx_mm = (r_m * ((1.0 - cos_t) + (self.rod_ratio / 4.0) * (1.0 - cos_2t))) * 1000.0

        # Velocity (m/s)
        denom_v = 2.0 * np.sqrt(np.maximum(1e-9, n**2 - sin_t**2))
        vel_exact_mps = r_m * omega * (sin_t + sin_2t / denom_v)
        vel_approx_mps = r_m * omega * (sin_t + sin_2t / (2.0 * n))

        # Acceleration (m/s^2)
        denom_a = (np.maximum(1e-9, n**2 - sin_t**2))**1.5
        numer_a = (n**2) * cos_2t + (sin_t**4)
        acc_exact_mps2 = r_m * (omega**2) * (cos_t + (numer_a / denom_a))

        acc_primary_mps2 = r_m * (omega**2) * cos_t
        acc_secondary_mps2 = r_m * (omega**2) * (cos_2t / n)
        acc_approx_mps2 = acc_primary_mps2 + acc_secondary_mps2

        # Inertia Force (N)
        f_inertia_exact_N = - m_r * acc_exact_mps2
        f_inertia_approx_N = - m_r * acc_approx_mps2
        f_inertia_primary_N = - m_r * acc_primary_mps2
        f_inertia_secondary_N = - m_r * acc_secondary_mps2

        return {
            "crank_angle_deg": angles_deg,
            "conrod_angle_deg": beta_deg,
            "displacement_mm": disp_exact_mm,
            "displacement_approx_mm": disp_approx_mm,
            "velocity_mps": vel_exact_mps,
            "velocity_approx_mps": vel_approx_mps,
            "acceleration_mps2": acc_exact_mps2,
            "acceleration_approx_mps2": acc_approx_mps2,
            "acceleration_primary_mps2": acc_primary_mps2,
            "acceleration_secondary_mps2": acc_secondary_mps2,
            "inertia_force_N": f_inertia_exact_N,
            "inertia_force_approx_N": f_inertia_approx_N,
            "inertia_force_primary_N": f_inertia_primary_N,
            "inertia_force_secondary_N": f_inertia_secondary_N,
        }

    def get_summary_statistics(self) -> Dict[str, Any]:
        """
        Calculate key critical points:
        - Max velocity & angle of max velocity
        - Max acceleration at TDC (0 deg) and BDC (180 deg)
        - Max inertia forces
        - Mean piston speed
        """
        cycle_data = self.compute_cycle(angle_step=0.1, max_angle=360.0)
        
        vel = cycle_data["velocity_mps"]
        acc = cycle_data["acceleration_mps2"]
        angles = cycle_data["crank_angle_deg"]
        inertia = cycle_data["inertia_force_N"]

        # Max velocity in positive direction (downward stroke)
        idx_max_v = np.argmax(vel)
        max_vel = float(vel[idx_max_v])
        angle_max_vel = float(angles[idx_max_v])

        # Min velocity (max magnitude upward stroke)
        idx_min_v = np.argmin(vel)
        min_vel = float(vel[idx_min_v])
        angle_min_vel = float(angles[idx_min_v])

        # Acceleration at TDC (theta = 0) and BDC (theta = 180)
        tdc_pt = self.compute_single_point(0.0)
        bdc_pt = self.compute_single_point(180.0)

        # Acceleration in g's (9.80665 m/s^2)
        g = 9.80665

        return {
            "bore_mm": self.bore,
            "stroke_mm": self.stroke,
            "conrod_length_mm": self.con_rod_length,
            "rpm": self.rpm,
            "reciprocating_mass_kg": self.reciprocating_mass,
            "rod_to_crank_ratio_n": self.n,
            "crank_to_rod_ratio_lambda": self.rod_ratio,
            "displacement_volume_cc": self.displacement_volume_cc,
            "angular_velocity_rad_s": self.omega,
            "mean_piston_speed_mps": self.mean_piston_speed_mps,
            "max_velocity_mps": max_vel,
            "angle_at_max_velocity_deg": angle_max_vel,
            "min_velocity_mps": min_vel,
            "angle_at_min_velocity_deg": angle_min_vel,
            "accel_at_tdc_mps2": tdc_pt["acceleration_mps2"],
            "accel_at_tdc_g": tdc_pt["acceleration_mps2"] / g,
            "accel_at_bdc_mps2": bdc_pt["acceleration_mps2"],
            "accel_at_bdc_g": bdc_pt["acceleration_mps2"] / g,
            "inertia_force_at_tdc_N": tdc_pt["inertia_force_N"],
            "inertia_force_at_tdc_kN": tdc_pt["inertia_force_N"] / 1000.0,
            "inertia_force_at_bdc_N": bdc_pt["inertia_force_N"],
            "inertia_force_at_bdc_kN": bdc_pt["inertia_force_N"] / 1000.0,
            "max_inertia_force_N": float(np.max(np.abs(inertia))),
        }


if __name__ == "__main__":
    # Quick self-test
    calc = SliderCrankKinematics(
        bore=85.0,
        stroke=88.0,
        con_rod_length=145.0,
        rpm=6000.0,
        reciprocating_mass=0.45
    )
    summary = calc.get_summary_statistics()
    print("=" * 60)
    print("SLIDER-CRANK PISTON KINEMATICS & DYNAMICS SUMMARY")
    print(f"Author: Rahul Parmar")
    print("=" * 60)
    for k, v in summary.items():
        if isinstance(v, float):
            print(f"{k:35s}: {v:12.4f}")
        else:
            print(f"{k:35s}: {v}")
    print("=" * 60)
