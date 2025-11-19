#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Tashkent Night Sky Visualization
Beautiful star map using Hipparcos catalog and dynamic planet positions
"""

import numpy as np
import matplotlib.pyplot as plt
from matplotlib.patches import Circle
from datetime import datetime, timezone
import pytz

# Install required packages if needed:
# pip install astropy astroquery matplotlib

from astropy.coordinates import SkyCoord, EarthLocation, AltAz, get_body
from astropy.time import Time
import astropy.units as u
from astroquery.vizier import Vizier

# Configuration
TASHKENT_LAT = 41.2995
TASHKENT_LON = 69.2401
OBSERVATION_TIME_HOUR = 23  # 11 PM
MIN_ALTITUDE = 15  # degrees above horizon
MAX_MAGNITUDE = 5.5  # Brightest stars only (not too crowded)

def get_hipparcos_stars():
    """Fetch bright stars from Hipparcos catalog via Vizier"""
    print("Fetching Hipparcos catalog from Vizier...")

    # Query Hipparcos catalog for bright stars with spectral type for color
    v = Vizier(columns=['*'],
               row_limit=15000, column_filters={"Vmag":f"<{MAX_MAGNITUDE}"})
    v.ROW_LIMIT = 15000

    result = v.get_catalogs('I/239/hip_main')

    if len(result) > 0:
        hip_data = result[0]
        print(f"Retrieved {len(hip_data)} stars from Hipparcos catalog")
        return hip_data
    else:
        print("Failed to retrieve Hipparcos data")
        return None

def calculate_visibility(ra_hours, dec_degrees, magnitude, bv_color, obs_time, location):
    """Calculate if a star is visible from Tashkent at given time"""

    # Create sky coordinate
    coord = SkyCoord(ra=ra_hours*u.hourangle, dec=dec_degrees*u.deg, frame='icrs')

    # Transform to horizontal coordinates
    altaz = coord.transform_to(AltAz(obstime=obs_time, location=location))

    return {
        'alt': altaz.alt.degree,
        'az': altaz.az.degree,
        'visible': altaz.alt.degree > MIN_ALTITUDE,
        'magnitude': magnitude,
        'bv_color': bv_color
    }

def bv_to_rgb(bv):
    """Convert B-V color index to RGB color for star"""
    if bv is None or np.ma.is_masked(bv):
        return '#ffffff'

    # B-V ranges from about -0.4 (blue) to 2.0 (red)
    # Normalize to 0-1
    bv = float(bv)
    if bv < -0.4:
        bv = -0.4
    if bv > 2.0:
        bv = 2.0

    # Blue stars: B-V < 0
    if bv < 0:
        t = (bv + 0.4) / 0.4
        r = int(155 + t * 100)
        g = int(180 + t * 75)
        b = 255
    # White stars: 0 <= B-V < 0.5
    elif bv < 0.5:
        t = bv / 0.5
        r = 255
        g = int(255 - t * 55)
        b = int(255 - t * 100)
    # Yellow stars: 0.5 <= B-V < 1.0
    elif bv < 1.0:
        t = (bv - 0.5) / 0.5
        r = 255
        g = int(200 - t * 40)
        b = int(155 - t * 55)
    # Orange to red stars: B-V >= 1.0
    else:
        t = (bv - 1.0) / 1.0
        t = min(t, 1.0)
        r = 255
        g = int(160 - t * 50)
        b = int(100 - t * 50)

    return f'#{r:02x}{g:02x}{b:02x}'

def get_planet_positions(obs_time, location):
    """Get positions of visible planets"""
    planets = ['mercury', 'venus', 'mars', 'jupiter', 'saturn']
    planet_data = {}

    print("\nCalculating planet positions...")

    for planet in planets:
        try:
            coord = get_body(planet, obs_time, location)
            altaz = coord.transform_to(AltAz(obstime=obs_time, location=location))

            if altaz.alt.degree > MIN_ALTITUDE:
                planet_data[planet.capitalize()] = {
                    'alt': altaz.alt.degree,
                    'az': altaz.az.degree,
                    'ra': coord.ra.degree,
                    'dec': coord.dec.degree
                }
                print(f"  {planet.capitalize()}: Alt={altaz.alt.degree:.1f}° Az={altaz.az.degree:.1f}°")
        except Exception as e:
            print(f"  Error calculating {planet}: {e}")

    return planet_data

def altaz_to_xy(alt, az):
    """Convert altitude/azimuth to x,y for polar plot"""
    # Radius is 90-altitude (so zenith is at center)
    r = 90 - alt
    # Azimuth: 0° is North, increases clockwise
    # Convert to radians, rotate so North is up
    theta = np.radians(az)

    x = r * np.sin(theta)
    y = r * np.cos(theta)

    return x, y

def plot_night_sky(stars_data, planets_data, obs_time):
    """Create beautiful night sky visualization"""

    fig = plt.figure(figsize=(18, 18))
    ax = fig.add_subplot(111)

    # Set dark sky background with gradient effect
    fig.patch.set_facecolor('#000510')
    ax.set_facecolor('#000510')

    # Draw horizon circle
    horizon = Circle((0, 0), 90, fill=False, edgecolor='#2a4a5f', linewidth=2.5, linestyle='--', alpha=0.6)
    ax.add_patch(horizon)

    # Draw altitude circles
    for alt in [30, 60]:
        circle = Circle((0, 0), 90-alt, fill=False, edgecolor='#1a3a4f', linewidth=0.8, alpha=0.4)
        ax.add_patch(circle)
        ax.text(0, 90-alt+2, f'{alt}°', color='#5a7a8f', ha='center', va='bottom',
                fontsize=9, alpha=0.7, fontweight='bold')

    # Draw cardinal directions
    directions = {'N': 0, 'E': 90, 'S': 180, 'W': 270}
    for direction, azimuth in directions.items():
        x, y = altaz_to_xy(-5, azimuth)
        ax.text(x, y, direction, color='#d4e4f0', ha='center', va='center',
                fontsize=16, fontweight='bold',
                bbox=dict(boxstyle='circle,pad=0.3', facecolor='#1a2a3f',
                         edgecolor='#4a6a7f', alpha=0.8))

    # Plot stars with realistic colors
    if stars_data:
        print(f"\nPlotting {len(stars_data)} visible stars...")
        for star in stars_data:
            x, y = altaz_to_xy(star['alt'], star['az'])

            # Size based on magnitude (brighter = larger, exponential scale)
            size = 150 * (10 ** (-star['magnitude'] / 2.5))
            size = np.clip(size, 10, 500)

            # Get star color from B-V index
            color = bv_to_rgb(star['bv_color'])

            # Transparency based on magnitude
            if star['magnitude'] < 1:
                alpha = 1.0
                marker = '*'
                edge_width = 1.0
            elif star['magnitude'] < 2.5:
                alpha = 0.9
                marker = '*'
                edge_width = 0.8
            elif star['magnitude'] < 4:
                alpha = 0.75
                marker = 'o'
                edge_width = 0.5
            else:
                alpha = 0.6
                marker = 'o'
                edge_width = 0.3

            ax.scatter(x, y, s=size, c=color, marker=marker, alpha=alpha,
                      edgecolors='white', linewidths=edge_width, zorder=3)

            # Add glow effect for brightest stars
            if star['magnitude'] < 2:
                ax.scatter(x, y, s=size*2.5, c=color, marker='o', alpha=0.1, zorder=2)

    # Plot planets
    if planets_data:
        print("\nPlotting planets...")
        planet_colors = {
            'Mercury': '#b8b8b8',
            'Venus': '#ffeaa7',
            'Mars': '#ff7675',
            'Jupiter': '#ffd68a',
            'Saturn': '#fff3cd'
        }

        for planet, data in planets_data.items():
            x, y = altaz_to_xy(data['alt'], data['az'])
            color = planet_colors.get(planet, '#ffffff')

            # Large marker for planet
            ax.scatter(x, y, s=600, c=color, marker='o', edgecolors='white',
                      linewidths=3, zorder=6, alpha=0.95)

            # Glow effect
            ax.scatter(x, y, s=1200, c=color, marker='o', alpha=0.15, zorder=5)

            # Label
            ax.text(x, y-7, planet, color='white', ha='center', va='top',
                   fontsize=12, fontweight='bold',
                   bbox=dict(boxstyle='round,pad=0.5', facecolor=color,
                            edgecolor='white', alpha=0.9, linewidth=2))
            print(f"  {planet}: Alt={data['alt']:.1f}° Az={data['az']:.1f}°")

    # Set equal aspect ratio and limits
    ax.set_aspect('equal')
    ax.set_xlim(-100, 100)
    ax.set_ylim(-100, 100)
    ax.axis('off')

    # Title
    time_str = obs_time.to_datetime(timezone=pytz.timezone('Asia/Tashkent')).strftime('%B %d, %Y at %I:%M %p')
    plt.title(f'Night Sky over Tashkent, Uzbekistan\n{time_str} (Local Time)\nHipparcos Catalog Visualization',
             color='#e8f4f8', fontsize=20, fontweight='bold', pad=25,
             bbox=dict(boxstyle='round,pad=0.8', facecolor='#0a1a2f',
                      edgecolor='#3a5a7f', alpha=0.8))

    # Legend
    legend_elements = [
        plt.Line2D([0], [0], marker='*', color='w', markerfacecolor='#ffffff',
                   markersize=12, label='Bright Stars (mag < 2.5)', linestyle='None'),
        plt.Line2D([0], [0], marker='o', color='w', markerfacecolor='#aaaaaa',
                   markersize=8, label='Fainter Stars', linestyle='None'),
        plt.Line2D([0], [0], marker='o', color='w', markerfacecolor='#ffd68a',
                   markersize=12, label='Planets', linestyle='None', markeredgewidth=2, markeredgecolor='white')
    ]
    ax.legend(handles=legend_elements, loc='upper right', framealpha=0.9,
             facecolor='#0a1a2f', edgecolor='#3a5a7f', labelcolor='#e8f4f8',
             fontsize=11, title='Legend', title_fontsize=12)

    plt.tight_layout()

    # Save
    output_file = 'tashkent_night_sky.png'
    plt.savefig(output_file, dpi=300, facecolor='#000510', edgecolor='none')
    print(f"\n> Visualization saved as: {output_file}")

    return output_file


if __name__ == '__main__':
    print("=" * 60)
    print("  TASHKENT NIGHT SKY VISUALIZATION")
    print("=" * 60)

    # Set up location and time
    location = EarthLocation(lat=TASHKENT_LAT*u.deg, lon=TASHKENT_LON*u.deg)

    # Get tonight at 11 PM in Tashkent timezone
    tashkent_tz = pytz.timezone('Asia/Tashkent')
    now_tashkent = datetime.now(tashkent_tz)
    tonight_11pm = now_tashkent.replace(hour=OBSERVATION_TIME_HOUR, minute=0, second=0, microsecond=0)
    obs_time = Time(tonight_11pm)

    print(f"\nLocation: Tashkent ({TASHKENT_LAT}° N, {TASHKENT_LON}° E)")
    print(f"Observation time: {tonight_11pm.strftime('%Y-%m-%d %H:%M %Z')}")
    print(f"Minimum altitude: {MIN_ALTITUDE}°")
    print(f"Maximum magnitude: {MAX_MAGNITUDE}")

    # Get Hipparcos data
    hip_catalog = get_hipparcos_stars()

    if hip_catalog is not None:
        # Process stars
        visible_stars = []

        print("\nProcessing star visibility...")
        for star in hip_catalog:
            try:
                # Use _RA.icrs and _DE.icrs columns which are in degrees
                ra_deg = star['_RA.icrs']
                dec_deg = star['_DE.icrs']
                vmag = star['Vmag']
                bv = star['B-V'] if 'B-V' in star.colnames else None

                # Convert RA from degrees to hours
                ra_hours = ra_deg / 15.0

                visibility = calculate_visibility(ra_hours, dec_deg, vmag, bv, obs_time, location)

                if visibility['visible']:
                    visible_stars.append(visibility)
            except Exception as e:
                continue

        print(f"Found {len(visible_stars)} visible stars above {MIN_ALTITUDE}° altitude")
    else:
        visible_stars = []
        print("! Hipparcos download failed")

    # Get planet positions
    planet_positions = get_planet_positions(obs_time, location)

    if len(planet_positions) > 0:
        print(f"\n** {len(planet_positions)} planets visible tonight!")
    else:
        print("\n** No planets visible at this time")

    # Create visualization
    print("\n" + "=" * 60)
    print("Creating visualization...")
    print("=" * 60)

    output_file = plot_night_sky(visible_stars, planet_positions, obs_time)

    print("\n" + "=" * 60)
    print("** Done! Check out your beautiful night sky map! **")
    print("=" * 60)
