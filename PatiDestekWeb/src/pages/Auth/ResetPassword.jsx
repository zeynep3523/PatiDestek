import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";

function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || "";

  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleResetPassword = async () => {
    if (!email) {
      toast.error("E-posta bilgisi bulunamadı.");
      return;
    }

    if (!code || !newPassword || !confirmPassword) {
      toast.error("Lütfen tüm alanları doldurun.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Şifreler eşleşmiyor.");
      return;
    }

    try {
      await api.post("/Auth/reset-password", {
        email,
        code,
        newPassword,
      });

      toast.success("Şifreniz başarıyla güncellendi.");

      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Şifre güncellenemedi."
      );
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: "500px" }}>
      <div className="card shadow p-4">

        <h2 className="text-center mb-4">
          Yeni Şifre Oluştur
        </h2>

        <div className="mb-3">
          <label className="form-label">
            Doğrulama Kodu
          </label>

          <input
            type="text"
            className="form-control"
            placeholder="6 haneli kod"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">
            Yeni Şifre
          </label>

          <input
            type="password"
            className="form-control"
            placeholder="Yeni şifre"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="form-label">
            Yeni Şifre Tekrar
          </label>

          <input
            type="password"
            className="form-control"
            placeholder="Yeni şifre tekrar"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button
          className="btn btn-success w-100"
          onClick={handleResetPassword}
        >
          Şifreyi Güncelle
        </button>

      </div>
    </div>
  );
}

export default ResetPassword;