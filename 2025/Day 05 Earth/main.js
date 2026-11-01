// ==========================================
// CESIUM ION ACCESS TOKEN
// ==========================================
// Token provided - ready to use
Cesium.Ion.defaultAccessToken = 'Enter your token';

// ==========================================
// UZBEKISTAN LOCATIONS DATA
// ==========================================
const uzbekistanLocations = {
    tashkent: {
        name: 'Tashkent',
        description: 'Capital and largest city',
        lat: 41.3111,
        lon: 69.2797,
        cameraHeight: 50000,
        cameraPitch: -30
    },
    samarkand: {
        name: 'Samarkand',
        description: 'Historic Silk Road city',
        lat: 39.6542,
        lon: 66.9597,
        cameraHeight: 40000,
        cameraPitch: -35
    },
    bukhara: {
        name: 'Bukhara',
        description: 'Ancient trading hub',
        lat: 39.7670,
        lon: 64.4231,
        cameraHeight: 35000,
        cameraPitch: -35
    },
    fergana: {
        name: 'Fergana Valley',
        description: 'Fertile agricultural region',
        lat: 40.4,
        lon: 71.8,
        cameraHeight: 80000,
        cameraPitch: -25
    },
    kyzylkum: {
        name: 'Kyzylkum Desert',
        description: 'Central Asian desert',
        lat: 42.5,
        lon: 63.0,
        cameraHeight: 150000,
        cameraPitch: -20
    },
    aral: {
        name: 'Aral Sea',
        description: 'Shrinking inland sea',
        lat: 45.0,
        lon: 59.0,
        cameraHeight: 180000,
        cameraPitch: -20
    },
    khiva: {
        name: 'Khiva',
        description: 'Well-preserved ancient city',
        lat: 41.3783,
        lon: 60.3639,
        cameraHeight: 35000,
        cameraPitch: -35
    },
    nukus: {
        name: 'Nukus',
        description: 'Capital of Karakalpakstan',
        lat: 42.4600,
        lon: 59.6200,
        cameraHeight: 45000,
        cameraPitch: -30
    }
};

// ==========================================
// 3D MODEL CONFIGURATION
// ==========================================
// Models can be loaded from local assets/ folder or remote URLs
// Priority: local assets first, fallback to remote

const modelConfig = {
    aircraft: {
        name: 'Aircraft',
        altitude: 5000,          // meters above ground
        scale: 2.0,
        heading: 0,              // degrees
        pitch: 0,
        roll: 0,
        url: './assets/models/aircraft.glb',
        fallbackUrl: 'https://raw.githubusercontent.com/CesiumGS/cesium/main/Apps/SampleData/models/CesiumAir/Cesium_Air.glb',
        cameraDistance: 10000    // camera distance for tracking (meters)
    },
    drone: {
        name: 'Drone',
        altitude: 150,
        scale: 1.0,
        heading: 45,
        pitch: 0,
        roll: 0,
        url: './assets/models/drone.glb',
        fallbackUrl: 'https://raw.githubusercontent.com/CesiumGS/cesium/main/Apps/SampleData/models/CesiumDrone/CesiumDrone.glb',
        cameraDistance: 300      // camera distance for tracking (meters)
    },
    balloon: {
        name: 'Hot Air Balloon',
        altitude: 1000,
        scale: 3.0,
        heading: 0,
        pitch: 0,
        roll: 0,
        url: './assets/models/balloon.glb',
        fallbackUrl: 'https://raw.githubusercontent.com/CesiumGS/cesium/main/Apps/SampleData/models/CesiumBalloon/CesiumBalloon.glb',
        cameraDistance: 2000     // camera distance for tracking (meters)
    },
    vehicle: {
        name: 'Ground Vehicle',
        altitude: 0,             // on the ground
        scale: 1.5,
        heading: 90,
        pitch: 0,
        roll: 0,
        url: './assets/models/vehicle.glb',
        fallbackUrl: 'https://raw.githubusercontent.com/CesiumGS/cesium/main/Apps/SampleData/models/GroundVehicle/GroundVehicle.glb',
        cameraDistance: 500      // camera distance for tracking (meters)
    }
};

// ==========================================
// GLOBAL STATE
// ==========================================
let viewer;
let osmBuildingsTileset = null;
let selectedLocation = null;
let selectedModel = null;
let spawnedModels = [];
let locationMarkers = [];

