import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaLock, FaUserShield } from "react-icons/fa";
import { loginAdmin } from "../services/api";

function AdminLogin() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setCredentials((currentCredentials) => ({
      ...currentCredentials,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await loginAdmin(credentials);
      navigate("/admin");
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="admin-login-page">
      <section className="admin-login-card">
        <div className="admin-login-icon">
          <FaUserShield />
        </div>

        <p className="section-label">ADMINISTRATION</p>
        <h1>Connexion admin</h1>
        <p>
          Accédez à l'espace de gestion sécurisé du portfolio dynamique.
        </p>

        <form onSubmit={handleSubmit}>
          <label>
            Email administrateur
            <input
              type="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              placeholder="admin@portfolio.local"
            />
          </label>

          <label>
            Mot de passe
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="Mot de passe admin"
            />
          </label>

          {error && <p className="admin-login-error">{error}</p>}

          <button type="submit" disabled={isSubmitting}>
            <FaLock />
            {isSubmitting ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <p className="admin-demo-help">
          Les identifiants sont vérifiés par l'API et stockés dans MongoDB.
        </p>
      </section>
    </main>
  );
}

export default AdminLogin;
