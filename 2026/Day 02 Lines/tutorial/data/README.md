# Data for the Day 02 Lines tutorial

| File | What it is | Lines | Source |
|---|---|---|---|
| `uzbekistan_regions.geojson` | 14 regions of Uzbekistan (column `region`) | | simplemaps.com, simplified (from `2025/Boundaries/uz.shp`) |
| `waterways.geojson` | rivers, canals, drains and streams (column `kind`) | 33,793 | OpenStreetMap via Geofabrik, 2 Nov 2026 |
| `railways.geojson` | railway lines (`kind` = `rail`) | 13,091 | OpenStreetMap via Geofabrik, 2 Nov 2026 |
| `roads.geojson` | main roads: `motorway`, `trunk`, `primary`, `secondary` | 23,232 | OpenStreetMap via Geofabrik, 2 Nov 2026 |

The OpenStreetMap layers were simplified (about 30 m tolerance) to keep the files small enough to load quickly in Google Colab.

OpenStreetMap data © [OpenStreetMap contributors](https://www.openstreetmap.org/copyright), available under the Open Database License (ODbL). Please credit "© OpenStreetMap contributors" on your maps.