// ==========================================
// INITIALIZE CESIUM VIEWER
// ==========================================
async function initViewer() {
    viewer = new Cesium.Viewer('cesiumContainer', {
        // UI Configuration
        animation: false,
        timeline: false,
        baseLayerPicker: false,
        geocoder: false,
        homeButton: false,
        sceneModePicker: false,
        navigationHelpButton: false,
        infoBox: true,
        selectionIndicator: true,

        // Scene Settings
        shadows: true,
        shouldAnimate: true
    });

    // Remove default imagery and add Bing Maps Aerial satellite imagery
    viewer.imageryLayers.removeAll();

    try {
        const imageryProvider = await Cesium.IonImageryProvider.fromAssetId(3);
        viewer.imageryLayers.addImageryProvider(imageryProvider);
        console.log('Satellite imagery loaded successfully');
    } catch (error) {
        console.error('Failed to load satellite imagery:', error);
        // Fallback to OpenStreetMap if Ion fails
        viewer.imageryLayers.addImageryProvider(
            new Cesium.OpenStreetMapImageryProvider({
                url: 'https://a.tile.openstreetmap.org/'
            })
        );
        console.log('Using OpenStreetMap as fallback');
    }

    // Disable lighting for clearer, brighter satellite view
    viewer.scene.globe.enableLighting = false;

    // Disable terrain for flat 2D satellite view
    viewer.scene.globe.depthTestAgainstTerrain = false;

    // Set initial view to Uzbekistan overview
    resetViewToUzbekistan();

    // Create location markers
    createLocationMarkers();

    // Update status panel on camera movement
    viewer.camera.moveEnd.addEventListener(updateStatusPanel);

    // Hide loading overlay after initialization
    setTimeout(() => {
        document.getElementById('loadingOverlay').classList.add('hidden');
        // Show instructions popup for first-time users
        // (Can be disabled by setting a localStorage flag)
        if (!localStorage.getItem('instructionsSeen')) {
            document.getElementById('instructionsPopup').classList.remove('hidden');
        }
    }, 1500);

    console.log('Cesium Viewer initialized successfully');
}

// ==========================================
// CREATE LOCATION MARKERS
// ==========================================
function createLocationMarkers() {
    // Create a pin marker for each Uzbekistan location
    Object.keys(uzbekistanLocations).forEach(locationKey => {
        const location = uzbekistanLocations[locationKey];

        const marker = viewer.entities.add({
            name: location.name,
            description: location.description,
            position: Cesium.Cartesian3.fromDegrees(location.lon, location.lat),

            // Point marker
            point: {
                pixelSize: 10,
                color: Cesium.Color.CYAN,
                outlineColor: Cesium.Color.WHITE,
                outlineWidth: 2,
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
            },

            // Label
            label: {
                text: location.name,
                font: '14px sans-serif',
                fillColor: Cesium.Color.WHITE,
                outlineColor: Cesium.Color.BLACK,
                outlineWidth: 2,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                pixelOffset: new Cesium.Cartesian2(0, -15),
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                disableDepthTestDistance: Number.POSITIVE_INFINITY
            }
        });

        locationMarkers.push(marker);
    });

    console.log(`Created ${locationMarkers.length} location markers`);
}

// ==========================================
// FLY TO LOCATION
// ==========================================
function flyToLocation(locationKey) {
    const location = uzbekistanLocations[locationKey];
    if (!location) {
        console.error(`Location not found: ${locationKey}`);
        return;
    }

    selectedLocation = { key: locationKey, ...location };

    // Fly camera to the location
    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(
            location.lon,
            location.lat,
            location.cameraHeight
        ),
        orientation: {
            heading: Cesium.Math.toRadians(0),
            pitch: Cesium.Math.toRadians(location.cameraPitch),
            roll: 0.0
        },
        duration: 2.5,
        complete: () => {
            updateStatusPanel();
            console.log(`Flew to ${location.name}`);
        }
    });

    // Update UI: mark active location button
    document.querySelectorAll('.location-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-location="${locationKey}"]`).classList.add('active');
}

