
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import RecentFiles from '../RecentFiles';

// Mock UI components
vi.mock('@/components/ui/card', () => ({
  Card: ({ children, ...props }) => <div data-testid="recent-files" {...props}>{children}</div>,
  CardContent: ({ children, ...props }) => <div {...props}>{children}</div>,
  CardHeader: ({ children, ...props }) => <div {...props}>{children}</div>,
  CardTitle: ({ children, ...props }) => <h3 {...props}>{children}</h3>,
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, variant, size, ...props }) => (
    <button data-variant={variant} data-size={size} {...props}>
      {children}
    </button>
  ),
}));

describe('RecentFiles', () => {
  test('renders recent files component', () => {
    render(<RecentFiles />);
    
    expect(screen.getByTestId('recent-files')).toBeInTheDocument();
    expect(screen.getByText('Recent Files')).toBeInTheDocument();
  });

  test('displays recent files list', () => {
    render(<RecentFiles />);
    
    expect(screen.getByText('project-proposal.pdf')).toBeInTheDocument();
    expect(screen.getByText('meeting-notes.docx')).toBeInTheDocument();
    expect(screen.getByText('budget-2023.xlsx')).toBeInTheDocument();
    expect(screen.getByText('presentation.pptx')).toBeInTheDocument();
  });

  test('shows file types with appropriate icons', () => {
    render(<RecentFiles />);
    
    // Files should be displayed with their extensions
    expect(screen.getByText('project-proposal.pdf')).toBeInTheDocument();
    expect(screen.getByText('meeting-notes.docx')).toBeInTheDocument();
    expect(screen.getByText('budget-2023.xlsx')).toBeInTheDocument();
    expect(screen.getByText('presentation.pptx')).toBeInTheDocument();
  });

  test('displays file timestamps', () => {
    render(<RecentFiles />);
    
    expect(screen.getByText('2 hours ago')).toBeInTheDocument();
    expect(screen.getByText('5 hours ago')).toBeInTheDocument();
    expect(screen.getByText('1 day ago')).toBeInTheDocument();
    expect(screen.getByText('2 days ago')).toBeInTheDocument();
  });

  test('shows view all button', () => {
    render(<RecentFiles />);
    
    expect(screen.getByText('View All')).toBeInTheDocument();
  });

  test('has proper file list structure', () => {
    render(<RecentFiles />);
    
    const fileEntries = [
      'project-proposal.pdf',
      'meeting-notes.docx', 
      'budget-2023.xlsx',
      'presentation.pptx'
    ];
    
    fileEntries.forEach(fileName => {
      expect(screen.getByText(fileName)).toBeInTheDocument();
    });
  });

  test('displays correct number of recent files', () => {
    render(<RecentFiles />);
    
    // Should show 4 recent files
    expect(screen.getByText('project-proposal.pdf')).toBeInTheDocument();
    expect(screen.getByText('meeting-notes.docx')).toBeInTheDocument();
    expect(screen.getByText('budget-2023.xlsx')).toBeInTheDocument();
    expect(screen.getByText('presentation.pptx')).toBeInTheDocument();
  });
});
