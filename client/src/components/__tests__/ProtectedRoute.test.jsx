
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import ProtectedRoute from '../ProtectedRoute';

// Mock auth context
vi.mock('@/lib/auth', () => ({
  useAuth: vi.fn(() => ({
    user: { id: 1, email: 'test@example.com' },
    loading: false
  }))
}));

describe('ProtectedRoute', () => {
  test('renders children when user is authenticated', () => {
    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );
    
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  test('shows loading state', () => {
    const { useAuth } = require('@/lib/auth');
    useAuth.mockReturnValue({
      user: null,
      loading: true
    });

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('redirects when user is not authenticated', () => {
    const { useAuth } = require('@/lib/auth');
    useAuth.mockReturnValue({
      user: null,
      loading: false
    });

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );
    
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });
});
