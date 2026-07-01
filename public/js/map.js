// Client-side script to load Mapbox map
if (!mapToken || mapToken.trim() === "" || mapToken.startsWith("dummy") || mapToken.includes("your_")) {
    console.warn("Mapbox token is missing or a placeholder. Showing placeholder map UI.");
    const mapContainer = document.getElementById("map");
    if (mapContainer) {
        mapContainer.innerHTML = `
            <div class="d-flex flex-column align-items-center justify-content-center h-100 bg-light text-secondary text-center p-4 rounded-4" style="border: 2px dashed #dee2e6; min-height: 350px;">
                <div class="icon-circle bg-danger bg-opacity-10 text-danger p-3 rounded-circle mb-3">
                    <i class="fa-solid fa-map-location-dot" style="font-size: 32px;"></i>
                </div>
                <h5 class="fw-bold text-dark mb-2">Map Preview Mode</h5>
                <p class="text-muted mb-3" style="max-width: 420px; font-size: 14px;">
                    This retreat is located in <strong>${listing.location}, ${listing.country}</strong>. Configure a valid <code>MAPBOX_TOKEN</code> in your <code>.env</code> file to enable the interactive Mapbox map.
                </p>
                <div class="d-flex gap-2">
                    <span class="badge bg-secondary-subtle text-secondary border px-3 py-2 rounded-pill">
                        <i class="fa-solid fa-location-dot me-1 text-danger"></i> ${listing.location}
                    </span>
                    <span class="badge bg-secondary-subtle text-secondary border px-3 py-2 rounded-pill">
                        <i class="fa-solid fa-globe me-1 text-primary"></i> ${listing.country}
                    </span>
                </div>
            </div>
        `;
    }
} else {
    try {
        const coordinates = (listing.geometry && listing.geometry.coordinates && listing.geometry.coordinates.length === 2) 
            ? listing.geometry.coordinates 
            : [77.2090, 28.6139]; // Default coordinates (New Delhi)

        mapboxgl.accessToken = mapToken;
        const map = new mapboxgl.Map({
            container: 'map', // container ID
            style: 'mapbox://styles/mapbox/streets-v12', // style URL
            center: coordinates, // starting position [lng, lat]
            zoom: 10 // starting zoom
        });

        // Add zoom and rotation controls to the map.
        map.addControl(new mapboxgl.NavigationControl(), 'top-right');

        // Add custom theme-colored pin marker
        const marker = new mapboxgl.Marker({ color: '#fe424d' }) 
            .setLngLat(coordinates)
            .setPopup(new mapboxgl.Popup({ offset: 25, closeButton: false })
                .setHTML(`
                    <div style="font-family: 'Plus Jakarta Sans', sans-serif; padding: 5px;">
                        <h6 class="fw-bold mb-1 text-dark">${listing.title}</h6>
                        <p class="mb-0 text-muted" style="font-size: 11px;">Exact location details are provided after a booking is confirmed.</p>
                    </div>
                `)
            )
            .addTo(map);

    } catch (error) {
        console.error("Error loading Mapbox GL JS map:", error);
        const mapContainer = document.getElementById("map");
        if (mapContainer) {
            mapContainer.innerHTML = `
                <div class="d-flex flex-column align-items-center justify-content-center h-100 bg-light text-secondary text-center p-4 rounded-4" style="border: 2px dashed #dee2e6; min-height: 350px;">
                    <div class="icon-circle bg-warning bg-opacity-10 text-warning p-3 rounded-circle mb-3">
                        <i class="fa-solid fa-triangle-exclamation" style="font-size: 32px;"></i>
                    </div>
                    <h5 class="fw-bold text-dark mb-2">Map Loading Error</h5>
                    <p class="text-muted mb-0" style="max-width: 420px; font-size: 14px;">
                        An error occurred while loading Mapbox. Please verify that your <code>MAPBOX_TOKEN</code> is valid and your network connection is active.
                    </p>
                </div>
            `;
        }
    }
}
