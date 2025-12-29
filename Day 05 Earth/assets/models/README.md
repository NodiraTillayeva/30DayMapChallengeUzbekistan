# 3D Model Assets Directory

This directory is for **optional local 3D models** in `.glb` format.

## 🎯 Quick Info

**The app works WITHOUT local models!** It automatically uses remote fallback URLs from Cesium's public samples.

Adding local models is **optional** and allows you to:
- Use custom models
- Work offline
- Reduce loading times
- Have full control over model appearance

---

## 📦 Required Model Files

Place these files in this directory to use local assets:

```
assets/models/
├── aircraft.glb        (Commercial airplane)
├── drone.glb           (Small quadcopter)
├── balloon.glb         (Hot air balloon)
└── vehicle.glb         (Ground vehicle/car)
```

---

## 🔍 Where to Get Models

### Free Sources

1. **Sketchfab** (https://sketchfab.com/)
   - Search: "aircraft glb", "drone glb", etc.
   - Filter by "Downloadable"
   - Look for "glTF" format
   - Many free CC-licensed models

2. **Poly Haven** (https://polyhaven.com/)
   - High-quality free models
   - Multiple formats including glTF

3. **Cesium Ion Asset Depot** (https://cesium.com/ion/assetdepot)
   - Pre-optimized for CesiumJS
   - Free sample models

4. **Free3D** (https://free3d.com/)
   - Search for glTF/GLB models
   - Free and premium options

5. **TurboSquid** (https://www.turbosquid.com/Search/3D-Models/free/glb)
   - Filter by "Free" and "glb" format

### Recommended Search Terms
- "aircraft glb free"
- "drone quadcopter glb"
- "hot air balloon glb"
- "car vehicle glb low poly"

---

## ✅ Model Requirements

### Format
- **Must be:** `.glb` (glTF binary)
- **Not:** `.gltf`, `.obj`, `.fbx`, `.blend` (convert first)

### Size
- **Recommended:** < 5MB per model
- **Maximum:** < 20MB (larger = slower loading)

### Optimization
- Use low-poly models (< 50,000 triangles)
- Include compressed textures
- Remove unnecessary animations
- Bake lighting when possible

### Orientation
- **Aircraft:** Nose pointing +X, wings along Y, up is +Z
- **Drone:** Center aligned, propellers up (+Z)
- **Balloon:** Basket at bottom, balloon at top
- **Vehicle:** Front pointing +X, wheels down (-Z)

---

## 🛠️ Converting Models to glTF

If you have models in other formats:

### Using Blender (Free)
1. Install Blender: https://www.blender.org/
2. Import your model (File → Import)
3. Export as glTF 2.0 (File → Export → glTF 2.0)
4. Choose "glTF Binary (.glb)"
5. Save to this directory

### Using Online Converters
- **GLTF-Transform** (https://gltf.report/)
- **Aspose Converter** (https://products.aspose.app/3d/conversion)
- **AnyConv** (https://anyconv.com/fbx-to-glb-converter/)

---

## 📝 Model Configuration

Models are configured in `main.js`:

```javascript
aircraft: {
    name: 'Aircraft',
    altitude: 5000,        // Spawn altitude (meters)
    scale: 2.0,            // Size multiplier
    heading: 0,            // Direction (0-360°)
    pitch: 0,              // Tilt angle
    roll: 0,               // Bank angle
    url: './assets/models/aircraft.glb',
    fallbackUrl: 'https://...'  // Remote backup
}
```

Adjust `scale`, `heading`, `pitch`, `roll` if your model appears incorrectly oriented.

---

## 🧪 Testing Your Models

After adding models:

1. **Run the app:**
   ```bash
   python -m http.server 8000
   ```

2. **Open browser console** (F12)

3. **Spawn a model** (click location + model button)

4. **Check console messages:**
   - ✅ "Model loaded successfully: Aircraft"
   - ❌ "Failed to load local model, trying fallback URL"

5. **Adjust if needed:**
   - Model too small? Increase `scale`
   - Wrong direction? Adjust `heading`
   - Upside down? Adjust `pitch` or `roll`

---

## 📐 Model Size Guidelines

| Model Type | Recommended Polygons | Recommended File Size |
|------------|---------------------|---------------------|
| Aircraft | 10,000 - 30,000 | 1-3 MB |
| Drone | 5,000 - 15,000 | 0.5-2 MB |
| Balloon | 8,000 - 20,000 | 1-2 MB |
| Vehicle | 10,000 - 25,000 | 1-3 MB |

---

## 🚫 Common Issues

### Model Not Loading
- **Check file name:** Must match exactly (case-sensitive)
- **Check file path:** Must be in `assets/models/`
- **Check format:** Must be `.glb`, not `.gltf`
- **Check console:** Look for error messages

### Model Appears Incorrectly
- **Too small/large:** Adjust `scale` in `main.js`
- **Wrong orientation:** Adjust `heading`, `pitch`, `roll`
- **Upside down:** Try `pitch: 180` or `roll: 180`
- **Missing textures:** Ensure glTF embeds textures

### Model is Black/Gray
- Model may lack materials
- Try a different model with proper materials
- Check if textures are embedded

---

## 💡 Pro Tips

1. **Start with one model** - Test aircraft.glb first
2. **Use glTF Report** - Validate models: https://gltf.report/
3. **Optimize models** - Use glTF-Transform to compress
4. **Check orientation** - Preview in Blender before using
5. **Test remote fallback** - Remove local file temporarily

---

## 📚 Example Models

Want to test quickly? Download these pre-made models:

### Cesium Sample Models (Direct Links)
These are the same models used as fallbacks:

- **Aircraft:** https://github.com/CesiumGS/cesium/tree/main/Apps/SampleData/models/CesiumAir
- **Drone:** https://github.com/CesiumGS/cesium/tree/main/Apps/SampleData/models/CesiumDrone
- **Balloon:** https://github.com/CesiumGS/cesium/tree/main/Apps/SampleData/models/CesiumBalloon
- **Vehicle:** https://github.com/CesiumGS/cesium/tree/main/Apps/SampleData/models/GroundVehicle

Download the `.glb` file from each, rename to match requirements, place here.

---

## 🔄 Fallback System

How the app handles models:

1. **Try local first:** `./assets/models/aircraft.glb`
2. **If fails:** Automatically use `fallbackUrl`
3. **Console log:** Shows which source was used
4. **User experience:** Seamless either way

**This means:**
- App works without local models ✅
- Adding local models improves performance ✅
- No configuration needed ✅

---

## 📞 Need Help?

- Check main README.md for troubleshooting
- Open browser console (F12) for error messages
- Visit CesiumJS forums: https://community.cesium.com/

---

**Happy modeling! 🚁✨**
