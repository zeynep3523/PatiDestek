import { useEffect, useState } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function AdminSettings() {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const [settings, setSettings] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const handleChange = (e) => {
        setSettings({
            ...settings,
            [e.target.name]: e.target.value
        });
    };

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const response = await api.get("/Auth/profile");

            setSettings((prev) => ({
                ...prev,
                firstName: response.data.firstName,
                lastName: response.data.lastName,
                email: response.data.email,
                phone: response.data.phone
            }));
        } catch (error) {
            console.log(error);
        }
    };

    const updateProfile = async () => {
        try {
            await api.put("/Auth/profile", {
                firstName: settings.firstName,
                lastName: settings.lastName,
                email: settings.email,
                phone: settings.phone
            });

            toast.success("Bilgiler başarıyla güncellendi.");
        } catch (error) {
            console.log(error);
            toast.error("Bilgiler güncellenemedi.");
        }
    };

    const updatePassword = async () => {
        if (
            !settings.currentPassword ||
            !settings.newPassword ||
            !settings.confirmPassword
        ) {
            toast.warning("Tüm şifre alanlarını doldurun.");
            return;
        }

        if (settings.newPassword !== settings.confirmPassword) {
            toast.error("Yeni şifreler eşleşmiyor.");
            return;
        }

        try {
            await api.put("/User/change-password", {
                oldPassword: settings.currentPassword,
                newPassword: settings.newPassword
            });

            toast.success("Şifre başarıyla güncellendi.");
setPasswordError("");

            setSettings((prev) => ({
                ...prev,
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            }));
            
        } catch (error) {
    console.log(error);

    if (
        error.response?.data?.message === "Eski şifre hatalı."
    ) {
        setPasswordError("Eski şifre hatalı.");
    } else {
        toast.error(
            error.response?.data?.message ||
            "Şifre güncellenemedi."
        );
    }
}
    };

    return (
        <div className="container mt-4">

            <h2 className="mb-4">
                ⚙️ Ayarlar
            </h2>

            {/* Hesap Bilgileri */}
            <div className="card shadow mb-4">
                <div className="card-body">

                    <h4 className="mb-4">
                        👤 Hesap Bilgileri
                    </h4>

                    <div className="row">

                        <div className="col-md-6 mb-3">
                            <label>Ad</label>
                            <input
                                className="form-control"
                                name="firstName"
                                value={settings.firstName}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <label>Soyad</label>
                            <input
                                className="form-control"
                                name="lastName"
                                value={settings.lastName}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-6 mb-3">
    <label>E-posta</label>
    <input
        className="form-control"
        name="email"
        value={settings.email}
        onChange={handleChange}
    />
</div>

                        <div className="col-md-6 mb-3">
                            <label>Telefon</label>
                            <input
                                className="form-control"
                                name="phone"
                                value={settings.phone}
                                onChange={handleChange}
                            />
                        </div>

                    </div>

                    <button
                        className="btn btn-success"
                        onClick={updateProfile}
                    >
                        Bilgileri Güncelle
                    </button>

                </div>
            </div>

            {/* Şifre */}
            <div className="card shadow">
                <div className="card-body">

                    <h4 className="mb-4">
                        🔒 Şifre Değiştir
                    </h4>
                    <div className="mb-3">
    <label>Mevcut Şifre</label>

    <div className="input-group">
        <input
            type={showCurrentPassword ? "text" : "password"}
            className="form-control"
            name="currentPassword"
            value={settings.currentPassword}
            onChange={(e) => {
                handleChange(e);
                setPasswordError("");
            }}
            autoComplete="new-password"
        />

        <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() =>
                setShowCurrentPassword(!showCurrentPassword)
            }
        >
            {showCurrentPassword
                ? <FaEyeSlash />
                : <FaEye />}
        </button>
    </div>

    {passwordError && (
        <div className="text-danger mt-2">
            {passwordError}
        </div>
    )}
</div>


                    <div className="mb-3">
                        <label>Yeni Şifre</label>

                        <div className="input-group">
                            <input
                                type={showNewPassword ? "text" : "password"}
                                className="form-control"
                                name="newPassword"
                                value={settings.newPassword}
                                onChange={handleChange}
                            />

                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() =>
                                    setShowNewPassword(!showNewPassword)
                                }
                            >
                                {showNewPassword
                                    ? <FaEyeSlash />
                                    : <FaEye />}
                            </button>
                        </div>
                    </div>

                    <div className="mb-3">
                        <label>Yeni Şifre Tekrar</label>

                        <div className="input-group">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                className="form-control"
                                name="confirmPassword"
                                value={settings.confirmPassword}
                                onChange={handleChange}
                            />

                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                }
                            >
                                {showConfirmPassword
                                    ? <FaEyeSlash />
                                    : <FaEye />}
                            </button>
                        </div>
                    </div>

                    <button
                        className="btn btn-warning"
                        onClick={updatePassword}
                    >
                        Şifreyi Güncelle
                    </button>

                </div>
            </div>

        </div>
    );
}

export default AdminSettings;