// ==========================================
// SPAWN 3D MODEL
// ==========================================
function spawnModel(modelKey) {
    if (!selectedLocation) {
        alert('Please select a location first!');
        return;
    }

    const config = modelConfig[modelKey];
    if (!config) {
        console.error(`Model not found: ${modelKey}`);
        return;
    }

    selectedModel = modelKey;

    // CLEAR PREVIOUS MODELS - Only show one model at a time
    spawnedModels.forEach(entity => {
        viewer.entities.remove(entity);
    });
    spawnedModels = [];

    // Calculate model position with altitude
    const position = Cesium.Cartesian3.fromDegrees(
        selectedLocation.lon,
        selectedLocation.lat,
        config.altitude
    );

    // Create orientation quaternion from heading, pitch, roll
    const heading = Cesium.Math.toRadians(config.heading);
    const pitch = Cesium.Math.toRadians(config.pitch);
    const roll = Cesium.Math.toRadians(config.roll);
    const hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
    const orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpr);

    // Try to load local model first, fallback to remote
    let modelUri = config.url;

    // Entity configuration
    const entityConfig = {
        name: `${config.name} at ${selectedLocation.name}`,
        description: `${config.name} spawned at ${selectedLocation.name} (${config.altitude}m altitude)`,
        position: position,
        orientation: orientation,

        // 3D Model
        model: {
            uri: modelUri,
            scale: config.scale,
            minimumPixelSize: 64,
            maximumScale: 20000,
            shadows: Cesium.ShadowMode.ENABLED,
            runAnimations: false
        },

        // Label showing model info
        label: {
            text: config.name,
            font: '12px sans-serif',
            fillColor: Cesium.Color.YELLOW,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 2,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(0, -20),
            disableDepthTestDistance: Number.POSITIVE_INFINITY
        }
    };

    // For ground vehicle, clamp to terrain/ground
    if (modelKey === 'vehicle') {
        entityConfig.position = new Cesium.CallbackProperty(() => {
            return Cesium.Cartesian3.fromDegrees(
                selectedLocation.lon,
                selectedLocation.lat,
                0
            );
        }, false);
    }

    // Create the model entity
    const modelEntity = viewer.entities.add(entityConfig);

    // Add to spawned models list
    spawnedModels.push(modelEntity);

    // Track the newly spawned model with camera at appropriate distance
    viewer.trackedEntity = modelEntity;

    // Set camera distance based on model type
    setTimeout(() => {
        const distance = config.cameraDistance || 1000;
        viewer.camera.zoomOut(distance);
    }, 100);

    // Update status panel
    updateStatusPanel();

    // Update UI: mark active model button
    document.querySelectorAll('.model-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-model="${modelKey}"]`).classList.add('active');

    console.log(`Spawned ${config.name} at ${selectedLocation.name} (${config.altitude}m)`);
}

// ==========================================
// CLEAR ALL MODELS
// ==========================================
function clearAllModels() {
    if (spawnedModels.length === 0) {
        alert('No models to clear!');
        return;
    }

    const count = spawnedModels.length;

    // Remove all spawned model entities
    spawnedModels.forEach(entity => {
        viewer.entities.remove(entity);
    });

    // Clear the array
    spawnedModels = [];

    // Stop tracking
    viewer.trackedEntity = undefined;

    // Update status
    updateStatusPanel();

    // Clear model button selection
    document.querySelectorAll('.model-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    console.log(`Cleared ${count} model(s)`);
}

// ==========================================
// RESET VIEW TO UZBEKISTAN
// ==========================================
function resetViewToUzbekistan() {
    // Fly to overview of entire Uzbekistan
    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(64.5, 41.5, 800000),
        orientation: {
            heading: Cesium.Math.toRadians(0),
            pitch: Cesium.Math.toRadians(-45),
            roll: 0.0
        },
        duration: 2,
        complete: () => {
            selectedLocation = null;
            updateStatusPanel();
        }
    });

    // Stop tracking any entity
    viewer.trackedEntity = undefined;

    // Clear button selections
    document.querySelectorAll('.location-btn, .model-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    console.log('View reset to Uzbekistan');
}

