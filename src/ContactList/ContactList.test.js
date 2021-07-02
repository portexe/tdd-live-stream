import { render, screen, fireEvent } from '@testing-library/react';
import { ContactList } from './';

test('Renders list of contacts', () => {
  const contacts = [
    {
      name: 'Joe',
      email: 'test123@gmail.com',
      phone: '987-654-3210',
    },
    {
      name: 'Bob',
      email: 'test321@gmail.com',
      phone: '123-456-7890',
    },
  ];

  render(<ContactList contacts={contacts} />);

  const joeRow = screen.getByTestId('contact-0');
  const bobRow = screen.getByTestId('contact-1');

  expect(joeRow).toHaveTextContent('Joe');
  expect(joeRow).toHaveTextContent('test123@gmail.com');
  expect(joeRow).toHaveTextContent('987-654-3210');

  expect(bobRow).toHaveTextContent('Bob');
  expect(bobRow).toHaveTextContent('test321@gmail.com');
  expect(bobRow).toHaveTextContent('123-456-7890');
});

test('Calls the edit function when edit button is clicked', () => {
  const contacts = [
    {
      name: 'Joe',
      email: 'test123@gmail.com',
      phone: '987-654-3210',
    },
  ];

  const editFn = jest.fn();

  render(<ContactList contacts={contacts} onEditClick={editFn} />);

  const editBtnJoe = screen.getByTestId('edit-btn-0');

  fireEvent.click(editBtnJoe);

  expect(editFn).toHaveBeenCalledWith(0);
});

test('Calls the delete function when delete button is clicked', () => {
  const contacts = [
    {
      name: 'Joe',
      email: 'test123@gmail.com',
      phone: '987-654-3210',
    },
  ];

  const deleteFn = jest.fn();

  render(
    <ContactList contacts={contacts} onDeleteClick={deleteFn} />,
  );

  const deleteBtnJoe = screen.getByTestId('delete-btn-0');

  fireEvent.click(deleteBtnJoe);

  expect(deleteFn).toHaveBeenCalledWith(0);
});
