# Uzbekistan 3D Explorer - Model Spawner

A fully interactive 3D web application for exploring Uzbekistan and spawning 3D models (aircraft, drones, balloons, vehicles) at real geographic locations using CesiumJS.

![CesiumJS](https://img.shields.io/badge/CesiumJS-1.111-blue)
![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![No Sandcastle](https://img.shields.io/badge/Sandcastle-NOT%20USED-red)

---

## 🌟 Features

### 📍 8 Uzbekistan Locations
- **Tashkent** (41.3111°N, 69.2797°E) - Capital and largest city
- **Samarkand** (39.6542°N, 66.9597°E) - Historic Silk Road city
- **Bukhara** (39.7670°N, 64.4231°E) - Ancient trading hub
- **Fergana Valley** (40.4°N, 71.8°E) - Fertile agricultural region
- **Kyzylkum Desert** (42.5°N, 63.0°E) - Central Asian desert
- **Aral Sea** (45.0°N, 59.0°E) - Shrinking inland sea
- **Khiva** (41.3783°N, 60.3639°E) - Well-preserved ancient city
- **Nukus** (42.46°N, 59.62°E) - Capital of Karakalpakstan

### 🚁 4 Spawnable 3D Models
Each model has realistic altitude and orientation:

| Model | Altitude | Description |
|-------|----------|-------------|
| **Aircraft** | 5,000m | Commercial airplane at cruising altitude |
| **Drone** | 150m | Small UAV at typical flight height |
| **Hot Air Balloon** | 1,000m | Tourist balloon at scenic altitude |
| **Ground Vehicle** | 2m | Car/truck on the ground |

### 🎮 Interactive Controls
- **OSM 3D Buildings** - Toggle OpenStreetMap building models
- **Terrain Exaggeration** - Adjust vertical scale (1x - 3x)
- **Shadows** - Enable/disable realistic sun shadows
- **Clear Models** - Remove all spawned models at once
- **Reset View** - Return to Uzbekistan overview

### 🎯 Real-time Status Panel
Displays:
- Currently selected model
- Currently selected location
- Camera latitude/longitude
- Camera height above ground
- Total number of spawned models

---

## 🚀 Quick Start (3 Minutes)

### Step 1: Get the Files
Download these 3 files to the same directory:
- `index.html`
- `style.css`
- `main.js`

### Step 2: Run Locally

**Option A: Python (Recommended)**
```bash
cd Day\ 05\ Earth
python -m http.server 8000
```
Open: http://localhost:8000

**Option B: Node.js**
```bash
npx http-server -p 8000
```
Open: http://localhost:8000

**Option C: VS Code Live Server**
- Install "Live Server" extension
- Right-click `index.html` → "Open with Live Server"

### Step 3: Start Exploring!
1. Click a **location** button (e.g., "Tashkent")
2. Click a **model** button (e.g., "Aircraft")
3. The model will spawn at that location!
4. Camera automatically tracks the model

**Note:** A Cesium Ion token is already included in the code and ready to use.

---

## 🌐 Deploy to GitHub Pages

### Quick Deploy (5 Minutes)

1. **Create a new repository** on GitHub

2. **Upload files:**
   ```bash
   git clone https://github.com/[username]/[repo-name].git
   cd [repo-name]

   # Copy these 3 files
   cp /path/to/index.html .
   cp /path/to/style.css .
   cp /path/to/main.js .

   git add .
   git commit -m "Add Uzbekistan 3D Explorer"
   git push origin main
   ```

3. **Enable GitHub Pages:**
   - Go to repository **Settings**
   - Navigate to **Pages** section
   - Under "Source", select: **main branch** / **/ (root)**
   - Click **Save**

4. **Access your site** (after 1-2 minutes):
   - `https://[username].github.io/[repo-name]/`

**That's it!** No build process, no dependencies, no configuration needed.

---

## 📁 Project Structure

```
uzbekistan-3d-explorer/
│
├── index.html              # Main HTML structure
├── style.css               # All styling
├── main.js                 # CesiumJS logic (includes token)
├── README.md               # This file
│
└── assets/                 # Optional local 3D models
    └── models/
        ├── aircraft.glb    # (Optional - will use remote fallback)
        ├── drone.glb       # (Optional - will use remote fallback)
        ├── balloon.glb     # (Optional - will use remote fallback)
        └── vehicle.glb     # (Optional - will use remote fallback)
```

---

## 🎨 3D Model Assets

### Two Supported Options

#### Option 1: Remote Assets (Default - Already Working)
The app automatically uses **remote fallback URLs** from Cesium's public samples:
- No setup required
- Works immediately
- Always available

#### Option 2: Local Assets (Optional)
For custom models or offline use:

1. **Create directory structure:**
   ```bash
   mkdir -p assets/models
   ```

2. **Add your .glb model files:**
   ```
   assets/models/aircraft.glb
   assets/models/drone.glb
   assets/models/balloon.glb
   assets/models/vehicle.glb
   ```

3. **The app will automatically try local files first**, then fall back to remote URLs if not found.

### Where to Get 3D Models
- [Sketchfab](https://sketchfab.com/) (search for "aircraft glb")
- [Cesium Ion Asset Depot](https://cesium.com/ion/assetdepot)
- [Poly Haven](https://polyhaven.com/)
- Create your own with Blender

**Model Requirements:**
- Format: `.glb` (glTF binary)
- Recommended size: < 5MB per model
- Proper orientation (Y-up or Z-up depending on export)

---

## 🎮 How to Use

### Spawning Your First Model

1. **Select a location:**
   - Click "Tashkent" in the left sidebar
   - Camera flies to Tashkent

2. **Spawn a model:**
   - Click "Aircraft"
   - An airplane appears at 5,000m altitude
   - Camera automatically tracks it

3. **Spawn more models:**
   - Click "Samarkand" → Click "Drone"
   - Click "Bukhara" → Click "Hot Air Balloon"
   - Click "Fergana Valley" → Click "Ground Vehicle"

4. **Explore:**
   - Use mouse to rotate, zoom, tilt
   - Models stay at their locations
   - Multiple models can exist simultaneously

5. **Clear when done:**
   - Click "Clear All Models" button

### Camera Controls

| Action | Control |
|--------|---------|
| **Rotate** | Left-click + drag |
| **Zoom** | Scroll wheel |
| **Pan** | Right-click + drag |
| **Tilt** | Middle-click + drag (or Ctrl + drag) |

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| **R** | Reset view to Uzbekistan overview |
| **C** | Clear all models |
| **1-8** | Jump to locations (1=Tashkent, 2=Samarkand, etc.) |

---

## ⚙️ Technical Details

### Cesium Ion Token
A valid Cesium Ion access token is **already included** in `main.js` (line 5):

```javascript
Cesium.Ion.defaultAccessToken = 'eyJhbGci...';
```

**You don't need to change anything.** The token is ready to use.

If you want to use your own token:
1. Sign up at [https://ion.cesium.com/](https://ion.cesium.com/)
2. Copy your default access token
3. Replace the token string in `main.js` line 5

### Model Loading Logic

Models are loaded with automatic fallback:

```javascript
// 1. Try local asset first
uri: './assets/models/aircraft.glb'

// 2. If that fails, automatically use remote fallback
fallbackUrl: 'https://raw.githubusercontent.com/...'
```

Check browser console for loading status.

### Model Configuration

Edit `modelConfig` in `main.js` to customize:

```javascript
aircraft: {
    name: 'Aircraft',
    altitude: 5000,      // Change altitude (meters)
    scale: 2.0,          // Change size
    heading: 0,          // Change direction (degrees)
    pitch: 0,            // Change tilt
    roll: 0,             // Change roll
    url: './assets/models/aircraft.glb',
    fallbackUrl: 'https://...'
}
```

### Terrain & Imagery

- **Terrain:** Cesium World Terrain (high-resolution global DEM)
- **Imagery:** Cesium Ion Sentinel-2 satellite imagery
- **Buildings:** OpenStreetMap 3D Buildings (toggle-able)

---

## 🔧 Customization Guide

### Add a New Location

Edit `uzbekistanLocations` in `main.js`:

```javascript
mytown: {
    name: 'My Town',
    description: 'Custom location',
    lat: 40.1234,        // Latitude
    lon: 65.5678,        // Longitude
    cameraHeight: 40000, // Camera distance (meters)
    cameraPitch: -30     // Camera angle (-90 to 0)
}
```

Then add button in `index.html`:
```html
<button class="location-btn" data-location="mytown">My Town</button>
```

### Add a New Model Type

1. Add configuration in `main.js`:
```javascript
ship: {
    name: 'Ship',
    altitude: 0,         // On water
    scale: 2.0,
    heading: 180,
    pitch: 0,
    roll: 0,
    url: './assets/models/ship.glb',
    fallbackUrl: 'https://...'
}
```

2. Add button in `index.html`:
```html
<button class="model-btn" data-model="ship">Ship</button>
```

### Change Colors

Edit `style.css`:

```css
/* Location buttons (currently cyan) */
.location-btn {
    background: rgba(79, 195, 247, 0.15);  /* Change RGBA values */
    border-color: rgba(79, 195, 247, 0.3);
    color: #4fc3f7;
}

/* Model buttons (currently orange) */
.model-btn {
    background: rgba(255, 152, 0, 0.15);
    border-color: rgba(255, 152, 0, 0.3);
    color: #ff9800;
}
```

---

## 🚨 Troubleshooting

### Black Screen or "Unauthorized" Error
**Problem:** Cesium Ion token issue

**Solution:**
- The token is already included and should work
- If expired, get a new token from [ion.cesium.com](https://ion.cesium.com/)
- Replace in `main.js` line 5

### Models Not Appearing
**Problem:** Model failed to load

**Solution:**
1. Open browser console (F12)
2. Check for errors
3. Verify fallback URLs are accessible
4. If using local assets, check file paths

### "Please select a location first!" Alert
**Problem:** Trying to spawn model without selecting location

**Solution:**
- Click a location button first (e.g., "Tashkent")
- Then click a model button (e.g., "Aircraft")

### Performance Issues
**Problem:** Slow or laggy

**Solution:**
1. Disable 3D Buildings toggle
2. Reduce terrain exaggeration to 1.0x
3. Clear spawned models (click "Clear All Models")
4. Close other browser tabs
5. Use Chrome (best performance)

### CORS Errors
**Problem:** Opening `index.html` directly from file system

**Solution:**
- **Always use a web server** (Python, Node.js, VS Code Live Server)
- Do NOT double-click `index.html` to open

---

## 📊 Browser Compatibility

| Browser | Minimum Version | WebGL 2 | Status |
|---------|-----------------|---------|--------|
| Chrome | 90+ | ✅ Yes | ✅ Recommended |
| Firefox | 88+ | ✅ Yes | ✅ Supported |
| Edge | 90+ | ✅ Yes | ✅ Supported |
| Safari | 14+ | ✅ Yes | ✅ Supported |
| Opera | 76+ | ✅ Yes | ✅ Supported |

**Requirements:** WebGL 2.0, ES6 JavaScript support

---

## 📖 Code Architecture

### File Breakdown

**index.html** (115 lines)
- Semantic HTML structure
- Left sidebar with location/model buttons
- Status panel
- Cesium container
- Loading overlay
- Instructions popup

**style.css** (470 lines)
- Modern CSS3 styling
- Glassmorphism effects (backdrop-filter)
- Responsive design
- Smooth transitions
- Custom scrollbar styling

**main.js** (550 lines)
- Cesium viewer initialization
- Location data (8 places)
- Model configuration (4 models)
- Camera navigation (`viewer.camera.flyTo`)
- Model spawning with orientation
- Entity tracking (`viewer.trackedEntity`)
- Event handlers
- Keyboard shortcuts
- Status panel updates

### No External Dependencies
- ✅ No npm packages
- ✅ No build tools (Webpack, Vite, etc.)
- ✅ No Sandcastle
- ✅ No jQuery, React, Vue, etc.
- ✅ Pure vanilla JavaScript

**Only external resource:** CesiumJS CDN

---

## 📜 License & Attribution

### Code License
MIT License - Free to use, modify, and distribute

### Required Attribution

When using this project, please include:

```
Uzbekistan 3D Explorer
Powered by CesiumJS
Terrain & Imagery: Cesium Ion
Created for #30DayMapChallenge - Day 5: Earth
```

### Data Sources
- **Terrain:** Cesium World Terrain
- **Imagery:** Cesium Ion (Sentinel-2)
- **3D Buildings:** OpenStreetMap (via Cesium)
- **3D Models:** Cesium Sample Data (fallback)
- **Geographic Coordinates:** Public geographic databases

---

## 🎓 Learning Resources

### CesiumJS Documentation
- [Official Documentation](https://cesium.com/learn/cesiumjs/ref-doc/)
- [Entity API](https://cesium.com/learn/cesiumjs/ref-doc/Entity.html)
- [Camera Guide](https://cesium.com/learn/cesiumjs/ref-doc/Camera.html)
- [Model Loading](https://cesium.com/learn/cesiumjs/ref-doc/ModelGraphics.html)

### Tutorials
- [CesiumJS Quickstart](https://cesium.com/learn/cesiumjs-learn/cesiumjs-quickstart/)
- [Cesium Ion Setup](https://cesium.com/learn/ion/)
- [glTF Model Guide](https://www.khronos.org/gltf/)

---

## 🤝 Contributing

Want to enhance this project? Ideas:

- Add more Uzbekistan landmarks (Termez, Andijan, etc.)
- Include animated model paths (flying routes)
- Add weather data overlay
- Implement model rotation/animation
- Add distance measurement tool
- Include historical information panels
- Add time-of-day slider for lighting
- Implement model collision detection

---

## 🌟 Author

Created for **#30DayMapChallenge - Day 5: Earth**

Built with CesiumJS by the Uzbekistan GIS Community

---

## 📞 Support

**Having issues?**
1. Check the Troubleshooting section above
2. Open browser console (F12) to see errors
3. Review [CesiumJS Community Forum](https://community.cesium.com/)
4. Open a GitHub issue

---

**Explore Uzbekistan in immersive 3D! 🇺🇿🌍🚁**
