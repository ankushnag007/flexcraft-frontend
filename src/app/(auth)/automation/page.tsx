"use client"
import React, { useState, useRef, useCallback, useMemo } from 'react';
import { 
  Zap, Plus, ChevronDown, ChevronRight, Clock, CheckCircle,
  AlertCircle, Pause, Play, Trash2, Edit2, Copy, Search, Mail, 
  Video, MessageSquare, Terminal, Calendar, UserPlus, Server, 
  Cloud, Bell, LayoutGrid, List, Settings, ArrowRight, MousePointer,
  Move, RotateCcw, Save, Eye, EyeOff, Maximize2
} from 'lucide-react';

type WorkflowStatus = 'active' | 'paused' | 'error' | 'draft';
type TriggerType = 'schedule' | 'webhook' | 'manual' | 'event';
type StepType = 'task' | 'email' | 'chat' | 'meeting' | 'deployment' | 'notification' | 'condition' | 'delay' | 'trigger';

interface NodePosition {
  x: number;
  y: number;
}

interface WorkflowNode {
  id: string;
  type: StepType;
  position: NodePosition;
  config: {
    title?: string;
    assignee?: string;
    to?: string;
    subject?: string;
    body?: string;
    channel?: string;
    message?: string;
    participants?: string[];
    duration?: number;
    environment?: string;
    notifyOn?: string;
    notificationType?: string;
    recipients?: string[];
    condition?: string;
    delay?: number;
    comment?: string;
    timing?: string;
  };
}

interface Connection {
  from: string;
  to: string;
  condition?: string;
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  status: WorkflowStatus;
  trigger: TriggerType;
  nodes: WorkflowNode[];
  connections: Connection[];
  lastRun: string | null;
  nextRun: string | null;
  createdAt: string;
}

const NODE_TYPES = [
  { type: 'trigger', label: 'Trigger', icon: <Zap className="w-4 h-4" />, color: 'bg-yellow-500', lightColor: 'bg-yellow-100 border-yellow-300' },
  { type: 'task', label: 'Task', icon: <CheckCircle className="w-4 h-4" />, color: 'bg-blue-500', lightColor: 'bg-blue-100 border-blue-300' },
  { type: 'email', label: 'Email', icon: <Mail className="w-4 h-4" />, color: 'bg-green-500', lightColor: 'bg-green-100 border-green-300' },
  { type: 'chat', label: 'Chat', icon: <MessageSquare className="w-4 h-4" />, color: 'bg-purple-500', lightColor: 'bg-purple-100 border-purple-300' },
  { type: 'meeting', label: 'Meeting', icon: <Video className="w-4 h-4" />, color: 'bg-red-500', lightColor: 'bg-red-100 border-red-300' },
  { type: 'deployment', label: 'Deploy', icon: <Terminal className="w-4 h-4" />, color: 'bg-orange-500', lightColor: 'bg-orange-100 border-orange-300' },
  { type: 'notification', label: 'Notify', icon: <Bell className="w-4 h-4" />, color: 'bg-indigo-500', lightColor: 'bg-indigo-100 border-indigo-300' },
  { type: 'condition', label: 'Condition', icon: <ChevronRight className="w-4 h-4" />, color: 'bg-pink-500', lightColor: 'bg-pink-100 border-pink-300' },
  { type: 'delay', label: 'Wait', icon: <Clock className="w-4 h-4" />, color: 'bg-gray-500', lightColor: 'bg-gray-100 border-gray-300' }
];

