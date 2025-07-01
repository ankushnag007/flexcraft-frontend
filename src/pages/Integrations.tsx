import React, { useState } from 'react';
import { 
  Search, Settings, ChevronDown, ChevronRight, 
  Zap, Plus, Check, X, ArrowRight, Link, 
  Lock, Globe, Server, Database, Code, 
  Bell, Mail, Calendar, Clock, CreditCard,
  MessageSquare, FileText, BarChart2, Users,
  Grid, List, Box, Cloud, Cpu, Shield
} from 'lucide-react';
import logo from '../Assets/videos/images/logo.png'
const IntegrationCard = ({ icon, title, description, category, installed, popular }) => {
  const IconComponent = icon;
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start">
        <div className="p-3 bg-blue-50 rounded-lg mr-4">
          <IconComponent className="w-6 h-6 text-blue-600" />
        </div>
        <div className="flex-1">
          <div className="flex justify-between">
            <h3 className="font-medium">{title}</h3>
            {popular && (
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Popular</span>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
          <div className="flex items-center mt-3">
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded mr-2">{category}</span>
            {installed ? (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded flex items-center">
                <Check className="w-3 h-3 mr-1" /> Installed
              </span>
            ) : (
              <button className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 flex items-center">
                Add <ArrowRight className="w-3 h-3 ml-1" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const IntegrationCategory = ({ name, icon, openByDefault }) => {
  const [isOpen, setIsOpen] = useState(openByDefault);
  const IconComponent = icon;
  
  return (
    <div className="mb-6">
      <div 
        className="flex items-center cursor-pointer mb-3"
        onClick={() => setIsOpen(!isOpen)}
      >
        <IconComponent className="w-5 h-5 mr-2 text-gray-500" />
        <h2 className="font-semibold">{name}</h2>
        {isOpen ? (
          <ChevronDown className="w-5 h-5 ml-auto text-gray-400" />
        ) : (
          <ChevronRight className="w-5 h-5 ml-auto text-gray-400" />
        )}
      </div>
      
      {isOpen && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <IntegrationCard 
            icon={Zap} 
            title="Slack" 
            description="Connect FlexCraft with Slack for real-time notifications" 
            category="Communication" 
            installed={true}
            popular={true}
          />
          <IntegrationCard 
            icon={Mail} 
            title="Microsoft Teams" 
            description="Get FlexCraft updates in your Teams channels" 
            category="Communication" 
            installed={false}
            popular={true}
          />
          <IntegrationCard 
            icon={Database} 
            title="Google Drive" 
            description="Store and access FlexCraft files in Google Drive" 
            category="Storage" 
            installed={false}
          />
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
    { id: 'all', name: 'All Integrations' },
    { id: 'installed', name: 'Installed' },
    { id: 'popular', name: 'Popular' },
    { id: 'developers', name: 'Developer Tools' }
  ];

  const categories = [
    { id: 'communication', name: 'Communication', icon: MessageSquare, open: true },
    { id: 'productivity', name: 'Productivity', icon: FileText, open: true },
    { id: 'analytics', name: 'Analytics', icon: BarChart2, open: false },
    { id: 'collaboration', name: 'Collaboration', icon: Users, open: false },
    { id: 'developer', name: 'Developer Tools', icon: Code, open: false },
    { id: 'security', name: 'Security', icon: Shield, open: false }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-baseline gap-3">  {/* Changed to items-baseline */}
  <h1 className="text-3xl font-bold">Integrations</h1>
</div>
      <div className="mt-3 mb-4">
        <p className="text-gray-600">
          Connect FlexCraft with your favorite tools to automate workflows and enhance productivity
        </p>
      </div>

      {/* Search and Tabs */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search integrations..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setShowCustomIntegrationModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Custom Integration
          </button>
        </div>

        <div className="flex overflow-x-auto pb-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`px-4 py-2 whitespace-nowrap ${activeTab === tab.id ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-500'}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* Integration Categories */}
      <div className="space-y-8">
        <IntegrationCategory 
          name="Communication" 
          icon={MessageSquare} 
          openByDefault={true} 
        />
        
        <IntegrationCategory 
          name="Productivity" 
          icon={FileText} 
          openByDefault={true} 
        />
        
        <IntegrationCategory 
          name="Developer Tools" 
          icon={Code} 
          openByDefault={false} 
        />
        
        <IntegrationCategory 
          name="Security" 
          icon={Shield} 
          openByDefault={false} 
        />
      </div>

      {/* API Documentation Section */}
      <div className="mt-12 border-t pt-8">
        <h2 className="text-2xl font-bold mb-4">Developer Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <Code className="w-6 h-6 text-blue-600 mr-3" />
              <h3 className="font-medium">API Documentation</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Explore our comprehensive API documentation to build custom integrations with FlexCraft.
            </p>
            <button className="text-blue-600 hover:text-blue-800 flex items-center">
              View Documentation <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
          
          <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <Box className="w-6 h-6 text-green-600 mr-3" />
              <h3 className="font-medium">Webhooks</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Set up webhooks to receive real-time notifications from FlexCraft.
            </p>
            <button className="text-blue-600 hover:text-blue-800 flex items-center">
              Configure Webhooks <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
          
          <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <Shield className="w-6 h-6 text-purple-600 mr-3" />
              <h3 className="font-medium">OAuth 2.0</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Implement secure authentication for your FlexCraft integrations using OAuth 2.0.
            </p>
            <button className="text-blue-600 hover:text-blue-800 flex items-center">
              Learn About OAuth <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </div>

      {/* Custom Integration Modal */}
      {showCustomIntegrationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Create Custom Integration</h2>
                <button 
                  onClick={() => setShowCustomIntegrationModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Integration Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="My Custom Integration"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="What does this integration do?"
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                  <div className="relative">
                    <input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                      placeholder="sk_test_... or similar"
                    />
                    <button 
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      onClick={() => {}}
                    >
                      <Lock className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Keep your API keys secure. Don't share them publicly.
                  </p>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button 
                    onClick={() => setShowCustomIntegrationModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button 
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Create Integration
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IntegrationsPage;