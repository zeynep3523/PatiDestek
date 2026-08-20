import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function MainLayout({ children }) {
  const location = useLocation();

  const token = localStorage.getItem("token");

const hideLayout =
  (!token && location.pathname === "/") ||
  location.pathname === "/login" ||
  location.pathname === "/register";

  return (
    <>
      {!hideLayout && <Navbar />}

      <main className={hideLayout ? "" : "container mt-4"}>
        {children}
      </main>

      {!hideLayout && <Footer />}
    </>
  );
}

export default MainLayout;