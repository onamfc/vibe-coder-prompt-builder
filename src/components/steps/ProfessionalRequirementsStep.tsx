import React, { useState } from 'react';
import {
  Shield,
  Users,
  Smartphone,
  Zap,
  Upload,
  CreditCard,
  Search,
  BarChart,
  Globe,
  Info,
} from 'lucide-react';

interface ProfessionalRequirement {
  id: string;
  label: string;
  description: string;
  icon: any;
  selected: boolean;
  implications?: string[];
}

interface ProfessionalRequirementsStepProps {
  requirements: { [key: string]: boolean };
  onUpdate: (requirements: { [key: string]: boolean }) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const ProfessionalRequirementsStep: React.FC<ProfessionalRequirementsStepProps> = ({
  requirements,
  onUpdate,
  onNext,
  onPrev,
}) => {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const professionalRequirements: ProfessionalRequirement[] = [
    {
      id: 'userAccounts',
      label: 'User Accounts & Login',
      description: 'Users can create accounts, login, and have personalized experiences',
      icon: Users,
      selected: requirements.userAccounts || false,
      implications: [
        'Authentication system',
        'Password reset flow',
        'Email verification',
        'Session management',
        'Profile pages',
      ],
    },
    {
      id: 'sensitiveData',
      label: 'Sensitive Data Handling',
      description: "You'll handle personal info, financial data, or private content",
      icon: Shield,
      selected: requirements.sensitiveData || false,
      implications: [
        'Data encryption',
        'HTTPS/SSL',
        'Privacy policy',
        'GDPR compliance',
        'Security headers',
        'Input sanitization',
      ],
    },
    {
      id: 'adminPanel',
      label: 'Admin Dashboard',
      description: 'Need a backend interface to manage content, users, or settings',
      icon: BarChart,
      selected: requirements.adminPanel || false,
      implications: [
        'Admin authentication',
        'Content management UI',
        'User management',
        'Analytics dashboard',
        'Role-based access',
      ],
    },
    {
      id: 'mobileResponsive',
      label: 'Mobile-Friendly Design',
      description: 'Works perfectly on phones and tablets, not just computers',
      icon: Smartphone,
      selected: requirements.mobileResponsive || false,
      implications: [
        'Responsive layout',
        'Touch-friendly controls',
        'Mobile navigation',
        'Performance optimization',
        'Mobile testing',
      ],
    },
    {
      id: 'realTimeFeatures',
      label: 'Real-Time Updates',
      description: 'Content updates instantly without refreshing (live notifications, chat, etc.)',
      icon: Zap,
      selected: requirements.realTimeFeatures || false,
      implications: [
        'WebSocket connection',
        'Real-time database',
        'Live notifications',
        'Presence indicators',
        'Conflict resolution',
      ],
    },
    {
      id: 'fileUploads',
      label: 'File Uploads',
      description: 'Users can upload images, documents, videos, or other files',
      icon: Upload,
      selected: requirements.fileUploads || false,
      implications: [
        'File validation',
        'Cloud storage setup',
        'Image optimization',
        'File size limits',
        'Virus scanning',
        'CDN delivery',
      ],
    },
    {
      id: 'payments',
      label: 'Payment Processing',
      description: 'Users can purchase products, subscriptions, or services',
      icon: CreditCard,
      selected: requirements.payments || false,
      implications: [
        'Payment gateway (Stripe/PayPal)',
        'Checkout flow',
        'Receipt generation',
        'Refund handling',
        'Webhook processing',
        'PCI compliance',
      ],
    },
    {
      id: 'searchFeature',
      label: 'Search Functionality',
      description: 'Users can search through your content, products, or data',
      icon: Search,
      selected: requirements.searchFeature || false,
      implications: [
        'Search indexing',
        'Fuzzy matching',
        'Filters and sorting',
        'Search autocomplete',
        'Performance optimization',
      ],
    },
    {
      id: 'analytics',
      label: 'Usage Analytics',
      description: 'Track how users interact with your app (page views, clicks, conversions)',
      icon: BarChart,
      selected: requirements.analytics || false,
      implications: [
        'Analytics integration',
        'Event tracking',
        'User behavior metrics',
        'Conversion funnels',
        'Privacy compliance',
      ],
    },
    {
      id: 'multiLanguage',
      label: 'Multiple Languages',
      description: 'Support for different languages (internationalization)',
      icon: Globe,
      selected: requirements.multiLanguage || false,
      implications: [
        'i18n framework',
        'Translation management',
        'Language switcher',
        'RTL support',
        'Locale-specific formatting',
      ],
    },
  ];

  const toggleRequirement = (id: string) => {
    onUpdate({
      ...requirements,
      [id]: !requirements[id],
    });
  };

  const toggleExpanded = (id: string) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  const selectedCount = Object.values(requirements).filter(Boolean).length;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
          Professional Features You Might Need
        </h2>
        <p className="text-gray-300 mb-2">
          These are important features that make your app professional and user-friendly
        </p>
        <p className="text-sm text-purple-300">
          Select any that apply to your project • Selected: {selectedCount}
        </p>
      </div>

      {/* Info Banner */}
      <div className="mb-8 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-200">
            <p className="font-medium mb-1">Don't worry - we've got you covered!</p>
            <p>
              These selections help us generate a complete, professional specification. Even if
              you're not sure, make your best guess - the final prompt will include all the
              technical details your AI assistant needs.
            </p>
          </div>
        </div>
      </div>

      {/* Requirements Grid */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {professionalRequirements.map((req) => {
          const Icon = req.icon;
          const isExpanded = expandedCard === req.id;
          const isSelected = requirements[req.id] || false;

          return (
            <div
              key={req.id}
              className={`rounded-lg border-2 transition-all duration-200 ${
                isSelected
                  ? 'border-purple-500 bg-gradient-to-br from-purple-500/10 to-pink-500/10'
                  : 'border-gray-600 bg-gray-800/50'
              }`}
            >
              <button onClick={() => toggleRequirement(req.id)} className="w-full p-4 text-left">
                <div className="flex items-start">
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                      isSelected ? 'bg-purple-500' : 'bg-gray-700'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-gray-400'}`} />
                  </div>
                  <div className="flex-1">
                    <h3
                      className={`font-semibold mb-1 ${isSelected ? 'text-white' : 'text-gray-200'}`}
                    >
                      {req.label}
                    </h3>
                    <p className={`text-sm ${isSelected ? 'text-gray-300' : 'text-gray-400'}`}>
                      {req.description}
                    </p>
                  </div>
                  <div
                    className={`ml-2 w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                      isSelected ? 'border-purple-500 bg-purple-500' : 'border-gray-500'
                    }`}
                  >
                    {isSelected && (
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              </button>

              {req.implications && (
                <div className="px-4 pb-4">
                  <button
                    onClick={() => toggleExpanded(req.id)}
                    className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    {isExpanded ? '↑ Hide' : '↓ Show'} what this includes
                  </button>
                  {isExpanded && (
                    <div className="mt-2 pl-3 border-l-2 border-purple-500/30">
                      <ul className="space-y-1">
                        {req.implications.map((impl, idx) => (
                          <li key={idx} className="text-xs text-gray-400">
                            • {impl}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Help Text */}
      <div className="mt-8 bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 mb-8">
        <p className="text-sm text-purple-200">
          <strong>Not sure what to pick?</strong> That's okay! Select anything that sounds like it
          might be useful. The AI will include proper implementation details for everything you
          select, plus best practices you might not know about yet.
        </p>
      </div>

      {/* Navigation */}
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
          Continue to Generate Prompt
        </button>
      </div>
    </div>
  );
};
