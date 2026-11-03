# Day 01 · Points – Fires Seen From Space 🛰️🔥

In this tutorial you'll make a map of every fire that NASA satellites spotted in Uzbekistan in 2025, **without installing anything and without writing any code**. Everyone starts with the same data, but you'll each pick a different way to show it, so every map in our group comes out different.

| ⏱️ Time | 💻 You need | 🧰 Tool |
|---|---|---|
| 30–45 minutes | A computer with Chrome, Edge or Firefox | [kepler.gl](https://kepler.gl/demo) (free, runs in the browser) |

![What you'll make](images/07-satellite-basemap.jpg)

📄 **Printable PDF:** [English](pdf/Day01_Tutorial_EN.pdf) · [Русский](pdf/Day01_Tutorial_RU.pdf) · [Oʻzbekcha](pdf/Day01_Tutorial_UZ.pdf)

---

## 🛰️ Part 0 – Meet the data: NASA FIRMS fire detections

**Where does it come from?**
Two NASA satellites, **Terra** and **Aqua**, orbit the Earth about 700 km up. Each one carries a camera-like sensor called **MODIS**. MODIS doesn't only take normal photos. It also measures **heat** (thermal infrared).

**How does a satellite "see" a fire?**
MODIS splits the ground into squares of about **1 km × 1 km** (called *pixels*). When one square is much hotter than the squares around it, NASA's computers mark it as a **hotspot**. Each hotspot becomes **one point** in our file, placed at the centre of that 1 km square.

> 💡 So a point means *"something was burning somewhere inside this 1 km square at that moment"*. It isn't the exact spot of the fire.

**When does it look?**
Between them, the two satellites pass over Uzbekistan about **4 times a day**: Terra around 10:30 and 22:30, Aqua around 13:30 and 01:30. That's why the data has both **day** and **night** detections.

**Not every hotspot is a wildfire.**
Gas flares at oil and gas fields and some factories are hot all the time. NASA labels these as *static sources*. In our file they're called **"Gas flare / industry"**.

**This system is called [FIRMS](https://firms.modaps.eosdis.nasa.gov/)** (Fire Information for Resource Management System). Firefighters, farmers and scientists around the world use it every day.

### What's inside our file

We prepared the 2025 data for Uzbekistan as one table: [`data/fires_uzbekistan_2025.csv`](data/fires_uzbekistan_2025.csv). Each row is one point (**4,649 points** in total).

| Column | What it means | Example |
|---|---|---|
| `latitude`, `longitude` | Where the point is | 41.25, 69.21 |
| `date` | Day it was detected | 2025-03-14 |
| `region` | Which viloyat it falls in | Surkhandarya |
| `fire_type` | Vegetation fire, or gas flare / industry | Vegetation fire |
| `day_night` | Seen during the day or at night | Day |
| `season` | Winter / Spring / Summer / Autumn | Spring |
| `month` | Month of the year | 03 Mar |
| `satellite` | Which satellite saw it | Terra or Aqua |
| `confidence_level` | How sure NASA is that it's a real fire | Low / Nominal / High |
| `fire_power_mw` | How strong the heat was, in megawatts | 21.3 |

**A few facts to get you curious:**
- 🌾 **March** had the most detections of any month (924). Many farmers burn fields in early spring.
- 🏭 **2,000 of the 4,649 points** are gas flares or industry, not wildfires.
- 🌙 About **1 in 3** detections happened **at night**.

---

## Part 1 – Download the data

Download the data to your computer first. You have two options, and both are free with no sign-up.

| | Option A – Our ready-made file | Option B – Straight from NASA |
|---|---|---|
| **Best for** | Your first time ✅ | Trying another year or country |
| **Columns** | Easy words: *Day/Night*, *Spring*, *Vegetation fire*, region names | NASA's short codes: `D`/`N`, `0`/`2`, numbers |

### Option A – Download our ready-made file from GitHub

**Step 1.** Open **[fires_uzbekistan_2025.csv](data/fires_uzbekistan_2025.csv)**. GitHub shows the data as a table. Click the **download icon ⬇️** above the table, on the right. The file `fires_uzbekistan_2025.csv` is saved to your **Downloads** folder.

![Download the file from GitHub](images/d05-github-download-raw.jpg)

➡️ Now go to [Part 2](#part-2--load-the-data-into-keplergl).

### Option B – Download straight from NASA FIRMS

This is where the data really comes from. Once you know these four clicks, you can get fire data for **any country, from 2000 to today**.

**Step 1a.** Open **[firms.modaps.eosdis.nasa.gov/country](https://firms.modaps.eosdis.nasa.gov/country/)**. If a blue **NOTIFICATIONS** box appears, close it with the **×**.

![Close the NASA notice](images/d01-firms-close-notice.jpg)

**Step 1b.** Under **Instrument**, click **MODIS**. That's the sensor on the Terra and Aqua satellites.

![Choose MODIS](images/d02-firms-choose-modis.jpg)

**Step 1c.** Scroll down and click the **year** you want, e.g. **2025**. Click the year number on the **left**, not the big `.zip` file. The zip has every country in the world and is huge.

![Choose the year](images/d03-firms-choose-year.jpg)

**Step 1d.** Scroll down to your country and click it, e.g. **modis_2025_Uzbekistan.csv** (about 370 kB). The file is saved to your **Downloads** folder.

![Click Uzbekistan](images/d04-firms-click-uzbekistan.jpg)

> 💡 **Tip:** press **Ctrl + F** (or **Cmd + F** on a Mac) and type the country name to find it quickly in the long list.

<details>
<summary><b>📖 How to read NASA's columns (Option B only)</b></summary>

NASA's file uses short codes. Here's what they mean, and which easy-word column in our ready-made file matches each one:

| NASA column | What it means | In our file |
|---|---|---|
| `acq_date` | Date of detection | `date` |
| `acq_time` | Time in **UTC**, written as HHMM (add 5 hours for Uzbekistan time) | `acq_time_utc` |
| `daynight` | `D` = day, `N` = night | `day_night` |
| `type` | `0` = vegetation fire, `1` = volcano, `2` = other static heat source (gas flares, factories), `3` = offshore | `fire_type` |
| `confidence` | 0–100, how sure NASA is that it's a real fire | `confidence_level` (Low < 30, Nominal 30–80, High > 80) |
| `frp` | Fire Radiative Power: how strong the heat was, in megawatts | `fire_power_mw` |
| `satellite` | `Terra` or `Aqua` | `satellite` |
| `brightness` | Temperature of the pixel in Kelvin | `brightness_k` |

NASA's file has **no** `region`, `season` or `month` columns. We added those. With NASA's file, the easiest columns to color by are **`daynight`** and **`satellite`**. `confidence` and `frp` give a smooth color gradient.

</details>

---

## Part 2 – Load the data into kepler.gl

**Step 2.** Open **[kepler.gl/demo](https://kepler.gl/demo)**. An **"Add Data To Map"** window opens by itself. **Drag your downloaded file** from the Downloads folder into the dotted box, or click **browse your files** and choose it.

![Browse your files](images/d06-kepler-browse-files.jpg)

**Step 3.** The file appears on the right. Click the green **Add Data** button.

![Click Add Data](images/d07-kepler-file-ready.jpg)

<details>
<summary><b>⚡ Shortcut: load our file without downloading (paste a link)</b></summary>

Instead of a file, you can paste this link into the **"Enter your dataset URL"** box and click **Add**, then **Add Data**:

```
https://raw.githubusercontent.com/NodiraTillayeva/30DayMapChallengeUzbekistan/main/2026/Day%2001%20Points/tutorial/data/fires_uzbekistan_2025.csv
```

![Paste the link](images/02-paste-link.jpg)

</details>

**Step 4.** 🎉 **Your points are on the map!** Each dot is one fire seen from space. The panel on the left says **4,649 rows**, one for each point.

![Fires on the map](images/04-fires-on-map.jpg)

> 🖱️ **Moving around:** drag the map to move it, scroll your mouse wheel to zoom in and out, and hold **right-click** while dragging to tilt or rotate.
>
> ❌ If a pop-up about "DuckDB" or a survey shows up, close it with its **×**. Otherwise it will appear in your final image.

---

## Part 3 – Put a satellite photo underneath

**Step 5.** Click the **map icon** (the 4th tab at the top of the left panel). Then click the **Map Style** box, which says *DarkMatter*.

![Base map tab](images/05-basemap-tab.jpg)

**Step 6.** Choose **Satellite With Streets**.

![Choose Satellite With Streets](images/06-choose-satellite.jpg)

**Step 7.** Now you can see the deserts, mountains, rivers and green farmland of Uzbekistan under your points. Notice how most fires sit on the **green farmland**, not in the desert.

![Satellite background](images/07-satellite-basemap.jpg)

> 🎨 Not a fan of the satellite look? *Dark*, *Light* or *Voyager* also look great. Choosing a different background is an easy way to make your map yours.

---

## Part 4 – Color the points by category

Right now the points are colored by brightness. Let's color them by something more meaningful.

**Step 8.** Go back to the **layers icon** (the 1st tab). Click the small **arrow ⌄** next to the layer name to open its settings.

![Open the layer settings](images/08-open-layer-settings.jpg)

**Step 9.** Under **Fill Color**, click the box under **Color Based On**.

![Color Based On](images/09-color-based-on.jpg)

**Step 10.** Type the name of a column in the search box. In this example we use **`fire_type`**. Click it in the list.

![Choose fire_type](images/10-choose-field.jpg)

> 👉 **This is the step where your map becomes different from everyone else's.** See [Part 6](#-part-6--make-it-yours) and pick your own column.

**Step 11.** The two categories may get colors that look almost the same. To fix this, click the **colored bar** under *Color Scale*.

![Click the color bar](images/11-click-color-bar.jpg)

**Step 12.** Next to **Type**, click **All** and choose **Qualitative**. Qualitative palettes give every category a clearly different color.

![Choose Qualitative](images/12-type-qualitative.jpg)

**Step 13.** Click any palette you like in the list.

![Pick a palette](images/13-pick-palette.jpg)

> 🔢 **Lots of categories?** (`region` has 14!) Change **Steps** from 6 to **12** so the colors don't repeat.

---

## Part 5 – Add a legend and save your map as an image

**Step 14.** Click the **legend button** on the right side of the map. A small box now explains your colors. *Gas flare / industry* and *Vegetation fire* now show up as clearly different colors.

![Show the legend](images/14-legend.jpg)

**Step 15.** Zoom and move the map until it looks the way you want. Then click the **download icon** (top of the left panel) and choose **Export Image**.

![Export menu](images/15-export-menu.jpg)

**Step 16.** Tick **Add legend on map**. Under **Resolution**, choose **2x** if you'd like a sharper image. Wait for the preview to appear, then click **Download**. A `.png` file is saved to your **Downloads** folder.

![Export and download](images/16-export-download.jpg)

🎉 **You've made a map from satellite data!**

---

## 🎨 Part 6 – Make it yours

Everyone in the group uses the same data. Here's how to make **your** map different. Pick **one idea from each row** (or invent your own!):

| | Choose one |
|---|---|
| **1. What to color by** (Step 10) | `day_night` · `season` · `region` · `satellite` · `confidence_level` · `fire_type` · `month` |
| **2. Where to look** | All of Uzbekistan · your home region · the Fergana Valley · Karakalpakstan & the Aral Sea · a single city |
| **3. Background** (Step 6) | Satellite · Dark · Light · Voyager · No basemap |

Here's what some of the combinations look like:

| A · Day or night? (`day_night`) | B · Which season? (`season`) |
|---|---|
| ![Day vs night](images/variation-a-day-night.jpg) | ![Seasons](images/variation-b-season.jpg) |
| About 1 in 3 detections happened at night. | **Spring** fires dominate the farmland along the Amu Darya in Khorezm and Karakalpakstan. |

| C · Which region? (`region`) | D · Which satellite? (`satellite`) |
|---|---|
| ![Regions](images/variation-c-region.jpg) | ![Terra vs Aqua](images/variation-d-satellite.jpg) |
| Set **Steps → 12** so each region gets its own color. | Aqua (afternoon pass) caught 2,679 points, Terra (morning pass) 1,970. |

| E · How sure is NASA? (`confidence_level`) |
|---|
| ![Confidence](images/variation-e-confidence.jpg) |

### More ideas to stand out ⭐

- **Size by strength:** in the layer settings, open **Radius** and set **Radius Based On** to `fire_power_mw`. Strong fires become big circles.
- **Only one month or season:** open the **filter tab** (the funnel icon, 2nd tab) → **Add Filter** → choose `month` or `season`, then pick the values you want.
- **Fires as a heatmap:** under **Basic**, change *Point* to **Heatmap** for a glowing "density" look.
- **🕵️ Solve the mystery:** about **1,700 hotspots** are stacked on almost the same spot near **38.05° N, 67.30° E** in Surkhandarya. They all look like one dot! Zoom in there on the satellite background. What do you think is burning all year round?
- **Compare years:** download another year from NASA ([Option B](#option-b--download-straight-from-nasa-firms)), e.g. 2015 vs 2025, and load both files. Each becomes its own layer.

---

## 📤 Part 7 – Share your map

1. Make a folder named after **your map's topic**, e.g. `Fires by season`. Put your image inside, plus a short `README.md` with **your name**, the data and the tools you used.
2. Upload the whole folder to **`2026/Day 01 Points/`** in this repository. The [Quick Start in the main README](../../../README.md#-quick-start-add-your-map-no-coding-needed) shows how, with no coding needed.
3. Post it with **#30DayMapChallenge** and say which choices you made (e.g. *"colored by season, Fergana Valley, dark background"*).

---

## 🆘 Something went wrong?

| Problem | Fix |
|---|---|
| The **Add Data** window disappeared | Click **+ Add Data** at the top of the left panel. |
| Nothing happens after pasting the link | Check that you copied the **whole** link, or download the file and drag it in instead (Part 1). |
| I can't find the downloaded file | Look in your **Downloads** folder. In Chrome, press **Ctrl + J** (Cmd + Shift + J on a Mac) to see your downloads. |
| All points are the same color | Make sure you chose a column in **Color Based On** (Step 10). |
| Colors look too similar | Use a **Qualitative** palette (Steps 11–13). |
| The map is blank or gray | Wait a few seconds for the background to load, or zoom in and out once. |
| I closed the tab and lost everything | Nothing is saved online. Just drag your file in again (Step 2); it only takes a minute to get back. |

---

## 📚 Data credits

- **Fire detections:** NASA FIRMS, MODIS Collection 6.1 active fire / hotspot detections (MCD14ML), Terra & Aqua, Uzbekistan 2025. [firms.modaps.eosdis.nasa.gov](https://firms.modaps.eosdis.nasa.gov/). doi: [10.5067/FIRMS/MODIS/MCD14ML](https://doi.org/10.5067/FIRMS/MODIS/MCD14ML)
- **Region names:** added using the region boundaries in [`Boundaries`](../../../Boundaries) (source: simplemaps.com). Points just outside the border were matched to the nearest region.
- **Readable columns** (`fire_type`, `day_night`, `season`, `month`, `confidence_level`) were made from the original FIRMS codes: `type`, `daynight`, `acq_date` and `confidence` (Low < 30, Nominal 30–80, High > 80).
