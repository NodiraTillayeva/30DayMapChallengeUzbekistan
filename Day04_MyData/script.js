// Initialize map (center over Italy & Central Europe)
const map = L.map('map').setView([48.0, 12.0], 5);

// Dark basemap (Carto Dark Matter)
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
  maxZoom: 19,
  attribution: '&copy; CARTO contributors'
}).addTo(map);

// Cities with coordinates, years visited, and images
const cities = [
  { name: "Munich", years: ["2024"], coords: [48.1351, 11.5820], images: ["https://i.postimg.cc/K8sCJ01x/Munich1.jpg","https://i.postimg.cc/6p1FYM8r/Munich2.jpg"] },
  { name: "Salzburg", years: ["2024"], coords: [47.8095, 13.0550], images: ["https://i.postimg.cc/sfqQCrbv/Salzburg1.jpg","https://i.postimg.cc/kG0BQQx7/Salzburg2.jpg","https://i.postimg.cc/gjCnVVvY/Salzburg3.jpg"] },
  { name: "Linz", years: ["2024"], coords: [48.3069, 14.2858], images: ["https://i.postimg.cc/9Qfvd6FK/Linz1.jpg","https://i.postimg.cc/13zLGk3S/Linz2.jpg"] },
  { name: "Vienna", years: ["2024"], coords: [48.2082, 16.3738], images: ["https://i.postimg.cc/PJh7PcR7/Vienna1.jpg","https://i.postimg.cc/J0mFGg2g/Vienna2.jpg"] },
  { name: "Milan", years: ["2024"], coords: [45.4642, 9.19], images: ["https://i.postimg.cc/T3HBCtK1/Milan1.jpg","https://i.postimg.cc/3w4V62GD/Milan2.jpg"] },
  { name: "Pisa", years: ["2024"], coords: [43.7167, 10.4], images: ["https://i.postimg.cc/R0kyzqQM/Piza1.jpg","https://i.postimg.cc/s2kqR19B/Piza2.jpg"] },
  { name: "Rome", years: ["2024"], coords: [41.9028, 12.4964], images: ["https://i.postimg.cc/mD7qZR8t/Rim1.jpg","https://i.postimg.cc/MT14Zxd7/Rim2.jpg"] },
  { name: "Venice", years: ["2024"], coords: [45.4408, 12.3155], images: ["https://i.postimg.cc/1XPdfTjc/Venice1.jpg","https://i.postimg.cc/rscHKbPh/Venice2.jpg"] },
  { name: "Ljubljana", years: ["2024"], coords: [46.0569, 14.5058], images: ["https://i.postimg.cc/6pQDrk5S/Lyublyana1.jpg","https://i.postimg.cc/4x3r6Dxs/Lyublyana2.jpg"] },
  { name: "Budapest", years: ["2024","2025"], coords: [47.4979, 19.0402], images: ["https://i.postimg.cc/FshtRdtf/BUdapest1.jpg","https://i.postimg.cc/GhKWsLrT/Budapest2.jpg"] },
  { name: "Bratislava", years: ["2024","2025"], coords: [48.1486, 17.1077], images: ["https://i.postimg.cc/bYk8dfs3/Bratislava1.jpg","https://i.postimg.cc/h4TghRfN/Bratislava2.jpg"] },
  { name: "Brussels", years: ["2024"], coords: [50.8503, 4.3517], images: ["https://i.postimg.cc/BvDVS4v9/Brussel1.jpg","https://i.postimg.cc/2SgtNVrV/Brussel2.jpg"] },
  { name: "Amsterdam", years: ["2024"], coords: [52.3676, 4.9041], images: ["https://i.postimg.cc/25bfns8M/Amsterdam1.jpg","https://i.postimg.cc/ZR6tM6Nq/Amsterdam2.jpg"] },
  { name: "Cologne", years: ["2024"], coords: [50.9375, 6.9603], images: ["https://i.postimg.cc/CL73fhYv/Koln1.jpg","https://i.postimg.cc/WbsR3DBK/Koln2.jpg"] },
  { name: "Berlin", years: ["2024"], coords: [52.52, 13.4050], images: ["https://i.postimg.cc/9fqvDyJb/Berlin1.jpg","https://i.postimg.cc/KzSCB4WB/Berlin2.jpg"] },
  { name: "Paris", years: ["2024"], coords: [48.8566, 2.3522], images: ["https://i.postimg.cc/mrzJq79J/Paris1.jpg","https://i.postimg.cc/DzJHD1G9/Paris2.jpg","https://i.postimg.cc/N03SwL8N/Paris3.jpg"] },
  { name: "Trencin", years: ["2025"], coords: [48.8941, 18.0445], images: ["https://i.postimg.cc/QtcPNs0k/Trencin1.jpg","https://i.postimg.cc/MT14Zxdm/Trencin2.jpg","https://i.postimg.cc/63CS6wYh/Trencin3.jpg"] },
  { name: "Nitra", years: ["2025"], coords: [48.3084, 18.0858], images: ["https://i.postimg.cc/FKd8q0Sd/Nitra1.jpg","https://i.postimg.cc/W4FCK0ZM/Nitra2.jpg"] },
  { name: "Košice", years: ["2025"], coords: [48.7164, 21.2611], images: ["https://i.postimg.cc/X7LRyj3z/Kosice1.jpg","https://i.postimg.cc/htGHLkPZ/KOsice2.jpg"] },
  { name: "Barcelona", years: ["2025"], coords: [41.3851, 2.1734], images: ["https://i.postimg.cc/jjwrypdQ/Barcelona1.jpg","https://i.postimg.cc/9My5ny9r/Barcelona2.jpg","https://i.postimg.cc/Xq3SSXK2/Barcelona3.jpg","https://i.postimg.cc/DyxVHvSN/Barcelona4.jpg"] },
  { name: "Marseille", years: ["2025"], coords: [43.2965, 5.3698], images: ["https://i.postimg.cc/zGf9CsG5/Marsell1.jpg","https://i.postimg.cc/52tZBh2f/Marsell2.jpg","https://i.postimg.cc/XYvTfRYv/Marsell3.jpg"] },
  { name: "Copenhagen", years: ["2025"], coords: [55.6761, 12.5683], images: ["https://i.postimg.cc/SNm0s20s/Kopengagen1.jpg","https://i.postimg.cc/nc2yQFZY/Kopengagen2.jpg"] },
  { name: "Stockholm", years: ["2025"], coords: [59.3293, 18.0686], images: ["https://i.postimg.cc/Px1cfh21/Stokgolm1.jpg","https://i.postimg.cc/rm5bycQS/Stokgolm2.jpg"] },
  { name: "Oslo", years: ["2025"], coords: [59.9139, 10.7522], images: ["https://i.postimg.cc/k56zZWSy/Oslo1.jpg","https://i.postimg.cc/BvLky2Fy/Oslo2.jpg"] },
  { name: "Prague", years: ["2024","2025"], coords: [50.0755, 14.4378], images: ["https://i.postimg.cc/tgKwH7tT/Prague1.jpg","https://i.postimg.cc/wBCZd3cM/Prague2.jpg"] }
];

// Add markers & popups with mini-carousel
cities.forEach(city => {
  const carouselHTML = `
    <div class="city-popup">
      <div class="city-name"><b>${city.name}</b></div>
      <div class="year">Visited in ${city.years.join(", ")}</div>
      <div class="carousel">
        ${city.images.map(img => `<img src="${img}" alt="${city.name}" style="margin:4px; border-radius:10px; width:80px;">`).join('')}
      </div>
    </div>
  `;

  // Click to open popup
  L.marker(city.coords).addTo(map).bindPopup(carouselHTML, { maxWidth: 280 });
});
