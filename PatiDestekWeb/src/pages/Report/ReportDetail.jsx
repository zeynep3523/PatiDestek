import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api, { API_ORIGIN } from "../../services/api";
import { toast } from "react-toastify";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function ReportDetail() {
  const { id } = useParams();
  const [report, setReport] = useState(null);

  useEffect(() => {
    const loadReport = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await api.get(`/Report/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("İhbar detay verisi:", response.data);
        setReport(response.data);
      } catch (error) {
        console.log(error);
        toast.error("İhbar bilgileri yüklenemedi.");
      }
    };

    loadReport();
  }, [id]);

  if (!report)
    return (
      <div className="container py-5">
        Yükleniyor...
      </div>
    );

  return (
    <div className="container py-5">
      <div className="card shadow">
        <div className="card-body">

          <h2 className="mb-4">
            {report.animalType}
          </h2>
          <p>Latitude: {report.latitude}</p>
<p>Longitude: {report.longitude}</p>
          <MapContainer
  center={[report.latitude, report.longitude]}
  zoom={15}
  style={{
    height: "350px",
    width: "100%",
    borderRadius: "15px",
    marginBottom: "20px",
  }}
>
  <TileLayer
    attribution="&copy; OpenStreetMap"
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />

  <Marker position={[report.latitude, report.longitude]}>
    <Popup>
      📍 {report.location}
    </Popup>
  </Marker>
</MapContainer>

          <p>
            <strong>Konum:</strong> {report.location}
          </p>

          <p>
            <strong>Açıklama:</strong> {report.description}
          </p>

          <p>
            <strong>Öncelik:</strong> {report.priority}
          </p>
<p>
  <strong>Durum:</strong>{" "}
  <span
    className={`badge ${
      report.status === "Bekliyor"
        ? "bg-warning"
        : report.status === "İnceleniyor"
        ? "bg-info"
        : report.status === "Çözüldü"
        ? "bg-success"
        : "bg-secondary"
    }`}
  >
    {report.status}
  </span>
</p>
          
          <p>
            <strong>Oluşturulma Tarihi:</strong>{" "}
            {new Date(report.createdDate).toLocaleDateString("tr-TR")}
          </p>

          {report.adminNote && (
            <div className="alert alert-warning">
              <strong>Admin Notu:</strong><br />
              {report.adminNote}
            </div>
          )}

          {report.imageUrl && (
  <div className="text-center mb-4">
    <img
      src={`${API_ORIGIN}${report.imageUrl}`}
      alt="İhbar"
      className="img-fluid rounded shadow"
      style={{
        maxHeight: "400px",
        objectFit: "cover",
      }}
    />
  </div>
)}
          <Link
  to={`/report/edit/${report.id}`}
  className="btn btn-warning me-2"
>
  Düzenle
</Link>

        </div>
      </div>
    </div>
  );
}

export default ReportDetail;