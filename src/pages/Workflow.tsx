import React, { useState } from 'react';
import { 
  Zap, Plus, ChevronDown, ChevronRight, Clock, CheckCircle,
  AlertCircle, Pause, Play, Trash2, Edit2, Copy, Search, Mail, 
  Video, MessageSquare, Terminal, Calendar, UserPlus, Server, 
  Cloud, Bell, LayoutGrid, List
} from 'lucide-react';

type WorkflowStatus = 'active' | 'paused' | 'error' | 'draft';
type TriggerType = 'schedule' | 'webhook' | 'manual' | 'event';
type StepType = 'task' | 'email' | 'chat' | 'meeting' | 'deployment';

interface WorkflowStep {
  id: string;
  type: StepType;
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
  };
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  status: WorkflowStatus;
  trigger: TriggerType;
  steps: WorkflowStep[];
  lastRun: string | null;
  nextRun: string | null;
  createdAt: string;
}

const TEMPLATES = [
  {
    name: "Task Creation",
    description: "Create and assign tasks automatically",
    icon: <CheckCircle className="w-5 h-5 text-blue-500" />,
    steps: [
      { type: 'task', config: { title: "Review new request", assignee: "Team Lead" } },
      { type: 'email', config: { to: "team@example.com", subject: "New task assigned" } }
    ]
  },
  {
    name: "API Testing",
    description: "Notify testers when API is ready",
    icon: <Terminal className="w-5 h-5 text-green-500" />,
    steps: [
      { type: 'email', config: { to: "qa@example.com", subject: "API Ready for Testing" } },
      { type: 'chat', config: { channel: "testing", message: "New API version available" } }
    ]
  },
  {
    name: "Sprint Planning",
    description: "Automate meeting scheduling",
    icon: <Calendar className="w-5 h-5 text-purple-500" />,
    steps: [
      { type: 'meeting', config: { 
        title: "Sprint Planning", 
        participants: ["team@example.com"], 
        duration: 60 
      }},
      { type: 'chat', config: { channel: "general", message: "Sprint meeting scheduled" } }
    ]
  },
  {
    name: "Production Deployment",
    description: "Automated deployment pipeline",
    icon: <Cloud className="w-5 h-5 text-orange-500" />,
    steps: [
      { type: 'deployment', config: { environment: "production", notifyOn: "success" } },
      { type: 'email', config: { to: "ops@example.com", subject: "Deployment initiated" } }
    ]
  }
];

