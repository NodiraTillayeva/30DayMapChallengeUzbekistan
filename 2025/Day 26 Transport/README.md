# Day 26: Transport

## Overview
Transportation network analysis for Uzbekistan - mapping mobility infrastructure.

![Transport Network](transport.jpg)

## Transportation Modes

### Rail Network
- 🚄 **High-speed rail** - Afrosiyob trains
- 🚂 **Conventional rail** - National network
- 🚇 **Metro** - Tashkent subway system
- 📊 **Stats:** 4,000+ km of railway

### Road Network
- 🛣️ **Highways** - M39 (Tashkent-Samarkand)
- 🛤️ **Regional roads** - Inter-city connections
- 🏙️ **Urban streets** - City networks
- 📊 **Stats:** 80,000+ km of roads

### Air Transport
- ✈️ **International** - Tashkent International
- 🛫 **Domestic** - Samarkand, Bukhara, Urgench
- 📊 **Airports:** 11 major facilities

### Public Transit
- 🚌 **Bus networks** - Urban and intercity
- 🚕 **Taxi services** - Ride-sharing
- 🚃 **Marshrutka** - Minibus routes

## Network Analysis

**Connectivity Metrics:**
```python
# Transport network analysis
import networkx as nx
import osmnx as ox

# Download road network
G = ox.graph_from_place("Uzbekistan", network_type='drive')

# Calculate centrality
betweenness = nx.betweenness_centrality(G)

# Find critical nodes
hubs = sorted(betweenness.items(),
             key=lambda x: x[1],
             reverse=True)[:10]
```

## Key Transport Corridors

**International:**
- 🌏 **Silk Road revival** - China-Europe corridor
- 🚛 **CAREC** - Central Asia Regional Economic Cooperation
- 📦 **Trade routes** - Afghanistan, Turkmenistan connections

**Domestic:**
- Tashkent - Samarkand (high-speed rail)
- Tashkent - Bukhara corridor
- Fergana Valley connections

## Tashkent Metro

**System specs:**
- 3 lines (Chilanzar, Uzbekistan, Yunusabad)
- 43 stations
- Opened: 1977
- Unique feature: Ornate stations (Soviet architecture)

## Data Sources
- OpenStreetMap (road network)
- Railway operator data
- Airport databases
- Public transit feeds (GTFS)

## Analysis Types
- **Accessibility** - Service coverage
- **Connectivity** - Network topology
- **Capacity** - Traffic flow
- **Multimodal** - Integration analysis

## Tools Used
- **OSMnx** - Network analysis
- **NetworkX** - Graph theory
- **QGIS** - Cartography
- **Python** - GeoPandas, analysis scripts

## Applications
- Urban planning
- Infrastructure investment
- Logistics optimization
- Accessibility studies
- Economic development
