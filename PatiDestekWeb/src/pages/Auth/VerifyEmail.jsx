import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";

function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();

  const [code, setCode] = useState("");

  const email = location.state?.email || "";

const handleResendCode = async () => {
  if (!email) {
    toast.error("E-posta bilgisi bulunamadı.");
    return;
  }

  try {
    const response = await api.post("/Auth/resend-verification-code", {
      email,
    });

    toast.success(response.data.message);
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Kod tekrar gönderilemedi."
    );
  }
};
  const handleVerify = async () => {
    if (!email) {
      toast.error("E-posta bilgisi bulunamadı.");
      return;
    }

    if (!code) {
      toast.error("Doğrulama kodunu giriniz.");
      return;
    }

    try {
      await api.post("/Auth/verify-email", {
        email,
        code,
      });

      toast.success("E-posta başarıyla doğrulandı.");

      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Doğrulama başarısız."
      );
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: "500px" }}>
      <div className="card shadow p-4">

        <h2 className="text-center mb-4">
          E-Posta Doğrulama
        </h2>

        <p className="text-center text-muted">
          E-posta adresinize gönderilen 6 haneli kodu giriniz.
        </p>

        <div className="mb-3">

          <label className="form-label">
            Doğrulama Kodu
          </label>

          <input
            type="text"
            className="form-control"
            placeholder="123456"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />

        </div>

        <button
  className="btn btn-success w-100"
  onClick={handleVerify}
>
  Doğrula
</button>


<button
  className="btn btn-outline-secondary w-100 mt-2"
  onClick={handleResendCode}
>
  Kodu Tekrar Gönder
</button>

      </div>
    </div>
  );
}

export default VerifyEmail;