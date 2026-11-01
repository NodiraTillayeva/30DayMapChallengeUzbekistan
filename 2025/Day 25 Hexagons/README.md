# Day 25: Hexagons

## Overview
Hexagonal binning and spatial aggregation for Uzbekistan data.

![Hexagonal Grid](day25.png)

## Hexagonal Grids

### Why Hexagons?

**Advantages over squares:**
- ✅ **Equal distance** - All neighbors equidistant from center
- ✅ **No edge bias** - 6 neighbors vs 4 or 8 for squares
- ✅ **Better sampling** - More uniform coverage
- ✅ **Visual appeal** - Natural, organic appearance
- ✅ **Efficient packing** - Minimal wasted space

### Mathematical Properties
```
Hexagon geometry:
- 6 equal sides
- 120° internal angles
- 6 neighboring cells
- Uniform Voronoi tessellation
```

## H3 Hexagonal Hierarchical Geospatial Indexing

**Uber's H3 System:**
```python
import h3
from h3 import h3

# Generate hexagons for Uzbekistan
resolution = 6  # ~36 km² per hexagon
uzbek_hexagons = h3.polyfill(uzbekistan_geojson, resolution)

# Aggregate data
for hex_id in uzbek_hexagons:
    hex_data = aggregate_statistics(hex_id)
    hex_center = h3.h3_to_geo(hex_id)
```

## Applications

### 1. Population Aggregation
- Uniform population bins
- Density visualization
- Equal-area comparison

### 2. Environmental Data
- Climate variables
- Land cover distribution
- Pollution monitoring

### 3. Economic Analysis
- GDP spatial distribution
- Market coverage
- Service accessibility

### 4. Network Analysis
- Transportation grids
- Connectivity patterns
- Coverage optimization

## Hexagon Hierarchies

**H3 Resolution Levels:**
```
Res 0:  ~4,357,449 km² per hexagon (global)
Res 3:      ~12,393 km²
Res 6:         ~36 km²
Res 9:         ~0.1 km²
Res 12:        ~309 m²
Res 15:          ~1 m²
```

## Visualization Techniques

**1. Choropleth Hexagons**
- Color by data value
- Statistical binning
- Clear legends

**2. 3D Hexagon Heights**
- Extrude by value
- Volume = quantity
- Perspective views

**3. Hexbin Density**
- Count points per hex
- Heatmap overlay
- Cluster identification

## Code Example

```python
import geopandas as gpd
import h3
import matplotlib.pyplot as plt

# Create hexagonal grid
def create_hex_grid(gdf, resolution=6):
    # Get boundary
    boundary = gdf.unary_union

    # Generate H3 hexagons
    hexagons = h3.polyfill_geojson(
        boundary.__geo_interface__,
        resolution
    )

    # Convert to GeoDataFrame
    hex_gdf = gpd.GeoDataFrame({
        'hex_id': list(hexagons),
        'geometry': [
            Polygon(h3.h3_to_geo_boundary(h, geo_json=True))
            for h in hexagons
        ]
    })

    return hex_gdf

# Apply to Uzbekistan
hex_grid = create_hex_grid(uzbekistan_gdf, resolution=6)
```

## Use Cases in This Project

- Spatial data aggregation
- Uniform statistical units
- Multi-scale analysis
- Comparative visualization
- Pattern detection

## Tools Used
- **H3** - Uber's hexagonal indexing
- **Python** - GeoPandas, Shapely
- **Visualization** - Matplotlib, Folium
- **GIS** - QGIS, ArcGIS Pro

## Comparison: Hexagons vs Squares

| Property | Hexagons | Squares |
|----------|----------|---------|
| Neighbors | 6 (equal distance) | 4 or 8 (varied) |
| Edge bias | None | Diagonal difference |
| Visual | Organic | Rigid |
| Calculation | Complex | Simple |
| Storage | More data | Less data |

## Research Applications
- Urban planning
- Ecological modeling
- Epidemiology
- Transportation networks
- Climate modeling

## Hexagonal Revolution
Hexagonal grids are increasingly replacing square grids in modern spatial analysis due to their superior mathematical and visual properties.
