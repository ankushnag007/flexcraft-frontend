"use client"
import { useState, useEffect, useRef } from 'react';
import { 
  Github, Download, ArrowRight, Check, Code, Cpu, Database, Layers, 
  File, Folder, ChevronDown, ChevronRight, Settings, MessageSquare, 
  Send, Plus, HardDriveUpload, UploadCloud, X, Maximize, Minimize,
  Search, Terminal, Zap, Palette, Eye, Moon, Sun, Trash2, Edit, Save,
  EyeIcon
} from 'lucide-react';
import Editor from '@monaco-editor/react';
import { Link } from 'react-router-dom';
import Loader from './Loader';
import { useNavigate } from 'react-router-dom';
import AnimationtedLogo from '../Assets/images/animated logo.gif';

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
  name: string;
  path: string;
  children?: FileNode[];
}

// Theme definitions
type Theme = 'light' | 'dark' | 'blue' | 'green' | 'purple' | 'hc-black';
type ThemeColors = {
  bgPrimary: string;
  bgSecondary: string;
  bgTertiary: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  accent: string;
  accentHover: string;
};

const themes: Record<Theme, ThemeColors> = {
  light: {
    bgPrimary: 'bg-white',
    bgSecondary: 'bg-gray-100',
    bgTertiary: 'bg-gray-200',
    textPrimary: 'text-gray-900',
    textSecondary: 'text-gray-600',
    border: 'border-gray-300',
    accent: 'bg-blue-600',
    accentHover: 'hover:bg-blue-700',
  },
  dark: {
    bgPrimary: 'bg-[#1f1f1f]',
    bgSecondary: 'bg-[#252525]',
    bgTertiary: 'bg-[#2d2d2d]',
    textPrimary: 'text-gray-100',
    textSecondary: 'text-gray-400',
    border: 'border-gray-700',
    accent: 'bg-blue-600',
    accentHover: 'hover:bg-blue-700',
  },
  blue: {
    bgPrimary: 'bg-[#0a1929]',
    bgSecondary: 'bg-[#001e3c]',
    bgTertiary: 'bg-[#132f4c]',
    textPrimary: 'text-[#e6f7ff]',
    textSecondary: 'text-[#66b2ff]',
    border: 'border-[#1e4976]',
    accent: 'bg-[#007fff]',
    accentHover: 'hover:bg-[#0059b2]',
  },
  green: {
    bgPrimary: 'bg-[#0a1f0a]',
    bgSecondary: 'bg-[#0d2c0d]',
    bgTertiary: 'bg-[#143d14]',
    textPrimary: 'text-[#e6ffe6]',
    textSecondary: 'text-[#66ff66]',
    border: 'border-[#1e761e]',
    accent: 'bg-[#00cc00]',
    accentHover: 'hover:bg-[#009900]',
  },
  purple: {
    bgPrimary: 'bg-[#1a0a2e]',
    bgSecondary: 'bg-[#2a0a4e]',
    bgTertiary: 'bg-[#3a146e]',
    textPrimary: 'text-[#f5e6ff]',
    textSecondary: 'text-[#c266ff]',
    border: 'border-[#4a1e96]',
    accent: 'bg-[#8a2be2]',
    accentHover: 'hover:bg-[#6a1fc2]',
  },
  'hc-black': {
    bgPrimary: 'bg-black',
    bgSecondary: 'bg-[#121212]',
    bgTertiary: 'bg-[#1e1e1e]',
    textPrimary: 'text-white',
    textSecondary: 'text-[#f0f0f0]',
    border: 'border-[#444]',
    accent: 'bg-[#ff4081]',
    accentHover: 'hover:bg-[#ff0055]',
  }
};

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

  // Theme state
  const [theme, setTheme] = useState<Theme>('dark');
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [editorTheme, setEditorTheme] = useState('');
  const [showPreview, setShowPreview] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [activeTerminal, setActiveTerminal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemType, setNewItemType] = useState<'file' | 'folder' | null>(null);
  const [newItemPath, setNewItemPath] = useState('');
  const [fileStructure, setFileStructure] = useState<FileNode[]>([]);
  const [codeContent, setCodeContent] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Get current theme colors
  const themeColors = themes[theme];

  // Set Monaco editor theme based on UI theme
  useEffect(() => {
    if (theme === 'light') {
      setEditorTheme('vs');
    } else if (theme === 'blue') {
      setEditorTheme('vs-dark');
    } else if (theme === 'green') {
      setEditorTheme('vs-dark');
    } else if (theme === 'purple') {
      setEditorTheme('vs-dark');
    } else if (theme === 'hc-black') {
      setEditorTheme('hc-black');
    } else {
      setEditorTheme('vs-dark');
    }
  }, [theme]);

  // Initialize file structure
  useEffect(() => {
    if (step === 'result') {
      const initialStructure = generateInitialFileStructure();
      setFileStructure(initialStructure);
      
      const initialCode = generateInitialCodeContent();
      setCodeContent(initialCode);
    }
  }, [step]);

  // Generate initial file structure
  const generateInitialFileStructure = (): FileNode[] => {
    return [
      {
        type: 'folder',
        name: projectName,
        path: projectName,
        children: [
          {
            type: 'folder',
            name: 'client',
            path: `${projectName}/client`,
            children: [
              {
                type: 'folder',
                name: 'src',
                path: `${projectName}/client/src`,
                children: [
                  { type: 'file', name: 'App.jsx', path: `${projectName}/client/src/App.jsx` },
                  { type: 'file', name: 'index.js', path: `${projectName}/client/src/index.js` },
                  { type: 'file', name: 'styles.css', path: `${projectName}/client/src/styles.css` }
                ]
              },
              {
                type: 'folder',
                name: 'public',
                path: `${projectName}/client/public`,
                children: [
                  { type: 'file', name: 'index.html', path: `${projectName}/client/public/index.html` }
                ]
              },
              { type: 'file', name: 'package.json', path: `${projectName}/client/package.json` }
            ]
          },
          {
            type: 'folder',
            name: 'server',
            path: `${projectName}/server`,
            children: [
              { type: 'file', name: 'index.js', path: `${projectName}/server/index.js` },
              { type: 'file', name: 'package.json', path: `${projectName}/server/package.json` },
              {
                type: 'folder',
                name: 'routes',
                path: `${projectName}/server/routes`,
                children: [
                  { type: 'file', name: 'api.js', path: `${projectName}/server/routes/api.js` }
                ]
              }
            ]
          },
          { type: 'file', name: 'README.md', path: `${projectName}/README.md` },
          { type: 'file', name: 'package.json', path: `${projectName}/package.json` },
          { type: 'file', name: '.gitignore', path: `${projectName}/.gitignore` }
        ]
      }
    ];
  };

  // Generate initial code content
  const generateInitialCodeContent = (): Record<string, string> => {
    return {
      [`${projectName}/server/index.js`]: `const express = require('express');
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
      [`${projectName}/client/App.jsx`]: `import React from 'react';
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
      [`${projectName}/README.md`]: `# ${projectName}

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
  };

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

  const toggleFolder = (path: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [path]: !prev[path]
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

  // Handle code change in editor
  const handleCodeChange = (path: string, value: string | undefined) => {
    if (value === undefined) return;
    
    setCodeContent(prev => ({
      ...prev,
      [path]: value
    }));
  };

  // Save file content
  const handleSaveFile = () => {
    setIsSaving(true);
    // Simulate save operation
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  // Add new file or folder
  const startAddNewItem = (type: 'file' | 'folder', path: string) => {
    setNewItemType(type);
    setNewItemPath(path);
    setNewItemName('');
    setIsEditing(true);
  };

  // Confirm adding new item
  const confirmAddNewItem = () => {
    if (!newItemName.trim() || !newItemType || !newItemPath) {
      setIsEditing(false);
      return;
    }

    const newItem: FileNode = {
      type: newItemType,
      name: newItemName,
      path: `${newItemPath}/${newItemName}`
    };

    // Update file structure
    const updateStructure = (nodes: FileNode[]): FileNode[] => {
      return nodes.map(node => {
        if (node.path === newItemPath && node.type === 'folder') {
          return {
            ...node,
            children: [
              ...(node.children || []),
              newItem
            ]
          };
        } else if (node.children) {
          return {
            ...node,
            children: updateStructure(node.children)
          };
        }
        return node;
      });
    };

    setFileStructure(prev => updateStructure(prev));

    // If it's a file, add to codeContent
    if (newItemType === 'file') {
      setCodeContent(prev => ({
        ...prev,
        [newItem.path]: `// New ${newItem.name} file\n`
      }));
    }

    // Reset state
    setIsEditing(false);
    setNewItemType(null);
    setNewItemName('');
    setNewItemPath('');

    // Expand the parent folder
    setExpandedFolders(prev => ({
      ...prev,
      [newItemPath]: true
    }));
  };

  // Delete a file or folder
  const deleteItem = (path: string, type: 'file' | 'folder') => {
    const isConfirmed = window.confirm(`Are you sure you want to delete this ${type}?`);
    if (!isConfirmed) return;

    const updateStructure = (nodes: FileNode[]): FileNode[] => {
      return nodes.filter(node => {
        if (node.path === path) return false;
        if (node.children) {
          node.children = updateStructure(node.children);
        }
        return true;
      });
    };

    setFileStructure(prev => updateStructure(prev));

    // If it's a file, remove from codeContent
    if (type === 'file') {
      const newCodeContent = { ...codeContent };
      delete newCodeContent[path];
      setCodeContent(newCodeContent);

      // If the deleted file was selected, clear selection
      if (selectedFile === path) {
        setSelectedFile('');
      }
    }
  };

  // Render file tree recursively
  const renderFileTree = (nodes: FileNode[]) => {
    return nodes.map(node => {
      const isExpanded = expandedFolders[node.path];
      
      if (node.type === 'folder') {
        return (
          <div key={node.path} className="pl-4">
            <div 
              className={`flex items-center py-1 hover:${themeColors.bgTertiary} rounded cursor-pointer ${themeColors.textPrimary} group`}
              onClick={() => toggleFolder(node.path)}
            >
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              <Folder size={16} className="ml-1 mr-2 text-blue-400" />
              <span className="text-sm flex-1">{node.name}</span>
              
              <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  className="p-1 rounded hover:bg-gray-600 ml-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    startAddNewItem('file', node.path);
                  }}
                  title="Add file"
                >
                  <File size={12} />
                </button>
                <button 
                  className="p-1 rounded hover:bg-gray-600 ml-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    startAddNewItem('folder', node.path);
                  }}
                  title="Add folder"
                >
                  <Folder size={12} />
                </button>
                <button 
                  className="p-1 rounded hover:bg-red-900/50 ml-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteItem(node.path, 'folder');
                  }}
                  title="Delete folder"
                >
                  <Trash2 size={12} className="text-red-400" />
                </button>
              </div>
            </div>
            {isExpanded && node.children && (
              <div className="ml-2">
                {renderFileTree(node.children)}
              </div>
            )}
          </div>
        );
      } else {
        return (
          <div 
            key={node.path} 
            className={`flex items-center py-1 pl-6 hover:${themeColors.bgTertiary} rounded cursor-pointer ${themeColors.textPrimary} group ${selectedFile === node.path ? themeColors.bgTertiary : ''}`}
            onClick={() => setSelectedFile(node.path)}
          >
            <File size={16} className="mr-2 text-gray-400" />
            <span className="text-sm flex-1">{node.name}</span>
            
            <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                className="p-1 rounded hover:bg-red-900/50 ml-1"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteItem(node.path, 'file');
                }}
                title="Delete file"
              >
                <Trash2 size={12} className="text-red-400" />
              </button>
            </div>
          </div>
        );
      }
    });
  };

  const renderCustomizationPanel = () => (
    <div className={`w-96 border-r ${themeColors.border} ${themeColors.bgSecondary} flex flex-col h-full ${showCustomizationPanel ? 'flex' : 'hidden'}`}>
      {/* Header */}
      <div className={`h-12 p-4 border-b ${themeColors.border} flex justify-between items-center ${themeColors.bgSecondary} flex-shrink-0`}>
        <h3 className={`font-medium ${themeColors.textPrimary}`}>Customize with AI</h3>
        <button 
          onClick={() => setShowCustomizationPanel(false)}
          className={`p-1 rounded hover:${themeColors.bgTertiary} ${themeColors.textSecondary}`}
        >
          <ChevronRight size={18} />
        </button>
      </div>
      
      {/* Scrollable content area */}
      <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${themeColors.bgPrimary} custom-scrollbar`}>
        {customizationPrompts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <div className={`rounded-full p-3 mb-4 ${themeColors.bgTertiary}`}>
              <MessageSquare size={24} className="text-blue-500" />
            </div>
            <p className={themeColors.textSecondary}>How would you like to modify your code?</p>
            <p className={`text-sm mb-4 ${themeColors.textSecondary}`}>Examples:</p>
            <ul className="text-xs space-y-2 mt-2 text-left w-full max-w-xs">
              <li className={`p-3 rounded-lg ${themeColors.bgTertiary} ${themeColors.textSecondary}`}>"Add user authentication"</li>
              <li className={`p-3 rounded-lg ${themeColors.bgTertiary} ${themeColors.textSecondary}`}>"Change the color scheme to dark mode"</li>
              <li className={`p-3 rounded-lg ${themeColors.bgTertiary} ${themeColors.textSecondary}`}>"Add a new API endpoint for products"</li>
            </ul>
          </div>
        ) : (
          customizationPrompts.map((item) => (
            <div key={item.id} className="space-y-3">
              <div className={`p-3 rounded-lg border ${
                theme === 'blue' ? 'bg-blue-900/30 border-blue-800/50 text-blue-200' : 
                theme === 'green' ? 'bg-green-900/30 border-green-800/50 text-green-200' : 
                theme === 'purple' ? 'bg-purple-900/30 border-purple-800/50 text-purple-200' : 
                theme === 'hc-black' ? 'bg-red-900/30 border-red-800/50 text-red-200' : 
                'bg-blue-900/30 border-blue-800/50 text-blue-200'
              }`}>
                <p className="text-sm">{item.prompt}</p>
              </div>
              {item.response ? (
                <div className={`p-3 rounded-lg border ${themeColors.bgTertiary} ${themeColors.border}`}>
                  <p className={`text-sm ${themeColors.textPrimary}`}>{item.response}</p>
                </div>
              ) : (
                <div className="flex items-center justify-center py-2">
                  <div className="animate-pulse flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      theme === 'blue' ? 'bg-blue-500' : 
                      theme === 'green' ? 'bg-green-500' : 
                      theme === 'purple' ? 'bg-purple-500' : 
                      theme === 'hc-black' ? 'bg-red-500' : 
                      'bg-blue-500'
                    }`}></div>
                    <div className={`w-2 h-2 rounded-full ${
                      theme === 'blue' ? 'bg-blue-500' : 
                      theme === 'green' ? 'bg-green-500' : 
                      theme === 'purple' ? 'bg-purple-500' : 
                      theme === 'hc-black' ? 'bg-red-500' : 
                      'bg-blue-500'
                    }`}></div>
                    <div className={`w-2 h-2 rounded-full ${
                      theme === 'blue' ? 'bg-blue-500' : 
                      theme === 'green' ? 'bg-green-500' : 
                      theme === 'purple' ? 'bg-purple-500' : 
                      theme === 'hc-black' ? 'bg-red-500' : 
                      'bg-blue-500'
                    }`}></div>
                    <span className={`text-sm ml-2 ${themeColors.textSecondary}`}>AI is thinking...</span>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Footer */}
      <form onSubmit={handlePromptSubmit} className={`p-4 border-t ${themeColors.border} ${themeColors.bgSecondary} flex-shrink-0`}>
        <div className="relative">
          <input
            type="text"
            value={currentPrompt}
            onChange={(e) => setCurrentPrompt(e.target.value)}
            className={`w-full border ${themeColors.border} rounded-lg pl-4 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${themeColors.bgTertiary} ${themeColors.textPrimary}`}
            placeholder="How would you like to modify your code?"
            disabled={isProcessing}
          />
          <button 
            type="submit"
            disabled={isProcessing || !currentPrompt.trim()}
            className={`absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full p-2 ${
              currentPrompt.trim() ? `${themeColors.accent} ${themeColors.accentHover}` : `${themeColors.bgTertiary} ${themeColors.textSecondary}`
            }`}
          >
            <Send size={18} className="text-white" />
          </button>
        </div>
      </form>
    </div>
  );
  const handleThemeChange = (themeKey: Theme) => {
    setTheme(themeKey);
    setShowThemeSelector(false);
  };
  
  // Then in the button:

  const renderThemeSelector = () => (
    <div className="absolute right-0 top-10 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 z-10">
      <div className="py-1">
      {Object.entries(themes).map(([themeKey, themeData]) => (
  <button
    key={themeKey}
    onClick={() => {
      setTheme(themeKey as Theme);
      setShowThemeSelector(false); // Close popup on selection
    }}
    className={`w-full text-left px-4 py-2 text-sm flex items-center ${
      theme === themeKey 
        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100' 
        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
    }`}
  >
    <span className="w-3 h-3 rounded-full mr-2" style={{
      backgroundColor: 
        themeKey === 'light' ? '#f3f4f6' : 
        themeKey === 'dark' ? '#1f2937' : 
        themeKey === 'blue' ? '#0a1929' : 
        themeKey === 'green' ? '#0a1f0a' : 
        themeKey === 'purple' ? '#1a0a2e' : 
        '#000'
    }}></span>
    {themeKey.charAt(0).toUpperCase() + themeKey.slice(1)}
  </button>
))}
      </div>
    </div>
  );

  const renderResultScreen = () => (
    <div className={`flex flex-1 h-full overflow-hidden ${themeColors.bgPrimary} ${isFullScreen ? 'fixed inset-0 z-50' : ''}`}>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${theme === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'};
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${theme === 'light' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)'};
          border-radius: 4px;
          border: 1px solid ${theme === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'};
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${theme === 'light' ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.3)'};
        }
      `}</style>
      
      {renderCustomizationPanel()}
      <div className={`flex-1 flex flex-col h-[calc(105vh-48px)] ${showCustomizationPanel ? '' : ''}`}>
        {/* Header */}
        <div className={`h-12 flex justify-between items-center px-4 border-b ${themeColors.border} ${themeColors.bgSecondary} flex-shrink-0`}>
          <div className="flex items-center gap-2">
            {!showCustomizationPanel && (
              <button 
                onClick={() => setShowCustomizationPanel(true)}
                className={`p-2 rounded hover:${themeColors.bgTertiary} ${themeColors.textPrimary}`}
              >
                <MessageSquare size={18} />
              </button>
            )}
            <div className={`flex items-center gap-1 text-sm font-medium ${themeColors.textSecondary}`}>
              <span className={themeColors.textSecondary}>{projectName}</span>
              <ChevronRight size={14} className={themeColors.textSecondary} />
              <span className={themeColors.textPrimary}>Files</span>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <button 
                className="px-3 py-1 text-xs rounded flex items-center gap-1"
                onClick={() => setShowThemeSelector(!showThemeSelector)}
                style={{
                  backgroundColor: themes[theme].accent.replace('bg-', ''),
                  color: 'white'
                }}
              >
                <Palette size={14} /> Theme
              </button>
              {showThemeSelector ? renderThemeSelector() : null}
            </div>
            <button className={`px-3 py-1 text-xs rounded flex items-center gap-1 ${themeColors.bgTertiary} ${themeColors.textPrimary} hover:${themeColors.bgTertiary}`}>
              <Github size={14} /> Push
            </button>
            <button className={`px-3 py-1 text-xs rounded flex items-center gap-1 ${themeColors.bgTertiary} ${themeColors.textPrimary} hover:${themeColors.bgTertiary}`}>
              <Download size={14} /> Export
            </button>
            <Link 
              className={`px-3 py-1 text-xs text-white rounded flex items-center gap-1 hover:opacity-90`}
              style={{ 
                background: `linear-gradient(to right, ${themes[theme].accent.replace('bg-', '')}, ${themes[theme].accentHover.replace('hover:', '').replace('bg-', '')})` 
              }}
              to={''} 
              onClick={handleDeployClick}
            >
              <HardDriveUpload size={14} /> Deploy
            </Link>
            <button 
              className={`p-1.5 rounded hover:${themeColors.bgTertiary} ${themeColors.textPrimary}`}
              onClick={() => setIsFullScreen(!isFullScreen)}
            >
              {isFullScreen ? <Minimize size={16} /> : <Maximize size={16} />}
            </button>
          </div>
        </div>
        
        <div className="flex flex-1 overflow-hidden">
          {/* File Explorer */}
          <div className={`w-64 border-r ${themeColors.border} ${themeColors.bgSecondary} flex flex-col`}>
            <div className={`p-2 border-b ${themeColors.border} flex items-center gap-2`}>
              <div className="relative w-full">
                <Search size={14} className={`absolute left-2 top-1/2 transform -translate-y-1/2 ${themeColors.textSecondary}`} />
                <input
                  type="text"
                  placeholder="Search files..."
                  className={`w-full text-xs pl-8 pr-2 py-1.5 ${themeColors.bgTertiary} border ${themeColors.border} rounded ${themeColors.textPrimary} focus:outline-none focus:border-blue-500`}
                />
              </div>
              <button className={`p-1.5 rounded hover:${themeColors.bgTertiary} ${themeColors.textPrimary}`}>
                <Settings size={14} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
              <div className="flex justify-between items-center mb-1 px-2">
                <div className={`font-medium text-xs ${themeColors.textSecondary}`}>Project Files</div>
                <div className="flex gap-1">
                  <button 
                    className={`p-1 ${themeColors.textSecondary} hover:${themeColors.textPrimary}`}
                    onClick={() => startAddNewItem('file', projectName)}
                    title="Add file"
                  >
                    <File size={14} />
                  </button>
                  <button 
                    className={`p-1 ${themeColors.textSecondary} hover:${themeColors.textPrimary}`}
                    onClick={() => startAddNewItem('folder', projectName)}
                    title="Add folder"
                  >
                    <Folder size={14} />
                  </button>
                </div>
              </div>
              
              {isEditing && (
                <div className="flex items-center p-1 pl-6">
                  <input
                    type="text"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    className={`flex-1 text-xs px-2 py-1 ${themeColors.bgTertiary} border ${themeColors.border} rounded ${themeColors.textPrimary} focus:outline-none focus:border-blue-500`}
                    placeholder={`New ${newItemType} name`}
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') confirmAddNewItem();
                      if (e.key === 'Escape') setIsEditing(false);
                    }}
                  />
                  <div className="flex ml-1">
                    <button 
                      className="p-1 text-green-500 hover:bg-gray-700 rounded"
                      onClick={confirmAddNewItem}
                      title="Confirm"
                    >
                      <Check size={14} />
                    </button>
                    <button 
                      className="p-1 text-gray-500 hover:bg-gray-700 rounded"
                      onClick={() => setIsEditing(false)}
                      title="Cancel"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              )}
              
              {renderFileTree(fileStructure)}
            </div>
            <div 
              className={`p-2 border-t ${themeColors.border} text-xs flex items-center gap-2 cursor-pointer hover:${themeColors.bgTertiary} ${activeTerminal ? themeColors.bgTertiary : ''}`}
              onClick={() => setActiveTerminal(!activeTerminal)}
            >
              <Terminal size={14} className="text-green-500" />
              <span className={themeColors.textSecondary}>Terminal</span>
              <button className={`ml-auto ${themeColors.textSecondary} hover:${themeColors.textPrimary}`}>
                <Plus size={14} />
              </button>
            </div>
            {activeTerminal && (
              <div className={`p-2 text-xs border-t ${themeColors.border} ${themeColors.bgPrimary}`}>
                <div className={`mb-1 ${themeColors.textSecondary}`}>$ npm start</div>
                <div className="text-green-500">Project running on http://localhost:3000</div>
              </div>
            )}
          </div>
          
          {/* Code Editor Area */}
          <div className={`flex-1 flex flex-col ${themeColors.bgPrimary}`}>
            {/* File Tabs */}
            <div className={`flex border-b ${themeColors.border} ${themeColors.bgSecondary} overflow-x-auto`}>
              {Object.keys(codeContent).map(file => (
                <div 
                  key={file}
                  className={`flex items-center px-3 py-2 text-xs border-r ${themeColors.border} cursor-pointer ${
                    selectedFile === file 
                      ? `${themeColors.bgPrimary} ${themeColors.textPrimary}` 
                      : `${themeColors.bgSecondary} ${themeColors.textSecondary} hover:${themeColors.bgTertiary}`
                  }`}
                  onClick={() => setSelectedFile(file)}
                >
                  <File size={12} className={`mr-1.5 ${themeColors.textSecondary}`} />
                  {file.split('/').pop()}
                  <button 
                    className="ml-2 p-0.5 rounded-full hover:bg-gray-700 text-gray-500 hover:text-gray-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteItem(file, 'file');
                    }}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              <button 
                className={`p-2 ${themeColors.textSecondary} hover:${themeColors.textPrimary}`}
                onClick={() => startAddNewItem('file', projectName)}
              >
                <Plus size={14} />
              </button>
              <div className="ml-auto p-2">
                <a 
                  href="https://github.com/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={`p-2 py-1 text-xs rounded flex items-center gap-2 ${themeColors.bgTertiary} ${themeColors.textPrimary}`}
                >
                  <EyeIcon size={14} className={themeColors.textSecondary} />
                  App preview
                </a>
              </div>
            </div>
            
            {/* Code Editor */}
            <div className="flex-1 flex overflow-hidden">
              <div className="flex-1">
                <Editor
                  height="100%"
                  language={getLanguage(selectedFile)}
                  value={codeContent[selectedFile] || ''}
                  theme={editorTheme}
                  onChange={(value) => handleCodeChange(selectedFile, value)}
                  options={{
                    readOnly: false,
                    minimap: { enabled: true },
                    fontSize: 14,
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    fontFamily: 'Fira Code, monospace',
                    wordWrap: 'on',
                    renderLineHighlight: 'all',
                    occurrencesHighlight: true,
                    matchBrackets: 'always',
                    scrollbar: {
                      vertical: 'auto',
                      horizontal: 'auto',
                      useShadows: true
                    }
                  }}
                />
              </div>
            </div>
            
            {/* Status Bar */}
            <div className={`border-t ${themeColors.border} p-1 px-3 ${themeColors.bgSecondary} flex justify-between items-center text-xs ${themeColors.textSecondary}`}>
              <div className="flex items-center gap-4">
                <span className={themeColors.textPrimary}>{selectedFile}</span>
                <span>{codeContent[selectedFile]?.split('\n').length || 0} lines</span>
                <span>UTF-8</span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleSaveFile}
                  className={`flex items-center gap-1 text-xs ${
                    theme === 'blue' ? 'text-blue-400 hover:text-blue-300' :
                    theme === 'green' ? 'text-green-400 hover:text-green-300' :
                    theme === 'purple' ? 'text-purple-400 hover:text-purple-300' :
                    theme === 'hc-black' ? 'text-red-400 hover:text-red-300' :
                    'text-blue-400 hover:text-blue-300'
                  }`}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={12} /> Save
                    </>
                  )}
                </button>
                <button 
                  onClick={() => {
                    const newPrompt = `Modify the ${selectedFile} file to: `;
                    setCurrentPrompt(newPrompt);
                    setShowCustomizationPanel(true);
                  }}
                  className={`flex items-center gap-1 text-xs ${
                    theme === 'blue' ? 'text-blue-400 hover:text-blue-300' :
                    theme === 'green' ? 'text-green-400 hover:text-green-300' :
                    theme === 'purple' ? 'text-purple-400 hover:text-purple-300' :
                    theme === 'hc-black' ? 'text-red-400 hover:text-red-300' :
                    'text-blue-400 hover:text-blue-300'
                  }`}
                >
                  <Zap size={12} className="text-yellow-400" /> AI Assist
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Loader Overlay */}
      {showLoader && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="text-center">
            <img 
              src={AnimationtedLogo}
              alt="Preparing deployment"
              className="w-48 h-48 mx-auto mb-4 rounded-full"
            />
            <p className="text-lg font-medium text-gray-200">
              Preparing your deployment...
            </p>
            <p className="text-gray-400 mt-2">This may take a few seconds</p>
          </div>
        </div>
      )}
    </div>
  );

  // Helper function to get language for editor
  function getLanguage(fileName: string) {
    const extension = fileName.split('.').pop();
    switch (extension) {
      case 'js': return 'javascript';
      case 'jsx': return 'javascript';
      case 'ts': return 'typescript';
      case 'tsx': return 'typescript';
      case 'html': return 'html';
      case 'css': return 'css';
      case 'json': return 'json';
      case 'md': return 'markdown';
      default: return 'text';
    }
  }

  return (
    <div className={`min-h-screen ${themeColors.bgPrimary} ${themeColors.textPrimary}`}>
      <div className="max-w-20xl mx-auto h-full">
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
              <div className="relative">
                <button 
                  className="px-3 py-1 text-sm rounded-md bg-gray-200 hover:bg-gray-300 transition-colors flex items-center gap-1"
                  onClick={() => setShowThemeSelector(!showThemeSelector)}
                >
                  <Palette size={16} /> Theme
                </button>
                {showThemeSelector && renderThemeSelector()}
              </div>
            </div>
          </header>
        )}

        {step !== 'result' ? (
          <main className={`rounded-xl shadow-sm border ${themeColors.border} overflow-hidden ${theme === 'light' ? 'bg-white' : themeColors.bgSecondary}`}>
            <div className={`flex border-b ${themeColors.border}`}>
              {['Welcome', 'Stack', 'Features', 'Generate'].map((stepName, i) => {
                const stepIndex = ['welcome', 'framework', 'features', 'generate', 'result'].indexOf(step);
                const isActive = i <= stepIndex;
                return (
                  <div
                    key={stepName}
                    className={`flex-1 py-4 text-center border-r ${themeColors.border} last:border-r-0 ${
                      isActive ? 'text-blue-600 font-medium' : `${themeColors.textSecondary}`
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        isActive ? 'bg-blue-600 text-white' : `${themeColors.bgTertiary}`
                      }`}>
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
                  <p className={`mb-8 max-w-md mx-auto ${themeColors.textSecondary}`}>
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
                      <h3 className={`text-sm font-medium mb-3 flex items-center gap-2 ${themeColors.textSecondary}`}>
                        <Layers size={16} /> FRONTEND
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {(Object.keys(frameworkLogos) as Framework[]).map((fw) => (
                          <button
                            key={fw}
                            onClick={() => setFrontend(fw)}
                            className={`p-4 rounded-xl border transition-all flex flex-col items-center ${
                              frontend === fw 
                                ? 'border-blue-300 bg-blue-50 shadow-sm' 
                                : `border-gray-200 hover:border-gray-300 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`
                            }`}
                          >
                            <img src={frameworkLogos[fw]} alt={fw} className="w-10 h-10 mb-2" />
                            <span className="capitalize font-medium text-black">{fw}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className={`text-sm font-medium mb-3 flex items-center gap-2 ${themeColors.textSecondary}`}>
                        <Cpu size={16} /> BACKEND
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {(Object.keys(backendLogos) as Backend[]).map((be) => (
                          <button
                            key={be}
                            onClick={() => setBackend(be)}
                            className={`p-4 rounded-xl border transition-all flex flex-col items-center ${
                              backend === be 
                                ? 'border-blue-300 bg-blue-50 shadow-sm' 
                                : `border-gray-200 hover:border-gray-300 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`
                            }`}
                          >
                            <img src={backendLogos[be]} alt={be} className="w-10 h-10 mb-2" />
                            <span className="capitalize font-medium text-black">{be === 'node' ? 'Node.js' : be}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className={`text-sm font-medium mb-3 flex items-center gap-2 ${themeColors.textSecondary}`}>
                        <Database size={16} /> DATABASE
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {(Object.keys(databaseLogos) as Database[]).map((db) => (
                          <button
                            key={db}
                            onClick={() => setDatabase(db)}
                            className={`p-4 rounded-xl border transition-all flex flex-col items-center ${
                              database === db 
                                ? 'border-blue-300 bg-blue-50 shadow-sm' 
                                : `border-gray-200 hover:border-gray-300 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`
                            }`}
                          >
                            <img src={databaseLogos[db]} alt={db} className="w-10 h-10 mb-2" />
                            <span className="capitalize font-medium text-black">{db}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-between">
                    <button
                      onClick={() => setStep('welcome')}
                      className={`px-4 py-2 rounded-lg transition-colors ${themeColors.textSecondary} hover:${themeColors.bgTertiary}`}
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
                      <label className={`block text-sm font-medium mb-1 ${themeColors.textSecondary}`}>Project name</label>
                      <input
                        type="text"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        className={`w-full px-4 py-2 border ${themeColors.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${themeColors.bgTertiary} ${themeColors.textPrimary}`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${themeColors.textSecondary}`}>Description (optional)</label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className={`w-full px-4 py-2 border ${themeColors.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${themeColors.bgTertiary} ${themeColors.textPrimary}`}
                        rows={2}
                      />
                    </div>
                  </div>

                  <h3 className={`text-sm font-medium mb-3 ${themeColors.textSecondary}`}>Additional features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8 text-blue-500">
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
                      className={`px-4 py-2 rounded-lg transition-colors ${themeColors.textSecondary} hover:${themeColors.bgTertiary}`}
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
                  <p className={`mb-8 max-w-md mx-auto ${themeColors.textSecondary}`}>
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
          <footer className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            Made with ❤️ by CodeGen AI • Not affiliated with any framework
          </footer>
        )}
      </div>
    </div>
  );
} 