import React from "react";

function Vets() {
    const vets = [
    {
        name: "Kapaklı Belediyesi Veteriner İşleri",
        type: "Belediye",
        address: "İnönü Mahallesi Eski Cami Caddesi No: 4-6 Kapaklı / Tekirdağ",
        phone: "444 80 59",
        hours: "Pazartesi - Cuma: 08:00 - 17:00",
        free: true,
        map: "https://www.google.com/maps/search/?api=1&query=Kapaklı+Belediyesi+Veteriner+İşleri"
    },
    {
        name: "Kapaklı Elit Veterinerlik",
        type: "Özel",
        address: "İnönü, Mandalı Sk. Yılmaz Plaza No:4A, 59510 Kapaklı / Tekirdağ",
        phone: "0532 594 84 18",
        hours: "Pazartesi - Cumartesi: 09:00 - 21:00 | Pazar: 09:00 - 16:00",
        free: false,
        map: "https://www.google.com/maps/search/?api=1&query=Kapaklı+Elit+Veterinerlik"
    },
    {
    name: "Karacaoğlu Veteriner Kliniği",
    type: "Özel",
    address: "Karlı Mahallesi, Karlı Köyü İç Yolu, Kapaklı / Tekirdağ",
    phone: "0546 419 62 38",
    free: false,
    map: "https://www.google.com/maps/search/?api=1&query=Karacaoğlu+Veteriner+Kliniği+Kapaklı"
}
];
    return (
        <div className="container py-4">

            <div className="text-center mb-5">
                <h2 className="fw-bold">🐾 Veterinerler</h2>

                <p className="text-muted">
                    Kapaklı'daki veteriner hizmetlerine kolayca ulaşın.
                </p>
            </div>

            <div className="row g-4">

                {vets.map((vet, index) => (
                    <div className="col-lg-6" key={index}>

                        <div className="card shadow-sm border-0 h-100">
                            <div className="card-body p-4">

                                <div className="d-flex justify-content-between align-items-center mb-3">

                                    <h4 className="fw-bold mb-0">
                                        🏥 {vet.name}
                                    </h4>

                                    <span
                                        className={`badge ${
                                            vet.free
                                                ? "bg-success"
                                                : "bg-danger"
                                        }`}
                                    >
                                        {vet.free ? "BELEDİYE" : "ÖZEL"}
                                    </span>

                                </div>

                                <p>
                                    <strong>📍 Adres:</strong><br />
                                    {vet.address}
                                </p>

                                <p>
                                    <strong>📞 Telefon:</strong><br />

                                    <a href={`tel:${vet.phone.replace(/\s/g, "")}`}>
                                        {vet.phone}
                                    </a>
                                </p>
                                <p>
    <strong>🕐 Çalışma Saatleri:</strong><br />
    {vet.hours || "Bilgi bulunmuyor"}
</p>

                                <div className="d-flex gap-2">

                                    <a
                                        href={`tel:${vet.phone.replace(/\s/g, "")}`}
                                        className="btn btn-success"
                                    >
                                        📞 Ara
                                    </a>

                                    <a
                                        href={vet.map}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="btn btn-outline-success"
                                    >
                                        🗺️ Yol Tarifi
                                    </a>

                                </div>

                            </div>
                        </div>

                    </div>
                ))}

            </div>

        </div>
    );
}

export default Vets;