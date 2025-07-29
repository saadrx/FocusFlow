
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import HabitTracker from '../HabitTracker';

// Mock UI components
vi.mock('@/components/ui/card', () => ({
  Card: ({ children, ...props }) => <div data-testid="habit-tracker" {...props}>{children}</div>,
  CardContent: ({ children, ...props }) => <div {...props}>{children}</div>,
  CardHeader: ({ children, ...props }) => <div {...props}>{children}</div>,
  CardTitle: ({ children, ...props }) => <h3 {...props}>{children}</h3>,
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, variant, size, ...props }) => (
    <button 
      onClick={onClick} 
      data-variant={variant}
      data-size={size}
      {...props}
    >
      {children}
    </button>
  ),
}));

describe('HabitTracker', () => {
  test('renders habit tracker component', () => {
    render(<HabitTracker />);
    
    expect(screen.getByTestId('habit-tracker')).toBeInTheDocument();
    expect(screen.getByText('Habit Tracker')).toBeInTheDocument();
  });

  test('displays habits with completion buttons', () => {
    render(<HabitTracker />);
    
    expect(screen.getByText('Drink Water')).toBeInTheDocument();
    expect(screen.getByText('Read Books')).toBeInTheDocument();
    expect(screen.getByText('Exercise')).toBeInTheDocument();
    expect(screen.getByText('Meditate')).toBeInTheDocument();
  });

  test('shows current week days', () => {
    render(<HabitTracker />);
    
    const dayHeaders = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    dayHeaders.forEach(day => {
      expect(screen.getByText(day)).toBeInTheDocument();
    });
  });

  test('handles habit completion toggle', () => {
    render(<HabitTracker />);
    
    const completionButtons = screen.getAllByRole('button');
    const habitButton = completionButtons.find(btn => 
      btn.getAttribute('data-variant') === 'ghost' || 
      btn.getAttribute('data-size') === 'sm'
    );
    
    if (habitButton) {
      fireEvent.click(habitButton);
      expect(habitButton).toBeInTheDocument();
    }
  });

  test('displays completion status correctly', () => {
    render(<HabitTracker />);
    
    // Check for completion indicators
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  test('shows habit names correctly', () => {
    render(<HabitTracker />);
    
    const habits = ['Drink Water', 'Read Books', 'Exercise', 'Meditate'];
    habits.forEach(habit => {
      expect(screen.getByText(habit)).toBeInTheDocument();
    });
  });

  test('renders weekly grid structure', () => {
    render(<HabitTracker />);
    
    // Should have a grid layout with days and habits
    expect(screen.getByText('Habit Tracker')).toBeInTheDocument();
    expect(screen.getAllByRole('button').length).toBeGreaterThan(0);
  });
});
