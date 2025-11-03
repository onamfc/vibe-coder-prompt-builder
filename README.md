# Prompt Builder

A React-based application that helps developers create comprehensive, production-ready project specifications for AI-powered code generation tools. This tool is specifically designed for "vibe coders" - developers who have great ideas but may not know all the professional requirements needed for production-quality software.

## Overview

The Prompt Builder guides users through a structured, multi-step wizard to create detailed project specifications that include:

- Project type and core details
- Feature specifications
- Technology stack recommendations
- Testing strategies
- Professional requirements (authentication, security, performance, etc.)
- Best practices that are automatically included

The generated specifications are optimized for use with AI code generation tools like Claude, ChatGPT, or other AI assistants, ensuring the AI has all the context needed to build professional-grade software.

## Key Features

- **Guided Workflow**: 9-step wizard that walks users through every aspect of their project
- **Professional Requirements**: Educates users about critical features like authentication, security, monitoring, and accessibility
- **Smart Recommendations**: AI-powered suggestions for features, tech stack, and testing approaches
- **Best Practices Inclusion**: Automatically adds industry-standard requirements that developers might overlook
- **Specification Rating**: Generates prompts rated 9-10/10 across 12 evaluation dimensions

## Installation

### Prerequisites

- Node.js 16.x or higher
- npm 7.x or higher

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd prompt-builder
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Add your OpenAI API key to the `.env` file:
```
VITE_OPENAI_API_KEY=your_api_key_here
```

## Development

### Running the Development Server

Start the development server with hot module replacement:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

Create an optimized production build:

```bash
npm run build
```

The build output will be in the `dist` directory.

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

## Testing

This project uses Vitest and React Testing Library for testing.

### Run Tests in Watch Mode

```bash
npm test
```

### Run Tests Once

```bash
npm run test:run
```

### Run Tests with UI

```bash
npm run test:ui
```

### Generate Coverage Report

```bash
npm run test:coverage
```

Coverage reports will be generated in the `coverage` directory.

For detailed testing documentation, see [TESTING.md](./TESTING.md)

## Code Quality

### Format Code with Prettier

Format all source files:

```bash
npm run format
```

### Check Code Formatting

Check if files are formatted correctly:

```bash
npm run format:check
```

### Lint Code

Check for linting errors:

```bash
npm run lint
```

## Project Structure

```
prompt-builder/
├── src/
│   ├── components/
│   │   ├── steps/              # Wizard step components
│   │   │   ├── WelcomeStep.tsx
│   │   │   ├── ProjectTypeStep.tsx
│   │   │   ├── DetailsStep.tsx
│   │   │   ├── FeaturesStep.tsx
│   │   │   ├── TechStackStep.tsx
│   │   │   ├── TestingStep.tsx
│   │   │   ├── ProfessionalRequirementsStep.tsx
│   │   │   ├── AdditionalRequirementsStep.tsx
│   │   │   └── GenerateStep.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── AIResponse.tsx
│   │   └── ProgressBar.tsx
│   ├── services/
│   │   └── openai.ts           # OpenAI API integration
│   ├── types/
│   │   └── index.ts            # TypeScript type definitions
│   ├── test/
│   │   ├── setup.ts            # Test configuration
│   │   └── utils.tsx           # Test utilities
│   ├── App.tsx                 # Main application component
│   ├── main.tsx                # Application entry point
│   └── index.css               # Global styles
├── public/                     # Static assets
├── dist/                       # Production build output
├── coverage/                   # Test coverage reports
├── .env                        # Environment variables (not in repo)
├── .env.example                # Environment variables template
├── package.json                # Project dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite build configuration
├── vitest.config.ts            # Vitest test configuration
├── eslint.config.js            # ESLint configuration
├── .prettierrc                 # Prettier configuration
├── CLAUDE.md                   # Documentation for Claude Code
├── TESTING.md                  # Testing documentation
└── README.md                   # This file
```

## How to Use

1. **Welcome**: Start by clicking "Start Building Your Project"

2. **Project Type**: Select your project type (Web App, Mobile App, API/Backend, etc.)

