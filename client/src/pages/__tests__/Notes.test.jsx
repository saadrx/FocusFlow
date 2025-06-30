
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import Notes from '../Notes';

// Mock useLocalStorage hook
vi.mock('@/hooks/useLocalStorage', () => ({
  useLocalStorage: vi.fn(() => [
    [
      {
        id: '1',
        title: 'Test Note',
        content: 'Test content',
        createdAt: 'May 10, 2023',
        updatedAt: 'May 12, 2023',
        category: 'Work',
        isFavorite: true,
      }
    ],
    vi.fn()
  ]),
}));

// Mock UI components
vi.mock('@/components/ui/tabs', () => ({
  Tabs: ({ children, value, onValueChange, ...props }) => (
    <div data-testid="tabs" {...props}>{children}</div>
  ),
  TabsContent: ({ children, value, ...props }) => <div {...props}>{children}</div>,
  TabsList: ({ children, ...props }) => <div {...props}>{children}</div>,
  TabsTrigger: ({ children, value, ...props }) => (
    <button data-value={value} {...props}>{children}</button>
  ),
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

vi.mock('@/components/ui/card', () => ({
  Card: ({ children, ...props }) => <div {...props}>{children}</div>,
  CardContent: ({ children, ...props }) => <div {...props}>{children}</div>,
}));

vi.mock('@/components/ui/textarea', () => ({
  Textarea: ({ onChange, ...props }) => (
    <textarea onChange={onChange} {...props} />
  ),
}));

describe('Notes', () => {
  const mockSetNotes = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    const mockUseLocalStorage = vi.fn(() => [
      [
        {
          id: '1',
          title: 'Test Note',
          content: 'Test content',
          createdAt: 'May 10, 2023',
          updatedAt: 'May 12, 2023',
          category: 'Work',
          isFavorite: true,
        }
      ],
      mockSetNotes
    ]);
    vi.mocked(require('@/hooks/useLocalStorage').useLocalStorage).mockImplementation(mockUseLocalStorage);
  });

  test('renders notes page with search and categories', () => {
    render(<Notes />);
    
    expect(screen.getByText('Notes')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search notes...')).toBeInTheDocument();
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Favorites')).toBeInTheDocument();
  });

  test('displays existing notes', () => {
    render(<Notes />);
    
    expect(screen.getByText('Test Note')).toBeInTheDocument();
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  test('handles search input', () => {
    render(<Notes />);
    
    const searchInput = screen.getByPlaceholderText('Search notes...');
    fireEvent.change(searchInput, { target: { value: 'test' } });
    
    expect(searchInput.value).toBe('test');
  });

  test('creates new note when button is clicked', () => {
    render(<Notes />);
    
    const newNoteButton = screen.getByRole('button', { name: /plus/i });
    fireEvent.click(newNoteButton);
    
    expect(mockSetNotes).toHaveBeenCalled();
  });

  test('renders category buttons', () => {
    render(<Notes />);
    
    expect(screen.getByText('Work')).toBeInTheDocument();
    expect(screen.getByText('Personal')).toBeInTheDocument();
    expect(screen.getByText('Education')).toBeInTheDocument();
  });

  test('shows note editor when note is selected', () => {
    render(<Notes />);
    
    // Check for note title input
    expect(screen.getByDisplayValue('Test Note')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test content')).toBeInTheDocument();
  });

  test('updates note when content changes', () => {
    render(<Notes />);
    
    const titleInput = screen.getByDisplayValue('Test Note');
    fireEvent.change(titleInput, { target: { value: 'Updated Note' } });
    
    expect(mockSetNotes).toHaveBeenCalled();
  });
});
