import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../../test/utils';
import userEvent from '@testing-library/user-event';
import { ProfessionalRequirementsStep } from '../ProfessionalRequirementsStep';

describe('ProfessionalRequirementsStep', () => {
  const mockOnUpdate = vi.fn();
  const mockOnNext = vi.fn();
  const mockOnPrev = vi.fn();

  const defaultRequirements = {
    userAccounts: false,
    sensitiveData: false,
    adminPanel: false,
    mobileResponsive: false,
    realTimeFeatures: false,
    fileUploads: false,
    payments: false,
    searchFeature: false,
    analytics: false,
    multiLanguage: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render all professional requirements', () => {
    render(
      <ProfessionalRequirementsStep
        requirements={defaultRequirements}
        onUpdate={mockOnUpdate}
        onNext={mockOnNext}
        onPrev={mockOnPrev}
      />
    );

    expect(screen.getByText('User Accounts & Login')).toBeInTheDocument();
    expect(screen.getByText('Sensitive Data Handling')).toBeInTheDocument();
    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Mobile-Friendly Design')).toBeInTheDocument();
    expect(screen.getByText('Real-Time Updates')).toBeInTheDocument();
    expect(screen.getByText('File Uploads')).toBeInTheDocument();
    expect(screen.getByText('Payment Processing')).toBeInTheDocument();
    expect(screen.getByText('Search Functionality')).toBeInTheDocument();
    expect(screen.getByText('Usage Analytics')).toBeInTheDocument();
    expect(screen.getByText('Multiple Languages')).toBeInTheDocument();
  });

  it('should show selected count', () => {
    const selectedRequirements = {
      ...defaultRequirements,
      userAccounts: true,
      mobileResponsive: true,
      payments: true,
    };

    render(
      <ProfessionalRequirementsStep
        requirements={selectedRequirements}
        onUpdate={mockOnUpdate}
        onNext={mockOnNext}
        onPrev={mockOnPrev}
      />
    );

    expect(screen.getByText(/Selected: 3/)).toBeInTheDocument();
  });

  it('should toggle requirement when clicked', async () => {
    const user = userEvent.setup();

    const { container } = render(
      <ProfessionalRequirementsStep
        requirements={defaultRequirements}
        onUpdate={mockOnUpdate}
        onNext={mockOnNext}
        onPrev={mockOnPrev}
      />
    );

    // Find the button containing the User Accounts text
    const buttons = container.querySelectorAll('button');
    const userAccountsButton = Array.from(buttons).find((btn) =>
      btn.textContent?.includes('User Accounts & Login')
    );

    expect(userAccountsButton).toBeDefined();
    if (userAccountsButton) {
      await user.click(userAccountsButton);
    }

    expect(mockOnUpdate).toHaveBeenCalled();
  });

  it('should navigate to next step when continue is clicked', async () => {
    const user = userEvent.setup();

    render(
      <ProfessionalRequirementsStep
        requirements={defaultRequirements}
        onUpdate={mockOnUpdate}
        onNext={mockOnNext}
        onPrev={mockOnPrev}
      />
    );

    const continueButton = screen.getByText('Continue to Generate Prompt');
    await user.click(continueButton);

    expect(mockOnNext).toHaveBeenCalledTimes(1);
  });

  it('should navigate to previous step when back is clicked', async () => {
    const user = userEvent.setup();

    render(
      <ProfessionalRequirementsStep
        requirements={defaultRequirements}
        onUpdate={mockOnUpdate}
        onNext={mockOnNext}
        onPrev={mockOnPrev}
      />
    );

    const backButton = screen.getByText('Back');
    await user.click(backButton);

    expect(mockOnPrev).toHaveBeenCalledTimes(1);
  });

  it('should expand and show implications when clicked', async () => {
    const user = userEvent.setup();

    const { container } = render(
      <ProfessionalRequirementsStep
        requirements={defaultRequirements}
        onUpdate={mockOnUpdate}
        onNext={mockOnNext}
        onPrev={mockOnPrev}
      />
    );

    // Click to expand implications - find by button text
    const buttons = container.querySelectorAll('button');
    const showButton = Array.from(buttons).find((btn) =>
      btn.textContent?.includes('Show what this includes')
    );

    if (showButton) {
      await user.click(showButton);
      // Should show implementation details after click
      expect(container.textContent).toContain('Authentication system');
    }
  });

  it('should highlight selected requirements', () => {
    const selectedRequirements = {
      ...defaultRequirements,
      userAccounts: true,
    };

    const { container } = render(
      <ProfessionalRequirementsStep
        requirements={selectedRequirements}
        onUpdate={mockOnUpdate}
        onNext={mockOnNext}
        onPrev={mockOnPrev}
      />
    );

    // Selected items should have purple border
    const purpleBorders = container.querySelectorAll('.border-purple-500');
    expect(purpleBorders.length).toBeGreaterThan(0);
  });

  it('should allow continuing even with no requirements selected', () => {
    render(
      <ProfessionalRequirementsStep
        requirements={defaultRequirements}
        onUpdate={mockOnUpdate}
        onNext={mockOnNext}
        onPrev={mockOnPrev}
      />
    );

    const continueButton = screen.getByText('Continue to Generate Prompt');
    expect(continueButton).toBeEnabled();
  });
});
