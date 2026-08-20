import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getDashboard, getMyReports } from "../../services/reportService";
import "../../styles/Home.css";

function Home() {
  const [dashboard, setDashboard] = useState({
  totalReports: 0,
  waiting: 0,
  reviewing: 0,
  completed: 0,
});
const [recentReports, setRecentReports] = useState([]);

useEffect(() => {
  const loadDashboard = async () => {
    try {
      const data = await getDashboard();
      setDashboard(data);
      const reports = await getMyReports();
setRecentReports(reports.slice(0, 5));
console.log(reports);
    } catch (error) {
      console.error("Dashboard yüklenemedi:", error);
    }
  };

  loadDashboard();
}, []);
  const navigate = useNavigate();

const handleReportClick = () => {
  const token = localStorage.getItem("token");

  if (token) {
    navigate("/report");
  } else {
    navigate("/login");
  }
};
  return (
    <>
    
      <section className="py-5 hero-section">
        <div className="container">

          <div className="row align-items-center">

            <div className="col-lg-6">

              
              <h1 className="display-4 fw-bold">
  👋 Hoş Geldin
</h1>

<p className="lead mt-3">
  PatiDestek ile ihbarlarını kolayca oluşturabilir,
  mevcut ihbarlarını takip edebilir ve
  hayvan dostlarımız için hızlıca destek sağlayabilirsin.
</p>

              <div className="mt-4">

                <button
  onClick={handleReportClick}
  className="btn btn-success btn-lg me-3"
>
  <i className="bi bi-plus-circle"></i> İhbar Ver
</button>

                <Link
                  to="/vets"
                  className="btn btn-outline-success btn-lg"
                >
                  <i className="bi bi-geo-alt"></i> Veterinerler
                </Link>

              </div>
              <div className="row mt-5 g-3">

  <div className="col-md-3">
    <Link to="/myreports" className="text-decoration-none">
      <div className="card shadow-sm border-0 text-center p-4 h-100">
        <i className="bi bi-card-list display-5 text-success"></i>
        <h5 className="mt-3 text-nowrap">İhbarlarım</h5>
      </div>
    </Link>
  </div>

  <div className="col-md-3">
    <Link to="/profile" className="text-decoration-none">
      <div className="card shadow-sm border-0 text-center p-4 h-100">
        <i className="bi bi-person-circle display-5 text-success"></i>
        <h5 className="mt-3 text-nowrap">Profilim</h5>
      </div>
    </Link>
  </div>

  <div className="col-md-3">
    <Link to="/notifications" className="text-decoration-none">
      
      <div className="card shadow-sm border-0 text-center p-4 h-100">
        <i className="bi bi-bell-fill display-5 text-success"></i>
        <h5 className="mt-3 text-nowrap">Bildirimler</h5>
      </div>
    </Link>
  </div>

  <div className="col-md-3">
    <Link to="/nearby-reports" className="text-decoration-none">
      <div className="card shadow-sm border-0 text-center p-4 h-100">
        <i className="bi bi-geo-alt-fill display-5 text-success"></i>
        <h5 className="mt-3">
    <span style={{ whiteSpace: "nowrap" }}>
        Yakındaki
    </span>
    <br />
    <span style={{ whiteSpace: "nowrap" }}>
        İhbarlar
    </span>
</h5>
      </div>
    </Link>
  </div>

</div>

            </div>

            <div className="col-lg-6 text-center">

              <i
                className="bi bi-heart-pulse-fill text-success"
                style={{ fontSize: "220px" }}
              ></i>

            </div>

          </div>

        </div>
      </section>
      <section className="py-5 bg-light">
  <div className="container">

    <div className="row text-center g-4">

      <div className="col-md-3">
        <div className="card stat-card shadow border-0 p-4">
          <i className="bi bi-megaphone-fill text-success display-5"></i>

          <h2 className="fw-bold mt-3">{dashboard.totalReports}</h2>

          <p className="text-muted">
            Toplam İhbarım
          </p>
        </div>
      </div>

      <div className="col-md-3">
        <div className="card stat-card shadow border-0 p-4">
          <i className="bi bi-hospital-fill text-success display-5"></i>

        <h2 className="fw-bold mt-3">{dashboard.waiting}</h2>

          <p className="text-muted">
            Bekleyen
          </p>
        </div>
      </div>

      <div className="col-md-3">
        <div className="card feature-card h-100 shadow-sm border-0 text-center p-4">
          <i className="bi bi-heart-fill text-success display-5"></i>

          <h2 className="fw-bold mt-3">{dashboard.reviewing}</h2>

          <p className="text-muted">
            İnceleniyor
          </p>
        </div>
      </div>

      <div className="col-md-3">
        <div className="card feature-card h-100 shadow-sm border-0 text-center p-4">
          <i className="bi bi-geo-alt-fill text-success display-5"></i>

          <h2 className="fw-bold mt-3">{dashboard.completed}</h2>

          <p className="text-muted">
            Tamamlanan
          </p>
        </div>
      </div>

    </div>

  </div>
</section>
<section className="py-5">
  <div className="container">

    <div className="text-center mb-5">
      <h2 className="fw-bold">Neler Sunuyoruz?</h2>
      <p className="text-muted">
        PatiDestek ile hayvan dostlarımız için hızlı ve güvenilir çözümler.
      </p>
    </div>

    <div className="row g-4">

      <div className="col-md-3">
        <div className="card feature-card h-100 shadow-sm border-0 text-center p-4">
          <i className="bi bi-megaphone-fill display-4 text-success"></i>
          <h4 className="mt-3">İhbar Oluştur</h4>
          <p className="text-muted">
            Kayıp, yaralı veya yardıma ihtiyacı olan hayvanlar için saniyeler içinde ihbar oluştur.
          </p>
        </div>
      </div>

      <div className="col-md-3">
        <div className="card feature-card h-100 shadow-sm border-0 text-center p-4">
          <i className="bi bi-geo-alt-fill display-4 text-success"></i>
          <h4 className="mt-3">Harita</h4>
          <p className="text-muted">
            Tüm ihbarları ve veterinerleri harita üzerinde görüntüle.
          </p>
        </div>
      </div>

      <div className="col-md-3">
        <div className="card feature-card h-100 shadow-sm border-0 text-center p-4">
          <i className="bi bi-hospital-fill display-4 text-success"></i>
          <h4 className="mt-3">Veterinerler</h4>
          <p className="text-muted">
            Sana en yakın veterinerleri tek tıkla bul.
          </p>
        </div>
      </div>

      <div className="col-md-3">
        <div className="card feature-card h-100 shadow-sm border-0 text-center p-4">
          <i className="bi bi-bell-fill display-4 text-success"></i>
          <h4 className="mt-3">Canlı Bildirim</h4>
          <p className="text-muted">
            SignalR ile ihbar durumlarını anlık olarak takip et.
          </p>
        </div>
      </div>

    </div>

  </div>
</section>
<section className="py-5 bg-light">
  <div className="container">

    <h2 className="fw-bold mb-4">
      📋 Son İhbarlarım
    </h2>

    {recentReports.length === 0 ? (

      <div className="alert alert-info">
        Henüz bir ihbar oluşturmadınız.
      </div>

    ) : (

      <div className="row g-4">

        {recentReports.map((report) => (

          <div className="col-md-6" key={report.id}>
<div
  className="card shadow-sm border-0 h-100"
  style={{ cursor: "pointer" }}
  onClick={() => navigate(`/report/${report.id}`)}
>
  <div className="card-body">

    <h5 className="fw-bold">
      🐾 {report.title}
    </h5>

    <p className="text-muted mb-2">
      📍 {report.location}
    </p>

    <span className="badge bg-success">
      {report.status}
    </span>

  </div>
</div>

          </div>

        ))}

      </div>

    )}

  </div>
</section>
    </>
  );
}

export default Home;