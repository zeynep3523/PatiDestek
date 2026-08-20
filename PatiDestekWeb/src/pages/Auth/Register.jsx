import { useState } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa";

function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (formData.password !== formData.confirmPassword) {
    toast.error("Şifreler eşleşmiyor.");
    return;
  }
if (formData.password.length < 8) {
  toast.error("Şifre en az 8 karakter olmalıdır.");
  return;
}

if (!/[A-Z]/.test(formData.password)) {
  toast.error("Şifre en az 1 büyük harf içermelidir.");
  return;
}

if (!/[a-z]/.test(formData.password)) {
  toast.error("Şifre en az 1 küçük harf içermelidir.");
  return;
}

if (!/\d/.test(formData.password)) {
  toast.error("Şifre en az 1 rakam içermelidir.");
  return;
}

if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
  toast.error("Şifre en az 1 özel karakter içermelidir.");
  return;
}
if (formData.phone.length !== 11) {
  toast.error("Telefon numarası 11 haneli olmalıdır.");
  return;
}
if (formData.firstName.trim() === "") {
  toast.error("Lütfen adınızı giriniz.");
  return;
}

if (formData.lastName.trim() === "") {
  toast.error("Lütfen soyadınızı giriniz.");
  return;
}

  try {
    await api.post("/Auth/register", {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
    });

    toast.success("Kayıt başarılı. Lütfen e-postanızı doğrulayın.");

    navigate("/verify-email", {
      state: {
        email: formData.email,
      },
    });
  } catch (error) {
  if (error.response?.status === 409) {
    toast.warning(error.response.data.message);
    return;
  }

  toast.error(
    error.response?.data?.message || "Kayıt başarısız."
  );
}
};

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8">

          <div className="card shadow-lg border-0 rounded-4">
           

  <button
    className="btn btn-link text-decoration-none text-dark p-0 mb-3"
    onClick={() => navigate(-1)}
  >
    <FaArrowLeft className="me-2" />
    Geri
  </button>
            <div className="card-body p-5">

              <h2 className="text-center fw-bold mb-4">
                Kayıt Ol
              </h2>

              <form onSubmit={handleSubmit}>

                <div className="mb-3">
                  <label className="form-label">Ad</label>
                  <input
                    type="text"
                    className="form-control"
                    name="firstName"
                    value={formData.firstName}
                    onChange={(e) =>
  setFormData({
    ...formData,
    firstName: e.target.value.replace(/[^a-zA-ZçÇğĞıİöÖşŞüÜ\s]/g, ""),
  })
}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Soyad</label>
                  <input
                    type="text"
                    className="form-control"
                    name="lastName"
                    value={formData.lastName}
                    onChange={(e) =>
  setFormData({
    ...formData,
    lastName: e.target.value.replace(/[^a-zA-ZçÇğĞıİöÖşŞüÜ\s]/g, ""),
  })
}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">E-posta</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Telefon Numarası
                  </label>
                    <input
                  type="tel"
                  className="form-control"
                  name="phone"
                  placeholder="05XXXXXXXXX"
                  maxLength={11}
                  value={formData.phone}
                  onChange={(e) => {
                 const value = e.target.value.replace(/\D/g, "");
    setFormData({
      ...formData,
      phone: value,
    });
}}
  />
</div>
  
<div className="input-group">
  <input
    type={showPassword ? "text" : "password"}
    className="form-control"
    name="password"
    placeholder="Şifre giriniz"
    value={formData.password}
    onChange={handleChange}
  /> 

  <button
    type="button"
    className="btn btn-outline-secondary"
    onClick={() => setShowPassword(!showPassword)}
  >
    {showPassword ? <FaEyeSlash /> : <FaEye />}
  </button>
</div>
<div className="mt-2 mb-3 small">

  <div className={formData.password.length >= 8 ? "text-success" : "text-danger"}>
    ✔ En az 8 karakter
  </div>

  <div className={/[A-Z]/.test(formData.password) ? "text-success" : "text-danger"}>
    ✔ En az 1 büyük harf
  </div>

  <div className={/[a-z]/.test(formData.password) ? "text-success" : "text-danger"}>
    ✔ En az 1 küçük harf
  </div>

  <div className={/\d/.test(formData.password) ? "text-success" : "text-danger"}>
    ✔ En az 1 rakam
  </div>

  <div className={/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? "text-success" : "text-danger"}>
    ✔ En az 1 özel karakter
  </div>

</div>
                

                <div className="input-group">
  <input
    type={showConfirmPassword ? "text" : "password"}
    className="form-control"
    name="confirmPassword"
    value={formData.confirmPassword}
    onChange={handleChange}
  />

  <button
    type="button"
    className="btn btn-outline-secondary"
    onClick={() =>
      setShowConfirmPassword(!showConfirmPassword)
    }
  >
    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
  </button>
</div>

                <button
                  className="btn btn-success w-100"
                  type="submit"
                >
                  Kayıt Ol
                </button>

              </form>

              <div className="text-center mt-4">
                Zaten hesabın var mı?{" "}
                <span
  className="text-primary"
  style={{
    cursor: "pointer",
    fontWeight: "600",
  }}
  onClick={() => navigate("/login")}
>
  Giriş Yap
</span>
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default Register;