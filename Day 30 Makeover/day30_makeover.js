// ========================================
// ARAL SEA MAKEOVER MAP - ENHANCED (v4)
// Day 30: Professional Visualization
// 1984–2024 Analysis with Cloud Masking
// ========================================

// Study region
var aral = ee.Geometry.Polygon([
  [[58.0, 43.0], [62.5, 43.0], [62.5, 46.5], [58.0, 46.5]]
]);
Map.centerObject(aral, 7);

// ---------------------------
// 1. CLOUD MASKING FUNCTIONS
// ---------------------------
// This fixes the 1984 tiling issue!
function maskL8sr(image) {
  var qaMask = image.select('QA_PIXEL').bitwiseAnd(parseInt('11111', 2)).eq(0);
  var saturationMask = image.select('QA_RADSAT').eq(0);
  return image.updateMask(qaMask).updateMask(saturationMask);
}

function maskL57sr(image) {
  var qaMask = image.select('QA_PIXEL').bitwiseAnd(parseInt('11111', 2)).eq(0);
  var saturationMask = image.select('QA_RADSAT').eq(0);
  return image.updateMask(qaMask).updateMask(saturationMask);
}

// ---------------------------
// 2. SCALE FACTORS
// ---------------------------
function scaleLandsat(img) {
  var optical = img.select('SR_B.*').multiply(0.0000275).add(-0.2);
  return img.addBands(optical, null, true);
}

// ---------------------------
// 3. ENHANCED COMPOSITE FUNCTION
//    3-year median for smooth, seamless imagery!
// ---------------------------
function getCompositeRaw(year) {
  var collection_id, bands_in, maskFunction;
  
  var l8_bands_in = ['SR_B2', 'SR_B3', 'SR_B4', 'SR_B5', 'SR_B6'];
  var l57_bands_in = ['SR_B1', 'SR_B2', 'SR_B3', 'SR_B4', 'SR_B5'];
  var out_bands = ['Blue', 'Green', 'Red', 'NIR', 'SWIR1'];

  if (year < 1999) {
    collection_id = "LANDSAT/LT05/C02/T1_L2";
    bands_in = l57_bands_in;
    maskFunction = maskL57sr;
  } 
  else if (year < 2013) {
    collection_id = "LANDSAT/LE07/C02/T1_L2";
    bands_in = l57_bands_in;
    maskFunction = maskL57sr;
  } 
  else {
    collection_id = "LANDSAT/LC08/C02/T1_L2";
    bands_in = l8_bands_in;
    maskFunction = maskL8sr;
  }
  
  // 3-YEAR MEDIAN WINDOW for smooth composites
  // This averages out tile boundaries and cloud artifacts
  var collection = ee.ImageCollection(collection_id)
      .filterBounds(aral)
      .filterDate((year-1) + '-04-01', (year+2) + '-10-31')  // 3-year window
      .map(maskFunction);

  var scaled_collection = collection.map(scaleLandsat);

  // MEDIAN composite smooths everything beautifully
  var composite = scaled_collection
      .select(bands_in, out_bands)
      .median()  // 3-year median = smooth!
      .clip(aral);
      
  return composite.set("system:time_start", ee.Date.fromYMD(year, 7, 1).millis());
}

// ---------------------------
// 4. ENHANCED VISUALIZATION
// ---------------------------
function visualizeComposite(rawImg) {
  return rawImg.visualize({
    bands: ['Red', 'Green', 'Blue'],
    min: [0.0, 0.0, 0.0],
    max: [0.25, 0.28, 0.32],  // Adjusted for natural blue water
    gamma: [0.95, 1.05, 1.3]   // Reduced red, enhanced blue for cleaner water
  });
}

// Alternative: Enhanced water visualization (even more vibrant)
function visualizeWaterEnhanced(rawImg) {
  return rawImg.visualize({
    bands: ['Red', 'Green', 'Blue'],
    min: [0.02, 0.02, 0.02],
    max: [0.22, 0.26, 0.35],  // Blue channel boosted for teal effect
    gamma: [0.9, 1.0, 1.4]    // Strong blue enhancement, suppress yellow
  });
}

// NDWI Visualization for water detection
function visualizeNDWI(rawImg) {
  var ndwi = rawImg.normalizedDifference(['Green', 'SWIR1']);
  return ndwi.visualize({
    min: -0.3,
    max: 0.5,
    palette: ['8B4513', 'F4E7D7', 'FFE6A8', 'A8D8EA', '0EA5E9', '0369A1']
    // Brown -> Beige -> Yellow -> Light Blue -> Blue -> Deep Blue
  });
}

// ---------------------------
// 5. MAKEOVER PALETTE
// ---------------------------
var paletteLost = ['#FF6B6B'];      // Vibrant coral-red
var palettePersist = ['#0EA5E9'];   // Sky blue
var paletteGained = ['#10B981'];    // Emerald (if any regrowth)

// ---------------------------
// 6. WATER DETECTION (NDWI)
// ---------------------------
function getWaterMask(rawImg, threshold) {
  threshold = threshold || 0.15;
  var ndwi = rawImg.normalizedDifference(['Green', 'SWIR1']);
  return ndwi.gt(threshold);
}

function calculateWaterArea(rawImg) {
  var waterMask = getWaterMask(rawImg).selfMask();
  var area = waterMask.multiply(ee.Image.pixelArea())
    .reduceRegion({
      reducer: ee.Reducer.sum(),
      geometry: aral,
      scale: 30,
      maxPixels: 1e10,
      bestEffort: true
    });
  var area_sqkm = ee.Number(area.get('nd')).divide(1e6);
  return rawImg.set('area_sqkm', area_sqkm);
}

// ---------------------------
// 7. GENERATE 1984 & 2024
// ---------------------------
var c1984_raw = getCompositeRaw(1984);
var c2024_raw = getCompositeRaw(2024);

var water1984 = getWaterMask(c1984_raw);
var water2024 = getWaterMask(c2024_raw);

// Change detection
var lost = water1984.and(water2024.not());
var persist = water1984.and(water2024);
var gained = water2024.and(water1984.not());

// ---------------------------
// 8. PROFESSIONAL MAP LAYERS
// ---------------------------
// Clear default layers
Map.layers().reset();

// Add base RGB composites with natural blue water tones
Map.addLayer(visualizeComposite(c1984_raw), {}, "📅 1984 True Color (Natural)", true);
Map.addLayer(visualizeComposite(c2024_raw), {}, "📅 2024 True Color (Natural)", true);

// Add NDWI visualization layers
Map.addLayer(visualizeNDWI(c1984_raw), {}, "💧 1984 NDWI (Water Index)", false);
Map.addLayer(visualizeNDWI(c2024_raw), {}, "💧 2024 NDWI (Water Index)", false);

// Add water mask overlays
var water1984_viz = getWaterMask(c1984_raw).selfMask().visualize({palette: ['0EA5E9']});
var water2024_viz = getWaterMask(c2024_raw).selfMask().visualize({palette: ['0EA5E9']});

Map.addLayer(water1984_viz, {}, "🌊 1984 Water Mask (NDWI > 0.15)", false);
Map.addLayer(water2024_viz, {}, "🌊 2024 Water Mask (NDWI > 0.15)", false);

// Add enhanced water visualization (optional - for even more vivid teal)
Map.addLayer(visualizeWaterEnhanced(c1984_raw), {}, "✨ 1984 Enhanced Water Colors", false);
Map.addLayer(visualizeWaterEnhanced(c2024_raw), {}, "✨ 2024 Enhanced Water Colors", false);

// Add change detection layers (turn off by default to show natural colors)
Map.addLayer(
  persist.selfMask(),
  {palette: palettePersist},
  "💧 Persistent Water (Overlay)", false
);

Map.addLayer(
  lost.selfMask(),
  {palette: paletteLost},
  "🔴 Lost Water 1984→2024 (Overlay)", false
);

Map.addLayer(
  gained.selfMask(),
  {palette: paletteGained},
  "🌱 Regained Water (Overlay)", false
);

// ---------------------------
// 9. CALCULATE AREAS
// ---------------------------
var area1984 = calculateWaterArea(c1984_raw).get('area_sqkm');
var area2024 = calculateWaterArea(c2024_raw).get('area_sqkm');

