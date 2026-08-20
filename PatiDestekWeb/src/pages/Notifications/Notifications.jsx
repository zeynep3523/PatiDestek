import { useEffect, useState } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Notifications() {
  const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState(null);

    const loadNotifications = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));

            if (!user?.id) {
                setLoading(false);
                return;
            }

            const response = await api.get(
                `/Notification/user/${user.id}`
            );

            setNotifications(response.data);
        } catch (error) {
            console.error("Bildirimler yüklenemedi:", error);

            toast.error(
                error.response?.data?.message ||
                "Bildirimler yüklenemedi."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadNotifications();
    }, []);
const markAsRead = async (notification) => {
    try {
        if (!notification.isRead) {
            await api.put(`/Notification/${notification.id}/read`);
        }

        // Silinen ihbar bildirimi ise sadece okundu olarak işaretle
        if (notification.type === "DeleteReport") {
            setNotifications((prev) =>
                prev.map((item) =>
                    item.id === notification.id
                        ? { ...item, isRead: true }
                        : item
                )
            );

            return;
        }

        // Normal bildirimlerde ihbar detayına git
        if (notification.reportId) {
            navigate(`/report/${notification.reportId}`);
        }

        // Bildirimi okundu göster
        setNotifications((prev) =>
            prev.map((item) =>
                item.id === notification.id
                    ? { ...item, isRead: true }
                    : item
            )
        );

    } catch (error) {
        console.error("Bildirim işlemi başarısız:", error);
    }
};

    const unreadCount = notifications.filter(
        (notification) => !notification.isRead
    ).length;

    if (loading) {
        return (
            <div className="container py-5">
                <h3>Bildirimler yükleniyor...</h3>
            </div>
        );
    }
const deleteNotification = async () => {
    if (!deleteId) return;

    try {
        await api.delete(`/Notification/${deleteId}`);

        setNotifications((prev) =>
            prev.filter(
                (notification) => notification.id !== deleteId
            )
        );

        setDeleteId(null);

        toast.success("Bildirim silindi.");

    } catch (error) {
        console.error("Bildirim silinemedi:", error);

        toast.error(
            error.response?.data?.message ||
            "Bildirim silinemedi."
        );
    }
};
    return (
        <div className="container py-5">

            <div className="d-flex justify-content-between align-items-center mb-4">

                <h2 className="fw-bold mb-0">
                    🔔 Bildirimler
                </h2>

                {unreadCount > 0 && (
                    <span className="badge bg-danger fs-6">
                        {unreadCount} okunmamış
                    </span>
                )}

            </div>

            {notifications.length === 0 ? (

                <div className="card shadow border-0">
                    <div className="card-body">
                        <h5>Henüz bildiriminiz bulunmuyor.</h5>

                        <p className="text-muted mb-0">
                            İhbarlarınızla ilgili gelişmeler burada
                            görüntülenecektir.
                        </p>
                    </div>
                </div>

            ) : (

                <div className="card shadow border-0">

                    <div className="card-header">
                        <h5 className="mb-0">
                            📥 Gelen Bildirimler
                        </h5>
                    </div>

                    <div className="card-body p-0">

                        {notifications.map((notification) => (

                            <div
                                key={notification.id}
                                className={`p-3 border-bottom ${
                                    !notification.isRead
                                        ? "bg-light"
                                        : ""
                                }`}
                                style={{ cursor: "pointer" }}
                                onClick={() => markAsRead(notification)}
                                
                            >

                                <div className="d-flex justify-content-between align-items-start">

    <div>

                                    

                                        <strong
                                            className={
                                                !notification.isRead
                                                    ? "text-primary"
                                                    : ""
                                            }
                                        >
                                            {!notification.isRead && "🔵 "}
                                            {notification.title}
                                        </strong>

                                        <p className="mb-1 mt-2">
                                            {notification.message}
                                        </p>

                                        {notification.reportId && (
                                            <small className="text-muted">
                                                🆔 İhbar No: #{notification.reportId}
                                            </small>
                                        )}

                                    </div>
                                    <div className="d-flex align-items-center gap-2">
    {!notification.isRead && (
        <span className="badge bg-primary">
            Yeni
        </span>
    )}

    <button
    type="button"
    style={{
        display: "block",
        visibility: "visible",
        opacity: 1,
        zIndex: 9999
    }}
    className="btn btn-danger"
    onClick={(e) => {
        e.stopPropagation();
        setDeleteId(notification.id);
    }}
>
    🗑️ SİL
</button>
</div>

                                    

                                </div>

                                <small className="text-muted">
                                    {notification.createdAt
                                        ? new Date(
                                            notification.createdAt
                                        ).toLocaleString("tr-TR")
                                        : ""}
                                </small>

                            </div>

                        ))}

                    </div>
                    {deleteId && (
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
                        🗑️ Bildirimi Sil
                    </h5>
                </div>

                <div className="modal-body">
                    Bu bildirimi silmek istediğinize emin misiniz?
                </div>

                <div className="modal-footer">

                    <button
                        className="btn btn-secondary"
                        onClick={() => setDeleteId(null)}
                    >
                        Hayır
                    </button>

                    <button
                        className="btn btn-danger"
                        onClick={deleteNotification}
                    >
                        Evet, Sil
                    </button>

                </div>

            </div>
        </div>
    </div>
)}

                </div>

            )}

        </div>
    );
}

export default Notifications;