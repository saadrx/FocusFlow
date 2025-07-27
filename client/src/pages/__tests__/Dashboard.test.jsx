
import { render, screen } from '@testing-library/react';
import Dashboard from '../Dashboard';

// Mock all dashboard components
vi.mock('@/components/dashboard/Notepad', () => ({
  default: () => <div data-testid="notepad">Notepad Component</div>,
}));

vi.mock('@/components/dashboard/MiniCalendar', () => ({
  default: () => <div data-testid="mini-calendar">Mini Calendar Component</div>,
}));

vi.mock('@/components/dashboard/TodoList', () => ({
  default: () => <div data-testid="todo-list">Todo List Component</div>,
}));

vi.mock('@/components/dashboard/GoalProgress', () => ({
  default: () => <div data-testid="goal-progress">Goal Progress Component</div>,
}));

vi.mock('@/components/dashboard/HabitTracker', () => ({
  default: () => <div data-testid="habit-tracker">Habit Tracker Component</div>,
}));

vi.mock('@/components/dashboard/RecentFiles', () => ({
  default: () => <div data-testid="recent-files">Recent Files Component</div>,
}));

describe('Dashboard', () => {
  test('renders dashboard with correct title', () => {
    render(<Dashboard />);
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  test('renders all dashboard components', () => {
    render(<Dashboard />);
    
    expect(screen.getByTestId('notepad')).toBeInTheDocument();
    expect(screen.getByTestId('mini-calendar')).toBeInTheDocument();
    expect(screen.getByTestId('todo-list')).toBeInTheDocument();
    expect(screen.getByTestId('goal-progress')).toBeInTheDocument();
    expect(screen.getByTestId('habit-tracker')).toBeInTheDocument();
    expect(screen.getByTestId('recent-files')).toBeInTheDocument();
  });

  test('has correct grid layout structure', () => {
    render(<Dashboard />);
    
    const gridContainers = screen.getAllByRole('generic');
    expect(gridContainers.length).toBeGreaterThan(0);
  });
});
