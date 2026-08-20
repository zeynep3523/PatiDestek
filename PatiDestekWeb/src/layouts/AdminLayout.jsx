import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Offcanvas } from "bootstrap";
import "../styles/PanelLayout.css";

function AdminLayout() {
    const navigate = useNavigate();
    const location = useLocation();

    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const showBackButton = location.pathname !== "/admin";

    const closeSidebar = () => {
        const el = document.getElementById("adminSidebar");
        if (el) {
            Offcanvas.getInstance(el)?.hide();
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");

        navigate("/");

        window.location.reload();
    };

    return (
        <div style={{ minHeight: "100vh" }}>

            {/* Mobil Üst Bar */}
            <nav className="navbar bg-dark d-lg-none px-3 sticky-top">
                <button
                    className="btn btn-outline-light"
                    type="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#adminSidebar"
                >
                    <i className="bi bi-list"></i> Menü
                </button>
                <span className="navbar-brand text-white ms-2 mb-0">🏛 PatiDestek</span>
            </nav>

            <div className="d-flex">

            {/* Sol Menü */}
            <div
                className="panel-sidebar offcanvas-lg offcanvas-start bg-dark text-white p-3 d-flex flex-column"
                tabIndex="-1"
                id="adminSidebar"
                style={{
    position: "fixed",
    top: 0,
    left: 0,
    height: "100vh",
    overflowY: "auto"
}}
            >
                <div className="d-flex align-items-center justify-content-between d-lg-none mb-3">
                    <h5 className="mb-0">🏛 PatiDestek</h5>
                    <button
                        type="button"
                        className="btn-close btn-close-white"
                        data-bs-dismiss="offcanvas"
                        data-bs-target="#adminSidebar"
                    ></button>
                </div>

                <h3 className="mb-4 d-none d-lg-block">🏛 PatiDestek</h3>

                <div className="nav flex-column">

                    <NavLink
                        to="/admin"
                        className="nav-link text-white"
                        onClick={closeSidebar}
                    >
                        🛡️ Kontrol Paneli
                    </NavLink>

                    <NavLink
                        to="/admin/staff"
                        className="nav-link text-white"
                        onClick={closeSidebar}
                    >
                        👥 Görevliler
                    </NavLink>

                    <NavLink
                        to="/admin/statistics"
                        className="nav-link text-white"
                        onClick={closeSidebar}
                    >
                        📊 İstatistikler
                    </NavLink>

                    <NavLink
                        to="/admin/reports"
                        className="nav-link text-white"
                        onClick={closeSidebar}
                    >
                        🐾 İhbar Yönetimi
                    </NavLink>

                    <NavLink
                        to="/admin/notifications"
                        className="nav-link text-white"
                        onClick={closeSidebar}
                    >
                        🔔 Bildirimler
                    </NavLink>
                    <NavLink
    to="/admin/messages"
    className="nav-link text-white"
    onClick={closeSidebar}
>
    💬 İletişim
</NavLink>

                    <NavLink
                        to="/admin/settings"
                        className="nav-link text-white"
                        onClick={closeSidebar}
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
            <div className="panel-content flex-grow-1 p-4 bg-light">

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