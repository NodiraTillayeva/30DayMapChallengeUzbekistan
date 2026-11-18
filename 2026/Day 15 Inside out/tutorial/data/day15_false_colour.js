// Day 15: Inside out. Uzbekistan in colours your eyes can't see.
// #30DayMapChallenge Uzbekistan 2026 · Google Earth Engine Code Editor

// 1. Sentinel-2 images from July and August 2025, with clouds removed
var csPlus = ee.ImageCollection('GOOGLE/CLOUD_SCORE_PLUS/V1/S2_HARMONIZED');
var uzbekistan = ee.Geometry.Rectangle([55.9, 37.1, 73.2, 45.6]);
var s2 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterBounds(uzbekistan)
  .filterDate('2025-07-01', '2025-09-01')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 10))    // skip cloudy images
  .linkCollection(csPlus, ['cs_cdf'])
  .map(function (img) {
    return img.updateMask(img.select('cs_cdf').gte(0.6))   // keep only clear pixels
              .select(['B2', 'B3', 'B4', 'B8', 'B11', 'B12']);   // only the bands we use
  });

// One picture: for every pixel, the middle value of the whole summer
var summer = s2.median();

// 2. Five ways to look at the same place
var trueColour   = {bands: ['B4', 'B3', 'B2'],  min: 0, max: 3000};   // red, green, blue: what your eyes see
var infrared     = {bands: ['B8', 'B4', 'B3'],  min: 0, max: 4000};   // near-infrared as red: plants glow red
var agriculture  = {bands: ['B11', 'B8', 'B2'], min: 0, max: 4500};   // short-wave infrared: fields bright green
var saltAndWater = {bands: ['B12', 'B11', 'B4'], min: 0, max: 5000};  // salt and dry soil bright, water black

// The "negative": every colour turned inside out
var negative = ee.Image(3000).subtract(summer.select(['B4', 'B3', 'B2']));

Map.addLayer(summer, trueColour, '1. True colour', false);
Map.addLayer(summer, infrared, '2. Infrared: plants are red');
Map.addLayer(summer, agriculture, '3. Agriculture', false);
Map.addLayer(summer, saltAndWater, '4. Salt and water', false);
Map.addLayer(negative, {min: 0, max: 3000}, '5. Negative', false);

// 3. Places to visit
var places = {
  'Ferghana Valley':        [71.60, 40.60, 10],
  'Tashkent':               [69.27, 41.31, 11],
  'Samarkand':              [66.96, 39.65, 11],
  'Bukhara oasis':          [64.42, 39.77, 11],
  'Aydarkul lake':          [66.95, 40.85, 10],
  'Amu Darya near Nukus':   [59.70, 42.55, 10]
};

var select = ui.Select({
  items: Object.keys(places),
  placeholder: 'Fly to…',
  onChange: function (name) {
    var p = places[name];
    Map.setCenter(p[0], p[1], p[2]);
  }
});
// Switch between the five colour layers
var layerNames = ['1. True colour', '2. Infrared: plants are red', '3. Agriculture',
                  '4. Salt and water', '5. Negative'];
var colours = ui.Select({
  items: layerNames,
  value: '2. Infrared: plants are red',
  onChange: function (name) {
    var chosen = layerNames.indexOf(name);
    for (var i = 0; i < layerNames.length; i++) {
      Map.layers().get(i).setShown(i === chosen);
    }
  }
});

Map.add(ui.Panel([ui.Label('Day 15 · Inside out'), select, colours], ui.Panel.Layout.flow('vertical'),
  {position: 'top-left', width: '250px'}));

Map.setOptions('SATELLITE');
Map.setCenter(71.60, 40.60, 10);   // start in the Ferghana Valley

// 4. A picture to download: the view below, in the "infrared" colours
var box = ee.Geometry.Rectangle([70.9, 40.25, 72.3, 40.95]);
summer.visualize(infrared).getThumbURL({region: box, dimensions: 2000, format: 'jpg'}, function (url) {
  print('Download the Ferghana Valley in infrared:', ui.Label('Click here', {}, url));
});
