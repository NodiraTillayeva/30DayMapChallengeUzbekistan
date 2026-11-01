// ==========================================
// RURAL SETTLEMENT PATTERNS - UZBEKISTAN
// Spatial Analysis Application
// ==========================================

// ==========================================
// GLOBAL STATE
// ==========================================

let map;
let settlementData = null;
let boundaryData = null; // Khorezm region boundary polygon
let analysisResults = {};

// Study region - Khorezm (includes Khiva)
const khivaRegion = {
    name: 'Khorezm Region',
    // Full region bounds (for display only)
    fullBounds: [[60.059, 40.518], [62.447, 42.006]],
    // Very small data collection bounds (just around Khiva city to avoid timeout)
    dataBounds: [[60.3, 41.3], [60.7, 41.5]], // ~44km x 22km - very focused
    center: [60.5, 41.4], // Khiva center
    zoom: 9,
    boundaryFile: 'khiva_boundary.geojson'
};

// ==========================================
// INITIALIZE MAP
// ==========================================

function initMap() {
    map = new maplibregl.Map({
        container: 'map',
        style: {
            version: 8,
            sources: {
                'osm-tiles': {
                    type: 'raster',
                    tiles: [
                        'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
                        'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
                        'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
                    ],
                    tileSize: 256,
                    attribution: '© OpenStreetMap contributors'
                }
            },
            layers: [
                {
                    id: 'osm-tiles-layer',
                    type: 'raster',
                    source: 'osm-tiles',
                    minzoom: 0,
                    maxzoom: 19,
                    paint: {
                        'raster-opacity': 0.6
                    }
                }
            ]
        },
        center: khivaRegion.center,
        zoom: khivaRegion.zoom
    });

    map.on('load', () => {
        console.log('Map initialized');
        setupLayers();
    });
}

// ==========================================
// SETUP MAP LAYERS
// ==========================================

function setupLayers() {
    // Add empty sources that will be populated with data
    map.addSource('boundary', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] }
    });

    map.addSource('settlements', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] }
    });

    // Boundary fill layer
    map.addLayer({
        id: 'boundary-fill',
        type: 'fill',
        source: 'boundary',
        paint: {
            'fill-color': '#1e293b',
            'fill-opacity': 0.2
        },
        layout: {
            'visibility': 'visible'
        }
    });

    // Boundary outline layer
    map.addLayer({
        id: 'boundary-outline',
        type: 'line',
        source: 'boundary',
        paint: {
            'line-color': '#fbbf24',
            'line-width': 3,
            'line-opacity': 0.9
        },
        layout: {
            'visibility': 'visible'
        }
    });

    // Settlements layer
    map.addLayer({
        id: 'settlements-layer',
        type: 'circle',
        source: 'settlements',
        paint: {
            'circle-radius': 5,
            'circle-color': '#ef4444',
            'circle-stroke-width': 1,
            'circle-stroke-color': '#ffffff',
            'circle-opacity': 0.85
        },
        layout: {
            'visibility': 'visible'
        }
    });

    console.log('Map layers initialized');
}

// ==========================================
// FETCH OSM DATA
// ==========================================

