# Day 08: Urban

## Overview
Urban Heat Island (UHI) analysis for Tashkent using Landsat 9 thermal imagery (2024).

## Output Maps

### Land Surface Temperature (LST)
![Land Surface Temperature](Land%20Surface%20Temperature%20Tashkent.png)

### Urban Heat Island Zones
![Urban Heat Island](Urban%20Heat%20Island%20Tashkent.png)

## Methodology

**1. Landsat 9 Thermal Processing:**
```python
# Thermal band conversion to LST
1. Convert Band 10 (Thermal Infrared) DN to radiance
2. Calculate brightness temperature
3. Apply emissivity correction
4. Derive Land Surface Temperature (°C)
```

**2. UHI Zone Classification:**
- High Heat Island (>35°C)
- Moderate Heat Island (30-35°C)
- Low Heat Island (25-30°C)
- Normal Temperature (<25°C)

## Key Findings
- 🌡️ **Temperature variation** across Tashkent urban fabric
- 🏗️ **Built-up areas** show higher surface temperatures
- 🌳 **Vegetation zones** exhibit cooling effect
- 📊 **Clear UHI pattern** in dense urban core

## Processing Workflow
1. Download Landsat 9 Level-2 imagery (USGS Earth Explorer)
2. Extract thermal band (Band 10)
3. Calculate LST using thermal conversion
4. Classify into UHI zones
5. Cartographic visualization in ArcGIS Pro

## Data & Tools
**Satellite:** Landsat 9 (TIRS thermal sensor)
**Resolution:** 100m thermal (resampled to 30m)
**Date:** 2024
**Source:** USGS Earth Explorer
**Processing:** ArcGIS Pro - Spatial Analyst, Image Analysis

## Applications
- Urban planning and heat mitigation strategies
- Green infrastructure planning
- Climate adaptation analysis
- Public health risk assessment
