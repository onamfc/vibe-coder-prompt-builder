import React, { useState, useEffect } from 'react';
import { Plus, X, Check, Lightbulb, Loader2 } from 'lucide-react';

interface FeaturesStepProps {
  projectType: string;
  projectName: string;
  description: string;
  features: string[];
  onUpdate: (features: string[]) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const FeaturesStep: React.FC<FeaturesStepProps> = ({
  projectType,
  projectName,
  description,
  features,
  onUpdate,
  onNext,
  onPrev,
}) => {
  const [newFeature, setNewFeature] = useState('');
  const [suggestedFeatures, setSuggestedFeatures] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  useEffect(() => {
    // Generate suggestions when component mounts with valid data
    if (projectType && description && description.length > 20) {
      generateFeatureSuggestions();
    }
  }, [projectType, description]);

  const generateFeatureSuggestions = async () => {
    setLoadingSuggestions(true);
    try {
      const prompt = `For a ${projectType} project called "${projectName}" with description: "${description}", suggest 8-10 specific, actionable features that would be valuable. Return only a simple list of features, one per line, without numbers or bullets. Focus on features that are commonly needed for this type of project.`;

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content:
                'You are helping a non-technical person understand what features their project should have. Suggest practical, essential features in simple terms.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: 300,
          temperature: 0.7,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const suggestions =
          data.choices[0]?.message?.content
            ?.split('\n')
            .map((line: string) => line.trim())
            .filter((line: string) => line.length > 0 && !line.match(/^\d+\.?\s*/))
            .slice(0, 10) || [];

        setSuggestedFeatures(suggestions);
      }
    } catch (error) {
      console.error('Error generating feature suggestions:', error);
    }
    setLoadingSuggestions(false);
  };

  const addFeature = (feature: string) => {
    const trimmedFeature = feature.trim();
    if (trimmedFeature && !features.includes(trimmedFeature)) {
      onUpdate([...features, trimmedFeature]);
    }
  };

  const addCustomFeature = () => {
    if (newFeature.trim()) {
      addFeature(newFeature);
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    onUpdate(features.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addCustomFeature();
    }
  };

  const isFeatureSelected = (suggestion: string) => {
    return features.includes(suggestion);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
          What features do you need?
        </h2>
        <p className="text-gray-300">
          Choose from our AI-suggested features or add your own custom ones
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* AI Suggestions */}
        <div className="space-y-4">
          <div className="flex items-center mb-4">
            <Lightbulb className="w-5 h-5 text-yellow-500 mr-2" />
            <h3 className="text-lg font-semibold text-white">
              Suggested Features for Your {projectType}
            </h3>
          </div>

          {loadingSuggestions ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-purple-400 mr-2" />
              <span className="text-gray-300">Generating personalized suggestions...</span>
            </div>
          ) : (
            <div className="space-y-2">
              {suggestedFeatures.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => addFeature(suggestion)}
                  disabled={isFeatureSelected(suggestion)}
                  className={`w-full p-3 text-left rounded-lg border-2 transition-all duration-200 ${
                    isFeatureSelected(suggestion)
                      ? 'border-green-500/50 bg-green-500/10 text-green-300 cursor-not-allowed'
                      : 'border-gray-600 bg-gray-800 hover:border-purple-500/50 hover:bg-purple-500/10 cursor-pointer text-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{suggestion}</span>
                    {isFeatureSelected(suggestion) ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Plus className="w-4 h-4 text-purple-400" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Custom Features & Selected Features */}
        <div className="space-y-6">
          {/* Add Custom Feature */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Add Custom Feature</h3>
            <div className="flex gap-3">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors text-white placeholder-gray-400"
                placeholder="e.g., Dark mode toggle, Email notifications"
              />
              <button
                onClick={addCustomFeature}
                disabled={!newFeature.trim()}
                className="px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Selected Features */}
          {features.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                Your Selected Features ({features.length})
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/30 rounded-lg"
                  >
                    <div className="flex items-center">
                      <Check className="w-4 h-4 text-green-400 mr-3" />
                      <span className="text-gray-200 text-sm">{feature}</span>
                    </div>
                    <button
                      onClick={() => removeFeature(index)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="mt-8 text-center">
        {features.length < 3 ? (
          <div className="text-gray-400 text-sm mb-4">
            Add at least {3 - features.length} more feature{3 - features.length !== 1 ? 's' : ''} to
            continue
          </div>
        ) : (
          <div className="text-green-400 text-sm mb-4 flex items-center justify-center">
            <Check className="w-4 h-4 mr-1" />
            Great! You have {features.length} features selected
          </div>
        )}

        {features.length >= 3 && (
          <div className="flex justify-center gap-4">
            <button
              onClick={onPrev}
              className="px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors duration-200 border border-gray-600"
            >
              Back
            </button>
            <button
              onClick={onNext}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors duration-200 shadow-lg hover:shadow-xl shadow-purple-500/50 transform hover:-translate-y-0.5"
            >
              Continue to Tech Stack
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