// ==========================================
// UPDATE STATUS PANEL
// ==========================================
function updateStatusPanel() {
    // Get camera position
    const cameraPos = viewer.camera.positionCartographic;
    const lat = Cesium.Math.toDegrees(cameraPos.latitude);
    const lon = Cesium.Math.toDegrees(cameraPos.longitude);
    const height = cameraPos.height;

    // Format latitude/longitude
    const latStr = lat >= 0 ? `${lat.toFixed(4)}°N` : `${Math.abs(lat).toFixed(4)}°S`;
    const lonStr = lon >= 0 ? `${lon.toFixed(4)}°E` : `${Math.abs(lon).toFixed(4)}°W`;

    // Format height
    let heightStr;
    if (height >= 1000) {
        heightStr = `${(height / 1000).toFixed(1)} km`;
    } else {
        heightStr = `${height.toFixed(0)} m`;
    }

    // Update status panel elements
    document.getElementById('statusModel').textContent = selectedModel
        ? modelConfig[selectedModel].name
        : 'None';

    document.getElementById('statusLocation').textContent = selectedLocation
        ? selectedLocation.name
        : 'None';

    document.getElementById('statusLat').textContent = latStr;
    document.getElementById('statusLon').textContent = lonStr;
    document.getElementById('statusHeight').textContent = heightStr;
    document.getElementById('statusCount').textContent = spawnedModels.length;
}

// ==========================================
// TOGGLE 3D BUILDINGS
// ==========================================
async function toggle3DBuildings(enabled) {
    if (enabled) {
        if (!osmBuildingsTileset) {
            // Add Cesium OSM Buildings (async in CesiumJS 1.111+)
            try {
                osmBuildingsTileset = await Cesium.createOsmBuildingsAsync();
                viewer.scene.primitives.add(osmBuildingsTileset);
                console.log('3D Buildings enabled');
            } catch (error) {
                console.error('Failed to load OSM Buildings:', error);
            }
        } else {
            osmBuildingsTileset.show = true;
            console.log('3D Buildings shown');
        }
    } else {
        if (osmBuildingsTileset) {
            osmBuildingsTileset.show = false;
            console.log('3D Buildings hidden');
        }
    }
}

// ==========================================
// TOGGLE SHADOWS
// ==========================================
function toggleShadows(enabled) {
    viewer.shadows = enabled;
    console.log(`Shadows ${enabled ? 'enabled' : 'disabled'}`);
}

// ==========================================
// UPDATE TERRAIN EXAGGERATION
// ==========================================
function updateTerrainExaggeration(value) {
    viewer.scene.verticalExaggeration = parseFloat(value);
    document.getElementById('terrainValue').textContent = `${value}x`;
    console.log(`Terrain exaggeration: ${value}x`);
}

// ==========================================
// EVENT LISTENERS
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Cesium viewer
    initViewer();

    // Location buttons
    document.querySelectorAll('.location-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const locationKey = e.target.getAttribute('data-location');
            flyToLocation(locationKey);
        });
    });

    // Model buttons
    document.querySelectorAll('.model-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modelKey = e.target.getAttribute('data-model');
            spawnModel(modelKey);
        });
    });

    // Clear models button
    document.getElementById('clearModelsBtn').addEventListener('click', () => {
        clearAllModels();
    });

    // Reset view button
    document.getElementById('resetViewBtn').addEventListener('click', () => {
        resetViewToUzbekistan();
    });

    // Shadows toggle
    document.getElementById('shadowsToggle').addEventListener('change', (e) => {
        toggleShadows(e.target.checked);
    });

    // Terrain exaggeration slider (disabled for 2D satellite view)
    // document.getElementById('terrainSlider').addEventListener('input', (e) => {
    //     updateTerrainExaggeration(e.target.value);
    // });

    // Close instructions popup
    document.getElementById('closeInstructionsBtn').addEventListener('click', () => {
        document.getElementById('instructionsPopup').classList.add('hidden');
        localStorage.setItem('instructionsSeen', 'true');
    });

    console.log('Uzbekistan 3D Explorer - Event listeners registered');
});

// ==========================================
// KEYBOARD SHORTCUTS
// ==========================================
document.addEventListener('keydown', (e) => {
    // Press 'R' to reset view
    if (e.key === 'r' || e.key === 'R') {
        resetViewToUzbekistan();
    }

    // Press 'C' to clear models
    if (e.key === 'c' || e.key === 'C') {
        clearAllModels();
    }

    // Press '1'-'8' to fly to locations
    const locationKeys = Object.keys(uzbekistanLocations);
    const numKey = parseInt(e.key);
    if (numKey >= 1 && numKey <= locationKeys.length) {
        flyToLocation(locationKeys[numKey - 1]);
    }
});

// ==========================================
// UTILITY: Check if local assets exist
// ==========================================
// This function can be used to verify if local models exist
// (Optional - can be expanded for production use)
async function checkLocalAssets() {
    console.log('Checking for local model assets...');
    console.log('If local models are not found, remote fallback URLs will be used automatically.');
}
