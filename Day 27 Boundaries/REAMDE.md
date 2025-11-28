Theme: Boundaries
Focus: Where water defines the boundaries of life in Uzbekistan
In one of the world's most water-scarce regions, life exists within measurable distances from water sources. This map visualizes those invisible boundaries.

📊 Map Description
The Story

5km from water = Critical life zone (natural vegetation thrives)
10km from water = Moderate zone (irrigation required)
15km from water = Outer zone (desert transition)
Beyond 15km = Kyzylkum Desert (minimal life support)

Color Language

🌸 Pink → Desert / Arid zones
💚 Green → Irrigated agriculture / Life
🟣 Purple rings → Distance-based life zones
💧 Blue → Water bodies (Aral Sea, Amu Darya, Syr Darya)


🛠️ Technical Details
Data Sources

MODIS NDVI (MOD13A2, 2023) - Vegetation index
JRC Global Surface Water - Water occurrence
HydroSHEDS - River networks
USDOS LSIB 2017 - International boundaries

Methodology

Buffer Analysis: Created 5km, 10km, and 15km zones from all water sources
Edge Detection: Canny algorithm with optimized parameters for clean contours
Vegetation Analysis: NDVI differencing (wet vs dry season) to identify irrigated areas
Boundary Delineation: Edge detection on NDVI to map vegetation boundaries