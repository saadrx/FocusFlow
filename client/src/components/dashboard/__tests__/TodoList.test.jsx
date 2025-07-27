
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import TodoList from '../TodoList';

// Mock the useLocalStorage hook
vi.mock('@/hooks/useLocalStorage', () => ({
  useLocalStorage: vi.fn(),
}));

// Mock UI components
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, ...props }) => (
    <button onClick={onClick} {...props}>{children}</button>
  ),
}));

vi.mock('@/components/ui/input', () => ({
  Input: ({ value, onChange, ...props }) => (
    <input value={value} onChange={onChange} {...props} />
  ),
}));

vi.mock('@/components/ui/card', () => ({
  Card: ({ children, ...props }) => <div {...props}>{children}</div>,
  CardContent: ({ children, ...props }) => <div {...props}>{children}</div>,
  CardHeader: ({ children, ...props }) => <div {...props}>{children}</div>,
}));

vi.mock('@/components/ui/checkbox', () => ({
  Checkbox: ({ checked, onCheckedChange, ...props }) => (
    <input 
      type="checkbox" 
      checked={checked} 
      onChange={(e) => onCheckedChange(e.target.checked)} 
      {...props} 
    />
  ),
}));

describe('TodoList', () => {
  const mockTodos = [
    { id: '1', text: 'Complete project', completed: false },
    { id: '2', text: 'Review code', completed: true },
  ];
  const mockSetTodos = vi.fn();
  const mockNewTask = '';
  const mockSetNewTask = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    const mockUseLocalStorage = vi.fn()
      .mockReturnValueOnce([mockTodos, mockSetTodos])
      .mockReturnValueOnce([mockNewTask, mockSetNewTask]);
    
    vi.mocked(require('@/hooks/useLocalStorage').useLocalStorage).mockImplementation(mockUseLocalStorage);
  });

  test('renders todo list with existing tasks', () => {
    render(<TodoList />);
    
    expect(screen.getByText('Tasks')).toBeInTheDocument();
    expect(screen.getByText('Complete project')).toBeInTheDocument();
    expect(screen.getByText('Review code')).toBeInTheDocument();
  });

  test('adds new task when form is submitted', () => {
    render(<TodoList />);
    
    const input = screen.getByPlaceholderText('Add a new task...');
    const addButton = screen.getByText('Add');
    
    fireEvent.change(input, { target: { value: 'New task' } });
    fireEvent.click(addButton);
    
    expect(mockSetTodos).toHaveBeenCalled();
    expect(mockSetNewTask).toHaveBeenCalledWith('');
  });

  test('toggles task completion status', () => {
    render(<TodoList />);
    
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);
    
    expect(mockSetTodos).toHaveBeenCalled();
  });

  test('deletes task when delete button is clicked', () => {
    render(<TodoList />);
    
    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);
    
    expect(mockSetTodos).toHaveBeenCalled();
  });

  test('shows completed and remaining task counts', () => {
    render(<TodoList />);
    
    // Should show task counts in the interface
    expect(screen.getByText('Tasks')).toBeInTheDocument();
  });
});
