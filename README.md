🛰️ Day 25: Orbital Debris Density (Uzbekistan Airspace)

Project Summary

An interactive, high-tech visualization for the 30 Day Map Challenge (Day 25: Movement). It maps the simulated density of Orbital Debris (space junk) over Uzbekistan airspace.

The map uses **deck.gl** with the **H3 Hexagon Layer** to visualize debris concentration via extruded, color-coded hex cells (taller/redder = higher density/risk).

Key Features

* **Visualization:** 3D Hexbin aggregation (**H3 Lvl 3**) showing debris density.
* **Risk Display:** Color-coded risk from Low (cyan) to Critical (red).
* **Key Metrics:** Displays *Total LEO Objects* (36,500), *Objects Over Region* (4,183), and a *Collision Risk Index* (0.73).
* **Interface:** Futuristic, low-light radar aesthetic.

Technology

* **Mapping:** `deck.gl` (WebGL), `MapLibre GL JS`.
* **Geospatial:** `H3-JS` for hexagonal indexing.
* **Data:** Simulated Orbital Debris derived from TLE principles.

Setup
Open `day25.html` in a modern web browser. (Standalone HTML project).

