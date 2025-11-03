import React from 'react';
import { Sparkles, MessageCircle } from 'lucide-react';

interface AIResponseProps {
  content: string;
  loading?: boolean;
}

export const AIResponse: React.FC<AIResponseProps> = ({ content, loading }) => {
  if (loading) {
    return (
      <div className="bg-gradient-to-r from-gray-800 to-purple-900/50 rounded-lg p-6 border border-purple-500/30 backdrop-blur-sm">
        <div className="flex items-center mb-4">
          <Sparkles className="w-5 h-5 text-purple-400 mr-2 animate-pulse" />
          <span className="text-purple-300 font-medium">AI is thinking...</span>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-purple-500/30 rounded animate-pulse w-3/4"></div>
          <div className="h-3 bg-purple-500/30 rounded animate-pulse w-1/2"></div>
          <div className="h-3 bg-purple-500/30 rounded animate-pulse w-5/6"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-gray-800 to-purple-900/50 rounded-lg p-6 border border-purple-500/30 animate-fadeIn backdrop-blur-sm">
      <div className="flex items-center mb-4">
        <MessageCircle className="w-5 h-5 text-purple-400 mr-2" />
        <span className="text-purple-300 font-medium">AI Assistant</span>
      </div>
      <div className="prose prose-sm max-w-none text-gray-200">
        {content.split('\n').map((paragraph, index) => (
          <p key={index} className="mb-2 leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
};