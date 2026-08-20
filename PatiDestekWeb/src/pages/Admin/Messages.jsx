import { useEffect, useState } from "react";
import api from "../../services/api";

function Messages() {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [users, setUsers] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
const [conversation, setConversation] = useState([]);

  useEffect(() => {
    loadMessages();
    loadUsers();
  }, []);
 const openConversation = async (user) => {
  try {
    setSelectedUser(user);
    setReceiverId(String(user.id));

    const response = await api.get(
      `/Message/conversation/${user.id}`
    );

    setConversation(response.data);

    await api.put(
      `/Message/conversation/${user.id}/read`
    );

    // Gelen Mesajlar listesinden bu kullanıcıya ait mesajları kaldır
    setMessages((prev) =>
      prev.filter(
        (message) => message.sender?.id !== user.id
      )
    );

  } catch (error) {
    console.log(error);
  }
};
  const loadMessages = async () => {
    try {
        const response = await api.get("/Message/inbox");
        setMessages(response.data);
    } catch (error) {
        console.log(error);
    }
};
const loadUsers = async () => {
  try {
    const response = await api.get("/User/communication-users");
    setUsers(response.data);
  } catch (error) {
    console.log(error);
  }
};
const sendMessage = async () => {
  if (!receiverId || !content.trim()) {
    return;
  }

  try {
    await api.post("/Message", {
      receiverId: Number(receiverId),
      content: content.trim(),
    });

    setContent("");

    await openConversation({
      id: Number(receiverId),
      firstName: selectedUser?.firstName || "",
      lastName: selectedUser?.lastName || "",
      role: selectedUser?.role || "Municipality"
    });

    setReceiverId("");
    await loadMessages();

  } catch (error) {
    console.log(error);
  }
};
  
 const deleteMessage = async () => {
  if (!deleteId) return;

  try {
    await api.delete(`/Message/${deleteId}`);

    setMessages((prev) =>
      prev.filter((message) => message.id !== deleteId)
    );

    setDeleteId(null);
  } catch (error) {
    console.log(error);
  }
};

  return (
    <div className="container py-4">

      <h2 className="mb-4">💬 İletişim</h2>

      {/* Mesaj Gönder */}
      <div className="card shadow border-0 mb-4">
        <div className="card-header">
          <h5 className="mb-0">✉️ Yeni Mesaj</h5>
        </div>

        <div className="card-body">

          <select
            className="form-select mb-3"
            value={receiverId}
            onChange={(e) => setReceiverId(e.target.value)}
          >
            <option value="">Alıcı seçin</option>

            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.firstName} {user.lastName}
                {user.role === "SuperAdmin"
  ? " - SuperAdmin"
  : user.role === "Veterinarian"
    ? " - Veteriner"
    : " - Belediye"}
              </option>
            ))}
          </select>

          <textarea
            className="form-control mb-3"
            rows="4"
            placeholder="Mesajınızı yazın..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <button
            className="btn btn-success"
            onClick={sendMessage}
            disabled={!receiverId || !content.trim()}
          >
            📤 Gönder
          </button>

        </div>
      </div>
      {/* Sohbetler */}
<div className="card shadow border-0 mb-4">
  <div className="card-header">
    <h5 className="mb-0">💬 Sohbetler</h5>
  </div>

  <div className="card-body">
    {users.length === 0 ? (
      <p className="text-muted mb-0">
        Henüz sohbet edebileceğiniz kullanıcı yok.
      </p>
    ) : (
      users.map((user) => (
        <button
          key={user.id}
          className="btn btn-light w-100 text-start mb-2"
          onClick={() => openConversation(user)}
        >
          👤 {user.firstName} {user.lastName}
          <span className="text-muted">
            {" "}
            - {user.role === "Veterinarian" ? "Veteriner" : "Belediye"}
          </span>
        </button>
      ))
    )}
  </div>
</div>
      {/* Sohbet Geçmişi */}
{selectedUser && (
  <div className="card shadow border-0 mb-4">
    <div className="card-header d-flex justify-content-between align-items-center">
      <h5 className="mb-0">
        💬 {selectedUser.firstName} {selectedUser.lastName}
      </h5>

      <button
        className="btn btn-sm btn-outline-secondary"
        onClick={() => {
          setSelectedUser(null);
          setConversation([]);
        }}
      >
        Kapat
      </button>
    </div>

    <div
      className="card-body"
      style={{
        maxHeight: "400px",
        overflowY: "auto"
      }}
    >
      {conversation.length === 0 ? (
        <p className="text-muted">
          Bu kişiyle henüz mesajlaşma bulunmuyor.
        </p>
      ) : (
        [...conversation].reverse().map((message) => (
          <div
            key={message.id}
            className="border-bottom py-3"
          >
            <strong>
              {message.sender?.firstName}{" "}
              {message.sender?.lastName}
            </strong>
            <p className="mb-1 mt-2">
  {message.content}
</p>
            

            
            <small className="text-muted">
              {new Date(message.createdAt).toLocaleString("tr-TR")}
            </small>
          </div>
        ))
      )}
    </div>
  </div>
)}
{/* Gelen Mesajlar */}
<div className="card shadow border-0">
  <div className="card-header">
    <h5 className="mb-0">📥 Gelen Mesajlar</h5>
  </div>

  <div className="card-body">

    {messages.length === 0 ? (
      <p className="text-muted mb-0">
        Henüz mesajınız bulunmuyor.
      </p>
    ) : (
      messages.map((message) => (
        <div
          key={message.id}
          className="border-bottom py-3"
          style={{ cursor: "pointer" }}
          onClick={() => {
            if (message.sender) {
              openConversation(message.sender);
            }
          }}
        >
          <strong>
            🔔{" "}
            {message.sender?.role === "Veterinarian"
              ? "Veteriner"
              : message.sender?.role === "SuperAdmin"
                ? "SuperAdmin"
                : "Belediye"}{" "}
            {message.sender?.firstName}{" "}
            {message.sender?.lastName}'dan mesajınız var.
          </strong>

          <br />

          <small className="text-muted">
            {new Date(message.createdAt).toLocaleString("tr-TR")}
          </small>
        </div>
      ))
    )}

  </div>
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
            🗑️ Mesajı Sil
          </h5>
        </div>

        <div className="modal-body">
          Bu mesajı silmek istediğinize emin misiniz?
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
            onClick={deleteMessage}
          >
            Evet, Sil
          </button>

        </div>

      </div>
    </div>
  </div>
)}
    </div>
  );
}

export default Messages;