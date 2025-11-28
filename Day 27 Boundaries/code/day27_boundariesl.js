// ═══════════════════════════════════════════════════════════════
// 30-DAY MAP CHALLENGE - DAY 27: BOUNDARIES (REFINED FINAL)
// "Life Boundaries of Uzbekistan" - Clean Contours Edition
// ═══════════════════════════════════════════════════════════════
// By: Mushtariy Akhmadjonova
// ═══════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────
// 1. DEFINE AREA OF INTEREST
// ─────────────────────────────────────────────────────────────

var uzbekistan = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017')
  .filter(ee.Filter.eq('country_na', 'Uzbekistan'));

Map.centerObject(uzbekistan, 6);

// ─────────────────────────────────────────────────────────────
// 2. WATER FEATURES - INCLUDING ALL SOURCES
// ─────────────────────────────────────────────────────────────

var water = ee.Image('JRC/GSW1_3/GlobalSurfaceWater')
  .select('occurrence')
  .clip(uzbekistan);

// Get rivers for contour generation
var rivers = ee.FeatureCollection('WWF/HydroSHEDS/v1/FreeFlowingRivers')
  .filterBounds(uzbekistan);

// IMPROVED: Use water occurrence as additional source for more accurate contours
// This captures lakes, reservoirs, and other water bodies that rivers miss
var waterBinary = water.gt(10);

// Convert water raster to vectors for buffer analysis
var waterVectors = waterBinary.reduceToVectors({
  geometry: uzbekistan,
  scale: 500,  // Coarser scale for efficiency
  geometryType: 'polygon',
  maxPixels: 1e13,
  bestEffort: true
});

// Combine rivers and water bodies for comprehensive buffer
var allWaterSources = rivers.merge(waterVectors);

// ─────────────────────────────────────────────────────────────
// 3. CLEAN, THIN CONTOURS - Better Method
// ─────────────────────────────────────────────────────────────

// Create buffers
var riverBuffer5 = allWaterSources.map(function(f) {
  return f.buffer(5000);
});

var riverBuffer10 = allWaterSources.map(function(f) {
  return f.buffer(10000);
});

var riverBuffer15 = allWaterSources.map(function(f) {
  return f.buffer(15000);
});

// Paint buffers
var bufferImage5 = ee.Image().paint(riverBuffer5, 1);
var bufferImage10 = ee.Image().paint(riverBuffer10, 1);
var bufferImage15 = ee.Image().paint(riverBuffer15, 1);

// REFINED: Better Canny parameters for THINNER, cleaner contours
var riverContour5 = ee.Algorithms.CannyEdgeDetector({
  image: bufferImage5,
  threshold: 0.7,  // Higher threshold = thinner lines
  sigma: 0.8       // Lower sigma = sharper edges
});

var riverContour10 = ee.Algorithms.CannyEdgeDetector({
  image: bufferImage10,
  threshold: 0.6,  // Slightly lower for visibility
  sigma: 1.0
});

var riverContour15 = ee.Algorithms.CannyEdgeDetector({
  image: bufferImage15,
  threshold: 0.5,
  sigma: 1.2
});

// OPTIONAL: Further thin the lines using morphological erosion
// Uncomment if you want even thinner lines:
/*
var kernel = ee.Kernel.circle({radius: 1});
riverContour5 = riverContour5.focal_min({kernel: kernel, iterations: 1});
riverContour10 = riverContour10.focal_min({kernel: kernel, iterations: 1});
riverContour15 = riverContour15.focal_min({kernel: kernel, iterations: 1});
*/

// ─────────────────────────────────────────────────────────────
// 4. VEGETATION BOUNDARIES
// ─────────────────────────────────────────────────────────────

var ndvi = ee.ImageCollection('MODIS/061/MOD13A2')
  .select('NDVI')
  .filterDate('2023-01-01', '2024-01-01')
  .mean()
  .multiply(0.0001)
  .clip(uzbekistan);

var ndviEdges = ee.Algorithms.CannyEdgeDetector({
  image: ndvi,
  threshold: 0.08,
  sigma: 0.8
});

// ─────────────────────────────────────────────────────────────
// 5. IRRIGATION BOUNDARIES
// ─────────────────────────────────────────────────────────────

var ndviWet = ee.ImageCollection('MODIS/061/MOD13A2')
  .select('NDVI')
  .filterDate('2023-07-01', '2023-08-31')
  .mean()
  .multiply(0.0001);

var ndviDry = ee.ImageCollection('MODIS/061/MOD13A2')
  .select('NDVI')
  .filterDate('2023-03-01', '2023-04-30')
  .mean()
  .multiply(0.0001);

var irrigationSignal = ndviWet.subtract(ndviDry).clip(uzbekistan);
var irrigatedAreas = irrigationSignal.gt(0.15);

