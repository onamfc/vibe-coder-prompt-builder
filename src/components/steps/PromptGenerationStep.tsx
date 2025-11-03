import React, { useState, useEffect } from 'react';
import { Copy, Download, CheckCircle } from 'lucide-react';
import { OpenAIService } from '../../services/openai';
import { LoadingSpinner } from '../LoadingSpinner';

interface PromptGenerationStepProps {
  projectData: any;
  onRestart: () => void;
}

export const PromptGenerationStep: React.FC<PromptGenerationStepProps> = ({ projectData, onRestart }) => {
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const openai = new OpenAIService();

  useEffect(() => {
    generatePrompt();
  }, []);

  const generatePrompt = async () => {
    setLoading(true);
    const prompt = await openai.generateFinalPrompt(projectData);
    setGeneratedPrompt(prompt);
    setLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadPrompt = () => {
    const blob = new Blob([generatedPrompt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectData.projectName.replace(/\s+/g, '-').toLowerCase()}-prompt.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto text-center">
        <LoadingSpinner message="Creating your detailed project specification..." />
        <p className="mt-4 text-gray-300">
          Our AI architect is crafting a comprehensive technical specification with implementation details, design guidelines, and deployment strategy
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-4 shadow-2xl shadow-green-500/50">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
          Your Comprehensive Project Specification is Ready!
        </h2>
        <p className="text-gray-300 mb-6">
          This detailed specification contains everything an AI assistant needs to build your professional-grade MVP
        </p>
        
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={copyToClipboard}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors shadow-lg shadow-purple-500/50"
          >
            <Copy className="w-4 h-4 mr-2" />
            {copied ? 'Copied!' : 'Copy Specification'}
          </button>
          <button
            onClick={downloadPrompt}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg hover:from-blue-700 hover:to-teal-700 transition-colors shadow-lg shadow-blue-500/50"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Specification
          </button>
        </div>
      </div>

      <div className="bg-gray-900 rounded-lg p-6 border border-purple-500/30 mb-8 max-h-[600px] overflow-y-auto">
        <pre className="whitespace-pre-wrap text-sm text-gray-200 leading-relaxed">
          {generatedPrompt}
        </pre>
      </div>

      <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-purple-300 mb-2">Next Steps:</h3>
        <ul className="text-purple-200 space-y-1">
          <li>• Copy the comprehensive specification above</li>
          <li>• Paste it into your preferred AI coding assistant (Claude, ChatGPT, etc.)</li>
          <li>• The AI will build your professional-grade project step by step</li>
          <li>• Follow the implementation plan for best results</li>
          <li>• Ask for modifications or enhancements as your project evolves</li>
        </ul>
      </div>

      <div className="text-center">
        <button
          onClick={onRestart}
          className="px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors duration-200 border border-gray-600"
        >
          Create Another Project
        </button>
      </div>
    </div>
  );
};