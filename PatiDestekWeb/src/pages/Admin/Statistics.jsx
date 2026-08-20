import { useEffect, useState } from "react";
import axios from "axios";
import { API_ORIGIN } from "../../services/api";

import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

import { Pie, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

function Statistics() {
  const [stats, setStats] = useState(null);
  const [period, setPeriod] = useState("all");

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const token = localStorage.getItem("token");
          const user = JSON.parse(localStorage.getItem("user"));

const endpoint =
  user?.role === "Municipality"
    ? `${API_ORIGIN}/api/Report/MunicipalityStatistics`
    : `${API_ORIGIN}/api/Report/AdminStatistics`;

const response = await axios.get(
  `${endpoint}?period=${period}`,
        
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data.districts);
        console.log(response.data.animalTypes);

        setStats(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchStatistics();
  }, [period]);

  if (!stats) {
    return <h4>Yükleniyor...</h4>;
  }
  const validDistricts = [
  "Atatürk Mahallesi",
  "Bahçelievler Mahallesi",
  "Cumhuriyet Mahallesi",
  "İnönü Mahallesi",
  "İsmetpaşa Mahallesi",
  "Karaağaç Mahallesi",
  "Mimar Sinan Mahallesi",
  "Pınarça Mahallesi",
  "Yıldızkent Mahallesi",
];
const districtData = validDistricts.map((name) => {
  const district = stats.districts?.find(
    (x) => x.district === name
  );

  return {
    district: name,
    count: district ? district.count : 0,
  };
});

  return (
    <>
      <h2 className="mb-4">📊 İstatistikler</h2>
      <div className="btn-group mb-4">

  <button
    className={`btn ${period === "today" ? "btn-success" : "btn-outline-success"}`}
    onClick={() => setPeriod("today")}
  >
    Bugün
  </button>

  <button
    className={`btn ${period === "week" ? "btn-success" : "btn-outline-success"}`}
    onClick={() => setPeriod("week")}
  >
    Haftalık
  </button>

  <button
    className={`btn ${period === "month" ? "btn-success" : "btn-outline-success"}`}
    onClick={() => setPeriod("month")}
  >
    Aylık
  </button>

  <button
    className={`btn ${period === "year" ? "btn-success" : "btn-outline-success"}`}
    onClick={() => setPeriod("year")}
  >
    Yıllık
  </button>

</div>
<div className="mb-4">
  <h5 className="text-secondary">
    Gösterilen Dönem :
    <span className="text-success ms-2">
      {period === "today"
  ? "Bugün"
  : period === "week"
  ? "Haftalık"
  : period === "month"
  ? "Aylık"
  : "Yıllık"}
    </span>
  </h5>
</div>
<div className="row">
  <div className="col-lg-6 mb-4">
  <div className="card shadow h-100">

    <div className="card-header">
      <h5 className="mb-0">🥧 Kategori Dağılımı</h5>
    </div>

    <div
      className="card-body d-flex justify-content-center align-items-center"
      style={{ minHeight: "200px" }}
    >
      <Pie
        data={{
          labels: [
            "Yaralı",
            "Kayıp",
            "Mama",
            "Su",
            "Geçici Yuva",
            "Acil",
            "Ölü",
            "Diğer",
          ],
          datasets: [
            {
              data: [
                stats.yaraliHayvan,
                stats.kayipHayvan,
                stats.mamaIhtiyaci,
                stats.suIhtiyaci,
                stats.geciciYuva,
                stats.acilKurtarma,
                stats.oluHayvan,
                stats.diger,
              ],
              backgroundColor: [
                "#dc3545",
                "#0d6efd",
                "#ffc107",
                "#20c997",
                "#6f42c1",
                "#fd7e14",
                "#212529",
                "#6c757d",
              ],
              borderColor: "#fff",
              borderWidth: 2,
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
            },
          },
        }}
      />
    </div>

  </div>
</div>
<div className="col-lg-6 mb-4">
  <div className="card shadow h-100">

    <div className="card-header">
      <h5 className="mb-0">🚨 Öncelik Dağılımı</h5>
    </div>

    <div
      className="card-body d-flex justify-content-center align-items-center"
      style={{ minHeight: "200px" }}
    >
      <Bar
        data={{
          labels: ["Düşük", "Orta", "Yüksek", "Kritik"],
          datasets: [
            {
              label: "İhbar Sayısı",
              data: [
                stats.dusuk,
                stats.orta,
                stats.yuksek,
                stats.kritik,
              ],
              backgroundColor: [
                "#28a745",
                "#ffc107",
                "#fd7e14",
                "#dc3545",
              ],
              borderRadius: 8,
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1,
              },
            },
          },
        }}
      />
    </div>

  </div>
</div>

  <div className="col-lg-6 mb-4">
  <div className="card shadow h-100">

    <div className="card-header">
      <h5 className="mb-0">📍 Mahalle Dağılımı</h5>
    </div>

    <div
      className="card-body d-flex justify-content-center align-items-center"
      style={{ minHeight: "200px" }}
    >
      <Bar
  data={{
    labels: districtData.map(x => x.district),
    datasets: [
      {
        label: "İhbar Sayısı",
        data: districtData.map(x => x.count),
        backgroundColor: [
          "#198754",
          "#0d6efd",
          "#ffc107",
          "#dc3545",
          "#20c997",
          "#6f42c1",
          "#fd7e14",
          "#6c757d",
          "#6610f2",
        ],
        borderRadius: 8,
      },
    ],
  }}
  options={{
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
      x: {
        ticks: {
          autoSkip: false,
          maxRotation: 45,
          minRotation: 45,
        },
      },
    },
  }}
/>
    </div>

  </div>
</div>



<div className="col-lg-6 mb-4">
  <div className="card shadow h-100">

    <div className="card-header">
      <h5 className="mb-0">🐾 Hayvan Türleri</h5>
    </div>

    <div
  className="card-body"
  style={{ minHeight: "300px" }}
>
  <Bar
    data={{
      labels: stats.animalTypes.map((x) => x.animal),
      datasets: [
        {
          label: "İhbar Sayısı",
          data: stats.animalTypes.map((x) => x.count),
          backgroundColor: [
            "#198754",
            "#0d6efd",
            "#ffc107",
            "#dc3545",
            "#20c997",
            "#6f42c1",
            "#fd7e14",
            "#6c757d",
            "#6610f2",
            "#0dcaf0",
            "#ff6384",
            "#36a2eb",
          ],
          borderRadius: 8,
        },
      ],
    }}
    options={{
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
          },
        },
        x: {
          ticks: {
            autoSkip: false,
            maxRotation: 45,
            minRotation: 45,
          },
        },
      },
    }}
  />
</div>

  </div>
</div>
</div>
<div className="card shadow">
  <div className="card-header">
    <h5 className="mb-0">📋 Genel İstatistikler</h5>
  </div>

  <div className="card-body">
    <div className="row text-center">

      <div className="col-md-3">
        <h6>Toplam</h6>
        <h3>{stats.totalReports}</h3>
      </div>

      <div className="col-md-3">
        <h6>Bekleyen</h6>
        <h3>{stats.waiting}</h3>
      </div>

      <div className="col-md-3">
        <h6>İnceleniyor</h6>
        <h3>{stats.reviewing}</h3>
      </div>

      <div className="col-md-3">
        <h6>Tamamlanan</h6>
        <h3>{stats.completed}</h3>
      </div>

    </div>
  </div>
  

</div>
    </>
  );
  }

export default Statistics;


