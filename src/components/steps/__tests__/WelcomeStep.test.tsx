import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../../test/utils';
import userEvent from '@testing-library/user-event';
import { WelcomeStep } from '../WelcomeStep';

describe('WelcomeStep', () => {
  it('should render welcome message', () => {
    const mockOnNext = vi.fn();
    render(<WelcomeStep onNext={mockOnNext} />);

    expect(screen.getByText('AI Prompt Builder')).toBeInTheDocument();
  });

  it('should call onNext when get started button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnNext = vi.fn();

    render(<WelcomeStep onNext={mockOnNext} />);

    const getStartedButton = screen.getByText('Start Building Your Project');
    await user.click(getStartedButton);

    expect(mockOnNext).toHaveBeenCalledTimes(1);
  });

  it('should display project builder description', () => {
    const mockOnNext = vi.fn();
    const { container } = render(<WelcomeStep onNext={mockOnNext} />);

    // Should mention prompt or specification or AI (get all matching elements)
    const textContent = container.textContent || '';
    expect(textContent.toLowerCase()).toMatch(/prompt|specification|ai|project/i);
  });
});
