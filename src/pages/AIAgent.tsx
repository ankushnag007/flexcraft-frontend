import { useState, useEffect, useRef } from 'react';
import { 
  Github, Download, ArrowRight, Check, Code, Cpu, Database, Layers, 
  File, Folder, ChevronDown, ChevronRight, Settings, MessageSquare, 
  Send, Plus,
  HardDriveUpload,
  UploadCloud,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Loader from './Loader';
import { useNavigate } from 'react-router-dom';
import AnimationtedLogo from '../Assets/videos/images/animated logo.gif'

type Framework = 'react' | 'vue' | 'angular' | 'svelte';
type Backend = 'node' | 'django' | 'flask' | 'spring' | 'express';
type Database = 'mongodb' | 'postgresql' | 'mysql' | 'firebase' | 'sqlite';

const frameworkLogos = {
  react: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
  vue: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg',
  angular: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg',
  svelte: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/svelte/svelte-original.svg',
};

const backendLogos = {
  node: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
  django: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg',
  flask: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg',
  spring: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg',
  express: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg',
};

const databaseLogos = {
  mongodb: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
  postgresql: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
  mysql: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
  firebase: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg',
  sqlite: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg',
};

interface FileNode {
  type: 'file' | 'folder';
  children?: Record<string, FileNode>;
}

export default function CodeGenerator() {
  // Project configuration state
  const [step, setStep] = useState<'welcome' | 'framework' | 'features' | 'generate' | 'result'>('welcome');
  const [frontend, setFrontend] = useState<Framework>('react');
  const [backend, setBackend] = useState<Backend>('node');
  const [database, setDatabase] = useState<Database>('mongodb');
  const [projectName, setProjectName] = useState('my-awesome-app');
  const [description, setDescription] = useState('');
  const [features, setFeatures] = useState({
    auth: true,
    apiDocs: true,
    docker: false,
    testing: false,
    ciCd: false,
    eslint: true,
  });
  const [progress, setProgress] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const navigate = useNavigate();
  const [showLoader, setShowLoader] = useState(false);

  const handleDeployClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowLoader(true);
    
    setTimeout(() => {
      navigate('/deployment');
    }, 3000);
  };

  // Code viewer state
  const [selectedFile, setSelectedFile] = useState('server/index.js');
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    'my-awesome-app': true,
    'client': true,
    'server': true,
  });
  const [showCustomizationPanel, setShowCustomizationPanel] = useState(true);
  const [customizationPrompts, setCustomizationPrompts] = useState<Array<{
    id: string;
    prompt: string;
    response?: string;
  }>>([]);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [customizationPrompts]);

  useEffect(() => {
    if (isGenerating) {
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            setIsGenerating(false);
            setIsComplete(true);
            setStep('result');
            return 100;
          }
          return prev + 10;
        });
      }, 300);
      return () => clearInterval(timer);
    }
  }, [isGenerating]);

  const toggleFolder = (folderName: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderName]: !prev[folderName]
    }));
  };

  const startGenerating = () => {
    setIsGenerating(true);
    setProgress(0);
    setStep('generate');
  };

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPrompt.trim()) return;

    const newPrompt = {
      id: Date.now().toString(),
      prompt: currentPrompt,
    };

    setCustomizationPrompts([...customizationPrompts, newPrompt]);
    setCurrentPrompt('');
    setIsProcessing(true);

    // Simulate AI response
    setTimeout(() => {
      setCustomizationPrompts(prev => prev.map(p => 
        p.id === newPrompt.id 
          ? { ...p, response: `I'll help you modify the code to: "${currentPrompt}"` } 
          : p
      ));
      setIsProcessing(false);
    }, 1500);
  };

  const FeatureToggle = ({ id, label, icon }: { id: string; label: string; icon: React.ReactNode }) => (
    <button
      onClick={() => setFeatures({ ...features, [id]: !features[id as keyof typeof features] })}
      className={`flex items-center gap-3 p-3 rounded-lg transition-all ${features[id as keyof typeof features] ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 hover:bg-gray-100'}`}
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${features[id as keyof typeof features] ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-600'}`}>
        {icon}
      </div>
      <div className="text-left">
        <div className="font-medium">{label}</div>
        <div className="text-sm text-gray-500">
          {features[id as keyof typeof features] ? 'Included' : 'Not included'}
        </div>
      </div>
      <div className={`ml-auto w-5 h-5 rounded-full flex items-center justify-center ${features[id as keyof typeof features] ? 'bg-blue-600 text-white' : 'border border-gray-300'}`}>
        {features[id as keyof typeof features] && <Check size={14} />}
      </div>
    </button>
  );

  const fileStructure: Record<string, FileNode> = {
    [projectName]: {
      type: 'folder',
      children: {
        'client': {
          type: 'folder',
          children: {
            'src': {
              type: 'folder',
              children: {
                'App.jsx': { type: 'file' },
                'index.js': { type: 'file' },
                'styles.css': { type: 'file' }
              }
            },
            'public': {
              type: 'folder',
              children: {
                'index.html': { type: 'file' }
              }
            },
            'package.json': { type: 'file' }
          }
        },
        'server': {
          type: 'folder',
          children: {
            'index.js': { type: 'file' },
            'package.json': { type: 'file' },
            'routes': {
              type: 'folder',
              children: {
                'api.js': { type: 'file' }
              }
            }
          }
        },
        'README.md': { type: 'file' },
        'package.json': { type: 'file' },
        '.gitignore': { type: 'file' }
      }
    }
  };

  const codeContent: Record<string, string> = {
    'server/index.js': `const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect('mongodb://localhost:27017/${projectName}', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to ${projectName}' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});`,
    'client/App.jsx': `import React from 'react';
import './styles.css';

function App() {
  return (
    <div className="app">
      <h1>Welcome to ${projectName}</h1>
      <p>Start building your amazing application!</p>
    </div>
  );
}

export default App;`,
    'README.md': `# ${projectName}

${description || 'A full-stack application generated with CodeGen AI'}

## Features
- ${frontend} frontend
- ${backend} backend
- ${database} database
${features.auth ? '- Authentication\n' : ''}${features.apiDocs ? '- API Documentation\n' : ''}${features.docker ? '- Docker Setup\n' : ''}${features.testing ? '- Testing Framework\n' : ''}${features.ciCd ? '- CI/CD Pipeline\n' : ''}${features.eslint ? '- ESLint Setup\n' : ''}

## Getting Started
1. Install dependencies: \`npm install\`
2. Start development server: \`npm start\`
`
  };

  const renderFileTree = (structure: Record<string, FileNode>, path = '') => {
    return Object.entries(structure).map(([name, node]) => {
      const fullPath = path ? `${path}/${name}` : name;
      
      if (node.type === 'folder' && node.children) {
        const isExpanded = expandedFolders[name];
        return (
          <div key={fullPath} className="pl-4">
            <div 
              className="flex items-center py-1 hover:bg-gray-100 rounded cursor-pointer"
              onClick={() => toggleFolder(name)}
            >
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              <Folder size={16} className="ml-1 mr-2 text-blue-500" />
              <span>{name}</span>
            </div>
            {isExpanded && renderFileTree(node.children, fullPath)}
          </div>
        );
      } else {
        return (
          <div 
            key={fullPath} 
            className={`flex items-center py-1 pl-6 hover:bg-gray-100 rounded cursor-pointer ${selectedFile === fullPath ? 'bg-blue-50' : ''}`}
            onClick={() => setSelectedFile(fullPath)}
          >
            <File size={16} className="mr-2 text-gray-500" />
            <span>{name}</span>
          </div>
        );
      }
    });
  };

  const renderCustomizationPanel = () => (
    <div className={`w-96 border-r border-gray-200 bg-white flex flex-col h-full ${showCustomizationPanel ? 'flex' : 'hidden'}`}>
      {/* Header - same height as result screen header */}
      <div className="h-16 p-4 border-b border-gray-200 flex justify-between items-center bg-white flex-shrink-0">
        <h3 className="font-medium">Customize with AI</h3>
        <button 
          onClick={() => setShowCustomizationPanel(false)}
          className="p-1 rounded hover:bg-gray-100"
        >
          <ChevronRight size={18} />
        </button>
      </div>
      
      {/* Scrollable content area */}
      <div className="flex-1 overflow-y p-4 space-y-4 bg-gray-50">
        {customizationPrompts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
            <MessageSquare size={24} className="mb-2" />
            <p>How would you like to modify your code?</p>
            <p className="text-sm">Examples:</p>
            <ul className="text-xs space-y-1 mt-2">
              <li>"Add user authentication"</li>
              <li>"Change the color scheme to dark mode"</li>
              <li>"Add a new API endpoint for products"</li>
            </ul>
          </div>
        ) : (
          customizationPrompts.map((item) => (
            <div key={item.id} className="space-y-2">
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm">{item.prompt}</p>
              </div>
              {item.response ? (
                <div className="bg-gray-100 p-3 rounded-lg">
                  <p className="text-sm">{item.response}</p>
                </div>
              ) : (
                <div className="flex items-center justify-center py-2">
                  <div className="animate-pulse text-sm text-gray-500">AI is thinking...</div>
                </div>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Footer */}
      <form onSubmit={handlePromptSubmit} className="p-4 border-t border-gray-200 bg-white flex-shrink-0">
        <div className="relative">
          <input
            type="text"
            value={currentPrompt}
            onChange={(e) => setCurrentPrompt(e.target.value)}
            className="w-full border border-gray-300 rounded-full pl-4 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="How would you like to modify your code?"
            disabled={isProcessing}
          />
          <button 
            type="submit"
            disabled={isProcessing || !currentPrompt.trim()}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-600 hover:bg-blue-100 rounded-full p-1"
          >
            <Send size={18} color='black'/>
          </button>
        </div>
      </form>
    </div>
  );


// 

const renderResultScreen = () => (
  <div className="flex flex-1 h-full overflow-hidden bg-white">
    {renderCustomizationPanel()}
    <div className={`flex-1 flex flex-col h-full ${showCustomizationPanel ? '' : ''}`}>
      {/* Header */}
      <div className="h-16 flex justify-between items-center px-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-2">
          {!showCustomizationPanel && (
            <button 
              onClick={() => setShowCustomizationPanel(true)}
              className="p-2 rounded hover:bg-gray-100 text-gray-600"
            >
              <MessageSquare size={18} />
            </button>
          )}
          <div className="flex items-center gap-1 text-sm font-medium text-gray-600">
            <span className="text-gray-400">{projectName}</span>
            <ChevronRight size={14} className="text-gray-400" />
            <span>Files</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded flex items-center gap-1">
            <Github size={14} /> Push
          </button>
          <button className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded flex items-center gap-1">
            <Download size={14} /> Export
          </button>
          <Link 
            className="px-3 py-1 text-xs bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded flex items-center gap-1 hover:from-blue-600 hover:to-indigo-700" 
            to={''} 
            onClick={handleDeployClick}
          >
            <HardDriveUpload size={14} /> Deploy
          </Link>
        </div>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* File Explorer */}
        <div className="w-64 border-r bg-gray-50 flex flex-col">
          <div className="p-2 border-b border-gray-200 flex items-center gap-2">
            <input
              type="text"
              placeholder="Search files..."
              className="flex-1 text-xs px-2 py-1.5 bg-white border border-gray-300 rounded"
            />
            <button className="p-1.5 rounded hover:bg-gray-200">
              <Settings size={14} className="text-gray-600" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            <div className="font-medium text-xs text-gray-500 uppercase mb-1 px-2">Project Files</div>
            {renderFileTree({ [projectName]: fileStructure[projectName] })}
          </div>
        </div>
        
        {/* Code Editor Area */}
        <div className="flex-1 flex flex-col bg-white">
          {/* File Tabs */}
          <div className="flex border-b border-gray-200 bg-gray-50 overflow-x-auto">
            {Object.keys(codeContent).map(file => (
              <div 
                key={file}
                className={`flex items-center px-3 py-2 text-xs border-r border-gray-200 cursor-pointer ${selectedFile === file ? 'bg-white border-t-2 border-t-blue-500' : 'hover:bg-gray-100'}`}
                onClick={() => setSelectedFile(file)}
              >
                <File size={12} className="mr-1.5 text-gray-500" />
                {file.split('/').pop()}
                <button className="ml-2 p-0.5 rounded-full hover:bg-gray-200">
                  <X size={12} className="text-gray-500" />
                </button>
              </div>
            ))}
          </div>
          
          {/* Code Editor */}
          <div className="flex-1 flex overflow-hidden">
            <pre className="flex-1 p-4 overflow-auto bg-[#1e1e1e] text-gray-100 text-xs font-mono">
              <code>
                {codeContent[selectedFile].split('\n').map((line, i) => (
                  <div key={i} className="flex">
                    <span className="w-8 text-right pr-3 text-gray-500 select-none">{i + 1}</span>
                    <span>{line}</span>
                  </div>
                ))}
              </code>
            </pre>
            
            {/* File Preview (optional) */}
            {selectedFile.endsWith('.jsx') || selectedFile.endsWith('.js') ? (
              <div className="w-72 border-l border-gray-200 flex flex-col">
                <div className="p-2 border-b border-gray-200 text-xs font-medium">Preview</div>
                <div className="flex-1 p-4 overflow-auto bg-white">
                  <div className="text-center p-8 bg-gray-50 rounded">
                    <div className="text-sm text-gray-600">App Preview</div>
                    <div className="mt-4 p-4 border border-gray-300 rounded inline-block">
                      <div className="text-lg font-bold">Welcome to {projectName}</div>
                      <div className="mt-2 text-sm">Start building your amazing application!</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
          
          {/* Status Bar */}
          <div className="border-t p-1 px-3 bg-gray-50 flex justify-between items-center text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span>{selectedFile}</span>
              <span>{codeContent[selectedFile].length} chars</span>
              <span>{codeContent[selectedFile].split('\n').length} lines</span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  const newPrompt = `Modify the ${selectedFile} file to: `;
                  setCurrentPrompt(newPrompt);
                  setShowCustomizationPanel(true);
                }}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-xs"
              >
                <Plus size={12} /> Customize
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    {/* Loader Overlay */}
    {showLoader && (
      <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
        <div className="text-center">
          <img 
            src={AnimationtedLogo}
            alt="Preparing deployment"
            className="w-48 h-48 mx-auto mb-4 rounded-full"
          />
          <p className="text-lg font-medium text-gray-700">
            Preparing your deployment...
          </p>
        </div>
      </div>
    )}
  </div>
);
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900">
      <div className="max-w-20xl mx-auto p-2 h-full">
        {step !== 'result' && (
          <header className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Cpu size={18} />
              </div>
              <h1 className="text-xl font-semibold">CodeGen AI</h1>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-sm rounded-md bg-gray-200 hover:bg-gray-300 transition-colors">
                Docs
              </button>
              <button className="px-3 py-1 text-sm rounded-md bg-gray-200 hover:bg-gray-300 transition-colors">
                Examples
              </button>
            </div>
          </header>
        )}

        {step !== 'result' ? (
          <main className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex border-b border-gray-200">
              {['Welcome', 'Stack', 'Features', 'Generate'].map((stepName, i) => {
                const stepIndex = ['welcome', 'framework', 'features', 'generate', 'result'].indexOf(step);
                const isActive = i <= stepIndex;
                return (
                  <div
                    key={stepName}
                    className={`flex-1 py-4 text-center border-r border-gray-200 last:border-r-0 ${isActive ? 'text-blue-600 font-medium' : 'text-gray-500'}`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isActive ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                        {isActive ? <Check size={14} /> : i + 1}
                      </div>
                      {stepName}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-8 h-full">
              {step === 'welcome' && (
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
                    <Code size={32} />
                  </div>
                  <h2 className="text-2xl font-bold mb-3">Let's build something amazing</h2>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Our AI assistant will help you generate a full-stack application with your preferred tech stack in minutes.
                  </p>
                  <button
                    onClick={() => setStep('framework')}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
                  >
                    Get started <ArrowRight size={18} />
                  </button>
                </div>
              )}

              {step === 'framework' && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Choose your tech stack</h2>
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                        <Layers size={16} /> FRONTEND
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {(Object.keys(frameworkLogos) as Framework[]).map((fw) => (
                          <button
                            key={fw}
                            onClick={() => setFrontend(fw)}
                            className={`p-4 rounded-xl border transition-all flex flex-col items-center ${frontend === fw ? 'border-blue-300 bg-blue-50 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}
                          >
                            <img src={frameworkLogos[fw]} alt={fw} className="w-10 h-10 mb-2" />
                            <span className="capitalize font-medium">{fw}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                        <Cpu size={16} /> BACKEND
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {(Object.keys(backendLogos) as Backend[]).map((be) => (
                          <button
                            key={be}
                            onClick={() => setBackend(be)}
                            className={`p-4 rounded-xl border transition-all flex flex-col items-center ${backend === be ? 'border-blue-300 bg-blue-50 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}
                          >
                            <img src={backendLogos[be]} alt={be} className="w-10 h-10 mb-2" />
                            <span className="capitalize font-medium">{be === 'node' ? 'Node.js' : be}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                        <Database size={16} /> DATABASE
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {(Object.keys(databaseLogos) as Database[]).map((db) => (
                          <button
                            key={db}
                            onClick={() => setDatabase(db)}
                            className={`p-4 rounded-xl border transition-all flex flex-col items-center ${database === db ? 'border-blue-300 bg-blue-50 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}
                          >
                            <img src={databaseLogos[db]} alt={db} className="w-10 h-10 mb-2" />
                            <span className="capitalize font-medium">{db}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-between">
                    <button
                      onClick={() => setStep('welcome')}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setStep('features')}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {step === 'features' && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Customize your project</h2>
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Project name</label>
                      <input
                        type="text"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows={2}
                      />
                    </div>
                  </div>

                  <h3 className="text-sm font-medium text-gray-500 mb-3">Additional features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                    <FeatureToggle id="auth" label="Authentication" icon={<Check size={16} />} />
                    <FeatureToggle id="apiDocs" label="API Documentation" icon={<Code size={16} />} />
                    <FeatureToggle id="docker" label="Docker Setup" icon={<Layers size={16} />} />
                    <FeatureToggle id="testing" label="Testing Framework" icon={<Check size={16} />} />
                    <FeatureToggle id="ciCd" label="CI/CD Pipeline" icon={<Cpu size={16} />} />
                    <FeatureToggle id="eslint" label="ESLint Setup" icon={<Code size={16} />} />
                  </div>

                  <div className="flex justify-between">
                    <button
                      onClick={() => setStep('framework')}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={startGenerating}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Generate Project
                    </button>
                  </div>
                </div>
              )}

              {step === 'generate' && !isComplete && (
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
                    <Cpu size={32} />
                  </div>
                  <h2 className="text-2xl font-bold mb-3">Generating your project...</h2>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Our AI is assembling your perfect project structure.
                  </p>

                  <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </main>
        ) : (
          renderResultScreen()
        )}

        {step !== 'result' && (
          <footer className="mt-8 text-center text-sm text-gray-500">
            Made with ❤️ by CodeGen AI • Not affiliated with any framework
          </footer>
        )}
      </div>
    </div>
  );
}