// ═══════════════════════════════════════════════════════════════
// VISUALIZATION - VIBRANT COLORS + CLEAN CONTOURS
// ═══════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────
// BASE: Vibrant Pink to Turquoise Gradient
// ─────────────────────────────────────────────────────────────

var ndviVis = {
  min: -0.1,
  max: 0.7,
  palette: [
    '#FFB6D9',  // Soft light pink
    '#FF9EC7',  // Pastel pink
    '#FFC090',  // Soft coral
    '#FFEB9C',  // Soft yellow
    '#A8E6CF',  // Soft mint green
    '#7FD8BE',  // Light teal
    '#6DD3CE'   // Soft turquoise
  ]
};

Map.addLayer(ndvi, ndviVis, 'NDVI Gradient', true, 0.85);

// ─────────────────────────────────────────────────────────────
// Water Bodies - Clear Turquoise
// ─────────────────────────────────────────────────────────────

var waterVis = {
  min: 10,
  max: 100,
  palette: ['#5DADE2', '#3498DB', '#2E86C1']
};

Map.addLayer(water, waterVis, 'Water Bodies', true, 0.9);

// ─────────────────────────────────────────────────────────────
// CLEAN RIVER LIFE ZONE CONTOURS (Thinner!)
// ─────────────────────────────────────────────────────────────

// Outer ring (15km) - Lightest purple
Map.addLayer(riverContour15.selfMask(), {
  palette: ['#D7BDE2'],
  min: 0,
  max: 1
}, '15km Life Zone (Outer)', true, 0.75);

// Middle ring (10km) - Original purple
Map.addLayer(riverContour10.selfMask(), {
  palette: ['#9B59B6'],
  min: 0,
  max: 1
}, '10km Life Zone (Middle)', true, 0.9);

// Inner ring (5km) - Bold dark purple (most prominent!)
Map.addLayer(riverContour5.selfMask(), {
  palette: ['#7D3C98'],
  min: 0,
  max: 1
}, '5km Life Zone (Critical)', true, 1.0);

// ─────────────────────────────────────────────────────────────
// Irrigated Areas
// ─────────────────────────────────────────────────────────────

Map.addLayer(irrigatedAreas.selfMask(), {
  palette: ['#52BE80']
}, 'Irrigated Areas', true, 0.65);

// ─────────────────────────────────────────────────────────────
// Vegetation Boundaries
// ─────────────────────────────────────────────────────────────

Map.addLayer(ndviEdges.selfMask(), {
  palette: ['#FFFFFF'],
  min: 0,
  max: 1
}, 'Vegetation Boundaries', true, 1.0);

// ═══════════════════════════════════════════════════════════════
// PROFESSIONAL LEGEND
// ═══════════════════════════════════════════════════════════════

var legend = ui.Panel({
  style: {
    position: 'bottom-left',
    padding: '10px 14px',
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    border: '2px solid #E91E63'
  }
});

var title = ui.Label({
  value: '🗺️ DAY 27: BOUNDARIES',
  style: {
    fontSize: '15px',
    fontWeight: 'bold',
    color: '#E91E63',
    margin: '0px 0px 2px 0px',
    padding: '0px'
  }
});

var subtitle = ui.Label({
  value: 'Life Boundaries of Uzbekistan',
  style: {
    fontSize: '12px',
    color: '#2E86C1',
    fontWeight: 'bold',
    margin: '0px 0px 4px 0px',
    padding: '0px'
  }
});

var subtitle2 = ui.Label({
  value: 'Where water defines the boundaries of life',
  style: {
    fontSize: '9px',
    color: '#666',
    fontStyle: 'italic',
    margin: '0px 0px 6px 0px',
    padding: '0px'
  }
});

var divider1 = ui.Label({
  value: '━━━━━━━━━━━━━━━━━━━━━━━━',
  style: {
    fontSize: '10px',
    color: '#DDD',
    margin: '0px',
    padding: '0px'
  }
});

var waterTitle = ui.Label({
  value: 'WATER FEATURES',
  style: {
    fontSize: '10px',
    fontWeight: 'bold',
    color: '#2E86C1',
    margin: '4px 0px 2px 0px',
    padding: '0px'
  }
});

var legendWater = ui.Label({
  value: '💧 Water Bodies',
  style: {
    fontSize: '10px',
    color: '#2E86C1',
    margin: '1px 0px 1px 4px',
    padding: '0px'
  }
});

var zoneTitle = ui.Label({
  value: 'RIVER INFLUENCE ZONES',
  style: {
    fontSize: '10px',
    fontWeight: 'bold',
    color: '#7D3C98',
    margin: '6px 0px 2px 0px',
    padding: '0px'
  }
});

