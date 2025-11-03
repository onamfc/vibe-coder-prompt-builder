import { describe, it, expect } from 'vitest';
import { render, screen } from '../../test/utils';
import { AIResponse } from '../AIResponse';

describe('AIResponse', () => {
  it('should render loading state', () => {
    render(<AIResponse content="Some content" loading={true} />);

    expect(screen.getByText('AI is thinking...')).toBeInTheDocument();
    expect(screen.queryByText('Some content')).not.toBeInTheDocument();
  });

  it('should render content when not loading', () => {
    render(<AIResponse content="This is the AI response." loading={false} />);

    expect(screen.getByText('This is the AI response.')).toBeInTheDocument();
    expect(screen.queryByText('AI is thinking...')).not.toBeInTheDocument();
  });

  it('should render multi-line content as paragraphs', () => {
    const multiLineContent = 'Line 1\nLine 2\nLine 3';
    render(<AIResponse content={multiLineContent} />);

    expect(screen.getByText('Line 1')).toBeInTheDocument();
    expect(screen.getByText('Line 2')).toBeInTheDocument();
    expect(screen.getByText('Line 3')).toBeInTheDocument();
  });

  it('should show AI Assistant label', () => {
    render(<AIResponse content="Content" />);

    expect(screen.getByText('AI Assistant')).toBeInTheDocument();
  });

  it('should show loading animation when loading', () => {
    const { container } = render(<AIResponse content="Content" loading={true} />);

    // Check for loading animation elements
    const loadingBars = container.querySelectorAll('.animate-pulse');
    expect(loadingBars.length).toBeGreaterThan(0);
  });
});
