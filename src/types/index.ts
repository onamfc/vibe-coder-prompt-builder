export interface ProjectData {
  projectType: string;
  projectName: string;
  description: string;
  targetAudience: string;
  coreFeatures: string[];
  techStack: {
    frontend: string;
    backend: string;
    database: string;
    hosting: string;
  };
  testing: {
    approach: string;
    tools: string[];
  };
  additionalRequirements: string[];
}

export interface WizardStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export interface AIResponse {
  content: string;
  suggestions?: string[];
  loading?: boolean;
}