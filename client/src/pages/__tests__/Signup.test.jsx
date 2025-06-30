
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import Signup from '../Signup';

// Mock wouter
vi.mock('wouter', () => ({
  Link: ({ children, href }) => <a href={href}>{children}</a>,
}));

// Mock UI components
vi.mock('@/components/ui/card', () => ({
  Card: ({ children, ...props }) => <div {...props}>{children}</div>,
  CardContent: ({ children, ...props }) => <div {...props}>{children}</div>,
}));

vi.mock('@/components/ui/input', () => ({
  Input: ({ onChange, ...props }) => (
    <input onChange={onChange} {...props} />
  ),
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, type, ...props }) => (
    <button type={type} {...props}>{children}</button>
  ),
}));

vi.mock('@/components/ui/label', () => ({
  Label: ({ children, ...props }) => <label {...props}>{children}</label>,
}));

// Mock window.alert
Object.defineProperty(window, 'alert', {
  value: vi.fn(),
  writable: true,
});

describe('Signup', () => {
  test('renders signup form with all fields', () => {
    render(<Signup />);
    
    expect(screen.getByText('Create Account')).toBeInTheDocument();
    expect(screen.getByText('Sign up to get started')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create Account' })).toBeInTheDocument();
  });

  test('handles input changes', () => {
    render(<Signup />);
    
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const passwordInput = screen.getByPlaceholderText('Create a password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    
    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
    expect(confirmPasswordInput.value).toBe('password123');
  });

  test('shows error when passwords do not match', () => {
    render(<Signup />);
    
    const passwordInput = screen.getByPlaceholderText('Create a password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');
    const submitButton = screen.getByRole('button', { name: 'Create Account' });
    
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'different' } });
    fireEvent.click(submitButton);
    
    expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
  });

  test('submits form successfully when passwords match', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation();
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation();
    
    render(<Signup />);
    
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const passwordInput = screen.getByPlaceholderText('Create a password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');
    const submitButton = screen.getByRole('button', { name: 'Create Account' });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    expect(consoleSpy).toHaveBeenCalledWith('Signup attempt:', {
      email: 'test@example.com',
      password: 'password123'
    });
    expect(alertSpy).toHaveBeenCalledWith('Signed up successfully!');
    
    consoleSpy.mockRestore();
    alertSpy.mockRestore();
  });

  test('clears error when form is resubmitted with matching passwords', () => {
    render(<Signup />);
    
    const passwordInput = screen.getByPlaceholderText('Create a password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');
    const submitButton = screen.getByRole('button', { name: 'Create Account' });
    
    // First submission with mismatched passwords
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'different' } });
    fireEvent.click(submitButton);
    
    expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    
    // Second submission with matching passwords
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    expect(screen.queryByText('Passwords do not match')).not.toBeInTheDocument();
  });

  test('has link to login page', () => {
    render(<Signup />);
    
    expect(screen.getByText('Already have an account?')).toBeInTheDocument();
    expect(screen.getByText('Sign in')).toBeInTheDocument();
  });

  test('requires all fields', () => {
    render(<Signup />);
    
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const passwordInput = screen.getByPlaceholderText('Create a password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');
    
    expect(emailInput).toHaveAttribute('required');
    expect(passwordInput).toHaveAttribute('required');
    expect(confirmPasswordInput).toHaveAttribute('required');
  });
});
