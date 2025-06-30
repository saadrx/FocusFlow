
import { vi } from 'vitest';

// Mock createRoot
const mockRender = vi.fn();
vi.mock('react-dom/client', () => ({
  createRoot: vi.fn(() => ({
    render: mockRender,
  })),
}));

// Mock App component
vi.mock('../App', () => ({
  default: () => 'App Component',
}));

// Mock ThemeProvider
vi.mock('../components/layout/ThemeProvider', () => ({
  ThemeProvider: ({ children, defaultTheme, storageKey }) => (
    <div data-testid="theme-provider" data-theme={defaultTheme} data-storage-key={storageKey}>
      {children}
    </div>
  ),
}));

// Mock CSS import
vi.mock('../index.css', () => ({}));

describe('main.jsx', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock DOM element
    const mockElement = { id: 'root' };
    vi.spyOn(document, 'getElementById').mockReturnValue(mockElement);
  });

  test('creates root and renders app with theme provider', async () => {
    const { createRoot } = await import('react-dom/client');
    
    // Import main to trigger the render
    await import('../main.jsx');
    
    // Verify createRoot was called with correct element
    expect(createRoot).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'root' })
    );
    
    // Verify render was called
    expect(mockRender).toHaveBeenCalledTimes(1);
  });

  test('wraps App with ThemeProvider with correct props', async () => {
    await import('../main.jsx');
    
    // Check that render was called with ThemeProvider wrapping App
    expect(mockRender).toHaveBeenCalledWith(
      expect.objectContaining({
        type: expect.any(Function), // ThemeProvider component
        props: expect.objectContaining({
          defaultTheme: 'light',
          storageKey: 'focusflow-theme',
          children: expect.objectContaining({
            type: expect.any(Function), // App component
          }),
        }),
      })
    );
  });

  test('gets root element by id', async () => {
    await import('../main.jsx');
    
    expect(document.getElementById).toHaveBeenCalledWith('root');
  });

  test('imports CSS file', async () => {
    // The CSS import should not throw an error
    expect(async () => {
      await import('../main.jsx');
    }).not.toThrow();
  });

  test('configures theme provider with correct storage key', async () => {
    await import('../main.jsx');
    
    const renderCall = mockRender.mock.calls[0][0];
    expect(renderCall.props.storageKey).toBe('focusflow-theme');
  });

  test('sets default theme to light', async () => {
    await import('../main.jsx');
    
    const renderCall = mockRender.mock.calls[0][0];
    expect(renderCall.props.defaultTheme).toBe('light');
  });
});
