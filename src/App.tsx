import { useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { ProgressBar } from './components/ProgressBar';
import { WelcomeStep } from './components/steps/WelcomeStep';
import { ProjectTypeStep } from './components/steps/ProjectTypeStep';
import { ProjectDetailsStep } from './components/steps/ProjectDetailsStep';
import { FeaturesStep } from './components/steps/FeaturesStep';
import { TechStackStep } from './components/steps/TechStackStep';
import { TestingStep } from './components/steps/TestingStep';
import { ProfessionalRequirementsStep } from './components/steps/ProfessionalRequirementsStep';
import { FinalDetailsStep } from './components/steps/FinalDetailsStep';
import { PromptGenerationStep } from './components/steps/PromptGenerationStep';
import { ProjectData } from './types';

const steps = [
    { title: 'Project Type', completed: false },
    { title: 'Details', completed: false },
    { title: 'Features', completed: false },
    { title: 'Tech Stack', completed: false },
    { title: 'Testing', completed: false },
    { title: 'Professional Features', completed: false },
    { title: 'Final Details', completed: false },
    { title: 'Generate Prompt', completed: false },
];

function App() {
    const [currentStep, setCurrentStep] = useState(0);
    const [projectData, setProjectData] = useState<ProjectData>({
        projectType: '',
        projectName: '',
        description: '',
        targetAudience: '',
        coreFeatures: [],
        techStack: {
            frontend: '',
            backend: '',
            database: '',
            hosting: '',
        },
        testing: {
            approach: '',
            tools: [],
        },
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
    });

    const updateProjectData = (field: string, value: any) => {
        setProjectData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const nextStep = () => {
        setCurrentStep((prev) => Math.min(prev + 1, 8));
    };

    const prevStep = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 0));
    };

    const restartWizard = () => {
        setCurrentStep(0);
        setProjectData({
            projectType: '',
            projectName: '',
            description: '',
            targetAudience: '',
            coreFeatures: [],
            techStack: {
                frontend: '',
                backend: '',
                database: '',
                hosting: '',
            },
            testing: {
                approach: '',
                tools: [],
            },
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
        });
    };

    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return <WelcomeStep onNext={nextStep} />;
            case 1:
                return (
                    <ProjectTypeStep
                        selectedType={projectData.projectType}
                        onSelect={(type) => updateProjectData('projectType', type)}
                        onNext={nextStep}
                        onPrev={prevStep}
                    />
                );
            case 2:
                return (
                    <ProjectDetailsStep
                        projectType={projectData.projectType}
                        projectName={projectData.projectName}
                        description={projectData.description}
                        targetAudience={projectData.targetAudience}
                        onUpdate={updateProjectData}
                        onNext={nextStep}
                        onPrev={prevStep}
                    />
                );
            case 3:
                return (
                    <FeaturesStep
                        projectType={projectData.projectType}
                        projectName={projectData.projectName}
                        description={projectData.description}
                        features={projectData.coreFeatures}
                        onUpdate={(features) => updateProjectData('coreFeatures', features)}
                        onNext={nextStep}
                        onPrev={prevStep}
                    />
                );
            case 4:
                return (
                    <TechStackStep
                        projectType={projectData.projectType}
                        projectName={projectData.projectName}
                        description={projectData.description}
                        features={projectData.coreFeatures}
                        techStack={projectData.techStack}
                        onUpdate={(techStack) => updateProjectData('techStack', techStack)}
                        onNext={nextStep}
                        onPrev={prevStep}
                    />
                );
            case 5:
                return (
                    <TestingStep
                        testing={projectData.testing}
                        onUpdate={(testing) => updateProjectData('testing', testing)}
                        onNext={nextStep}
                        onPrev={prevStep}
                    />
                );
            case 6:
                return (
                    <ProfessionalRequirementsStep
                        requirements={projectData.professionalRequirements}
                        onUpdate={(requirements) => updateProjectData('professionalRequirements', requirements)}
                        onNext={nextStep}
                        onPrev={prevStep}
                    />
                );
            case 7:
                return (
                    <FinalDetailsStep
                        additionalRequirements={projectData.additionalRequirements}
                        onUpdate={updateProjectData}
                        onNext={nextStep}
                        onPrev={prevStep}
                    />
                );
            case 8:
                return <PromptGenerationStep projectData={projectData} onRestart={restartWizard} />;
            default:
                return <WelcomeStep onNext={nextStep} />;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black">
            <div className="container mx-auto px-4 py-8">
                {currentStep > 0 && currentStep < steps.length && (
                    <ProgressBar
                        currentStep={Math.max(0, currentStep - 1)}
                        totalSteps={steps.length}
                        steps={steps}
                    />
                )}

                <div className="animate-fadeIn">{renderStep()}</div>
            </div>
            <Analytics />
        </div>
    );
}

export default App;
