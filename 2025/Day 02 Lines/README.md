# Day 02: Lines

## Overview
Transportation network visualization for Karakalpakstan, northwestern Uzbekistan.

![Transportation Map](Transportation%20Map%20Karakalpakstan.png)

## Data Sources
- **Railways:** OpenStreetMap (railway lines)
- **National Highways:** Major road network
- **Local Roads:** Secondary road network
- **Settlements:** Main population centers
- **Water Bodies:** Lakes and water features

## Methodology
1. Downloaded OSM data via Overpass Turbo
2. Clipped all layers to Karakalpakstan boundary
3. Styled transportation network by hierarchy
4. Processed and visualized in QGIS

## Datasets
- `Railway_Karakalpakstan.geojson` - Rail network
- `Highways_Karakalpakstan.geojson` - Major roads
- `Local_Roads_Karakalpakstan.geojson` - Local roads
- `Main_Settlements_Karakalpak.geojson` - Cities and towns
- `Lakes_Karakalpakstan.geojson` - Water bodies
- `KarakalpakstanArea.geojson` - Regional boundary

## Tools Used
- QGIS - Data processing and cartography
- Overpass Turbo - OSM data extraction
