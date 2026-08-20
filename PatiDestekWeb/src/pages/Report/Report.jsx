import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";

function Report() {
  const navigate = useNavigate();

  const [report, setReport] = useState({
  animalType: "",
  category: "",
  priority: "",
  description: "",
  district: "",
  location: "",
  latitude: 0,
  longitude: 0,
});

  const [photo, setPhoto] = useState(null);
  const getLocation = () => {
  if (!navigator.geolocation) {
    toast.error("Tarayıcınız konum desteği sunmuyor.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      setReport((prev) => ({
        ...prev,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      }));
      fetch(
  `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`
)
  .then((res) => res.json())
  .then((data) => {
  setReport((prev) => ({
    ...prev,
   district:
  data.address.suburb ||
  data.address.neighbourhood ||
  data.address.city_district ||
  data.address.village ||
  data.address.town ||
  "",

    location: data.display_name,
  }));
});

      toast.success("Konum başarıyla alındı.");
    },
    () => {
      toast.error("Konum alınamadı.");
    }
  );
};

  const handleChange = (e) => {
    setReport({
      ...report,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
   if (
  !report.animalType ||
  !report.category ||
  !report.priority ||
  !report.description ||
  !report.district ||
  !report.location
)
    
    {
  toast.error("Lütfen tüm zorunlu alanları doldurun.");
  return;
}

    try {
      const token = localStorage.getItem("token");

      const response = await api.post("/Report", report, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const reportId = response.data.report.id;
      if (photo) {
    const formData = new FormData();
    formData.append("image", photo);

    await api.post(`/Report/${reportId}/upload-image`, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

      toast.success("İhbar başarıyla oluşturuldu.");

      navigate("/myreports");
    } catch (error) {
  console.log(error);
  console.log(error.response);
  console.log(error.response?.data);

  alert(JSON.stringify(error.response?.data, null, 2));

  toast.error("İhbar oluşturulamadı.");
}
  };

  return (
    <div className="container py-5">

      <div className="card shadow-lg border-0">

        <div className="card-body p-5">

          <h2 className="fw-bold mb-4">
            🐾 Yeni İhbar Oluştur
          </h2>

          <form onSubmit={handleSubmit}>

            <div className="mb-3">
              <label className="form-label">
                Hayvan Türü
              </label>

              <select
  className="form-select"
  name="animalType"
  value={report.animalType}
  onChange={handleChange}
>
  <option value="" disabled>
    Hayvan Türü Seçiniz
  </option>

  <option value="Kedi">🐱 Kedi</option>
  <option value="Köpek">🐶 Köpek</option>
  <option value="Kuş">🐦 Kuş</option>
  <option value="Tavşan">🐰 Tavşan</option>
  <option value="Kaplumbağa">🐢 Kaplumbağa</option>
  <option value="Kirpi">🦔 Kirpi</option>
  <option value="At">🐴 At</option>
  <option value="Keçi">🐐 Keçi</option>
  <option value="Koyun">🐑 Koyun</option>
  <option value="İnek">🐄 İnek</option>
  <option value="Ördek">🦆 Ördek</option>
  <option value="Diğer">🐾 Diğer</option>
</select>
            </div>

            <div className="mb-3">
              <label className="form-label">
                Kategori
              </label>

              <select
                className="form-select"
                name="category"
                value={report.category}
                onChange={handleChange}
              >
                 <option value="" disabled>
    Kategori Seçiniz
  </option>


 <option value="YaraliHayvan">Yaralı Hayvan</option>
<option value="MamaIhtiyaci">Mama İhtiyacı</option>
<option value="SuIhtiyaci">Su İhtiyacı</option>
<option value="KayipHayvan">Kayıp Hayvan</option>
<option value="Sahiplendirme">Sahiplendirme</option>
<option value="GeciciYuva">Geçici Yuva</option>
<option value="AcilKurtarma">Acil Kurtarma</option>
<option value="OluHayvan">Ölü Hayvan</option>
<option value="Diger">Diğer</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">
                Öncelik
              </label>

              <select
                className="form-select"
                name="priority"
                value={report.priority}
                onChange={handleChange}
              >
                <option value="" disabled>
  Öncelik Seçiniz
</option>
                <option value="Dusuk">Düşük</option>
<option value="Orta">Orta</option>
<option value="Yuksek">Yüksek</option>
<option value="Kritik">Kritik</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">
                Açıklama
              </label>

              <textarea
                rows="5"
                className="form-control"
                name="description"
                value={report.description}
                onChange={handleChange}
                placeholder="Lütfen detaylı açıklama yazınız."
              />
            </div>
            <div className="mb-3">
  <label className="form-label">
    Mahalle
  </label>

  <select
  className="form-select"
  name="district"
  value={report.district}
  onChange={handleChange}
>
  <option value="">Mahalle Seçiniz</option>

  <option value="Atatürk Mahallesi">Atatürk Mahallesi</option>
  <option value="Bahçelievler Mahallesi">Bahçelievler Mahallesi</option>
  <option value="Cumhuriyet Mahallesi">Cumhuriyet Mahallesi</option>
  <option value="İnönü Mahallesi">İnönü Mahallesi</option>
  <option value="İsmetpaşa Mahallesi">İsmetpaşa Mahallesi</option>
  <option value="Karaağaç Mahallesi">Karaağaç Mahallesi</option>
  <option value="Mimar Sinan Mahallesi">Mimar Sinan Mahallesi</option>
  <option value="Pınarça Mahallesi">Pınarça Mahallesi</option>
  <option value="Yıldızkent Mahallesi">Yıldızkent Mahallesi</option>

</select>
</div>

            <div className="mb-3">
              <label className="form-label">
                Açık Adres
              </label>

              <input
                className="form-control"
                name="location"
                value={report.location}
                onChange={handleChange}
                placeholder="Örn: Kapaklı Atatürk Mahallesi"
              />
            </div>
<div className="mb-3">
  <button
    type="button"
    className="btn btn-outline-primary"
    onClick={getLocation}
  >
    📍 Konumumu Al
  </button>
  <small className="text-muted">
📍 Konumumu Al butonuna bastığınızda mahalle ve açık adres otomatik doldurulacaktır.
</small>
</div>
{report.latitude !== 0 && report.longitude !== 0 && (
  <div className="alert alert-success mt-3">
    <strong>Konum alındı.</strong>
    <br />
    Enlem: {report.latitude}
    <br />
    Boylam: {report.longitude}
  </div>
)}
            <div className="mb-4">
              <label className="form-label">
                Fotoğraf
              </label>

              <input
                type="file"
                className="form-control"
                onChange={(e) => setPhoto(e.target.files[0])}
              />
            </div>

            <button
              type="submit"
              className="btn btn-success w-100"
            >
              🐾 İhbarı Oluştur
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}

export default Report;