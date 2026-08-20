import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api, { API_ORIGIN } from "../../services/api";
import { toast } from "react-toastify";
import { getStaff } from "../../services/staffService";

function AdminReportDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [report, setReport] = useState(null);
    const [status, setStatus] = useState("");
    const [updatingStatus, setUpdatingStatus] = useState(false);
const [adminNote, setAdminNote] = useState("");
const [savingNote, setSavingNote] = useState(false);
const [showDeleteModal, setShowDeleteModal] = useState(false);
const [staff, setStaff] = useState([]);
const [selectedStaff, setSelectedStaff] = useState("");
const [timeline, setTimeline] = useState([]);
const [assigningStaff, setAssigningStaff] = useState(false);
    const loadReport = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await api.get(`/Report/Admin/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setReport(response.data);
setStatus(response.data.status || "Bekliyor");
setAdminNote(response.data.adminNote || "");
const timelineResponse = await api.get(`/Report/${id}/timeline`, {
    headers: {
        Authorization: `Bearer ${token}`,
    },
});

setTimeline(timelineResponse.data);
        } catch (error) {
            console.log(error);
            toast.error("İhbar bilgileri yüklenemedi.");
        }
    };

    useEffect(() => {
        loadReport();
    }, [id]);
    useEffect(() => {
    const loadStaff = async () => {
        try {
            const data = await getStaff();
            setStaff(data);
        } catch (error) {
            console.error("Görevliler yüklenemedi:", error);
            toast.error("Görevliler yüklenemedi.");
        }
    };

    loadStaff();
}, []);
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
const handleSaveAdminNote = async () => {
    try {
        setSavingNote(true);

        const token = localStorage.getItem("token");

        await api.put(
            `/Report/${id}/admin-note`,
            JSON.stringify(adminNote),
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        


        toast.success("Belediye notu kaydedildi.");

        await loadReport();

    } catch (error) {
        console.log(error);

        toast.error(
            error.response?.data?.message ||
            "Belediye notu kaydedilemedi."
        );
    } finally {
        setSavingNote(false);
    }
};

const handleDeleteReport = async () => {
    try {
        const token = localStorage.getItem("token");

        await api.delete(`/Report/Admin/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        setShowDeleteModal(false);

        toast.success("İhbar başarıyla silindi.");

        navigate("/admin/reports");
    } catch (error) {
        console.log(error);

        toast.error(
            error.response?.data?.message ||
            "İhbar silinemedi."
        );
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
                        🐾 Belediye İhbar Detayı
                    </h2>

                    <span className="text-muted">
                        İhbar No: #{report.id}
                    </span>
                    <div/> 
                    {JSON.parse(localStorage.getItem("user"))?.role === "SuperAdmin" && (
    <button
        className="btn btn-danger"
        onClick={() => setShowDeleteModal(true)}
    >
        🗑️ İhbarı Sil
    </button>
)}
                    
                </div>

            
            </div>

            <div className="row g-4">

                {/* SOL TARAF */}
                <div className="col-lg-8">

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
                        <strong>{item.title}</strong>

                        {item.description && (
                            <p className="mb-1 mt-1">
                                {item.description}
                            </p>
                        )}

                        <small className="text-muted">
                            {new Date(item.createdAt).toLocaleString("tr-TR")}
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

                            <p>
                                <strong>✉️ E-Posta</strong>
                                <br />

                                {report.user?.email || "-"}
                            </p>

                        </div>

                    </div>
                    {/* GÖREVLİ */}
                 {["SuperAdmin", "Municipality"].includes(
    JSON.parse(localStorage.getItem("user"))?.role
) && (
<div className="card shadow-sm border-0 mb-4">

    <div className="card-header bg-light">
        <h5 className="mb-0">
            👷 Görevli Atama
        </h5>
    </div>

    <div className="card-body">

        <select
            className="form-select mb-3"
            value={selectedStaff}
            onChange={(e) => setSelectedStaff(e.target.value)}
        >
            <option value="">
                Görevli seçin
            </option>
            {staff
    .filter((person) => {
        const role = JSON.parse(localStorage.getItem("user"))?.role;

        // Municipality sadece veterinerleri görsün
        if (role === "Municipality") {
            return person.role === "Veterinarian";
        }

        // SuperAdmin mevcut şekilde herkesi görsün
        return true;
    })
    .map((person) => (
        <option key={person.id} value={person.id}>
            {person.firstName} {person.lastName}
            {person.role === "Veterinarian"
                ? " - Veteriner"
                : " - Belediye Görevlisi"}
        </option>
    ))}

            
        </select>

        <button
            className="btn btn-success"
            disabled={!selectedStaff || assigningStaff}
            onClick={async () => {
                try {
                    setAssigningStaff(true);

                    const token = localStorage.getItem("token");

                    await api.post(
                        `/Report/${id}/assign/${selectedStaff}`,
                        {},
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                    toast.success("Görevli başarıyla atandı.");

                    await loadReport();

                } catch (error) {
                    console.log(error);

                    toast.error(
                        error.response?.data?.message ||
                        "Görevli atanamadı."
                    );
                } finally {
                    setAssigningStaff(false);
                }
            }}
        >
            {assigningStaff
                ? "Atanıyor..."
                : report.assignedStaff
                    ? "Görevliyi Değiştir"
                    : "Görevli Ata"}
        </button>

        <hr />

        <strong>Mevcut Görevli</strong>

        <div className="mt-2">
            {report.assignedStaff ? (
                <>
                    {report.assignedStaff.role === "Veterinarian"
                        ? "🩺 "
                        : "🏛️ "}

                    {report.assignedStaff.firstName}{" "}
                    {report.assignedStaff.lastName}
                </>
            ) : (
                <span className="text-muted">
                    Henüz görevli atanmadı.
                </span>
            )}
        </div>
    
    </div>
</div>
           )}


                    


                    {/* BELEDİYE NOTU */}
                    <div className="card shadow-sm border-0">

    <div className="card-header bg-warning">
        <h5 className="mb-0">
            📝 Belediye Notu
        </h5>
    </div>

    <div className="card-body">

        <textarea
            className="form-control mb-3"
            rows="5"
            placeholder="İhbar hakkında belediye notunuzu yazın..."
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
        />

        <button
            className="btn btn-warning"
            onClick={handleSaveAdminNote}
            disabled={savingNote}
        >
            {savingNote
                ? "Kaydediliyor..."
                : "📝 Notu Kaydet"}
        </button>

    </div>

</div>

                </div>

                       </div>

            {showDeleteModal && (
                <div
                    className="modal d-block"
                    tabIndex="-1"
                    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">

                            <div className="modal-header">
                                <h5 className="modal-title">
                                    ⚠️ İhbarı Sil
                                </h5>

                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowDeleteModal(false)}
                                ></button>
                            </div>

                            <div className="modal-body">
                                <p className="mb-0">
                                    Bu ihbarı silmek istediğinize emin misiniz?
                                </p>
                            </div>

                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowDeleteModal(false)}
                                >
                                    Vazgeç
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={handleDeleteReport}
                                >
                                    🗑️ Sil
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}


export default AdminReportDetail;