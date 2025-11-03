import React from 'react';
import { Check, Circle } from 'lucide-react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  steps: Array<{ title: string; completed: boolean }>;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps, steps }) => {
  return (
    <div className="relative bg-gradient-to-r from-gray-800 to-purple-900 rounded-2xl shadow-2xl p-8 mb-12 border border-purple-500/20">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl">
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-purple-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Building Your Vision
            </h3>
            <p className="text-gray-400 mt-1">
              Step {currentStep + 1} of {totalSteps}
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white mb-1">
              {Math.round(((currentStep + 1) / totalSteps) * 100)}%
            </div>
            <div className="text-sm text-purple-300">Complete</div>
          </div>
        </div>

        {/* Creative Progress Visualization */}
        <div className="relative mb-8">
          {/* Main progress track */}
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-400 rounded-full transition-all duration-1000 ease-out relative"
              style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            >
              {/* Animated shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
            </div>
          </div>

          {/* Step indicators */}
          <div className="absolute -top-3 left-0 right-0 flex justify-between">
            {steps.map((step, index) => (
              <div key={index} className="relative flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
                    index <= currentStep
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 border-purple-400 shadow-lg shadow-purple-500/50'
                      : 'bg-gray-700 border-gray-600'
                  }`}
                >
                  {index < currentStep ? (
                    <Check className="w-4 h-4 text-white" />
                  ) : index === currentStep ? (
                    <Circle className="w-4 h-4 text-white fill-current animate-pulse" />
                  ) : (
                    <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  )}
                </div>

                {/* Step label */}
                <div className="absolute top-10 text-center min-w-max">
                  <div
                    className={`text-xs font-medium px-3 py-1 rounded-full transition-all duration-300 ${
                      index <= currentStep
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : 'bg-gray-800/50 text-gray-500 border border-gray-700'
                    }`}
                  >
                    {step.title}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step details */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
          {steps.slice(0, 4).map((step, index) => (
            <div
              key={index}
              className={`p-4 rounded-xl border transition-all duration-300 ${
                index <= currentStep
                  ? 'bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30 shadow-lg'
                  : 'bg-gray-800/30 border-gray-700/50'
              }`}
            >
              <div
                className={`text-sm font-medium ${
                  index <= currentStep ? 'text-purple-300' : 'text-gray-500'
                }`}
              >
                {step.title}
              </div>
              <div
                className={`text-xs mt-1 ${
                  index <= currentStep ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                {index < currentStep
                  ? 'Completed'
                  : index === currentStep
                    ? 'In Progress'
                    : 'Pending'}
              </div>
            </div>
          ))}
        </div>

        {steps.length > 4 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {steps.slice(4).map((step, index) => {
              const actualIndex = index + 4;
              return (
                <div
                  key={actualIndex}
                  className={`p-4 rounded-xl border transition-all duration-300 ${
                    actualIndex <= currentStep
                      ? 'bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30 shadow-lg'
                      : 'bg-gray-800/30 border-gray-700/50'
                  }`}
                >
                  <div
                    className={`text-sm font-medium ${
                      actualIndex <= currentStep ? 'text-purple-300' : 'text-gray-500'
                    }`}
                  >
                    {step.title}
                  </div>
                  <div
                    className={`text-xs mt-1 ${
                      actualIndex <= currentStep ? 'text-gray-300' : 'text-gray-600'
                    }`}
                  >
                    {actualIndex < currentStep
                      ? 'Completed'
                      : actualIndex === currentStep
                        ? 'In Progress'
                        : 'Pending'}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
