// Load Alpha Earth Embeddings collection
var dataset = ee.ImageCollection('GOOGLE/SATELLITE_EMBEDDING/V1/ANNUAL');

// Define Tashkent city area using multiple boundary sources
var tashkent = ee.Geometry.Rectangle([
  69.1394, 41.2210,  // Southwest coordinates
  69.3994, 41.3810   // Northeast coordinates
]);

// Load Tashkent administrative boundaries from FAO GAUL dataset
var countries = ee.FeatureCollection('FAO/GAUL/2015/level2');
var tashkentBoundary = countries.filter(ee.Filter.eq('ADM2_NAME', 'Tashkent'));

// Alternative: Use GADM dataset for Uzbekistan administrative boundaries
var gadm = ee.FeatureCollection('WWF/HydroSHEDS/v1/BasinDirections');
var uzbekistan = ee.FeatureCollection('FAO/GAUL/2015/level0')
  .filter(ee.Filter.eq('ADM0_NAME', 'Uzbekistan'));
var tashkentAdmin = countries
  .filterBounds(uzbekistan)
  .filter(ee.Filter.eq('ADM1_NAME', 'Tashkent'));

// Get embedding images for two years to compare vegetation changes
var image2023 = dataset
    .filterDate('2017-01-01', '2018-01-01')
    .filterBounds(tashkent)
    .first();

var image2024 = dataset
    .filterDate('2024-01-01', '2025-01-01')
    .filterBounds(tashkent)
    .first();

// Check if images are available
print('2023 image:', image2023);
print('2024 image:', image2024);

// Visualize embeddings - using bands that might capture vegetation patterns
var visParams = {
    min: -0.3, 
    max: 0.3, 
    bands: ['A01', 'A16', 'A09']  // Experiment with different band combinations
};

Map.addLayer(image2023, visParams, '2023 embeddings');
Map.addLayer(image2024, visParams, '2024 embeddings');

// Calculate similarity between years using dot product
var similarity = image2023
    .multiply(image2024)
    .reduce(ee.Reducer.sum());

// Calculate magnitude of change (Euclidean distance between embedding vectors)
var diff = image2023.subtract(image2024);
var magnitudeChange = diff.multiply(diff)
    .reduce(ee.Reducer.sum())
    .sqrt();

// FIXED: Normalize change magnitude using reduceRegion to get max value
var maxChangeValue = magnitudeChange.reduceRegion({
  reducer: ee.Reducer.max(),
  geometry: tashkent,
  scale: 100,
  maxPixels: 1e9
}).get('sum');

var normalizedChange = magnitudeChange.divide(ee.Image.constant(maxChangeValue));

// Create vegetation change analysis
var vegetationLoss = similarity.lt(0.6);  // Low similarity indicates change
var vegetationGain = similarity.gt(0.8);  // High similarity might indicate stability/growth

// Method: Use specific embedding dimensions for vegetation analysis
// Let's analyze multiple band combinations to find vegetation patterns
var bandCombinations = [
    ['A01', 'A02', 'A03'],  // Low frequency patterns
    ['A08', 'A09', 'A10'],  // Mid frequency patterns  
    ['A14', 'A15', 'A16']   // High frequency patterns
];

// Calculate vegetation change using different band combinations
for (var i = 0; i < bandCombinations.length; i++) {
    var bands = bandCombinations[i];
    var veg2023 = image2023.select(bands).reduce(ee.Reducer.mean());
    var veg2024 = image2024.select(bands).reduce(ee.Reducer.mean());
    var vegChange = veg2024.subtract(veg2023);
    
    Map.addLayer(
        vegChange,
        {min: -0.05, max: 0.05, palette: ['FF0000', 'FFFFFF', '00FF00']},
        'Vegetation Change Bands ' + bands.join(',')
    );
}

// Add main layers to the map
Map.addLayer(
    similarity,
    {min: 0, max: 1, palette: ['red', 'yellow', 'green']},
    'Similarity (Red=Low, Green=High)'
);

Map.addLayer(
    normalizedChange,
    {min: 0, max: 1, palette: ['blue', 'white', 'red']},
    'Change Magnitude (Blue=No change, Red=High change)'
);

Map.addLayer(
    vegetationLoss,
    {min: 0, max: 1, palette: ['000000', 'FF0000']},
    'Potential Vegetation Loss Areas'
);

Map.addLayer(
    vegetationGain,
    {min: 0, max: 1, palette: ['000000', '00FF00']},
    'Potential Vegetation Gain/Stable Areas'
);

// Add Tashkent boundaries with different styles
Map.addLayer(tashkentBoundary, 
  {color: 'yellow', fillColor: '00000000'}, 
  'Tashkent City Boundary (GAUL)'
);

Map.addLayer(tashkentAdmin, 
  {color: 'black', fillColor: '00000000'}, 
  'Tashkent Region Boundary'
);

Map.addLayer(tashkent, 
  {color: 'red', fillColor: '00000000'}, 
  'Custom Tashkent Rectangle'
);

// Calculate statistics for the region using the actual boundary
var stats = similarity.reduceRegion({
    reducer: ee.Reducer.mean().combine({
        reducer2: ee.Reducer.stdDev(),
        sharedInputs: true
    }),
    geometry: tashkentBoundary,
    scale: 100,
    maxPixels: 1e9
});

print('Similarity Statistics for Tashkent:', stats);

// Calculate area of vegetation loss and gain using the actual boundary
var areaLoss = vegetationLoss.multiply(ee.Image.pixelArea()).reduceRegion({
    reducer: ee.Reducer.sum(),
    geometry: tashkentBoundary,
    scale: 100,
    maxPixels: 1e9
});

var areaGain = vegetationGain.multiply(ee.Image.pixelArea()).reduceRegion({
    reducer: ee.Reducer.sum(),
    geometry: tashkentBoundary,
    scale: 100,
    maxPixels: 1e9
});

print('Area of potential vegetation loss (sq meters):', areaLoss);
print('Area of potential vegetation gain (sq meters):', areaGain);

// Print boundary information
print('Tashkent City Boundary:', tashkentBoundary);
print('Tashkent Region Boundary:', tashkentAdmin);

// Export results if needed
Export.image.toDrive({
    image: similarity,
    description: 'Tashkent_Embedding_Similarity_2023_2024',
    scale: 10,
    region: tashkentBoundary,
    maxPixels: 1e9
});

// Center map on Tashkent boundary
Map.centerObject(tashkentBoundary, 10);
Map.setOptions('SATELLITE');
