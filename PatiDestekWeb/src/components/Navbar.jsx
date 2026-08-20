import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleBack = () => {
    navigate(-1);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");

    navigate("/");
    window.location.reload();
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-success shadow">
        <div className="container">

          <Link className="navbar-brand fw-bold" to="/">
            🐾 PatiDestek
          </Link>

          <div className="ms-auto d-flex gap-2">

            <Link to="/" className="btn btn-light">
              🏠 Anasayfa
            </Link>

            <button
              className="btn btn-warning"
              onClick={handleBack}
            >
              ⬅️ Geri Dön
            </button>

            <button
              className="btn btn-danger"
              onClick={() => setShowLogoutModal(true)}
            >
              🚪 Çıkış Yap
            </button>

          </div>

        </div>
      </nav>

      {showLogoutModal && (
        <div
          className="modal fade show"
          style={{
            display: "block",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title">
                  Çıkış Yap
                </h5>
              </div>

              <div className="modal-body">
                Çıkış yapmak istediğinize emin misiniz?
              </div>

              <div className="modal-footer">

                <button
                  className="btn btn-secondary"
                  onClick={() => setShowLogoutModal(false)}
                >
                  Hayır
                </button>

                <button
                  className="btn btn-danger"
                  onClick={handleLogout}
                >
                  Evet
                </button>

              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;