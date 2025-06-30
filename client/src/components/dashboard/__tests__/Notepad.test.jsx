
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import Notepad from '../Notepad';

// Mock the useLocalStorage hook
vi.mock('@/hooks/useLocalStorage', () => ({
  useLocalStorage: vi.fn(() => ['', vi.fn()]),
}));

// Mock UI components
vi.mock('@/components/ui/card', () => ({
  Card: ({ children, ...props }) => <div {...props}>{children}</div>,
  CardContent: ({ children, ...props }) => <div {...props}>{children}</div>,
  CardHeader: ({ children, ...props }) => <div {...props}>{children}</div>,
}));

vi.mock('@/components/ui/textarea', () => ({
  Textarea: ({ value, onChange, ...props }) => (
    <textarea value={value} onChange={onChange} {...props} />
  ),
}));

describe('Notepad', () => {
  const mockSetNotes = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    const mockUseLocalStorage = vi.fn(() => ['Initial notes', mockSetNotes]);
    vi.mocked(require('@/hooks/useLocalStorage').useLocalStorage).mockImplementation(mockUseLocalStorage);
  });

  test('renders notepad with initial content', () => {
    render(<Notepad />);
    
    expect(screen.getByText('Quick Notes')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Initial notes')).toBeInTheDocument();
  });

  test('updates notes when textarea changes', () => {
    render(<Notepad />);
    
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'New note content' } });
    
    expect(mockSetNotes).toHaveBeenCalledWith('New note content');
  });

  test('has correct placeholder text', () => {
    const mockUseLocalStorage = vi.fn(() => ['', mockSetNotes]);
    vi.mocked(require('@/hooks/useLocalStorage').useLocalStorage).mockImplementation(mockUseLocalStorage);
    
    render(<Notepad />);
    
    const textarea = screen.getByPlaceholderText('Start typing your notes here...');
    expect(textarea).toBeInTheDocument();
  });
});
