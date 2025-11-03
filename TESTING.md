# Testing Guide

This project uses **Vitest** and **React Testing Library** for testing.

## Running Tests

```bash
# Run tests in watch mode (interactive)
npm test

# Run tests once
npm run test:run

# Run tests with UI (visual interface)
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

## Test Coverage

Currently, we have 24+ passing tests covering:

### ✅ Services
- `OpenAIService` - API integration, error handling, prompt generation
- All public methods tested with mocked fetch responses
- API key validation and error scenarios

### ✅ Components
- `LoadingSpinner` - Default and custom message rendering
- `AIResponse` - Loading states and content display
- `ProgressBar` - Step rendering and progress calculation
- `WelcomeStep` - Navigation and messaging
- `ProfessionalRequirementsStep` - Requirement selection and navigation

## Writing New Tests

### Component Test Example

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '../../test/utils';
import { YourComponent } from '../YourComponent';

describe('YourComponent', () => {
  it('should render correctly', () => {
    render(<YourComponent />);
    expect(screen.getByText('Some Text')).toBeInTheDocument();
  });
});
```

### Service Test Example

```typescript
import { describe, it, expect, vi } from 'vitest';
import { YourService } from '../yourService';

describe('YourService', () => {
  it('should do something', async () => {
    const service = new YourService();
    const result = await service.method();
    expect(result).toBe('expected value');
  });
});
```

## Test File Organization

```
src/
├── components/
│   ├── __tests__/          # Component tests
│   │   ├── Component1.test.tsx
│   │   └── Component2.test.tsx
│   └── Component1.tsx
├── services/
│   ├── __tests__/          # Service tests
│   │   └── service.test.ts
│   └── service.ts
└── test/
    ├── setup.ts            # Test configuration
    └── utils.tsx           # Test utilities
```

## Test Configuration

- **Environment**: happy-dom (lightweight DOM implementation)
- **Globals**: Enabled (no need to import describe, it, expect)
- **Setup**: Automatic cleanup after each test
- **Mocks**: Navigator.clipboard and window.matchMedia pre-configured

## Coverage Reports

After running `npm run test:coverage`, view the coverage report:
- **Text**: In terminal
- **HTML**: Open `coverage/index.html` in browser
- **JSON**: `coverage/coverage-final.json`

## Best Practices

1. **Test user behavior, not implementation**
   - Focus on what users see and do
   - Avoid testing internal state or private methods

2. **Use meaningful test descriptions**
   ```typescript
   it('should show error message when form is invalid')
   // Better than: it('works')
   ```

3. **Arrange, Act, Assert**
   ```typescript
   // Arrange: Set up test data
   const user = userEvent.setup();
   render(<Component />);

   // Act: Perform actions
   await user.click(screen.getByRole('button'));

   // Assert: Verify results
   expect(screen.getByText('Success')).toBeInTheDocument();
   ```

4. **Clean up properly**
   - Cleanup happens automatically after each test
   - Use `beforeEach` and `afterEach` for custom setup/teardown

5. **Mock external dependencies**
   - API calls should be mocked
   - Use `vi.fn()` for function mocks
   - Use `vi.mock()` for module mocks

## Common Issues

### Issue: "Cannot read property 'clipboard' of undefined"
**Solution**: Clipboard is mocked in `src/test/setup.ts`

### Issue: "Element not found"
**Solution**: Use `screen.debug()` to see rendered HTML:
```typescript
render(<Component />);
screen.debug(); // Prints current DOM
```

### Issue: "Testing Library Element Error"
**Solution**: If multiple elements match, use:
- `getAllByText()` instead of `getByText()`
- More specific queries like `getByRole()` or `getByTestId()`

## Continuous Integration

Tests run automatically on:
- Pre-commit (if using husky)
- CI/CD pipelines
- Pull request checks

Ensure all tests pass before committing:
```bash
npm run test:run && npm run typecheck && npm run lint
```
