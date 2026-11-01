# Day 07: Accessibility - Wheelchair Accessibility in Tashkent

## Overview

A data-driven analysis of wheelchair accessibility in central Tashkent, Uzbekistan based on OpenStreetMap wheelchair tags.

## Methodology

**Data Source:** OpenStreetMap wheelchair tags only (`wheelchair=yes`, `wheelchair=limited`, `wheelchair=no`)

**No inference:** Only shows explicitly tagged locations - does not predict or infer accessibility

**Study Area:** Central Tashkent (downtown area around Amir Timur Square, ~105 km²)

## Calculations Included

1. **Accessibility Breakdown**
   - Count and percentage of accessible, limited, and not accessible locations
   - Total tagged locations in study area

2. **Spatial Metrics**
   - Density of tagged locations (per km²)
   - Density of accessible locations (per km²)
   - Spatial center of accessible locations

3. **Amenity Analysis**
   - Top amenity types with wheelchair tags
   - Accessibility rate by amenity type
   - Distribution across location categories

## Outputs

- **accessibility_map.png** - Minimalist map with simple symbols (green circles, yellow circles, red X)
- **accessibility_stats.png** - Bar chart showing distribution
- **accessibility_data.csv** - Processed data for further analysis

## Visual Style

- White background, minimal design
- Simple symbols: 🟢 Green circle (yes), 🟡 Yellow circle (limited), ❌ Red X (no)
- Low-opacity basemap showing only major roads
- Statistics overlay on map
- Clean, social media-ready output

## Installation

```bash
pip install -r requirements.txt
```

## Usage

Open and run `accessibility_analysis.ipynb` in Jupyter:

```bash
jupyter notebook accessibility_analysis.ipynb
```

## Important Note

**No data does not mean no accessibility. It often means the place is not yet mapped.**

OSM coverage varies - results show only what has been surveyed and tagged by mappers.

## Data Ethics

This analysis uses only explicit OSM tags and does not infer or predict accessibility for untagged locations.
