
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import GoalProgress from '../GoalProgress';

// Mock UI components
vi.mock('@/components/ui/card', () => ({
  Card: ({ children, ...props }) => <div data-testid="goal-progress" {...props}>{children}</div>,
  CardContent: ({ children, ...props }) => <div {...props}>{children}</div>,
  CardHeader: ({ children, ...props }) => <div {...props}>{children}</div>,
  CardTitle: ({ children, ...props }) => <h3 {...props}>{children}</h3>,
}));

vi.mock('@/components/ui/progress', () => ({
  Progress: ({ value, ...props }) => (
    <div data-testid="progress-bar" data-value={value} {...props}>
      Progress: {value}%
    </div>
  ),
}));

describe('GoalProgress', () => {
  test('renders goal progress component', () => {
    render(<GoalProgress />);
    
    expect(screen.getByTestId('goal-progress')).toBeInTheDocument();
    expect(screen.getByText('Goal Progress')).toBeInTheDocument();
  });

  test('displays goals with progress bars', () => {
    render(<GoalProgress />);
    
    expect(screen.getByText('Complete Project')).toBeInTheDocument();
    expect(screen.getByText('Learn React')).toBeInTheDocument();
    expect(screen.getByText('Exercise Daily')).toBeInTheDocument();
  });

  test('shows correct progress values', () => {
    render(<GoalProgress />);
    
    const progressBars = screen.getAllByTestId('progress-bar');
    expect(progressBars).toHaveLength(3);
    
    expect(screen.getByText('Progress: 75%')).toBeInTheDocument();
    expect(screen.getByText('Progress: 60%')).toBeInTheDocument();
    expect(screen.getByText('Progress: 40%')).toBeInTheDocument();
  });

  test('displays goal descriptions', () => {
    render(<GoalProgress />);
    
    expect(screen.getByText('Finish the final presentation')).toBeInTheDocument();
    expect(screen.getByText('Complete advanced React course')).toBeInTheDocument();
    expect(screen.getByText('Maintain daily workout routine')).toBeInTheDocument();
  });

  test('shows progress percentages', () => {
    render(<GoalProgress />);
    
    expect(screen.getByText('75%')).toBeInTheDocument();
    expect(screen.getByText('60%')).toBeInTheDocument();
    expect(screen.getByText('40%')).toBeInTheDocument();
  });
});
