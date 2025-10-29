"use client"
import React, { useState } from 'react';
import { 
  Search, Settings, ChevronDown, ChevronRight, 
  Zap, Plus, Check, X, ArrowRight, Link, 
  Lock, Globe, Server, Database, Code, 
  Bell, Mail, Calendar, Clock, CreditCard,
  MessageSquare, FileText, BarChart2, Users,
  Grid, List, Box, Cloud, Cpu, Shield, Star,
  Sparkles, Layers, GitBranch, Webhook
} from 'lucide-react';

type IntegrationCardProps = {
  icon: React.ElementType;
  title: string;
  description: string;
  category: string;
  installed?: boolean;
  popular?: boolean;
  color?: string;
};

const IntegrationCard = ({
  icon,
  title,
  description,
  category,
  installed,
  popular,
  color = "blue",
}: IntegrationCardProps) => {
  const IconComponent = icon;
  const [isHovered, setIsHovered] = useState(false);
  
  const colorClasses = {
    blue: { bg: "from-blue-500/10 to-blue-600/10 border-blue-200/50", text: "text-blue-600" },
    purple: { bg: "from-purple-500/10 to-purple-600/10 border-purple-200/50", text: "text-purple-600" },
    green: { bg: "from-green-500/10 to-green-600/10 border-green-200/50", text: "text-green-600" },
    orange: { bg: "from-orange-500/10 to-orange-600/10 border-orange-200/50", text: "text-orange-600" },
    pink: { bg: "from-pink-500/10 to-pink-600/10 border-pink-200/50", text: "text-pink-600" },
    indigo: { bg: "from-indigo-500/10 to-indigo-600/10 border-indigo-200/50", text: "text-indigo-600" },
    gray: { bg: "from-gray-500/10 to-gray-600/10 border-gray-200/50", text: "text-gray-600" }
  };
  
  const currentColor = colorClasses[color] || colorClasses.blue;
  
  return (
    <div 
      className={`group relative bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 
        hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 hover:-translate-y-1
        ${isHovered ? 'bg-white/80' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient overlay on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${currentColor.bg} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      
      <div className="relative z-10 flex items-start">
        <div className={`p-4 bg-gradient-to-br ${currentColor.bg} border rounded-xl mr-5 group-hover:scale-110 transition-transform duration-300`}>
          <IconComponent className={`w-6 h-6 ${currentColor.text}`} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-gray-900 text-lg group-hover:text-gray-800 transition-colors">
              {title}
            </h3>
            {popular && (
              <div className="flex items-center gap-1 text-xs bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full font-medium">
                <Star className="w-3 h-3" />
                Popular
              </div>
            )}
          </div>
          
          <p className="text-gray-600 text-sm leading-relaxed mb-4">{description}</p>
          
          <div className="flex items-center justify-between">
            <span className="text-xs bg-gray-100/80 text-gray-700 px-3 py-1.5 rounded-lg font-medium">
              {category}
            </span>
            
            {installed ? (
              <div className="flex items-center text-xs bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg font-medium">
                <Check className="w-3 h-3 mr-1.5" />
                Installed
              </div>
            ) : (
              <button className="group/btn flex items-center text-xs bg-gradient-to-r from-gray-900 to-gray-700 hover:from-gray-800 hover:to-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:scale-105">
                Add Integration
                <ArrowRight className="w-3 h-3 ml-2 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

type IntegrationCategoryProps = {
  name: string;
  icon: React.ElementType;
  openByDefault: boolean;
  color?: string;
};

const IntegrationCategory = ({ name, icon, openByDefault, color = "gray" }: IntegrationCategoryProps) => {
  const [isOpen, setIsOpen] = useState(openByDefault);
  const IconComponent = icon;
  
  const integrations = {
    Communication: [
      { icon: Zap, title: "Slack", description: "Real-time team communication and notifications", category: "Communication", installed: true, popular: true, color: "purple" },
      { icon: Mail, title: "Microsoft Teams", description: "Enterprise collaboration and video conferencing", category: "Communication", installed: false, popular: true, color: "blue" },
      { icon: MessageSquare, title: "Discord", description: "Community and team chat platform", category: "Communication", installed: false, color: "indigo" }
    ],
    Productivity: [
      { icon: Database, title: "Google Drive", description: "Cloud storage and file synchronization", category: "Storage", installed: false, popular: true, color: "green" },
      { icon: Calendar, title: "Google Calendar", description: "Schedule and event management integration", category: "Productivity", installed: true, color: "blue" },
      { icon: FileText, title: "Notion", description: "All-in-one workspace for notes and docs", category: "Productivity", installed: false, color: "gray" }
    ],
    "Developer Tools": [
      { icon: GitBranch, title: "GitHub", description: "Version control and code collaboration", category: "Development", installed: true, popular: true, color: "gray" },
      { icon: Server, title: "Vercel", description: "Frontend deployment and hosting platform", category: "Development", installed: false, color: "blue" },
      { icon: Code, title: "VS Code", description: "Integrate with Visual Studio Code editor", category: "Development", installed: false, color: "indigo" }
    ],
    Security: [
      { icon: Shield, title: "Auth0", description: "Identity and access management platform", category: "Security", installed: false, popular: true, color: "orange" },
      { icon: Lock, title: "1Password", description: "Password management and secure storage", category: "Security", installed: false, color: "blue" },
      { icon: Globe, title: "Cloudflare", description: "Web security and performance optimization", category: "Security", installed: true, color: "orange" }
    ]
  };
  
  return (
    <div className="mb-10">
      <div 
        className="flex items-center cursor-pointer mb-6 group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="p-2 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mr-3 group-hover:from-gray-200 group-hover:to-gray-300 transition-all duration-300">
          <IconComponent className="w-5 h-5 text-gray-700" />
        </div>
        <h2 className="font-bold text-xl text-gray-900 group-hover:text-gray-700 transition-colors">{name}</h2>
        <div className="ml-auto">
          {isOpen ? (
            <ChevronDown className="w-5 h-5 text-gray-500 group-hover:text-gray-700 transition-all duration-300" />
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-gray-700 transition-all duration-300" />
          )}
        </div>
      </div>
      
      {isOpen && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in slide-in-from-top-4 duration-500">
          {integrations[name]?.map((integration, index) => (
            <IntegrationCard key={integration.title} {...integration} />
          ))}
        </div>
      )}
    </div>
  );
};

const IntegrationsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showCustomIntegrationModal, setShowCustomIntegrationModal] = useState(false);
  const [apiKey, setApiKey] = useState('');

  const tabs = [
    { id: 'all', name: 'All Integrations', count: 127 },
    { id: 'installed', name: 'Installed', count: 12 },
    { id: 'popular', name: 'Popular', count: 24 },
    { id: 'developers', name: 'Developer Tools', count: 45 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.15)_1px,transparent_0)] [background-size:20px_20px] opacity-[0.02]" />
      
      <div className="relative max-w-7xl mx-auto px-6 py-12">
        {/* Hero Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200/50 px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">200+ Integrations Available</span>
          </div>
          
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-4">
            Connect Everything
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Seamlessly integrate FlexCraft with your favorite tools and automate workflows 
            to supercharge your productivity
          </p>
        </div>

        {/* Search and Actions */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
            <div className="relative flex-1 max-w-2xl">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search 200+ integrations..."
                className="w-full pl-12 pr-4 py-4 bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all duration-300 text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                <kbd className="px-2 py-1 text-xs bg-gray-100 rounded border text-gray-500">⌘K</kbd>
              </div>
            </div>
            
            <button 
              onClick={() => setShowCustomIntegrationModal(true)}
              className="group flex items-center px-6 py-4 bg-gradient-to-r from-gray-900 to-gray-700 hover:from-gray-800 hover:to-gray-600 text-white rounded-2xl font-medium transition-all duration-300 hover:shadow-2xl hover:shadow-gray-900/25 hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
              Create Custom Integration
            </button>
          </div>

          {/* Enhanced Tabs */}
          <div className="flex overflow-x-auto pb-2 gap-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`flex items-center gap-2 px-6 py-3 whitespace-nowrap rounded-xl font-medium transition-all duration-300 ${
                  activeTab === tab.id 
                    ? 'bg-white shadow-lg shadow-gray-200/50 text-gray-900 border border-gray-200/50' 
                    : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.name}
                <span className={`text-xs px-2 py-1 rounded-lg font-semibold ${
                  activeTab === tab.id 
                    ? 'bg-gray-100 text-gray-700' 
                    : 'bg-gray-200/50 text-gray-500'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Integration Categories */}
        <div className="space-y-12">
          <IntegrationCategory 
            name="Communication" 
            icon={MessageSquare} 
            openByDefault={true}
            color="blue"
          />
          
          <IntegrationCategory 
            name="Productivity" 
            icon={FileText} 
            openByDefault={true}
            color="green" 
          />
          
          <IntegrationCategory 
            name="Developer Tools" 
            icon={Code} 
            openByDefault={false}
            color="purple"
          />
          
          <IntegrationCategory 
            name="Security" 
            icon={Shield} 
            openByDefault={false}
            color="orange"
          />
        </div>

        {/* Enhanced Developer Resources */}
        <div className="mt-20 border-t border-gray-200/50 pt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Developer Resources</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Build powerful integrations with our comprehensive developer tools and documentation
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Code,
                title: "API Documentation",
                description: "Comprehensive guides and references for building with our REST API",
                color: "from-blue-500 to-blue-600",
                link: "View Documentation"
              },
              {
                icon: Webhook,
                title: "Webhooks",
                description: "Real-time event notifications to keep your integrations in sync",
                color: "from-green-500 to-green-600",
                link: "Configure Webhooks"
              },
              {
                icon: Shield,
                title: "OAuth 2.0",
                description: "Secure authentication flows for enterprise-grade integrations",
                color: "from-purple-500 to-purple-600",
                link: "Learn OAuth"
              }
            ].map((resource, index) => (
              <div key={resource.title} className="group relative bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-8 hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 hover:-translate-y-1">
                <div className={`absolute inset-0 bg-gradient-to-br ${resource.color}/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  <div className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br ${resource.color} text-white rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <resource.icon className="w-7 h-7" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{resource.title}</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">{resource.description}</p>
                  
                  <button className="group/btn inline-flex items-center text-gray-900 font-medium hover:text-gray-700 transition-colors">
                    {resource.link}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Custom Integration Modal */}
        {showCustomIntegrationModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl animate-in fade-in-0 zoom-in-95 duration-300">
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Create Custom Integration</h2>
                    <p className="text-gray-600 mt-1">Build your own integration in minutes</p>
                  </div>
                  <button 
                    onClick={() => setShowCustomIntegrationModal(false)}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">Integration Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all"
                      placeholder="My Custom Integration"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">Description</label>
                    <textarea
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all resize-none"
                      placeholder="What does this integration do?"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">API Key</label>
                    <div className="relative">
                      <input
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 pr-12 transition-all"
                        placeholder="sk_test_... or similar"
                      />
                      <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 rounded transition-colors">
                        <Lock className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      Your API keys are encrypted and stored securely
                    </p>
                  </div>
                  
                  <div className="flex justify-end space-x-4 pt-4">
                    <button 
                      onClick={() => setShowCustomIntegrationModal(false)}
                      className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-all"
                    >
                      Cancel
                    </button>
                    <button className="px-6 py-3 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-xl hover:from-gray-800 hover:to-gray-600 font-medium transition-all hover:shadow-lg">
                      Create Integration
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IntegrationsPage;