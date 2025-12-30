# Day 15: Fire

## Overview
Fire detection and burn severity analysis for Uzbekistan using NASA FIRMS data and satellite imagery.

## Projects

### 1. Monthly Fire Analysis (2025)
![Temporal Analysis](Monthly%20Fires%202025/temporal_analysis_comprehensive.png)

**Data:** NASA FIRMS (Fire Information for Resource Management System)
**Coverage:** Uzbekistan, 2025 monthly aggregation
**Platform:** Google Earth Engine + Python

**Key Analysis:**
```javascript
// Google Earth Engine - Fire detection
var firms = ee.ImageCollection("FIRMS")
    .filterBounds(uzbekistan)
    .filterDate('2025-01-01', '2025-12-31');

var monthlyFires = firms
    .map(function(img) {
        return img.set('month', img.date().get('month'));
    });
```

**Outputs:**
- `map_monthly_fire_animation.html` - Interactive fire timeline
- `firms_uzbekistan_2025_monthly.geojson` - Fire locations
- `uzbekistan_fires.shp` - Shapefile format
- `seasonal_fire_analysis.ipynb` - Statistical analysis

### 2. Burn Severity - Syrdarya Region
![Burn Severity](Syrdarya/Burn%20Severity%20Syrdarya.png)

**Analysis:** dNBR (differenced Normalized Burn Ratio)
**Satellite:** Landsat 8/9
**Method:** Pre/post-fire comparison

**Burn Severity Classes:**
- 🔥 High severity (>0.66)
- 🟧 Moderate-high (0.44-0.66)
- 🟨 Moderate-low (0.25-0.44)
- 🟩 Low severity (0.1-0.25)
- ⬜ Unburned (<0.1)

## Fire Detection Data
**Source:** NASA FIRMS
**Sensors:** MODIS, VIIRS
**Resolution:** 375m - 1km
**Temporal:** Daily updates

## Analysis Workflow
1. Download FIRMS fire detections
2. Filter by region and date
3. Aggregate by month/season
4. Calculate fire frequency
5. Visualize temporal patterns
6. Burn severity assessment (dNBR)

## Key Findings
- Seasonal fire patterns in Uzbekistan
- Agricultural burning trends
- High-risk areas identification
- Burn severity spatial distribution

## Tools Used
- **Google Earth Engine** - Fire data processing
- **Python** - Statistical analysis (Jupyter)
- **GIS** - Burn severity mapping
- **HTML/JavaScript** - Interactive visualization

## Applications
- Agricultural monitoring
- Wildfire risk assessment
- Air quality impact analysis
- Land management planning