const TEMPLATES = [
  {
    name: "Bug Triage Flow",
    description: "Automate bug report handling",
    nodes: [
      { id: 'trigger-1', type: 'trigger', position: { x: 100, y: 200 }, config: { title: 'Bug Report Received' } },
      { id: 'task-1', type: 'task', position: { x: 300, y: 200 }, config: { title: 'Triage Bug', assignee: 'QA Lead' } },
      { id: 'email-1', type: 'email', position: { x: 500, y: 150 }, config: { to: 'dev@example.com', subject: 'New Bug Report' } },
      { id: 'notification-1', type: 'notification', position: { x: 500, y: 250 }, config: { notificationType: 'alert', title: 'Bug Alert' } }
    ],
    connections: [
      { from: 'trigger-1', to: 'task-1' },
      { from: 'task-1', to: 'email-1' },
      { from: 'task-1', to: 'notification-1' }
    ]
  },
  {
    name: "Deploy Pipeline",
    description: "Automated deployment workflow",
    nodes: [
      { id: 'trigger-1', type: 'trigger', position: { x: 100, y: 200 }, config: { title: 'Code Push' } },
      { id: 'deployment-1', type: 'deployment', position: { x: 300, y: 200 }, config: { environment: 'staging' } },
      { id: 'condition-1', type: 'condition', position: { x: 500, y: 200 }, config: { condition: 'Tests Pass' } },
      { id: 'deployment-2', type: 'deployment', position: { x: 700, y: 150 }, config: { environment: 'production' } },
      { id: 'notification-1', type: 'notification', position: { x: 700, y: 250 }, config: { notificationType: 'alert', title: 'Deploy Failed' } }
    ],
    connections: [
      { from: 'trigger-1', to: 'deployment-1' },
      { from: 'deployment-1', to: 'condition-1' },
      { from: 'condition-1', to: 'deployment-2', condition: 'success' },
      { from: 'condition-1', to: 'notification-1', condition: 'failure' }
    ]
  }
];

