import { render, screen, fireEvent } from '@testing-library/react';
import { ContactModal } from './';

describe('Edit Contact', () => {
  test('Initializes form with contact info', () => {
    render(
      <ContactModal
        contact={{
          name: 'Joe',
          phone: '987-654-3210',
          email: 'test@gmail.com',
        }}
      />,
    );

    const nameInput = screen.getByPlaceholderText('Name');
    const phoneInput = screen.getByPlaceholderText('Phone Number');
    const emailInput = screen.getByPlaceholderText('Email Address');
    const submitButton = screen.getByText('Submit');

    expect(nameInput).toBeInTheDocument();
    expect(phoneInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();

    expect(nameInput).toHaveValue('Joe');
    expect(phoneInput).toHaveValue('987-654-3210');
    expect(emailInput).toHaveValue('test@gmail.com');

    expect(screen.queryByTestId('error')).not.toBeInTheDocument();

    expect(submitButton).not.toBeDisabled();
  });
});

describe('Create Contact', () => {
  test('Initializes empty form', () => {
    render(<ContactModal />);

    const nameInput = screen.getByPlaceholderText('Name');
    const phoneInput = screen.getByPlaceholderText('Phone Number');
    const emailInput = screen.getByPlaceholderText('Email Address');
    const submitButton = screen.getByText('Submit');

    expect(nameInput).toBeInTheDocument();
    expect(phoneInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();

    expect(nameInput).toHaveValue('');
    expect(phoneInput).toHaveValue('');
    expect(emailInput).toHaveValue('');

    expect(screen.queryByTestId('error')).not.toBeInTheDocument();

    expect(submitButton).toBeDisabled();
  });

  test('Calls cancel when cancel button is clicked', () => {
    const cancelFn = jest.fn();
    render(<ContactModal cancel={cancelFn} />);

    const cancelBtn = screen.getByText('Cancel');
    fireEvent.click(cancelBtn);
    expect(cancelFn).toHaveBeenCalled();
  });

  test('Enables submit button once form is valid', () => {
    render(<ContactModal />);

    const nameInput = screen.getByPlaceholderText('Name');
    const phoneInput = screen.getByPlaceholderText('Phone Number');
    const emailInput = screen.getByPlaceholderText('Email Address');
    const submitButton = screen.getByText('Submit');

    fireEvent.change(nameInput, { target: { value: 'Port Exe' } });

    expect(screen.queryByTestId('error')).not.toBeInTheDocument();

    fireEvent.change(phoneInput, {
      target: { value: '123-456-7890' },
    });

    expect(screen.queryByTestId('error')).not.toBeInTheDocument();

    fireEvent.change(emailInput, {
      target: { value: 'portexeofficial@gmail.com' },
    });

    expect(screen.queryByTestId('error')).not.toBeInTheDocument();

    expect(submitButton).not.toBeDisabled();
  });

  test('Disables submit button when fields are invalid', () => {
    render(<ContactModal />);

    const nameInput = screen.getByPlaceholderText('Name');
    const phoneInput = screen.getByPlaceholderText('Phone Number');
    const emailInput = screen.getByPlaceholderText('Email Address');
    const submitButton = screen.getByText('Submit');

    fireEvent.change(nameInput, { target: { value: 'Port Exe' } });
    fireEvent.change(phoneInput, {
      target: { value: '123-456-7890' },
    });
    fireEvent.change(emailInput, {
      target: { value: 'portexeofficial' },
    });

    expect(submitButton).toBeDisabled();

    fireEvent.change(emailInput, {
      target: { value: 'portexeofficial@gmail.com' },
    });

    expect(submitButton).not.toBeDisabled();

    fireEvent.change(phoneInput, { target: { value: '1234567890' } });

    expect(submitButton).toBeDisabled();
  });

  test('Displays error messages for invalid inputs', () => {
    render(<ContactModal />);

    const nameInput = screen.getByPlaceholderText('Name');
    const phoneInput = screen.getByPlaceholderText('Phone Number');
    const emailInput = screen.getByPlaceholderText('Email Address');

    fireEvent.change(nameInput, { target: { value: 'Port Exe' } });
    fireEvent.change(phoneInput, {
      target: { value: '123-456-7890' },
    });
    fireEvent.change(emailInput, {
      target: { value: 'portexeofficial' },
    });

    let errorDiv = screen.queryByTestId('error');
    expect(errorDiv).toHaveTextContent(
      'Email is improperly formatted',
    );

    fireEvent.change(phoneInput, { target: { value: '1234567890' } });
    fireEvent.change(emailInput, {
      target: { value: 'portexeofficial@gmail.com' },
    });

    errorDiv = screen.queryByTestId('error');
    expect(errorDiv).toHaveTextContent(
      'Phone is improperly formatted',
    );

    fireEvent.change(phoneInput, {
      target: { value: '123-456-7890' },
    });

    errorDiv = screen.queryByTestId('error');
    expect(errorDiv).not.toBeInTheDocument();
  });

  test('Prevents submit function from being called if invalid', () => {
    const onSubmit = jest.fn();

    render(<ContactModal submit={onSubmit} />);

    const nameInput = screen.getByPlaceholderText('Name');
    const phoneInput = screen.getByPlaceholderText('Phone Number');
    const emailInput = screen.getByPlaceholderText('Email Address');
    const submitButton = screen.getByText('Submit');
    const form = screen.getByTestId('contact-modal-form');

    fireEvent.change(nameInput, { target: { value: 'Port Exe' } });
    fireEvent.change(phoneInput, {
      target: { value: '123-456-7890' },
    });
    fireEvent.change(emailInput, {
      target: { value: 'portexeofficial' },
    });

    expect(submitButton).toBeDisabled();

    fireEvent.submit(form);

    expect(onSubmit).not.toHaveBeenCalled();

    fireEvent.change(emailInput, {
      target: { value: 'portexeofficial@gmail.com' },
    });

    expect(submitButton).not.toBeDisabled();

    fireEvent.submit(form);

    expect(onSubmit).toHaveBeenCalled();
  });
});
