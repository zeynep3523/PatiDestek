import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api, { API_ORIGIN } from "../../services/api";
import { toast } from "react-toastify";

function VeterinarianReportDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [report, setReport] = useState(null);
    const [status, setStatus] = useState("");
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [timeline, setTimeline] = useState([]);

   const loadReport = async () => {
    try {
        const token = localStorage.getItem("token");

        const response = await api.get(
            `/Report/Veterinarian/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        setReport(response.data);
        setStatus(response.data.status || "Bekliyor");

        // Timeline ayrı yükleniyor
        try {
            const timelineResponse = await api.get(
                `/Report/Veterinarian/${id}/timeline`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setTimeline(timelineResponse.data);
        } catch (timelineError) {
            console.log("Timeline yüklenemedi:", timelineError);
            setTimeline([]);
        }

    } catch (error) {
        console.log("İhbar detay hatası:", error);

        toast.error(
            error.response?.data?.message ||
            "İhbar bilgileri yüklenemedi."
        );
    }
};

    useEffect(() => {
        loadReport();
    }, [id]);

    const handleStatusUpdate = async () => {
        try {
            setUpdatingStatus(true);

            const token = localStorage.getItem("token");

            await api.put(
                `/Report/${id}/status`,
                JSON.stringify(status),
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            toast.success("İhbar durumu güncellendi.");

            await loadReport();

        } catch (error) {
            console.log(error);

            toast.error(
                error.response?.data?.message ||
                "İhbar durumu güncellenemedi."
            );
        } finally {
            setUpdatingStatus(false);
        }
    };

    const formatCategory = (category) => {
        const categories = {
            YaraliHayvan: "Yaralı Hayvan",
            MamaIhtiyaci: "Mama İhtiyacı",
            SuIhtiyaci: "Su İhtiyacı",
            KayipHayvan: "Kayıp Hayvan",
            Sahiplendirme: "Sahiplendirme",
            GeciciYuva: "Geçici Yuva",
            AcilKurtarma: "Acil Kurtarma",
            OluHayvan: "Ölü Hayvan",
            Diger: "Diğer",
        };

        return categories[category] || category || "-";
    };

    const formatPriority = (priority) => {
        const priorities = {
            Dusuk: "Düşük",
            Orta: "Orta",
            Yuksek: "Yüksek",
            Kritik: "Kritik",
        };

        return priorities[priority] || priority || "-";
    };

    if (!report) {
        return (
            <div className="container mt-4">
                <h3>Yükleniyor...</h3>
            </div>
        );
    }

    return (
        <div className="container py-4">

            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>

                    <h2 className="fw-bold">
                        🩺 Veteriner İhbar Detayı
                    </h2>

                    <span className="text-muted">
                        İhbar No: #{report.id}
                    </span>

                </div>
            </div>

            <div className="row g-4">

                {/* SOL TARAF */}
                <div className="col-lg-8">

                    {/* İHBAR BİLGİLERİ */}
                    <div className="card shadow-sm border-0">

                        <div className="card-header bg-success text-white">
                            <h5 className="mb-0">
                                📋 İhbar Bilgileri
                            </h5>
                        </div>

                        <div className="card-body">

                            <div className="row">

                                <div className="col-md-6 mb-3">
                                    <strong>🐾 Hayvan Türü</strong>

                                    <div className="mt-1">
                                        {report.animalType || "-"}
                                    </div>
                                </div>

                                <div className="col-md-6 mb-3">
                                    <strong>📂 Kategori</strong>

                                    <div className="mt-1">
                                        {formatCategory(report.category)}
                                    </div>
                                </div>

                                <div className="col-md-6 mb-3">
                                    <strong>🚨 Öncelik</strong>

                                    <div className="mt-1">
                                        {formatPriority(report.priority)}
                                    </div>
                                </div>

                                {/* DURUM */}
                                <div className="col-md-6 mb-3">

                                    <strong>📌 Durum</strong>

                                    <div className="d-flex gap-2 mt-2">

                                        <select
                                            className="form-select"
                                            value={status}
                                            onChange={(e) =>
                                                setStatus(e.target.value)
                                            }
                                        >

                                            <option value="Bekliyor">
                                                Bekliyor
                                            </option>

                                            <option value="İnceleniyor">
                                                İnceleniyor
                                            </option>

                                            <option value="Müdahale Ediliyor">
                                                Müdahale Ediliyor
                                            </option>

                                            <option value="Tamamlandı">
                                                Tamamlandı
                                            </option>

                                        </select>

                                        <button
                                            className="btn btn-success"
                                            onClick={handleStatusUpdate}
                                            disabled={updatingStatus}
                                        >
                                            {updatingStatus
                                                ? "Güncelleniyor..."
                                                : "Güncelle"}
                                        </button>

                                    </div>

                                </div>

                                <div className="col-12 mb-3">

                                    <strong>📍 Konum</strong>

                                    <div className="mt-1">
                                        {report.location || "-"}
                                    </div>

                                </div>

                                <div className="col-12 mb-3">

                                    <strong>📝 Açıklama</strong>

                                    <div className="mt-2 p-3 bg-light rounded">
                                        {report.description || "-"}
                                    </div>

                                </div>

                                <div className="col-md-6 mb-3">

                                    <strong>📅 Oluşturulma Tarihi</strong>

                                    <div className="mt-1">
                                        {report.createdDate
                                            ? new Date(
                                                report.createdDate
                                            ).toLocaleString("tr-TR")
                                            : "-"}
                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* ZAMAN ÇİZELGESİ */}
                    <div className="card shadow-sm border-0 mt-4">

                        <div className="card-header bg-light">

                            <h5 className="mb-0">
                                🕒 İhbar Geçmişi
                            </h5>

                        </div>

                        <div className="card-body">

                            {timeline.length === 0 ? (

                                <p className="text-muted mb-0">
                                    Henüz işlem geçmişi bulunmuyor.
                                </p>

                            ) : (

                                <div>

                                    {timeline.map((item) => (

                                        <div
                                            key={item.id}
                                            className="border-bottom py-3"
                                        >

                                            <strong>
                                                {item.title}
                                            </strong>

                                            {item.description && (
                                                <p className="mb-1 mt-1">
                                                    {item.description}
                                                </p>
                                            )}

                                            <small className="text-muted">
                                                {new Date(
                                                    item.createdAt
                                                ).toLocaleString("tr-TR")}
                                            </small>

                                        </div>

                                    ))}

                                </div>

                            )}

                        </div>

                    </div>

                    {/* FOTOĞRAF */}
                    {report.imageUrl && (

                        <div className="card shadow-sm border-0 mt-4">

                            <div className="card-header">

                                <h5 className="mb-0">
                                    📸 İhbar Fotoğrafı
                                </h5>

                            </div>

                            <div className="card-body text-center">

                                <img
                                    src={`${API_ORIGIN}${report.imageUrl}`}
                                    alt="İhbar"
                                    className="img-fluid rounded"
                                    style={{
                                        maxHeight: "500px",
                                        objectFit: "contain",
                                    }}
                                />

                            </div>

                        </div>

                    )}

                </div>

                {/* SAĞ TARAF */}
                <div className="col-lg-4">

                    {/* VATANDAŞ */}
                    <div className="card shadow-sm border-0 mb-4">

                        <div className="card-header bg-light">

                            <h5 className="mb-0">
                                👤 Vatandaş Bilgileri
                            </h5>

                        </div>

                        <div className="card-body">

                            <p>
                                <strong>Ad Soyad</strong>
                                <br />

                                {report.user
                                    ? `${report.user.firstName} ${report.user.lastName}`
                                    : "-"}
                            </p>

                            <p>
                                <strong>📞 Telefon</strong>
                                <br />

                                {report.user?.phone || "-"}
                            </p>

                            <p className="mb-0">
                                <strong>✉️ E-Posta</strong>
                                <br />

                                {report.user?.email || "-"}
                            </p>

                        </div>

                    </div>

                    {/* GÖREVLİ */}
                    <div className="card shadow-sm border-0 mb-4">

                        <div className="card-header bg-light">

                            <h5 className="mb-0">
                                🩺 Atanan Veteriner
                            </h5>

                        </div>

                        <div className="card-body">

                            {report.assignedStaff ? (

                                <>
                                    🩺{" "}
                                    {report.assignedStaff.firstName}{" "}
                                    {report.assignedStaff.lastName}
                                </>

                            ) : (

                                <span className="text-muted">
                                    Veteriner bilgisi bulunamadı.
                                </span>

                            )}

                        </div>

                    </div>

                    {/* BELEDİYE NOTU */}
                    <div className="card shadow-sm border-0">

                        <div className="card-header bg-warning">

                            <h5 className="mb-0">
                                📝 Belediye Notu
                            </h5>

                        </div>

                        <div className="card-body">

                            <div className="p-3 bg-light rounded">

                                {report.adminNote ? (
                                    report.adminNote
                                ) : (
                                    <span className="text-muted">
                                        Belediye tarafından henüz not eklenmemiş.
                                    </span>
                                )}

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default VeterinarianReportDetail;