import React, { useState, useEffect } from 'react';
import { Globe, Smartphone, ShoppingCart, Users, Database, Gamepad2 } from 'lucide-react';

interface ProjectTypeStepProps {
  selectedType: string;
  onSelect: (type: string) => void;
  onNext: () => void;
  onPrev: () => void;
}

const projectTypes = [
  { id: 'website', name: 'Website', icon: Globe, description: 'Portfolio, blog, or business website' },
  { id: 'web-app', name: 'Web Application', icon: Database, description: 'Interactive web-based application' },
  { id: 'mobile-app', name: 'Mobile App', icon: Smartphone, description: 'iOS or Android application' },
  { id: 'ecommerce', name: 'E-commerce', icon: ShoppingCart, description: 'Online store or marketplace' },
  { id: 'social-platform', name: 'Social Platform', icon: Users, description: 'Community or social networking site' },
  { id: 'game', name: 'Game', icon: Gamepad2, description: 'Browser or mobile game' }
];

export const ProjectTypeStep: React.FC<ProjectTypeStepProps> = ({ selectedType, onSelect, onNext, onPrev }) => {

  const handleTypeSelect = (type: string) => {
    onSelect(type);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
          What type of project do you want to build?
        </h2>
        <p className="text-gray-300">
          Choose the option that best describes your vision
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {projectTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => handleTypeSelect(type.id)}
            className={`p-6 rounded-xl border-2 transition-all duration-200 text-left hover:shadow-lg transform hover:-translate-y-1 ${
              selectedType === type.id
                ? 'border-purple-500 bg-gradient-to-br from-purple-500/10 to-pink-500/10 shadow-2xl shadow-purple-500/50'
                : 'border-gray-700 bg-gradient-to-br from-gray-800 to-purple-900/30 hover:border-purple-500/50 backdrop-blur-sm'
            }`}
          >
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 ${
              selectedType === type.id ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gray-700'
            }`}>
              <type.icon className={`w-6 h-6 ${
                selectedType === type.id ? 'text-white' : 'text-gray-600'
              }`} />
            </div>
            <h3 className={`text-lg font-semibold mb-2 ${
              selectedType === type.id ? 'text-white' : 'text-gray-200'
            }`}>
              {type.name}
            </h3>
            <p className={`text-sm ${
              selectedType === type.id ? 'text-gray-200' : 'text-gray-400'
            }`}>
              {type.description}
            </p>
          </button>
        ))}
      </div>

      {selectedType && (
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
            Continue with {projectTypes.find(t => t.id === selectedType)?.name}
          </button>
        </div>
      )}
    </div>
  );
};