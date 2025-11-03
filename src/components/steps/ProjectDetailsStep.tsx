import React, { useState } from 'react';
import { Wand2, RefreshCw, Sparkles } from 'lucide-react';

interface ProjectDetailsStepProps {
  projectType: string;
  projectName: string;
  description: string;
  targetAudience: string;
  onUpdate: (field: string, value: string) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const ProjectDetailsStep: React.FC<ProjectDetailsStepProps> = ({
  projectType,
  projectName,
  description,
  targetAudience,
  onUpdate,
  onNext,
  onPrev,
}) => {
  const [enhancedDescription, setEnhancedDescription] = useState<string>('');
  const [enhancing, setEnhancing] = useState(false);

  const enhanceDescription = async () => {
    if (!description.trim()) return;

    setEnhancing(true);
    try {
      const prompt = `Take this basic project description and expand it into a comprehensive, detailed description that clearly explains:

1. What the project does
2. What problem it solves
3. Who the target users are
4. Key features and functionality
5. What makes it valuable or unique

Original description: "${description}"
Project type: ${projectType}
Project name: ${projectName || 'Unnamed Project'}

Please rewrite this as a detailed, professional project description that would help developers understand exactly what to build. Keep the same core idea but add context, user scenarios, and specific functionality details. Write it in a clear, engaging way.`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content:
                'You are a product manager helping to write detailed project descriptions. Take brief ideas and expand them into comprehensive, actionable descriptions that developers can understand and build from.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: 400,
          temperature: 0.7,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const enhanced = data.choices[0]?.message?.content || '';
        setEnhancedDescription(enhanced);
      }
    } catch (error) {
      console.error('Error enhancing description:', error);
    }
    setEnhancing(false);
  };

  const useEnhancedDescription = () => {
    onUpdate('description', enhancedDescription);
    setEnhancedDescription('');
  };

  const canContinue = projectName && description && targetAudience;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
          Tell us about your project
        </h2>
        <p className="text-gray-300">
          Help us understand your vision so we can provide better guidance
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Project Name</label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => onUpdate('projectName', e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors text-white placeholder-gray-400"
            placeholder="e.g., My Awesome App"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Project Description
          </label>
          <div className="relative">
            <textarea
              value={description}
              onChange={(e) => onUpdate('description', e.target.value)}
              rows={4}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors resize-none text-white placeholder-gray-400"
              placeholder="Describe what you want to build and what problem it solves..."
            />
          </div>

          {/* Description Enhancer */}
          {description.length > 10 && (
            <div className="mt-3 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <Wand2 className="w-4 h-4 text-purple-400 mr-2" />
                  <span className="text-sm font-medium text-purple-300">
                    Enhance your description with AI
                  </span>
                </div>
                <button
                  onClick={enhanceDescription}
                  disabled={enhancing}
                  className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs rounded-md hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 transition-colors"
                >
                  {enhancing ? (
                    <>
                      <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                      Enhancing...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-3 h-3 mr-1" />
                      Enhance Description
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-purple-200">
                Our AI can help improve and expand your description with more details about
                features, users, and functionality.
              </p>
            </div>
          )}

          {/* Enhanced Description Preview */}
          {enhancedDescription && (
            <div className="mt-4 p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <Sparkles className="w-4 h-4 text-green-400 mr-2" />
                  <span className="text-sm font-medium text-green-300">Enhanced Description</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={useEnhancedDescription}
                    className="px-3 py-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs rounded-md hover:from-green-700 hover:to-emerald-700 transition-colors"
                  >
                    Use This
                  </button>
                  <button
                    onClick={() => setEnhancedDescription('')}
                    className="px-3 py-1 bg-gray-600 text-white text-xs rounded-md hover:bg-gray-700 transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
              <div className="text-sm text-green-200 bg-green-500/5 p-3 rounded-md border border-green-500/20">
                {enhancedDescription}
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Target Audience</label>
          <input
            type="text"
            value={targetAudience}
            onChange={(e) => onUpdate('targetAudience', e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors text-white placeholder-gray-400"
            placeholder="e.g., Small business owners, Students, Gamers"
          />
        </div>

        {canContinue && (
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
              Continue to Features
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
