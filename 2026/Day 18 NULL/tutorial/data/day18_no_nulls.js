// Day 18: NULL. A satellite picture with no holes.
// #30DayMapChallenge Uzbekistan 2026 · Google Earth Engine Code Editor

// Tashkent and the Chimgan mountains, spring 2025
var area  = ee.Geometry.Rectangle([69.0, 41.0, 70.3, 41.8]);
var START = '2025-03-01';
var END   = '2025-06-01';
var MAX_CLOUD = 20;   // 👈 keep only images with less than this % of clouds

var trueColour = {bands: ['B4', 'B3', 'B2'], min: 0, max: 3000};

// 1. All Sentinel-2 images of the area in spring 2025, with a cloud score for every pixel
var csPlus = ee.ImageCollection('GOOGLE/CLOUD_SCORE_PLUS/V1/S2_HARMONIZED');
var all = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterBounds(area)
  .filterDate(START, END)
  .linkCollection(csPlus, ['cs_cdf']);
print('Images in spring 2025:', all.size());

// 2. Check: how cloudy is each image? One dot per image.
print(ui.Chart.feature.byFeature(all, 'system:time_start', 'CLOUDY_PIXEL_PERCENTAGE')
  .setChartType('ScatterChart')
  .setOptions({title: 'Clouds in each image, %', hAxis: {title: 'date'},
               vAxis: {title: 'clouds, %', viewWindow: {min: 0, max: 100}},
               pointSize: 4, legend: {position: 'none'}, colors: ['#e4572e']}));

// 3. Filter: keep only the images with few clouds
var fewClouds = all.filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', MAX_CLOUD));
print('Images with less than ' + MAX_CLOUD + '% clouds:', fewClouds.size());

// 4. Mask: remove the cloudy pixels that are left, with Cloud Score+
function removeClouds(img) {
  return img.updateMask(img.select('cs_cdf').gte(0.6));   // keep pixels that are at least 60% "clear"
}
var clear = fewClouds.map(removeClouds);

// One cloudy day, to see what removing clouds does
var CLOUDY_DAY = '2025-04-12';   // 👈 try another date from the chart
var day = ee.Date(CLOUDY_DAY);
var oneDay = all.filterDate(day, day.advance(1, 'day')).mosaic();   // all pieces photographed that day

// 5. One picture for the whole spring: for every pixel, the middle value of its clear photos
var spring = clear.median().clip(area);

// Check: on how many days of spring was each pixel clear?
// We use all the images here, with clouds removed, and join the pieces of each day into one picture.
var allClear = all.map(removeClouds);
var dates = all.aggregate_array('system:time_start')
  .map(function (t) { return ee.Date(t).format('YYYY-MM-dd'); }).distinct();
var clearDays = ee.ImageCollection(dates.map(function (d) {
  return allClear.filterDate(d, ee.Date(d).advance(1, 'day')).mosaic();
})).select('B4').count().clip(area);

// Check: how many NULL pixels are left in the spring picture? (counted in 100 m squares)
var nulls = spring.select('B4').mask().not().clip(area)
  .reduceRegion({reducer: ee.Reducer.sum(), geometry: area, scale: 100, maxPixels: 1e9});
print('NULL pixels in the spring picture:', nulls.get('B4'));

// 6. Radar: Sentinel-1 sends its own signal and sees through clouds, day and night
var s1 = ee.ImageCollection('COPERNICUS/S1_GRD')
  .filterBounds(area)
  .filter(ee.Filter.eq('instrumentMode', 'IW'))
  .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VH'))
  .select(['VV', 'VH']);
function radarColours(img) {
  return img.addBands(img.select('VV').subtract(img.select('VH')).rename('VVminusVH'));
}
var radar = {bands: ['VV', 'VH', 'VVminusVH'], min: [-20, -26, 2], max: [0, -8, 14]};
var radarNearDay = radarColours(s1.filterDate(day.advance(-3, 'day'), day.advance(3, 'day')).mosaic()).clip(area);   // radar 3 days around the cloudy day
var radarSpring  = radarColours(s1.filterDate(START, END).median()).clip(area);
print('Radar images in spring 2025:', s1.filterDate(START, END).size());

// The layers. Red underneath = NULL, no data.
Map.addLayer(ee.Image(1).clip(area), {palette: ['#ff0033']}, 'NULL shows red');
var layers = [
  ['1. One cloudy day',                    oneDay.clip(area),               trueColour],
  ['2. Clouds removed: NULL holes',        removeClouds(oneDay).clip(area), trueColour],
  ['3. Spring, clouds removed: no holes',  spring,                          trueColour],
  ['4. Clear days per pixel',             clearDays, {min: 10, max: 35, palette: ['#2d1e3e', '#3b528b', '#21918c', '#5ec962', '#fde725']}],
  ['5. Radar, around the cloudy day',      radarNearDay,                    radar],
  ['6. Radar, spring',                     radarSpring,                     radar]
];
layers.forEach(function (l, i) { Map.addLayer(l[1], l[2], l[0], i === 0); });

var names = layers.map(function (l) { return l[0]; });
var choose = ui.Select({
  items: names,
  value: names[0],
  onChange: function (name) {
    var chosen = names.indexOf(name);
    for (var i = 0; i < names.length; i++) {
      Map.layers().get(i + 1).setShown(i === chosen);
    }
  }
});
Map.add(ui.Panel([ui.Label('Day 18 · NULL'), choose], ui.Panel.Layout.flow('vertical'),
  {position: 'top-left', width: '290px'}));

Map.setOptions('SATELLITE');
Map.centerObject(area, 9);

// 7. A picture to download: the spring picture with no holes
spring.visualize(trueColour).getThumbURL({region: area, dimensions: 2000, format: 'jpg'}, function (url) {
  print('Download the picture with no holes:', ui.Label('Click here', {}, url));
});
