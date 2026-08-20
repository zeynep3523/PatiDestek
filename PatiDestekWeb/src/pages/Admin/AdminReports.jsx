import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getStaff } from "../../services/staffService";
import api, { API_ORIGIN } from "../../services/api";
import { toast } from "react-toastify";

function AdminReports() {
    const navigate = useNavigate();
    const [reports, setReports] = useState([]);
    const [staff, setStaff] = useState([]);
    const [selectedStaff, setSelectedStaff] = useState({});
    const [editingStaff, setEditingStaff] = useState({});

    // İhbarları getir
    const loadReports = async () => {
        try {
            const token = localStorage.getItem("token");
            const user = JSON.parse(localStorage.getItem("user"));

const endpoint =
    user?.role === "Municipality"
        ? `${API_ORIGIN}/api/Report/MyAssignedReports`
        : `${API_ORIGIN}/api/Report/All`;

const response = await axios.get(endpoint, 
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("İHBARLAR:", response.data);
            setReports(response.data);
        } catch (error) {
            console.error("İhbarlar yüklenemedi:", error);
            toast.error("İhbarlar yüklenemedi.");
        }
    };

    // Görevlileri getir
    const loadStaff = async () => {
        try {
            const data = await getStaff();
            setStaff(data);
        } catch (error) {
            console.error("Görevliler yüklenemedi:", error);
            toast.error("Görevliler yüklenemedi.");
        }
    };

    useEffect(() => {
        loadReports();
        loadStaff();
    }, []);

    // Görevli ata / değiştir
    const handleAssignStaff = async (reportId) => {
        const staffId = selectedStaff[reportId];

        if (!staffId) {
            toast.error("Lütfen bir görevli seçin.");
            return;
        }

        try {
            await api.post(`/Report/${reportId}/assign/${staffId}`);

            toast.success("Görevli başarıyla atandı.");

            await loadReports();

            setEditingStaff((prev) => ({
                ...prev,
                [reportId]: false,
            }));
        } catch (error) {
            console.error("Görevli atanamadı:", error);
            toast.error("Görevli atanamadı.");
        }
    };

    // Değiştir butonuna bas
    const handleEditStaff = (report) => {
        setEditingStaff((prev) => ({
            ...prev,
            [report.id]: true,
        }));

        if (report.assignedStaff) {
            setSelectedStaff((prev) => ({
                ...prev,
                [report.id]: report.assignedStaff.id,
            }));
        }
    };

    // İptal
    const handleCancelEdit = (reportId) => {
        setEditingStaff((prev) => ({
            ...prev,
            [reportId]: false,
        }));
    };
    const formatCategory = (category) => {
    switch (category) {
        case "YaraliHayvan":
            return "Yaralı Hayvan";

        case "MamaIhtiyaci":
            return "Mama İhtiyacı";

        case "SuIhtiyaci":
            return "Su İhtiyacı";

        case "KayipHayvan":
            return "Kayıp Hayvan";

        case "Sahiplendirme":
            return "Sahiplendirme";

        case "GeciciYuva":
            return "Geçici Yuva";

        case "AcilKurtarma":
            return "Acil Kurtarma";

        case "OluHayvan":
            return "Ölü Hayvan";

        case "Diger":
            return "Diğer";

        default:
            return category || "-";
    }
};

    return (
        <div className="container mt-4">

    <div className="d-flex justify-content-between align-items-center mb-4">

        <h2 className="mb-0">
            İhbar Yönetimi
        </h2>

        {JSON.parse(localStorage.getItem("user"))?.role === "SuperAdmin" && (
            <button
                type="button"
                className="btn btn-success"
                onClick={() => navigate("/admin/create-staff")}
            >
                👨‍💼 Yeni Görevli
            </button>
        )}

    </div>

            <div className="table-responsive">
            <table className="table table-striped table-bordered align-middle">

                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Hayvan</th>
                        <th>Kategori</th>
                        <th>Durum</th>
                        <th>Kullanıcı</th>
                        <th>Telefon</th>
                        <th>Konum</th>
                        <th>Tarih</th>
                        <th>Görevli</th>
                        <th>İşlem</th>
                    </tr>
                </thead>

                <tbody>

                    {reports.map((report) => {

                        const isEditing = editingStaff[report.id];

                        return (
                            <tr key={report.id}>

                                <td>{report.id}</td>

                                <td>
    {report.animalName ||
        report.animal ||
        report.animalType ||
        report.AnimalName ||
        report.AnimalType ||
        report.animal?.name ||
        "-"}
</td>

                                <td>{formatCategory(report.category)}</td>

                                <td>{report.status || "-"}</td>

                                <td>
                                    {report.user
                                        ? `${report.user.firstName} ${report.user.lastName}`
                                        : "-"}
                                </td>

                                <td>
                                    {report.user?.phone || "-"}
                                </td>

                                <td>
                                    {report.location || "-"}
                                </td>

                                <td>
    {(() => {
        const dateKey = Object.keys(report).find((key) =>
            /created|date|tarih/i.test(key)
        );

        const dateValue = dateKey ? report[dateKey] : null;

        return dateValue
            ? new Date(dateValue).toLocaleDateString("tr-TR")
            : "-";
    })()}
</td>

                                {/* SADECE GÖREVLİ BİLGİSİ */}
                                <td>
                                    {report.assignedStaff ? (
                                        <strong>
                                            {report.assignedStaff.role ===
                                            "Veterinarian"
                                                ? "🩺 "
                                                : "🏛️ "}

                                            {report.assignedStaff.firstName}{" "}
                                            {report.assignedStaff.lastName}
                                        </strong>
                                    ) : (
                                        <span className="text-muted">
                                            Görevli Yok
                                        </span>
                                    )}
                                </td>

                                {/* SADECE BURADA ATAMA / DEĞİŞTİRME */}
                                <td>
                                    <button
    className="btn btn-primary btn-sm"
    onClick={() => navigate(`/admin/reports/${report.id}`)}
>
    👁️ Detay
</button>

                                    {/* GÖREVLİ YOKSA */}
                                    {!report.assignedStaff && !isEditing && (
                                        <div className="d-flex gap-2">

                                            <select
                                                className="form-select"
                                                value={
                                                    selectedStaff[report.id] || ""
                                                }
                                                onChange={(e) =>
                                                    setSelectedStaff((prev) => ({
                                                        ...prev,
                                                        [report.id]:
                                                            e.target.value,
                                                    }))
                                                }
                                            >
                                                <option value="">
                                                    Görevli Seçiniz
                                                </option>

                                                {staff.map((person) => (
                                                    <option
                                                        key={person.id}
                                                        value={person.id}
                                                    >
                                                        {person.role ===
                                                        "Veterinarian"
                                                            ? "🩺 "
                                                            : "🏛️ "}

                                                        {person.firstName}{" "}
                                                        {person.lastName}
                                                    </option>
                                                ))}
                                            </select>

                                            <button
                                                className="btn btn-success"
                                                onClick={() =>
                                                    handleAssignStaff(
                                                        report.id
                                                    )
                                                }
                                            >
                                                + Ata
                                            </button>

                                        </div>
                                    )}

                                    
                                    

                                    {/* DEĞİŞTİRME MODU */}
                                    {isEditing && (
                                        <div className="d-flex gap-2">

                                            <select
                                                className="form-select"
                                                value={
                                                    selectedStaff[report.id] || ""
                                                }
                                                onChange={(e) =>
                                                    setSelectedStaff((prev) => ({
                                                        ...prev,
                                                        [report.id]:
                                                            e.target.value,
                                                    }))
                                                }
                                            >
                                                <option value="">
                                                    Görevli Seçiniz
                                                </option>

                                                {staff.map((person) => (
                                                    <option
                                                        key={person.id}
                                                        value={person.id}
                                                    >
                                                        {person.role ===
                                                        "Veterinarian"
                                                            ? "🩺 "
                                                            : "🏛️ "}

                                                        {person.firstName}{" "}
                                                        {person.lastName}
                                                    </option>
                                                ))}
                                            </select>

                                            <button
                                                className="btn btn-warning"
                                                onClick={() =>
                                                    handleAssignStaff(
                                                        report.id
                                                    )
                                                }
                                            >
                                                Değiştir
                                            </button>

                                            <button
                                                className="btn btn-secondary"
                                                onClick={() =>
                                                    handleCancelEdit(
                                                        report.id
                                                    )
                                                }
                                            >
                                                İptal
                                            </button>

                                        </div>
                                    )}

                                </td>

                            </tr>
                        );
                    })}

                </tbody>

            </table>
            </div>

        </div>
    );
}

export default AdminReports;