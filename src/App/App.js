import { useEffect, useState } from 'react';
import styles from './styles.module.css';
import { ContactModal } from 'ContactModal';
import { ContactList } from 'ContactList';

export const App = () => {
  const [contacts, setContacts] = useState([]);
  const [addingContact, setAddingContact] = useState(false);

  const [editContact, setEditContact] = useState();

  const deleteContact = contactIndex => {
    if (window.confirm('Are you sure?')) {
      const newContacts = contacts.filter(
        (_, i) => i !== contactIndex,
      );

      setContacts(newContacts);
      localStorage.setItem('contacts', JSON.stringify(newContacts));
    }
  };

  useEffect(() => {
    const storedContacts = localStorage.getItem('contacts');

    if (!storedContacts) {
      localStorage.setItem('contacts', JSON.stringify([]));
      setContacts([]);
    } else {
      setContacts(JSON.parse(storedContacts));
    }
  }, []);

  return (
    <>
      {addingContact && (
        <div className={styles.modal}>
          <ContactModal
            cancel={() => setAddingContact(false)}
            submit={c => {
              const newContacts = [...contacts, c];
              localStorage.setItem(
                'contacts',
                JSON.stringify(newContacts),
              );
              setContacts(newContacts);
              setAddingContact(false);
            }}
          />
        </div>
      )}

      {typeof editContact === 'number' && (
        <div className={styles.modal}>
          <ContactModal
            contact={contacts[editContact]}
            cancel={() => setEditContact(undefined)}
            submit={c => {
              const newContacts = contacts.map((contact, index) => {
                if (index === editContact) {
                  return c;
                } else {
                  return contact;
                }
              });

              setContacts(newContacts);
              localStorage.setItem(
                'contacts',
                JSON.stringify(newContacts),
              );
              setEditContact(undefined);
            }}
          />
        </div>
      )}

      <div className={styles.main}>
        <h1>Contact List</h1>

        <div className={styles.actions}>
          <button
            className={styles.addContactBtn}
            data-testid="add-contact-btn"
            onClick={() => setAddingContact(true)}
          >
            Add Contact
          </button>
        </div>

        <ContactList
          contacts={contacts}
          onDeleteClick={deleteContact}
          onEditClick={contactIndex => setEditContact(contactIndex)}
        />
      </div>
    </>
  );
};
