import { useState } from "react";
import { FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa";
import api from "../../services/api";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const handleLogin = async () => {
    try {

        const response = await api.post("/Auth/login", {
            email,
            password
        });
        console.log("RESPONSE", response.data);
console.log("ROLE", response.data.user.role);

        login(response.data.token, response.data.user);
        localStorage.setItem("refreshToken", response.data.refreshToken);

        toast.success("Giriş başarılı.");
       if (
    response.data.user.role === "Admin" ||
    response.data.user.role === "SuperAdmin" ||
    response.data.user.role === "Municipality"
) {
    navigate("/admin");
} else if (
    response.data.user.role === "Veterinarian"
) {
    navigate("/veterinarian");
} else {
    navigate("/");
}


        console.log(response.data);

    } 
    catch (error) {

    console.log("HATA:", error);
    console.log("RESPONSE:", error.response);
    console.log("DATA:", error.response?.data);

    toast.error(error.response?.data?.message || "Giriş başarısız.");

}
};

  return (
    <div className="container py-5" style={{ maxWidth: "500px" }}>
      <div className="card shadow p-4">
        <button
  className="btn btn-link text-decoration-none text-dark p-0 mb-3"
  onClick={() => navigate(-1)}
>
  <FaArrowLeft className="me-2" />
  Geri
</button>

        <h2 className="text-center mb-4">
          Giriş Yap
        </h2>

        <div className="mb-3">
          <label className="form-label">E-Posta</label>

          <input
            type="email"
            className="form-control"
            placeholder="E-posta giriniz"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="form-label">Şifre</label>

          <div className="input-group">
    <input
        type={showPassword ? "text" : "password"}
        className="form-control"
        placeholder="Şifre giriniz"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
    />

    <button
        className="btn btn-outline-secondary"
        type="button"
        onClick={() => setShowPassword(!showPassword)}
    >
        {showPassword ? <FaEyeSlash /> : <FaEye />}
    </button>
</div>
        </div>

        <button
    className="btn btn-success w-100"
    onClick={handleLogin}
>
    Giriş Yap
</button>
<div className="text-center mt-3">
  <span
    className="text-primary"
    style={{ cursor: "pointer", fontWeight: "600" }}
    onClick={() => navigate("/forgot-password")}
  >
    Şifremi Unuttum
  </span>
</div>

<div className="text-center mt-3">
  Hesabın yok mu?{" "}
  <span
    className="text-primary"
    style={{ cursor: "pointer", fontWeight: "600" }}
    onClick={() => navigate("/register")}
  >
    Kayıt Ol
  </span>
</div>

      </div>
    </div>
  );
}

export default Login;