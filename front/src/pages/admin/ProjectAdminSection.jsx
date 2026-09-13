import { FaPlus, FaSave } from "react-icons/fa";
import AdminActions from "./AdminActions";

/* Onglet Projets : formulaire + liste des projets existants. */
function ProjectAdminSection({
  form,
  projects,
  editingId,
  uploadStatus,
  onChange,
  onImageUpload,
  onSubmit,
  onEdit,
  onDelete,
}) {
  return (
    <>
      <h2>Projets</h2>

      <form className="admin-form" onSubmit={onSubmit}>
        <label>
          Titre
          <input name="title" value={form.title} onChange={onChange} required />
        </label>

        <label>
          Sous-titre
          <input name="subtitle" value={form.subtitle} onChange={onChange} required />
        </label>

        <label>
          Description complète
          <input name="description" value={form.description} onChange={onChange} required />
        </label>

        <label>
          Description courte
          <input
            name="shortDescription"
            value={form.shortDescription}
            onChange={onChange}
            required
          />
        </label>

        <label>
          Image
          <input name="image" value={form.image} onChange={onChange} required />
        </label>

        <label>
          Importer une image
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            onChange={(event) => {
              onImageUpload(event.target.files?.[0]);
              event.target.value = "";
            }}
          />
          <small>Formats acceptes : JPG, PNG, WebP, GIF. Taille maximale : 3 Mo.</small>
        </label>

        {uploadStatus && <p className="admin-upload-status">{uploadStatus}</p>}

        <label>
          Technologies
          <input name="tags" value={form.tags} onChange={onChange} required />
        </label>

        <label>
          GitHub
          <input name="github" value={form.github} onChange={onChange} required />
        </label>

        <label>
          Démo
          <input name="demo" value={form.demo} onChange={onChange} required />
        </label>

        <label>
          Mis en avant
          <select name="featured" value={form.featured} onChange={onChange}>
            <option value="false">Non</option>
            <option value="true">Oui</option>
          </select>
        </label>

        <button type="submit">
          {editingId ? <FaSave /> : <FaPlus />}
          {editingId ? "Enregistrer" : "Ajouter"}
        </button>
      </form>

      <div className="admin-list">
        {projects.map((project) => (
          <article key={project.id} className="admin-item">
            <div>
              <h3>{project.title}</h3>
              <p>{project.shortDescription}</p>
            </div>

            <AdminActions item={project} onEdit={onEdit} onDelete={onDelete} />
          </article>
        ))}
      </div>
    </>
  );
}

export default ProjectAdminSection;
