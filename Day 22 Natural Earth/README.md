# Day 22: Natural Earth

## Overview
Central Asia Transboundary Waters - mapping international river systems using Natural Earth data.

![Transboundary Waters](day22_transboundary_waters%20.png)

## Key Finding
**80% of Uzbekistan's water originates in neighboring countries** (Kyrgyzstan and Tajikistan)

## Transboundary Water Systems

### Major Rivers
- **Amu Darya** - Flows from Pamir Mountains (Tajikistan)
- **Syr Darya** - Originates in Tian Shan (Kyrgyzstan)
- **Zarafshan** - Source in Tajikistan
- **Kashkadarya** - Tributary system

### Water Dependency
```
Uzbekistan Water Sources:
├── Transboundary: 80%
│   ├── Kyrgyzstan: ~45%
│   └── Tajikistan: ~35%
└── Internal: 20%
```

## Natural Earth Dataset

**What is Natural Earth?**
- Free vector and raster map data
- Public domain
- Three scales: 1:10m, 1:50m, 1:110m
- Cultural, physical, and raster data

**Data Layers Used:**
- Rivers and lake centerlines
- Country boundaries
- Physical regions
- Drainage basins

## Google Earth Engine Analysis

```javascript
// Load Natural Earth rivers
var rivers = ee.FeatureCollection("projects/sat-io/open-datasets/NE/NE_RIVERS");

// Filter for Central Asia
var centralAsiaRivers = rivers.filterBounds(region);

// Visualize transboundary flows
Map.addLayer(centralAsiaRivers, {color: 'blue'}, 'Rivers');
```

## Regional Context
Central Asia faces critical water challenges:
- Upstream-downstream conflicts
- Climate change impacts
- Agricultural irrigation demands
- Aral Sea crisis
- Water allocation treaties

## Data Sources
- **Natural Earth** - Rivers, boundaries
- **UN FAO AQUASTAT** - Water statistics
- **World Bank** - Regional hydrology data
- **Google Earth Engine** - Processing platform

## Geopolitical Significance
Water sharing is crucial for:
- Regional stability
- Agricultural productivity
- Hydropower generation
- Ecosystem preservation
- International cooperation

## Tools Used
- **Google Earth Engine** - Cloud processing
- **Natural Earth** - Base geographic data
- **Python/JavaScript** - Analysis and visualization

## Applications
- Water resource planning
- International cooperation frameworks
- Climate adaptation strategies
- Agricultural policy
- Environmental monitoring