const WorkflowAutomation: React.FC = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([
    {
      id: '1',
      name: 'Bug Triage Workflow',
      description: 'Automatically triage and assign bugs',
      status: 'active',
      trigger: 'event',
      nodes: [
        { id: 'trigger-1', type: 'trigger', position: { x: 100, y: 200 }, config: { title: 'Bug Report' } },
        { id: 'task-1', type: 'task', position: { x: 300, y: 200 }, config: { title: 'Triage Bug', assignee: 'QA Lead' } },
        { id: 'email-1', type: 'email', position: { x: 500, y: 200 }, config: { to: 'dev@example.com', subject: 'New Bug' } }
      ],
      connections: [
        { from: 'trigger-1', to: 'task-1' },
        { from: 'task-1', to: 'email-1' }
      ],
      lastRun: new Date().toISOString(),
      nextRun: null,
      createdAt: '2023-01-15'
    }
  ]);

  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<WorkflowStatus | 'all'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState<'workflows' | 'templates' | 'editor'>('workflows');
  const [editorMode, setEditorMode] = useState<'design' | 'preview'>('design');
  
  // Node editor state
  const [currentWorkflow, setCurrentWorkflow] = useState<Workflow | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStart, setConnectionStart] = useState<string | null>(null);
  const [newConnection, setNewConnection] = useState<{ from: string; to: string } | null>(null);
  
  const editorRef = useRef<HTMLDivElement>(null);
  const [editorOffset, setEditorOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  // Filter workflows
  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch = workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         workflow.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || workflow.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Get node type info
  const getNodeTypeInfo = (type: StepType) => {
    return NODE_TYPES.find(nt => nt.type === type) || NODE_TYPES[0];
  };

  // Handle node drag
  const handleNodeMouseDown = useCallback((e: React.MouseEvent, nodeId: string) => {
    if (isConnecting) return;
    
    e.preventDefault();
    const rect = editorRef.current?.getBoundingClientRect();
    if (!rect || !currentWorkflow) return;

    const node = currentWorkflow.nodes.find(n => n.id === nodeId);
    if (!node) return;

    setDraggedNode(nodeId);
    setSelectedNode(nodeId);
    setDragOffset({
      x: e.clientX - rect.left - node.position.x * zoom - editorOffset.x,
      y: e.clientY - rect.top - node.position.y * zoom - editorOffset.y
    });
  }, [isConnecting, currentWorkflow, zoom, editorOffset]);

  // Handle mouse move for dragging
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!draggedNode || !currentWorkflow) return;

    const rect = editorRef.current?.getBoundingClientRect();
    if (!rect) return;

    const newX = (e.clientX - rect.left - dragOffset.x - editorOffset.x) / zoom;
    const newY = (e.clientY - rect.top - dragOffset.y - editorOffset.y) / zoom;

    setCurrentWorkflow(prev => prev ? {
      ...prev,
      nodes: prev.nodes.map(node => 
        node.id === draggedNode 
          ? { ...node, position: { x: Math.max(0, newX), y: Math.max(0, newY) } }
          : node
      )
    } : null);
  }, [draggedNode, dragOffset, zoom, editorOffset, currentWorkflow]);

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    setDraggedNode(null);
    setDragOffset({ x: 0, y: 0 });
  }, []);

  // Add new node
  const addNode = (type: StepType) => {
    if (!currentWorkflow) return;

    const newNode: WorkflowNode = {
      id: `${type}-${Date.now()}`,
      type,
      position: { x: 100 + Math.random() * 200, y: 100 + Math.random() * 200 },
      config: {
        title: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
        comment: '',
        timing: type === 'delay' ? '5 minutes' : 'immediate'
      }
    };

    setCurrentWorkflow({
      ...currentWorkflow,
      nodes: [...currentWorkflow.nodes, newNode]
    });
  };

  // Delete node
  const deleteNode = (nodeId: string) => {
    if (!currentWorkflow) return;

    setCurrentWorkflow({
      ...currentWorkflow,
      nodes: currentWorkflow.nodes.filter(n => n.id !== nodeId),
      connections: currentWorkflow.connections.filter(c => c.from !== nodeId && c.to !== nodeId)
    });
    setSelectedNode(null);
  };

  // Start connection
  const startConnection = (nodeId: string) => {
    setIsConnecting(true);
    setConnectionStart(nodeId);
  };

  // End connection
  const endConnection = (nodeId: string) => {
    if (!connectionStart || connectionStart === nodeId || !currentWorkflow) {
      setIsConnecting(false);
      setConnectionStart(null);
      return;
    }

    // Check if connection already exists
    const exists = currentWorkflow.connections.some(c => c.from === connectionStart && c.to === nodeId);
    if (!exists) {
      setCurrentWorkflow({
        ...currentWorkflow,
        connections: [...currentWorkflow.connections, { from: connectionStart, to: nodeId }]
      });
    }

    setIsConnecting(false);
    setConnectionStart(null);
  };

  // Update node config
  const updateNodeConfig = (nodeId: string, config: any) => {
    if (!currentWorkflow) return;

    setCurrentWorkflow({
      ...currentWorkflow,
      nodes: currentWorkflow.nodes.map(node => 
        node.id === nodeId ? { ...node, config: { ...node.config, ...config } } : node
      )
    });
  };

  // Save workflow
  const saveWorkflow = () => {
    if (!currentWorkflow) return;

    setWorkflows(prev => {
      const index = prev.findIndex(w => w.id === currentWorkflow.id);
      if (index >= 0) {
        return prev.map((w, i) => i === index ? currentWorkflow : w);
      }
      return [...prev, { ...currentWorkflow, id: Date.now().toString(), createdAt: new Date().toISOString() }];
    });
    setActiveTab('workflows');
    setCurrentWorkflow(null);
  };

  // Create new workflow from template
  const createFromTemplate = (template: any) => {
    const newWorkflow: Workflow = {
      id: `new-${Date.now()}`,
      name: template.name,
      description: template.description,
      status: 'draft',
      trigger: 'manual',
      nodes: template.nodes.map((node: any, i: number) => ({
        ...node,
        id: `${node.type}-${Date.now()}-${i}`
      })),
      connections: template.connections,
      lastRun: null,
      nextRun: null,
      createdAt: new Date().toISOString()
    };

    setCurrentWorkflow(newWorkflow);
    setActiveTab('editor');
  };

  // Get connection path
  const getConnectionPath = (from: NodePosition, to: NodePosition) => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const midX = from.x + dx * 0.5;
    
    return `M ${from.x + 100} ${from.y + 30} 
            C ${midX + 50} ${from.y + 30}, 
              ${midX - 50} ${to.y + 30}, 
              ${to.x} ${to.y + 30}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Workflow Automation
                </h1>
                <p className="text-gray-600">Build, connect, and automate your processes</p>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button 
              onClick={() => {
                const newWorkflow: Workflow = {
                  id: `new-${Date.now()}`,
                  name: 'New Workflow',
                  description: 'Build your automation',
                  status: 'draft',
                  trigger: 'manual',
                  nodes: [
                    { id: 'trigger-start', type: 'trigger', position: { x: 100, y: 200 }, config: { title: 'Start' } }
                  ],
                  connections: [],
                  lastRun: null,
                  nextRun: null,
                  createdAt: new Date().toISOString()
                };
                setCurrentWorkflow(newWorkflow);
                setActiveTab('editor');
              }}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus className="mr-2 w-5 h-5" /> Create Workflow
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-white rounded-xl p-2 shadow-sm border border-gray-200">
          {[
            { key: 'workflows', label: 'My Workflows', icon: <LayoutGrid className="w-4 h-4" /> },
            { key: 'templates', label: 'Templates', icon: <Copy className="w-4 h-4" /> },
            { key: 'editor', label: 'Workflow Editor', icon: <Settings className="w-4 h-4" /> }
          ].map(tab => (
            <button
              key={tab.key}
              className={`flex items-center px-6 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
                activeTab === tab.key 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md' 
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab(tab.key as any)}
            >
              {tab.icon}
              <span className="ml-2">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'workflows' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search workflows..."
                    className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-md transition-all duration-200 ${
                        viewMode === 'grid' 
                          ? 'bg-white text-blue-600 shadow-sm' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-md transition-all duration-200 ${
                        viewMode === 'list' 
                          ? 'bg-white text-blue-600 shadow-sm' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <select
                    className="border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as WorkflowStatus | 'all')}
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="error">Error</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Workflows Grid */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredWorkflows.map(workflow => (
                  <div key={workflow.id} className="group bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-blue-200 transition-all duration-300 overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                            <Zap className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {workflow.name}
                            </h3>
                            <p className="text-sm text-gray-500">{workflow.description}</p>
                          </div>
                        </div>
                        
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          workflow.status === 'active' ? 'bg-green-100 text-green-800' :
                          workflow.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                          workflow.status === 'error' ? 'bg-red-100 text-red-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {workflow.status}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <span>{workflow.nodes.length} nodes</span>
                        <span>{workflow.connections.length} connections</span>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => {
                            setCurrentWorkflow(workflow);
                            setActiveTab('editor');
                          }}
                          className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                        >
                          <Edit2 className="w-4 h-4 mr-1" />
                          Edit
                        </button>
                        <button className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium">
                          <Copy className="w-4 h-4 mr-1" />
                          Clone
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* List View would go here - simplified for space */
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 text-center text-gray-500">
                  List view - implementation similar to grid but in table format
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {TEMPLATES.map(template => (
              <div 
                key={template.name}
                className="group bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-blue-200 transition-all duration-300 cursor-pointer overflow-hidden"
                onClick={() => createFromTemplate(template)}
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl shadow-lg">
                      <Copy className="w-5 h-5 text-white" />
                    </div>
                    <div className="ml-3">
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {template.name}
                      </h3>
                      <p className="text-sm text-gray-500">{template.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {template.nodes.map(node => {
                      const nodeInfo = getNodeTypeInfo(node.type);
                      return (
                        <span 
                          key={node.id}
                          className={`px-2 py-1 text-xs rounded-lg border ${nodeInfo.lightColor} text-gray-700`}
                        >
                          {nodeInfo.label}
                        </span>
                      );
                    })}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{template.nodes.length} nodes</span>
                    <span>{template.connections.length} connections</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'editor' && currentWorkflow && (
          <div className="space-y-6">
            {/* Editor Header */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <input
                    type="text"
                    value={currentWorkflow.name}
                    onChange={(e) => setCurrentWorkflow({...currentWorkflow, name: e.target.value})}
                    className="text-2xl font-bold bg-transparent border-none outline-none text-gray-800 placeholder-gray-400"
                    placeholder="Workflow Name"
                  />
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    currentWorkflow.status === 'active' ? 'bg-green-100 text-green-800' :
                    currentWorkflow.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                    currentWorkflow.status === 'error' ? 'bg-red-100 text-red-800' : 
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {currentWorkflow.status}
                  </span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setEditorMode('design')}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                        editorMode === 'design' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
                      }`}
                    >
                      Design
                    </button>
                    <button
                      onClick={() => setEditorMode('preview')}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                        editorMode === 'preview' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
                      }`}
                    >
                      Preview
                    </button>
                  </div>
                  
                  <button 
                    onClick={saveWorkflow}
                    className="flex items-center px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Workflow
                  </button>
                </div>
              </div>
              
              <textarea
                value={currentWorkflow.description}
                onChange={(e) => setCurrentWorkflow({...currentWorkflow, description: e.target.value})}
                className="w-full px-0 py-2 bg-transparent border-none outline-none text-gray-600 placeholder-gray-400 resize-none"
                placeholder="Describe what this workflow does..."
                rows={2}
              />
            </div>

            {/* Node Palette */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Add Nodes</h3>
              <div className="flex flex-wrap gap-3">
                {NODE_TYPES.map(nodeType => (
                  <button
                    key={nodeType.type}
                    onClick={() => addNode(nodeType.type)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl border-2 border-dashed ${nodeType.lightColor} hover:border-solid hover:shadow-md transition-all duration-200 group`}
                  >
                    <div className={`p-1 rounded-lg ${nodeType.color} text-white group-hover:scale-110 transition-transform`}>
                      {nodeType.icon}
                    </div>
                    <span className="font-medium text-gray-700">{nodeType.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Workflow Canvas */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center space-x-4">
                  <h3 className="font-semibold text-gray-800">Workflow Canvas</h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setIsConnecting(!isConnecting)}
                      className={`flex items-center px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                        isConnecting 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <MousePointer className="w-4 h-4 mr-1" />
                      {isConnecting ? 'Connecting...' : 'Connect Nodes'}
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                    className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 bg-gray-100 rounded-lg text-sm font-medium">
                    {Math.round(zoom * 100)}%
                  </span>
                  <button
                    onClick={() => setZoom(Math.min(2, zoom + 0.1))}
                    className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div 
                ref={editorRef}
                className="relative w-full h-96 lg:h-[600px] overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50"
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                style={{ 
                  backgroundImage: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)',
                  backgroundSize: '20px 20px'
                }}
              >
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  style={{ transform: `scale(${zoom}) translate(${editorOffset.x}px, ${editorOffset.y}px)` }}
                >
                  {/* Render connections */}
                  {currentWorkflow.connections.map((connection, index) => {
                    const fromNode = currentWorkflow.nodes.find(n => n.id === connection.from);
                    const toNode = currentWorkflow.nodes.find(n => n.id === connection.to);
                    
                    if (!fromNode || !toNode) return null;
                    
                    return (
                      <g key={index}>
                        <path
                          d={getConnectionPath(fromNode.position, toNode.position)}
                          stroke="#6366f1"
                          strokeWidth="2"
                          fill="none"
                          markerEnd="url(#arrowhead)"
                          className="drop-shadow-sm"
                        />
                        {connection.condition && (
                          <text
                            x={(fromNode.position.x + toNode.position.x) / 2 + 50}
                            y={(fromNode.position.y + toNode.position.y) / 2 + 25}
                            className="fill-gray-600 text-xs"
                          >
                            {connection.condition}
                          </text>
                        )}
                      </g>
                    );
                  })}
                  
                  {/* Arrow marker definition */}
                  <defs>
                    <marker
                      id="arrowhead"
                      markerWidth="10"
                      markerHeight="7"
                      refX="9"
                      refY="3.5"
                      orient="auto"
                    >
                      <polygon
                        points="0 0, 10 3.5, 0 7"
                        fill="#6366f1"
                      />
                    </marker>
                  </defs>
                </svg>

                {/* Render nodes */}
                {currentWorkflow.nodes.map(node => {
                  const nodeInfo = getNodeTypeInfo(node.type);
                  const isSelected = selectedNode === node.id;
                  
                  return (
                    <div
                      key={node.id}
                      className={`absolute cursor-pointer transform transition-all duration-200 ${
                        isSelected ? 'scale-105 z-20' : 'z-10'
                      }`}
                      style={{
                        left: node.position.x * zoom + editorOffset.x,
                        top: node.position.y * zoom + editorOffset.y,
                        transform: `scale(${zoom})`
                      }}
                      onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                      onClick={() => {
                        if (isConnecting) {
                          if (connectionStart) {
                            endConnection(node.id);
                          } else {
                            startConnection(node.id);
                          }
                        } else {
                          setSelectedNode(node.id);
                        }
                      }}
                    >
                      <div className={`relative group bg-white rounded-xl shadow-lg border-2 p-4 min-w-[200px] ${
                        isSelected 
                          ? 'border-blue-500 shadow-xl' 
                          : connectionStart === node.id
                          ? 'border-yellow-400 shadow-lg'
                          : 'border-gray-200 hover:border-blue-300 hover:shadow-lg'
                      }`}>
                        {/* Node header */}
                        <div className="flex items-center space-x-3 mb-3">
                          <div className={`p-2 rounded-lg ${nodeInfo.color} text-white shadow-sm`}>
                            {nodeInfo.icon}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800 text-sm">
                              {node.config.title || nodeInfo.label}
                            </h4>
                            <p className="text-xs text-gray-500 capitalize">{nodeInfo.type}</p>
                          </div>
                          
                          {isSelected && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNode(node.id);
                              }}
                              className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        {/* Node details */}
                        {isSelected && (
                          <div className="space-y-2 border-t border-gray-100 pt-3">
                            {node.config.comment && (
                              <p className="text-xs text-gray-600 italic">
                                💭 {node.config.comment}
                              </p>
                            )}
                            {node.config.timing && (
                              <p className="text-xs text-gray-600">
                                ⏰ {node.config.timing}
                              </p>
                            )}
                          </div>
                        )}

                        {/* Connection points */}
                        <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"></div>
                        <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Node Properties Panel */}
            {selectedNode && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Node Properties
                </h3>
                
                {(() => {
                  const node = currentWorkflow.nodes.find(n => n.id === selectedNode);
                  if (!node) return null;
                  
                  return (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                          <input
                            type="text"
                            value={node.config.title || ''}
                            onChange={(e) => updateNodeConfig(node.id, { title: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Node title"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                          <textarea
                            value={node.config.comment || ''}
                            onChange={(e) => updateNodeConfig(node.id, { comment: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            rows={3}
                            placeholder="Add a comment about this node..."
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Timing</label>
                          <select
                            value={node.config.timing || 'immediate'}
                            onChange={(e) => updateNodeConfig(node.id, { timing: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="immediate">Immediate</option>
                            <option value="1 minute">1 minute delay</option>
                            <option value="5 minutes">5 minutes delay</option>
                            <option value="15 minutes">15 minutes delay</option>
                            <option value="1 hour">1 hour delay</option>
                            <option value="1 day">1 day delay</option>
                          </select>
                        </div>
                        
                        {/* Node-specific configuration */}
                        {node.type === 'email' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                            <input
                              type="email"
                              value={node.config.to || ''}
                              onChange={(e) => updateNodeConfig(node.id, { to: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="recipient@example.com"
                            />
                          </div>
                        )}
                        
                        {node.type === 'task' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Assignee</label>
                            <input
                              type="text"
                              value={node.config.assignee || ''}
                              onChange={(e) => updateNodeConfig(node.id, { assignee: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="person@example.com"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkflowAutomation;