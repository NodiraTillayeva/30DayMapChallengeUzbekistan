// Day 09: City or countryside? Similarity search with AlphaEarth satellite embeddings
// 1. Choose the year and the area
var year = 2024;
var area = ee.Geometry.Rectangle([68.95, 40.95, 69.75, 41.55]);   // Tashkent and its oasis

// 2. Load the satellite embeddings: 64 numbers for every 10 m pixel
var embeddings = ee.ImageCollection('GOOGLE/SATELLITE_EMBEDDING/V1/ANNUAL')
  .filterDate(year + '-01-01', (year + 1) + '-01-01')
  .filterBounds(area)
  .mosaic();

// 3. Two example places: one city, one countryside
var cityPoint = ee.Geometry.Point([69.2050, 41.2850]);   // apartment blocks in Chilonzor
var ruralPoint = ee.Geometry.Point([69.0600, 41.1800]);  // fields and a village south-west of the city

// 4. Similarity: compare every pixel's 64 numbers with the example's 64 numbers
function similarityTo(point) {
  var example = embeddings.reduceRegion({reducer: ee.Reducer.first(), geometry: point, scale: 10});
  var exampleImage = ee.Image.constant(embeddings.bandNames().map(function (b) { return example.get(b); }));
  return embeddings.multiply(exampleImage).reduce(ee.Reducer.sum());
}
var cityLike = similarityTo(cityPoint);
var ruralLike = similarityTo(ruralPoint);

// 5. Show the results
Map.setCenter(69.24, 41.29, 12);
Map.setOptions('SATELLITE');
var palette = ['000004', '3b0f70', '8c2981', 'de4968', 'fe9f6d', 'fcfdbf'];
Map.addLayer(ruralLike.clip(area), {min: 0.4, max: 1, palette: palette}, 'Similar to the countryside', false);
Map.addLayer(cityLike.clip(area), {min: 0.4, max: 1, palette: palette}, 'Similar to the city');
Map.addLayer(cityPoint, {color: 'cyan'}, 'City example');
Map.addLayer(ruralPoint, {color: 'lime'}, 'Countryside example');

// 6. City or countryside? Whichever example the pixel is more similar to
var urbanRural = cityLike.gt(ruralLike);
Map.addLayer(urbanRural.clip(area), {min: 0, max: 1, palette: ['7cb342', 'e53935']}, 'City (red) or countryside (green)', false);
print('Embedding bands:', embeddings.bandNames().length());

// 7. Your turn: click anywhere on the map to find places like it
Map.style().set('cursor', 'crosshair');
Map.onClick(function (coords) {
  var clicked = ee.Geometry.Point([coords.lon, coords.lat]);
  var layer = ui.Map.Layer(similarityTo(clicked).clip(area), {min: 0.4, max: 1, palette: palette}, 'Similar to the place you clicked');
  Map.layers().set(5, layer);
  Map.layers().set(6, ui.Map.Layer(clicked, {color: 'yellow'}, 'Your place'));
  print('You clicked:', coords.lon.toFixed(4), coords.lat.toFixed(4));
});
