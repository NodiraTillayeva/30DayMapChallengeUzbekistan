# Day 05 data

| File | What's inside |
|---|---|
| `viewpoints.geojson` | 2 points: the Tashkent TV Tower and the summit of Big Chimgan, with names in English, Uzbek and Russian (`name`, `name_uz`, `name_ru`), the ground height from the DEM (`ground_m`) and the position in UTM zone 42N metres (`x_utm42`, `y_utm42`) |

The elevation tiles are not stored here because they are large (about 40 MB each). Download them directly from the Copernicus DEM GLO-30 bucket on AWS, without an account; the links are in [Part 2 of the tutorial](../README.md#-part-2--get-the-satellite-elevation-data).

Copernicus DEM GLO-30 © DLR e.V. 2010–2014 and © Airbus Defence and Space GmbH 2014–2018, provided under COPERNICUS by the European Union and ESA; all rights reserved.