const WorkflowAutomation: React.FC = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([
    {
      id: '1',
      name: 'Bug Triage',
      description: 'Automatically triage and assign bugs',
      status: 'active',
      trigger: 'event',
      steps: [
        { 
          id: '1-1', 
          type: 'task', 
          config: { title: "Triage bug report", assignee: "QA Lead" } 
        },
        { 
          id: '1-2', 
          type: 'email', 
          config: { to: "dev@example.com", subject: "New bug report" } 
        }
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
  const [newWorkflow, setNewWorkflow] = useState<Omit<Workflow, 'id' | 'status' | 'lastRun' | 'nextRun' | 'createdAt'>>({
    name: '',
    description: '',
    trigger: 'manual',
    steps: []
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter workflows based on search and status
  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch = workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         workflow.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || workflow.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Toggle workflow selection
  const toggleWorkflow = (id: string) => {
    setSelectedWorkflow(selectedWorkflow === id ? null : id);
  };

  // Toggle workflow status
  const toggleWorkflowStatus = (id: string) => {
    setWorkflows(workflows.map(w => 
      w.id === id ? { ...w, status: w.status === 'active' ? 'paused' : 'active' } : w
    ));
  };

  // Add new step to workflow
  const addStep = (type: StepType) => {
    const defaultConfigs = {
      task: { title: 'New Task', assignee: '' },
      email: { to: '', subject: '', body: '' },
      chat: { channel: '', message: '' },
      meeting: { title: '', participants: [], duration: 30 },
      deployment: { environment: 'staging', notifyOn: 'all' }
    };
    
    setNewWorkflow(prev => ({
      ...prev,
      steps: [
        ...prev.steps,
        {
          id: Date.now().toString(),
          type,
          config: defaultConfigs[type]
        }
      ]
    }));
  };

  // Update step configuration
  const updateStepConfig = (stepId: string, config: any) => {
    setNewWorkflow(prev => ({
      ...prev,
      steps: prev.steps.map(step => 
        step.id === stepId ? { ...step, config } : step
      )
    }));
  };

  // Create new workflow
  const createWorkflow = () => {
    const workflow: Workflow = {
      id: Date.now().toString(),
      ...newWorkflow,
      status: 'draft',
      lastRun: null,
      nextRun: null,
      createdAt: new Date().toISOString()
    };
    
    setWorkflows([...workflows, workflow]);
    setShowCreateModal(false);
    setNewWorkflow({
      name: '',
      description: '',
      trigger: 'manual',
      steps: []
    });
  };

  // Get status icon
  const getStatusIcon = (status: WorkflowStatus) => {
    switch (status) {
      case 'active': return <Play className="w-4 h-4 text-green-500" />;
      case 'paused': return <Pause className="w-4 h-4 text-yellow-500" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'draft': return <Edit2 className="w-4 h-4 text-gray-500" />;
      default: return null;
    }
  };

  // Get step icon
  const getStepIcon = (type: StepType) => {
    switch (type) {
      case 'task': return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'email': return <Mail className="w-4 h-4 text-green-500" />;
      case 'chat': return <MessageSquare className="w-4 h-4 text-purple-500" />;
      case 'meeting': return <Video className="w-4 h-4 text-red-500" />;
      case 'deployment': return <Terminal className="w-4 h-4 text-orange-500" />;
      default: return <Zap className="w-4 h-4 text-yellow-500" />;
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <Zap className="mr-2 text-yellow-500" /> Workflow Automation
          </h1>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="mr-2 w-4 h-4" /> Create Workflow
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search workflows..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-500'}`}
                >
                  <LayoutGrid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-500'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
              <div className="flex items-center">
                <label htmlFor="status-filter" className="mr-2 text-sm text-gray-600">Status:</label>
                <select
                  id="status-filter"
                  className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as WorkflowStatus | 'all')}
                >
                  <option value="all">All</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="error">Error</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Workflows List */}
        {filteredWorkflows.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            No workflows found. Create your first workflow to get started.
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkflows.map(workflow => (
              <div key={workflow.id} className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
                <div className="p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 rounded-full bg-blue-50">
                      <Zap className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{workflow.name}</h3>
                      <p className="text-sm text-gray-500">{workflow.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className={`px-2 py-1 rounded-full ${
                      workflow.status === 'active' ? 'bg-green-100 text-green-800' :
                      workflow.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                      workflow.status === 'error' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {workflow.status}
                    </span>
                    <span className="text-gray-500">{workflow.steps.length} steps</span>
                  </div>
                </div>
                <div className="border-t border-gray-200 px-4 py-3 bg-gray-50 flex justify-between">
                  <button 
                    onClick={() => toggleWorkflowStatus(workflow.id)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    {workflow.status === 'active' ? 'Pause' : 'Activate'}
                  </button>
                  <button 
                    onClick={() => toggleWorkflow(workflow.id)}
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    {selectedWorkflow === workflow.id ? 'Hide Details' : 'View Details'}
                  </button>
                </div>
                {selectedWorkflow === workflow.id && (
                  <div className="border-t border-gray-200 p-4 bg-gray-50">
                    <h4 className="font-medium text-gray-700 mb-2">Workflow Steps</h4>
                    <div className="space-y-3">
                      {workflow.steps.map(step => (
                        <div key={step.id} className="flex items-start space-x-2">
                          {getStepIcon(step.type)}
                          <div>
                            <p className="text-sm font-medium capitalize">{step.type}</p>
                            {step.config.title && <p className="text-xs text-gray-500">{step.config.title}</p>}
                            {step.config.subject && <p className="text-xs text-gray-500">{step.config.subject}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <button className="px-3 py-1 text-sm bg-gray-100 rounded-md hover:bg-gray-200">
                        <Edit2 className="w-4 h-4 inline mr-1" /> Edit
                      </button>
                      <button className="px-3 py-1 text-sm bg-gray-100 rounded-md hover:bg-gray-200">
                        <Copy className="w-4 h-4 inline mr-1" /> Duplicate
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trigger</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Steps</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Run</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredWorkflows.map(workflow => (
                  <React.Fragment key={workflow.id}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-blue-50">
                            <Zap className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{workflow.name}</div>
                            <div className="text-sm text-gray-500">{workflow.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(workflow.status)}
                          <span className="ml-2 text-sm capitalize">{workflow.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                        {workflow.trigger}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {workflow.steps.length}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {workflow.lastRun ? new Date(workflow.lastRun).toLocaleString() : 'Never'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => toggleWorkflow(workflow.id)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          {selectedWorkflow === workflow.id ? 'Hide' : 'View'}
                        </button>
                        <button 
                          onClick={() => toggleWorkflowStatus(workflow.id)}
                          className="text-yellow-600 hover:text-yellow-900 mr-3"
                        >
                          {workflow.status === 'active' ? 'Pause' : 'Activate'}
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <Trash2 className="w-4 h-4 inline" />
                        </button>
                      </td>
                    </tr>
                    {selectedWorkflow === workflow.id && (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 bg-gray-50">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="bg-white p-3 rounded shadow-sm">
                              <h4 className="font-medium text-gray-700 mb-1">Last Run</h4>
                              <p className="text-sm text-gray-600">
                                {workflow.lastRun ? new Date(workflow.lastRun).toLocaleString() : 'Never run'}
                              </p>
                            </div>
                            <div className="bg-white p-3 rounded shadow-sm">
                              <h4 className="font-medium text-gray-700 mb-1">Next Run</h4>
                              <p className="text-sm text-gray-600">
                                {workflow.nextRun ? new Date(workflow.nextRun).toLocaleString() : 'Not scheduled'}
                              </p>
                            </div>
                            <div className="bg-white p-3 rounded shadow-sm">
                              <h4 className="font-medium text-gray-700 mb-1">Created</h4>
                              <p className="text-sm text-gray-600">
                                {new Date(workflow.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <h4 className="font-medium text-gray-700 mb-2">Steps</h4>
                          <div className="space-y-2">
                            {workflow.steps.map(step => (
                              <div key={step.id} className="flex items-start space-x-3 p-2 bg-white rounded border border-gray-200">
                                {getStepIcon(step.type)}
                                <div className="flex-1">
                                  <p className="text-sm font-medium capitalize">{step.type}</p>
                                  {step.type === 'task' && (
                                    <p className="text-xs text-gray-500">Title: {step.config.title}, Assignee: {step.config.assignee || 'Unassigned'}</p>
                                  )}
                                  {step.type === 'email' && (
                                    <p className="text-xs text-gray-500">To: {step.config.to}, Subject: {step.config.subject}</p>
                                  )}
                                  {step.type === 'chat' && (
                                    <p className="text-xs text-gray-500">Channel: {step.config.channel}, Message: {step.config.message}</p>
                                  )}
                                  {step.type === 'meeting' && (
                                    <p className="text-xs text-gray-500">Title: {step.config.title}, Duration: {step.config.duration} mins</p>
                                  )}
                                  {step.type === 'deployment' && (
                                    <p className="text-xs text-gray-500">Environment: {step.config.environment}, Notify: {step.config.notifyOn}</p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="mt-4 flex justify-end space-x-2">
                            <button className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100">
                              <Edit2 className="w-4 h-4 inline mr-1" /> Edit
                            </button>
                            <button className="px-3 py-1 text-sm bg-gray-50 text-gray-600 rounded-md hover:bg-gray-100">
                              <Copy className="w-4 h-4 inline mr-1" /> Duplicate
                            </button>
                            <button className="px-3 py-1 text-sm bg-red-50 text-red-600 rounded-md hover:bg-red-100">
                              <Trash2 className="w-4 h-4 inline mr-1" /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Workflow Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-200 p-4 sticky top-0 bg-white z-10">
              <h2 className="text-xl font-semibold text-gray-800">Create New Workflow</h2>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-500 text-2xl"
              >
                &times;
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Workflow Configuration */}
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Workflow Name *</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      value={newWorkflow.name}
                      onChange={(e) => setNewWorkflow({...newWorkflow, name: e.target.value})}
                      placeholder="e.g. Bug Triage Workflow"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                      value={newWorkflow.description}
                      onChange={(e) => setNewWorkflow({...newWorkflow, description: e.target.value})}
                      placeholder="Describe what this workflow does"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Trigger Type *</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      value={newWorkflow.trigger}
                      onChange={(e) => setNewWorkflow({...newWorkflow, trigger: e.target.value as TriggerType})}
                    >
                      <option value="manual">Manual</option>
                      <option value="schedule">Scheduled</option>
                      <option value="webhook">Webhook</option>
                      <option value="event">Event</option>
                    </select>
                  </div>
                </div>
                
                {/* Templates */}
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Templates</h3>
                  <div className="space-y-2">
                    {TEMPLATES.map(template => (
                      <div 
                        key={template.name}
                        className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => {
                          setNewWorkflow({
                            name: template.name,
                            description: template.description,
                            trigger: 'manual',
                            steps: template.steps.map((s, i) => ({
                              id: `step-${Date.now()}-${i}`,
                              type: s.type,
                              config: {...s.config}
                            }))
                          });
                        }}
                      >
                        <div className="flex items-center">
                          {template.icon}
                          <span className="ml-2 font-medium">{template.name}</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{template.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Workflow Steps */}
              <div className="mt-8">
                <h3 className="font-medium text-gray-700 mb-4">Workflow Steps</h3>
                
                {/* Add Step Buttons */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <button 
                    onClick={() => addStep('task')}
                    className="flex items-center px-3 py-1 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" /> Add Task
                  </button>
                  <button 
                    onClick={() => addStep('email')}
                    className="flex items-center px-3 py-1 bg-green-50 text-green-600 rounded-md hover:bg-green-100"
                  >
                    <Mail className="w-4 h-4 mr-1" /> Send Email
                  </button>
                  <button 
                    onClick={() => addStep('chat')}
                    className="flex items-center px-3 py-1 bg-purple-50 text-purple-600 rounded-md hover:bg-purple-100"
                  >
                    <MessageSquare className="w-4 h-4 mr-1" /> Send Chat
                  </button>
                  <button 
                    onClick={() => addStep('meeting')}
                    className="flex items-center px-3 py-1 bg-red-50 text-red-600 rounded-md hover:bg-red-100"
                  >
                    <Video className="w-4 h-4 mr-1" /> Schedule Meeting
                  </button>
                  <button 
                    onClick={() => addStep('deployment')}
                    className="flex items-center px-3 py-1 bg-orange-50 text-orange-600 rounded-md hover:bg-orange-100"
                  >
                    <Terminal className="w-4 h-4 mr-1" /> Deploy Project
                  </button>
                </div>
                
                {/* Steps List */}
                <div className="space-y-4">
                  {newWorkflow.steps.map((step) => (
                    <div key={step.id} className="border rounded-md p-4 bg-white">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          {getStepIcon(step.type)}
                          <span className="ml-2 font-medium capitalize">{step.type}</span>
                        </div>
                        <button 
                          onClick={() => setNewWorkflow({
                            ...newWorkflow,
                            steps: newWorkflow.steps.filter(s => s.id !== step.id)
                          })}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {/* Step Configuration */}
                      {step.type === 'task' && (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Task Title *</label>
                            <input
                              type="text"
                              className="w-full px-2 py-1 border rounded"
                              value={step.config.title || ''}
                              onChange={(e) => updateStepConfig(step.id, {
                                ...step.config,
                                title: e.target.value
                              })}
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Assignee</label>
                            <input
                              type="text"
                              className="w-full px-2 py-1 border rounded"
                              value={step.config.assignee || ''}
                              onChange={(e) => updateStepConfig(step.id, {
                                ...step.config,
                                assignee: e.target.value
                              })}
                              placeholder="Email or username"
                            />
                          </div>
                        </div>
                      )}
                      
                      {step.type === 'email' && (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Recipient(s) *</label>
                            <input
                              type="text"
                              className="w-full px-2 py-1 border rounded"
                              value={step.config.to || ''}
                              onChange={(e) => updateStepConfig(step.id, {
                                ...step.config,
                                to: e.target.value
                              })}
                              placeholder="comma-separated emails"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Subject *</label>
                            <input
                              type="text"
                              className="w-full px-2 py-1 border rounded"
                              value={step.config.subject || ''}
                              onChange={(e) => updateStepConfig(step.id, {
                                ...step.config,
                                subject: e.target.value
                              })}
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Body</label>
                            <textarea
                              className="w-full px-2 py-1 border rounded"
                              rows={3}
                              value={step.config.body || ''}
                              onChange={(e) => updateStepConfig(step.id, {
                                ...step.config,
                                body: e.target.value
                              })}
                            />
                          </div>
                        </div>
                      )}
                      
                      {step.type === 'chat' && (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Channel *</label>
                            <input
                              type="text"
                              className="w-full px-2 py-1 border rounded"
                              value={step.config.channel || ''}
                              onChange={(e) => updateStepConfig(step.id, {
                                ...step.config,
                                channel: e.target.value
                              })}
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Message *</label>
                            <textarea
                              className="w-full px-2 py-1 border rounded"
                              rows={3}
                              value={step.config.message || ''}
                              onChange={(e) => updateStepConfig(step.id, {
                                ...step.config,
                                message: e.target.value
                              })}
                            />
                          </div>
                        </div>
                      )}
                      
                      {step.type === 'meeting' && (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Title *</label>
                            <input
                              type="text"
                              className="w-full px-2 py-1 border rounded"
                              value={step.config.title || ''}
                              onChange={(e) => updateStepConfig(step.id, {
                                ...step.config,
                                title: e.target.value
                              })}
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Participants</label>
                            <input
                              type="text"
                              className="w-full px-2 py-1 border rounded"
                              value={step.config.participants?.join(', ') || ''}
                              onChange={(e) => updateStepConfig(step.id, {
                                ...step.config,
                                participants: e.target.value.split(',').map(p => p.trim())
                              })}
                              placeholder="comma-separated emails"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Duration (minutes)</label>
                            <input
                              type="number"
                              className="w-full px-2 py-1 border rounded"
                              value={step.config.duration || 30}
                              onChange={(e) => updateStepConfig(step.id, {
                                ...step.config,
                                duration: parseInt(e.target.value) || 30
                              })}
                            />
                          </div>
                        </div>
                      )}
                      
                      {step.type === 'deployment' && (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Environment *</label>
                            <select
                              className="w-full px-2 py-1 border rounded"
                              value={step.config.environment || 'staging'}
                              onChange={(e) => updateStepConfig(step.id, {
                                ...step.config,
                                environment: e.target.value
                              })}
                            >
                              <option value="development">Development</option>
                              <option value="staging">Staging</option>
                              <option value="production">Production</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Notify On</label>
                            <select
                              className="w-full px-2 py-1 border rounded"
                              value={step.config.notifyOn || 'all'}
                              onChange={(e) => updateStepConfig(step.id, {
                                ...step.config,
                                notifyOn: e.target.value
                              })}
                            >
                              <option value="all">All Events</option>
                              <option value="success">Success Only</option>
                              <option value="failure">Failure Only</option>
                            </select>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6 border-t border-gray-200 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  onClick={createWorkflow}
                  disabled={!newWorkflow.name || !newWorkflow.trigger}
                  className={`px-4 py-2 rounded-md ${
                    !newWorkflow.name || !newWorkflow.trigger
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  Create Workflow
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowAutomation;