"use client"
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
  AlertCircle
} from 'lucide-react';
import AuthGuard from '@/app/components/AuthGuard';

const EnhancedDeploymentUI = () => {
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
    { id: 'aws', name: 'AWS', icon: <CloudSun className="w-4 h-4 mr-2" /> },
    { id: 'azure', name: 'Microsoft Azure', icon: <CloudRain className="w-4 h-4 mr-2" /> },
    { id: 'gcp', name: 'Google Cloud', icon: <CloudSnow className="w-4 h-4 mr-2" /> },
    { id: 'vercel', name: 'Vercel', icon: <Cloud className="w-4 h-4 mr-2" /> },
    { id: 'digitalocean', name: 'DigitalOcean', icon: <Cloud className="w-4 h-4 mr-2" /> },
    { id: 'self-hosted', name: 'Self-Hosted', icon: <HardDrive className="w-4 h-4 mr-2" /> }
  ];

  const regionsByProvider = {
    aws: ['us-east-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1'],
    azure: ['eastus', 'westus', 'northeurope', 'southeastasia'],
    gcp: ['us-central1', 'europe-west3', 'asia-southeast1'],
    vercel: ['auto', 'iad1', 'sfo1', 'ams1', 'sin1'],
    digitalocean: ['nyc1', 'sfo2', 'ams3', 'sgp1'],
    'self-hosted': ['custom']
  };

  const containerOptions = [
    { id: 'docker', name: 'Docker Container', icon: <Box className="w-4 h-4 mr-2" /> },
    { id: 'kubernetes', name: 'Kubernetes Cluster', icon: <Layers className="w-4 h-4 mr-2" /> },
    { id: 'nomad', name: 'Nomad', icon: <Network className="w-4 h-4 mr-2" /> },
    { id: 'none', name: 'No Containerization', icon: <Minus className="w-4 h-4 mr-2" /> }
  ];

  return (
    <AuthGuard>
    <div className="min-h-screen bg-theme-surface text-gray-800">
      {/* Header */}
      <header className="bg-[var(--theme-background)] border-b border-[var(--theme-primary)] px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold whitespace-nowrap">Advanced Deployment Dashboard</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="project-selector">
            <select className="bg-theme-surface border border-[var(--theme-background)] rounded-md px-3 py-2 text-sm focus:outline-none  ">
              <option>my-nextjs-app</option>
              <option>my-react-app</option>
              <option>my-astro-site</option>
              <option>my-microservice</option>
            </select>
          </div>
          <button className="px-3 py-2 bg-[var(--theme-accent)] text-white text-sm font-medium rounded-md hover:bg-[color-mix(in_srgb,var(--theme-accent)_80%,var(--theme-background)_20%)] focus:outline-none  ">
            New Project
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row">
        {/* Sidebar Navigation */}
        <nav className="bg-[var(--theme-background)] border-r border-[var(--theme-primary)] w-full md:w-64 p-4">
          <div className="space-y-1">
            <button
              className={`w-full flex items-center px-3 py-2 text-sm rounded-md ${selectedTab === 'deployment' ? 'bg-[color-mix(in_srgb,var(--theme-accent)_10%,var(--theme-background)_90%)] text-blue-700' : 'hover:bg-theme-surface'}`}
              onClick={() => setSelectedTab('deployment')}
            >
              <UploadCloud className="w-4 h-4 mr-2" />
              Deployment
            </button>
            <button
              className={`w-full flex items-center px-3 py-2 text-sm rounded-md ${selectedTab === 'cloud' ? 'bg-[color-mix(in_srgb,var(--theme-accent)_10%,var(--theme-background)_90%)] text-blue-700' : 'hover:bg-theme-surface'}`}
              onClick={() => setSelectedTab('cloud')}
            >
              <Cloud className="w-4 h-4 mr-2" />
              Cloud Provider
            </button>
            <button
              className={`w-full flex items-center px-3 py-2 text-sm rounded-md ${selectedTab === 'containers' ? 'bg-[color-mix(in_srgb,var(--theme-accent)_10%,var(--theme-background)_90%)] text-blue-700' : 'hover:bg-theme-surface'}`}
              onClick={() => setSelectedTab('containers')}
            >
              <Box className="w-4 h-4 mr-2" />
              Containers & Orchestration
            </button>
            <button
              className={`w-full flex items-center px-3 py-2 text-sm rounded-md ${selectedTab === 'domains' ? 'bg-[color-mix(in_srgb,var(--theme-accent)_10%,var(--theme-background)_90%)] text-blue-700' : 'hover:bg-theme-surface'}`}
              onClick={() => setSelectedTab('domains')}
            >
              <Globe className="w-4 h-4 mr-2" />
              Domains & Networking
            </button>
            <button
              className={`w-full flex items-center px-3 py-2 text-sm rounded-md ${selectedTab === 'security' ? 'bg-[color-mix(in_srgb,var(--theme-accent)_10%,var(--theme-background)_90%)] text-blue-700' : 'hover:bg-theme-surface'}`}
              onClick={() => setSelectedTab('security')}
            >
              <Lock className="w-4 h-4 mr-2" />
              Security
            </button>
            <button
              className={`w-full flex items-center px-3 py-2 text-sm rounded-md ${selectedTab === 'functions' ? 'bg-[color-mix(in_srgb,var(--theme-accent)_10%,var(--theme-background)_90%)] text-blue-700' : 'hover:bg-theme-surface'}`}
              onClick={() => setSelectedTab('functions')}
            >
              <Server className="w-4 h-4 mr-2" />
              Functions & Compute
            </button>
            <button
              className={`w-full flex items-center px-3 py-2 text-sm rounded-md ${selectedTab === 'database' ? 'bg-[color-mix(in_srgb,var(--theme-accent)_10%,var(--theme-background)_90%)] text-blue-700' : 'hover:bg-theme-surface'}`}
              onClick={() => setSelectedTab('database')}
            >
              <Database className="w-4 h-4 mr-2" />
              Database
            </button>
            <button
              className={`w-full flex items-center px-3 py-2 text-sm rounded-md ${selectedTab === 'iac' ? 'bg-[color-mix(in_srgb,var(--theme-accent)_10%,var(--theme-background)_90%)] text-blue-700' : 'hover:bg-theme-surface'}`}
              onClick={() => setSelectedTab('iac')}
            >
              <Code className="w-4 h-4 mr-2" />
              Infrastructure as Code
            </button>
            <button
              className={`w-full flex items-center px-3 py-2 text-sm rounded-md ${selectedTab === 'billing' ? 'bg-[color-mix(in_srgb,var(--theme-accent)_10%,var(--theme-background)_90%)] text-blue-700' : 'hover:bg-theme-surface'}`}
              onClick={() => setSelectedTab('billing')}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Billing & Monitoring
            </button>
          </div>
        </nav>

        {/* Settings Panel */}
        <div className="flex-1 p-6">
          {selectedTab === 'deployment' && (
            <div className="bg-[var(--theme-background)] rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium flex items-center mb-6">
                <UploadCloud className="w-5 h-5 mr-2 text-[var(--theme-accent)]" />
                Deployment Configuration
              </h2>
              
              {/* Git Integration */}
              <div className="mb-6 border-b border-[var(--theme-primary)] pb-4">
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleSection('git')}
                >
                  <h3 className="text-md font-medium flex items-center">
                    {expandedSections.git ? <ChevronDown className="w-4 h-4 mr-2" /> : <ChevronRight className="w-4 h-4 mr-2" />}
                    <GitBranch className="w-4 h-4 mr-2" />
                    Git Integration
                  </h3>
                  <span className="text-sm text-[var(--theme-text)]">Connected to GitHub</span>
                </div>
                
                {expandedSections.git && (
                  <div className="mt-4 space-y-4 pl-8">
                    <div>
                      <label className="block text-sm font-medium text-[var(--theme-text)] mb-1">Connected Repository</label>
                      <div className="flex items-center justify-between bg-theme-surface border border-[var(--theme-primary)] rounded-md px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-theme-primary">GitHub</span>
                          <span className="text-gray-600">username/my-nextjs-app</span>
                        </div>
                        <button className="text-sm text-[var(--theme-accent)] hover:text-blue-800">Change</button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-[var(--theme-text)] mb-1">Git Branch</label>
                      <select
                        className="w-full bg-theme-surface border border-[var(--theme-background)] rounded-md px-3 py-2 text-sm focus:outline-none  "
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
                )}
              </div>

              {/* Build Settings */}
              <div className="mb-6 border-b border-[var(--theme-primary)] pb-4">
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleSection('build')}
                >
                  <h3 className="text-md font-medium flex items-center">
                    {expandedSections.build ? <ChevronDown className="w-4 h-4 mr-2" /> : <ChevronRight className="w-4 h-4 mr-2" />}
                    <Code className="w-4 h-4 mr-2" />
                    Build Settings
                  </h3>
                  <span className="text-sm text-[var(--theme-text)]">Next.js preset</span>
                </div>
                
                {expandedSections.build && (
                  <div className="mt-4 space-y-4 pl-8">
                    <div>
                      <label className="block text-sm font-medium text-[var(--theme-text)] mb-1">Framework Preset</label>
                      <select 
                        className="w-full bg-theme-surface border border-[var(--theme-background)] rounded-md px-3 py-2 text-sm focus:outline-none  "
                        value={framework} 
                        onChange={(e) => setFramework(e.target.value)}
                      >
                        <option value="nextjs">Next.js</option>
                        <option value="react">React</option>
                        <option value="vue">Vue.js</option>
                        <option value="astro">Astro</option>
                        <option value="svelte">Svelte</option>
                        <option value="nestjs">NestJS</option>
                        <option value="express">Express</option>
                        <option value="custom">Custom</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--theme-text)] mb-1">Build Command</label>
                      <input
                        type="text"
                        className="w-full bg-theme-surface border border-[var(--theme-background)] rounded-md px-3 py-2 text-sm focus:outline-none   disabled:bg-theme-surface disabled:text-[var(--theme-text)]"
                        value={framework === 'nextjs' ? 'next build' : framework === 'react' ? 'npm run build' : framework === 'nestjs' ? 'npm run build' : ''}
                        disabled={framework !== 'custom'}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--theme-text)] mb-1">Output Directory</label>
                      <input
                        type="text"
                        className="w-full bg-theme-surface border border-[var(--theme-background)] rounded-md px-3 py-2 text-sm focus:outline-none   disabled:bg-theme-surface disabled:text-[var(--theme-text)]"
                        value={framework === 'nextjs' ? '.next' : framework === 'react' ? 'build' : framework === 'nestjs' ? 'dist' : ''}
                        disabled={framework !== 'custom'}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-[var(--theme-text)] mb-1">Node Version</label>
                      <select
                        className="w-full bg-theme-surface border border-[var(--theme-background)] rounded-md px-3 py-2 text-sm focus:outline-none  "
                        defaultValue="18"
                      >
                        <option value="16">Node 16</option>
                        <option value="18">Node 18</option>
                        <option value="20">Node 20</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Deployment Triggers */}
              <div className="mb-6">
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleSection('triggers')}
                >
                  <h3 className="text-md font-medium flex items-center">
                    {expandedSections.triggers ? <ChevronDown className="w-4 h-4 mr-2" /> : <ChevronRight className="w-4 h-4 mr-2" />}
                    <Zap className="w-4 h-4 mr-2" />
                    Deployment Triggers
                  </h3>
                  <span className="text-sm text-[var(--theme-text)]">2 active triggers</span>
                </div>
                
                {expandedSections.triggers && (
                  <div className="mt-4 space-y-3 pl-8">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="auto-deploy"
                        checked={autoDeploy}
                        onChange={(e) => setAutoDeploy(e.target.checked)}
                        className="h-4 w-4 text-[var(--theme-accent)] focus:ring-blue-500 border-[var(--theme-background)] rounded"
                      />
                      <label htmlFor="auto-deploy" className="ml-2 block text-sm text-[var(--theme-text)] flex items-center">
                        <GitBranch className="w-4 h-4 mr-1" />
                        Automatic Deployments on Git Push
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="preview-deploy"
                        checked={previewDeploy}
                        onChange={(e) => setPreviewDeploy(e.target.checked)}
                        className="h-4 w-4 text-[var(--theme-accent)] focus:ring-blue-500 border-[var(--theme-background)] rounded"
                      />
                      <label htmlFor="preview-deploy" className="ml-2 block text-sm text-[var(--theme-text)] flex items-center">
                        <GitPullRequest className="w-4 h-4 mr-1" />
                        Create Preview Deployments for Pull Requests
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="scheduled-deploy"
                        className="h-4 w-4 text-[var(--theme-accent)] focus:ring-blue-500 border-[var(--theme-background)] rounded"
                      />
                      <label htmlFor="scheduled-deploy" className="ml-2 block text-sm text-[var(--theme-text)] flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        Scheduled Deployments (Cron)
                      </label>
                    </div>
                    
                    <div className="pt-2">
                      <button className="flex items-center text-sm text-[var(--theme-accent)] hover:text-blue-800">
                        <Plus className="w-4 h-4 mr-1" />
                        Add Custom Webhook Trigger
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex space-x-3 pt-4">
                <button className="px-4 py-2 bg-[var(--theme-accent)] text-[var(--theme-primary)] text-sm font-medium rounded-md hover:bg-[color-mix(in_srgb,var(--theme-accent)_80%,var(--theme-background)_20%)] focus:outline-none  ">
                  Save Changes
                </button>
                <button className="px-4 py-2 bg-[var(--theme-background)] border border-[var(--theme-background)] text-sm font-medium rounded-md hover:bg-theme-surface focus:outline-none  ">
                  Deploy Manually
                </button>
                <button className="px-4 py-2 bg-[var(--theme-background)] border border-[var(--theme-background)] text-sm font-medium rounded-md hover:bg-theme-surface focus:outline-none  ">
                  View Deployment Logs
                </button>
              </div>
            </div>
          )}

          {selectedTab === 'cloud' && (
            <div className="bg-[var(--theme-background)] rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium flex items-center mb-6">
                <Cloud className="w-5 h-5 mr-2 text-[var(--theme-accent)]" />
                Cloud Provider Configuration
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[var(--theme-text)] mb-2">Select Cloud Provider</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cloudProviders.map((provider) => (
                      <div 
                        key={provider.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${cloudProvider === provider.id ? 'border-blue-500 bg-[color-mix(in_srgb,var(--theme-accent)_10%,var(--theme-background)_90%)]' : 'border-[var(--theme-primary)] hover:border-[var(--theme-background)]'}`}
                        onClick={() => setCloudProvider(provider.id)}
                      >
                        <div className="flex items-center">
                          {provider.icon}
                          <span className="font-medium">{provider.name}</span>
                        </div>
                        {cloudProvider === provider.id && (
                          <div className="mt-3">
                            <label className="block text-xs font-medium text-[var(--theme-text)] mb-1">Region</label>
                            <select
                              className="w-full bg-[var(--theme-background)] border border-[var(--theme-background)] rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                              {regionsByProvider[provider.id as keyof typeof regionsByProvider].map(region => (
                                <option key={region} value={region}>{region}</option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                {cloudProvider !== 'vercel' && (
                  <div className="border-t border-[var(--theme-primary)] pt-4">
                    <h3 className="text-md font-medium mb-3">Advanced Cloud Settings</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-[var(--theme-text)] mb-1">Instance Size</label>
                        <select
                          className="w-full bg-theme-surface border border-[var(--theme-background)] rounded-md px-3 py-2 text-sm focus:outline-none  "
                          defaultValue="medium"
                        >
                          <option value="small">Small (1 vCPU, 2GB RAM)</option>
                          <option value="medium">Medium (2 vCPU, 4GB RAM)</option>
                          <option value="large">Large (4 vCPU, 8GB RAM)</option>
                          <option value="xlarge">XLarge (8 vCPU, 16GB RAM)</option>
                          <option value="custom">Custom</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-[var(--theme-text)] mb-1">Auto Scaling</label>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              id="scale-none"
                              name="scaling"
                              className="h-4 w-4 text-[var(--theme-accent)] focus:ring-blue-500"
                              defaultChecked
                            />
                            <label htmlFor="scale-none" className="ml-2 block text-sm text-[var(--theme-text)]">
                              No Auto Scaling
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="radio"
                              id="scale-horizontal"
                              name="scaling"
                              className="h-4 w-4 text-[var(--theme-accent)] focus:ring-blue-500"
                            />
                            <label htmlFor="scale-horizontal" className="ml-2 block text-sm text-[var(--theme-text)]">
                              Horizontal Scaling
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="radio"
                              id="scale-vertical"
                              name="scaling"
                              className="h-4 w-4 text-[var(--theme-accent)] focus:ring-blue-500"
                            />
                            <label htmlFor="scale-vertical" className="ml-2 block text-sm text-[var(--theme-text)]">
                              Vertical Scaling
                            </label>
                          </div>
                        </div>
                      </div>
                      
                      {cloudProvider === 'aws' && (
                        <div>
                          <label className="block text-sm font-medium text-[var(--theme-text)] mb-1">AWS Services</label>
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="aws-s3"
                                className="h-4 w-4 text-[var(--theme-accent)] focus:ring-blue-500 border-[var(--theme-background)] rounded"
                              />
                              <label htmlFor="aws-s3" className="ml-2 block text-sm text-[var(--theme-text)]">
                                S3 Bucket for Assets
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="aws-rds"
                                className="h-4 w-4 text-[var(--theme-accent)] focus:ring-blue-500 border-[var(--theme-background)] rounded"
                              />
                              <label htmlFor="aws-rds" className="ml-2 block text-sm text-[var(--theme-text)]">
                                RDS Database
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="aws-cloudfront"
                                className="h-4 w-4 text-[var(--theme-accent)] focus:ring-blue-500 border-[var(--theme-background)] rounded"
                              />
                              <label htmlFor="aws-cloudfront" className="ml-2 block text-sm text-[var(--theme-text)]">
                                CloudFront CDN
                              </label>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end">
                  <button className="px-4 py-2 bg-[var(--theme-accent)] text-[var(--theme-primary)] text-sm font-medium rounded-md hover:bg-[color-mix(in_srgb,var(--theme-accent)_80%,var(--theme-background)_20%)] focus:outline-none  ">
                    Save Cloud Configuration
                  </button>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'containers' && (
            <div className="bg-[var(--theme-background)] rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium flex items-center mb-6">
                <Box className="w-5 h-5 mr-2 text-[var(--theme-accent)]" />
                Containerization & Orchestration
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[var(--theme-text)] mb-2">Containerization Options</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {containerOptions.map((option) => (
                      <div 
                        key={option.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${(option.id === 'docker' && useDocker) || (option.id === 'kubernetes' && useKubernetes) ? 'border-blue-500 bg-[color-mix(in_srgb,var(--theme-accent)_10%,var(--theme-background)_90%)]' : 'border-[var(--theme-primary)] hover:border-[var(--theme-background)]'}`}
                        onClick={() => {
                          if (option.id === 'docker') setUseDocker(!useDocker);
                          if (option.id === 'kubernetes') setUseKubernetes(!useKubernetes);
                        }}
                      >
                        <div className="flex items-center">
                          {option.icon}
                          <span className="font-medium">{option.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {useDocker && (
                  <div className="border border-[var(--theme-primary)] rounded-lg p-4">
                    <h3 className="text-md font-medium mb-3 flex items-center">
                      <Box className="w-4 h-4 mr-2" />
                      Docker Configuration
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-[var(--theme-text)] mb-1">Dockerfile Path</label>
                        <input
                          type="text"
                          className="w-full bg-theme-surface border border-[var(--theme-background)] rounded-md px-3 py-2 text-sm focus:outline-none  "
                          defaultValue="./Dockerfile"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-[var(--theme-text)] mb-1">Container Port</label>
                        <input
                          type="number"
                          className="w-full bg-theme-surface border border-[var(--theme-background)] rounded-md px-3 py-2 text-sm focus:outline-none  "
                          defaultValue="3000"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-[var(--theme-text)] mb-1">Build Args</label>
                        <div className="space-y-2">
                          <div className="flex space-x-2">
                            <input
                              type="text"
                              placeholder="Name"
                              className="flex-1 bg-theme-surface border border-[var(--theme-background)] rounded-md px-3 py-2 text-sm focus:outline-none  "
                            />
                            <input
                              type="text"
                              placeholder="Value"
                              className="flex-1 bg-theme-surface border border-[var(--theme-background)] rounded-md px-3 py-2 text-sm focus:outline-none  "
                            />
                            <button className="px-2 py-1 bg-theme-surface border border-[var(--theme-background)] rounded-md text-sm hover:bg-gray-200">
                              Add
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {useKubernetes && (
                  <div className="border border-[var(--theme-primary)] rounded-lg p-4">
                    <h3 className="text-md font-medium mb-3 flex items-center">
                      <Layers className="w-4 h-4 mr-2" />
                      Kubernetes Configuration
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-[var(--theme-text)] mb-1">Cluster Name</label>
                        <input
                          type="text"
                          className="w-full bg-theme-surface border border-[var(--theme-background)] rounded-md px-3 py-2 text-sm focus:outline-none  "
                          placeholder="my-cluster"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-[var(--theme-text)] mb-1">Number of Nodes</label>
                        <input
                          type="number"
                          min="1"
                          max="10"
                          className="w-full bg-theme-surface border border-[var(--theme-background)] rounded-md px-3 py-2 text-sm focus:outline-none  "
                          defaultValue="2"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-[var(--theme-text)] mb-1">Node Size</label>
                        <select
                          className="w-full bg-theme-surface border border-[var(--theme-background)] rounded-md px-3 py-2 text-sm focus:outline-none  "
                          defaultValue="medium"
                        >
                          <option value="small">Small (2 vCPU, 4GB RAM)</option>
                          <option value="medium">Medium (4 vCPU, 8GB RAM)</option>
                          <option value="large">Large (8 vCPU, 16GB RAM)</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-[var(--theme-text)] mb-1">Kubernetes Manifest</label>
                        <textarea
                          className="w-full h-32 bg-theme-surface border border-[var(--theme-background)] rounded-md px-3 py-2 text-sm font-mono focus:outline-none  "
                          placeholder="Paste your Kubernetes YAML here..."
                        ></textarea>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end">
                  <button className="px-4 py-2 bg-[var(--theme-accent)] text-[var(--theme-primary)] text-sm font-medium rounded-md hover:bg-[color-mix(in_srgb,var(--theme-accent)_80%,var(--theme-background)_20%)] focus:outline-none  ">
                    Save Container Configuration
                  </button>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'iac' && (
            <div className="bg-[var(--theme-background)] rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium flex items-center mb-6">
                <Code className="w-5 h-5 mr-2 text-[var(--theme-accent)]" />
                Infrastructure as Code
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[var(--theme-text)] mb-2">IaC Tool</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div 
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${infraAsCode === 'terraform' ? 'border-blue-500 bg-[color-mix(in_srgb,var(--theme-accent)_10%,var(--theme-background)_90%)]' : 'border-[var(--theme-primary)] hover:border-[var(--theme-background)]'}`}
                      onClick={() => setInfraAsCode('terraform')}
                    >
                      <div className="flex items-center">
                        <img src="https://www.vectorlogo.zone/logos/terraformio/terraformio-icon.svg" className="w-4 h-4 mr-2" alt="Terraform" />
                        <span className="font-medium">Terraform</span>
                      </div>
                    </div>
                    
                    <div 
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${infraAsCode === 'pulumi' ? 'border-blue-500 bg-[color-mix(in_srgb,var(--theme-accent)_10%,var(--theme-background)_90%)]' : 'border-[var(--theme-primary)] hover:border-[var(--theme-background)]'}`}
                      onClick={() => setInfraAsCode('pulumi')}
                    >
                      <div className="flex items-center">
                        <img src="https://www.vectorlogo.zone/logos/pulumi/pulumi-icon.svg" className="w-4 h-4 mr-2" alt="Pulumi" />
                        <span className="font-medium">Pulumi</span>
                      </div>
                    </div>
                    
                    <div 
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${infraAsCode === 'cdk' ? 'border-blue-500 bg-[color-mix(in_srgb,var(--theme-accent)_10%,var(--theme-background)_90%)]' : 'border-[var(--theme-primary)] hover:border-[var(--theme-background)]'}`}
                      onClick={() => setInfraAsCode('cdk')}
                    >
                      <div className="flex items-center">
                        <img src="https://www.vectorlogo.zone/logos/amazon_aws/amazon_aws-icon.svg" className="w-4 h-4 mr-2" alt="AWS CDK" />
                        <span className="font-medium">AWS CDK</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-[var(--theme-primary)] pt-4"> 
                  <h3 className="text-md font-medium mb-3">Configuration</h3>
                  
                  {infraAsCode === 'terraform' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-[var(--theme-text)] mb-1">Terraform Version</label>
                        <select
                          className="w-full bg-theme-surface border border-[var(--theme-background)] rounded-md px-3 py-2 text-sm focus:outline-none  "
                          defaultValue="1.5"
                        >
                          <option value="1.5">1.5.x</option>
                          <option value="1.4">1.4.x</option>
                          <option value="1.3">1.3.x</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-[var(--theme-text)] mb-1">Backend Storage</label>
                        <select
                          className="w-full bg-theme-surface border border-[var(--theme-background)] rounded-md px-3 py-2 text-sm focus:outline-none  "
                          defaultValue="remote"
                        >
                          <option value="remote">Terraform Cloud</option>
                          <option value="s3">AWS S3</option>
                          <option value="gcs">Google Cloud Storage</option>
                          <option value="azurerm">Azure Blob Storage</option>
                          <option value="local">Local</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-[var(--theme-text)] mb-1">Terraform Files</label>
                        <textarea
                          className="w-full h-64 bg-theme-surface border border-[var(--theme-background)] rounded-md px-3 py-2 text-sm font-mono focus:outline-none  "
                          placeholder={`provider "aws" {\n  region = "us-east-1"\n}\n\nresource "aws_instance" "example" {\n  ami           = "ami-0c55b159cbfafe1f0"\n  instance_type = "t2.micro"\n}`}
                        ></textarea>
                      </div>
                    </div>
                  )}
                  
                  {infraAsCode === 'pulumi' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-[var(--theme-text)] mb-1">Pulumi Language</label>
                        <select
                                                    className="w-full bg-theme-surface border border-[var(--theme-background)] rounded-md px-3 py-2 text-sm focus:outline-none  "
                                                    defaultValue="typescript"
                                                  >
                                                    <option value="typescript">TypeScript</option>
                                                    <option value="javascript">JavaScript</option>
                                                    <option value="python">Python</option>
                                                    <option value="go">Go</option>
                                                    <option value="csharp">C#</option>
                                                  </select>
                                                </div>
                                                
                                                <div>
                                                  <label className="block text-sm font-medium text-[var(--theme-text)] mb-1">Pulumi Stack</label>
                                                  <input
                                                    type="text"
                                                    className="w-full bg-theme-surface border border-[var(--theme-background)] rounded-md px-3 py-2 text-sm focus:outline-none  "
                                                    placeholder="dev"
                                                  />
                                                </div>
                                                
                                                <div>
                                                  <label className="block text-sm font-medium text-[var(--theme-text)] mb-1">Pulumi Program</label>
                                                  <textarea
                                                    className="w-full h-64 bg-theme-surface border border-[var(--theme-background)] rounded-md px-3 py-2 text-sm font-mono focus:outline-none  "
                                                    placeholder={`import * as aws from "@pulumi/aws";\nimport * as pulumi from "@pulumi/pulumi";\n\n// Create an AWS resource (S3 Bucket)\nconst bucket = new aws.s3.Bucket("my-bucket");\n\nexport const bucketName = bucket.id;`}
                                                  ></textarea>
                                                </div>
                                              </div>
                                            )}
                                            
                                            {infraAsCode === 'cdk' && (
                                              <div className="space-y-4">
                                                <div>
                                                  <label className="block text-sm font-medium text-[var(--theme-text)] mb-1">CDK Language</label>
                                                  <select
                                                    className="w-full bg-theme-surface border border-[var(--theme-background)] rounded-md px-3 py-2 text-sm focus:outline-none  "
                                                    defaultValue="typescript"
                                                  >
                                                    <option value="typescript">TypeScript</option>
                                                    <option value="javascript">JavaScript</option>
                                                    <option value="python">Python</option>
                                                    <option value="java">Java</option>
                                                    <option value="csharp">C#</option>
                                                  </select>
                                                </div>
                                                
                                                <div>
                                                  <label className="block text-sm font-medium text-[var(--theme-text)] mb-1">CDK Version</label>
                                                  <select
                                                    className="w-full bg-theme-surface border border-[var(--theme-background)] rounded-md px-3 py-2 text-sm focus:outline-none  "
                                                    defaultValue="2.0"
                                                  >
                                                    <option value="2.0">2.x</option>
                                                    <option value="1.0">1.x</option>
                                                  </select>
                                                </div>
                                                
                                                <div>
                                                  <label className="block text-sm font-medium text-[var(--theme-text)] mb-1">CDK Stack</label>
                                                  <textarea
                                                    className="w-full h-64 bg-theme-surface border border-[var(--theme-background)] rounded-md px-3 py-2 text-sm font-mono focus:outline-none  "
                                                    placeholder={`import * as cdk from 'aws-cdk-lib';\nimport { Construct } from 'constructs';\n\nexport class MyStack extends cdk.Stack {\n  constructor(scope: Construct, id: string, props?: cdk.StackProps) {\n    super(scope, id, props);\n\n    // Define resources here\n  }\n}`}
                                                  ></textarea>
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                          
                                          <div className="flex justify-end">
                                            <button className="px-4 py-2 bg-[var(--theme-accent)] text-[var(--theme-primary)] text-sm font-medium rounded-md hover:bg-[color-mix(in_srgb,var(--theme-accent)_80%,var(--theme-background)_20%)] focus:outline-none  ">
                                              Generate IaC Configuration
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                          
                                    {selectedTab === 'functions' && (
                                      <div className="bg-[var(--theme-background)] rounded-lg shadow-sm p-6">
                                        <h2 className="text-lg font-medium flex items-center mb-6">
                                          <Server className="w-5 h-5 mr-2 text-[var(--theme-accent)]" />
                                          Serverless Functions Configuration
                                        </h2>
                                        
                                        <div className="space-y-6">
                                          <div className="flex items-center">
                                            <input
                                              type="checkbox"
                                              id="serverless"
                                              checked={serverless}
                                              onChange={(e) => setServerless(e.target.checked)}
                                              className="h-4 w-4 text-[var(--theme-accent)] focus:ring-blue-500 border-[var(--theme-background)] rounded"
                                            />
                                            <label htmlFor="serverless" className="ml-2 block text-sm text-[var(--theme-text)] flex items-center">
                                              <Cpu className="w-4 h-4 mr-1" />
                                              Enable Serverless Functions
                                            </label>
                                          </div>
                          
                                          <div className="flex items-center">
                                            <input
                                              type="checkbox"
                                              id="edge-functions"
                                              checked={edgeFunctions}
                                              onChange={(e) => setEdgeFunctions(e.target.checked)}
                                              className="h-4 w-4 text-[var(--theme-accent)] focus:ring-blue-500 border-[var(--theme-background)] rounded"
                                            />
                                            <label htmlFor="edge-functions" className="ml-2 block text-sm text-[var(--theme-text)] flex items-center">
                                              <Zap className="w-4 h-4 mr-1" />
                                              Enable Edge Functions (Beta)
                                            </label>
                                          </div>
                          
                                          <div>
                                            <label className="block text-sm font-medium text-[var(--theme-text)] mb-1">Function Regions</label>
                                            <select
                                              className="w-full bg-theme-surface border border-[var(--theme-background)] rounded-md px-3 py-2 text-sm focus:outline-none  "
                                              defaultValue="auto"
                                            >
                                              <option value="auto">Automatic (Recommended)</option>
                                              <option value="iad1">Washington, D.C., USA</option>
                                              <option value="sfo1">San Francisco, USA</option>
                                              <option value="ams1">Amsterdam, NL</option>
                                              <option value="sin1">Singapore</option>
                                            </select>
                                          </div>
                          
                                          <div>
                                            <label className="block text-sm font-medium text-[var(--theme-text)] mb-1">Maximum Execution Duration</label>
                                            <select
                                              className="w-full bg-theme-surface border border-[var(--theme-background)] rounded-md px-3 py-2 text-sm focus:outline-none  "
                                              defaultValue="10"
                                            >
                                              <option value="5">5 seconds</option>
                                              <option value="10">10 seconds</option>
                                              <option value="15">15 seconds</option>
                                              <option value="30">30 seconds</option>
                                              <option value="60">60 seconds</option>
                                            </select>
                                          </div>
                          
                                          <div>
                                            <label className="block text-sm font-medium text-[var(--theme-text)] mb-1">Memory Allocation</label>
                                            <select
                                              className="w-full bg-theme-surface border border-[var(--theme-background)] rounded-md px-3 py-2 text-sm focus:outline-none  "
                                              defaultValue="1024"
                                            >
                                              <option value="128">128MB</option>
                                              <option value="256">256MB</option>
                                              <option value="512">512MB</option>
                                              <option value="1024">1GB</option>
                                              <option value="2048">2GB</option>
                                              <option value="3008">3GB</option>
                                            </select>
                                          </div>
                          
                                          <div>
                                            <label className="block text-sm font-medium text-[var(--theme-text)] mb-1">Environment Variables</label>
                                            <div className="space-y-2">
                                              <div className="flex space-x-2">
                                                <input
                                                  type="text"
                                                  placeholder="Key"
                                                  className="flex-1 bg-theme-surface border border-[var(--theme-background)] rounded-md px-3 py-2 text-sm focus:outline-none  "
                                                />
                                                <input
                                                  type="text"
                                                  placeholder="Value"
                                                  className="flex-1 bg-theme-surface border border-[var(--theme-background)] rounded-md px-3 py-2 text-sm focus:outline-none  "
                                                />
                                                <button className="px-2 py-1 bg-theme-surface border border-[var(--theme-background)] rounded-md text-sm hover:bg-gray-200">
                                                  Add
                                                </button>
                                              </div>
                                              <div className="bg-theme-surface p-2 rounded text-xs text-[var(--theme-text)]">
                                                These variables will be available to all functions in this project.
                                              </div>
                                            </div>
                                          </div>
                          
                                          <div>
                                            <button className="px-4 py-2 bg-[var(--theme-accent)] text-[var(--theme-primary)] text-sm font-medium rounded-md hover:bg-[color-mix(in_srgb,var(--theme-accent)_80%,var(--theme-background)_20%)] focus:outline-none  ">
                                              Save Function Settings
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                          
                                    {selectedTab === 'domains' && (
                                      <div className="bg-[var(--theme-background)] rounded-lg shadow-sm p-6">
                                        <h2 className="text-lg font-medium flex items-center mb-6">
                                          <Globe className="w-5 h-5 mr-2 text-[var(--theme-accent)]" />
                                          Domains & Networking
                                        </h2>
                                        
                                        <div className="space-y-6">
                                          <div>
                                            <h3 className="text-md font-medium mb-3">Custom Domains</h3>
                                            <div className="space-y-4">
                                              <div className="flex items-center justify-between bg-theme-surface border border-[var(--theme-primary)] rounded-md px-4 py-3">
                                                <div className="flex items-center space-x-2">
                                                  <span className="font-medium text-theme-primary">example.com</span>
                                                  <span className="text-[color-mix(in_srgb,var(--theme-accent)_70%,var(--theme-primary)_30%)] text-xs bg-[color-mix(in_srgb,var(--theme-accent)_10%,var(--theme-background)_90%)] px-2 py-1 rounded">Active</span>
                                                </div>
                                                <button className="text-sm text-[var(--theme-accent)] hover:text-blue-800">Configure</button>
                                              </div>
                                              
                                              <div className="flex items-center justify-between bg-theme-surface border border-[var(--theme-primary)] rounded-md px-4 py-3">
                                                <div className="flex items-center space-x-2">
                                                  <span className="font-medium text-theme-primary">www.example.com</span>
                                                  <span className="text-[color-mix(in_srgb,var(--theme-accent)_70%,var(--theme-primary)_30%)] text-xs bg-[color-mix(in_srgb,var(--theme-accent)_10%,var(--theme-background)_90%)] px-2 py-1 rounded">Active</span>
                                                </div>
                                                <button className="text-sm text-[var(--theme-accent)] hover:text-blue-800">Configure</button>
                                              </div>
                                              
                                              <button className="flex items-center text-sm text-[var(--theme-accent)] hover:text-blue-800">
                                                <Plus className="w-4 h-4 mr-1" />
                                                Add Domain
                                              </button>
                                            </div>
                                          </div>
                                          
                                          <div className="border-t border-[var(--theme-primary)] pt-4">
                                            <h3 className="text-md font-medium mb-3">Network Configuration</h3>
                                            <div className="space-y-4">
                                              <div>
                                                <label className="block text-sm font-medium text-[var(--theme-text)] mb-1">HTTP/HTTPS</label>
                                                <div className="flex items-center space-x-4">
                                                  <div className="flex items-center">
                                                    <input
                                                      type="radio"
                                                      id="http-https"
                                                      name="protocol"
                                                      className="h-4 w-4 text-[var(--theme-accent)] focus:ring-blue-500"
                                                      defaultChecked
                                                    />
                                                    <label htmlFor="http-https" className="ml-2 block text-sm text-[var(--theme-text)]">
                                                      Redirect HTTP to HTTPS (Recommended)
                                                    </label>
                                                  </div>
                                                  <div className="flex items-center">
                                                    <input
                                                      type="radio"
                                                      id="https-only"
                                                      name="protocol"
                                                      className="h-4 w-4 text-[var(--theme-accent)] focus:ring-blue-500"
                                                    />
                                                    <label htmlFor="https-only" className="ml-2 block text-sm text-[var(--theme-text)]">
                                                      HTTPS Only
                                                    </label>
                                                  </div>
                                                </div>
                                              </div>
                                              
                                              <div>
                                                <label className="block text-sm font-medium text-[var(--theme-text)] mb-1">CDN Configuration</label>
                                                <select
                                                  className="w-full bg-theme-surface border border-[var(--theme-background)] rounded-md px-3 py-2 text-sm focus:outline-none  "
                                                  defaultValue="auto"
                                                >
                                                  <option value="auto">Automatic CDN</option>
                                                  <option value="cloudflare">Cloudflare</option>
                                                  <option value="aws-cloudfront">AWS CloudFront</option>
                                                  <option value="none">No CDN</option>
                                                </select>
                                              </div>
                                              
                                              <div>
                                                <label className="block text-sm font-medium text-[var(--theme-text)] mb-1">CORS Policy</label>
                                                <textarea
                                                  className="w-full h-24 bg-theme-surface border border-[var(--theme-background)] rounded-md px-3 py-2 text-sm font-mono focus:outline-none  "
                                                  placeholder={`{\n  "origin": ["https://example.com"],\n  "methods": ["GET", "POST"],\n  "allowedHeaders": ["Content-Type"]\n}`}
                                                ></textarea>
                                              </div>
                                            </div>
                                          </div>
                                          
                                          <div className="flex justify-end">
                                            <button className="px-4 py-2 bg-[var(--theme-accent)] text-[var(--theme-primary)] text-sm font-medium rounded-md hover:bg-[color-mix(in_srgb,var(--theme-accent)_80%,var(--theme-background)_20%)] focus:outline-none  ">
                                              Save Network Settings
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                          
                                    {selectedTab === 'database' && (
                                      <div className="bg-[var(--theme-background)] rounded-lg shadow-sm p-6">
                                        <h2 className="text-lg font-medium flex items-center mb-6">
                                          <Database className="w-5 h-5 mr-2 text-[var(--theme-accent)]" />
                                          Database Configuration
                                        </h2>
                                        
                                        <div className="space-y-6">
                                          <div>
                                            <label className="block text-sm font-medium text-[var(--theme-text)] mb-2">Database Type</label>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                              <div className="border rounded-lg p-4 cursor-pointer border-blue-500 bg-[color-mix(in_srgb,var(--theme-accent)_10%,var(--theme-background)_90%)]">
                                                <div className="flex items-center">
                                                  <img src="https://www.vectorlogo.zone/logos/postgresql/postgresql-icon.svg" className="w-4 h-4 mr-2" alt="PostgreSQL" />
                                                  <span className="font-medium">PostgreSQL</span>
                                                </div>
                                              </div>
                                              
                                              <div className="border rounded-lg p-4 cursor-pointer border-[var(--theme-primary)] hover:border-[var(--theme-background)]">
                                                <div className="flex items-center">
                                                  <img src="https://www.vectorlogo.zone/logos/mysql/mysql-icon.svg" className="w-4 h-4 mr-2" alt="MySQL" />
                                                  <span className="font-medium">MySQL</span>
                                                </div>
                                              </div>
                                              
                                              <div className="border rounded-lg p-4 cursor-pointer border-[var(--theme-primary)] hover:border-[var(--theme-background)]">
                                                <div className="flex items-center">
                                                  <img src="https://www.vectorlogo.zone/logos/mongodb/mongodb-icon.svg" className="w-4 h-4 mr-2" alt="MongoDB" />
                                                  <span className="font-medium">MongoDB</span>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                          
                                          <div className="border-t border-[var(--theme-primary)] pt-4">
                                            <h3 className="text-md font-medium mb-3">PostgreSQL Configuration</h3>
                                            <div className="space-y-4">
                                              <div>
                                                <label className="block text-sm font-medium text-[var(--theme-text)] mb-1">Database Version</label>
                                                <select
                                                  className="w-full bg-theme-surface border border-[var(--theme-background)] rounded-md px-3 py-2 text-sm focus:outline-none  "
                                                  defaultValue="14"
                                                >
                                                  <option value="15">PostgreSQL 15</option>
                                                  <option value="14">PostgreSQL 14</option>
                                                  <option value="13">PostgreSQL 13</option>
                                                </select>
                                              </div>
                                              
                                              <div>
                                                <label className="block text-sm font-medium text-[var(--theme-text)] mb-1">Instance Size</label>
                                                <select
                                                  className="w-full bg-theme-surface border border-[var(--theme-background)] rounded-md px-3 py-2 text-sm focus:outline-none  "
                                                  defaultValue="medium"
                                                >
                                                  <option value="small">Small (1 vCPU, 2GB RAM, 10GB Storage)</option>
                                                  <option value="medium">Medium (2 vCPU, 4GB RAM, 50GB Storage)</option>
                                                  <option value="large">Large (4 vCPU, 8GB RAM, 100GB Storage)</option>
                                                </select>
                                              </div>
                                              
                                              <div>
                                                <label className="block text-sm font-medium text-[var(--theme-text)] mb-1">Connection Settings</label>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                  <div>
                                                    <label className="block text-xs font-medium text-[var(--theme-text)] mb-1">Database Name</label>
                                                    <input
                                                      type="text"
                                                      className="w-full bg-theme-surface border border-[var(--theme-background)] rounded-md px-3 py-2 text-sm focus:outline-none  "
                                                      defaultValue="mydb"
                                                    />
                                                  </div>
                                                  <div>
                                                    <label className="block text-xs font-medium text-[var(--theme-text)] mb-1">Username</label>
                                                    <input
                                                      type="text"
                                                      className="w-full bg-theme-surface border border-[var(--theme-background)] rounded-md px-3 py-2 text-sm focus:outline-none  "
                                                      defaultValue="admin"
                                                    />
                                                  </div>
                                                </div>
                                              </div>
                                              
                                              <div>
                                                <label className="block text-sm font-medium text-[var(--theme-text)] mb-1">Backup Configuration</label>
                                                <div className="flex items-center space-x-4">
                                                  <div className="flex items-center">
                                                    <input
                                                      type="radio"
                                                      id="backup-daily"
                                                      name="backup"
                                                      className="h-4 w-4 text-[var(--theme-accent)] focus:ring-blue-500"
                                                      defaultChecked
                                                    />
                                                    <label htmlFor="backup-daily" className="ml-2 block text-sm text-[var(--theme-text)]">
                                                      Daily Backups
                                                    </label>
                                                  </div>
                                                  <div className="flex items-center">
                                                    <input
                                                      type="radio"
                                                      id="backup-weekly"
                                                      name="backup"
                                                      className="h-4 w-4 text-[var(--theme-accent)] focus:ring-blue-500"
                                                    />
                                                    <label htmlFor="backup-weekly" className="ml-2 block text-sm text-[var(--theme-text)]">
                                                      Weekly Backups
                                                    </label>
                                                  </div>
                                                  <div className="flex items-center">
                                                    <input
                                                      type="radio"
                                                      id="backup-none"
                                                      name="backup"
                                                      className="h-4 w-4 text-[var(--theme-accent)] focus:ring-blue-500"
                                                    />
                                                    <label htmlFor="backup-none" className="ml-2 block text-sm text-[var(--theme-text)]">
                                                      No Automatic Backups
                                                    </label>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                          
                                          <div className="flex justify-end">
                                            <button className="px-4 py-2 bg-[var(--theme-accent)] text-[var(--theme-primary)] text-sm font-medium rounded-md hover:bg-[color-mix(in_srgb,var(--theme-accent)_80%,var(--theme-background)_20%)] focus:outline-none  ">
                                              Save Database Configuration
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                          
                                    {selectedTab === 'security' && (
                                      <div className="bg-[var(--theme-background)] rounded-lg shadow-sm p-6">
                                        <h2 className="text-lg font-medium flex items-center mb-6">
                                          <Lock className="w-5 h-5 mr-2 text-[var(--theme-accent)]" />
                                          Security Settings
                                        </h2>
                                        
                                        <div className="space-y-6">
                                          <div>
                                            <h3 className="text-md font-medium mb-3">Authentication</h3>
                                            <div className="space-y-4">
                                              <div className="flex items-center">
                                                <input
                                                  type="checkbox"
                                                  id="auth-required"
                                                  className="h-4 w-4 text-[var(--theme-accent)] focus:ring-blue-500 border-[var(--theme-background)] rounded"
                                                  defaultChecked
                                                />
                                                <label htmlFor="auth-required" className="ml-2 block text-sm text-[var(--theme-text)]">
                                                  Require Authentication for Deployments
                                                </label>
                                              </div>
                                              
                                              <div>
                                                <label className="block text-sm font-medium text-[var(--theme-text)] mb-1">Authentication Providers</label>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                  <div className="flex items-center space-x-2 p-3 border border-[var(--theme-primary)] rounded-lg">
                                                    <input
                                                      type="checkbox"
                                                      id="github-auth"
                                                      className="h-4 w-4 text-[var(--theme-accent)] focus:ring-blue-500 border-[var(--theme-background)] rounded"
                                                      defaultChecked
                                                    />
                                                    <img src="https://www.vectorlogo.zone/logos/github/github-icon.svg" className="w-5 h-5" alt="GitHub" />
                                                    <label htmlFor="github-auth" className="block text-sm text-[var(--theme-text)]">
                                                      GitHub
                                                    </label>
                                                  </div>
                                                  
                                                  <div className="flex items-center space-x-2 p-3 border border-[var(--theme-primary)] rounded-lg">
                                                    <input
                                                      type="checkbox"
                                                      id="google-auth"
                                                      className="h-4 w-4 text-[var(--theme-accent)] focus:ring-blue-500 border-[var(--theme-background)] rounded"
                                                    />
                                                    <img src="https://www.vectorlogo.zone/logos/google/google-icon.svg" className="w-5 h-5" alt="Google" />
                                                    <label htmlFor="google-auth" className="block text-sm text-[var(--theme-text)]">
                                                      Google
                                                    </label>
                                                  </div>
                                                  
                                                  <div className="flex items-center space-x-2 p-3 border border-[var(--theme-primary)] rounded-lg">
                                                    <input
                                                      type="checkbox"
                                                      id="saml-auth"
                                                      className="h-4 w-4 text-[var(--theme-accent)] focus:ring-blue-500 border-[var(--theme-background)] rounded"
                                                    />
                                                    <Lock className="w-5 h-5" />
                                                    <label htmlFor="saml-auth" className="block text-sm text-[var(--theme-text)]">
                                                      SAML/SSO
                                                    </label>
                                                  </div>
                                                  
                                                  <div className="flex items-center space-x-2 p-3 border border-[var(--theme-primary)] rounded-lg">
                                                    <input
                                                      type="checkbox"
                                                      id="email-auth"
                                                      className="h-4 w-4 text-[var(--theme-accent)] focus:ring-blue-500 border-[var(--theme-background)] rounded"
                                                    />
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                    </svg>
                                                    <label htmlFor="email-auth" className="block text-sm text-[var(--theme-text)]">
                                                      Email/Password
                                                    </label>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                          
                                          <div className="border-t border-[var(--theme-primary)] pt-4">
                                            <h3 className="text-md font-medium mb-3">Security Headers</h3>
                                            <div className="space-y-4">
                                              <div className="flex items-center">
                                                <input
                                                  type="checkbox"
                                                  id="csp-header"
                                                  className="h-4 w-4 text-[var(--theme-accent)] focus:ring-blue-500 border-[var(--theme-background)] rounded"
                                                  defaultChecked
                                                />
                                                <label htmlFor="csp-header" className="ml-2 block text-sm text-[var(--theme-text)]">
                                                  Content Security Policy (CSP)
                                                </label>
                                              </div>
                                              
                                              <div className="flex items-center">
                                                <input
                                                  type="checkbox"
                                                  id="hsts-header"
                                                  className="h-4 w-4 text-[var(--theme-accent)] focus:ring-blue-500 border-[var(--theme-background)] rounded"
                                                  defaultChecked
                                                />
                                                <label htmlFor="hsts-header" className="ml-2 block text-sm text-[var(--theme-text)]">
                                                  HTTP Strict Transport Security (HSTS)
                                                </label>
                                              </div>
                                              
                                              <div className="flex items-center">
                                                <input
                                                  type="checkbox"
                                                  id="xss-header"
                                                  className="h-4 w-4 text-[var(--theme-accent)] focus:ring-blue-500 border-[var(--theme-background)] rounded"
                                                  defaultChecked
                                                />
                                                <label htmlFor="xss-header" className="ml-2 block text-sm text-[var(--theme-text)]">
                                                  X-XSS-Protection
                                                </label>
                                              </div>
                                              
                                              <div>
                                                <label className="block text-sm font-medium text-[var(--theme-text)] mb-1">Custom Security Headers</label>
                                                <textarea
                                                  className="w-full h-24 bg-theme-surface border border-[var(--theme-background)] rounded-md px-3 py-2 text-sm font-mono focus:outline-none  "
                                                  placeholder={`X-Frame-Options: DENY\nX-Content-Type-Options: nosniff\nReferrer-Policy: strict-origin-when-cross-origin`}
                                                ></textarea>
                                              </div>
                                            </div>
                                          </div>
                                          
                                          <div className="border-t border-[var(--theme-primary)] pt-4">
                                            <h3 className="text-md font-medium mb-3">IP Restrictions</h3>
                                            <div className="space-y-4">
                                              <div className="flex items-center">
                                                <input
                                                  type="checkbox"
                                                  id="ip-restrict"
                                                  className="h-4 w-4 text-[var(--theme-accent)] focus:ring-blue-500 border-[var(--theme-background)] rounded"
                                                />
                                                <label htmlFor="ip-restrict" className="ml-2 block text-sm text-[var(--theme-text)]">
                                                  Restrict Access by IP Address
                                                </label>
                                              </div>
                                              
                                              <div>
                                                <label className="block text-sm font-medium text-[var(--theme-text)] mb-1">Allowed IP Addresses</label>
                                                <div className="space-y-2">
                                                  <div className="flex space-x-2">
                                                    <input
                                                      type="text"
                                                      placeholder="IP Address (e.g., 192.168.1.1 or 192.168.1.0/24)"
                                                      className="flex-1 bg-theme-surface border border-[var(--theme-background)] rounded-md px-3 py-2 text-sm focus:outline-none  "
                                                    />
                                                    <button className="px-2 py-1 bg-theme-surface border border-[var(--theme-background)] rounded-md text-sm hover:bg-gray-200">
                                                      Add
                                                    </button>
                                                  </div>
                                                  <div className="bg-theme-surface p-2 rounded text-xs text-[var(--theme-text)]">
                                                    Add one IP address or CIDR block per line. Leave empty to allow all IPs.
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                          
                                          <div className="flex justify-end">
                                            <button className="px-4 py-2 bg-[var(--theme-accent)] text-[var(--theme-primary)] text-sm font-medium rounded-md hover:bg-[color-mix(in_srgb,var(--theme-accent)_80%,var(--theme-background)_20%)] focus:outline-none  ">
                                              Save Security Settings
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                          
                                    {selectedTab === 'billing' && (
                                      <div className="bg-[var(--theme-background)] rounded-lg shadow-sm p-6">
                                        <h2 className="text-lg font-medium flex items-center mb-6">
                                          <CreditCard className="w-5 h-5 mr-2 text-[var(--theme-accent)]" />
                                          Billing & Monitoring
                                        </h2>
                                        
                                        <div className="space-y-6">
                                          <div>
                                            <h3 className="text-md font-medium mb-3">Billing Information</h3>
                                            <div className="space-y-4">
                                              <div className="flex items-center justify-between bg-theme-surface border border-[var(--theme-primary)] rounded-md px-4 py-3">
                                                <div className="flex items-center space-x-2">
                                                  <CreditCard className="w-5 h-5 text-[var(--theme-text)]" />
                                                  <span className="font-medium text-theme-primary">Visa ending in 4242</span>
                                                  <span className="text-xs text-[var(--theme-text)]">Expires 04/2025</span>
                                                </div>
                                                <button className="text-sm text-[var(--theme-accent)] hover:text-blue-800">Update</button>
                                              </div>
                                              
                                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="border rounded-lg p-4">
                                                  <h4 className="text-sm font-medium text-[var(--theme-text)] mb-1">Current Plan</h4>
                                                  <p className="text-lg font-semibold">Pro</p>
                                                  <p className="text-sm text-[var(--theme-text)]">$20/month</p>
                                                </div>
                                                
                                                <div className="border rounded-lg p-4">
                                                  <h4 className="text-sm font-medium text-[var(--theme-text)] mb-1">Next Billing Date</h4>
                                                  <p className="text-lg font-semibold">May 15, 2023</p>
                                                  <p className="text-sm text-[var(--theme-text)]">Auto-renewal enabled</p>
                                                </div>
                                                
                                                <div className="border rounded-lg p-4">
                                                  <h4 className="text-sm font-medium text-[var(--theme-text)] mb-1">Usage This Month</h4>
                                                  <p className="text-lg font-semibold">$12.45</p>
                                                  <p className="text-sm text-[var(--theme-text)]">60% of plan limit</p>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                          
                                          <div className="border-t border-[var(--theme-primary)] pt-4">
                                            <h3 className="text-md font-medium mb-3">Monitoring & Alerts</h3>
                                            <div className="space-y-4">
                                              <div className="flex items-center">
                                                <input
                                                  type="checkbox"
                                                  id="monitor-enabled"
                                                  className="h-4 w-4 text-[var(--theme-accent)] focus:ring-blue-500 border-[var(--theme-background)] rounded"
                                                  defaultChecked
                                                />
                                                <label htmlFor="monitor-enabled" className="ml-2 block text-sm text-[var(--theme-text)]">
                                                  Enable Application Monitoring
                                                </label>
                                              </div>
                                              
                                              <div>
                                                <label className="block text-sm font-medium text-[var(--theme-text)] mb-1">Alert Thresholds</label>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                  <div>
                                                    <label className="block text-xs font-medium text-[var(--theme-text)] mb-1">CPU Usage</label>
                                                    <select
                                                      className="w-full bg-theme-surface border border-[var(--theme-background)] rounded-md px-3 py-2 text-sm focus:outline-none  "
                                                      defaultValue="80"
                                                    >
                                                      <option value="70">70%</option>
                                                      <option value="80">80%</option>
                                                      <option value="90">90%</option>
                                                    </select>
                                                  </div>
                                                  
                                                  <div>
                                                    <label className="block text-xs font-medium text-[var(--theme-text)] mb-1">Memory Usage</label>
                                                    <select
                                                      className="w-full bg-theme-surface border border-[var(--theme-background)] rounded-md px-3 py-2 text-sm focus:outline-none  "
                                                      defaultValue="80"
                                                    >
                                                      <option value="70">70%</option>
                                                      <option value="80">80%</option>
                                                      <option value="90">90%</option>
                                                    </select>
                                                  </div>
                                                  
                                                  <div>
                                                    <label className="block text-xs font-medium text-[var(--theme-text)] mb-1">Response Time</label>
                                                    <select
                                                      className="w-full bg-theme-surface border border-[var(--theme-background)] rounded-md px-3 py-2 text-sm focus:outline-none  "
                                                      defaultValue="500"
                                                    >
                                                      <option value="300">300ms</option>
                                                      <option value="500">500ms</option>
                                                      <option value="1000">1000ms</option>
                                                    </select>
                                                  </div>
                                                </div>
                                              </div>
                                              
                                              <div>
                                                <label className="block text-sm font-medium text-[var(--theme-text)] mb-1">Notification Channels</label>
                                                <div className="space-y-2">
                                                  <div className="flex items-center justify-between bg-theme-surface border border-[var(--theme-primary)] rounded-md px-4 py-3">
                                                    <div className="flex items-center space-x-2">
                                                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                      </svg>
                                                      <span className="font-medium text-theme-primary">admin@example.com</span>
                                                    </div>
                                                    <button className="text-sm text-[var(--theme-accent)] hover:text-blue-800">Edit</button>
                                                  </div>
                                                  
                                                  <div className="flex items-center justify-between bg-theme-surface border border-[var(--theme-primary)] rounded-md px-4 py-3">
                                                    <div className="flex items-center space-x-2">
                                                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                                      </svg>
                                                      <span className="font-medium text-theme-primary">Slack #alerts</span>
                                                    </div>
                                                    <button className="text-sm text-[var(--theme-accent)] hover:text-blue-800">Edit</button>
                                                  </div>
                                                  
                                                  <button className="flex items-center text-sm text-[var(--theme-accent)] hover:text-blue-800">
                                                    <Plus className="w-4 h-4 mr-1" />
                                                    Add Notification Channel
                                                  </button>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                          
                                          <div className="border-t border-[var(--theme-primary)] pt-4">
                                            <h3 className="text-md font-medium mb-3">Logging</h3>
                                            <div className="space-y-4">
                                              <div className="flex items-center">
                                                <input
                                                  type="checkbox"
                                                  id="log-enabled"
                                                  className="h-4 w-4 text-[var(--theme-accent)] focus:ring-blue-500 border-[var(--theme-background)] rounded"
                                                  defaultChecked
                                                />
                                                <label htmlFor="log-enabled" className="ml-2 block text-sm text-[var(--theme-text)]">
                                                  Enable Application Logging
                                               
                                               </label>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-[var(--theme-text)] mb-1">Log Retention</label>
                      <select
                        className="w-full bg-theme-surface border border-[var(--theme-background)] rounded-md px-3 py-2 text-sm focus:outline-none  "
                        defaultValue="30"
                      >
                        <option value="7">7 days</option>
                        <option value="14">14 days</option>
                        <option value="30">30 days</option>
                        <option value="60">60 days</option>
                        <option value="90">90 days</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-[var(--theme-text)] mb-1">Log Export</label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 p-3 border border-[var(--theme-primary)] rounded-lg">
                          <input
                            type="checkbox"
                            id="export-s3"
                            className="h-4 w-4 text-[var(--theme-accent)] focus:ring-blue-500 border-[var(--theme-background)] rounded"
                          />
                          <img src="https://www.vectorlogo.zone/logos/amazon_aws/amazon_aws-icon.svg" className="w-5 h-5" alt="AWS S3" />
                          <label htmlFor="export-s3" className="block text-sm text-[var(--theme-text)]">
                            AWS S3
                          </label>
                        </div>
                        
                        <div className="flex items-center space-x-2 p-3 border border-[var(--theme-primary)] rounded-lg">
                          <input
                            type="checkbox"
                            id="export-gcs"
                            className="h-4 w-4 text-[var(--theme-accent)] focus:ring-blue-500 border-[var(--theme-background)] rounded"
                          />
                          <img src="https://www.vectorlogo.zone/logos/google_cloud/google_cloud-icon.svg" className="w-5 h-5" alt="Google Cloud" />
                          <label htmlFor="export-gcs" className="block text-sm text-[var(--theme-text)]">
                            Google Cloud Storage
                          </label>
                        </div>
                        
                        <div className="flex items-center space-x-2 p-3 border border-[var(--theme-primary)] rounded-lg">
                          <input
                            type="checkbox"
                            id="export-elastic"
                            className="h-4 w-4 text-[var(--theme-accent)] focus:ring-blue-500 border-[var(--theme-background)] rounded"
                          />
                          <img src="https://www.vectorlogo.zone/logos/elastic/elastic-icon.svg" className="w-5 h-5" alt="Elastic" />
                          <label htmlFor="export-elastic" className="block text-sm text-[var(--theme-text)]">
                            Elasticsearch
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button className="px-4 py-2 bg-[var(--theme-accent)] text-[var(--theme-primary)] text-sm font-medium rounded-md hover:bg-[color-mix(in_srgb,var(--theme-accent)_80%,var(--theme-background)_20%)] focus:outline-none  ">
                    Save Monitoring Settings
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-[var(--theme-background)] border-t border-[var(--theme-primary)] px-6 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-[var(--theme-text)]">
        <div className="flex items-center mb-2 sm:mb-0">
          <Clock className="w-4 h-4 mr-2" />
          <span>Last Deployed: 2 hours ago</span>
        </div>
        <div className="flex items-center mb-2 sm:mb-0">
          <GitBranch className="w-4 h-4 mr-2" />
          <span>Production: main@a1b2c3d</span>
        </div>
        <div className="flex items-center">
          <Cloud className="w-4 h-4 mr-2" />
          <span>Provider: AWS (us-east-1)</span>
        </div>
        <div className="flex items-center">
          <Globe className="w-4 h-4 mr-2" />
          <span>my-nextjs-app.example.com</span>
        </div>
        <div className="flex items-center">
          <AlertCircle className="w-4 h-4 mr-2 text-green-500" />
          <span>All systems operational</span>
        </div>
      </div>
    </div>
    </AuthGuard>
  );
};

export default EnhancedDeploymentUI;