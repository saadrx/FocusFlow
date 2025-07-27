
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import Header from '../Header';

// Mock theme hook
vi.mock('@/hooks/use-theme', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: vi.fn(),
  }),
}));

// Mock auth hook
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { name: 'Test User', email: 'test@example.com' },
    logout: vi.fn(),
  }),
}));

// Mock UI components
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, ...props }) => (
    <button onClick={onClick} {...props}>{children}</button>
  ),
}));

describe('Header', () => {
  test('renders header with logo and user info', () => {
    render(<Header />);
    
    expect(screen.getByText('FocusFlow')).toBeInTheDocument();
  });

  test('shows theme toggle button', () => {
    render(<Header />);
    
    const themeButton = screen.getByRole('button', { name: /theme/i });
    expect(themeButton).toBeInTheDocument();
  });

  test('toggles theme when theme button is clicked', () => {
    const mockSetTheme = vi.fn();
    vi.mocked(require('@/hooks/use-theme').useTheme).mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
    });

    render(<Header />);
    
    const themeButton = screen.getByRole('button', { name: /theme/i });
    fireEvent.click(themeButton);
    
    expect(mockSetTheme).toHaveBeenCalled();
  });

  test('displays user menu when authenticated', () => {
    render(<Header />);
    
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  test('shows login button when not authenticated', () => {
    vi.mocked(require('@/hooks/useAuth').useAuth).mockReturnValue({
      user: null,
      logout: vi.fn(),
    });

    render(<Header />);
    
    expect(screen.getByText('Login')).toBeInTheDocument();
  });
});
