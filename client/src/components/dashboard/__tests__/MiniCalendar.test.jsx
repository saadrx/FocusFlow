
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import MiniCalendar from '../MiniCalendar';

// Mock UI components
vi.mock('@/components/ui/card', () => ({
  Card: ({ children, ...props }) => <div {...props}>{children}</div>,
  CardContent: ({ children, ...props }) => <div {...props}>{children}</div>,
  CardHeader: ({ children, ...props }) => <div {...props}>{children}</div>,
}));

describe('MiniCalendar', () => {
  test('renders calendar component', () => {
    render(<MiniCalendar />);
    
    expect(screen.getByText('Calendar')).toBeInTheDocument();
  });

  test('displays current date information', () => {
    render(<MiniCalendar />);
    
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
    const currentYear = currentDate.getFullYear();
    
    // Check if current month and year are displayed
    expect(screen.getByText(new RegExp(currentMonth, 'i'))).toBeInTheDocument();
    expect(screen.getByText(currentYear.toString())).toBeInTheDocument();
  });

  test('shows calendar grid structure', () => {
    render(<MiniCalendar />);
    
    // Should have day headers
    expect(screen.getByText('Su')).toBeInTheDocument();
    expect(screen.getByText('Mo')).toBeInTheDocument();
    expect(screen.getByText('Tu')).toBeInTheDocument();
    expect(screen.getByText('We')).toBeInTheDocument();
    expect(screen.getByText('Th')).toBeInTheDocument();
    expect(screen.getByText('Fr')).toBeInTheDocument();
    expect(screen.getByText('Sa')).toBeInTheDocument();
  });
});
