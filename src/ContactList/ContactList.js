import styles from './styles.module.css';

export const ContactList = ({
  contacts,
  onEditClick,
  onDeleteClick,
}) => (
  <div className={styles.main}>
    {contacts.map((c, index) => (
      <div
        key={`row-${index}`}
        data-testid={`contact-${index}`}
        className={styles.row}
      >
        <div className={styles.name}>{c.name}</div>
        <div className={styles.phone}>{c.phone}</div>
        <div className={styles.email}>{c.email}</div>

        <div
          className={styles.edit}
          data-testid={`edit-btn-${index}`}
          onClick={() => onEditClick(index)}
        >
          Edit
        </div>

        <div
          className={styles.delete}
          data-testid={`delete-btn-${index}`}
          onClick={() => onDeleteClick(index)}
        >
          Delete
        </div>
      </div>
    ))}
  </div>
);
