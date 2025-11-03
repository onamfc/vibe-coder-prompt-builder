import React from 'react';
import { Wand2, ArrowRight, Sparkles } from 'lucide-react';

interface WelcomeStepProps {
  onNext: () => void;
}

export const WelcomeStep: React.FC<WelcomeStepProps> = ({ onNext }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-6 shadow-2xl shadow-purple-500/50">
          <Wand2 className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
          AI Prompt Builder
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Transform your ideas into detailed project specifications that any AI assistant can
          understand and build
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="text-center p-6 bg-gradient-to-br from-gray-800 to-purple-900/50 rounded-xl shadow-2xl border border-purple-500/20 backdrop-blur-sm">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-500/20 rounded-lg mb-4 border border-purple-500/30">
            <Sparkles className="w-6 h-6 text-purple-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">AI-Guided Process</h3>
          <p className="text-gray-300">
            Our AI assistant walks you through every decision, explaining options in simple terms
          </p>
        </div>

        <div className="text-center p-6 bg-gradient-to-br from-gray-800 to-purple-900/50 rounded-xl shadow-2xl border border-purple-500/20 backdrop-blur-sm">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-pink-500/20 rounded-lg mb-4 border border-pink-500/30">
            <ArrowRight className="w-6 h-6 text-pink-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Step-by-Step</h3>
          <p className="text-gray-300">
            Break down complex technical decisions into easy, manageable questions
          </p>
        </div>

        <div className="text-center p-6 bg-gradient-to-br from-gray-800 to-purple-900/50 rounded-xl shadow-2xl border border-purple-500/20 backdrop-blur-sm">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-lg mb-4 border border-blue-500/30">
            <Wand2 className="w-6 h-6 text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Perfect Prompts</h3>
          <p className="text-gray-300">
            Generate comprehensive prompts that include all technical details and requirements
          </p>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={onNext}
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-2xl shadow-purple-500/50 transform hover:-translate-y-1 hover:scale-105"
        >
          Start Building Your Project
          <ArrowRight className="ml-2 w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
