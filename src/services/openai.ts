interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export class OpenAIService {
  private baseUrl = '/api/chat';

  constructor() {
    // API key is now handled server-side in the Vercel function
  }

  private async makeRequest(messages: OpenAIMessage[]): Promise<string> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages,
          max_tokens: 3000,
          temperature: 0.2,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `API error: ${response.statusText}`);
      }

      const data: OpenAIResponse = await response.json();
      return data.choices[0]?.message?.content || 'No response generated';
    } catch (error) {
      console.error('OpenAI API error:', error);
      return 'Sorry, I encountered an error. Please try again.';
    }
  }

  async getProjectTypeGuidance(projectType: string): Promise<string> {
    const messages: OpenAIMessage[] = [
      {
        role: 'system',
        content:
          'You are an AI assistant helping non-technical "vibe coders" understand project types and requirements. Explain things in simple, friendly terms without technical jargon.',
      },
      {
        role: 'user',
        content: `I want to build a ${projectType}. Can you explain what this typically involves and what key features I should consider? Keep it simple and friendly.`,
      },
    ];

    return this.makeRequest(messages);
  }

  async suggestFeatures(projectType: string, description: string): Promise<string> {
    const messages: OpenAIMessage[] = [
      {
        role: 'system',
        content:
          'You are helping a vibe coder brainstorm features for their project. Suggest 5-7 essential features in simple terms, focusing on user value.',
      },
      {
        role: 'user',
        content: `For a ${projectType} project: "${description}", what are the most important features I should include? List them clearly.`,
      },
    ];

    return this.makeRequest(messages);
  }

  async recommendTechStack(projectType: string, features: string[]): Promise<string> {
    const messages: OpenAIMessage[] = [
      {
        role: 'system',
        content:
          'You are explaining tech stack choices to a non-technical person. Use simple analogies and focus on benefits rather than technical details.',
      },
      {
        role: 'user',
        content: `For a ${projectType} with features: ${features.join(', ')}, what technology choices would work best? Explain each choice in simple terms and why it's good for this project.`,
      },
    ];

    return this.makeRequest(messages);
  }

  async generateFinalPrompt(projectData: any): Promise<string> {
    // Extract professional requirements
    const reqs = projectData.professionalRequirements || {};
    const selectedRequirements = Object.entries(reqs)
      .filter(([_, value]) => value === true)
      .map(([key]) => key);

    const systemPrompt = `You are a senior technical architect creating a 9-10/10 rated project specification using this exact rubric:

RUBRIC REQUIREMENTS FOR 9-10/10 SCORE:

1. CLARITY & CONCISION (10% weight)
- Clear, unambiguous language with consistent terminology
- No fluff or vague statements
- Every requirement is actionable and specific

2. SCOPE & USER STORIES (10% weight)
- Concrete user stories with acceptance criteria
- Clear in-scope vs out-of-scope boundaries
- Focus on user outcomes, not just feature lists

3. DATA MODEL & DOMAIN PRECISION (10% weight)
- Complete entity definitions with fields, types, constraints
- Primary/foreign keys explicitly defined
- Time/locale rules specified (e.g., week starts Monday ISO 8601)
- Timezone handling strategy (store UTC, display local)

4. ARCHITECTURE COHERENCE (10% weight)
- Chosen architecture style matches project goals
- No contradictions (e.g., SPA + SEO requirements)
- Clear separation of concerns and layer definitions

5. TECH STACK APPROPRIATENESS & CURRENCY (8% weight)
- PINNED VERSIONS for all critical dependencies
- Current 2025 LTS/stable versions only
- Stack aligns with hosting model and requirements

CURRENT 2025 VERSIONS (MANDATORY):
- Node.js: ">=20.0.0" (LTS minimum), ">=22.0.0" (preferred)
- React: "^18.3.1" (NEVER suggest 17.x)
- Next.js: "^15.0.0" (latest stable)
- TypeScript: "^5.6.0" (latest stable)
- Vite: "^5.4.0" (latest stable)
- Express: "^4.19.0" (latest stable)
- Supabase: "^2.57.0" (latest stable)
- Tailwind: "^3.4.0" (latest stable)
- Jest: "^29.7.0" (latest stable)
- Playwright: "^1.47.0" (latest stable)

6. SECURITY & PRIVACY (10% weight)
- Session strategy: httpOnly cookies with SameSite=Strict
- CSRF protection implementation
- Rate limiting with specific limits (e.g., 100 req/min per IP)
- Password policy: bcrypt with 12+ rounds, complexity requirements
- Breach detection strategy
- Secrets management (environment variables, KMS for production)
- RLS/row-level security for multi-tenant data

7. PERFORMANCE & ACCESSIBILITY TARGETS (8% weight)
- Numeric performance budgets:
  * LCP < 2.5s
  * CLS < 0.1
  * TBT < 300ms
  * JavaScript bundle < 300KB gzipped
- WCAG 2.1 AA compliance level
- Specific measurement tools (Lighthouse, axe-core)

8. TESTING & VALIDATION (8% weight)
- Unit tests: Jest with ≥80% coverage
- Integration tests: Supertest for APIs
- E2E tests: Playwright with critical user flows
- Accessibility tests: axe-core integration
- CI enforcement with coverage gates

9. DELIVERABLES, CI/CD & DEPLOYABILITY (8% weight)
- Build scripts and deployment commands
- CI/CD pipeline configuration (GitHub Actions)
- Preview deployments for PRs
- Database migration strategy
- Environment variable examples
- Rollback procedures

10. CONSISTENCY & NON-CONTRADICTION (10% weight)
- No naming conflicts or platform mismatches
- Consistent architecture patterns throughout
- Aligned technology choices

11. OPERATIONS & RELIABILITY (5% weight)
- Structured logging with correlation IDs
- Error tracking (Sentry with source maps)
- Metrics collection (response times, error rates)
- Backup strategy with RPO/RTO targets
- Restore testing cadence (quarterly)

12. EXTENSIBILITY & RISKS/ASSUMPTIONS (3% weight)
- Known risks and trade-offs explicitly stated
- Feature flags for gradual rollouts
- Configuration management strategy
- Future extension points identified

PENALTIES TO AVOID:
- EOL/outdated versions (React 17, Node 16): -0.3 to -0.7
- "Latest" without pinning: -0.2 to -0.5
- Security anti-patterns (localStorage JWT): -1.0+
- Missing RLS with Supabase: -0.3 to -0.7
- Missing timezone rules for time-series: -0.2 to -0.4

OUTPUT STRUCTURE (MANDATORY):

# PROJECT SPECIFICATION

## 1. EXECUTIVE SUMMARY
- Project purpose and core value proposition
- Target users and primary use cases
- Success metrics and business objectives

## 2. USER STORIES & ACCEPTANCE CRITERIA
- Detailed user stories with "As a... I want... So that..."
- Specific acceptance criteria for each story
- Edge cases and error scenarios
- Clear scope boundaries (what's included/excluded)

## 3. DATA MODEL & DOMAIN RULES
- Complete database schema with exact field types
- Primary keys, foreign keys, and constraints
- Indexes for performance optimization
- Data validation rules and business constraints
- Timezone handling: Store UTC, display in user timezone
- Week boundaries: ISO 8601 (Monday start)
- Audit trails and soft delete strategies

## 4. ARCHITECTURE & TECH STACK
- Chosen architecture pattern with justification
- Complete dependency list with PINNED VERSIONS
- File structure and module organization
- API design patterns and conventions
- State management strategy

## 5. SECURITY IMPLEMENTATION
- Authentication: JWT in httpOnly cookies, refresh token rotation
- Authorization: Role-based access control with RLS
- CSRF protection: Double-submit cookie pattern
- Rate limiting: 100 req/min per IP, 1000 req/hour per user
- Password security: bcrypt rounds=12, complexity policy
- Input validation: Zod schemas for all inputs
- Security headers: Helmet.js configuration

## 6. PERFORMANCE & ACCESSIBILITY
- Performance budgets with measurement tools
- Bundle size optimization strategies
- WCAG 2.1 AA compliance checklist
- Accessibility testing integration
- Performance monitoring setup

## 7. TESTING STRATEGY
- Unit testing: Jest configuration and coverage targets
- Integration testing: API endpoint testing
- E2E testing: Playwright test scenarios
- Accessibility testing: axe-core integration
- CI/CD pipeline with quality gates

## 8. DEPLOYMENT & OPERATIONS
- Environment configuration examples
- CI/CD pipeline setup (GitHub Actions)
- Database migration scripts
- Monitoring and logging configuration
- Backup and disaster recovery procedures
- Rollback strategies

## 9. DEVELOPMENT WORKFLOW
- Git branching strategy
- Code review requirements
- Development environment setup
- Local development scripts
- Documentation standards

## 10. RISKS & ASSUMPTIONS
- Technical risks and mitigation strategies
- Performance bottlenecks and solutions
- Security considerations and trade-offs
- Scalability limitations and future considerations

Generate a specification that would score 9-10/10 on this rubric. Be extremely detailed and specific.`;

    // Build detailed requirements text based on selections
    const requirementDetails: { [key: string]: string } = {
      userAccounts: `USER ACCOUNTS & AUTHENTICATION:
- Implement JWT-based authentication with httpOnly cookies
- Include email/password registration with validation
- Password reset flow with time-limited tokens
- Email verification system
- Session management with refresh token rotation
- User profile management with avatar upload
- "Remember me" functionality
- Account deletion/deactivation flow`,

      sensitiveData: `SECURITY & DATA PROTECTION:
- End-to-end data encryption for sensitive fields
- HTTPS/TLS enforcement
- Security headers (CSP, HSTS, X-Frame-Options)
- Input sanitization and validation on all endpoints
- SQL injection and XSS prevention
- Rate limiting on authentication endpoints
- GDPR compliance measures (data export, deletion, consent)
- Privacy policy and terms of service integration
- Audit logging for sensitive operations`,

      adminPanel: `ADMIN DASHBOARD:
- Role-based access control (Admin, Moderator, User roles)
- Admin authentication with 2FA requirement
- User management interface (view, edit, suspend users)
- Content moderation tools
- Analytics and metrics dashboard
- System configuration interface
- Activity logs and audit trails
- Bulk operations support`,

      mobileResponsive: `MOBILE-RESPONSIVE DESIGN:
- Mobile-first responsive layout (320px to 4K)
- Touch-friendly UI elements (min 44px tap targets)
- Optimized mobile navigation (hamburger menu, bottom nav)
- Performance optimization for mobile networks
- iOS and Android browser testing
- Responsive images with srcset
- Viewport meta tags properly configured
- Mobile-specific gestures support`,

      realTimeFeatures: `REAL-TIME FUNCTIONALITY:
- WebSocket connection with automatic reconnection
- Real-time notifications system
- Live data synchronization across clients
- Presence indicators (online/offline status)
- Optimistic UI updates with rollback on error
- Conflict resolution for concurrent edits
- Connection status indicators
- Graceful degradation for unsupported clients`,

      fileUploads: `FILE UPLOAD SYSTEM:
- Drag-and-drop file upload interface
- File type validation (whitelist approach)
- File size limits with user feedback
- Image optimization and multiple size generation
- Cloud storage integration (S3/CloudFlare R2)
- CDN delivery for uploaded assets
- Virus/malware scanning
- Progress indicators for uploads
- Thumbnail generation for images
- File metadata extraction`,

      payments: `PAYMENT PROCESSING:
- Stripe integration with secure checkout flow
- Support for one-time and subscription payments
- Receipt generation and email delivery
- Refund processing interface
- Webhook handling for payment events
- Failed payment retry logic
- Payment history for users
- Invoice generation
- PCI-DSS compliance measures
- Multiple currency support`,

      searchFeature: `SEARCH FUNCTIONALITY:
- Full-text search implementation
- Search indexing strategy
- Autocomplete/suggestions as user types
- Filters and sorting options
- Search result highlighting
- Pagination or infinite scroll
- Search analytics tracking
- Fuzzy matching for typos
- Performance optimization for large datasets
- Search history for logged-in users`,

      analytics: `USAGE ANALYTICS:
- Event tracking implementation (page views, clicks, conversions)
- User behavior analytics
- Conversion funnel tracking
- Custom event definitions
- Privacy-compliant tracking (GDPR, CCPA)
- Analytics dashboard for admins
- Real-time metrics
- User session recording (optional, privacy-focused)
- A/B testing capability
- Export and reporting features`,

      multiLanguage: `INTERNATIONALIZATION (i18n):
- i18n framework integration (react-i18next, next-i18next)
- Language detection (browser, user preference)
- Language switcher component
- Translation file structure and management
- RTL (Right-to-Left) support for Arabic, Hebrew
- Locale-specific date, time, and number formatting
- Currency conversion display
- Pluralization rules
- Translation workflow for non-developers
- Fallback language handling`,
    };

    const selectedRequirementText = selectedRequirements
      .map((req) => requirementDetails[req] || '')
      .filter((text) => text.length > 0)
      .join('\n\n');

    const userPrompt = `Create a comprehensive, build-ready technical specification for this project that scores 9-10/10 on the provided rubric:

PROJECT DATA:
${JSON.stringify(projectData, null, 2)}

PROFESSIONAL REQUIREMENTS SELECTED BY USER:
${selectedRequirements.length > 0 ? selectedRequirementText : 'No specific professional requirements selected - include standard best practices.'}

MANDATORY REQUIREMENTS FOR ALL PROJECTS:
- Error Handling: Global error boundaries, user-friendly error messages, error logging with stack traces
- Code Quality: ESLint/Prettier setup, consistent code style, comprehensive comments
- Logging & Monitoring: Structured logging, error tracking (Sentry), performance monitoring
- Accessibility: WCAG 2.1 AA compliance, keyboard navigation, screen reader support, ARIA labels
- Performance: Core Web Vitals targets (LCP < 2.5s, CLS < 0.1, FID < 100ms), bundle size optimization
- SEO: Meta tags, Open Graph, sitemap, robots.txt, semantic HTML
- Documentation: README with setup instructions, API documentation, inline code comments
- Git Workflow: Feature branch strategy, PR templates, commit message conventions
- Environment Management: .env files, environment-specific configs, secrets management
- Deployment: CI/CD pipeline, automated testing, preview deployments, rollback strategy

IMPLEMENTATION REQUIREMENTS:
- Use ONLY current 2025 LTS/stable versions with pinned dependencies
- Include complete database schemas with exact field types, constraints, and relationships
- Specify exact security implementations with concrete configurations
- Provide measurable performance and accessibility targets with specific metrics
- Detail comprehensive testing strategy with named tools and coverage targets (≥80%)
- Include complete CI/CD pipeline configuration (GitHub Actions recommended)
- Include deployment procedures with environment setup
- Address all 12 rubric dimensions to achieve 9-10/10 score
- For each selected professional requirement, provide complete implementation details
- Include data models, API endpoints, UI components, and business logic needed

The output must be immediately actionable by an AI coding assistant without requiring clarification. A non-technical person should be able to copy this prompt and have their AI build a production-ready application.`;

    const messages: OpenAIMessage[] = [
      {
        role: 'system',
        content: systemPrompt,
      },
      {
        role: 'user',
        content: userPrompt,
      },
    ];

    return this.makeRequest(messages);
  }
}
