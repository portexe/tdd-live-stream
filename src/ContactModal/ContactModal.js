import { useEffect, useState } from 'react';
import styles from './styles.module.css';
import { Input } from '../Input';

export const ContactModal = ({ cancel, submit, contact }) => {
  const [name, setName] = useState(contact?.name || '');
  const [phone, setPhone] = useState(contact?.phone || '');
  const [email, setEmail] = useState(contact?.email || '');

  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');

  const [nameDirty, setNameDirty] = useState(false);
  const [emailDirty, setEmailDirty] = useState(false);
  const [phoneDirty, setPhoneDirty] = useState(false);

  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    setNameError('');
    setPhoneError('');
    setEmailError('');

    let _valid = (() => {
      if (!name) {
        return false;
      } else if (!phone) {
        return false;
      } else if (!email) {
        return false;
      } else if (!/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/.test(phone)) {
        return false;
      } else if (
        !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)
      ) {
        return false;
      } else {
        return true;
      }
    })();

    if (nameDirty && !name) {
      setNameError('Name is required');
    } else if (phoneDirty && !phone) {
      setPhoneError('Phone is required');
    } else if (emailDirty && !email) {
      setEmailError('Email is required');
    } else if (
      phoneDirty &&
      !/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/.test(phone)
    ) {
      setPhoneError('Phone is improperly formatted');
    } else if (
      emailDirty &&
      !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)
    ) {
      setEmailError('Email is improperly formatted');
    }

    setIsValid(_valid);
  }, [name, phone, email, nameDirty, phoneDirty, emailDirty]);

  return (
    <>
      <div className={styles.main}>
        <form
          data-testid="contact-modal-form"
          onSubmit={e => {
            e.preventDefault();
            if (isValid) {
              submit({
                name,
                email,
                phone,
              });
            }
          }}
        >
          <h2>Contact Info:</h2>
          <Input
            value={name}
            label="Name"
            errorMessage={nameError}
            onValueUpdated={val => {
              setNameDirty(true);
              setName(val);
            }}
          />

          <Input
            value={phone}
            label="Phone Number"
            errorMessage={phoneError}
            onValueUpdated={val => {
              setPhoneDirty(true);
              setPhone(val);
            }}
          />

          <Input
            value={email}
            label="Email Address"
            errorMessage={emailError}
            onValueUpdated={val => {
              setEmailDirty(true);
              setEmail(val);
            }}
          />
          <div className={styles.actions}>
            <button disabled={!isValid} className={styles.submit}>
              Submit
            </button>
            <button
              type="button"
              onClick={cancel}
              className={styles.cancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <div className={styles.backdrop}></div>
    </>
  );
};