area1984.evaluate(function(val1984) {
  area2024.evaluate(function(val2024) {
    var loss = val1984 - val2024;
    var lossPercent = (loss / val1984 * 100).toFixed(1);
    
    print('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    print('🌊 ARAL SEA WATER SURFACE AREA ANALYSIS');
    print('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    print('📊 1984: ' + val1984.toFixed(2) + ' km²');
    print('📊 2024: ' + val2024.toFixed(2) + ' km²');
    print('📉 Loss: ' + loss.toFixed(2) + ' km² (' + lossPercent + '%)');
    print('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  });
});

// ---------------------------
// 10. TIME SERIES (1984-2024)
// ---------------------------
var allYears_js = [];
for (var y = 1984; y <= 2024; y++) {
  allYears_js.push(y);
}

var rawTimeSeries = ee.ImageCollection(allYears_js.map(getCompositeRaw));
var areaTimeSeries = rawTimeSeries.map(calculateWaterArea);

// ---------------------------
// 11. PROFESSIONAL AREA CHART
// ---------------------------
var areaChart = ui.Chart.feature.byFeature(areaTimeSeries, 'system:time_start', 'area_sqkm')
  .setChartType('AreaChart')
  .setOptions({
    title: 'Aral Sea Water Surface Area (1984-2024)',
    vAxis: {
      title: 'Surface Area (km²)',
      titleTextStyle: {fontSize: 14, bold: true},
      gridlines: {color: '#e0e0e0'},
      minorGridlines: {count: 0}
    },
    hAxis: {
      title: 'Year',
      format: 'yyyy',
      titleTextStyle: {fontSize: 14, bold: true},
      gridlines: {color: '#e0e0e0'}
    },
    legend: {position: 'none'},
    series: {
      0: {
        color: '#0EA5E9',
        areaOpacity: 0.2,
        lineWidth: 3
      }
    },
    chartArea: {width: '80%', height: '70%'},
    pointSize: 5,
    pointShape: 'circle',
    backgroundColor: '#f8f9fa',
    titleTextStyle: {fontSize: 16, bold: true}
  });

print(areaChart);

// ---------------------------
// 12. TIMELAPSE EXPORTS (Video + GIF)
// ---------------------------
var rgbTimeSeries = rawTimeSeries.map(visualizeComposite);

// Add text overlay for each year
var textTimeSeries = rgbTimeSeries.map(function(img) {
  var year = ee.Date(img.get('system:time_start')).format('YYYY');
  var text = ee.Image().paint(
    ee.FeatureCollection([ee.Feature(aral.centroid(100), {label: year})]),
    0, 2
  );
  return img.blend(text.visualize({palette: ['white'], forceRgbOutput: true}));
});

print('🎬 Timelapse Collection Ready:', rgbTimeSeries.size());

// ============================================
// EXPORT #1: MP4 VIDEO (High Quality)
// ============================================
Export.video.toDrive({
  collection: rgbTimeSeries,
  description: 'Aral_Sea_Video_1984_2024',
  fileNamePrefix: 'aral_sea_timelapse_video',
  framesPerSecond: 2,
  scale: 300,
  region: aral,
  crs: 'EPSG:3857',
  maxFrames: 1000
});

// ============================================
// EXPORT #2: ANIMATED GIF (Web-friendly)
// ============================================
// GIF export requires lower resolution for file size
Export.video.toDrive({
  collection: rgbTimeSeries,
  description: 'Aral_Sea_GIF_1984_2024',
  fileNamePrefix: 'aral_sea_timelapse_gif',
  framesPerSecond: 2,
  scale: 500,  // Lower resolution for GIF
  region: aral,
  crs: 'EPSG:3857',
  maxFrames: 1000
});

// ============================================
// EXPORT #3: NDWI WATER EXTENT TIMELAPSE (GIF)
// ============================================
var ndwiTimeSeries = rawTimeSeries.map(function(img) {
  var waterMask = getWaterMask(img).selfMask();
  return waterMask.visualize({
    palette: ['0EA5E9'],
    min: 0,
    max: 1
  });
});

Export.video.toDrive({
  collection: ndwiTimeSeries,
  description: 'Aral_Sea_NDWI_Water_Extent_GIF',
  fileNamePrefix: 'aral_water_extent_ndwi',
  framesPerSecond: 3,
  scale: 400,
  region: aral,
  crs: 'EPSG:3857',
  maxFrames: 1000
});

print('📤 Export Tasks Ready:');
print('  ✅ Video (MP4) - scale 300m');
print('  ✅ GIF - scale 500m'); 
print('  ✅ NDWI Water Extent GIF - scale 400m');
print('  👉 Go to Tasks tab and click RUN on each export!');

// ---------------------------
// 13. LEGEND
// ---------------------------
var legend = ui.Panel({
  style: {
    position: 'bottom-left',
    padding: '8px 15px',
    backgroundColor: 'white'
  }
});

var legendTitle = ui.Label({
  value: '🗺️ Change Detection Layers',
  style: {
    fontWeight: 'bold',
    fontSize: '16px',
    margin: '0 0 4px 0'
  }
});

legend.add(legendTitle);

var subtitle = ui.Label({
  value: '(Toggle these overlays on/off)',
  style: {
    fontSize: '11px',
    color: '#666',
    margin: '0 0 8px 0'
  }
});

legend.add(subtitle);

var makeRow = function(color, name) {
  var colorBox = ui.Label({
    style: {
      backgroundColor: color,
      padding: '10px',
      margin: '0 8px 0 0'
    }
  });
  var description = ui.Label({
    value: name,
    style: {margin: '2px 0'}
  });
  return ui.Panel({
    widgets: [colorBox, description],
    layout: ui.Panel.Layout.Flow('horizontal')
  });
};

legend.add(makeRow('#0EA5E9', 'Persistent Water'));
legend.add(makeRow('#FF6B6B', 'Lost Water'));
legend.add(makeRow('#10B981', 'Regained Water'));

// Add NDWI color scale
var ndwiLabel = ui.Label({
  value: 'NDWI Water Index:',
  style: {
    fontWeight: 'bold',
    fontSize: '12px',
    margin: '8px 0 4px 0'
  }
});
legend.add(ndwiLabel);

var ndwiScale = ui.Panel({
  style: {
    margin: '0 0 4px 0'
  }
});

var ndwiColors = ['8B4513', 'F4E7D7', 'A8D8EA', '0EA5E9'];
var ndwiLabels = ['Dry Land', 'Exposed Bed', 'Shallow', 'Deep Water'];

for (var i = 0; i < ndwiColors.length; i++) {
  ndwiScale.add(makeRow('#' + ndwiColors[i], ndwiLabels[i]));
}

Map.add(legend);

print('✅ Makeover Complete! 3-year median composites = smooth, tile-free imagery!');
print('💡 Yellow areas = exposed salt flats (former lakebed)');
print('💧 Toggle NDWI layers to see water detection visualization'); 