import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

function MapPage() {
  useEffect(() => {
    // Initialize the map
    const map = L.map('map').setView([20, 0], 2);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Example addresses (latitude, longitude)
    const addresses = [
      { lat: 37.7749, lon: -122.4194, title: "San Francisco" },
      { lat: 40.7128, lon: -74.0060, title: "New York" },
      { lat: 51.5074, lon: -0.1278, title: "London" }
    ];

    // Add pins to the map
    addresses.forEach(address => {
      L.marker([address.lat, address.lon]).addTo(map)
        .bindPopup(address.title);
    });
  }, []);

  return (
    <div id="map" style={{ height: '600px', width: '100%' }}></div>
  );
}

export default MapPage;
