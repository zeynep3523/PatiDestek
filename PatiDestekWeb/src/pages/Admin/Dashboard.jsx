import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [stats, setStats] = useState({
    // Günlük
    todayReports: 0,
    todayWaiting: 0,
    todayReviewing: 0,
    todayCompleted: 0,

    // Genel
    totalReports: 0,
    totalWaiting: 0,
    totalReviewing: 0,
    totalCompleted: 0,

    criticalReports: [],
    totalIntervention: 0,
totalVeterinarians: 0,
activeCases: 0,
latestReports: [],
  });

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

const endpoint =
  user?.role === "Municipality"
    ? "http://localhost:5217/api/Report/MunicipalityDashboard"
    : "http://localhost:5217/api/Report/AdminDashboard";

const response = await axios.get(
  endpoint,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);
        
         
setStats(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <>
      <h2 className="mb-4">🏛 Belediye Kontrol Paneli</h2>

      {/* Günlük İstatistikler */}
      <h4 className="mb-3 text-success">📅 Bugünkü İstatistikler</h4>

      <div className="row mb-5">
        <div className="col-md-3 mb-3">
          <div className="card shadow border-0">
            <div className="card-body text-center">
              <h6>📨 Bugün Gelen</h6>
              <h2>{stats.todayReports}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card shadow border-0">
            <div className="card-body text-center">
              <h6>⏳ Bugün Bekleyen</h6>
              <h2>{stats.todayWaiting}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card shadow border-0">
            <div className="card-body text-center">
              <h6>🔍 Bugün İncelenen</h6>
              <h2>{stats.todayReviewing}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card shadow border-0">
            <div className="card-body text-center">
              <h6>✅ Bugün Tamamlanan</h6>
              <h2>{stats.todayCompleted}</h2>
            </div>
          </div>
        </div>
      </div>
      <h4 className="mb-3 text-primary">📊 Genel Durum</h4>

<div className="row mb-5">

  <div className="col-md-3 mb-3">
    <div className="card shadow border-0">
      <div className="card-body text-center">
        <h6>🩺 Veteriner Sayısı</h6>
        <h2>{stats.totalVeterinarians ?? 0}</h2>
      </div>
    </div>
  </div>

  <div className="col-md-3 mb-3">
    <div className="card shadow border-0">
      <div className="card-body text-center">
        <h6>🚑 Aktif Müdahaleler</h6>
        <h2>{stats.activeCases ?? 0}</h2>
      </div>
    </div>
  </div>

  <div className="col-md-3 mb-3">
    <div className="card shadow border-0">
      <div className="card-body text-center">
        <h6>🔍 İncelenen</h6>
        <h2>{stats.totalReviewing ?? 0}</h2>
      </div>
    </div>
  </div>

  <div className="col-md-3 mb-3">
    <div className="card shadow border-0">
      <div className="card-body text-center">
        <h6>🚨 Müdahale Ediliyor</h6>
        <h2>{stats.totalIntervention ?? 0}</h2>
      </div>
    </div>
  </div>

</div>
      {/* Acil Müdahale Gerektiren İhbarlar */}
<h4 className="mb-3 text-danger">🚨 Acil Müdahale Gerektiren İhbarlar</h4>

<div className="card shadow border-0 mb-4">
  <div className="card-body">

    {(stats.criticalReports ?? []).length === 0 ? (
  <div className="alert alert-warning mb-0">
    <strong>Şu anda kritik öncelikli ihbar bulunmuyor.</strong>
  </div>
) : (
  <table className="table table-hover mb-0">
    <thead>
      <tr>
        <th>🆔 İhbar ID</th>
        <th>🐾 Hayvan</th>
        <th>📍 Mahalle</th>
        <th>📌 Durum</th>
        <th>🕒 Tarih</th>
      </tr>
    </thead>

    <tbody>
  {(stats.criticalReports ?? []).map((report) => (
    <tr key={report.id}>

      <td>
        #{report.id}
      </td>

      <td>
        {report.animalType}
      </td>

      <td>
        {report.district}
      </td>

      <td>
        <span className="badge bg-danger">
          {report.status}
        </span>
      </td>

      <td>
        {new Date(report.createdDate).toLocaleDateString("tr-TR")}
      </td>

    </tr>
  ))}
</tbody>
  </table>
)}

  </div>
</div>

{/* Son Gelen İhbarlar */}
<h4 className="mb-3 text-primary">🕒 Son Gelen İhbarlar</h4>

<div className="card shadow border-0">
  <div className="card-body">

    <table className="table table-hover mb-0">
      <thead>
        <tr>
          <th>🆔 İhbar ID</th>
          <th>🐾 Hayvan</th>
          <th>📍 Mahalle</th>
          <th>📌 Durum</th>
          <th>🕒 Tarih</th>
        </tr>
      </thead>

      <tbody>
  {(stats.latestReports ?? []).map((report) => (
    <tr key={report.id}>
      <td>#{report.id}</td>
      <td>{report.animalType}</td>
      <td>{report.district}</td>
      <td>{report.status}</td>
      <td>
        {new Date(report.createdDate).toLocaleDateString("tr-TR")}
      </td>
    </tr>
  ))}
</tbody>

    </table>

  </div>
</div>
      
  
    </>
  );
}

export default Dashboard;