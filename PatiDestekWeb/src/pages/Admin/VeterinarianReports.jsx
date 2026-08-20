import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { API_ORIGIN } from "../../services/api";

function VeterinarianReports() {
    const navigate = useNavigate();
    const [reports, setReports] = useState([]);

    const loadReports = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.get(
                `${API_ORIGIN}/api/Report/VeterinarianReports`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("VETERİNER İHBARLARI:", response.data);
            setReports(response.data);

        } catch (error) {
            console.error("İhbarlar yüklenemedi:", error);
            toast.error("İhbarlar yüklenemedi.");
        }
    };

    useEffect(() => {
        loadReports();
    }, []);

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

            <h2 className="mb-4">
                🐾 İhbar Yönetimi
            </h2>

            {reports.length === 0 ? (
                <div className="alert alert-info">
                    Henüz size atanmış bir ihbar bulunmuyor.
                </div>
            ) : (

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

                        {reports.map((report) => (

                            <tr key={report.id}>

                                <td>
                                    {report.id}
                                </td>

                                <td>
                                    {report.animalName ||
                                        report.animal ||
                                        report.animalType ||
                                        report.AnimalName ||
                                        report.AnimalType ||
                                        report.animal?.name ||
                                        "-"}
                                </td>

                                <td>
                                    {formatCategory(report.category)}
                                </td>

                                <td>
                                    {report.status || "-"}
                                </td>

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
                                    {report.createdDate
                                        ? new Date(
                                            report.createdDate
                                        ).toLocaleDateString("tr-TR")
                                        : "-"}
                                </td>

                                <td>
                                    {report.assignedStaff ? (
                                        <strong>
                                            🩺{" "}
                                            {report.assignedStaff.firstName}{" "}
                                            {report.assignedStaff.lastName}
                                        </strong>
                                    ) : (
                                        <span className="text-muted">
                                            Görevli Yok
                                        </span>
                                    )}
                                </td>

                                <td>

                                    <button
                                        className="btn btn-primary btn-sm"
                                        onClick={() =>
                                            navigate(
                                                `/veterinarian/reports/${report.id}`
                                            )
                                        }
                                    >
                                        👁️ Detay
                                    </button>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            )}

        </div>
    );
}

export default VeterinarianReports;