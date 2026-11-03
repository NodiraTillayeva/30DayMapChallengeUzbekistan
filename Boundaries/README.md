# Boundaries

Shared boundary files for all years of the challenge. Use them to clip your data to Uzbekistan, a region or Tashkent.

| File | What it is |
|---|---|
| `uz.shp` (+ `.shx`, `.dbf`, `.prj`) | 14 regions of Uzbekistan (12 regions, Karakalpakstan and Tashkent City), columns `id` and `name`. Source: [simplemaps.com](https://simplemaps.com) |
| `Tashkent_boundaries.geojson` | the 12 districts of Tashkent City. District names (in Russian) are split across two columns, both called `имя`, and 2 districts have no name |

Coordinate system: WGS 84 (EPSG:4326). Note that `name` is `Tashkent` for both Tashkent City (`id` = `UZTK`) and Tashkent Region (`id` = `UZTO`).

Need the regions as a single GeoJSON file? See [`2026/Day 02 Lines/tutorial/data/uzbekistan_regions.geojson`](<../2026/Day 02 Lines/tutorial/data/uzbekistan_regions.geojson>) (simplified, with the two Tashkents named apart).
