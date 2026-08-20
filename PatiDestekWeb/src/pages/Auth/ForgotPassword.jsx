import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSendCode = async () => {
    if (!email) {
      toast.error("E-posta adresinizi giriniz.");
      return;
    }

    try {
      await api.post("/Auth/forgot-password", {
        email,
      });

      toast.success("Doğrulama kodu e-posta adresinize gönderildi.");

      navigate("/reset-password", {
        state: {
          email,
        },
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "İşlem başarısız."
      );
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: "500px" }}>
      <div className="card shadow p-4">

        <h2 className="text-center mb-4">
          Şifremi Unuttum
        </h2>

        <div className="mb-3">
          <label className="form-label">
            E-Posta
          </label>

          <input
            type="email"
            className="form-control"
            placeholder="E-posta adresinizi giriniz"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button
          className="btn btn-success w-100"
          onClick={handleSendCode}
        >
          Kod Gönder
        </button>

      </div>
    </div>
  );
}

export default ForgotPassword;