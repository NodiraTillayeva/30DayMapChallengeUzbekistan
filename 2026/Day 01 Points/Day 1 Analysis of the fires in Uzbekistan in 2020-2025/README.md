# Satellite Heat Detections in Uzbekistan, 2020–2025

Author: Umidjon Khaibibullaev
Day 1 · **Points** · [30DayMapChallenge Uzbekistan](https://github.com/NodiraTillayeva/30DayMapChallengeUzbekistan)

I used NASA MODIS satellite detections to map where heat sources were detected in Uzbekistan from 2020 to 2025. I built the map in Power BI and compared 2025 with the median annual detection count from 2020–2024.

## What the map revealed

Uzbekistan had **4,649 satellite heat detections in 2025**, compared with a **2020–2024 annual median of 2,631**. That’s an increase of **77%**.

About **84% of the excess above the baseline** was concentrated in one hotspot in Surkhandarya. Recalculating the baseline and the 2025 total with that area excluded reduced the increase to **about 12%**.

| Area | 2020–2024 annual median | 2025 | Difference |
| --- | ---: | ---: | ---: |
| All Uzbekistan | 2,631 | 4,649 | +2,018 |
| Surkhandarya hotspot | 6 | 1,696 | +1,690 |
| Uzbekistan excluding the hotspot | 2,625 | 2,953 | +328 |

The hotspot uses the same coordinate box in every year: **37.95–38.15°N, 67.25–67.35°E**.

## A possible explanation for the Surkhandarya hotspot

The **Mustaqillik-25 (M-25) gas field in Boysun** is a candidate source. A gas leak at Well 604 was reported in September 2024. A separate release at Well 202 was reported on March 27, 2025, one day before the first detection classified as a static land heat source inside the hotspot box. Uzbekistan’s Ministry of Energy reported controlled flaring after another release at Well 202 in May. The timing supports the hypothesis. Matching the satellite points to verified well or flare coordinates would help test it. [Incident timeline](https://kun.uz/news/2026/08/15/boysundagi-gaz-konida-avariyaviy-quduqni-yopish-ishlari-boshlandi) · [Ministry of Energy update](https://gov.uz/oz/minenergy/news/view/51771)

## Project files

| File | Purpose |
| --- | --- |
| `modis_2020_Uzbekistan.csv` through `modis_2025_Uzbekistan.csv` | Annual MODIS downloads used in the analysis |
| [`data_prep.ipynb`](data_prep.ipynb) | Python notebook for preparing the data |
| `combined_data.csv` | Combined Uzbekistan detections for 2020–2025 |
| `uzbekistan_adm1.geojson` | First-level administrative boundaries used to assign regions |
| `fires_with_regions.csv` | Detection records with region assignments for Power BI |
| `unmatched_fires.csv` | Diagnostic export for points that did not match a region in the initial spatial join |
| `Uzbekistan Fires 2020-2025.pbix` | Power BI report with an ArcGIS point map, regional breakdown, and detection trends |
| `kepler.gl` | Uzbekistan fires map image that was generated using the kepler.gl |

## How to explore or reproduce the analysis

1. **Explore the report.** Open `Uzbekistan Fires 2020-2025.pbix` in Power BI Desktop. Use the year, season, region, and detection type filters to inspect the map and charts.
2. **Rebuild the data.** Run `data_prep.ipynb` with the six Uzbekistan CSVs and `uzbekistan_adm1.geojson`. Update the notebook paths for your local checkout if needed. The workflow combines the annual downloads and uses a spatial join to assign detections to regions.
3. **Refresh the report.** If Power BI still points to the original local CSV location, update the source path to your copy of `fires_with_regions.csv` before refreshing.

## Data sources and interpretation

- [NASA FIRMS](https://firms.modaps.eosdis.nasa.gov/) provides the MODIS detections from the Terra and Aqua satellites. The dataset distinguishes **presumed vegetation fires** from **other static land heat sources**.
- [geoBoundaries — Uzbekistan ADM1](https://www.geoboundaries.org/api/current/gbOpen/UZB/ADM1/) provides the regional boundaries.
- Each record is a satellite detection. A persistent heat source can appear in multiple pixels or on multiple satellite passes. Detection counts describe observed heat activity and can include repeated observations of the same source.
