import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../../services/userService";
import api from "../../services/api";
import { toast } from "react-toastify";

function Profile() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const loadProfile = async () => {
    try {
      const response = await getProfile();
      setUser(response);
    } catch (error) {
      toast.error("Profil bilgileri alınamadı.");
      console.log(error);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleSave = async () => {
    try {
      await updateProfile(user);

      toast.success("Profil başarıyla güncellendi.");

      setEditMode(false);
    } catch (error) {
      toast.error("Profil güncellenemedi.");
      console.log(error);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.warning("Tüm şifre alanlarını doldurun.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Yeni şifreler eşleşmiyor.");
      return;
    }

    try {
      await api.put("/User/change-password", {
        oldPassword: currentPassword,
        newPassword: newPassword
      });

      toast.success("Şifre başarıyla değiştirildi.");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message || "Mevcut şifre hatalı."
      );
    }
  };

  if (!user) {
    return (
      <div className="container py-5 text-center">
        <h3>Yükleniyor...</h3>
      </div>
    );
  }

  return (
    <div className="container py-5">

      {/* PROFİL KARTI */}
      <div className="card shadow-lg border-0 rounded-4 mb-4">

        <div className="card-body p-4 p-md-5">

          {/* PROFİL BAŞLIĞI */}
          <div className="text-center mb-5">

            <i
              className="bi bi-person-circle text-success"
              style={{ fontSize: "100px" }}
            ></i>

            <h2 className="fw-bold mt-3 mb-2">
              Profilim
            </h2>

            <p className="text-muted mb-0">
              Hesap bilgilerinizi görüntüleyebilir ve güncelleyebilirsiniz.
            </p>

          </div>

          {/* HESAP BİLGİLERİ */}
          <div className="row g-4">

            {/* SOL TARAF */}
            <div className="col-md-6">

              <div className="mb-4">
                <label className="fw-bold">
                  👤 Ad
                </label>

                {editMode ? (
                  <input
                    className="form-control mt-2"
                    value={user.firstName || ""}
                    onChange={(e) =>
                      setUser({
                        ...user,
                        firstName: e.target.value,
                      })
                    }
                  />
                ) : (
                  <div className="form-control mt-2 bg-light">
                    {user.firstName}
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label className="fw-bold">
                  👤 Soyad
                </label>

                {editMode ? (
                  <input
                    className="form-control mt-2"
                    value={user.lastName || ""}
                    onChange={(e) =>
                      setUser({
                        ...user,
                        lastName: e.target.value,
                      })
                    }
                  />
                ) : (
                  <div className="form-control mt-2 bg-light">
                    {user.lastName}
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label className="fw-bold">
                  📞 Telefon
                </label>

                {editMode ? (
                  <input
                    className="form-control mt-2"
                    value={user.phone || ""}
                    onChange={(e) =>
                      setUser({
                        ...user,
                        phone: e.target.value,
                      })
                    }
                  />
                ) : (
                  <div className="form-control mt-2 bg-light">
                    {user.phone}
                  </div>
                )}
              </div>

            </div>

            {/* SAĞ TARAF */}
            <div className="col-md-6">

              <div className="mb-4">
                <label className="fw-bold">
                  📧 E-posta
                </label>

                <div className="form-control mt-2 bg-light">
                  {user.email}
                </div>
              </div>

              <div className="mb-4">
                <label className="fw-bold">
                  🛡️ Rol
                </label>

                <div className="form-control mt-2 bg-light">
                  {user.role}
                </div>
              </div>

            </div>

          </div>

          {/* PROFİL BUTONLARI */}
          <div className="d-flex gap-2 mt-3">

            <button
              className="btn btn-success"
              onClick={() => setEditMode(!editMode)}
            >
              {editMode
                ? "İptal"
                : "✏️ Bilgileri Güncelle"}
            </button>

            {editMode && (
              <button
                className="btn btn-primary"
                onClick={handleSave}
              >
                💾 Kaydet
              </button>
            )}

          </div>

        </div>

      </div>


      {/* ŞİFRE DEĞİŞTİRME KARTI */}
      <div className="card shadow-lg border-0 rounded-4">

        <div className="card-body p-4 p-md-5">

          <div className="mb-4">

            <h4 className="fw-bold mb-1">
              🔒 Şifre Değiştir
            </h4>

            <p className="text-muted mb-0">
              Hesabınızın güvenliği için mevcut şifrenizi doğrulayarak
              yeni bir şifre belirleyebilirsiniz.
            </p>

          </div>


          <div className="row g-4">

            {/* MEVCUT ŞİFRE */}
            <div className="col-md-4">

              <label className="fw-bold">
                Mevcut Şifre
              </label>

              <input
                type="password"
                className="form-control mt-2"
                placeholder="Mevcut şifrenizi girin"
                value={currentPassword}
                onChange={(e) =>
                  setCurrentPassword(e.target.value)
                }
              />

            </div>


            {/* YENİ ŞİFRE */}
            <div className="col-md-4">

              <label className="fw-bold">
                Yeni Şifre
              </label>

              <input
                type="password"
                className="form-control mt-2"
                placeholder="Yeni şifrenizi girin"
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(e.target.value)
                }
              />

            </div>


            {/* YENİ ŞİFRE TEKRAR */}
            <div className="col-md-4">

              <label className="fw-bold">
                Yeni Şifre Tekrar
              </label>

              <input
                type="password"
                className="form-control mt-2"
                placeholder="Yeni şifrenizi tekrar girin"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
              />

            </div>

          </div>


          {/* ŞİFRE BUTONU */}
          <div className="mt-4">

            <button
              className="btn btn-warning"
              onClick={handleChangePassword}
            >
              🔑 Şifreyi Güncelle
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Profile;