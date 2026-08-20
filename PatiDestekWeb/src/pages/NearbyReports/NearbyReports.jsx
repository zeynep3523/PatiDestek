import { useCallback, useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getNearbyReports } from "../../services/reportService";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function ChangeMapView({ center }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);

  return null;
}

const VISIBLE_CATEGORIES = [
  "MamaIhtiyaci",
  "SuIhtiyaci",
  "GeciciYuva",
  "KayipHayvan",
  "Sahiplendirme",
];

function NearbyReports() {
  const [radius, setRadius] = useState(5);
  const [userLocation, setUserLocation] = useState([41.0082, 28.9784]);
  const [reports, setReports] = useState([]);
 const [selectedLocation, setSelectedLocation] = useState(null);

  const loadNearbyReports = useCallback(
    async (lat, lng) => {
      try {
        const data = await getNearbyReports(lat, lng, radius);
        setReports(
          data.filter((report) => VISIBLE_CATEGORIES.includes(report.category))
        );
      } catch (error) {
        console.error(error);
      }
    },
    [radius]
  );

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setUserLocation([lat, lng]);
        loadNearbyReports(lat, lng);
      },
      (error) => {
        console.log(error);
      }
    );
  }, [radius, loadNearbyReports]);

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">📍 Yakındaki İhbarlar</h2>
      <div className="mb-3">
  <label className="form-label fw-bold">
    Gösterilecek Mesafe
  </label>

  <select
    className="form-select"
    value={radius}
    onChange={(e) => setRadius(Number(e.target.value))}
  >
    <option value={1}>1 KM</option>
    <option value={3}>3 KM</option>
    <option value={5}>5 KM</option>
    <option value={10}>10 KM</option>
  </select>
</div>

      <div className="row">

        <div className="col-lg-8 mb-4">

          <MapContainer
            center={userLocation}
            zoom={13}
            style={{
              height: "600px",
              width: "100%",
              borderRadius: "15px",
            }}
          >
            <TileLayer
              attribution="&copy; OpenStreetMap"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

           <ChangeMapView
  center={selectedLocation || userLocation}
/>

            <Marker position={userLocation}>
              <Popup>
                📍 Mevcut Konumunuz
              </Popup>
            </Marker>

            {reports.map((report) => (
              <Marker
                key={report.id}
                position={[report.latitude, report.longitude]}
              >
                <Popup>
                  <strong>{report.animalType}</strong>

                  <br />

                  {report.description}

                  <br />

                  📍 {report.location}

                  <br />

                  📏 {report.distanceKm} km
                  <br />

<a
  href={`https://www.google.com/maps/dir/?api=1&destination=${report.latitude},${report.longitude}`}
  target="_blank"
  rel="noopener noreferrer"
  className="btn btn-success btn-sm mt-2 w-100"
>
  🧭 Yol Tarifi Al
</a>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

        </div>

        <div className="col-lg-4">

          <div className="card shadow-sm">

            <div className="card-header bg-success text-white">
              <h5 className="mb-0">🐾 Yakındaki İhbarlar</h5>
            </div>

            <div
              className="card-body"
              style={{
                maxHeight: "600px",
                overflowY: "auto",
              }}
            >
              {reports.length === 0 ? (
                <p className="text-muted">
                  Yakında ihbar bulunamadı.
                </p>
              ) : (
                reports.map((report) => (
                  <div
  key={report.id}
  className="card mb-3 shadow-sm"
  style={{
    cursor: "pointer"
  }}
  onClick={() =>
    setSelectedLocation([
      report.latitude,
      report.longitude
    ])
  }
>
                    <div className="card-body">

                      <h6 className="fw-bold">
                        🐾 {report.animalType}
                      </h6>

                      <p className="mb-2">
                        {report.description}
                      </p>

                      <small className="d-block">
                        📍 {report.location}
                      </small>

                      <small className="d-block text-primary">
                        📏 {report.distanceKm} km
                      </small>

                      <span className="badge bg-warning mt-2">
                        {report.status}
                      </span>
                      <a
  href={`https://www.google.com/maps/dir/?api=1&destination=${report.latitude},${report.longitude}`}
  target="_blank"
  rel="noopener noreferrer"
  className="btn btn-outline-success btn-sm mt-3 w-100"
>
  🧭 Yol Tarifi Al
</a>

                    </div>
                  </div>
                ))
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default NearbyReports;