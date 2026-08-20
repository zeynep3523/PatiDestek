import { useEffect, useState } from "react";
import { getStaffById, updateStaff } from "../../services/staffService";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

function EditStaff() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const [staff, setStaff] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        jobTitle: "",
        role: ""
    });

    useEffect(() => {
        loadStaff();
    }, []);

    const loadStaff = async () => {
        try {
            const data = await getStaffById(id);

            setStaff({
                firstName: data.firstName || "",
                lastName: data.lastName || "",
                email: data.email || "",
                phone: data.phone || "",
                password: "",
                jobTitle: data.jobTitle || "",
                role: data.role || ""
            });
        } catch (error) {
            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Görevli bilgileri yüklenemedi."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setStaff({
            ...staff,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !staff.firstName.trim() ||
            !staff.lastName.trim() ||
            !staff.phone.trim() ||
            !staff.email.trim() ||
            !staff.jobTitle.trim() ||
            !staff.role.trim()
        ) {
            toast.error("Lütfen tüm alanları doldurun.");
            return;
        }

        try {
            await updateStaff(id, staff);

            toast.success("Görevli başarıyla güncellendi.");

            navigate("/admin/staff");
        } catch (error) {
            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Görevli güncellenemedi."
            );
        }
    };

    if (loading) {
        return (
            <div className="container py-4">
                <h3>Görevli bilgileri yükleniyor...</h3>
            </div>
        );
    }

    return (
        <div className="container py-4">

            <div className="card shadow">

                <div className="card-body">

                    <h2 className="mb-4">
                        ✏️ Görevliyi Düzenle
                    </h2>

                    <form onSubmit={handleSubmit} autoComplete="off">

                        <input
                            className="form-control mb-3"
                            placeholder="Ad"
                            name="firstName"
                            value={staff.firstName}
                            onChange={handleChange}
                        />

                        <input
                            className="form-control mb-3"
                            placeholder="Soyad"
                            name="lastName"
                            value={staff.lastName}
                            onChange={handleChange}
                        />

                        <input
                            className="form-control mb-3"
                            placeholder="Telefon"
                            name="phone"
                            value={staff.phone}
                            onChange={handleChange}
                        />

                        <input
                            className="form-control mb-3"
                            placeholder="E-Posta"
                            name="email"
                            value={staff.email}
                            onChange={handleChange}
                        />

                        <input
                            className="form-control mb-3"
                            placeholder="Yeni şifre (değiştirmek istemiyorsanız boş bırakın)"
                            type="password"
                            name="password"
                            value={staff.password}
                            autoComplete="new-password"
                            onChange={handleChange}
                        />

                        <input
                            className="form-control mb-3"
                            placeholder="Görev"
                            name="jobTitle"
                            value={staff.jobTitle}
                            onChange={handleChange}
                        />

                        <select
                            className="form-select mb-4"
                            name="role"
                            value={staff.role}
                            onChange={handleChange}
                        >
                            <option value="">
                                Rolü seçiniz
                            </option>

                            <option value="Municipality">
                                🏛️ Belediye Personeli
                            </option>

                            <option value="Veterinarian">
                                🩺 Veteriner
                            </option>
                        </select>

                        <div className="d-flex gap-2">

                            <button
                                type="button"
                                className="btn btn-secondary w-50"
                                onClick={() => navigate("/admin/staff")}
                            >
                                İptal
                            </button>

                            <button
                                type="submit"
                                className="btn btn-success w-50"
                            >
                                💾 Değişiklikleri Kaydet
                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </div>
    );
}

export default EditStaff;