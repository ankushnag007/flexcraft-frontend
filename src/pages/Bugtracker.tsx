import React, { useState } from 'react';
import { 
  AlertCircle, Search, Filter, ChevronDown, List, LayoutGrid, 
  Plus, X, Check, Circle, Clock, User, Tag, GitPullRequest, 
  MoreVertical
} from 'lucide-react';

interface Bug {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignee: string;
  reporter: string;
  createdAt: string;
  updatedAt: string;
  labels: string[];
}

const BugTracker: React.FC = () => {
  // Sample bug data
  const [bugs, setBugs] = useState<Bug[]>([
    {
      id: '1',
      title: 'Login page not loading on Safari',
      description: 'Users report blank screen when accessing login page on Safari browser.',
      status: 'open',
      priority: 'high',
      assignee: 'Unassigned',
      reporter: 'John Doe',
      createdAt: '2024-03-10',
      updatedAt: '2024-03-10',
      labels: ['frontend', 'browser']
    },
    {
      id: '2',
      title: 'API returns 500 error on invalid input',
      description: 'POST /users endpoint crashes when email format is incorrect.',
      status: 'in-progress',
      priority: 'critical',
      assignee: 'Jane Smith',
      reporter: 'Mike Johnson',
      createdAt: '2024-03-08',
      updatedAt: '2024-03-09',
      labels: ['backend', 'api']
    },
    {
      id: '3',
      title: 'Mobile menu overlaps content',
      description: 'On smaller screens, the dropdown menu covers page content.',
      status: 'open',
      priority: 'medium',
      assignee: 'Unassigned',
      reporter: 'Sarah Williams',
      createdAt: '2024-03-05',
      updatedAt: '2024-03-05',
      labels: ['mobile', 'ui']
    },
    {
      id: '4',
      title: 'Broken image upload',
      description: 'PNG files fail to upload with "Invalid format" error.',
      status: 'resolved',
      priority: 'medium',
      assignee: 'Alex Chen',
      reporter: 'Emily Davis',
      createdAt: '2024-02-28',
      updatedAt: '2024-03-02',
      labels: ['upload', 'media']
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [isCreatingBug, setIsCreatingBug] = useState(false);
  const [newBug, setNewBug] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    labels: [] as string[],
  });

  // Filter bugs based on search query
  const filteredBugs = bugs.filter(bug =>
    bug.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bug.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle bug creation
  const handleCreateBug = () => {
    if (!newBug.title.trim()) return;

    const bug: Bug = {
      id: Date.now().toString(),
      title: newBug.title,
      description: newBug.description,
      status: 'open',
      priority: newBug.priority,
      assignee: 'Unassigned',
      reporter: 'Current User',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      labels: newBug.labels
    };

    setBugs([...bugs, bug]);
    setIsCreatingBug(false);
    setNewBug({ title: '', description: '', priority: 'medium', labels: [] });
  };

  // Update bug status
  const updateBugStatus = (id: string, status: Bug['status']) => {
    setBugs(bugs.map(bug => 
      bug.id === id ? { ...bug, status, updatedAt: new Date().toISOString().split('T')[0] } : bug
    ));
  };

  // Priority badge styling
  const getPriorityColor = (priority: Bug['priority']) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Status badge styling
  const getStatusColor = (status: Bug['status']) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-purple-100 text-purple-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header & Controls */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <AlertCircle className="w-6 h-6 mr-2 text-red-500" />
          Bug Tracker
        </h1>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search bugs..."
              className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <button className="flex items-center px-3 py-2 border rounded-md hover:bg-gray-100">
            <Filter className="w-4 h-4 mr-2" />
            Filters
            <ChevronDown className="w-4 h-4 ml-2" />
          </button>
          
          <div className="flex items-center space-x-1 bg-gray-100 rounded-md p-1">
            <button
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
              onClick={() => setViewMode('list')}
              title="List view"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
              onClick={() => setViewMode('grid')}
              title="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
          
          <button
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            onClick={() => setIsCreatingBug(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Report Bug
          </button>
        </div>
      </div>

      {/* Bugs List (Table View) */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bug</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reported</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBugs.map((bug) => (
                <tr key={bug.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <AlertCircle className="w-5 h-5 mr-3 text-red-500" />
                      <div>
                        <div className="font-medium text-gray-900">{bug.title}</div>
                        <div className="text-sm text-gray-500">{bug.description.substring(0, 60)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(bug.status)}`}>
                      {bug.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(bug.priority)}`}>
                      {bug.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {bug.assignee}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {bug.createdAt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      onClick={() => updateBugStatus(bug.id, 'resolved')}
                    >
                      Resolve
                    </button>
                    <button className="text-gray-600 hover:text-gray-900">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Bugs Grid (Card View) */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBugs.map((bug) => (
            <div key={bug.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-gray-900 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
                  {bug.title}
                </h3>
                <div className="flex space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(bug.priority)}`}>
                    {bug.priority}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(bug.status)}`}>
                    {bug.status}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">{bug.description.substring(0, 100)}...</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center">
                  <User className="w-3 h-3 mr-1" />
                  <span>{bug.assignee}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  <span>{bug.createdAt}</span>
                </div>
              </div>
              <div className="mt-3 flex justify-between items-center">
                <div className="flex flex-wrap gap-1">
                  {bug.labels.map(label => (
                    <span key={label} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                      {label}
                    </span>
                  ))}
                </div>
                <button
                  className="text-sm px-3 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200"
                  onClick={() => updateBugStatus(bug.id, 'resolved')}
                >
                  Resolve
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Bug Modal */}
      {isCreatingBug && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Report New Bug</h3>
              <button onClick={() => setIsCreatingBug(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title*</label>
                <input
                  type="text"
                  placeholder="Brief description of the bug"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newBug.title}
                  onChange={(e) => setNewBug({...newBug, title: e.target.value})}
                  autoFocus
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  placeholder="Steps to reproduce, expected vs actual behavior..."
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  value={newBug.description}
                  onChange={(e) => setNewBug({...newBug, description: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newBug.priority}
                  onChange={(e) => setNewBug({...newBug, priority: e.target.value as any})}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Labels</label>
                <div className="flex flex-wrap gap-2">
                  {['frontend', 'backend', 'ui', 'api', 'mobile'].map(label => (
                    <button
                      key={label}
                      className={`text-xs px-2 py-1 rounded-full ${newBug.labels.includes(label) ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
                      onClick={() => {
                        if (newBug.labels.includes(label)) {
                          setNewBug({...newBug, labels: newBug.labels.filter(l => l !== label)});
                        } else {
                          setNewBug({...newBug, labels: [...newBug.labels, label]});
                        }
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                className="px-4 py-2 border rounded-md hover:bg-gray-100"
                onClick={() => setIsCreatingBug(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                onClick={handleCreateBug}
              >
                Report Bug
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BugTracker;