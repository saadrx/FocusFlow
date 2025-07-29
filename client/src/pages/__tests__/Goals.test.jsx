
import { render, screen } from '@testing-library/react';
import Goals from '../Goals';

// Mock UI components
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }) => <button {...props}>{children}</button>,
}));

vi.mock('@/components/ui/card', () => ({
  Card: ({ children, ...props }) => <div {...props}>{children}</div>,
  CardContent: ({ children, ...props }) => <div {...props}>{children}</div>,
}));

vi.mock('@/components/ui/progress', () => ({
  Progress: ({ value, ...props }) => (
    <div data-testid="progress" data-value={value} {...props}>
      Progress: {value}%
    </div>
  ),
}));

describe('Goals', () => {
  test('renders goals page with initial goals', () => {
    render(<Goals />);
    
    expect(screen.getByText('Complete Project Proposal')).toBeInTheDocument();
    expect(screen.getByText('Study 10 Hours This Week')).toBeInTheDocument();
    expect(screen.getByText('Write Daily Journal')).toBeInTheDocument();
  });

  test('displays goal progress correctly', () => {
    render(<Goals />);
    
    const progressBars = screen.getAllByTestId('progress');
    expect(progressBars).toHaveLength(3);
    
    expect(screen.getByText('Progress: 75%')).toBeInTheDocument();
    expect(screen.getByText('Progress: 40%')).toBeInTheDocument();
    expect(screen.getByText('Progress: 90%')).toBeInTheDocument();
  });

  test('shows goal categories and due dates', () => {
    render(<Goals />);
    
    expect(screen.getByText('Due in 5 days')).toBeInTheDocument();
    expect(screen.getByText('3 days left')).toBeInTheDocument();
    expect(screen.getByText('Ongoing')).toBeInTheDocument();
  });

  test('displays milestones for first goal', () => {
    render(<Goals />);
    
    expect(screen.getByText('Research market trends')).toBeInTheDocument();
    expect(screen.getByText('Draft executive summary')).toBeInTheDocument();
    expect(screen.getByText('Create financial projections')).toBeInTheDocument();
    expect(screen.getByText('Complete implementation timeline')).toBeInTheDocument();
  });
});