async function fetchOSMData() {
    showLoading('Loading Khorezm region boundary...');

    try {
        // Step 1: Load Khorezm boundary from local GeoJSON file
        updateLoadingText('Loading boundary from shapefile...');

        const boundaryResponse = await fetch('khiva_boundary.geojson');

        if (!boundaryResponse.ok) {
            throw new Error(`Could not load boundary file: ${boundaryResponse.status}`);
        }

        const boundaryGeoJSON = await boundaryResponse.json();

        if (!boundaryGeoJSON.features || boundaryGeoJSON.features.length === 0) {
            throw new Error('Boundary file is empty or invalid');
        }

        console.log(`Loaded boundary: ${boundaryGeoJSON.features[0].properties.name}`);

        // Get the boundary polygon
        let polygon = boundaryGeoJSON.features[0];

        // Count vertices
        let vertexCount = 0;
        if (polygon.geometry.type === 'Polygon') {
            vertexCount = polygon.geometry.coordinates[0].length;
        }
        console.log(`Original polygon vertices: ${vertexCount}`);

        // Simplify the polygon to reduce messiness (tolerance in degrees, ~500 meters)
        const simplified = turf.simplify(polygon, {
            tolerance: 0.005, // ~500 meters for cleaner boundaries
            highQuality: true
        });

        let simplifiedVertexCount = 0;
        if (simplified.geometry.type === 'Polygon') {
            simplifiedVertexCount = simplified.geometry.coordinates[0].length;
        }
        console.log(`Simplified polygon vertices: ${simplifiedVertexCount}`);

        boundaryData = {
            type: 'FeatureCollection',
            features: [simplified]
        };

        console.log(`Boundary loaded: ${boundaryData.features[0].properties.name}`);
        map.getSource('boundary').setData(boundaryData);

        // Fit map to boundary
        const bbox = turf.bbox(boundaryData.features[0]);
        map.fitBounds([[bbox[0], bbox[1]], [bbox[2], bbox[3]]], {
            padding: 50,
            duration: 1000
        });

        // Step 2: Fetch only villages in small area (to avoid timeout)
        updateLoadingText('Fetching settlements...');
        const bounds = khivaRegion.dataBounds;
        console.log(`Fetching settlements from: [${bounds[0]}, ${bounds[1]}]`);

        const settlementsQuery = `
[out:json][timeout:25];
node["place"="village"](${bounds[0][1]},${bounds[0][0]},${bounds[1][1]},${bounds[1][0]});
out geom;
`;

        const settlementsResponse = await fetch('https://overpass-api.de/api/interpreter', {
            method: 'POST',
            body: settlementsQuery
        });

        if (!settlementsResponse.ok) {
            throw new Error(`HTTP error fetching settlements! status: ${settlementsResponse.status}`);
        }

        const settlementsOSM = await settlementsResponse.json();

        // Convert to GeoJSON and filter to only settlements within the boundary
        const allSettlements = settlementsOSM.elements.map(node => ({
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [node.lon, node.lat]
            },
            properties: {
                name: node.tags?.name || 'Unnamed',
                place: node.tags?.place || 'village',
                population: node.tags?.population || null
            }
        }));

        // Filter to only settlements within the boundary polygon
        const boundaryPolygon = boundaryData.features[0];
        const settlementsInBoundary = allSettlements.filter(settlement => {
            try {
                return turf.booleanPointInPolygon(settlement, boundaryPolygon);
            } catch (e) {
                return false;
            }
        });

        settlementData = {
            type: 'FeatureCollection',
            features: settlementsInBoundary
        };

        console.log(`Fetched ${settlementData.features.length} settlements within boundary`);
        document.getElementById('statSettlements').textContent = settlementData.features.length.toLocaleString();

        // Update map with settlements
        map.getSource('settlements').setData(settlementData);

        // Auto-run analysis
        hideLoading();
        console.log(`Khorezm Region loaded: ${settlementData.features.length} settlements`);

        // Automatically run analysis
        setTimeout(() => runAnalysis(), 500);

    } catch (error) {
        console.error('Error fetching OSM data:', error);
        hideLoading();
        alert(`Error fetching data: ${error.message}\n\nPlease try again.`);
    }
}

// ==========================================
// RUN SPATIAL ANALYSIS
// ==========================================

