import { describe, it, expect, beforeEach, vi } from 'vitest';
import { OpenAIService } from '../openai';

describe('OpenAIService', () => {
  let service: OpenAIService;
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    service = new OpenAIService();
    fetchMock = vi.fn();
    global.fetch = fetchMock;
  });

  describe('generateFinalPrompt', () => {
    it('should generate a comprehensive prompt with project data', async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: 'Generated comprehensive specification',
            },
          },
        ],
      };

      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const projectData = {
        projectType: 'web-app',
        projectName: 'Test App',
        description: 'A test application',
        targetAudience: 'Developers',
        coreFeatures: ['Authentication', 'Dashboard'],
        techStack: {
          frontend: 'react',
          backend: 'node',
          database: 'postgresql',
          hosting: 'vercel',
        },
        testing: {
          approach: 'unit-and-integration',
          tools: ['jest', 'playwright'],
        },
        professionalRequirements: {
          userAccounts: true,
          sensitiveData: true,
          adminPanel: false,
          mobileResponsive: true,
          realTimeFeatures: false,
          fileUploads: false,
          payments: false,
          searchFeature: false,
          analytics: true,
          multiLanguage: false,
        },
        additionalRequirements: [],
      };

      const result = await service.generateFinalPrompt(projectData);

      expect(result).toBe('Generated comprehensive specification');
      expect(fetchMock).toHaveBeenCalledTimes(1);

      // Verify the request includes project data
      const callArgs = fetchMock.mock.calls[0];
      expect(callArgs[0]).toBe('https://api.openai.com/v1/chat/completions');

      const requestBody = JSON.parse(callArgs[1].body);
      expect(requestBody.messages).toHaveLength(2);
      expect(requestBody.messages[0].role).toBe('system');
      expect(requestBody.messages[1].role).toBe('user');
      expect(requestBody.messages[1].content).toContain('Test App');
    });

    it('should include professional requirements in the prompt', async () => {
      const mockResponse = {
        choices: [{ message: { content: 'Spec with requirements' } }],
      };

      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const projectData = {
        projectType: 'web-app',
        projectName: 'App',
        description: 'Description',
        targetAudience: 'Users',
        coreFeatures: [],
        techStack: { frontend: '', backend: '', database: '', hosting: '' },
        testing: { approach: '', tools: [] },
        professionalRequirements: {
          userAccounts: true,
          sensitiveData: false,
          adminPanel: false,
          mobileResponsive: false,
          realTimeFeatures: false,
          fileUploads: false,
          payments: true,
          searchFeature: false,
          analytics: false,
          multiLanguage: false,
        },
        additionalRequirements: [],
      };

      await service.generateFinalPrompt(projectData);

      const requestBody = JSON.parse(fetchMock.mock.calls[0][1].body);
      const userMessage = requestBody.messages[1].content;

      // Should include selected requirements
      expect(userMessage).toContain('USER ACCOUNTS');
      expect(userMessage).toContain('PAYMENT PROCESSING');
    });

    it('should handle API errors gracefully', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: false,
        statusText: 'Internal Server Error',
      });

      const projectData = {
        projectType: 'web-app',
        projectName: 'App',
        description: 'Description',
        targetAudience: 'Users',
        coreFeatures: [],
        techStack: { frontend: '', backend: '', database: '', hosting: '' },
        testing: { approach: '', tools: [] },
        professionalRequirements: {
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
        },
        additionalRequirements: [],
      };

      const result = await service.generateFinalPrompt(projectData);

      expect(result).toContain('Sorry, I encountered an error');
    });

    it('should include mandatory best practices in every prompt', async () => {
      const mockResponse = {
        choices: [{ message: { content: 'Specification' } }],
      };

      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const projectData = {
        projectType: 'web-app',
        projectName: 'App',
        description: 'Description',
        targetAudience: 'Users',
        coreFeatures: [],
        techStack: { frontend: '', backend: '', database: '', hosting: '' },
        testing: { approach: '', tools: [] },
        professionalRequirements: {
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
        },
        additionalRequirements: [],
      };

      await service.generateFinalPrompt(projectData);

      const requestBody = JSON.parse(fetchMock.mock.calls[0][1].body);
      const userMessage = requestBody.messages[1].content;

      // Should always include mandatory requirements
      expect(userMessage).toContain('MANDATORY REQUIREMENTS');
      expect(userMessage).toContain('Error Handling');
      expect(userMessage).toContain('Accessibility');
    });
  });

  describe('getProjectTypeGuidance', () => {
    it('should request guidance for a project type', async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: 'Web apps are interactive applications...',
            },
          },
        ],
      };

      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await service.getProjectTypeGuidance('web-app');

      expect(result).toBe('Web apps are interactive applications...');
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('suggestFeatures', () => {
    it('should suggest features based on project type and description', async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: 'Feature 1\nFeature 2\nFeature 3',
            },
          },
        ],
      };

      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await service.suggestFeatures('web-app', 'A social media platform');

      expect(result).toBe('Feature 1\nFeature 2\nFeature 3');
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('recommendTechStack', () => {
    it('should recommend tech stack based on project type and features', async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: 'I recommend React for frontend...',
            },
          },
        ],
      };

      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await service.recommendTechStack('web-app', [
        'User Authentication',
        'Real-time Chat',
      ]);

      expect(result).toBe('I recommend React for frontend...');
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('API key handling', () => {
    it('should warn when API key is missing', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      // Create service without API key
      vi.stubEnv('VITE_OPENAI_API_KEY', '');
      const serviceWithoutKey = new OpenAIService();

      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('OpenAI API key not found'));

      consoleSpy.mockRestore();
      vi.unstubAllEnvs();
    });

    it('should return error message when making request without API key', async () => {
      vi.stubEnv('VITE_OPENAI_API_KEY', '');
      const serviceWithoutKey = new OpenAIService();

      const result = await (serviceWithoutKey as any).makeRequest([]);

      expect(result).toContain('Please add your OpenAI API key');

      vi.unstubAllEnvs();
    });
  });
});
