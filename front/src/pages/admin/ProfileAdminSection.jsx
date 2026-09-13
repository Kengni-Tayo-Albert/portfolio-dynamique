import { FaSave } from "react-icons/fa";

/* Onglet Profil/CV : formulaire qui alimente la page CV publique. */
function ProfileAdminSection({ form, onChange, onSubmit }) {
  return (
    <>
      <h2>Profil et CV complet</h2>

      <form className="admin-form profile-form" onSubmit={onSubmit}>
        <label>
          Nom
          <input name="name" value={form.name} onChange={onChange} required />
        </label>

        <label>
          Titre professionnel
          <input name="title" value={form.title} onChange={onChange} required />
        </label>

        <label>
          Résumé
          <textarea name="summary" value={form.summary} onChange={onChange} required />
        </label>

        <label>
          Age
          <input name="age" value={form.age} onChange={onChange} required />
        </label>

        <label className="full-width">
          Contacts complets
          <textarea name="contacts" value={form.contacts} onChange={onChange} required />
          <small>Une ligne par contact : icone | libelle | lien</small>
        </label>

        <label>
          Competences techniques
          <textarea name="skills" value={form.skills} onChange={onChange} required />
          <small>Une competence par ligne.</small>
        </label>

        <label>
          Savoir-etre
          <textarea name="softSkills" value={form.softSkills} onChange={onChange} required />
          <small>Un savoir-etre par ligne.</small>
        </label>

        <label>
          Langues
          <textarea name="languages" value={form.languages} onChange={onChange} required />
          <small>Une langue par ligne.</small>
        </label>

        <label>
          Loisirs
          <textarea name="hobbies" value={form.hobbies} onChange={onChange} required />
          <small>Une ligne par loisir : icone | libelle</small>
        </label>

        <label className="full-width">
          Parcours academique
          <textarea name="formations" value={form.formations} onChange={onChange} required />
          <small>Une ligne par formation : titre | lieu | date | detail</small>
        </label>

        <label className="full-width">
          Experiences professionnelles
          <textarea name="experiences" value={form.experiences} onChange={onChange} required />
          <small>
            Une ligne par experience : titre | entreprise | date | lieu | mission 1 ; mission 2
          </small>
        </label>

        <button type="submit">
          <FaSave />
          Enregistrer le CV
        </button>
      </form>
    </>
  );
}

export default ProfileAdminSection;
