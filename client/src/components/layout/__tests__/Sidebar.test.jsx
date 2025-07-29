
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import Sidebar from '../Sidebar';

// Mock wouter
vi.mock('wouter', () => ({
  useLocation: () => ['/dashboard', vi.fn()],
  Link: ({ children, href, ...props }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

describe('Sidebar', () => {
  test('renders all navigation links', () => {
    render(<Sidebar />);
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Tasks')).toBeInTheDocument();
    expect(screen.getByText('Goals')).toBeInTheDocument();
    expect(screen.getByText('Calendar')).toBeInTheDocument();
    expect(screen.getByText('Notes')).toBeInTheDocument();
    expect(screen.getByText('Files')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  test('highlights active navigation item', () => {
    render(<Sidebar />);
    
    const dashboardLink = screen.getByText('Dashboard');
    expect(dashboardLink.closest('a')).toHaveClass('active'); // Assuming active class exists
  });

  test('contains correct navigation links', () => {
    render(<Sidebar />);
    
    expect(screen.getByRole('link', { name: /dashboard/i })).toHaveAttribute('href', '/dashboard');
    expect(screen.getByRole('link', { name: /tasks/i })).toHaveAttribute('href', '/tasks');
    expect(screen.getByRole('link', { name: /goals/i })).toHaveAttribute('href', '/goals');
  });
});
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import Sidebar from '../Sidebar';

// Mock wouter
vi.mock('wouter', () => ({
  Link: ({ children, href, ...props }) => <a href={href} {...props}>{children}</a>,
  useLocation: vi.fn(() => ['/', vi.fn()]),
}));

describe('Sidebar', () => {
  test('renders sidebar with navigation links when open', () => {
    render(<Sidebar open={true} />);
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Calendar')).toBeInTheDocument();
    expect(screen.getByText('Tasks')).toBeInTheDocument();
    expect(screen.getByText('Goals')).toBeInTheDocument();
    expect(screen.getByText('Notes')).toBeInTheDocument();
    expect(screen.getByText('Files')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  test('applies correct classes when sidebar is closed', () => {
    const { container } = render(<Sidebar open={false} />);
    
    const sidebar = container.firstChild;
    expect(sidebar).toHaveClass('-translate-x-full');
  });

  test('applies correct classes when sidebar is open', () => {
    const { container } = render(<Sidebar open={true} />);
    
    const sidebar = container.firstChild;
    expect(sidebar).toHaveClass('translate-x-0');
  });

  test('renders all navigation links with correct hrefs', () => {
    render(<Sidebar open={true} />);
    
    expect(screen.getByRole('link', { name: /dashboard/i })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: /calendar/i })).toHaveAttribute('href', '/calendar');
    expect(screen.getByRole('link', { name: /tasks/i })).toHaveAttribute('href', '/tasks');
    expect(screen.getByRole('link', { name: /goals/i })).toHaveAttribute('href', '/goals');
    expect(screen.getByRole('link', { name: /notes/i })).toHaveAttribute('href', '/notes');
    expect(screen.getByRole('link', { name: /files/i })).toHaveAttribute('href', '/files');
    expect(screen.getByRole('link', { name: /analytics/i })).toHaveAttribute('href', '/analytics');
    expect(screen.getByRole('link', { name: /settings/i })).toHaveAttribute('href', '/settings');
  });

  test('highlights active navigation item', () => {
    // Mock current location as dashboard
    vi.mocked(require('wouter').useLocation).mockReturnValue(['/', vi.fn()]);
    
    render(<Sidebar open={true} />);
    
    const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
    expect(dashboardLink).toHaveClass('bg-primary-50', 'text-primary-600');
  });

  test('renders with proper responsive classes', () => {
    const { container } = render(<Sidebar open={true} />);
    
    const sidebar = container.firstChild;
    expect(sidebar).toHaveClass('md:translate-x-0');
  });

  test('has proper navigation structure', () => {
    render(<Sidebar open={true} />);
    
    // Should have nav element
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
  });
});
