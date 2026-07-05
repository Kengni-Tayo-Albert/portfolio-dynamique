import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";

import "./App.css";

import Header from "./components/Header";
import Footer from "./components/Footer";

import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import Home from "./pages/Home";
import About from "./pages/About";
import Cv from "./pages/Cv";
import Skills from "./pages/Skills";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";

/* APP - Structure principale de l'application */
function App() {

  return (
    <BrowserRouter>

      {/* HEADER - Visible sur toutes les pages */}
      <Header />

      {/* ROUTER - Navigation sans rechargement */}
      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/a-propos"
          element={<About />}
        />
        <Route path="/cv" element={<Cv />} />
        <Route path="/competences" element={<Skills />} />
        <Route path="/projets" element={<Projects />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        

      </Routes>

      {/* FOOTER - Visible sur toutes les pages */}
      <Footer />

    </BrowserRouter>
  );
}

function AdminRoute({ children }) {
  const adminToken = localStorage.getItem("portfolioAdminToken");

  if (!adminToken) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

export default App;
