import { useEffect, useState } from "react";
import { getStaff, deleteStaff } from "../services/staffService";
import { useNavigate } from "react-router-dom";


function Staff() {
    
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    const currentUser = user || JSON.parse(localStorage.getItem("user"));
const [staff, setStaff] = useState([]);

const [filter, setFilter] = useState("all");
const [search, setSearch] = useState("");
const [selectedStaff, setSelectedStaff] = useState(null);
const [deleteStaffModal, setDeleteStaffModal] = useState(null);
const filteredStaff = staff.filter((x) => {
    const roleMatch =
        filter === "all" ||
        x.role?.toLowerCase() === filter.toLowerCase();

    const searchMatch =
        `${x.firstName} ${x.lastName} ${x.email}`
            .toLowerCase()
            .includes(search.toLowerCase());

    return roleMatch && searchMatch;
});
  useEffect(() => {
    loadStaff();
  }, []);
  const handleDelete = async () => {

    if (!deleteStaffModal) return;

    try {

        await deleteStaff(deleteStaffModal.id);

        setDeleteStaffModal(null);

        loadStaff();

    } catch (err) {

        console.log(err);

    }


};

  const loadStaff = async () => {
  try {
    const data = await getStaff();

    console.log("Staff API:", data);

    setStaff(data);
  } catch (err) {
    console.log("HATA:", err);
    console.log("Response:", err.response);
}
};

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">

  <h2>👨‍💼 Görevli Yönetimi</h2>

  {JSON.parse(localStorage.getItem("user"))?.role === "SuperAdmin" && (
    <button
        className="btn btn-success"
        onClick={() => navigate("/admin/create-staff")}
    >
        ➕ Yeni Görevli
    </button>
)}
</div>

<div className="mb-4 d-flex gap-2">

  <button
    className={`btn ${filter === "all" ? "btn-success" : "btn-outline-success"}`}
    onClick={() => setFilter("all")}
  >
    📋 Tüm Görevliler
  </button>

  <button
    className={`btn ${filter === "Municipality" ? "btn-success" : "btn-outline-success"}`}
    onClick={() => setFilter("Municipality")}
  >
    🏛 Belediye
  </button>

  <button
    className={`btn ${filter === "Veterinarian" ? "btn-success" : "btn-outline-success"}`}
    onClick={() => setFilter("Veterinarian")}
  >
    🩺 Veteriner
  </button>
  <input
    type="text"
    className="form-control"
    placeholder="🔍 Ad, soyad veya e-posta ara..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
/>

</div>
      <div className="card shadow">
        <div className="card-body">

          <table className="table table-hover">
            <thead>
              <tr>
    <th>Ad Soyad</th>
    <th>Rol</th>
    <th>Görev</th>
    <th>Telefon</th>
    <th>E-Posta</th>
    <th>İşlemler</th>
</tr>
            </thead>
            

            <tbody>
              {filteredStaff.map((item) => (
                <tr key={item.id}>

    <td>
        {item.firstName} {item.lastName}
    </td>

    <td>
        {item.role === "Municipality"
            ? "🏛 Belediye"
            : item.role === "Veterinarian"
            ? "🩺 Veteriner"
            : "👑 SuperAdmin"}
    </td>

    <td>{item.jobTitle}</td>

    <td>{item.phone}</td>

    <td>{item.email}</td>
    <td>
      <button
    className="btn btn-sm btn-info me-2"
    onClick={() => setSelectedStaff(item)}
>
    👁
</button>

{JSON.parse(localStorage.getItem("user"))?.role === "SuperAdmin" && (
    <>
        <button
            className="btn btn-sm btn-warning me-2"
            onClick={() => navigate(`/admin/edit-staff/${item.id}`)}
        >
            ✏️
        </button>

        <button
            className="btn btn-sm btn-danger"
            onClick={() => setDeleteStaffModal(item)}
        >
            🗑️
        </button>
    </>
)}
    
</td>

</tr>
                
              ))}
            </tbody>

          </table>

        </div>
      </div>
      {selectedStaff && (

<div
className="modal fade show"
style={{
display:"block",
background:"rgba(0,0,0,.5)"
}}
>

<div className="modal-dialog">

<div className="modal-content">

<div className="modal-header">

<h5>👤 Görevli Bilgileri</h5>

</div>

<div className="modal-body">

<p><b>Ad Soyad:</b> {selectedStaff.firstName} {selectedStaff.lastName}</p>

<p><b>E-Posta:</b> {selectedStaff.email}</p>

<p><b>Telefon:</b> {selectedStaff.phone}</p>

<p><b>Rol:</b> {selectedStaff.role}</p>

<p><b>Görev:</b> {selectedStaff.jobTitle}</p>

</div>

<div className="modal-footer">

<button
    className="btn btn-secondary"
    onClick={() => setSelectedStaff(null)}
>
    Kapat
</button>

</div>

</div>

</div>

</div>

)}

{deleteStaffModal && (

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
                    🗑️ Görevliyi Sil
                </h5>

            </div>

            <div className="modal-body">

                <p>
                    <strong>
                        {deleteStaffModal.firstName} {deleteStaffModal.lastName}
                    </strong>
                    {" "}isimli görevliyi kalıcı olarak silmek istediğinize emin misiniz?
                </p>

                <div className="alert alert-danger mb-0">
                    Bu işlem geri alınamaz.
                </div>

            </div>

            <div className="modal-footer">

                <button
                    className="btn btn-secondary"
                    onClick={() => setDeleteStaffModal(null)}
                >
                    İptal
                </button>

                <button
                    className="btn btn-danger"
                    onClick={handleDelete}
                >
                    Sil
                </button>

            </div>

        </div>

    </div>

</div>

)}

    </>
  );
};

export default Staff;