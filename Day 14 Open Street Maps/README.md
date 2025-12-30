# Day 14: Open Street Maps

## Overview
Urban functionality analysis using OpenStreetMap data - mapping city amenities and services.

![City Functionality](City%20Functionality/functionality.jpg)

## Analysis Focus
Spatial distribution of urban amenities and city functions extracted from OSM data.

## Amenities Analyzed
- 🏥 **Healthcare** - Hospitals, clinics, pharmacies
- 🎓 **Education** - Schools, universities, libraries
- 🛒 **Commerce** - Shops, markets, malls
- 🍽️ **Food & Drink** - Restaurants, cafes, bars
- 🏛️ **Public Services** - Government, post offices
- 🚌 **Transportation** - Stations, stops, parking
- 🎭 **Culture** - Theaters, museums, galleries
- ⚽ **Recreation** - Parks, sports facilities

## Methodology
```python
# OSM data extraction and analysis
import osmnx as ox
import geopandas as gpd

# Download amenities
amenities = ox.geometries_from_place(
    "Tashkent, Uzbekistan",
    tags={'amenity': True}
)

# Categorize and visualize
amenities.groupby('amenity').size()
```

## Key Insights
- Urban service distribution patterns
- Accessibility to amenities
- Functional zones identification
- Service coverage gaps

## Files
- `CityFunctionality.ipynb.ipynb` - Jupyter notebook analysis
- `functionality.jpg` - Visualization output

## Data Source
**OpenStreetMap** - Community-contributed urban data
- Real-time updates from local mappers
- Comprehensive amenity tagging
- Global coverage

## Tools Used
- OSMnx (Python library)
- Jupyter Notebook
- GeoPandas
- Matplotlib

## OSM Contribution
This analysis demonstrates the value of OpenStreetMap's crowdsourced urban data for spatial analysis and city planning.
