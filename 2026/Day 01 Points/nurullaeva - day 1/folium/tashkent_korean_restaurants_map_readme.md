# Tashkent Korean Restaurants Interactive Map

An interactive mapping project built with **Python** and **Folium** to visualize Korean restaurants across Tashkent, Uzbekistan using scraped spatial data.

---

## 📌 Project Overview

This project provides an interactive spatial map of Korean dining establishments in Tashkent. It features custom map markers, clustering for high-density restaurant areas, and direct links to Google Maps coordinates for each location.

---

## 📁 File Structure

```text
.
├── generate_korean_restaurants_map.py   # Script to process data and build the Folium map
├── tashkent_korean_google_scraped.csv    # Scraped dataset containing restaurant details & coordinates
├── tashkent_korean_restaurants_map.html  # Generated interactive HTML map output
└── README.md                             # Documentation file
```

---

## 🛠️ Requirements & Setup

### Prerequisites

Ensure Python 3.8+ is installed on your system. Install the required dependencies:

```bash
pip install folium pandas
```

### Running the Script

Run the generator script to produce the interactive HTML map:

```bash
python generate_korean_restaurants_map.py
```

After execution, open `tashkent_korean_restaurants_map.html` in any web browser.

---

## 🗺️ Map Features & Visual Highlights

* **Center Location:** Tashkent, Uzbekistan (`41.2995° N, 69.2772° E`).
* **Marker Clustering:** Groups closely located restaurants (e.g., in Yakkasaray and Mirabad districts) to keep the map clean and navigable.
* **Custom Icons:** Uses red cutlery icons for clear category representation.
* **Interactive Popups:** Clicking any marker reveals:
  * Restaurant name (in English, Russian, or Korean).
  * Latitude and longitude coordinates.
  * A direct clickable link to view the location on **Google Maps**.

---

## 📊 Dataset Schema

| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| `name` | String | Scraped name of the restaurant / cafe |
| `lat` | Float | Latitude coordinate (Decimal Degrees) |
| `lon` | Float | Longitude coordinate (Decimal Degrees) |
| `Google Maps Link` | String | Pre-formatted web URL pointing to the location |