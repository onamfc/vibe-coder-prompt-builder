import React from 'react';
import { Shield, Users, Zap } from 'lucide-react';

interface TestingStepProps {
  testing: any;
  onUpdate: (testing: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const TestingStep: React.FC<TestingStepProps> = ({ testing, onUpdate, onNext, onPrev }) => {
  const testingOptions = [
    {
      id: 'basic',
      title: 'Basic Testing',
      icon: Shield,
      description: 'Essential tests to make sure things work',
      tools: ['Manual testing', 'Browser testing'],
      recommended: 'For simple projects',
    },
    {
      id: 'comprehensive',
      title: 'Comprehensive Testing',
      icon: Users,
      description: 'Thorough testing including user scenarios',
      tools: ['Automated tests', 'User experience testing', 'Performance testing'],
      recommended: 'For business applications',
    },
    {
      id: 'advanced',
      title: 'Advanced Testing',
      icon: Zap,
      description: 'Full testing suite with continuous monitoring',
      tools: ['Unit tests', 'Integration tests', 'E2E testing', 'Performance monitoring'],
      recommended: 'For complex applications',
    },
  ];

  const updateTesting = (approach: string) => {
    const selected = testingOptions.find((opt) => opt.id === approach);
    onUpdate({
      approach,
      tools: selected?.tools || [],
    });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
          How should we test your project?
        </h2>
        <p className="text-gray-300">Testing ensures your project works reliably for your users</p>
      </div>

      <div className="grid gap-6 mb-8">
        {testingOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => updateTesting(option.id)}
            className={`p-6 rounded-xl border-2 transition-all duration-200 text-left ${
              testing.approach === option.id
                ? 'border-purple-500 bg-gradient-to-br from-purple-500/10 to-pink-500/10'
                : 'border-gray-600 bg-gradient-to-br from-gray-800 to-purple-900/30 hover:border-purple-500/50 hover:shadow-md backdrop-blur-sm'
            }`}
          >
            <div className="flex items-start">
              <div
                className={`p-3 rounded-lg mr-4 ${
                  testing.approach === option.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                    : 'bg-gray-700'
                }`}
              >
                <option.icon
                  className={`w-6 h-6 ${
                    testing.approach === option.id ? 'text-white' : 'text-gray-400'
                  }`}
                />
              </div>
              <div className="flex-1">
                <h3
                  className={`text-lg font-semibold mb-2 ${
                    testing.approach === option.id ? 'text-white' : 'text-gray-200'
                  }`}
                >
                  {option.title}
                </h3>
                <p
                  className={`mb-3 ${
                    testing.approach === option.id ? 'text-gray-200' : 'text-gray-400'
                  }`}
                >
                  {option.description}
                </p>
                <div className="mb-3">
                  <div className="flex flex-wrap gap-2">
                    {option.tools.map((tool, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-700 text-gray-300 text-sm rounded-md"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-purple-400 font-medium">{option.recommended}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {testing.approach && (
        <div className="flex justify-center gap-4">
          <button
            onClick={onPrev}
            className="px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors duration-200 border border-gray-600"
          >
            Back
          </button>
          <button
            onClick={onNext}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors duration-200 shadow-lg shadow-purple-500/50"
          >
            Continue to Final Details
          </button>
        </div>
      )}
    </div>
  );
};
