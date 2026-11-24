// Day 19: Senses: Smell. Air you can smell, seen from space.
// #30DayMapChallenge Uzbekistan 2026 · Google Earth Engine Code Editor

var uzbekistan = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017')
  .filter(ee.Filter.eq('country_na', 'Uzbekistan'));
var YEAR = 2025;   // 👈 try 2019 to 2025

// 1. Sentinel-5P measures gases in the air, all over the Earth, every day.
//    NO2: the sharp smell of car exhaust and power plants.
//    SO2: the smell of a burnt match, from smelters and burned gas.
//    The numbers are tiny (mol per m²), so we multiply them by a million: µmol per m².
var no2 = ee.ImageCollection('COPERNICUS/S5P/OFFL/L3_NO2')
  .select(['tropospheric_NO2_column_number_density'], ['NO2'])
  .map(function (img) { return img.multiply(1e6).copyProperties(img, ['system:time_start']); });
var so2 = ee.ImageCollection('COPERNICUS/S5P/OFFL/L3_SO2')
  .select(['SO2_column_number_density'], ['SO2'])
  .map(function (img) { return img.multiply(1e6).copyProperties(img, ['system:time_start']); });

// 2. One winter day
var DAY = ee.Date('2025-01-14');   // 👈 try another day
var oneDay = no2.filterDate(DAY, DAY.advance(1, 'day')).mean();

// 3. The average of a whole year: day-to-day wind and clouds are averaged out
var no2Year = no2.filterDate(YEAR + '-01-01', (YEAR + 1) + '-01-01').mean();

// 4. Winter and summer
var winter = no2.filterDate((YEAR - 1) + '-12-01', YEAR + '-03-01').mean();
var summer = no2.filterDate(YEAR + '-06-01', YEAR + '-09-01').mean();

// 5. SO2 is weak and noisy, so we average three years
var so2Years = so2.filterDate((YEAR - 2) + '-01-01', (YEAR + 1) + '-01-01').mean();

// A "smell cloud": the stronger the smell, the darker the colour and the less you see through it
function smell(img, min, max, palette) {
  var strength = img.subtract(min).divide(max - min).clamp(0, 1);
  return img.visualize({min: min, max: max, palette: palette}).updateMask(strength.sqrt());
}
var exhaust = ['#f6e7a1', '#f0b84a', '#e0742d', '#b13a26', '#5e1a3a'];
var sulphur = ['#eef2a0', '#c8d24a', '#8fa82c', '#557a1d', '#26410e'];

var layers = [
  ['1. NO2, one winter day',  smell(oneDay, 40, 400, exhaust)],
  ['2. NO2, the whole year',  smell(no2Year, 25, 150, exhaust)],
  ['3. NO2, winter',          smell(winter, 25, 250, exhaust)],
  ['4. NO2, summer',          smell(summer, 25, 250, exhaust)],
  ['5. SO2, three years',     smell(so2Years, 150, 700, sulphur)]
];
layers.forEach(function (l, i) { Map.addLayer(l[1], {}, l[0], i === 1); });
Map.addLayer(ee.Image().paint(uzbekistan, 0, 1.5), {palette: ['#555555']}, 'Border');

// 6. Which places smell the most? The yearly NO2 around 13 places
function place(name, lon, lat) {
  return ee.Feature(ee.Geometry.Point([lon, lat]).buffer(7000), {name: name});
}
var places = ee.FeatureCollection([
  place('Tashkent', 69.28, 41.31),   place('Almalyk', 69.60, 40.84),  place('Angren', 70.14, 41.02),
  place('Andijan', 72.34, 40.78),    place('Namangan', 71.67, 41.00), place('Ferghana', 71.78, 40.38),
  place('Samarkand', 66.96, 39.65),  place('Bukhara', 64.42, 39.77),  place('Navoi', 65.38, 40.10),
  place('Karshi', 65.79, 38.86),     place('Termez', 67.28, 37.23),   place('Nukus', 59.61, 42.46),
  place('Kyzylkum desert', 63.5, 42.0)
]);
var placeNO2 = no2Year.reduceRegions({collection: places, reducer: ee.Reducer.mean(), scale: 2000})
  .sort('mean', false);
var bars = ui.Chart.feature.byFeature(placeNO2, 'name', 'mean').setChartType('BarChart')
  .setOptions({title: 'NO2 in ' + YEAR + ', µmol/m²', legend: {position: 'none'}, colors: ['#e0742d'],
               hAxis: {viewWindow: {min: 0}}, vAxis: {textStyle: {fontSize: 11}}});
bars.style().set('height', '380px');
print(bars);

// 7. Month by month: is the smell stronger in winter?
var months = ee.List.sequence(0, 35).map(function (i) {
  var start = ee.Date.fromYMD(YEAR - 2, 1, 1).advance(i, 'month');
  return no2.filterDate(start, start.advance(1, 'month')).mean().set('system:time_start', start.millis());
});
print(ui.Chart.image.seriesByRegion({
  imageCollection: ee.ImageCollection.fromImages(months),
  regions: places.filter(ee.Filter.inList('name', ['Tashkent', 'Samarkand', 'Kyzylkum desert'])),
  reducer: ee.Reducer.mean(), band: 'NO2', scale: 2000, seriesProperty: 'name'
}).setOptions({title: 'NO2 month by month, µmol/m²', colors: ['#5e1a3a', '#e0742d', '#c9b27c'], lineWidth: 2}));

// The panel: choose a layer, click the map to "smell" a place
var names = layers.map(function (l) { return l[0]; });
var choose = ui.Select({
  items: names, value: names[1],
  onChange: function (name) {
    for (var i = 0; i < names.length; i++) { Map.layers().get(i).setShown(names[i] === name); }
  }
});
var sniff = ui.Label('Click the map to smell a place');
Map.add(ui.Panel([ui.Label('Day 19 · Smell'), choose, sniff], ui.Panel.Layout.flow('vertical'),
  {position: 'top-left', width: '300px'}));

Map.onClick(function (c) {
  sniff.setValue('Smelling…');
  var here = ee.Geometry.Point([c.lon, c.lat]);
  var both = no2Year.addBands(so2Years).reduceRegion(ee.Reducer.mean(), here, 1000);
  both.evaluate(function (v) {
    sniff.setValue('NO2: ' + Math.round(v.NO2) + ' · SO2: ' + Math.round(v.SO2) + ' µmol/m²');
  });
});

Map.setOptions('Grey', {Grey: [
  {stylers: [{saturation: -100}, {lightness: 15}]},
  {featureType: 'poi', stylers: [{visibility: 'off'}]}
]});
Map.setCenter(65.5, 41.0, 6);

// 8. A picture to download: the yearly NO2 over Uzbekistan
layers[1][1].clip(uzbekistan).getThumbURL({region: uzbekistan.geometry().bounds(), dimensions: 1600, format: 'png'},
  function (url) { print('Download the NO2 map:', ui.Label('Click here', {}, url)); });
