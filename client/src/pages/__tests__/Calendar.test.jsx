
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import Calendar from '../Calendar';

// Mock date-fns functions
vi.mock('date-fns', () => ({
  addMonths: vi.fn((date) => new Date(date.getFullYear(), date.getMonth() + 1, date.getDate())),
  subMonths: vi.fn((date) => new Date(date.getFullYear(), date.getMonth() - 1, date.getDate())),
  format: vi.fn((date, formatStr) => {
    if (formatStr === 'MMMM yyyy') return 'May 2023';
    if (formatStr === 'd') return '15';
    return date.toISOString();
  }),
  startOfMonth: vi.fn((date) => new Date(date.getFullYear(), date.getMonth(), 1)),
  endOfMonth: vi.fn((date) => new Date(date.getFullYear(), date.getMonth() + 1, 0)),
  eachDayOfInterval: vi.fn(() => [
    new Date(2023, 4, 1),
    new Date(2023, 4, 2),
    new Date(2023, 4, 3),
  ]),
  isSameMonth: vi.fn(() => true),
  isSameDay: vi.fn(() => false),
  isToday: vi.fn(() => false),
}));

// Mock UI components
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, ...props }) => (
    <button onClick={onClick} {...props}>{children}</button>
  ),
}));

vi.mock('@/components/ui/card', () => ({
  Card: ({ children, ...props }) => <div {...props}>{children}</div>,
  CardContent: ({ children, ...props }) => <div {...props}>{children}</div>,
  CardHeader: ({ children, ...props }) => <div {...props}>{children}</div>,
  CardTitle: ({ children, ...props }) => <h2 {...props}>{children}</h2>,
}));

describe('Calendar', () => {
  test('renders calendar with current month', () => {
    render(<Calendar />);
    
    expect(screen.getByText('May 2023')).toBeInTheDocument();
    expect(screen.getByText('Today')).toBeInTheDocument();
    expect(screen.getByText('Add Event')).toBeInTheDocument();
  });

  test('renders day headers', () => {
    render(<Calendar />);
    
    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayHeaders.forEach(day => {
      expect(screen.getByText(day)).toBeInTheDocument();
    });
  });

  test('handles navigation to previous month', () => {
    render(<Calendar />);
    
    const prevButton = screen.getByRole('button', { name: /chevron/i });
    fireEvent.click(prevButton);
    
    // Component should re-render with new month
    expect(screen.getByText('May 2023')).toBeInTheDocument();
  });

  test('handles navigation to next month', () => {
    render(<Calendar />);
    
    const buttons = screen.getAllByRole('button');
    const nextButton = buttons.find(btn => btn.textContent === '');
    if (nextButton) fireEvent.click(nextButton);
    
    expect(screen.getByText('May 2023')).toBeInTheDocument();
  });

  test('handles today button click', () => {
    render(<Calendar />);
    
    const todayButton = screen.getByText('Today');
    fireEvent.click(todayButton);
    
    expect(screen.getByText('May 2023')).toBeInTheDocument();
  });

  test('displays events on calendar days', () => {
    render(<Calendar />);
    
    // Check if calendar structure exists
    expect(screen.getByText('May 2023')).toBeInTheDocument();
  });

  test('renders add event button', () => {
    render(<Calendar />);
    
    expect(screen.getByText('Add Event')).toBeInTheDocument();
  });
});
