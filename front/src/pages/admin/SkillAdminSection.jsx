import { FaPlus, FaSave } from "react-icons/fa";
import AdminActions from "./AdminActions";
import { groupOptions } from "./adminFormHelpers";

/* Onglet Competences : formulaire + liste des competences existantes. */
function SkillAdminSection({
  form,
  skills,
  editingId,
  onChange,
  onSubmit,
  onEdit,
  onDelete,
}) {
  return (
    <>
      <h2>Compétences</h2>

      <form className="admin-form" onSubmit={onSubmit}>
        <label>
          Nom
          <input name="label" value={form.label} onChange={onChange} required />
        </label>

        <label>
          Icône
          <input name="icon" value={form.icon} onChange={onChange} required />
        </label>

        <label>
          Groupe
          <select name="groupTitle" value={form.groupTitle} onChange={onChange}>
            {groupOptions.map((group) => (
              <option key={group}>{group}</option>
            ))}
          </select>
        </label>

        <button type="submit">
          {editingId ? <FaSave /> : <FaPlus />}
          {editingId ? "Enregistrer" : "Ajouter"}
        </button>
      </form>

      <div className="admin-list">
        {skills.map((skill) => (
          <article key={skill.id} className="admin-item">
            <div>
              <h3>{skill.label}</h3>
              <p>
                {skill.groupTitle} - icône : {skill.icon}
              </p>
            </div>

            <AdminActions item={skill} onEdit={onEdit} onDelete={onDelete} />
          </article>
        ))}
      </div>
    </>
  );
}

export default SkillAdminSection;
