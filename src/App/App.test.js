import { render, screen, fireEvent } from '@testing-library/react';
import { App } from './';

const joe = {
  name: 'Joe',
  email: 'test123@gmail.com',
  phone: '123-456-7890',
};
const bob = {
  name: 'Bob',
  email: 'test456@gmail.com',
  phone: '123-456-9999',
};

const addContact = c => {
  const addContactBtn = screen.getByTestId('add-contact-btn');

  fireEvent.click(addContactBtn);

  expect(
    screen.getByTestId('contact-modal-form'),
  ).toBeInTheDocument();

  const nameInput = screen.getByPlaceholderText('Name');
  const phoneInput = screen.getByPlaceholderText('Phone Number');
  const emailInput = screen.getByPlaceholderText('Email Address');
  const form = screen.getByTestId('contact-modal-form');

  fireEvent.change(nameInput, {
    target: { value: c.name },
  });
  fireEvent.change(phoneInput, {
    target: { value: c.phone },
  });
  fireEvent.change(emailInput, {
    target: { value: c.email },
  });

  fireEvent.submit(form);
};

test('Shows contact modal when add contact button is clicked', () => {
  render(<App />);

  expect(
    screen.queryByTestId('contact-modal-form'),
  ).not.toBeInTheDocument();

  const addContactBtn = screen.getByTestId('add-contact-btn');

  fireEvent.click(addContactBtn);

  expect(
    screen.queryByTestId('contact-modal-form'),
  ).toBeInTheDocument();
});

test('Hides contact modal when cancel button is clicked', () => {
  render(<App />);

  expect(
    screen.queryByTestId('contact-modal-form'),
  ).not.toBeInTheDocument();

  const addContactBtn = screen.getByTestId('add-contact-btn');

  fireEvent.click(addContactBtn);

  expect(
    screen.queryByTestId('contact-modal-form'),
  ).toBeInTheDocument();

  const cancelBtn = screen.getByText('Cancel');

  fireEvent.click(cancelBtn);

  expect(
    screen.queryByTestId('contact-modal-form'),
  ).not.toBeInTheDocument();
});

test('Closes modal automatically after submit', () => {
  render(<App />);

  const modal = screen.queryByTestId('contact-modal-form');

  expect(modal).not.toBeInTheDocument();

  addContact(joe);

  expect(modal).not.toBeInTheDocument();
});

describe('Local Storage Logic', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => null),
        setItem: jest.fn(c => c),
      },
      writable: true,
    });
  });

  test('Properly manages the edit scenario for the contact modal', () => {
    render(<App />);

    addContact(joe);

    const editBtn = screen.getByTestId('edit-btn-0');

    fireEvent.click(editBtn);

    expect(
      screen.getByTestId('contact-modal-form'),
    ).toBeInTheDocument();

    const nameInput = screen.getByPlaceholderText('Name');
    expect(nameInput).toHaveValue('Joe');

    fireEvent.change(nameInput, {
      target: {
        value: 'Port Exe',
      },
    });

    expect(nameInput).toHaveValue('Port Exe');

    fireEvent.click(screen.getByText('Submit'));

    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      'contacts',
      JSON.stringify([
        {
          ...joe,
          name: 'Port Exe',
        },
      ]),
    );
  });

  test('Properly manages the deletion of contacts', () => {
    Object.defineProperty(window, 'confirm', {
      value: jest.fn(() => true),
      writable: true,
    });

    render(<App />);

    addContact(joe);
    addContact(bob);

    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      'contacts',
      JSON.stringify([joe, bob]),
    );

    const deleteBtn = screen.getByTestId('delete-btn-0');

    fireEvent.click(deleteBtn);

    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      'contacts',
      JSON.stringify([bob]),
    );
  });

  test('Initializes empty array in localStorage if no contacts are stored yet', () => {
    render(<App />);

    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      'contacts',
      JSON.stringify([]),
    );
  });

  test('Properly stores submitted users', () => {
    render(<App />);

    const modal = screen.queryByTestId('contact-modal-form');

    expect(modal).not.toBeInTheDocument();

    addContact(joe);

    expect(modal).not.toBeInTheDocument();

    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      'contacts',
      JSON.stringify([joe]),
    );

    addContact(bob);

    expect(modal).not.toBeInTheDocument();

    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      'contacts',
      JSON.stringify([joe, bob]),
    );
  });
});
