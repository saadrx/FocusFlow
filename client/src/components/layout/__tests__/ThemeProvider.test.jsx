
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { ThemeProvider, useTheme } from '../ThemeProvider';

// Test component to use the theme context
const TestComponent = () => {
  const { theme, setTheme } = useTheme();
  return (
    <div>
      <span data-testid="current-theme">{theme}</span>
      <button onClick={() => setTheme('dark')}>Set Dark</button>
      <button onClick={() => setTheme('light')}>Set Light</button>
    </div>
  );
};

describe('ThemeProvider', () => {
  beforeEach(() => {
    // Mock localStorage
    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    };
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
    });
  });

  test('provides default theme', () => {
    render(
      <ThemeProvider defaultTheme="light" storageKey="test-theme">
        <TestComponent />
      </ThemeProvider>
    );
    
    expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
  });

  test('allows theme switching', () => {
    render(
      <ThemeProvider defaultTheme="light" storageKey="test-theme">
        <TestComponent />
      </ThemeProvider>
    );
    
    const darkButton = screen.getByText('Set Dark');
    fireEvent.click(darkButton);
    
    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
  });

  test('persists theme to localStorage', () => {
    const setItemSpy = vi.spyOn(window.localStorage, 'setItem');
    
    render(
      <ThemeProvider defaultTheme="light" storageKey="test-theme">
        <TestComponent />
      </ThemeProvider>
    );
    
    const darkButton = screen.getByText('Set Dark');
    fireEvent.click(darkButton);
    
    expect(setItemSpy).toHaveBeenCalledWith('test-theme', 'dark');
  });

  test('loads theme from localStorage', () => {
    vi.spyOn(window.localStorage, 'getItem').mockReturnValue('dark');
    
    render(
      <ThemeProvider defaultTheme="light" storageKey="test-theme">
        <TestComponent />
      </ThemeProvider>
    );
    
    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
  });
});