async function runAnalysis() {
    if (!settlementData || !boundaryData) {
        console.log('Data not ready for analysis');
        return;
    }

    showLoading('Running spatial analysis...');

    try {
        const boundaryPolygon = boundaryData.features[0];

        // Step 1: Calculate Settlement Density
        updateLoadingText('Calculating settlement density...');
        const boundaryArea = turf.area(boundaryPolygon) / 1000000; // Convert m² to km²
        const totalSettlements = settlementData.features.length;
        const density = totalSettlements / boundaryArea;

        analysisResults.density = {
            total: totalSettlements,
            area: boundaryArea,
            value: density
        };

        console.log(`Settlement Density: ${density.toFixed(3)} settlements/km²`);
        console.log(`Total area: ${boundaryArea.toFixed(2)} km²`);

        // Step 2: Calculate Nearest Neighbor Index (NNI)
        updateLoadingText('Calculating nearest neighbor index...');

        if (totalSettlements >= 2) {
            // Calculate observed mean nearest-neighbor distance
            const nearestDistances = settlementData.features.map(settlement => {
                let minDist = Infinity;
                settlementData.features.forEach(other => {
                    if (settlement !== other) {
                        const dist = turf.distance(settlement, other, { units: 'meters' });
                        if (dist < minDist) minDist = dist;
                    }
                });
                return minDist;
            });

            const meanObserved = nearestDistances.reduce((sum, d) => sum + d, 0) / nearestDistances.length;

            // Calculate expected distance under CSR (Complete Spatial Randomness)
            const meanExpected = 1 / (2 * Math.sqrt(totalSettlements / boundaryArea)) * 1000; // Convert to meters

            // Nearest Neighbor Index
            const nni = meanObserved / meanExpected;

            // Z-score for significance
            const se = 0.26136 / Math.sqrt((totalSettlements * totalSettlements) / boundaryArea);
            const zScore = (meanObserved - meanExpected) / se;

            analysisResults.nni = {
                value: nni,
                meanObserved: meanObserved,
                meanExpected: meanExpected,
                zScore: zScore,
                interpretation: nni < 1 ? 'Clustered' : nni > 1 ? 'Dispersed' : 'Random'
            };

            console.log(`NNI: ${nni.toFixed(3)} (${analysisResults.nni.interpretation})`);
            console.log(`Z-score: ${zScore.toFixed(2)}`);
        } else {
            analysisResults.nni = {
                value: null,
                interpretation: 'Insufficient data'
            };
        }

        // Step 3: Update statistics panel
        updateStatistics();

        hideLoading();
        console.log(`Analysis complete: Density ${density.toFixed(3)}, NNI ${analysisResults.nni.value ? analysisResults.nni.value.toFixed(3) : 'N/A'}`);

    } catch (error) {
        console.error('Error running analysis:', error);
        hideLoading();
        alert(`Analysis error: ${error.message}`);
    }
}

// ==========================================
// UPDATE STATISTICS
// ==========================================

function updateStatistics() {
    // Settlement density
    if (analysisResults.density) {
        const density = analysisResults.density.value;
        document.getElementById('statDensity').textContent = density.toFixed(3) + ' settlements/km²';
        document.getElementById('statArea').textContent = analysisResults.density.area.toFixed(2) + ' km²';
    }

    // NNI
    if (analysisResults.nni && analysisResults.nni.value !== null) {
        const nni = analysisResults.nni.value;
        const nniText = `${nni.toFixed(3)} (${analysisResults.nni.interpretation})`;
        document.getElementById('statNNI').textContent = nniText;
    } else {
        document.getElementById('statNNI').textContent = 'N/A';
    }
}


// ==========================================
// UI HELPERS
// ==========================================

function showLoading(message) {
    const overlay = document.getElementById('loadingOverlay');
    overlay.classList.remove('hidden');
    document.getElementById('loadingText').textContent = message;
    document.getElementById('loadingSubtext').textContent = '';
}

function hideLoading() {
    document.getElementById('loadingOverlay').classList.add('hidden');
}

function updateLoadingText(subtext) {
    document.getElementById('loadingSubtext').textContent = subtext;
}

// ==========================================
// EVENT LISTENERS
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize map
    initMap();

    // Auto-load data after map loads
    map.on('load', () => {
        setTimeout(() => fetchOSMData(), 1000);
    });

    // Layer toggles
    const boundaryToggle = document.getElementById('boundaryToggle');
    if (boundaryToggle) {
        boundaryToggle.addEventListener('change', (e) => {
            map.setLayoutProperty('boundary-fill', 'visibility', e.target.checked ? 'visible' : 'none');
            map.setLayoutProperty('boundary-outline', 'visibility', e.target.checked ? 'visible' : 'none');
        });
    }

    const settlementsToggle = document.getElementById('settlementsToggle');
    if (settlementsToggle) {
        settlementsToggle.addEventListener('change', (e) => {
            map.setLayoutProperty('settlements-layer', 'visibility', e.target.checked ? 'visible' : 'none');
        });
    }

    // Help button
    const helpBtn = document.getElementById('helpBtn');
    if (helpBtn) {
        helpBtn.addEventListener('click', () => {
            document.getElementById('methodologyModal').classList.remove('hidden');
        });
    }

    // Close modal
    const closeModal = document.querySelector('.close-modal');
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            document.getElementById('methodologyModal').classList.add('hidden');
        });
    }

    console.log('Khorezm Settlement Analysis - Application initialized');
});
