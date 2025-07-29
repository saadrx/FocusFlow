
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import Whiteboard from '../Whiteboard';

// Mock the useLocalStorage hook
vi.mock('@/hooks/useLocalStorage', () => ({
  useLocalStorage: vi.fn(),
}));

// Mock UI components
vi.mock('@/components/ui/card', () => ({
  Card: ({ children, ...props }) => <div {...props}>{children}</div>,
  CardContent: ({ children, ...props }) => <div {...props}>{children}</div>,
  CardHeader: ({ children, ...props }) => <div {...props}>{children}</div>,
}));

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

// Mock canvas context
const mockContext = {
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  stroke: vi.fn(),
  clearRect: vi.fn(),
  drawImage: vi.fn(),
  toDataURL: vi.fn(() => 'data:image/png;base64,mock'),
};

// Mock canvas
HTMLCanvasElement.prototype.getContext = vi.fn(() => mockContext);
HTMLCanvasElement.prototype.toDataURL = vi.fn(() => 'data:image/png;base64,mock');

// Mock getBoundingClientRect
HTMLCanvasElement.prototype.getBoundingClientRect = vi.fn(() => ({
  left: 0,
  top: 0,
  width: 800,
  height: 400,
}));

describe('Whiteboard', () => {
  const mockSetNotes = vi.fn();
  const mockSetWhiteboardData = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock useLocalStorage for notes
    vi.mocked(require('@/hooks/useLocalStorage').useLocalStorage)
      .mockImplementationOnce(() => [[], mockSetNotes])
      .mockImplementationOnce(() => [null, mockSetWhiteboardData]);
  });

  test('renders whiteboard canvas and controls', () => {
    render(<Whiteboard />);
    
    expect(screen.getByText('Color:')).toBeInTheDocument();
    expect(screen.getByText('Size:')).toBeInTheDocument();
    expect(screen.getByRole('slider')).toBeInTheDocument();
    expect(screen.getByText('Save to Notes')).toBeInTheDocument();
  });

  test('renders color palette', () => {
    render(<Whiteboard />);
    
    const colorButtons = screen.getAllByRole('button').filter(btn => 
      btn.style.backgroundColor && btn.className.includes('w-6 h-6')
    );
    expect(colorButtons.length).toBeGreaterThan(0);
  });

  test('changes brush size when slider is moved', () => {
    render(<Whiteboard />);
    
    const sizeSlider = screen.getByRole('slider');
    fireEvent.change(sizeSlider, { target: { value: '5' } });
    
    expect(screen.getByText('5px')).toBeInTheDocument();
  });

  test('clears canvas when clear button is clicked', () => {
    render(<Whiteboard />);
    
    const clearButton = screen.getByRole('button', { name: /trash/i });
    fireEvent.click(clearButton);
    
    expect(mockContext.clearRect).toHaveBeenCalledWith(0, 0, 800, 400);
    expect(mockSetWhiteboardData).toHaveBeenCalledWith(null);
  });

  test('saves whiteboard to notes when save button is clicked', () => {
    render(<Whiteboard />);
    
    // Mock alert
    window.alert = vi.fn();
    
    const saveButton = screen.getByText('Save to Notes');
    fireEvent.click(saveButton);
    
    expect(mockSetNotes).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Whiteboard saved to Notes!');
  });

  test('downloads image when download button is clicked', () => {
    render(<Whiteboard />);
    
    // Mock document.createElement and click
    const mockLink = {
      click: vi.fn(),
      download: '',
      href: '',
    };
    document.createElement = vi.fn(() => mockLink);
    
    const downloadButton = screen.getByRole('button', { name: /download/i });
    fireEvent.click(downloadButton);
    
    expect(document.createElement).toHaveBeenCalledWith('a');
    expect(mockLink.download).toBe('whiteboard.png');
    expect(mockLink.click).toHaveBeenCalled();
  });

  test('starts drawing on mouse down', () => {
    render(<Whiteboard />);
    
    const canvas = screen.getByRole('img', { hidden: true }) || document.querySelector('canvas');
    fireEvent.mouseDown(canvas, { clientX: 100, clientY: 100 });
    
    expect(mockContext.beginPath).toHaveBeenCalled();
    expect(mockContext.moveTo).toHaveBeenCalledWith(100, 100);
  });

  test('draws on mouse move when drawing is active', () => {
    render(<Whiteboard />);
    
    const canvas = screen.getByRole('img', { hidden: true }) || document.querySelector('canvas');
    
    // Start drawing
    fireEvent.mouseDown(canvas, { clientX: 100, clientY: 100 });
    
    // Move mouse
    fireEvent.mouseMove(canvas, { clientX: 150, clientY: 150 });
    
    expect(mockContext.lineTo).toHaveBeenCalledWith(150, 150);
    expect(mockContext.stroke).toHaveBeenCalled();
  });

  test('stops drawing on mouse up', () => {
    render(<Whiteboard />);
    
    const canvas = screen.getByRole('img', { hidden: true }) || document.querySelector('canvas');
    
    // Start drawing
    fireEvent.mouseDown(canvas, { clientX: 100, clientY: 100 });
    
    // Stop drawing
    fireEvent.mouseUp(canvas);
    
    expect(mockSetWhiteboardData).toHaveBeenCalledWith('data:image/png;base64,mock');
  });
});
