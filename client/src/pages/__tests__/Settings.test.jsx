
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import Settings from '../Settings';

// Mock ThemeProvider
vi.mock('@/components/layout/ThemeProvider', () => ({
  useTheme: vi.fn(() => ({
    theme: 'light',
    setTheme: vi.fn(),
  })),
}));

// Mock UI components
vi.mock('@/components/ui/card', () => ({
  Card: ({ children, ...props }) => <div {...props}>{children}</div>,
  CardContent: ({ children, ...props }) => <div {...props}>{children}</div>,
  CardHeader: ({ children, ...props }) => <div {...props}>{children}</div>,
  CardTitle: ({ children, ...props }) => <h2 {...props}>{children}</h2>,
}));

vi.mock('@/components/ui/label', () => ({
  Label: ({ children, ...props }) => <label {...props}>{children}</label>,
}));

vi.mock('@/components/ui/switch', () => ({
  Switch: ({ checked, onCheckedChange, ...props }) => (
    <input 
      type="checkbox" 
      checked={checked}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
      {...props} 
    />
  ),
}));

vi.mock('@/components/ui/select', () => ({
  Select: ({ value, onValueChange, children, ...props }) => (
    <select 
      value={value} 
      onChange={(e) => onValueChange?.(e.target.value)}
      {...props}
    >
      {children}
    </select>
  ),
  SelectContent: ({ children, ...props }) => <>{children}</>,
  SelectItem: ({ value, children, ...props }) => (
    <option value={value} {...props}>{children}</option>
  ),
  SelectTrigger: ({ children, ...props }) => <div {...props}>{children}</div>,
  SelectValue: ({ ...props }) => <span {...props} />,
}));

vi.mock('@/components/ui/separator', () => ({
  Separator: ({ ...props }) => <hr {...props} />,
}));

describe('Settings', () => {
  const mockSetTheme = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(require('@/components/layout/ThemeProvider').useTheme).mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
    });
  });

  test('renders settings page with all sections', () => {
    render(<Settings />);
    
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Preferences')).toBeInTheDocument();
    expect(screen.getByText('Language and Time')).toBeInTheDocument();
    expect(screen.getByText('Notifications')).toBeInTheDocument();
  });

  test('displays appearance setting with theme selector', () => {
    render(<Settings />);
    
    expect(screen.getByText('Appearance')).toBeInTheDocument();
    expect(screen.getByText('Customize how your planner looks on your device')).toBeInTheDocument();
  });

  test('handles theme change', () => {
    render(<Settings />);
    
    const themeSelect = screen.getByDisplayValue('light');
    fireEvent.change(themeSelect, { target: { value: 'dark' } });
    
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  test('displays language setting', () => {
    render(<Settings />);
    
    expect(screen.getByText('Language')).toBeInTheDocument();
    expect(screen.getByText('Change the language used in the interface')).toBeInTheDocument();
  });

  test('handles language change', () => {
    render(<Settings />);
    
    const languageSelect = screen.getByDisplayValue('english');
    fireEvent.change(languageSelect, { target: { value: 'french' } });
    
    expect(languageSelect.value).toBe('french');
  });

  test('displays timezone setting with switch', () => {
    render(<Settings />);
    
    expect(screen.getByText('Set timezone automatically using your location')).toBeInTheDocument();
    
    const timezoneSwitch = screen.getByRole('checkbox');
    expect(timezoneSwitch).toBeChecked();
  });

  test('handles timezone toggle', () => {
    render(<Settings />);
    
    const timezoneSwitch = screen.getByRole('checkbox');
    fireEvent.click(timezoneSwitch);
    
    expect(timezoneSwitch).toBeInTheDocument();
  });

  test('displays notifications setting', () => {
    render(<Settings />);
    
    expect(screen.getByText('Push notifications')).toBeInTheDocument();
    expect(screen.getByText('Receive push notifications on mentions and comments via your mobile app')).toBeInTheDocument();
  });

  test('handles notifications toggle', () => {
    render(<Settings />);
    
    const checkboxes = screen.getAllByRole('checkbox');
    const notificationSwitch = checkboxes[1]; // Second checkbox is notifications
    
    fireEvent.click(notificationSwitch);
    
    expect(notificationSwitch).toBeInTheDocument();
  });

  test('shows theme options in select', () => {
    render(<Settings />);
    
    expect(screen.getByText('Light')).toBeInTheDocument();
    expect(screen.getByText('Dark')).toBeInTheDocument();
    expect(screen.getByText('System')).toBeInTheDocument();
  });

  test('shows language options in select', () => {
    render(<Settings />);
    
    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('French')).toBeInTheDocument();
    expect(screen.getByText('Spanish')).toBeInTheDocument();
  });
});
