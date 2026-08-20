import { useState } from "react";
import { createStaff } from "../../services/staffService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function CreateStaff() {
    const navigate = useNavigate();

    const [staff, setStaff] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        jobTitle: "",
        role: ""
    });

    const handleChange = (e) => {
        setStaff({
            ...staff,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
    e.preventDefault();

    if (
        !staff.firstName.trim() ||
        !staff.lastName.trim() ||
        !staff.phone.trim() ||
        !staff.email.trim() ||
        !staff.password.trim() ||
        !staff.jobTitle.trim() ||
        !staff.role.trim()
    ) {
        toast.error("Lütfen tüm alanları doldurun.");
        return;
    }

    try {
        await createStaff(staff);

        toast.success("Görevli başarıyla oluşturuldu.");
        navigate("/admin/staff");
    }
    catch (err) {
        console.log(err);
        console.log(err.response);
        console.log(err.response?.data);

        toast.error("Görevli oluşturulamadı.");
    }
};

       

    return (
        <div className="container py-4">

            <div className="card shadow">

                <div className="card-body">

                    <h2 className="mb-4">
                        👨‍💼 Yeni Görevli
                    </h2>

                    <form onSubmit={handleSubmit} autoComplete="off">

                        <input
                            className="form-control mb-3"
                            placeholder="Ad"
                            name="firstName"
                            onChange={handleChange}
                        />

                        <input
                            className="form-control mb-3"
                            placeholder="Soyad"
                            name="lastName"
                            onChange={handleChange}
                        />

                        <input
                            className="form-control mb-3"
                            placeholder="Telefon"
                            name="phone"
                            onChange={handleChange}
                        />

                        <input
  className="form-control mb-3"
  placeholder="E-Posta"
  name="email"
  value={staff.email}
  autoComplete="off"
  onChange={handleChange}
/>

                        <input
  type="password"
  className="form-control mb-3"
  placeholder="Şifre"
  name="password"
  value={staff.password}
  autoComplete="new-password"
  onChange={handleChange}
/>

                        <input
                            className="form-control mb-3"
                            placeholder="Görev"
                            name="jobTitle"
                            onChange={handleChange}
                        />
                        <select
    className="form-select mb-4"
    name="role"
    value={staff.role}
    onChange={handleChange}
>
    <option value="">Rolü seçiniz</option>

    <option value="Municipality">
        🏛️ Belediye Personeli
    </option>

    <option value="Veterinarian">
        🩺 Veteriner
    </option>
</select>

                        

                        <button
                            className="btn btn-success w-100"
                        >
                            Görevli Oluştur
                        </button>

                    </form>

                </div>

            </div>

        </div>
    );
}

export default CreateStaff;