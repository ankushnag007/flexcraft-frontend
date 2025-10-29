
"use client";
import { useState } from 'react';
import {
  Settings,
  GitBranch,
  Globe,
  Lock,
  Server,
  CreditCard,
  Clock,
  UploadCloud,
  GitPullRequest,
  Cpu,
  Zap,
  Box,
  Layers,
  Code,
  Database,
  Network,
  HardDrive,
  Cloud,
  CloudRain,
  CloudSun,
  CloudSnow,
  ChevronDown,
  ChevronRight,
  Plus,
  Minus,
  AlertCircle,
  CheckCircle,
  XCircle,
  Activity,
  BarChart3,
  Eye,
  Play,
  Pause,
  RefreshCw,
  Terminal,
  Shield,
  Mail,
  Webhook,
  Calendar
} from 'lucide-react';

const ModernDeploymentDashboard = () => {
  const [selectedTab, setSelectedTab] = useState('deployment');
  const [framework, setFramework] = useState('nextjs');
  const [branch, setBranch] = useState('main');
  const [autoDeploy, setAutoDeploy] = useState(true);
  const [previewDeploy, setPreviewDeploy] = useState(true);
  const [serverless, setServerless] = useState(true);
  const [edgeFunctions, setEdgeFunctions] = useState(false);
  const [cloudProvider, setCloudProvider] = useState('aws');
  const [useDocker, setUseDocker] = useState(false);
  const [useKubernetes, setUseKubernetes] = useState(false);
  const [infraAsCode, setInfraAsCode] = useState('terraform');

  type SectionKey = 'git' | 'build' | 'triggers' | 'cloud' | 'containers' | 'monitoring' | 'networking';

  const [expandedSections, setExpandedSections] = useState<Record<SectionKey, boolean>>({
    git: true,
    build: true,
    triggers: true,
    cloud: true,
    containers: false,
    monitoring: false,
    networking: false
  });

  const toggleSection = (section: SectionKey) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const cloudProviders = [
    { id: 'aws', name: 'AWS', icon: <CloudSun className="w-5 h-5" />, color: 'from-orange-400 to-orange-600' },
    { id: 'azure', name: 'Azure', icon: <CloudRain className="w-5 h-5" />, color: 'from-blue-400 to-blue-600' },
    { id: 'gcp', name: 'Google Cloud', icon: <CloudSnow className="w-5 h-5" />, color: 'from-green-400 to-green-600' },
    { id: 'vercel', name: 'Vercel', icon: <Cloud className="w-5 h-5" />, color: 'from-gray-800 to-gray-900' },
  ];

  const deploymentStats = [
    { label: 'Total Deploys', value: '247', change: '+12%', icon: <UploadCloud className="w-5 h-5" /> },
    { label: 'Success Rate', value: '98.7%', change: '+0.3%', icon: <CheckCircle className="w-5 h-5" /> },
    { label: 'Avg Deploy Time', value: '2.3m', change: '-15%', icon: <Clock className="w-5 h-5" /> },
    { label: 'Active Builds', value: '3', change: 'stable', icon: <Activity className="w-5 h-5" /> },
  ];

  const recentDeployments = [
    { id: 1, commit: 'feat: add user dashboard', status: 'success', time: '2 min ago', branch: 'main' },
    { id: 2, commit: 'fix: resolve authentication bug', status: 'success', time: '1 hour ago', branch: 'main' },
    { id: 3, commit: 'update: dependencies upgrade', status: 'failed', time: '3 hours ago', branch: 'develop' },
    { id: 4, commit: 'feature: payment integration', status: 'success', time: '1 day ago', branch: 'feature/payments' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4" />;
      case 'failed': return <XCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Enhanced Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Cloud className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    CloudDeploy Pro
                  </h1>
                  <p className="text-sm text-slate-500">Advanced deployment platform</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 bg-slate-100 rounded-lg p-1">
                <select className="bg-transparent border-none text-sm font-medium focus:outline-none cursor-pointer">
                  <option>my-nextjs-app</option>
                  <option>my-react-app</option>
                  <option>my-vue-app</option>
                </select>
              </div>
              
              <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
                <Plus className="w-4 h-4" />
                <span>New Project</span>
              </button>
            </div>
          </div>
          
          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {deploymentStats.map((stat, index) => (
              <div key={index} className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200 hover:shadow-lg transition-all duration-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg">
                    {stat.icon}
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    stat.change.startsWith('+') ? 'text-green-700 bg-green-100' : 
                    stat.change.startsWith('-') ? 'text-red-700 bg-red-100' : 
                    'text-slate-700 bg-slate-100'
                  }`}>
                    {stat.change}
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  <p className="text-sm text-slate-600">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Enhanced Sidebar */}
        <nav className="w-72 bg-white/70 backdrop-blur-lg border-r border-slate-200 p-6">
          <div className="space-y-2">
            {[
              { id: 'deployment', label: 'Deployment', icon: UploadCloud },
              { id: 'cloud', label: 'Cloud Provider', icon: Cloud },
              { id: 'containers', label: 'Containers', icon: Box },
              { id: 'domains', label: 'Domains & CDN', icon: Globe },
              { id: 'security', label: 'Security', icon: Lock },
              { id: 'functions', label: 'Functions', icon: Server },
              { id: 'database', label: 'Database', icon: Database },
              { id: 'iac', label: 'Infrastructure', icon: Code },
              { id: 'billing', label: 'Monitoring', icon: BarChart3 },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = selectedTab === item.id;
              
              return (
                <button
                  key={item.id}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105' 
                      : 'text-slate-700 hover:bg-slate-100 hover:scale-102'
                  }`}
                  onClick={() => setSelectedTab(item.id)}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Recent Deployments */}
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Recent Deployments</h3>
            <div className="space-y-3">
              {recentDeployments.slice(0, 4).map((deploy) => (
                <div key={deploy.id} className="flex items-center space-x-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                  <div className={`p-1.5 rounded-full ${getStatusColor(deploy.status)}`}>
                    {getStatusIcon(deploy.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-900 truncate">{deploy.commit}</p>
                    <p className="text-xs text-slate-500">{deploy.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <div className="flex-1 p-6">
          {selectedTab === 'deployment' && (
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-slate-200 p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Deployment Configuration</h2>
                  <p className="text-slate-600">Configure your deployment pipeline and build settings</p>
                </div>
                <div className="flex space-x-3">
                  <button className="flex items-center space-x-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">
                    <Terminal className="w-4 h-4" />
                    <span>View Logs</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:scale-105 shadow-lg">
                    <Play className="w-4 h-4" />
                    <span>Deploy Now</span>
                  </button>
                </div>
              </div>

              {/* Git Integration */}
              <div className="mb-8">
                <div 
                  className="flex items-center justify-between cursor-pointer p-4 rounded-xl border border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100 hover:shadow-md transition-all"
                  onClick={() => toggleSection('git')}
                >
                  <div className="flex items-center space-x-3">
                    {expandedSections.git ? <ChevronDown className="w-5 h-5 text-slate-500" /> : <ChevronRight className="w-5 h-5 text-slate-500" />}
                    <div className="p-2 bg-gradient-to-br from-orange-100 to-red-100 rounded-lg">
                      <GitBranch className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">Git Integration</h3>
                      <p className="text-sm text-slate-600">Connected to GitHub</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-green-700">Connected</span>
                  </div>
                </div>
                
                {expandedSections.git && (
                  <div className="mt-4 p-6 bg-slate-50 rounded-xl space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-3">Repository</label>
                        <div className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-slate-200">
                          <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                            <GitBranch className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">username/my-nextjs-app</p>
                            <p className="text-sm text-slate-500">github.com</p>
                          </div>
                          <button className="ml-auto text-blue-600 hover:text-blue-700 text-sm font-medium">Change</button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-3">Production Branch</label>
                        <select
                          className="w-full p-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          value={branch}
                          onChange={(e) => setBranch(e.target.value)}
                        >
                          <option value="main">main</option>
                          <option value="master">master</option>
                          <option value="production">production</option>
                          <option value="develop">develop</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Build Settings */}
              <div className="mb-8">
                <div 
                  className="flex items-center justify-between cursor-pointer p-4 rounded-xl border border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100 hover:shadow-md transition-all"
                  onClick={() => toggleSection('build')}
                >
                  <div className="flex items-center space-x-3">
                    {expandedSections.build ? <ChevronDown className="w-5 h-5 text-slate-500" /> : <ChevronRight className="w-5 h-5 text-slate-500" />}
                    <div className="p-2 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg">
                      <Code className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">Build Configuration</h3>
                      <p className="text-sm text-slate-600">Next.js preset configured</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">Auto-detected</span>
                </div>
                
                {expandedSections.build && (
                  <div className="mt-4 p-6 bg-slate-50 rounded-xl space-y-6">
                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-3">Framework</label>
                        <select 
                          className="w-full p-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={framework} 
                          onChange={(e) => setFramework(e.target.value)}
                        >
                          <option value="nextjs">Next.js</option>
                          <option value="react">React</option>
                          <option value="vue">Vue.js</option>
                          <option value="astro">Astro</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-3">Node Version</label>
                        <select className="w-full p-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option value="18">Node 18 LTS</option>
                          <option value="20">Node 20 LTS</option>
                          <option value="16">Node 16</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-3">Build Command</label>
                        <input
                          type="text"
                          className="w-full p-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value="npm run build"
                          readOnly
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-3">Environment Variables</label>
                      <div className="space-y-3">
                        <div className="flex space-x-3">
                          <input
                            type="text"
                            placeholder="Variable name"
                            className="flex-1 p-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <input
                            type="text"
                            placeholder="Value"
                            className="flex-1 p-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <button className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        
                        {/* Example env vars */}
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                          <div className="flex space-x-4">
                            <span className="font-medium text-slate-900">NEXT_PUBLIC_API_URL</span>
                            <span className="text-slate-500">https://api.example.com</span>
                          </div>
                          <button className="text-red-500 hover:text-red-700">
                            <Minus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Deployment Triggers */}
              <div className="mb-8">
                <div 
                  className="flex items-center justify-between cursor-pointer p-4 rounded-xl border border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100 hover:shadow-md transition-all"
                  onClick={() => toggleSection('triggers')}
                >
                  <div className="flex items-center space-x-3">
                    {expandedSections.triggers ? <ChevronDown className="w-5 h-5 text-slate-500" /> : <ChevronRight className="w-5 h-5 text-slate-500" />}
                    <div className="p-2 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-lg">
                      <Zap className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">Deployment Triggers</h3>
                      <p className="text-sm text-slate-600">2 active triggers configured</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Active</span>
                </div>
                
                {expandedSections.triggers && (
                  <div className="mt-4 p-6 bg-slate-50 rounded-xl space-y-4">
                    {[
                      { id: 'auto-deploy', label: 'Auto-deploy on push', icon: GitBranch, checked: autoDeploy, onChange: setAutoDeploy },
                      { id: 'preview-deploy', label: 'Preview deployments for PRs', icon: GitPullRequest, checked: previewDeploy, onChange: setPreviewDeploy },
                      { id: 'scheduled-deploy', label: 'Scheduled deployments', icon: Calendar, checked: false, onChange: () => {} },
                    ].map((trigger) => (
                      <div key={trigger.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200">
                        <div className="flex items-center space-x-3">
                          <trigger.icon className="w-5 h-5 text-slate-600" />
                          <span className="font-medium text-slate-900">{trigger.label}</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={trigger.checked}
                            onChange={(e) => trigger.onChange(e.target.checked)}
                          />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-6 border-t border-slate-200">
                <button className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg">
                  <CheckCircle className="w-4 h-4" />
                  <span>Save Configuration</span>
                </button>
                <button className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:scale-105 shadow-lg">
                  <Play className="w-4 h-4" />
                  <span>Deploy Now</span>
                </button>
                <button className="flex items-center space-x-2 px-6 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">
                  <Eye className="w-4 h-4" />
                  <span>Preview Build</span>
                </button>
              </div>
            </div>
          )}

          {selectedTab === 'cloud' && (
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-slate-200 p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Cloud Provider</h2>
                <p className="text-slate-600">Choose and configure your preferred cloud infrastructure</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {cloudProviders.map((provider) => (
                  <div 
                    key={provider.id}
                    className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                      cloudProvider === provider.id 
                        ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 shadow-xl' 
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-lg'
                    }`}
                    onClick={() => setCloudProvider(provider.id)}
                  >
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${provider.color} rounded-xl flex items-center justify-center text-white`}>
                        {provider.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">{provider.name}</h3>
                        <p className="text-sm text-slate-500 mt-1">Enterprise ready</p>
                      </div>
                    </div>
                    {cloudProvider === provider.id && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {cloudProvider && (
                <div className="bg-slate-50 rounded-xl p-6">
                  <h3 className="font-semibold text-slate-900 mb-4">
                    {cloudProviders.find(p => p.id === cloudProvider)?.name} Configuration
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-3">Region</label>
                      <select className="w-full p-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option>us-east-1 (Virginia)</option>
                        <option>us-west-2 (Oregon)</option>
                        <option>eu-west-1 (Ireland)</option>
                        <option>ap-southeast-1 (Singapore)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-3">Instance Type</label>
                      <select className="w-full p-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option>t3.micro (1 vCPU, 1GB RAM)</option>
                        <option>t3.small (1 vCPU, 2GB RAM)</option>
                        <option>t3.medium (2 vCPU, 4GB RAM)</option>
                        <option>t3.large (2 vCPU, 8GB RAM)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {selectedTab === 'functions' && (
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-slate-200 p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Serverless Functions</h2>
                <p className="text-slate-600">Configure your serverless function settings</p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg">
                      <Server className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">Serverless Functions</h3>
                      <p className="text-sm text-slate-600">Enable serverless computing</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={serverless}
                      onChange={(e) => setServerless(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-lg">
                      <Zap className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">Edge Functions</h3>
                      <p className="text-sm text-slate-600">Deploy functions at the edge</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={edgeFunctions}
                      onChange={(e) => setEdgeFunctions(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {serverless && (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-3">Memory Allocation</label>
                      <select className="w-full p-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="128">128 MB</option>
                        <option value="256">256 MB</option>
                        <option value="512">512 MB</option>
                        <option value="1024">1024 MB</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-3">Timeout</label>
                      <select className="w-full p-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="5">5 seconds</option>
                        <option value="10">10 seconds</option>
                        <option value="30">30 seconds</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {selectedTab === 'security' && (
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-slate-200 p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Security Settings</h2>
                <p className="text-slate-600">Configure security policies and access controls</p>
              </div>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-6 bg-slate-50 rounded-xl">
                    <h3 className="font-semibold text-slate-900 mb-4">SSL/TLS</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Force HTTPS</span>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-xl">
                    <h3 className="font-semibold text-slate-900 mb-4">Security Headers</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">HSTS Enabled</span>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'database' && (
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-slate-200 p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Database Configuration</h2>
                <p className="text-slate-600">Set up and manage your database connections</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { name: 'PostgreSQL', icon: '🐘', active: true },
                  { name: 'MongoDB', icon: '🍃', active: false },
                  { name: 'Redis', icon: '📦', active: false },
                ].map((db) => (
                  <div key={db.name} className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${db.active ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'}`}>
                    <div className="text-center">
                      <div className="text-3xl mb-2">{db.icon}</div>
                      <h3 className="font-semibold text-slate-900">{db.name}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedTab === 'billing' && (
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-slate-200 p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Monitoring & Analytics</h2>
                <p className="text-slate-600">Track performance and monitor your deployments</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                  <div className="flex items-center justify-between mb-4">
                    <Activity className="w-8 h-8 text-green-600" />
                    <span className="text-2xl font-bold text-green-700">99.9%</span>
                  </div>
                  <h3 className="font-semibold text-slate-900">Uptime</h3>
                  <p className="text-sm text-slate-600">Last 30 days</p>
                </div>

                <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                  <div className="flex items-center justify-between mb-4">
                    <BarChart3 className="w-8 h-8 text-blue-600" />
                    <span className="text-2xl font-bold text-blue-700">1.2K</span>
                  </div>
                  <h3 className="font-semibold text-slate-900">Requests</h3>
                  <p className="text-sm text-slate-600">Per minute</p>
                </div>

                <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                  <div className="flex items-center justify-between mb-4">
                    <Cpu className="w-8 h-8 text-purple-600" />
                    <span className="text-2xl font-bold text-purple-700">24%</span>
                  </div>
                  <h3 className="font-semibold text-slate-900">CPU Usage</h3>
                  <p className="text-sm text-slate-600">Average</p>
                </div>

                <div className="p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-200">
                  <div className="flex items-center justify-between mb-4">
                    <Clock className="w-8 h-8 text-orange-600" />
                    <span className="text-2xl font-bold text-orange-700">245ms</span>
                  </div>
                  <h3 className="font-semibold text-slate-900">Response Time</h3>
                  <p className="text-sm text-slate-600">Average</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Footer */}
      <footer className="bg-white/70 backdrop-blur-lg border-t border-slate-200 px-6 py-4">
        <div className="flex flex-wrap items-center justify-between text-sm text-slate-600">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Last deploy: 2 hours ago</span>
            </div>
            <div className="flex items-center space-x-2">
              <GitBranch className="w-4 h-4" />
              <span>main@a1b2c3d</span>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>All systems operational</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4" />
              <span>my-app.example.com</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ModernDeploymentDashboard