import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { toast } from "react-toastify";

function AdminNotifications() {
    const navigate = useNavigate();

    const [notifications, setNotifications] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [selectedNotifications, setSelectedNotifications] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));

            if (!user?.id) {
                return;
            }

            const response = await api.get(
                `/Notification/user/${user.id}`
            );

            setNotifications(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    // TÜMÜNÜ SEÇ
    const selectAllNotifications = () => {
        if (selectedNotifications.length === notifications.length) {
            setSelectedNotifications([]);
        } else {
            setSelectedNotifications(
                notifications.map((notification) => notification.id)
            );
        }
    };

    // SEÇİLENLERİ SİL
    const deleteSelectedNotifications = async () => {
        if (selectedNotifications.length === 0) {
            toast.warning("Lütfen en az bir bildirim seçin.");
            return;
        }

        setShowDeleteModal(false);

        try {
            for (const id of selectedNotifications) {
                await api.delete(`/Notification/${id}`);
            }

            toast.success("Bildirimler başarıyla silindi.");

            setSelectedNotifications([]);
            setEditMode(false);

            loadNotifications();

        } catch (error) {
            console.log(error);
            toast.error("Bildirimler silinemedi.");
        }
    };

    // BİLDİRİME TIKLAMA
    const openNotification = async (notification) => {

        // Düzenleme modundaysa bildirimi açma
        if (editMode) {
            return;
        }

        try {

            // Okunmamışsa okundu yap
            if (!notification.isRead) {

                await api.put(
                    `/Notification/${notification.id}/read`
                );

                setNotifications((prev) =>
                    prev.map((item) =>
                        item.id === notification.id
                            ? {
                                ...item,
                                isRead: true
                            }
                            : item
                    )
                );
            }

            // İhbarda bağlıysa ilgili ihbarı aç
            if (notification.reportId) {
                navigate(
                    `/admin/reports/${notification.reportId}`
                );
            }

        } catch (error) {

            console.log(error);

            toast.error(
                error.response?.data?.message ||
                "Bildirim açılamadı."
            );
        }
    };

    // OKUNMAMIŞ BİLDİRİM SAYISI
    const unreadCount = notifications.filter(
        (notification) => !notification.isRead
    ).length;

    return (
        <div className="container py-4">

            {/* BAŞLIK */}
            <div className="d-flex justify-content-between align-items-start mb-4">

                <div>

                    <h2 className="fw-bold mb-2">
                        🔔 Bildirimler
                    </h2>

                    {unreadCount > 0 && (
                        <span className="badge bg-danger fs-6">
                            {unreadCount} okunmamış
                        </span>
                    )}

                </div>

                {/* SAĞDAKİ DÜZENLE BUTONU */}
                <div className="d-flex gap-2">

                    <button
                        className="btn btn-outline-primary"
                        onClick={() => setEditMode(!editMode)}
                    >
                        {editMode
                            ? "Düzenlemeyi Bitir"
                            : "Düzenle"}
                    </button>

                    {editMode && (
                        <>
                            <button
                                className="btn btn-success"
                                onClick={selectAllNotifications}
                            >
                                {selectedNotifications.length === notifications.length
                                    ? "☑️ Seçimi Kaldır"
                                    : "☑️ Tümünü Seç"}
                            </button>

                            <button
                                className="btn btn-danger"
                                onClick={() =>
                                    setShowDeleteModal(true)
                                }
                            >
                                🗑️ Seçilenleri Sil
                            </button>
                        </>
                    )}

                </div>

            </div>

            {/* BİLDİRİMLER */}
            {notifications.length === 0 ? (

                <div className="card shadow border-0">

                    <div className="card-body">

                        <div className="alert alert-info mb-0">
                            Henüz bildiriminiz bulunmuyor.
                        </div>

                    </div>

                </div>

            ) : (

                <div className="card shadow border-0">

                    {/* KART BAŞLIĞI */}
                    <div className="card-header">

                        <h5 className="mb-0">
                            📥 Gelen Bildirimler
                        </h5>

                    </div>

                    {/* BİLDİRİM LİSTESİ */}
                    <div className="card-body p-0">

                        {notifications.map((notification) => (

                            <div
                                key={notification.id}
                                className={`p-3 border-bottom ${
                                    !notification.isRead
                                        ? "bg-light"
                                        : ""
                                }`}
                                style={{
                                    cursor: editMode
                                        ? "default"
                                        : "pointer"
                                }}
                                onClick={() =>
                                    openNotification(notification)
                                }
                            >

                                {/* DÜZENLEME MODUNDA CHECKBOX */}
                                {editMode && (
                                    <div className="mb-2">

                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            checked={selectedNotifications.includes(
                                                notification.id
                                            )}
                                            onClick={(e) =>
                                                e.stopPropagation()
                                            }
                                            onChange={(e) => {

                                                if (e.target.checked) {

                                                    setSelectedNotifications([
                                                        ...selectedNotifications,
                                                        notification.id
                                                    ]);

                                                } else {

                                                    setSelectedNotifications(
                                                        selectedNotifications.filter(
                                                            (id) =>
                                                                id !==
                                                                notification.id
                                                        )
                                                    );

                                                }

                                            }}
                                        />

                                    </div>
                                )}

                                <div className="d-flex justify-content-between align-items-start">

                                    {/* SOL TARAF */}
                                    <div>

                                        <strong
                                            className={
                                                !notification.isRead
                                                    ? "text-primary"
                                                    : ""
                                            }
                                        >

                                            {!notification.isRead && (
                                                <span className="me-1">
                                                    🔵
                                                </span>
                                            )}

                                            {notification.title}

                                        </strong>

                                        <p className="mb-1 mt-2">
                                            {notification.message}
                                        </p>

                                        {notification.reportId && (
                                            <small className="text-muted">
                                                🆔 İhbar No: #
                                                {notification.reportId}
                                            </small>
                                        )}

                                    </div>

                                    {/* YENİ ETİKETİ */}
                                    {!notification.isRead && (
                                        <span className="badge bg-primary">
                                            Yeni
                                        </span>
                                    )}

                                </div>

                                {/* TARİH */}
                                <div className="mt-2">

                                    <small className="text-muted">
                                        {notification.createdAt
                                            ? new Date(
                                                notification.createdAt
                                            ).toLocaleString("tr-TR")
                                            : ""}
                                    </small>

                                </div>

                                {/* OKUNDU */}
                                {notification.isRead && (
                                    <div className="mt-2">

                                        <span className="badge bg-success">
                                            Okundu
                                        </span>

                                    </div>
                                )}

                            </div>

                        ))}

                    </div>

                </div>

            )}

            {/* SİLME MODALI */}
            {showDeleteModal && (

                <div
                    className="modal fade show"
                    style={{
                        display: "block",
                        backgroundColor: "rgba(0,0,0,0.5)"
                    }}
                >

                    <div className="modal-dialog modal-dialog-centered">

                        <div className="modal-content">

                            <div className="modal-header">

                                <h5 className="modal-title">
                                    Bildirimleri Sil
                                </h5>

                            </div>

                            <div className="modal-body">

                                Seçilen bildirimleri silmek
                                istediğinize emin misiniz?

                            </div>

                            <div className="modal-footer">

                                <button
                                    className="btn btn-secondary"
                                    onClick={() =>
                                        setShowDeleteModal(false)
                                    }
                                >
                                    İptal
                                </button>

                                <button
                                    className="btn btn-danger"
                                    onClick={deleteSelectedNotifications}
                                >
                                    Sil
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}

export default AdminNotifications;