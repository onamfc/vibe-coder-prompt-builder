import React from 'react';

interface FinalDetailsStepProps {
  additionalRequirements: string[];
  onUpdate: (field: string, value: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const FinalDetailsStep: React.FC<FinalDetailsStepProps> = ({
  additionalRequirements,
  onUpdate,
  onNext,
  onPrev,
}) => {
  const addRequirement = (requirement: string) => {
    if (requirement.trim() && !additionalRequirements.includes(requirement.trim())) {
      onUpdate('additionalRequirements', [...additionalRequirements, requirement.trim()]);
    }
  };

  const removeRequirement = (index: number) => {
    onUpdate(
      'additionalRequirements',
      additionalRequirements.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
          Additional Requirements
        </h2>
        <p className="text-gray-300">Add any special requirements or features for your project</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Special Requirements (Optional)
          </label>
          <p className="text-sm text-gray-400 mb-3">
            Examples: Mobile responsive, Dark mode, Multi-language support, Analytics, SEO
            optimization
          </p>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="e.g., Must work on mobile devices, Need dark mode toggle"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  addRequirement((e.target as HTMLInputElement).value);
                  (e.target as HTMLInputElement).value = '';
                }
              }}
            />
            {additionalRequirements.length > 0 && (
              <div className="space-y-2">
                {additionalRequirements.map((req, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-purple-500/10 border border-purple-500/30 rounded-md"
                  >
                    <span className="text-sm text-gray-200">{req}</span>
                    <button
                      onClick={() => removeRequirement(index)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center gap-4 pt-6">
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
            Generate My Prompt
          </button>
        </div>
      </div>
    </div>
  );
};
