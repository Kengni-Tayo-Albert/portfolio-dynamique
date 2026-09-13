import { FaTrash } from "react-icons/fa";

function formatMessageDate(dateValue) {
  if (!dateValue) return "Date inconnue";

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateValue));
}

/* Onglet Messages : lecture et suppression des messages recus. */
function MessagesAdminSection({ messages, onDelete }) {
  return (
    <>
      <h2>Messages contact</h2>
      <p className="admin-section-text">
        Consultez les messages envoyes depuis le formulaire de contact.
      </p>

      {messages.length === 0 ? (
        <p className="api-state">Aucun message pour le moment.</p>
      ) : (
        <div className="admin-list">
          {messages.map((message) => (
            <article key={message.id} className="admin-item admin-message">
              <div>
                <div className="admin-message-header">
                  <h3>{message.subject}</h3>
                  <span>{formatMessageDate(message.createdAt)}</span>
                </div>
                <p>
                  {message.name} -{" "}
                  <a href={`mailto:${message.email}`}>{message.email}</a>
                </p>
                <p>{message.message}</p>
              </div>

              <div className="admin-item-actions">
                <button type="button" onClick={() => onDelete(message.id)}>
                  <FaTrash />
                  Supprimer
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}

export default MessagesAdminSection;
