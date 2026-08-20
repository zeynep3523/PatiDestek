import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPublicDashboard } from "../../services/dashboardService";
import "../../styles/LandingPage.css";
function LandingPage() {
    const [dashboard, setDashboard] = useState({
    totalReports: 0,
    waiting: 0,
    reviewing: 0,
    completed: 0,
});

useEffect(() => {
    const loadDashboard = async () => {
        try {
            const data = await getPublicDashboard();
            setDashboard(data);
        } catch (error) {
            console.error("Dashboard yüklenemedi:", error);
        }
    };

    loadDashboard();
}, []);
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-white shadow-sm sticky-top">
        <div className="container">

          <Link className="navbar-brand fw-bold fs-3 text-success" to="/">
            🐾 PatiDestek
          </Link>

          <button
            className="navbar-toggler"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            className="collapse navbar-collapse"
            id="navbarNav"
          >
            <ul className="navbar-nav mx-auto">

              <li className="nav-item">
                <a className="nav-link" href="#anasayfa">
                  Ana Sayfa
                </a>
              </li>

              <li className="nav-item">
                <a className="nav-link" href="#hakkimizda">
                  Hakkımızda
                </a>
              </li>
              <li className="nav-item">
    <a className="nav-link" href="#ozellikler">
        Özellikler
    </a>
</li>

              <li className="nav-item">
                <a className="nav-link" href="#nasil-calisir">
                  Nasıl Çalışır?
                </a>
              </li>

              <li className="nav-item">
                <a className="nav-link" href="#iletisim">
                  İletişim
                </a>
              </li>

            </ul>

            <div className="d-flex">

              <Link
                to="/login"
                className="btn btn-outline-success me-2"
              >
                Giriş Yap
              </Link>

              <Link
                to="/register"
                className="btn btn-warning"
              >
                Kayıt Ol
              </Link>

            </div>

          </div>

        </div>
      </nav>
     <section className="hero-section" id="anasayfa">
        <div className="hero-shape hero-shape-1"></div>
<div className="hero-shape hero-shape-2"></div>
  <div className="container">
    <div
  className="row align-items-center justify-content-center"
  style={{ minHeight: "calc(100vh - 76px)" }}
>

      <div className="col-lg-8 text-center">

        <span className="hero-badge">
          🐾 Bir İhbar Bir Can Kurtarabilir
        </span>

        <h1 className="hero-title mt-4">
          Sokak Hayvanlarına
          <br />
          <span>Birlikte Umut Olalım.</span>
        </h1>

        <p className="hero-text mt-4">
          Yaralı, kayıp veya yardıma ihtiyacı olan hayvanları
          saniyeler içerisinde bildirerek belediye ve veterinerlerle
          hızlıca iletişime geçin.
        </p>

        <div className="mt-5">

          <Link
            to="/register"
            className="btn hero-btn me-3"
          >
            🐾 Hemen Başla
          </Link>

        </div>

      </div>

      

    </div>
  </div>
</section>
<section className="about-section py-5 section-page" id="hakkimizda">
  <div className="container">

    <div className="row align-items-center">

      <div className="col-lg-8 mx-auto text-center">

        <div></div>
      </div>

      <div className="col-lg-10 mx-auto text-center">

        <span className="section-tag">
          HAKKIMIZDA
        </span>

        <h2 className="section-title mt-3">
          PatiDestek Nedir?
        </h2>

        <p className="section-text mt-4">
          PatiDestek; yaralı, kayıp veya yardıma ihtiyacı olan
          sokak hayvanlarının hızlı bir şekilde ilgili kurumlara
          ulaştırılmasını sağlayan dijital bir ihbar platformudur.
        </p>

        <p className="section-text">
          Vatandaşlar, belediyeler ve veterinerleri tek bir sistemde
          buluşturarak daha hızlı müdahale edilmesini amaçlar.
        </p>

        <div className="row mt-4">

          <div className="col-6 mb-3">
            ✅ Hızlı İhbar Sistemi
          </div>

          <div className="col-6 mb-3">
            🏥 Veteriner Desteği
          </div>

          <div className="col-6 mb-3">
            📍 Konum Takibi
          </div>

          <div className="col-6 mb-3">
            🔔 Anlık Bildirimler
          </div>

        </div>

      </div>

    </div>

  </div>
</section>
<section
    className="features-section section-page"
    id="ozellikler"
    style={{
        minHeight: "auto",
        padding: "90px 0"
    }}
>

    <div className="container">

        <div className="text-center mb-2">

            <span className="section-tag">
                ÖZELLİKLER
            </span>

            <h2 className="section-title mt-3">
                PatiDestek ile Neler Yapabilirsiniz?
            </h2>

            <p className="section-text">
                Tek platform üzerinden hayvan dostlarımız için hızlıca harekete geçin.
            </p>

        </div>

        <div className="row g-4 justify-content-center">

            <div className="col-lg-4 col-md-6">
                <div className="feature-box">
                    <div className="feature-icon feature-icon-green">🐾</div>
                    <h4>İhbar Oluştur</h4>
                    <p>
                        Yaralı veya yardıma ihtiyacı olan hayvanları saniyeler içerisinde bildir.
                    </p>
                </div>
            </div>

            <div className="col-lg-4 col-md-6">
                <div className="feature-box">
                    <div className="feature-icon feature-icon-blue">📍</div>
                    <h4>Konum Paylaş</h4>
                    <p>
                        Harita üzerinden tam konum göndererek ekiplerin daha hızlı ulaşmasını sağla.
                    </p>
                </div>
            </div>

            <div className="col-lg-4 col-md-6">
                <div className="feature-box">
                    <div className="feature-icon feature-icon-pink">🏥</div>
                    <h4>Veteriner Bul</h4>
                    <p>
                        Sana en yakın veteriner kliniklerini tek tıkla görüntüle.
                    </p>
                </div>
            </div>

            <div className="col-lg-4 col-md-6">
                <div className="feature-box">
                    <div className="feature-icon feature-icon-orange">🔔</div>
                    <h4>Anlık Bildirim</h4>
                    <p>
                        İhbarının durumunu canlı olarak takip et.
                    </p>
                </div>
            </div>

            <div className="col-lg-4 col-md-6">
                <div className="feature-box">
                    <div className="feature-icon feature-icon-purple">🏛️</div>
                    <h4>Belediye Entegrasyonu</h4>
                    <p>
                        İlgili belediyeler ihbarları sistem üzerinden yönetebilir.
                    </p>
                </div>
            </div>

        </div>

    </div>

</section>
<section
    className="process-section section-page"
    id="nasil-calisir"
    style={{
        minHeight: "calc(100vh - 76px)",
        padding: "30px 0"
    }}
>
    <div className="container">

        <div className="text-center mb-3">

            <span className="section-tag">
                NASIL ÇALIŞIR?
            </span>

            <h2 className="section-title mt-3">
                Sadece 4 Adımda Yardım Et
            </h2>

            <p className="section-text">
                PatiDestek sayesinde ihbar oluşturmak oldukça kolaydır.
            </p>

        </div>

        <div className="row g-3">

            <div className="col-lg-3 col-md-6">
                <div className="process-card">
                    <div className="process-number">1</div>
                    <div className="process-icon">📍</div>
                    <h4>Konumu Seç</h4>
                    <p>
                        Yardıma ihtiyacı olan hayvanın konumunu işaretle.
                    </p>
                </div>
            </div>

            <div className="col-lg-3 col-md-6">
                <div className="process-card">
                    <div className="process-number">2</div>
                    <div className="process-icon">📷</div>
                    <h4>Fotoğraf Ekle</h4>
                    <p>
                        Durumu gösteren fotoğrafı sisteme yükle.
                    </p>
                </div>
            </div>

            <div className="col-lg-3 col-md-6">
                <div className="process-card">
                    <div className="process-number">3</div>
                    <div className="process-icon">📨</div>
                    <h4>İhbarı Gönder</h4>
                    <p>
                        Belediye ve ilgili ekipler ihbarını anında görsün.
                    </p>
                </div>
            </div>

            <div className="col-lg-3 col-md-6">
                <div className="process-card">
                    <div className="process-number">4</div>
                    <div className="process-icon">❤️</div>
                    <h4>Takip Et</h4>
                    <p>
                        Müdahale sürecini uygulama üzerinden takip et.
                    </p>
                </div>
            </div>

        </div>

    </div>

</section>

<section className="statistics-section py-5">

    <div className="container">

        <div className="text-center mb-5">

            <span className="section-tag">
                İSTATİSTİKLER
            </span>

            <h2 className="section-title mt-3">
                PatiDestek Rakamlarla
            </h2>

        </div>

        <div className="row g-4">

            <div className="col-md-3">
                <div className="stat-box">
                    <h2>{dashboard.totalReports}</h2>
                    <p>Toplam İhbar</p>
                </div>
            </div>

            <div className="col-md-3">
                <div className="stat-box">
                    <h2>{dashboard.waiting}</h2>
                    <p>Bekleyen</p>
                </div>
            </div>

            <div className="col-md-3">
                <div className="stat-box">
                    <h2>{dashboard.reviewing}</h2>
                    <p>İnceleniyor</p>
                </div>
            </div>

            <div className="col-md-3">
                <div className="stat-box">
                    <h2>{dashboard.completed}</h2>
                    <p>Tamamlanan</p>
                </div>
            </div>

        </div>

    </div>

</section>
{/* İletişim */}
<section
    className="contact-section section-page"
    id="iletisim"
    style={{
        minHeight: "calc(100vh - 76px)",
        padding: "30px 0"
    }}
>
    <div className="container">

        {/* Başlık */}
        <div className="text-center mb-4">
            <h2 className="section-title">
                Bize Ulaşın
            </h2>

            <p className="section-text">
                Kapaklı Belediyesi iletişim bilgileri
            </p>
        </div>

        {/* Kartlar */}
        <div className="row g-4 justify-content-center">

            {/* İletişim Bilgileri */}
            <div className="col-lg-6">
                <div className="card shadow border-0 h-100">
                    <div className="card-body p-4">

                        <h5 className="fw-bold mb-4">
                            📍 İletişim Bilgileri
                        </h5>

                        <p>
    <strong>Adres:</strong><br />
    <a
        href="https://www.google.com/maps/dir/?api=1&destination=Kapaklı+Belediyesi,+Tekirdağ"
        target="_blank"
        rel="noreferrer"
    >
        İnönü Mah. Eski Cami Cad.
        No:4-6 Kapaklı / Tekirdağ
    </a>
</p>

                        <p>
                            <strong>Telefon:</strong><br />
                            <a href="tel:4448059">
                                444 80 59
                            </a>
                        </p>

                        <p>
                            <strong>WhatsApp:</strong><br />
                            <a href="https://wa.me/905309556463">
                                0530 955 64 63
                            </a>
                        </p>

                        <p>
                            <strong>E-Posta (KEP):</strong><br />
                            <a href="mailto:kapaklibelediyesi@hs01.kep.tr">
                                kapaklibelediyesi@hs01.kep.tr
                            </a>
                        </p>

                    </div>
                </div>
            </div>

            {/* Sosyal Medya */}
            <div className="col-lg-6">
                <div className="card shadow border-0 h-100">
                    <div className="card-body p-4">

                        <h5 className="fw-bold mb-4">
                            🌐 Sosyal Medya
                        </h5>

                        <p>
                            📷 Instagram<br />
                            <a
                                href="https://www.instagram.com/kapaklibld/"
                                target="_blank"
                                rel="noreferrer"
                            >
                                @kapaklibld
                            </a>
                        </p>

                        <p>
                            🌍 Web Sitesi<br />
                            <a
                                href="https://www.kapakli.bel.tr"
                                target="_blank"
                                rel="noreferrer"
                            >
                                www.kapakli.bel.tr
                            </a>
                        </p>

                        <p>
                            📘 Facebook<br />
                            <a
                                href="https://www.facebook.com/kapaklibld"
                                target="_blank"
                                rel="noreferrer"
                            >
                                Kapaklı Belediyesi
                            </a>
                        </p>

                        <p>
                            𝕏 X (Twitter)<br />
                            <a
                                href="https://x.com/kapaklibld"
                                target="_blank"
                                rel="noreferrer"
                            >
                                @kapaklibld
                            </a>
                        </p>

                    </div>
                </div>
            </div>

        </div>

    </div>
</section>
<footer className="footer-section py-4">
  <div className="container">

    <div className="row g-3 align-items-stretch">

      <div className="col-md-6">
        <h4 className="fw-bold text-success">🐾 PatiDestek</h4>
        <p className="text-muted mb-0">
          Sokak hayvanlarının daha hızlı yardım alabilmesi için geliştirilen
          dijital ihbar platformu.
        </p>
      </div>

      <div className="col-md-6 text-md-end mt-4 mt-md-0">
        <p className="mb-1">
          © 2026 PatiDestek
        </p>

        <small className="text-muted">
          Kapaklı Belediyesi ile geliştirilmiştir.
        </small>
      </div>

    </div>

  </div>
</footer>
    </>

  );
}

export default LandingPage;