3. **Details**: Provide project name, description, and target audience

4. **Features**: List core features of your project. Use the AI suggestion feature for ideas.

5. **Tech Stack**: Choose your technology stack for frontend, backend, database, and hosting

6. **Testing**: Select testing approach and tools

7. **Professional Requirements**: Review and select professional features your project needs:
   - User Accounts & Login
   - Sensitive Data Handling
   - Admin Panel
   - Mobile Responsive Design
   - Real-time Features
   - File Uploads
   - Payment Processing
   - Search Functionality
   - Analytics & Tracking
   - Multi-language Support

8. **Additional Requirements**: Add any other specific requirements or constraints

9. **Generate**: Generate your comprehensive project specification and copy it to use with your AI coding assistant

## Architecture

### State Management

The application uses React's built-in state management with a centralized `projectData` object in `App.tsx`. State updates flow unidirectionally from parent to child components.

### Wizard Flow

The multi-step wizard is controlled by a `currentStep` state variable (0-8). Each step is a self-contained component that receives:
- Current data via props
- Update function to modify data
- Navigation functions (onNext, onPrev)

### AI Integration

The OpenAI service (`src/services/openai.ts`) provides:
- Feature suggestions based on project type
- Tech stack recommendations
- Final prompt generation with professional requirements
- Automatic inclusion of mandatory best practices

### Professional Requirements System

The ProfessionalRequirementsStep component educates users about 10 critical professional features. Each requirement includes:
- User-friendly description
- Detailed implementation implications
- Technical considerations
- Why it matters for production software

When generating the final prompt, selected requirements are expanded into detailed specifications that guide the AI to implement proper solutions.

### Mandatory Best Practices

The prompt generator automatically includes industry-standard requirements for ALL projects:
- Error handling and logging
- Code quality standards
- Accessibility compliance
- Performance optimization
- SEO fundamentals
- Documentation
- Git workflow
- Environment management
- CI/CD deployment

## Technology Stack

### Core Technologies

- **React 18.3.1**: UI library
- **TypeScript 5.5.3**: Type-safe JavaScript
- **Vite 5.4.2**: Build tool and dev server
- **Tailwind CSS 3.4.1**: Utility-first CSS framework

### UI Components

- **Lucide React 0.468.0**: Icon library
- **Custom Components**: All wizard steps and UI elements are custom-built

### AI Integration

- **OpenAI API**: GPT-4o-mini for suggestions and recommendations

### Development Tools

- **ESLint 9.13.0**: Code linting
- **Prettier 3.6.2**: Code formatting
- **TypeScript ESLint**: TypeScript linting rules

### Testing

- **Vitest 4.0.6**: Test framework
- **React Testing Library 16.1.0**: Component testing
- **happy-dom 17.7.1**: DOM implementation for testing
- **@vitest/ui 4.0.6**: Visual test UI

## Contributing

### Development Workflow

1. Create a feature branch from main
2. Make your changes
3. Run tests: `npm run test:run`
4. Format code: `npm run format`
5. Lint code: `npm run lint`
6. Commit your changes
7. Push and create a pull request

### Code Standards

- Use TypeScript for all new code
- Follow the existing component structure
- Write tests for new features
- Ensure all tests pass before submitting PR
- Format code with Prettier
- Follow ESLint rules

### Writing Tests

- Place test files in `__tests__` directories next to the code they test
- Use React Testing Library for component tests
- Mock external dependencies (API calls, etc.)
- Test user interactions and business logic
- Aim for meaningful test coverage, not just high percentages

See [TESTING.md](./TESTING.md) for detailed testing guidelines.

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

The `VITE_` prefix is required for Vite to expose the variable to the application.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License - feel free to use this project for any purpose.

## Support

For issues, questions, or contributions, please open an issue on the GitHub repository.

## Philosophy

This tool is built on the principle that great software requires more than just functional features. It educates developers about professional requirements they might not know they need, such as:

- Security best practices
- Accessibility standards
- Performance optimization
- Proper error handling
- Comprehensive testing
- Production-ready deployment

By including these automatically in generated specifications, we help ensure that AI-generated code meets professional standards from day one.
