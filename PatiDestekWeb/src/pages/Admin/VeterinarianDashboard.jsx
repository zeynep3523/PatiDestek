import { useEffect, useState } from "react";
import axios from "axios";

function VeterinarianDashboard() {
  const [stats, setStats] = useState({
    todayReports: 0,
    todayWaiting: 0,
    todayReviewing: 0,
    todayCompleted: 0,

    totalReports: 0,
    totalWaiting: 0,
    totalReviewing: 0,
    totalCompleted: 0,
    totalIntervention: 0,

    criticalReports: [],
    latestReports: [],
  });

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://localhost:5217/api/Report/VeterinarianDashboard",
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
      <h2 className="mb-4 fw-bold">
        🩺 Veteriner Kontrol Paneli
      </h2>

      {/* Günlük İstatistikler */}
      <h4 className="mb-3 text-success">
        📅 Bugünkü İstatistikler
      </h4>

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

      {/* Genel Durum */}
      <h4 className="mb-3 text-primary">
        📊 Genel Durum
      </h4>

      <div className="row mb-5">

        <div className="col-md-3 mb-3">
          <div className="card shadow border-0">
            <div className="card-body text-center">
              <h6>📋 Toplam İhbar</h6>
              <h2>{stats.totalReports}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card shadow border-0">
            <div className="card-body text-center">
              <h6>⏳ Bekleyen</h6>
              <h2>{stats.totalWaiting}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card shadow border-0">
            <div className="card-body text-center">
              <h6>🔍 İncelenen</h6>
              <h2>{stats.totalReviewing}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card shadow border-0">
            <div className="card-body text-center">
              <h6>🚑 Müdahale Ediliyor</h6>
              <h2>{stats.totalIntervention}</h2>
            </div>
          </div>
        </div>

      </div>

      {/* Acil Müdahale Gerektiren İhbarlar */}
      <h4 className="mb-3 text-danger">
        🚨 Acil Müdahale Gerektiren İhbarlar
      </h4>

      <div className="card shadow border-0 mb-4">
        <div className="card-body">

          {(stats.criticalReports ?? []).length === 0 ? (
            <div className="alert alert-warning mb-0">
              <strong>
                Şu anda kritik öncelikli ihbar bulunmuyor.
              </strong>
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

                    <td>#{report.id}</td>

                    <td>{report.animalType}</td>

                    <td>{report.district}</td>

                    <td>
                      <span className="badge bg-danger">
                        {report.status}
                      </span>
                    </td>

                    <td>
                      {new Date(
                        report.createdDate
                      ).toLocaleDateString("tr-TR")}
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          )}

        </div>
      </div>

      {/* Son Atanan İhbarlar */}
      <h4 className="mb-3 text-primary">
        🕒 Son Atanan İhbarlar
      </h4>

      <div className="card shadow border-0">

        <div className="card-body">

          {(stats.latestReports ?? []).length === 0 ? (
            <p className="text-muted mb-0">
              Henüz size atanmış bir ihbar bulunmuyor.
            </p>
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
                {(stats.latestReports ?? []).map((report) => (
                  <tr key={report.id}>

                    <td>#{report.id}</td>

                    <td>{report.animalType}</td>

                    <td>{report.district}</td>

                    <td>{report.status}</td>

                    <td>
                      {new Date(
                        report.createdDate
                      ).toLocaleDateString("tr-TR")}
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          )}

        </div>

      </div>
    </>
  );
}

export default VeterinarianDashboard;