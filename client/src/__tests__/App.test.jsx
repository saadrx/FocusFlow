
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import App from '../App';

// Mock wouter
vi.mock('wouter', () => ({
  Switch: ({ children }) => <div data-testid="router-switch">{children}</div>,
  Route: ({ component: Component, path }) => (
    <div data-testid={`route-${path || 'default'}`}>
      {Component && <Component />}
    </div>
  ),
}));

// Mock components
vi.mock('../components/layout/Header', () => ({
  default: ({ sidebarOpen, setSidebarOpen }) => (
    <header data-testid="header">
      Header - Sidebar Open: {sidebarOpen.toString()}
    </header>
  ),
}));

vi.mock('../components/layout/Sidebar', () => ({
  default: ({ open }) => (
    <aside data-testid="sidebar">
      Sidebar - Open: {open.toString()}
    </aside>
  ),
}));

vi.mock('../components/QuickNote', () => ({
  default: () => <div data-testid="quick-note">QuickNote</div>,
}));

// Mock pages
vi.mock('../pages/Dashboard', () => ({
  default: () => <div data-testid="dashboard">Dashboard</div>,
}));

vi.mock('../pages/Calendar', () => ({
  default: () => <div data-testid="calendar">Calendar</div>,
}));

vi.mock('../pages/Tasks', () => ({
  default: () => <div data-testid="tasks">Tasks</div>,
}));

vi.mock('../pages/Goals', () => ({
  default: () => <div data-testid="goals">Goals</div>,
}));

vi.mock('../pages/Notes', () => ({
  default: () => <div data-testid="notes">Notes</div>,
}));

vi.mock('../pages/Files', () => ({
  default: () => <div data-testid="files">Files</div>,
}));

vi.mock('../pages/Analytics', () => ({
  default: () => <div data-testid="analytics">Analytics</div>,
}));

vi.mock('../pages/Login', () => ({
  default: () => <div data-testid="login">Login</div>,
}));

vi.mock('../pages/Signup', () => ({
  default: () => <div data-testid="signup">Signup</div>,
}));

vi.mock('../pages/Settings', () => ({
  default: () => <div data-testid="settings">Settings</div>,
}));

vi.mock('../pages/not-found', () => ({
  default: () => <div data-testid="not-found">NotFound</div>,
}));

describe('App', () => {
  test('renders main app structure', () => {
    render(<App />);
    
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('quick-note')).toBeInTheDocument();
    expect(screen.getByTestId('router-switch')).toBeInTheDocument();
  });

  test('initializes with sidebar open', () => {
    render(<App />);
    
    expect(screen.getByText('Header - Sidebar Open: true')).toBeInTheDocument();
    expect(screen.getByText('Sidebar - Open: true')).toBeInTheDocument();
  });

  test('renders router with all route components', () => {
    render(<App />);
    
    expect(screen.getByTestId('route-/')).toBeInTheDocument();
    expect(screen.getByTestId('route-/calendar')).toBeInTheDocument();
    expect(screen.getByTestId('route-/tasks')).toBeInTheDocument();
    expect(screen.getByTestId('route-/goals')).toBeInTheDocument();
    expect(screen.getByTestId('route-/notes')).toBeInTheDocument();
    expect(screen.getByTestId('route-/files')).toBeInTheDocument();
    expect(screen.getByTestId('route-/analytics')).toBeInTheDocument();
    expect(screen.getByTestId('route-/login')).toBeInTheDocument();
    expect(screen.getByTestId('route-/signup')).toBeInTheDocument();
    expect(screen.getByTestId('route-/settings')).toBeInTheDocument();
    expect(screen.getByTestId('route-default')).toBeInTheDocument();
  });

  test('has proper layout structure', () => {
    render(<App />);
    
    // Check for main layout elements
    const appContainer = screen.getByTestId('header').closest('div');
    expect(appContainer).toHaveClass('h-screen', 'flex', 'flex-col');
  });

  test('renders header with sidebar control props', () => {
    render(<App />);
    
    const header = screen.getByTestId('header');
    expect(header).toHaveTextContent('Sidebar Open: true');
  });

  test('renders sidebar with open prop', () => {
    render(<App />);
    
    const sidebar = screen.getByTestId('sidebar');
    expect(sidebar).toHaveTextContent('Open: true');
  });

  test('includes QuickNote component', () => {
    render(<App />);
    
    expect(screen.getByTestId('quick-note')).toBeInTheDocument();
  });

  test('has responsive layout classes', () => {
    render(<App />);
    
    // Main container should have flex layout
    const appContainer = screen.getByTestId('header').closest('div');
    expect(appContainer).toHaveClass('h-screen');
  });

  test('renders all page components in router', () => {
    render(<App />);
    
    // All page components should be rendered by the router
    expect(screen.getByTestId('dashboard')).toBeInTheDocument();
    expect(screen.getByTestId('calendar')).toBeInTheDocument();
    expect(screen.getByTestId('tasks')).toBeInTheDocument();
    expect(screen.getByTestId('goals')).toBeInTheDocument();
    expect(screen.getByTestId('notes')).toBeInTheDocument();
    expect(screen.getByTestId('files')).toBeInTheDocument();
    expect(screen.getByTestId('analytics')).toBeInTheDocument();
    expect(screen.getByTestId('login')).toBeInTheDocument();
    expect(screen.getByTestId('signup')).toBeInTheDocument();
    expect(screen.getByTestId('settings')).toBeInTheDocument();
    expect(screen.getByTestId('not-found')).toBeInTheDocument();
  });
});
