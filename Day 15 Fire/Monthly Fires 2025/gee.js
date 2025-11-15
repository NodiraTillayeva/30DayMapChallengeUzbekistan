// ================== SETTINGS FOR EXPORT ==================
var start = ee.Date('2025-01-01');
var end   = ee.Date('2025-12-01');   // end is exclusive
var minConf = 40;

// Area: Uzbekistan (reuse from earlier script)
var countries = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017');
var uzbekistan = countries
  .filter(ee.Filter.eq('country_na', 'Uzbekistan'))
  .geometry();

// FIRMS collection (same as before)
var firms = ee.ImageCollection('FIRMS')
  .filterDate(start, end)
  .filterBounds(uzbekistan);

// Keep useful bands and apply confidence mask
var filtered = firms.map(function(img) {
  var mask = img.select('confidence').gte(minConf);
  img = img.updateMask(mask)
           .select(['T21', 'confidence']);  // brightness temp + confidence

  // Add date as a property
  var dateStr = ee.Date(img.get('system:time_start')).format('YYYY-MM-dd');
  return img.set('date', dateStr);
});

// -------- Convert to points (FeatureCollection) --------
var pointsPerImage = filtered.map(function(img) {
  var dateStr = img.get('date');

  var samples = img.sample({
    region: uzbekistan,
    scale: 1000,         // FIRMS MODIS is 1 km
    geometries: true,    // create point geometry for each pixel
    factor: 1,           // sampling factor; >1 = subsample
    dropNulls: true
  });

  // Attach date property to each point
  samples = samples.map(function(f) {
    return f.set('date', dateStr);
  });

  return samples;
});

// Flatten ImageCollection<FeatureCollection> → FeatureCollection
var firePoints = ee.FeatureCollection(pointsPerImage).flatten();

// Optional: quick sanity check
print('Number of fire points:', firePoints.size());
Map.addLayer(firePoints.limit(2000), {color: 'red'}, 'Sample fire points');

// -------- EXPORT AS GEOJSON --------
Export.table.toDrive({
  collection: firePoints,
  description: 'FIRMS_Uzbekistan_Nov_2025',
  fileNamePrefix: 'firms_uzbekistan_2025_11',
  fileFormat: 'GeoJSON'
});
