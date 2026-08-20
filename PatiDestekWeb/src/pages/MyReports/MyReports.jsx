import { useEffect, useState } from "react";
import api, { API_ORIGIN } from "../../services/api";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

function MyReports() {
  const [reports, setReports] = useState([]);

  const loadReports = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/Report/MyReports", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setReports(response.data);
    } catch (error) {
      console.log(error);
      toast.error("İhbarlar yüklenemedi.");
    }
  };

  const deleteReport = async (id) => {
    const result = await Swal.fire({
      title: "İhbar silinsin mi?",
      text: "Bu işlem geri alınamaz!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Evet, Sil",
      cancelButtonText: "Vazgeç",
      confirmButtonColor: "#d33",
    });

    if (!result.isConfirmed) return;

    const token = localStorage.getItem("token");

    try {
      await api.delete(`/Report/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Swal.fire({
        icon: "success",
        title: "Başarılı",
        text: "İhbar başarıyla silindi.",
        timer: 1500,
        showConfirmButton: false,
      });

      loadReports();
    } catch (error) {
      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Hata",
        text: "İhbar silinemedi.",
      });
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  return (
    <div className="container py-5">
      <h2 className="mb-4">📋 İhbarlarım</h2>

      {reports.length === 0 ? (
        <div className="alert alert-info">
          Henüz oluşturduğunuz bir ihbar bulunmuyor.
        </div>
      ) : (
        reports.map((report) => (
          <div key={report.id} className="card shadow-sm mb-3">
            <div className="card-body">
              {report.imageUrl && (
                <img
                  src={`${API_ORIGIN}${report.imageUrl}`}
                  alt="İhbar"
                  className="img-fluid rounded mb-3"
                  style={{ maxHeight: "200px", objectFit: "cover" }}
                />
              )}
              <h5>{report.animalType}</h5>
              <p className="mb-2">
  <strong>🆔 İhbar No:</strong> #{report.id}
</p>

              <p>
                <strong>Konum:</strong> {report.location}
              </p>

              <p>
                <strong>Durum:</strong> {report.status}
              </p>

              <p>
                <strong>Tarih:</strong>{" "}
                {new Date(report.createdDate).toLocaleDateString("tr-TR")}
              </p>

              <div className="d-flex gap-2">
                <Link
                  className="btn btn-success"
                  to={`/report/${report.id}`}
                >
                  Detay
                </Link>

                <button
                  className="btn btn-danger"
                  onClick={() => deleteReport(report.id)}
                >
                  Sil
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default MyReports;