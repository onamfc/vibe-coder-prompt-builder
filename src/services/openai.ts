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
  private apiKey: string;
  private baseUrl = 'https://api.openai.com/v1';

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!this.apiKey) {
      console.warn('OpenAI API key not found. Please add VITE_OPENAI_API_KEY to your .env.local file');
    }
  }

  private async makeRequest(messages: OpenAIMessage[]): Promise<string> {
    if (!this.apiKey) {
      return "Please add your OpenAI API key to the .env.local file to enable AI assistance.";
    }

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
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
        throw new Error(`OpenAI API error: ${response.statusText}`);
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
        content: 'You are an AI assistant helping non-technical "vibe coders" understand project types and requirements. Explain things in simple, friendly terms without technical jargon.'
      },
      {
        role: 'user',
        content: `I want to build a ${projectType}. Can you explain what this typically involves and what key features I should consider? Keep it simple and friendly.`
      }
    ];

    return this.makeRequest(messages);
  }

  async suggestFeatures(projectType: string, description: string): Promise<string> {
    const messages: OpenAIMessage[] = [
      {
        role: 'system',
        content: 'You are helping a vibe coder brainstorm features for their project. Suggest 5-7 essential features in simple terms, focusing on user value.'
      },
      {
        role: 'user',
        content: `For a ${projectType} project: "${description}", what are the most important features I should include? List them clearly.`
      }
    ];

    return this.makeRequest(messages);
  }

  async recommendTechStack(projectType: string, features: string[]): Promise<string> {
    const messages: OpenAIMessage[] = [
      {
        role: 'system',
        content: 'You are explaining tech stack choices to a non-technical person. Use simple analogies and focus on benefits rather than technical details.'
      },
      {
        role: 'user',
        content: `For a ${projectType} with features: ${features.join(', ')}, what technology choices would work best? Explain each choice in simple terms and why it's good for this project.`
      }
    ];

    return this.makeRequest(messages);
  }

  async generateFinalPrompt(projectData: any): Promise<string> {
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

    const userPrompt = `Create a comprehensive, build-ready technical specification for this project that scores 9-10/10 on the provided rubric:

PROJECT DATA:
${JSON.stringify(projectData, null, 2)}

Requirements:
- Use ONLY current 2025 LTS/stable versions with pinned dependencies
- Include complete database schemas with constraints and relationships
- Specify exact security implementations with concrete configurations
- Provide measurable performance and accessibility targets
- Detail comprehensive testing strategy with named tools and coverage targets
- Include complete CI/CD pipeline and deployment procedures
- Address all 12 rubric dimensions to achieve maximum score

The output must be immediately actionable by a development team without requiring clarification.`;

    const messages: OpenAIMessage[] = [
      {
        role: 'system',
        content: systemPrompt
      },
      {
        role: 'user',
        content: userPrompt
      }
    ];

    return this.makeRequest(messages);
  }
}