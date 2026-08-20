import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

function AdminLayout() {
    const navigate = useNavigate();
    const location = useLocation();

    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const showBackButton = location.pathname !== "/admin";

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");

        navigate("/");

        window.location.reload();
    };

    return (
        <div className="d-flex" style={{ minHeight: "100vh" }}>

            {/* Sol Menü */}
            <div
                className="bg-dark text-white p-3 d-flex flex-column"
                style={{
    width: "260px",
    position: "fixed",
    top: 0,
    left: 0,
    height: "100vh",
    overflowY: "auto"
}}
            >
                <h3 className="mb-4">🏛 PatiDestek</h3>

                <div className="nav flex-column">

                    <NavLink
                        to="/admin"
                        className="nav-link text-white"
                    >
                        🛡️ Kontrol Paneli
                    </NavLink>

                    <NavLink
                        to="/admin/staff"
                        className="nav-link text-white"
                    >
                        👥 Görevliler
                    </NavLink>

                    <NavLink
                        to="/admin/statistics"
                        className="nav-link text-white"
                    >
                        📊 İstatistikler
                    </NavLink>

                    <NavLink
                        to="/admin/reports"
                        className="nav-link text-white"
                    >
                        🐾 İhbar Yönetimi
                    </NavLink>

                    <NavLink
                        to="/admin/notifications"
                        className="nav-link text-white"
                    >
                        🔔 Bildirimler
                    </NavLink>
                    <NavLink 
    to="/admin/messages" 
    className="nav-link text-white" 
>
    💬 İletişim
</NavLink>

                    <NavLink
                        to="/admin/settings"
                        className="nav-link text-white"
                    >
                        ⚙️ Ayarlar
                    </NavLink>
                </div>

                {/* Menü en altına sabit çıkış butonu */}
                <div className="mt-auto">
                    <hr />

                    <button
                        className="btn btn-danger w-100"
                        onClick={() => setShowLogoutModal(true)}
                    >
                        🚪 Çıkış Yap
                    </button>
                </div>
            </div>

            {/* Sağ İçerik */}
            <div
    className="flex-grow-1 p-4 bg-light"
    style={{ marginLeft: "260px" }}
>

                {showBackButton && (
                    <button
                        className="btn btn-outline-secondary mb-3"
                        onClick={() => navigate(-1)}
                    >
                        ← Geri Dön
                    </button>
                )}

                <Outlet />
            </div>

            {/* Çıkış Modalı */}
            {showLogoutModal && (
                <div
                    className="modal fade show"
                    style={{
                        display: "block",
                        backgroundColor: "rgba(0,0,0,.5)"
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

        </div>
    );
}

export default AdminLayout;