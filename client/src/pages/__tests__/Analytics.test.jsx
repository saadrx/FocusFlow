
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import Analytics from '../Analytics';

// Mock recharts components
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
  BarChart: ({ children }) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => <div data-testid="bar" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  Tooltip: () => <div data-testid="tooltip" />,
  PieChart: ({ children }) => <div data-testid="pie-chart">{children}</div>,
  Pie: () => <div data-testid="pie" />,
  Cell: () => <div data-testid="cell" />,
  LineChart: ({ children }) => <div data-testid="line-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
  Legend: () => <div data-testid="legend" />,
}));

// Mock UI components
vi.mock('@/components/ui/card', () => ({
  Card: ({ children, ...props }) => <div data-testid="card" {...props}>{children}</div>,
  CardContent: ({ children, ...props }) => <div data-testid="card-content" {...props}>{children}</div>,
  CardHeader: ({ children, ...props }) => <div data-testid="card-header" {...props}>{children}</div>,
  CardTitle: ({ children, ...props }) => <h3 data-testid="card-title" {...props}>{children}</h3>,
}));

vi.mock('@/components/ui/tabs', () => ({
  Tabs: ({ children, ...props }) => <div data-testid="tabs" {...props}>{children}</div>,
  TabsContent: ({ children, ...props }) => <div data-testid="tabs-content" {...props}>{children}</div>,
  TabsList: ({ children, ...props }) => <div data-testid="tabs-list" {...props}>{children}</div>,
  TabsTrigger: ({ children, ...props }) => <button data-testid="tabs-trigger" {...props}>{children}</button>,
}));

describe('Analytics', () => {
  test('renders analytics page with main title', () => {
    render(<Analytics />);
    
    expect(screen.getByText('Analytics')).toBeInTheDocument();
  });

  test('displays productivity overview section', () => {
    render(<Analytics />);
    
    expect(screen.getByText('Productivity Overview')).toBeInTheDocument();
  });

  test('shows weekly productivity chart', () => {
    render(<Analytics />);
    
    expect(screen.getByText('Weekly Productivity')).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });

  test('displays goal distribution chart', () => {
    render(<Analytics />);
    
    expect(screen.getByText('Goal Distribution')).toBeInTheDocument();
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
  });

  test('renders tabs for different analytics views', () => {
    render(<Analytics />);
    
    expect(screen.getByTestId('tabs')).toBeInTheDocument();
    expect(screen.getAllByTestId('tabs-trigger')).toHaveLength(4); // Overview, Tasks, Goals, Habits
  });

  test('shows time filter dropdown', () => {
    render(<Analytics />);
    
    expect(screen.getByText('This Week')).toBeInTheDocument();
  });

  test('displays various metric cards', () => {
    render(<Analytics />);
    
    const cards = screen.getAllByTestId('card');
    expect(cards.length).toBeGreaterThan(0);
  });
});
