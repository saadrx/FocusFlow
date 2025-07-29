
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import QuickNote from '../QuickNote';

// Mock useLocalStorage hook
vi.mock('@/hooks/useLocalStorage', () => ({
  useLocalStorage: vi.fn(() => ['', vi.fn()]),
}));

describe('QuickNote', () => {
  const mockSetNote = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    const mockUseLocalStorage = vi.fn(() => ['Test note content', mockSetNote]);
    vi.mocked(require('@/hooks/useLocalStorage').useLocalStorage).mockImplementation(mockUseLocalStorage);
  });

  test('renders with initial note content', () => {
    render(<QuickNote />);
    
    expect(screen.getByDisplayValue('Test note content')).toBeInTheDocument();
  });

  test('updates note when content changes', () => {
    render(<QuickNote />);
    
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Updated note content' } });
    
    expect(mockSetNote).toHaveBeenCalledWith('Updated note content');
  });

  test('has correct placeholder when empty', () => {
    const mockUseLocalStorage = vi.fn(() => ['', mockSetNote]);
    vi.mocked(require('@/hooks/useLocalStorage').useLocalStorage).mockImplementation(mockUseLocalStorage);
    
    render(<QuickNote />);
    
    expect(screen.getByPlaceholderText('Quick note...')).toBeInTheDocument();
  });

  test('maintains focus when typing', () => {
    render(<QuickNote />);
    
    const textarea = screen.getByRole('textbox');
    textarea.focus();
    
    expect(textarea).toHaveFocus();
  });
});
