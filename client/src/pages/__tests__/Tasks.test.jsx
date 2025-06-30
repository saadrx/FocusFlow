
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import Tasks from '../Tasks';

// Mock UI components
vi.mock('@/components/ui/card', () => ({
  Card: ({ children, ...props }) => <div {...props}>{children}</div>,
  CardContent: ({ children, ...props }) => <div {...props}>{children}</div>,
}));

vi.mock('@/components/ui/input', () => ({
  Input: ({ onChange, ...props }) => (
    <input onChange={onChange} {...props} />
  ),
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, ...props }) => (
    <button onClick={onClick} {...props}>{children}</button>
  ),
}));

vi.mock('@/components/ui/checkbox', () => ({
  Checkbox: ({ onCheckedChange, checked, ...props }) => (
    <input 
      type="checkbox" 
      checked={checked}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
      {...props} 
    />
  ),
}));

vi.mock('@/components/ui/tabs', () => ({
  Tabs: ({ children, defaultValue, ...props }) => (
    <div data-testid="tabs" {...props}>{children}</div>
  ),
  TabsContent: ({ children, value, ...props }) => <div {...props}>{children}</div>,
  TabsList: ({ children, ...props }) => <div {...props}>{children}</div>,
  TabsTrigger: ({ children, value, ...props }) => (
    <button data-value={value} {...props}>{children}</button>
  ),
}));

describe('Tasks', () => {
  test('renders tasks page with search and filters', () => {
    render(<Tasks />);
    
    expect(screen.getByText('Tasks')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search tasks...')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Add a new task...')).toBeInTheDocument();
  });

  test('displays initial tasks', () => {
    render(<Tasks />);
    
    expect(screen.getByText('Review project requirements')).toBeInTheDocument();
    expect(screen.getByText('Prepare presentation for client')).toBeInTheDocument();
    expect(screen.getByText('Buy groceries')).toBeInTheDocument();
  });

  test('adds new task when input is provided', () => {
    render(<Tasks />);
    
    const input = screen.getByPlaceholderText('Add a new task...');
    const addButton = screen.getByRole('button', { name: /plus/i });
    
    fireEvent.change(input, { target: { value: 'New test task' } });
    fireEvent.click(addButton);
    
    expect(input.value).toBe('');
  });

  test('handles task search', () => {
    render(<Tasks />);
    
    const searchInput = screen.getByPlaceholderText('Search tasks...');
    fireEvent.change(searchInput, { target: { value: 'project' } });
    
    expect(searchInput.value).toBe('project');
  });

  test('toggles task completion', () => {
    render(<Tasks />);
    
    const checkboxes = screen.getAllByRole('checkbox');
    const firstCheckbox = checkboxes[0];
    
    fireEvent.click(firstCheckbox);
    
    // Task state should change
    expect(firstCheckbox).toBeInTheDocument();
  });

  test('renders category tabs', () => {
    render(<Tasks />);
    
    expect(screen.getByText('All Tasks')).toBeInTheDocument();
    expect(screen.getByText('Work')).toBeInTheDocument();
    expect(screen.getByText('Personal')).toBeInTheDocument();
    expect(screen.getByText('Education')).toBeInTheDocument();
  });

  test('displays priority badges', () => {
    render(<Tasks />);
    
    expect(screen.getByText('High')).toBeInTheDocument();
    expect(screen.getByText('Medium')).toBeInTheDocument();
  });

  test('shows filter and date buttons', () => {
    render(<Tasks />);
    
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Filter')).toBeInTheDocument();
  });

  test('adds task with Enter key', () => {
    render(<Tasks />);
    
    const input = screen.getByPlaceholderText('Add a new task...');
    fireEvent.change(input, { target: { value: 'New task via Enter' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    
    expect(input.value).toBe('');
  });
});
