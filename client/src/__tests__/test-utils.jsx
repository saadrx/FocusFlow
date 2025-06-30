
import { render } from '@testing-library/react';
import { vi } from 'vitest';
import { ThemeProvider } from '@/components/layout/ThemeProvider';

// Mock common hooks
const mockUseLocalStorage = vi.fn();
const mockUseTheme = vi.fn();

// Setup default mocks
beforeEach(() => {
  mockUseLocalStorage.mockReturnValue(['', vi.fn()]);
  mockUseTheme.mockReturnValue({
    theme: 'light',
    setTheme: vi.fn(),
  });
});

// Custom render function with providers
const customRender = (ui, options = {}) => {
  const Wrapper = ({ children }) => (
    <ThemeProvider defaultTheme="light" storageKey="test-theme">
      {children}
    </ThemeProvider>
  );

  return render(ui, { wrapper: Wrapper, ...options });
};

// Mock window functions
const mockWindowFunctions = () => {
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    },
    writable: true,
  });

  Object.defineProperty(window, 'history', {
    value: {
      back: vi.fn(),
      forward: vi.fn(),
      go: vi.fn(),
    },
    writable: true,
  });

  Object.defineProperty(window, 'location', {
    value: {
      href: 'http://localhost:3000',
      pathname: '/',
    },
    writable: true,
  });
};

// Helper to create mock file objects
const createMockFile = (name = 'test.txt', size = 1024, type = 'text/plain') => {
  return new File(['content'], name, { type, size });
};

// Helper to create mock form events
const createMockEvent = (target = {}) => ({
  preventDefault: vi.fn(),
  stopPropagation: vi.fn(),
  target,
});

export {
  customRender as render,
  mockWindowFunctions,
  createMockFile,
  createMockEvent,
  mockUseLocalStorage,
  mockUseTheme,
};

// Re-export everything from testing-library/react
export * from '@testing-library/react';
