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
import { hasAdminToken } from "./services/api";

/* Le composant App définit les pages du portfolio et garde le Header/Footer communs. */
function App() {

  return (
    <BrowserRouter>

      <Header />

      {/* React Router affiche la bonne page sans recharger tout le site. */}
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

      <Footer />

    </BrowserRouter>
  );
}

/* Cette protection évite d'ouvrir le tableau de bord sans session admin enregistrée. */
function AdminRoute({ children }) {
  if (!hasAdminToken()) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

export default App;
