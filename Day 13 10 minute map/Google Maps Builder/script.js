let map;
let infoWindow;
let routePolyline;

const tourLocations = [
  { name: 'Registan Square', lat: 39.6548, lng: 66.9758 },
  { name: 'Gur-e-Amir Mausoleum', lat: 39.6483, lng: 66.9691 },
  { name: 'Bibi-Khanym Mosque', lat: 39.6610, lng: 66.9796 },
  { name: 'Shah-i-Zinda Necropolis', lat: 39.6633, lng: 66.9871 },
  { name: 'Ulugh Beg Observatory', lat: 39.6761, lng: 66.9858 }
];

async function initMap() {
  const { Map, InfoWindow, Polyline, TrafficLayer } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
  const { encoding } = await google.maps.importLibrary("geometry");
  const { StreetViewPanorama } = await google.maps.importLibrary("streetView");

  const panoContainer = document.getElementById('pano');
  const mapContainer = document.getElementById('map');

  map = new Map(mapContainer, {
    center: tourLocations[0],
    zoom: 15,
    mapId: 'DEMO_MAP_ID',
    gestureHandling: "greedy"
  });

  const panorama = new StreetViewPanorama(panoContainer, {
      visible: false,
  });
  map.setStreetView(panorama);

  panorama.addListener('closeclick', () => {
    panoContainer.style.display = 'none';
    mapContainer.style.width = '100%';
  });

  infoWindow = new InfoWindow();
  routePolyline = new Polyline({
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 5,
    map: map
  });

  const locationsList = document.getElementById('locations-list');
  const toggleTrafficBtn = document.getElementById('toggle-traffic-btn');
  const trafficLayer = new TrafficLayer();
  let trafficEnabled = false;

  toggleTrafficBtn.addEventListener('click', () => {
    if (!trafficEnabled) {
      trafficLayer.setMap(map);
      trafficEnabled = true;
      toggleTrafficBtn.textContent = 'Hide Traffic';
      toggleTrafficBtn.style.backgroundColor = '#d9534f';
    } else {
      trafficLayer.setMap(null);
      trafficEnabled = false;
      toggleTrafficBtn.textContent = 'Show Traffic';
      toggleTrafficBtn.style.backgroundColor = '#4285F4';
    }
  });

  tourLocations.forEach(location => {
    const marker = new AdvancedMarkerElement({
      map,
      position: location,
      title: location.name
    });

    marker.addListener('click', () => {
      infoWindow.setContent(location.name);
      infoWindow.open(map, marker);
    });

    const listItem = document.createElement('li');
    listItem.textContent = location.name;
    listItem.addEventListener('click', () => {
        map.setCenter(location);
        map.setZoom(17);
        infoWindow.setContent(location.name);
        infoWindow.open(map, marker);

        // Show the panorama
        panoContainer.style.display = 'block';
        mapContainer.style.width = '50%';
        const panorama = map.getStreetView();
        panorama.setPosition(location);
        panorama.setVisible(true);
    });
    locationsList.appendChild(listItem);
  });

  calculateAndDisplayRoute();
}

async function calculateAndDisplayRoute() {
    const origin = tourLocations[0];
    const destination = tourLocations[tourLocations.length - 1];
    const waypoints = tourLocations.slice(1, -1).map(location => ({
        location: { latLng: { latitude: location.lat, longitude: location.lng } }
    }));

    const request = {
      origin: { location: { latLng: { latitude: origin.lat, longitude: origin.lng } } },
      destination: { location: { latLng: { latitude: destination.lat, longitude: destination.lng } } },
      intermediates: waypoints,
      travelMode: 'WALK',
      routingPreference: 'ROUTING_PREFERENCE_UNSPECIFIED'
    };

    try {
        const response = await fetch("https://routes.googleapis.com/directions/v2:computeRoutes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Goog-Api-Key": "hahahahahahha",
                "X-Goog-FieldMask": "routes.polyline.encodedPolyline"
            },
            body: JSON.stringify(request)
        });

        if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorBody.error.message}`);
        }
        
        const data = await response.json();

        if (data.routes && data.routes.length > 0) {
            const route = data.routes[0];
            const decodedPath = google.maps.geometry.encoding.decodePath(route.polyline.encodedPolyline);
            routePolyline.setPath(decodedPath);
            
            const bounds = new google.maps.LatLngBounds();
            decodedPath.forEach(path => bounds.extend(path));
            map.fitBounds(bounds);
        } else {
            throw new Error("No routes found.");
        }

    } catch (error) {
        console.error("Directions request failed:", error);
        routePolyline.setPath([]);
    }
}

initMap();
