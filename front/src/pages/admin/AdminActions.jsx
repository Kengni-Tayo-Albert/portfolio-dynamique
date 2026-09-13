import { FaEdit, FaTrash } from "react-icons/fa";

/* Boutons communs aux listes admin : modifier ou supprimer un element. */
function AdminActions({ item, onEdit, onDelete }) {
  return (
    <div className="admin-item-actions">
      <button type="button" onClick={() => onEdit(item)}>
        <FaEdit />
        Modifier
      </button>
      <button type="button" onClick={() => onDelete(item.id)}>
        <FaTrash />
        Supprimer
      </button>
    </div>
  );
}

export default AdminActions;
