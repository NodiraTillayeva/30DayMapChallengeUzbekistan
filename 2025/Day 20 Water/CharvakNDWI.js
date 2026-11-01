// =========================================================================
// SIMPLE CHARVAK RESERVOIR WATER LEVEL MONITOR
// =========================================================================

// CHARVAK RESERVOIR BOUNDING BOX (covers entire reservoir ~37 km²)
// Expanded to cover the full extent of the reservoir
var charvak = ee.Geometry.Rectangle([69.90, 41.55, 70.18, 41.72]);

Map.centerObject(charvak, 12);
Map.addLayer(charvak, {color: 'yellow'}, 'Charvak Area', false);

print('=== CHARVAK RESERVOIR MONITOR ===');

// =========================================
// SIMPLE WATER DETECTION FUNCTION
// =========================================
function getWaterArea(year) {
  // Get Sentinel-2 imagery for summer
  var s2 = ee.ImageCollection('COPERNICUS/S2_HARMONIZED')
    .filterBounds(charvak)
    .filterDate(year + '-06-01', year + '-08-31')
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 30))
    .median();
  
  // Simple water index (NDWI)
  var ndwi = s2.normalizedDifference(['B3', 'B8']);
  
  // Water mask (NDWI > 0.2 = water)
  var water = ndwi.gt(0.2);
  
  // Calculate area in km²
  var area = water.multiply(ee.Image.pixelArea()).divide(1000000);
  var waterArea = area.reduceRegion({
    reducer: ee.Reducer.sum(),
    geometry: charvak,
    scale: 30,
    maxPixels: 1e10
  }).get('nd');
  
  return ee.Feature(null, {
    'year': year,
    'water_km2': waterArea
  });
}

// =========================================
// ANALYZE 2017-2024
// =========================================
print('Calculating water area for each year...');

var years = [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];
var results = years.map(function(year) {
  return getWaterArea(year);
});

var timeSeries = ee.FeatureCollection(results);

// =========================================
// CREATE CHART
// =========================================
var chart = ui.Chart.feature.byFeature(timeSeries, 'year', 'water_km2')
  .setChartType('LineChart')
  .setOptions({
    title: 'Charvak Reservoir Water Area (2017-2024)',
    vAxis: {title: 'Water Area (km²)'},
    hAxis: {title: 'Year'},
    lineWidth: 3,
    pointSize: 6,
    series: {0: {color: '#2196F3'}}
  });

// Chart will be shown on map instead of console
print('Water area by year:', timeSeries);

// =========================================
// SHOW WATER EXTENT MAPS
// =========================================

// 2017 water
var s2_2017 = ee.ImageCollection('COPERNICUS/S2_HARMONIZED')
  .filterBounds(charvak)
  .filterDate('2017-06-01', '2017-08-31')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 30))
  .median();
var water2017 = s2_2017.normalizedDifference(['B3', 'B8']).gt(0.2);

// 2024 water
var s2_2024 = ee.ImageCollection('COPERNICUS/S2_HARMONIZED')
  .filterBounds(charvak)
  .filterDate('2024-06-01', '2024-08-31')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 30))
  .median();
var water2024 = s2_2024.normalizedDifference(['B3', 'B8']).gt(0.2);

// Show RGB
Map.addLayer(s2_2024, {bands: ['B4', 'B3', 'B2'], min: 0, max: 3000}, 'RGB 2024', false);

// Show water
Map.addLayer(water2017.selfMask(), {palette: ['blue']}, 'Water 2017', false);
Map.addLayer(water2024.selfMask(), {palette: ['cyan']}, 'Water 2024', false);

// FIXED: Better change detection visualization
var waterLoss = water2017.and(water2024.not()); // Water in 2017 but not 2024
var waterGain = water2024.and(water2017.not()); // Water in 2024 but not 2017

// Create a 3-class change image: 1=Loss, 2=Stable, 3=Gain
var waterChange = ee.Image(0)
  .where(waterLoss, 1)    // Loss = 1
  .where(water2017.and(water2024), 2)  // Stable water = 2
  .where(waterGain, 3);   // Gain = 3

Map.addLayer(waterChange.selfMask(), {
  min: 1,
  max: 3,
  palette: ['red', 'blue', 'green']
}, 'Water Change (Red=Loss, Blue=Stable, Green=Gain)', true);

// =========================================
// CALCULATE CHANGE STATISTICS
// =========================================
var lossArea = waterLoss.multiply(ee.Image.pixelArea()).divide(1000000)
  .reduceRegion({reducer: ee.Reducer.sum(), geometry: charvak, scale: 30, maxPixels: 1e10})
  .get('constant');

var gainArea = waterGain.multiply(ee.Image.pixelArea()).divide(1000000)
  .reduceRegion({reducer: ee.Reducer.sum(), geometry: charvak, scale: 30, maxPixels: 1e10})
  .get('constant');

// =========================================
// SUMMARY
// =========================================
print('');
print('=== SUMMARY ===');
print('Water Change Statistics (2017 vs 2024):');
print('Water loss area (km²):', lossArea);
print('Water gain area (km²):', gainArea);
print('');
print('✅ Red = Water lost between 2017-2024');
print('✅ Blue = Stable water (both years)'); 
print('✅ Green = Water gained between 2017-2024');
print('✅ Chart shows trend over all years');

// =========================================
// EXPORT
// =========================================
Export.table.toDrive({
  collection: timeSeries,
  description: 'Charvak_Simple_TimeSeries',
  fileFormat: 'CSV'
});

print('');
print('📥 Export available in Tasks tab');

// =========================================
// SIMPLE UI ADDITIONS
// =========================================

// Title
var title = ui.Label({
  value: '💧 Charvak Reservoir Monitor (2017-2024)',
  style: {
    fontSize: '20px',
    fontWeight: 'bold',
    padding: '10px',
    backgroundColor: 'white',
    border: '2px solid #2196F3'
  }
});
Map.add(ui.Panel([title], null, {position: 'top-center'}));

// Legend
var legend = ui.Panel({style: {position: 'bottom-left', padding: '8px', backgroundColor: 'white'}});
legend.add(ui.Label({value: '🗺️ Legend', style: {fontWeight: 'bold', margin: '0 0 4px 0'}}));

function addLegendItem(color, label) {
  var colorBox = ui.Label({style: {backgroundColor: color, padding: '8px', margin: '0 8px 0 0'}});
  var desc = ui.Label({value: label, style: {margin: '0'}});
  legend.add(ui.Panel([colorBox, desc], ui.Panel.Layout.Flow('horizontal'), {margin: '2px 0'}));
}

addLegendItem('red', 'Water Loss');
addLegendItem('blue', 'Stable Water');
addLegendItem('green', 'Water Gain');
Map.add(legend);

// Chart on map
var chartPanel = ui.Panel({style: {position: 'top-right', width: '350px', backgroundColor: 'white', padding: '8px'}});
chartPanel.add(chart);
Map.add(chartPanel);
