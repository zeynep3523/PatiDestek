import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";

function EditReport() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState({
    animalType: "",
    category: "",
    priority: "",
    description: "",
    location: "",
    latitude: "",
    longitude: "",
  });

  useEffect(() => {
    const loadReport = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await api.get(`/Report/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data);
        setReport(response.data);
      } catch (error) {
        console.log(error);
        toast.error("İhbar yüklenemedi.");
      }
    };

    loadReport();
  }, [id]);

  const handleChange = (e) => {
    setReport({
      ...report,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
console.log(report);
    try {
      const token = localStorage.getItem("token");

      await api.put(`/Report/${id}`, report, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("İhbar başarıyla güncellendi.");
      navigate("/myreports");
    } catch (error) {
  console.log(error.response?.data);
  toast.error("Güncelleme başarısız.");
}
  };

  return (
    <div className="container py-5">
      <div className="card shadow">
        <div className="card-body">

          <h2 className="mb-4">İhbarı Düzenle</h2>

          <form onSubmit={handleSubmit}>

             <div className="mb-3">
  <label>Hayvan Türü</label>

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
  <label>Kategori</label>

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
  <label>Öncelik</label>

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
              <label>Açıklama</label>
              <textarea
                className="form-control"
                name="description"
                rows="4"
                value={report.description}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label>Konum</label>
              <input
                className="form-control"
                name="location"
                value={report.location}
                onChange={handleChange}
              />
            </div>

            <button className="btn btn-success">
              Kaydet
            </button>

          </form>

        </div>
      </div>
    </div>
  );
}

export default EditReport;