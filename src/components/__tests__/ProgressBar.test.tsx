import { describe, it, expect } from 'vitest';
import { render, screen } from '../../test/utils';
import { ProgressBar } from '../ProgressBar';

describe('ProgressBar', () => {
  const mockSteps = [
    { title: 'Step 1', completed: true },
    { title: 'Step 2', completed: false },
    { title: 'Step 3', completed: false },
  ];

  it('should render all steps', () => {
    render(<ProgressBar currentStep={0} totalSteps={3} steps={mockSteps} />);

    const steps = screen.getAllByText(/Step \d/);
    expect(steps.length).toBeGreaterThanOrEqual(3);
  });

  it('should show correct progress percentage', () => {
    const { rerender } = render(<ProgressBar currentStep={0} totalSteps={3} steps={mockSteps} />);

    // First step (0 of 3)
    expect(screen.getByText('0%')).toBeInTheDocument();

    // Second step (1 of 3)
    rerender(<ProgressBar currentStep={1} totalSteps={3} steps={mockSteps} />);
    expect(screen.getByText('33%')).toBeInTheDocument();

    // Third step (2 of 3)
    rerender(<ProgressBar currentStep={2} totalSteps={3} steps={mockSteps} />);
    expect(screen.getByText('67%')).toBeInTheDocument();

    // Complete (3 of 3)
    rerender(<ProgressBar currentStep={3} totalSteps={3} steps={mockSteps} />);
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('should highlight current step', () => {
    const { container } = render(<ProgressBar currentStep={1} totalSteps={3} steps={mockSteps} />);

    // Check for purple border indicating current step
    const purpleBorderedElements = container.querySelectorAll('.border-purple-500');
    expect(purpleBorderedElements.length).toBeGreaterThan(0);
  });

  it('should show completed steps with check mark', () => {
    const stepsWithCompleted = [
      { title: 'Step 1', completed: true },
      { title: 'Step 2', completed: true },
      { title: 'Step 3', completed: false },
    ];

    render(<ProgressBar currentStep={2} totalSteps={3} steps={stepsWithCompleted} />);

    // Check marks should be present for completed steps
    const checkMarks = screen.getAllByRole('img', { hidden: true });
    expect(checkMarks.length).toBeGreaterThan(0);
  });
});
