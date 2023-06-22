mapboxgl.accessToken =
  'pk.eyJ1IjoiYmlndmVlenVzIiwiYSI6ImNsZjk3dWhuYjAzODc0M251aDZra2x3YWIifQ.DNAwOhvuwW2bQoJPHLhZmA';
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/outdoors-v11',
  center: [-75.3883, 9.31522],
  zoom: 16,
});

// Fetch stores from API
async function getStores() {
  const res = await fetch('/api/v1/stores');
  const data = await res.json();

  const stores = data.data.map(store => {
    return {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [
          store.location.coordinates[0],
          store.location.coordinates[1]
        ]
      },
      properties: {
        storeId: store.storeId,
        icon: 'park'
      }
    };
  });

  loadMap(stores);
}

// Load map with stores
function loadMap(stores) {
  map.on('load', function() {
    map.addLayer({
      id: 'points',
      type: 'symbol',
      source: {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: stores
        }
      },
      layout: {
        'icon-image': '{icon}-15',
        'icon-size': 1.5,
        'text-field': '{storeId}',
        'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
        'text-offset': [0, 0.9],
        'text-anchor': 'top'
      }
    });
  });
}

getStores();