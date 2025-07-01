import { useState } from 'react';
import { 
  Users, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Grid3x3, 
  List,
  ChevronDown,
  ChevronUp,
  Star,
  GitFork,
  GanttChart,
  BarChart3,
  Plus,
  Filter,
  Search
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  teamSize: number;
  completion: number;
  startDate: string;
  deadline: string;
  status: 'on-track' | 'at-risk' | 'delayed';
  tasks: {
    completed: number;
    total: number;
  };
  priority: 'low' | 'medium' | 'high';
  lastUpdated: string;
  budget: number;
  spent: number;
  manager: string;
}

const ProjectsDashboard = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState<'all' | 'on-track' | 'at-risk' | 'delayed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  
  // Sample data - replace with API calls
  const [projects] = useState<Project[]>([
    {
      id: '1',
      name: 'E-commerce Platform',
      teamSize: 8,
      completion: 72,
      startDate: '2023-05-15',
      deadline: '2023-11-30',
      status: 'on-track',
      tasks: { completed: 18, total: 25 },
      priority: 'high',
      lastUpdated: '2023-10-20',
      budget: 50000,
      spent: 32000,
      manager: 'Sarah Johnson'
    },
    {
      id: '2',
      name: 'Mobile App Redesign',
      teamSize: 5,
      completion: 45,
      startDate: '2023-07-01',
      deadline: '2023-12-15',
      status: 'at-risk',
      tasks: { completed: 9, total: 20 },
      priority: 'medium',
      lastUpdated: '2023-10-18',
      budget: 30000,
      spent: 22000,
      manager: 'Michael Chen'
    },
    {
      id: '3',
      name: 'Data Migration',
      teamSize: 3,
      completion: 90,
      startDate: '2023-06-10',
      deadline: '2023-10-01',
      status: 'on-track',
      tasks: { completed: 27, total: 30 },
      priority: 'low',
      lastUpdated: '2023-10-22',
      budget: 20000,
      spent: 18000,
      manager: 'Alex Wong'
    }
  ]);

  const filteredProjects = projects
    .filter(project => filter === 'all' || project.status === filter)
    .filter(project => 
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.manager.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'on-track': return 'bg-green-100 text-green-800';
      case 'at-risk': return 'bg-yellow-100 text-yellow-800';
      case 'delayed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'on-track': return <CheckCircle2 className="w-4 h-4 mr-1" />;
      case 'at-risk': return <AlertTriangle className="w-4 h-4 mr-1" />;
      case 'delayed': return <Clock className="w-4 h-4 mr-1" />;
      default: return null;
    }
  };

  const calculateDaysRemaining = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const toggleProjectExpand = (projectId: string) => {
    setExpandedProject(expandedProject === projectId ? null : projectId);
  };

  const calculateBudgetUsage = (spent: number, budget: number) => {
    return Math.min(100, (spent / budget) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-xl font-bold text-blue-500">Project Portfolio</h1>
            <p className="text-gray-600 text-sm">Manage and track all your active projects</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search projects..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-2 bg-white border rounded-md ">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
                title="Grid view"
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
                title="List view"
              >
                <List className="w-5 h-5" />
              </button>
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="all">All Projects</option>
                <option value="on-track">On Track</option>
                <option value="at-risk">At Risk</option>
                <option value="delayed">Delayed</option>
              </select>
            </div>
            
            <button className="flex items-center justify-center px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-white hover:bg-blue-700 text-black hover:text-white animate-pulse ">
              <Plus className="w-5 h-5 mr-2" />
              New Project
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Projects</p>
                <p className="text-2xl font-bold mt-1">{projects.length}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-50 text-blue-600">
                <GanttChart className="w-6 h-6" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">On Track</p>
                <p className="text-2xl font-bold mt-1">
                  {projects.filter(p => p.status === 'on-track').length}
                </p>
              </div>
              <div className="p-3 rounded-full bg-green-50 text-green-600">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">At Risk</p>
                <p className="text-2xl font-bold mt-1">
                  {projects.filter(p => p.status === 'at-risk').length}
                </p>
              </div>
              <div className="p-3 rounded-full bg-yellow-50 text-yellow-600">
                <AlertTriangle className="w-6 h-6" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Delayed</p>
                <p className="text-2xl font-bold mt-1">
                  {projects.filter(p => p.status === 'delayed').length}
                </p>
              </div>
              <div className="p-3 rounded-full bg-red-50 text-red-600">
                <Clock className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div key={project.id} className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{project.name}</h3>
                      <div className="flex items-center mt-1">
                        <span className={`text-xs px-2 py-1 rounded-full mr-2 ${getPriorityColor(project.priority)}`}>
                          {project.priority} priority
                        </span>
                        <span className="text-xs text-gray-500">
                          Last updated: {new Date(project.lastUpdated).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full flex items-center ${getStatusColor(project.status)}`}>
                      {getStatusIcon(project.status)}
                      {project.status.replace('-', ' ')}
                    </span>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Completion Progress */}
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Completion</span>
                        <span>{project.completion}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            project.completion >= 70 ? 'bg-green-500' :
                            project.completion >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${project.completion}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    {/* Team and Deadline */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="w-4 h-4 mr-2 text-gray-500" />
                        <span>{project.teamSize} people</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                        <span>{calculateDaysRemaining(project.deadline)} days left</span>
                      </div>
                    </div>
                    
                    {/* Budget */}
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Budget</span>
                        <span>${project.spent.toLocaleString()} / ${project.budget.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            calculateBudgetUsage(project.spent, project.budget) <= 80 ? 'bg-green-500' :
                            calculateBudgetUsage(project.spent, project.budget) <= 95 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${calculateBudgetUsage(project.spent, project.budget)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    {/* Tasks */}
                    <div className="text-sm">
                      <div className="flex justify-between text-gray-600 mb-1">
                        <span>Tasks completed</span>
                        <span>{project.tasks.completed}/{project.tasks.total}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${(project.tasks.completed / project.tasks.total) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 px-6 py-3 border-t flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    Managed by {project.manager}
                  </span>
                  <button 
                    onClick={() => toggleProjectExpand(project.id)}
                    className="text-xs font-medium text-blue-600 hover:text-blue-800"
                  >
                    {expandedProject === project.id ? (
                      <>
                        <ChevronUp className="w-4 h-4 inline mr-1" />
                        Hide details
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4 inline mr-1" />
                        Show details
                      </>
                    )}
                  </button>
                </div>
                
                {expandedProject === project.id && (
                  <div className="border-t p-6 bg-gray-50">
                    <h4 className="text-sm font-medium mb-3">Project Details</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Start Date</p>
                        <p>{new Date(project.startDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Deadline</p>
                        <p>{new Date(project.deadline).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Budget Remaining</p>
                        <p>${(project.budget - project.spent).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Task Completion Rate</p>
                        <p>{Math.round((project.tasks.completed / project.tasks.total) * 100)}%</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manager</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completion</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tasks</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{project.name}</div>
                      <div className="text-xs text-gray-500">
                        <span className={`px-1 py-0.5 rounded ${getPriorityColor(project.priority)}`}>
                          {project.priority}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{project.manager}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2 text-gray-500" />
                        <span>{project.teamSize}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className={`h-2 rounded-full ${
                              project.completion >= 70 ? 'bg-green-500' :
                              project.completion >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${project.completion}%` }}
                          ></div>
                        </div>
                        <span>{project.completion}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        ${project.spent.toLocaleString()}/${project.budget.toLocaleString()}
                      </div>
                      <div className="w-24 bg-gray-200 rounded-full h-1 mt-1">
                        <div 
                          className={`h-1 rounded-full ${
                            calculateBudgetUsage(project.spent, project.budget) <= 80 ? 'bg-green-500' :
                            calculateBudgetUsage(project.spent, project.budget) <= 95 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${calculateBudgetUsage(project.spent, project.budget)}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        {project.tasks.completed}/{project.tasks.total}
                      </div>
                      <div className="w-24 bg-gray-200 rounded-full h-1 mt-1">
                        <div 
                          className="bg-blue-500 h-1 rounded-full" 
                          style={{ width: `${(project.tasks.completed / project.tasks.total) * 100}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(project.deadline).toLocaleDateString()}
                      </div>
                      <div className={`text-xs ${
                        calculateDaysRemaining(project.deadline) > 14 ? 'text-green-600' :
                        calculateDaysRemaining(project.deadline) > 7 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {calculateDaysRemaining(project.deadline)} days
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs flex items-center ${getStatusColor(project.status)}`}>
                        {getStatusIcon(project.status)}
                        {project.status.replace('-', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsDashboard;