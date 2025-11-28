// ═══════════════════════════════════════════════════════════════
// 30-DAY MAP CHALLENGE - DAY 28: BLACK
// "Last Dark Skies of Uzbekistan" - Where Stars Still Shine
// ═══════════════════════════════════════════════════════════════
// By: Mushtariy Akhmadjonova
// Theme: Light pollution vs. pristine dark skies
// Heritage: From Ulugh Beg Observatory to modern astrotourism
// ═══════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────
// 1. DEFINE AREA OF INTEREST
// ─────────────────────────────────────────────────────────────

var uzbekistan = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017')
  .filter(ee.Filter.eq('country_na', 'Uzbekistan'));

Map.centerObject(uzbekistan, 6);

// ─────────────────────────────────────────────────────────────
// 2. NASA BLACK MARBLE - NIGHTTIME LIGHTS
// ─────────────────────────────────────────────────────────────

// VIIRS Day/Night Band - Monthly composite (2023)
var nightlights = ee.ImageCollection('NOAA/VIIRS/DNB/MONTHLY_V1/VCMSLCFG')
  .filterDate('2023-01-01', '2023-12-31')
  .select('avg_rad')  // Average radiance
  .mean()
  .clip(uzbekistan);

// Mask out very low values (noise)
var nightlightsMasked = nightlights.updateMask(nightlights.gt(0.1));

// ─────────────────────────────────────────────────────────────
// 3. CALCULATE DARKNESS INDEX
// ─────────────────────────────────────────────────────────────

// Invert nightlights to show darkness
// Higher values = darker skies
var maxRadiance = nightlights.reduceRegion({
  reducer: ee.Reducer.percentile([99]),
  geometry: uzbekistan,
  scale: 1000,
  maxPixels: 1e13
}).get('avg_rad');

var darknessIndex = ee.Image(ee.Number(maxRadiance))
  .subtract(nightlights)
  .divide(ee.Number(maxRadiance))
  .multiply(100)
  .clip(uzbekistan);

// ─────────────────────────────────────────────────────────────
// 4. CLASSIFY DARK SKY ZONES (Bortle Scale approximation)
// ─────────────────────────────────────────────────────────────

// Based on radiance values, approximate Bortle scale
// Class 1-2: Excellent dark skies (radiance < 0.5)
// Class 3-4: Rural (0.5 - 2)
// Class 5-6: Suburban (2 - 10)
// Class 7-9: Urban/City (> 10)

var darkSkyClass1 = nightlights.lt(0.5);   // Pristine dark
var darkSkyClass2 = nightlights.gte(0.5).and(nightlights.lt(2));  // Rural
var darkSkyClass3 = nightlights.gte(2).and(nightlights.lt(10));   // Suburban
var darkSkyClass4 = nightlights.gte(10);   // Urban/City

// ─────────────────────────────────────────────────────────────
// 5. MAJOR CITIES AND POPULATION CENTERS
// ─────────────────────────────────────────────────────────────

// Major city locations (approximate)
var cities = ee.FeatureCollection([
  ee.Feature(ee.Geometry.Point([69.2401, 41.2995]), {name: 'Tashkent', pop: 2.5}),
  ee.Feature(ee.Geometry.Point([66.9597, 39.6542]), {name: 'Samarkand', pop: 0.5}),
  ee.Feature(ee.Geometry.Point([64.4265, 39.7747]), {name: 'Bukhara', pop: 0.3}),
  ee.Feature(ee.Geometry.Point([60.6333, 41.5269]), {name: 'Nukus', pop: 0.3}),
  ee.Feature(ee.Geometry.Point([71.7719, 40.3828]), {name: 'Fergana', pop: 0.3})
]);

// Buffer around cities to show light pollution zones
var cityBuffers = cities.map(function(f) {
  return f.buffer(50000);  // 50km buffer
});

// ─────────────────────────────────────────────────────────────
// 6. PROTECTED DARK SKY REGIONS
// ─────────────────────────────────────────────────────────────

// Karakalpakstan - Excellent dark skies (northwestern desert)
var karakalpakstan = ee.Geometry.Rectangle([56.0, 42.0, 61.5, 45.5]);

// Kyzylkum Desert - Pristine dark skies (central)
var kyzylkum = ee.Geometry.Rectangle([62.0, 40.5, 66.0, 43.5]);

// Surkhandarya - Mountain dark skies (southern)
var surkhandarya = ee.Geometry.Rectangle([67.0, 37.5, 68.5, 38.5]);

// Maidanak Observatory region (near Samarkand)
var maidanak = ee.Geometry.Point([66.9, 38.7]).buffer(25000);

// ═══════════════════════════════════════════════════════════════
// VISUALIZATION - BLACK THEME
// ═══════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────
// Base Map Style - DARK/BLACK
// ─────────────────────────────────────────────────────────────

// Create a very dark base layer to achieve black background
var darkBackground = ee.Image(0).visualize({
  palette: ['#000000'],
  min: 0,
  max: 1
});

Map.addLayer(darkBackground, {}, 'Dark Background', true, 1.0);

// Create a lighter layer for areas outside Uzbekistan
// This makes surrounding countries clearly visible but still darker than Uzbekistan content
var outsideUzbekistan = ee.Image(1).visualize({
  palette: ['#2a2a2a'],  // Medium dark gray (lighter than before)
  min: 0,
  max: 1
});

// Mask to show only areas outside Uzbekistan
var uzbekMask = ee.Image().paint(uzbekistan, 0);
var outsideLayer = outsideUzbekistan.updateMask(uzbekMask.not());

Map.addLayer(outsideLayer, {}, 'Outside Context', true, 0.6);  // Increased opacity from 0.3 to 0.6

// ─────────────────────────────────────────────────────────────
// Light Pollution - Golden Yellow to White (realistic starlight) - ENHANCED
// ─────────────────────────────────────────────────────────────

var lightPollutionVis = {
  min: 0.1,
  max: 50,
  palette: [
    '#000000',  // Black (no light)
    '#1a1000',  // Very dark gold
    '#332200',  // Dark gold-brown
    '#4d3300',  // Medium gold-brown
    '#664400',  // Brown-gold
    '#998800',  // Dark yellow-gold
    '#CCB000',  // Gold
    '#FFD700',  // Pure gold (classic starlight)
    '#FFEB3B',  // Bright golden yellow
    '#FFFF00',  // Pure yellow
    '#FFFFAA',  // Light yellow
    '#FFFFCC',  // Very light yellow
    '#FFFFFF'   // White (extreme)
  ]
};

Map.addLayer(nightlightsMasked, lightPollutionVis, 'Light Pollution', true, 1.0);

// ─────────────────────────────────────────────────────────────
// Darkness Index - Purple to Blue (pristine skies)
// ─────────────────────────────────────────────────────────────

var darknessVis = {
  min: 0,
  max: 100,
  palette: [
    '#000000',  // Black (light polluted)
    '#0D0D26',  // Very dark blue
    '#1a1a4d',  // Dark blue
    '#2E3192',  // Medium blue
    '#4B0082',  // Indigo
    '#6A0DAD',  // Purple
    '#9932CC',  // Dark orchid
    '#BA55D3',  // Medium orchid
    '#E6E6FA'   // Lavender (pristine dark)
  ]
};

Map.addLayer(darknessIndex, darknessVis, 'Darkness Quality', false, 0.7);

// ─────────────────────────────────────────────────────────────
// Dark Sky Classification Zones
// ─────────────────────────────────────────────────────────────

Map.addLayer(darkSkyClass1.selfMask(), {
  palette: ['#00FFFF']  // Cyan - Pristine
}, 'Class 1-2: Pristine Dark Sky', false, 0.6);

Map.addLayer(darkSkyClass2.selfMask(), {
  palette: ['#4169E1']  // Royal Blue - Rural
}, 'Class 3-4: Rural Sky', false, 0.5);

Map.addLayer(darkSkyClass3.selfMask(), {
  palette: ['#FFA500']  // Orange - Suburban
}, 'Class 5-6: Suburban', false, 0.4);

Map.addLayer(darkSkyClass4.selfMask(), {
  palette: ['#FF0000']  // Red - Urban
}, 'Class 7-9: Urban/City', false, 0.5);

// ─────────────────────────────────────────────────────────────
// Protected Dark Sky Regions - Highlighted
// ─────────────────────────────────────────────────────────────

var darkSkyRegions = ee.Image().paint({
  featureCollection: ee.FeatureCollection([
    ee.Feature(karakalpakstan, {name: 'Karakalpakstan'}),
    ee.Feature(kyzylkum, {name: 'Kyzylkum'}),
    ee.Feature(surkhandarya, {name: 'Surkhandarya'}),
    ee.Feature(maidanak, {name: 'Maidanak'})
  ]),
  color: 1,
  width: 2
});

Map.addLayer(darkSkyRegions, {
  palette: ['#00FF00']  // Green outlines
}, 'Dark Sky Regions', true, 0.8);

// ─────────────────────────────────────────────────────────────
// Country Boundary
// ─────────────────────────────────────────────────────────────

var boundary = ee.Image().paint({
  featureCollection: uzbekistan,
  color: 1,
  width: 2
});

Map.addLayer(boundary, {
  palette: ['#FFFFFF']  // White boundary
}, 'Uzbekistan', true, 0.7);

// ═══════════════════════════════════════════════════════════════
// LEGEND - BLACK THEME
// ═══════════════════════════════════════════════════════════════

var legend = ui.Panel({
  style: {
    position: 'bottom-left',
    padding: '0px',  // Remove padding
    backgroundColor: 'rgba(0, 0, 0, 0)',  // Fully transparent
    border: '2px solid #FFD700',
    width: '280px'  // Set fixed width for consistency
  }
});

var title = ui.Label({
  value: '🌌 DAY 28: BLACK',
  style: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#FFD700',
    margin: '8px 8px 2px 8px',  // Add margin for spacing
    padding: '4px 8px',  // Add padding to label itself
    backgroundColor: 'rgba(0, 0, 0, 0.8)'  // Semi-transparent black background
  }
});

var subtitle = ui.Label({
  value: 'Last Dark Skies of Uzbekistan',
  style: {
    fontSize: '13px',
    color: '#00FFFF',
    fontWeight: 'bold',
    margin: '0px 8px 4px 8px',
    padding: '4px 8px',
    backgroundColor: 'rgba(0, 0, 0, 0.8)'
  }
});

var subtitle2 = ui.Label({
  value: 'Where stars still shine - from Ulugh Beg to today',
  style: {
    fontSize: '9px',
    color: '#FFFFFF',  // White
    fontStyle: 'italic',
    margin: '0px 8px 6px 8px',
    padding: '4px 8px',
    backgroundColor: 'rgba(0, 0, 0, 0.8)'
  }
});

var divider1 = ui.Label({
  value: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
  style: {
    fontSize: '10px',
    color: '#666666',  // Lighter gray
    margin: '0px 8px',
    padding: '0px 8px',
    backgroundColor: 'rgba(0, 0, 0, 0.8)'
  }
});

var lightTitle = ui.Label({
  value: 'LIGHT POLLUTION',
  style: {
    fontSize: '10px',
    fontWeight: 'bold',
    color: '#FFD700',
    margin: '4px 8px 2px 8px',
    padding: '4px 8px',
    backgroundColor: 'rgba(0, 0, 0, 0.8)'
  }
});

var legendUrban = ui.Label({
  value: '🔴 Urban Centers (Tashkent, Samarkand)',
  style: {
    fontSize: '9px',
    color: '#FFFFFF',  // White
    margin: '1px 8px 1px 12px',
    padding: '2px 8px',
    backgroundColor: 'rgba(0, 0, 0, 0.8)'
  }
});

var legendSuburban = ui.Label({
  value: '🟠 Suburban Zones',
  style: {
    fontSize: '9px',
    color: '#FFFFFF',  // White
    margin: '1px 8px 1px 12px',
    padding: '2px 8px',
    backgroundColor: 'rgba(0, 0, 0, 0.8)'
  }
});

var darkTitle = ui.Label({
  value: 'PRISTINE DARK SKIES',
  style: {
    fontSize: '10px',
    fontWeight: 'bold',
    color: '#00FFFF',
    margin: '6px 8px 2px 8px',
    padding: '4px 8px',
    backgroundColor: 'rgba(0, 0, 0, 0.8)'
  }
});

var legendKarakalpakstan = ui.Label({
  value: '⭐ Karakalpakstan (NW) - Class 1-2',
  style: {
    fontSize: '9px',
    color: '#FFFFFF',  // White
    margin: '1px 8px 1px 12px',
    padding: '2px 8px',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    fontWeight: 'bold'
  }
});

var legendKyzylkum = ui.Label({
  value: '⭐ Kyzylkum Desert (C) - Class 1-2',
  style: {
    fontSize: '9px',
    color: '#FFFFFF',  // White
    margin: '1px 8px 1px 12px',
    padding: '2px 8px',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    fontWeight: 'bold'
  }
});

var legendSurkhan = ui.Label({
  value: '⭐ Surkhandarya (S) - Class 2-3',
  style: {
    fontSize: '9px',
    color: '#FFFFFF',  // White
    margin: '1px 8px 1px 12px',
    padding: '2px 8px',
    backgroundColor: 'rgba(0, 0, 0, 0.8)'
  }
});

var legendMaidanak = ui.Label({
  value: '🔭 Maidanak Observatory (2600m)',
  style: {
    fontSize: '9px',
    color: '#FFFFFF',  // White
    margin: '1px 8px 1px 12px',
    padding: '2px 8px',
    backgroundColor: 'rgba(0, 0, 0, 0.8)'
  }
});

var heritageTitle = ui.Label({
  value: 'ASTRONOMICAL HERITAGE',
  style: {
    fontSize: '10px',
    fontWeight: 'bold',
    color: '#9932CC',
    margin: '6px 8px 2px 8px',
    padding: '4px 8px',
    backgroundColor: 'rgba(0, 0, 0, 0.8)'
  }
});

var legendUlugh = ui.Label({
  value: '📜 Ulugh Beg Observatory (1420s) - Samarkand',
  style: {
    fontSize: '8px',
    color: '#FFFFFF',  // White
    margin: '1px 8px 1px 12px',
    padding: '2px 8px',
    backgroundColor: 'rgba(0, 0, 0, 0.8)'
  }
});

var legendAstro = ui.Label({
  value: '🌠 Emerging astrotourism destination',
  style: {
    fontSize: '8px',
    color: '#FFFFFF',  // White
    margin: '1px 8px 1px 12px',
    padding: '2px 8px',
    backgroundColor: 'rgba(0, 0, 0, 0.8)'
  }
});

var divider2 = ui.Label({
  value: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
  style: {
    fontSize: '10px',
    color: '#666666',  // Lighter gray
    margin: '6px 8px 4px 8px',
    padding: '0px 8px',
    backgroundColor: 'rgba(0, 0, 0, 0.8)'
  }
});

var interpret = ui.Label({
  value: '💡 150+ clear nights/year · Minimal humidity',
  style: {
    fontSize: '9px',
    fontWeight: 'bold',
    color: '#FFD700',  // Keep gold for emphasis
    margin: '2px 8px 2px 8px',
    padding: '4px 8px',
    backgroundColor: 'rgba(0, 0, 0, 0.8)'
  }
});

var interpret2 = ui.Label({
  value: 'Gold = Light | Cyan = Darkness | Green = Protected',
  style: {
    fontSize: '8px',
    color: '#FFFFFF',  // White
    margin: '0px 8px 8px 8px',
    padding: '4px 8px',
    backgroundColor: 'rgba(0, 0, 0, 0.8)'
  }
});

legend.add(title);
legend.add(subtitle);
legend.add(subtitle2);
legend.add(divider1);
legend.add(lightTitle);
legend.add(legendUrban);
legend.add(legendSuburban);
legend.add(darkTitle);
legend.add(legendKarakalpakstan);
legend.add(legendKyzylkum);
legend.add(legendSurkhan);
legend.add(legendMaidanak);
legend.add(heritageTitle);
legend.add(legendUlugh);
legend.add(legendAstro);
legend.add(divider2);
legend.add(interpret);
legend.add(interpret2);

Map.add(legend);

// ═══════════════════════════════════════════════════════════════
// DATA ATTRIBUTION
// ═══════════════════════════════════════════════════════════════

var info = ui.Panel({
  style: {
    position: 'bottom-right',
    padding: '0px',  // Remove padding
    backgroundColor: 'rgba(0, 0, 0, 0)',  // Fully transparent
    border: '1.5px solid #666666',  // Lighter border
    width: '200px'
  }
});

var dataSource = ui.Label({
  value: 'Data: NASA Black Marble (VIIRS DNB 2023)\nBortle Scale approximation\nAuthor: Mushtariy Akhmadjonova\n30-Day Map Challenge 2024',
  style: {
    fontSize: '7.5px',
    color: '#FFFFFF',  // White
    margin: '6px',
    padding: '4px 8px',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    whiteSpace: 'pre'
  }
});

info.add(dataSource);
Map.add(info);

// ═══════════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════════

var composite = nightlightsMasked.visualize(lightPollutionVis)
  .blend(darkSkyRegions.visualize({palette: ['#00FF00']}))
  .blend(boundary.visualize({palette: ['#FFFFFF']}));

Export.image.toDrive({
  image: composite,
  description: 'Day28_Black_DarkSkies_Uzbekistan',
  scale: 500,
  region: uzbekistan,
  maxPixels: 1e13,
  fileFormat: 'GeoTIFF'
});

// ═══════════════════════════════════════════════════════════════
// STATISTICS
// ═══════════════════════════════════════════════════════════════

print('═══════════════════════════════════════════════════════');
print('DAY 28: BLACK - DARK SKIES OF UZBEKISTAN');
print('═══════════════════════════════════════════════════════');
print('Data: NASA Black Marble VIIRS DNB (2023)');
print('Theme: Light pollution vs. pristine dark skies');
print('═══════════════════════════════════════════════════════');

// Calculate dark sky statistics
var pristineArea = darkSkyClass1.multiply(ee.Image.pixelArea()).reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: uzbekistan,
  scale: 1000,
  maxPixels: 1e13
});

var ruralArea = darkSkyClass2.multiply(ee.Image.pixelArea()).reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: uzbekistan,
  scale: 1000,
  maxPixels: 1e13
});

var urbanArea = darkSkyClass4.multiply(ee.Image.pixelArea()).reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: uzbekistan,
  scale: 1000,
  maxPixels: 1e13
});

print('');
print('Dark Sky Statistics:');
print('Pristine dark (Class 1-2):', pristineArea);
print('Rural dark (Class 3-4):', ruralArea);
print('Urban light polluted:', urbanArea);
print('');
print('Key Dark Sky Regions:');
print('• Karakalpakstan: Aral Sea region, minimal population');
print('• Kyzylkum Desert: Central desert, exceptional darkness');
print('• Surkhandarya: Mountain regions, low light pollution');
print('• Maidanak Observatory: Professional-grade dark skies');
print('');
print('Astronomical Heritage:');
print('• Ulugh Beg Observatory (15th century) - Samarkand');
print('• Maidanak Observatory (1966-present) - Active research');
print('• 150+ clear nights per year');
print('• Emerging astrotourism destination');
print('═══════════════════════════════════════════════════════');