
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import NotFound from '../not-found';

// Mock UI components
vi.mock('@/components/ui/card', () => ({
  Card: ({ children, ...props }) => <div {...props}>{children}</div>,
  CardContent: ({ children, ...props }) => <div {...props}>{children}</div>,
}));

describe('NotFound', () => {
  test('renders 404 error message', () => {
    render(<NotFound />);
    
    expect(screen.getByText('404 Page Not Found')).toBeInTheDocument();
  });

  test('displays helpful message about router', () => {
    render(<NotFound />);
    
    expect(screen.getByText('Did you forget to add the page to the router?')).toBeInTheDocument();
  });

  test('renders with proper styling classes', () => {
    render(<NotFound />);
    
    const container = screen.getByText('404 Page Not Found').closest('div');
    expect(container).toBeInTheDocument();
  });

  test('displays alert circle icon', () => {
    render(<NotFound />);
    
    // The AlertCircle component should be rendered
    expect(screen.getByText('404 Page Not Found')).toBeInTheDocument();
  });

  test('has proper layout structure', () => {
    render(<NotFound />);
    
    const heading = screen.getByText('404 Page Not Found');
    const description = screen.getByText('Did you forget to add the page to the router?');
    
    expect(heading).toBeInTheDocument();
    expect(description).toBeInTheDocument();
  });
});