var legend5km = ui.Label({
  value: '━━ 5km (Critical Zone)',
  style: {
    fontSize: '10px',
    color: '#7D3C98',
    margin: '1px 0px 1px 4px',
    padding: '0px',
    fontWeight: 'bold'
  }
});

var legend10km = ui.Label({
  value: '━━ 10km (Moderate Zone)',
  style: {
    fontSize: '10px',
    color: '#9B59B6',
    margin: '1px 0px 1px 4px',
    padding: '0px',
    fontWeight: 'bold'
  }
});

var legend15km = ui.Label({
  value: '━ 15km (Outer Zone)',
  style: {
    fontSize: '10px',
    color: '#D7BDE2',
    margin: '1px 0px 1px 4px',
    padding: '0px'
  }
});

var humanTitle = ui.Label({
  value: 'HUMAN MODIFICATION',
  style: {
    fontSize: '10px',
    fontWeight: 'bold',
    color: '#52BE80',
    margin: '6px 0px 2px 0px',
    padding: '0px'
  }
});

var legendIrrigation = ui.Label({
  value: '🌿 Irrigated Agriculture',
  style: {
    fontSize: '10px',
    color: '#52BE80',
    margin: '1px 0px 1px 4px',
    padding: '0px'
  }
});

var naturalTitle = ui.Label({
  value: 'NATURAL PATTERNS',
  style: {
    fontSize: '10px',
    fontWeight: 'bold',
    color: '#888',
    margin: '6px 0px 2px 0px',
    padding: '0px'
  }
});

var legendVegBound = ui.Label({
  value: '⬜ Vegetation Boundaries',
  style: {
    fontSize: '10px',
    color: '#888',
    margin: '1px 0px 1px 4px',
    padding: '0px'
  }
});

var divider2 = ui.Label({
  value: '━━━━━━━━━━━━━━━━━━━━━━━━',
  style: {
    fontSize: '10px',
    color: '#DDD',
    margin: '6px 0px 4px 0px',
    padding: '0px'
  }
});

var interpret = ui.Label({
  value: 'Pink → Desert | Green → Life',
  style: {
    fontSize: '10px',
    fontWeight: 'bold',
    color: '#E91E63',
    margin: '2px 0px 0px 0px',
    padding: '0px'
  }
});

legend.add(title);
legend.add(subtitle);
legend.add(subtitle2);
legend.add(divider1);
legend.add(waterTitle);
legend.add(legendWater);
legend.add(zoneTitle);
legend.add(legend5km);
legend.add(legend10km);
legend.add(legend15km);
legend.add(humanTitle);
legend.add(legendIrrigation);
legend.add(naturalTitle);
legend.add(legendVegBound);
legend.add(divider2);
legend.add(interpret);

Map.add(legend);

// ═══════════════════════════════════════════════════════════════
// EXPORT - HIGH QUALITY
// ═══════════════════════════════════════════════════════════════

var composite = ndvi.visualize(ndviVis)
  .blend(water.visualize(waterVis))
  .blend(irrigatedAreas.selfMask().visualize({palette: ['#52BE80']}))
  .blend(riverContour15.selfMask().visualize({palette: ['#D7BDE2']}))
  .blend(riverContour10.selfMask().visualize({palette: ['#9B59B6']}))
  .blend(riverContour5.selfMask().visualize({palette: ['#7D3C98']}))
  .blend(ndviEdges.selfMask().visualize({palette: ['#FFFFFF']}));

Export.image.toDrive({
  image: composite,
  description: 'Day27_Boundaries_Clean_Contours',
  scale: 300,
  region: uzbekistan,
  maxPixels: 1e13,
  fileFormat: 'GeoTIFF'
});

// ═══════════════════════════════════════════════════════════════
// STATISTICS
// ═══════════════════════════════════════════════════════════════

print('═══════════════════════════════════════════════════════');
print('REFINED FINAL MAP - CLEAN CONTOURS');
print('═══════════════════════════════════════════════════════');
print('✓ Thinner, cleaner contour lines');
print('✓ Better Canny parameters (higher threshold, lower sigma)');
print('✓ Includes ALL water sources (rivers + lakes + reservoirs)');
print('✓ Vibrant original colors maintained');
print('✓ Professional legend design');
print('═══════════════════════════════════════════════════════');
print('');
print('Canny Parameters Used:');
print('• 5km:  threshold=0.7, sigma=0.8 (thinnest)');
print('• 10km: threshold=0.6, sigma=1.0 (medium)');
print('• 15km: threshold=0.5, sigma=1.2 (subtle)');
print('');
print('Higher threshold = thinner lines');
print('Lower sigma = sharper edges');
print('═══════════════════════════════════════════════════════');
