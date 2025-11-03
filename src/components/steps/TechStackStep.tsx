import React, { useState, useEffect } from 'react';
import { Check, ChevronDown, ChevronUp, Sparkles, Info } from 'lucide-react';
import { AIResponse } from '../AIResponse';

interface TechStackStepProps {
  projectType: string;
  projectName: string;
  description: string;
  features: string[];
  techStack: any;
  onUpdate: (techStack: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const TechStackStep: React.FC<TechStackStepProps> = ({
  projectType,
  projectName,
  description,
  features,
  techStack,
  onUpdate,
  onNext,
  onPrev,
}) => {
  const [aiRecommendations, setAiRecommendations] = useState<string>('');
  const [recommendedStack, setRecommendedStack] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [techOptions, setTechOptions] = useState<any>({});
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [showAllOptions, setShowAllOptions] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (projectType) {
      generateTechOptions();
    }
  }, [projectType]);

  useEffect(() => {
    if (features.length > 0 && Object.keys(techOptions).length > 0) {
      getRecommendations();
    }
  }, [features, projectType, description, techOptions]);

  const generateTechOptions = async () => {
    setLoadingOptions(true);
    try {
      const prompt = `Generate technology stack options for a ${projectType} project. For each category (frontend, backend, database, hosting), provide 8-12 relevant options with:

1. value: kebab-case identifier
2. label: Display name
3. description: Brief explanation of what it is and why it's good for this project type
4. pros: Array of 3 key benefits
5. difficulty: "Easy", "Medium", or "Hard"

Categories needed:
- frontend: User interface technologies appropriate for ${projectType}
- backend: Server/API technologies (include "none" option for static projects)
- database: Data storage options (include "none" option)
- hosting: Deployment platforms suitable for ${projectType}

For mobile apps, include React Native, Flutter, Swift, Kotlin, Ionic, etc.
For web apps, include React, Vue, Angular, etc.
For games, include Unity, Godot, Phaser, etc.

Return as valid JSON in this exact format:
{
  "frontend": {
    "title": "User Interface",
    "description": "Technologies for building the user interface",
    "options": [
      {
        "value": "react-native",
        "label": "React Native",
        "description": "Cross-platform mobile development with JavaScript",
        "pros": ["Single codebase", "Native performance", "Large community"],
        "difficulty": "Medium"
      }
    ]
  }
}`;

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
                'You are a technology consultant. Generate comprehensive, accurate technology options for different project types. Always return valid JSON only, no additional text.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: 2000,
          temperature: 0.3,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices[0]?.message?.content || '';
        try {
          const parsedOptions = JSON.parse(content);
          setTechOptions(parsedOptions);
        } catch (parseError) {
          console.error('Error parsing tech options JSON:', parseError);
          // Fallback to default options if parsing fails
          setTechOptions(getDefaultTechOptions(projectType));
        }
      } else {
        setTechOptions(getDefaultTechOptions(projectType));
      }
    } catch (error) {
      console.error('Error generating tech options:', error);
      setTechOptions(getDefaultTechOptions(projectType));
    }
    setLoadingOptions(false);
  };

  const getDefaultTechOptions = (type: string) => {
    // Fallback options based on project type
    const baseOptions = {
      'mobile-app': {
        frontend: {
          title: 'Mobile Development Framework',
          description: 'Technologies for building mobile applications',
          options: [
            {
              value: 'react-native',
              label: 'React Native',
              description: 'Cross-platform with JavaScript',
              pros: ['Single codebase', 'Native performance', 'Large community'],
              difficulty: 'Medium',
            },
            {
              value: 'flutter',
              label: 'Flutter',
              description: "Google's cross-platform framework",
              pros: ['Fast development', 'Single codebase', 'Great performance'],
              difficulty: 'Medium',
            },
            {
              value: 'swift',
              label: 'Swift (iOS)',
              description: 'Native iOS development',
              pros: ['Best iOS performance', 'Apple ecosystem', 'Latest features'],
              difficulty: 'Hard',
            },
            {
              value: 'kotlin',
              label: 'Kotlin (Android)',
              description: 'Native Android development',
              pros: ['Best Android performance', 'Google preferred', 'Modern language'],
              difficulty: 'Hard',
            },
            {
              value: 'ionic',
              label: 'Ionic',
              description: 'Web technologies for mobile',
              pros: ['Web skills reuse', 'Rapid prototyping', 'Plugin ecosystem'],
              difficulty: 'Easy',
            },
          ],
        },
        backend: {
          title: 'Backend Services',
          description: 'Server-side logic and APIs',
          options: [
            {
              value: 'firebase',
              label: 'Firebase',
              description: "Google's mobile backend platform",
              pros: ['Real-time sync', 'Authentication', 'Push notifications'],
              difficulty: 'Easy',
            },
            {
              value: 'supabase',
              label: 'Supabase',
              description: 'Open source Firebase alternative',
              pros: ['PostgreSQL', 'Real-time', 'Self-hostable'],
              difficulty: 'Easy',
            },
            {
              value: 'node',
              label: 'Node.js',
              description: 'JavaScript backend',
              pros: ['Same language', 'Fast development', 'Large ecosystem'],
              difficulty: 'Medium',
            },
          ],
        },
        database: {
          title: 'Data Storage',
          description: 'Where your app stores data',
          options: [
            {
              value: 'firebase-firestore',
              label: 'Firestore',
              description: "Google's NoSQL database",
              pros: ['Real-time sync', 'Offline support', 'Scalable'],
              difficulty: 'Easy',
            },
            {
              value: 'supabase',
              label: 'Supabase PostgreSQL',
              description: 'Managed PostgreSQL',
              pros: ['SQL database', 'Real-time', 'Row-level security'],
              difficulty: 'Easy',
            },
            {
              value: 'sqlite',
              label: 'SQLite',
              description: 'Local database',
              pros: ['Offline-first', 'No server needed', 'Fast queries'],
              difficulty: 'Easy',
            },
          ],
        },
        hosting: {
          title: 'App Distribution',
          description: 'How users get your app',
          options: [
            {
              value: 'app-stores',
              label: 'App Stores',
              description: 'iOS App Store and Google Play',
              pros: ['Maximum reach', 'Built-in payments', 'User trust'],
              difficulty: 'Medium',
            },
            {
              value: 'expo',
              label: 'Expo',
              description: 'React Native deployment platform',
              pros: ['Easy updates', 'No app store review', 'Quick testing'],
              difficulty: 'Easy',
            },
            {
              value: 'testflight',
              label: 'TestFlight + Play Console',
              description: 'Beta testing platforms',
              pros: ['User feedback', 'Gradual rollout', 'Testing tools'],
              difficulty: 'Medium',
            },
          ],
        },
      },
      game: {
        frontend: {
          title: 'Game Engine',
          description: 'Framework for building your game',
          options: [
            {
              value: 'unity',
              label: 'Unity',
              description: 'Popular cross-platform game engine',
              pros: ['Visual editor', 'Cross-platform', 'Asset store'],
              difficulty: 'Medium',
            },
            {
              value: 'godot',
              label: 'Godot',
              description: 'Open source game engine',
              pros: ['Free and open', 'Lightweight', 'Easy scripting'],
              difficulty: 'Easy',
            },
            {
              value: 'phaser',
              label: 'Phaser',
              description: 'HTML5 game framework',
              pros: ['Web-based', 'JavaScript', 'Great for 2D'],
              difficulty: 'Easy',
            },
            {
              value: 'unreal',
              label: 'Unreal Engine',
              description: 'Professional game engine',
              pros: ['AAA quality', 'Visual scripting', 'Great graphics'],
              difficulty: 'Hard',
            },
          ],
        },
        backend: {
          title: 'Backend Services',
          description: 'Online features and data storage',
          options: [
            {
              value: 'none',
              label: 'No Backend',
              description: 'Offline game only',
              pros: ['Simpler to build', 'No server costs', 'Works offline'],
              difficulty: 'Easy',
            },
            {
              value: 'firebase',
              label: 'Firebase',
              description: 'Google gaming backend',
              pros: ['Leaderboards', 'Player accounts', 'Real-time multiplayer'],
              difficulty: 'Medium',
            },
            {
              value: 'playfab',
              label: 'PlayFab',
              description: 'Gaming backend service',
              pros: ['Built for games', 'Analytics', 'Monetization tools'],
              difficulty: 'Medium',
            },
          ],
        },
        database: {
          title: 'Data Storage',
          description: 'Saving game progress and player data',
          options: [
            {
              value: 'local',
              label: 'Local Storage',
              description: 'Save on device only',
              pros: ['No internet needed', 'Free', 'Simple'],
              difficulty: 'Easy',
            },
            {
              value: 'firebase',
              label: 'Firebase',
              description: 'Cloud storage for games',
              pros: ['Cross-device sync', 'Leaderboards', 'Easy setup'],
              difficulty: 'Easy',
            },
            {
              value: 'playfab',
              label: 'PlayFab Storage',
              description: 'Gaming-focused storage',
              pros: ['Player profiles', 'Game analytics', 'Cloud saves'],
              difficulty: 'Medium',
            },
          ],
        },
        hosting: {
          title: 'Distribution Platform',
          description: 'How players access your game',
          options: [
            {
              value: 'itch',
              label: 'Itch.io',
              description: 'Indie game platform',
              pros: ['Easy publishing', 'Indie-friendly', 'Built-in community'],
              difficulty: 'Easy',
            },
            {
              value: 'steam',
              label: 'Steam',
              description: 'Major PC gaming platform',
              pros: ['Largest audience', 'Workshop support', 'Built-in payments'],
              difficulty: 'Hard',
            },
            {
              value: 'web',
              label: 'Web Hosting',
              description: 'Browser-based game',
              pros: ['Play anywhere', 'No download', 'Easy sharing'],
              difficulty: 'Easy',
            },
            {
              value: 'app-stores',
              label: 'Mobile App Stores',
              description: 'iOS/Android stores',
              pros: ['Mobile reach', 'In-app purchases', 'Discovery'],
              difficulty: 'Medium',
            },
          ],
        },
      },
    };

    return baseOptions[type as keyof typeof baseOptions] || getWebAppOptions();
  };

  const getWebAppOptions = () => ({
    frontend: {
      title: 'User Interface (Frontend)',
      description: 'What users see and interact with',
      options: [
        {
          value: 'react',
          label: 'React',
          description: 'Popular and flexible',
          pros: ['Large community', 'Lots of resources', 'Very flexible'],
          difficulty: 'Medium',
        },
        {
          value: 'vue',
          label: 'Vue.js',
          description: 'Easy to learn',
          pros: ['Beginner friendly', 'Good documentation', 'Gentle learning curve'],
          difficulty: 'Easy',
        },
        {
          value: 'nextjs',
          label: 'Next.js',
          description: 'React with extra features',
          pros: ['SEO friendly', 'Fast performance', 'Built-in features'],
          difficulty: 'Medium',
        },
        {
          value: 'vanilla',
          label: 'HTML/CSS/JS',
          description: 'Pure web basics',
          pros: ['No framework', 'Simple to start', 'Full control'],
          difficulty: 'Easy',
        },
      ],
    },
    backend: {
      title: 'Server Logic (Backend)',
      description: 'Handles data processing',
      options: [
        {
          value: 'node',
          label: 'Node.js',
          description: 'JavaScript everywhere',
          pros: ['Same language', 'Large ecosystem', 'Good performance'],
          difficulty: 'Medium',
        },
        {
          value: 'supabase',
          label: 'Supabase',
          description: 'Backend as a service',
          pros: ['Quick setup', 'Built-in auth', 'Real-time features'],
          difficulty: 'Easy',
        },
        {
          value: 'firebase',
          label: 'Firebase',
          description: 'Google backend platform',
          pros: ['Easy to start', 'No server setup', 'Free tier'],
          difficulty: 'Easy',
        },
        {
          value: 'none',
          label: 'No Backend',
          description: 'Static site only',
          pros: ['Fastest setup', 'Lowest cost', 'No complexity'],
          difficulty: 'Easy',
        },
      ],
    },
    database: {
      title: 'Data Storage',
      description: 'Where your app stores information',
      options: [
        {
          value: 'supabase',
          label: 'Supabase (PostgreSQL)',
          description: 'Modern database platform',
          pros: ['SQL database', 'Real-time updates', 'Built-in auth'],
          difficulty: 'Easy',
        },
        {
          value: 'firebase',
          label: 'Firebase Firestore',
          description: 'NoSQL cloud database',
          pros: ['Easy setup', 'Real-time sync', 'Offline support'],
          difficulty: 'Easy',
        },
        {
          value: 'mongodb',
          label: 'MongoDB',
          description: 'Flexible NoSQL database',
          pros: ['Flexible schema', 'Scales well', 'Popular choice'],
          difficulty: 'Medium',
        },
        {
          value: 'none',
          label: 'No Database',
          description: 'Static data only',
          pros: ['Simplest option', 'No setup', 'Perfect for simple sites'],
          difficulty: 'Easy',
        },
      ],
    },
    hosting: {
      title: 'Hosting Platform',
      description: 'Where your app lives online',
      options: [
        {
          value: 'vercel',
          label: 'Vercel',
          description: 'Modern deployment platform',
          pros: ['Git integration', 'Auto deploy', 'Free tier'],
          difficulty: 'Easy',
        },
        {
          value: 'netlify',
          label: 'Netlify',
          description: 'Web app hosting',
          pros: ['Easy setup', 'Free tier', 'Great for static'],
          difficulty: 'Easy',
        },
        {
          value: 'aws',
          label: 'AWS',
          description: 'Amazon cloud services',
          pros: ['Highly scalable', 'Full control', 'Industry standard'],
          difficulty: 'Hard',
        },
        {
          value: 'heroku',
          label: 'Heroku',
          description: 'Simple app hosting',
          pros: ['Easy deployment', 'Good for beginners', 'Add-ons available'],
          difficulty: 'Easy',
        },
      ],
    },
  });

  const getRecommendations = async () => {
    setLoading(true);
    try {
      const prompt = `Based on this project: Type: ${projectType}, Name: "${projectName}", Description: "${description}", Features: ${features.join(', ')}. 

Recommend the best technology stack and explain why each choice is ideal for this specific project. Consider the project complexity, features needed, and ease of use for a non-technical person.

Please provide:
1. A brief explanation of why this stack works well
2. Specific recommendations for: Frontend, Backend, Database, Hosting
3. Keep explanations simple and focus on benefits

Format your response as explanatory text, not a list.`;

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
                'You are a tech consultant helping non-technical people choose the right technology stack. Explain choices in simple terms focusing on benefits and why they work well together.',
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
        setAiRecommendations(data.choices[0]?.message?.content || '');

        // Generate recommended stack based on project type and features
        const recommended = generateRecommendedStack(projectType, features);
        setRecommendedStack(recommended);

        // Auto-select recommendations if nothing is selected yet
        if (
          !techStack.frontend &&
          !techStack.backend &&
          !techStack.database &&
          !techStack.hosting
        ) {
          onUpdate(recommended);
        }
      }
    } catch (error) {
      console.error('Error getting tech stack recommendations:', error);
    }
    setLoading(false);
  };

  const generateRecommendedStack = (type: string, projectFeatures: string[]) => {
    const hasAuth = projectFeatures.some(
      (f) =>
        f.toLowerCase().includes('auth') ||
        f.toLowerCase().includes('login') ||
        f.toLowerCase().includes('user')
    );
    const hasDatabase = projectFeatures.some(
      (f) =>
        f.toLowerCase().includes('data') ||
        f.toLowerCase().includes('store') ||
        f.toLowerCase().includes('save')
    );
    const isComplex = projectFeatures.length > 5;

    let recommended: any = {};

    // Get first option from each category as default recommendation
    Object.keys(techOptions).forEach((category) => {
      if (techOptions[category]?.options?.length > 0) {
        recommended[category] = techOptions[category].options[0].value;
      }
    });

    // Smart recommendations based on project type and features
    if (type === 'mobile-app') {
      recommended.frontend = 'react-native'; // Cross-platform is usually preferred
      recommended.backend = hasAuth || hasDatabase ? 'firebase' : 'firebase';
      recommended.database = hasDatabase ? 'firebase-firestore' : 'firebase-firestore';
      recommended.hosting = 'app-stores';
    } else if (type === 'game') {
      recommended.frontend = 'phaser'; // Good for beginners
      recommended.backend = hasAuth || hasDatabase ? 'firebase' : 'none';
      recommended.database = hasAuth || hasDatabase ? 'firebase' : 'local';
      recommended.hosting = 'web'; // Web games are easiest to start
    } else {
      // Web-based projects
      if (type === 'website' && !isComplex) {
        recommended.frontend =
          techOptions.frontend?.options?.find((opt: any) => opt.value === 'vanilla')?.value ||
          techOptions.frontend?.options?.[0]?.value;
      } else {
        recommended.frontend =
          techOptions.frontend?.options?.find((opt: any) => opt.value === 'react')?.value ||
          techOptions.frontend?.options?.[0]?.value;
      }

      if (hasAuth || hasDatabase || isComplex) {
        recommended.backend =
          techOptions.backend?.options?.find((opt: any) => opt.value === 'node')?.value ||
          techOptions.backend?.options?.[0]?.value;
      } else {
        recommended.backend =
          techOptions.backend?.options?.find((opt: any) => opt.value === 'none')?.value ||
          techOptions.backend?.options?.[0]?.value;
      }

      if (hasAuth || hasDatabase) {
        recommended.database =
          techOptions.database?.options?.find((opt: any) => opt.value === 'supabase')?.value ||
          techOptions.database?.options?.[0]?.value;
      } else {
        recommended.database =
          techOptions.database?.options?.find((opt: any) => opt.value === 'none')?.value ||
          techOptions.database?.options?.[0]?.value;
      }

      // Hosting recommendation for web apps
      if (techOptions.hosting) {
        recommended.hosting =
          techOptions.hosting?.options?.find((opt: any) => opt.value === 'vercel')?.value ||
          techOptions.hosting?.options?.[0]?.value;
      }
    }

    return recommended;
  };

  const updateTechStack = (category: string, value: string) => {
    onUpdate({
      ...techStack,
      [category]: value,
    });
  };

  const toggleShowAllOptions = (category: string) => {
    setShowAllOptions((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const isRecommended = (category: string, value: string) => {
    return recommendedStack[category] === value;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'text-green-600 bg-green-100';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'Hard':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // Check if all categories that have options have been selected
  const allSelected = Object.keys(techOptions).every((category) => {
    return techStack[category] && techStack[category] !== '';
  });

  if (loadingOptions) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Choose Your Technology Stack
          </h2>
          <p className="text-gray-300">
            Generating technology options tailored for your {projectType}...
          </p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
          Choose Your Technology Stack
        </h2>
        <p className="text-gray-300">
          We've generated technology options specifically for your {projectType}
        </p>
      </div>

      {/* AI Recommendations */}
      {aiRecommendations && (
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Sparkles className="w-5 h-5 text-blue-500 mr-2" />
            <h3 className="text-lg font-semibold text-white">
              AI Recommendations for Your Project
            </h3>
          </div>
          <AIResponse content={aiRecommendations} loading={loading} />
        </div>
      )}

      {/* Tech Stack Categories */}
      <div className="space-y-8">
        {Object.entries(techOptions).map(([category, categoryData]: [string, any]) => {
          const visibleOptions = showAllOptions[category]
            ? categoryData.options
            : categoryData.options.slice(0, 2);

          return (
            <div
              key={category}
              className="bg-gradient-to-br from-gray-800 to-purple-900/30 rounded-xl border border-purple-500/20 p-6 backdrop-blur-sm"
            >
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white mb-2">{categoryData.title}</h3>
                <p className="text-gray-300 text-sm">{categoryData.description}</p>
              </div>

              <div className="grid gap-4">
                {visibleOptions.map((option: any) => (
                  <button
                    key={option.value}
                    onClick={() => updateTechStack(category, option.value)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 text-left relative ${
                      techStack[category] === option.value
                        ? 'border-purple-500 bg-gradient-to-br from-purple-500/10 to-pink-500/10'
                        : 'border-gray-600 bg-gray-800/50 hover:border-purple-500/50 hover:shadow-sm'
                    }`}
                  >
                    {/* Recommended Badge */}
                    {isRecommended(category, option.value) && (
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Recommended
                      </div>
                    )}

                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h4
                            className={`font-semibold mr-3 ${
                              techStack[category] === option.value ? 'text-white' : 'text-gray-200'
                            }`}
                          >
                            {option.label}
                          </h4>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(option.difficulty)}`}
                          >
                            {option.difficulty}
                          </span>
                        </div>
                        <p
                          className={`text-sm mb-3 ${
                            techStack[category] === option.value ? 'text-gray-200' : 'text-gray-400'
                          }`}
                        >
                          {option.description}
                        </p>

                        {/* Pros */}
                        <div className="flex flex-wrap gap-1">
                          {option.pros.map((pro: string, index: number) => (
                            <span
                              key={index}
                              className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-md"
                            >
                              {pro}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Selection Indicator */}
                      {techStack[category] === option.value && (
                        <div className="ml-4 flex-shrink-0">
                          <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Show More/Less Options */}
              {categoryData.options.length > 2 && (
                <button
                  onClick={() => toggleShowAllOptions(category)}
                  className="mt-4 w-full py-2 text-purple-400 hover:text-purple-300 text-sm font-medium flex items-center justify-center transition-colors"
                >
                  {showAllOptions[category] ? (
                    <>
                      <ChevronUp className="w-4 h-4 mr-1" />
                      Show Less Options
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4 mr-1" />
                      Show More Options ({categoryData.options.length - 2} more)
                    </>
                  )}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Help Text */}
      <div className="mt-8 bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-purple-400 mr-3 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-purple-200">
            <p className="font-medium mb-1">Don't worry about making the "perfect" choice!</p>
            <p>
              These technologies can often be changed later. Our recommendations are based on your
              project's specific needs, but you can always adjust as you learn more.
            </p>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      {allSelected && (
        <div className="flex justify-center gap-4 pt-8">
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
            Continue to Testing Strategy
          </button>
        </div>
      )}
    </div>
  );
};
