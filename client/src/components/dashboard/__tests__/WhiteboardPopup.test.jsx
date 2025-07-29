
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import WhiteboardPopup from '../WhiteboardPopup';

// Mock the Whiteboard component
vi.mock('../Whiteboard', () => ({
  default: () => <div data-testid="whiteboard-component">Whiteboard Component</div>,
}));

// Mock UI components
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, ...props }) => (
    <button onClick={onClick} {...props}>{children}</button>
  ),
}));

vi.mock('@/components/ui/card', () => ({
  Card: ({ children, ...props }) => <div {...props}>{children}</div>,
  CardContent: ({ children, ...props }) => <div {...props}>{children}</div>,
  CardHeader: ({ children, ...props }) => <div {...props}>{children}</div>,
  CardTitle: ({ children, ...props }) => <h3 {...props}>{children}</h3>,
}));

describe('WhiteboardPopup', () => {
  test('renders floating button when popup is closed', () => {
    render(<WhiteboardPopup />);
    
    const floatingButton = screen.getByRole('button');
    expect(floatingButton).toBeInTheDocument();
    expect(floatingButton).toHaveClass('fixed', 'bottom-20', 'right-6');
  });

  test('opens popup when floating button is clicked', () => {
    render(<WhiteboardPopup />);
    
    const floatingButton = screen.getByRole('button');
    fireEvent.click(floatingButton);
    
    expect(screen.getByText('Whiteboard')).toBeInTheDocument();
    expect(screen.getByTestId('whiteboard-component')).toBeInTheDocument();
  });

  test('displays popup with overlay when open', () => {
    render(<WhiteboardPopup />);
    
    // Open the popup
    const floatingButton = screen.getByRole('button');
    fireEvent.click(floatingButton);
    
    // Check for overlay
    const overlay = document.querySelector('.fixed.inset-0.bg-black.bg-opacity-50');
    expect(overlay).toBeInTheDocument();
    
    // Check for card container
    expect(screen.getByText('Whiteboard')).toBeInTheDocument();
  });

  test('closes popup when X button is clicked', () => {
    render(<WhiteboardPopup />);
    
    // Open the popup
    const floatingButton = screen.getByRole('button');
    fireEvent.click(floatingButton);
    
    // Find and click close button
    const closeButton = screen.getByRole('button', { name: /x/i });
    fireEvent.click(closeButton);
    
    // Should be back to floating button state
    expect(screen.queryByText('Whiteboard')).not.toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveClass('fixed', 'bottom-20', 'right-6');
  });

  test('renders whiteboard component inside popup', () => {
    render(<WhiteboardPopup />);
    
    // Open the popup
    const floatingButton = screen.getByRole('button');
    fireEvent.click(floatingButton);
    
    expect(screen.getByTestId('whiteboard-component')).toBeInTheDocument();
  });

  test('popup has correct styling classes', () => {
    render(<WhiteboardPopup />);
    
    // Open the popup
    const floatingButton = screen.getByRole('button');
    fireEvent.click(floatingButton);
    
    // Check overlay classes
    const overlay = document.querySelector('.fixed.inset-0');
    expect(overlay).toHaveClass('bg-black', 'bg-opacity-50', 'flex', 'items-center', 'justify-center', 'z-50');
    
    // Check card classes
    const card = overlay.querySelector('div > div');
    expect(card).toHaveClass('w-full', 'max-w-4xl', 'max-h-[90vh]', 'overflow-y-auto');
  });

  test('floating button has correct accessibility attributes', () => {
    render(<WhiteboardPopup />);
    
    const floatingButton = screen.getByRole('button');
    expect(floatingButton).toHaveClass('h-12', 'w-12', 'rounded-full', 'shadow-lg', 'z-40');
  });
});
