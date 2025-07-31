"use client"
import React, { useState } from 'react';
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Plus,
  Search,
  Filter,
  ChevronDown,
  X,
  MessageSquare,
  Paperclip,
  Tag,
  User,
  Calendar,
  Flag,
  List,
  Settings,
  MoreVertical
} from 'lucide-react';

type IssueStatus = 'open' | 'in-progress' | 'resolved' | 'closed';
type Priority = 'low' | 'medium' | 'high' | 'critical';
type IssueType = 'bug' | 'feature' | 'task' | 'improvement';

interface User {
  id: string;
  name: string;
  avatar?: string;
}

interface Comment {
  id: string;
  author: User;
  text: string;
  createdAt: Date;
}

interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: string;
  uploadedAt: Date;
}

interface Issue {
  id: string;
  title: string;
  description: string;
  status: IssueStatus;
  priority: Priority;
  type: IssueType;
  projectId: string;
  taskId?: string;
  assignee?: User;
  reporter: User;
  dueDate?: Date;
  comments: Comment[];
  attachments: Attachment[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface Project {
  id: string;
  name: string;
  description: string;
}

interface Task {
  id: string;
  title: string;
  projectId: string;
}

const IssuesManagement: React.FC = () => {
  // Sample data
  const [projects, setProjects] = useState<Project[]>([
    { id: '1', name: 'Website Redesign', description: 'Complete redesign of company website' },
    { id: '2', name: 'Mobile App', description: 'Development of new mobile application' },
    { id: '3', name: 'API Integration', description: 'Integration with third-party APIs' }
  ]);

  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Homepage Layout', projectId: '1' },
    { id: '2', title: 'User Authentication', projectId: '2' },
    { id: '3', title: 'Payment Gateway', projectId: '3' }
  ]);

  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'Alex Johnson', avatar: 'https://i.pravatar.cc/150?img=1' },
    { id: '2', name: 'Sarah Williams', avatar: 'https://i.pravatar.cc/150?img=2' },
    { id: '3', name: 'Michael Chen', avatar: 'https://i.pravatar.cc/150?img=3' }
  ]);

  const [issues, setIssues] = useState<Issue[]>([
    {
      id: '1',
      title: 'Login button not working',
      description: 'The login button on the homepage does not respond when clicked',
      status: 'open',
      priority: 'high',
      type: 'bug',
      projectId: '1',
      taskId: '1',
      assignee: users[0],
      reporter: users[1],
      dueDate: new Date('2023-10-15'),
      comments: [
        {
          id: '1',
          author: users[1],
          text: 'This issue appears on Chrome browser version 115',
          createdAt: new Date('2023-09-28')
        }
      ],
      attachments: [
        {
          id: '1',
          name: 'screenshot.png',
          url: '#',
          type: 'image',
          size: '2.4 MB',
          uploadedAt: new Date('2023-09-28')
        }
      ],
      tags: ['frontend', 'authentication'],
      createdAt: new Date('2023-09-28'),
      updatedAt: new Date('2023-09-28')
    },
    {
      id: '2',
      title: 'Add dark mode toggle',
      description: 'Users should be able to switch between light and dark mode',
      status: 'in-progress',
      priority: 'medium',
      type: 'feature',
      projectId: '2',
      assignee: users[2],
      reporter: users[0],
      dueDate: new Date('2023-11-01'),
      comments: [],
      attachments: [],
      tags: ['ui', 'accessibility'],
      createdAt: new Date('2023-09-25'),
      updatedAt: new Date('2023-09-27')
    },
    {
      id: '3',
      title: 'Optimize database queries',
      description: 'Some queries are taking too long to execute',
      status: 'open',
      priority: 'high',
      type: 'improvement',
      projectId: '3',
      taskId: '3',
      assignee: undefined,
      reporter: users[2],
      dueDate: undefined,
      comments: [],
      attachments: [],
      tags: ['backend', 'performance'],
      createdAt: new Date('2023-09-30'),
      updatedAt: new Date('2023-09-30')
    }
  ]);

  // State for filters and new issue
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<IssueStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<IssueType | 'all'>('all');
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [newIssue, setNewIssue] = useState<Omit<Issue, 'id' | 'createdAt' | 'updatedAt' | 'comments' | 'attachments' | 'reporter'>>({
    title: '',
    description: '',
    status: 'open',
    priority: 'medium',
    type: 'bug',
    projectId: '',
    taskId: '',
    assignee: undefined,
    dueDate: undefined,
    tags: []
  });
  const [newComment, setNewComment] = useState('');

  // Filter issues based on current filters
  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         issue.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || issue.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || issue.priority === priorityFilter;
    const matchesType = typeFilter === 'all' || issue.type === typeFilter;
    const matchesProject = projectFilter === 'all' || issue.projectId === projectFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesType && matchesProject;
  });

  // Helper functions
  const getStatusColor = (status: IssueStatus) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-green-100 text-green-800';
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
    }
  };

  const getTypeColor = (type: IssueType) => {
    switch (type) {
      case 'bug': return 'bg-red-100 text-red-800';
      case 'feature': return 'bg-blue-100 text-blue-800';
      case 'task': return 'bg-purple-100 text-purple-800';
      case 'improvement': return 'bg-green-100 text-green-800';
    }
  };

  const handleCreateIssue = () => {
    const createdIssue: Issue = {
      ...newIssue,
      id: `issue-${Date.now()}`,
      reporter: users[0], // In a real app, use the logged-in user
      comments: [],
      attachments: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setIssues([...issues, createdIssue]);
    setIsCreateModalOpen(false);
    setNewIssue({
      title: '',
      description: '',
      status: 'open',
      priority: 'medium',
      type: 'bug',
      projectId: '',
      taskId: '',
      assignee: undefined,
      dueDate: undefined,
      tags: []
    });
  };

  const handleAddComment = (issueId: string) => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: `comment-${Date.now()}`,
      author: users[0], // Current user
      text: newComment,
      createdAt: new Date()
    };

    setIssues(issues.map(issue => 
      issue.id === issueId 
        ? { ...issue, comments: [...issue.comments, comment] } 
        : issue
    ));
    setNewComment('');
  };

  const handleStatusChange = (issueId: string, newStatus: IssueStatus) => {
    setIssues(issues.map(issue => 
      issue.id === issueId 
        ? { ...issue, status: newStatus, updatedAt: new Date() } 
        : issue
    ));
  };

  const handleAssigneeChange = (issueId: string, userId: string) => {
    const assignee = users.find(user => user.id === userId);
    setIssues(issues.map(issue => 
      issue.id === issueId 
        ? { ...issue, assignee, updatedAt: new Date() } 
        : issue
    ));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header and Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <AlertCircle className="w-6 h-6 mr-2 text-red-500" />
            Issues
          </h2>
          <p className="text-sm text-gray-500">Track and manage all project issues</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search issues..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-1" />
            New Issue
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <div className="relative">
          <select
            className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as IssueStatus | 'all')}
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
        
        <div className="relative">
          <select
            className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as Priority | 'all')}
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
        
        <div className="relative">
          <select
            className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as IssueType | 'all')}
          >
            <option value="all">All Types</option>
            <option value="bug">Bug</option>
            <option value="feature">Feature</option>
            <option value="task">Task</option>
            <option value="improvement">Improvement</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
        
        <div className="relative">
          <select
            className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
          >
            <option value="all">All Projects</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>{project.name}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
        
        <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
          <Filter className="w-4 h-4 mr-1" />
          More Filters
        </button>
      </div>

      {/* Issues List */}
      <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
        {filteredIssues.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-3 text-lg font-medium text-gray-900">No issues found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery ? "Try adjusting your search or filter criteria" : "Create a new issue to get started"}
            </p>
            <button 
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              onClick={() => setIsCreateModalOpen(true)}
            >
              Create Issue
            </button>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredIssues.map(issue => {
              const project = projects.find(p => p.id === issue.projectId);
              const task = issue.taskId ? tasks.find(t => t.id === issue.taskId) : undefined;
              
              return (
                <li 
                  key={issue.id} 
                  className="px-6 py-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedIssue(issue)}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      {issue.status === 'closed' ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : issue.status === 'in-progress' ? (
                        <Clock className="h-5 w-5 text-blue-500" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                    
                    <div className="ml-3 flex-1 min-w-0">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {issue.title}
                        </p>
                        <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${getPriorityColor(issue.priority)}`}>
                          {issue.priority}
                        </span>
                        <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${getTypeColor(issue.type)}`}>
                          {issue.type}
                        </span>
                      </div>
                      
                      <div className="mt-1 flex flex-wrap items-center text-sm text-gray-500">
                        <span className="flex items-center mr-3">
                          <span className="truncate">
                            {project?.name}
                            {task && ` • ${task.title}`}
                          </span>
                        </span>
                        
                        {issue.assignee && (
                          <span className="flex items-center mr-3">
                            <span className="truncate">
                              {issue.assignee.name}
                            </span>
                          </span>
                        )}
                        
                        {issue.dueDate && (
                          <span className="flex items-center mr-3">
                            <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                            <span>
                              {new Date(issue.dueDate).toLocaleDateString()}
                            </span>
                          </span>
                        )}
                        
                        <span className="flex items-center">
                          <MessageSquare className="w-4 h-4 mr-1 text-gray-400" />
                          <span>{issue.comments.length}</span>
                        </span>
                      </div>
                      
                      {issue.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {issue.tags.map(tag => (
                            <span key={tag} className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-800">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="ml-4 flex-shrink-0">
                      <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(issue.status)}`}>
                        {issue.status}
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Issue Detail Modal */}
    {selectedIssue && (
  <div className="fixed inset-0 z-50 overflow-hidden">
    {/* Overlay */}
    <div 
      className="absolute inset-0 bg-[rgba(0,0,0,0.5)] transition-opacity"
      onClick={() => setSelectedIssue(null)}
    ></div>
    
    {/* Drawer */}
    <div className="absolute inset-y-0 right-0 flex">
      <div className="relative w-full max-w-[70vw]">
        <div className="h-full flex flex-col bg-white shadow-xl overflow-y-auto">
          <div className="flex justify-between items-center border-b p-4">
            <div className="flex items-center space-x-2">
              {selectedIssue.status === 'closed' ? (
                <CheckCircle className="h-6 w-6 text-green-500" />
              ) : selectedIssue.status === 'in-progress' ? (
                <Clock className="h-6 w-6 text-blue-500" />
              ) : (
                <AlertCircle className="h-6 w-6 text-red-500" />
              )}
              <h3 className="text-lg font-medium text-gray-900">{selectedIssue.title}</h3>
            </div>
            <button 
              onClick={() => setSelectedIssue(null)}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="p-6 flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Main Content - Left Side (50%) */}
              <div>
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
                  <p className="text-gray-700 whitespace-pre-line">{selectedIssue.description}</p>
                </div>
                
                {/* Comments Section */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Comments ({selectedIssue.comments.length})</h4>
                  
                  {selectedIssue.comments.length > 0 ? (
                    <div className="space-y-4">
                      {selectedIssue.comments.map(comment => (
                        <div key={comment.id} className="flex">
                          <div className="flex-shrink-0 mr-3">
                            {comment.author.avatar ? (
                              <img 
                                className="h-8 w-8 rounded-full" 
                                src={comment.author.avatar} 
                                alt={comment.author.name}
                              />
                            ) : (
                              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                                {comment.author.name.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900">
                              {comment.author.name}
                              <span className="ml-2 text-xs text-gray-500">
                                {new Date(comment.createdAt).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 mt-1">{comment.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No comments yet</p>
                  )}
                  
                  <div className="mt-4">
                    <textarea
                      className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                    <div className="mt-2 flex justify-end">
                      <button
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
                        onClick={() => handleAddComment(selectedIssue.id)}
                        disabled={!newComment.trim()}
                      >
                        Comment
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Attachments Section */}
                {selectedIssue.attachments.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Attachments ({selectedIssue.attachments.length})</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedIssue.attachments.map(attachment => (
                        <div key={attachment.id} className="border rounded-lg p-3 flex items-center">
                          <Paperclip className="h-5 w-5 text-gray-400 mr-2" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{attachment.name}</p>
                            <p className="text-xs text-gray-500">{attachment.size} • {new Date(attachment.uploadedAt).toLocaleDateString()}</p>
                          </div>
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            Download
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Sidebar - Right Side (50%) */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Details</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Status</span>
                      <select
                        className="text-sm font-medium rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={selectedIssue.status}
                        onChange={(e) => handleStatusChange(selectedIssue.id, e.target.value as IssueStatus)}
                      >
                        <option value="open">Open</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Priority</span>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${getPriorityColor(selectedIssue.priority)}`}>
                        {selectedIssue.priority}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Type</span>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${getTypeColor(selectedIssue.type)}`}>
                        {selectedIssue.type}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Project</span>
                      <span className="text-sm font-medium">
                        {projects.find(p => p.id === selectedIssue.projectId)?.name}
                      </span>
                    </div>
                    
                    {selectedIssue.taskId && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Task</span>
                        <span className="text-sm font-medium">
                          {tasks.find(t => t.id === selectedIssue.taskId)?.title}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Reporter</span>
                      <div className="flex items-center">
                        {selectedIssue.reporter.avatar ? (
                          <img 
                            className="h-5 w-5 rounded-full mr-1" 
                            src={selectedIssue.reporter.avatar} 
                            alt={selectedIssue.reporter.name}
                          />
                        ) : (
                          <div className="h-5 w-5 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600 mr-1">
                            {selectedIssue.reporter.name.charAt(0)}
                          </div>
                        )}
                        <span className="text-sm font-medium">{selectedIssue.reporter.name}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Assignee</span>
                      <select
                        className="text-sm rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={selectedIssue.assignee?.id || ''}
                        onChange={(e) => handleAssigneeChange(selectedIssue.id, e.target.value)}
                      >
                        <option value="">Unassigned</option>
                        {users.map(user => (
                          <option key={user.id} value={user.id}>{user.name}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Created</span>
                      <span className="text-sm">
                        {new Date(selectedIssue.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Updated</span>
                      <span className="text-sm">
                        {new Date(selectedIssue.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {selectedIssue.dueDate && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Due Date</span>
                        <input
                          type="date"
                          className="text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={selectedIssue.dueDate.toISOString().split('T')[0]}
                          onChange={(e) => {
                            setSelectedIssue({
                              ...selectedIssue,
                              dueDate: new Date(e.target.value),
                              updatedAt: new Date()
                            });
                            setIssues(issues.map(issue => 
                              issue.id === selectedIssue.id 
                                ? { ...issue, dueDate: new Date(e.target.value), updatedAt: new Date() } 
                                : issue
                            ));
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Tags Section */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedIssue.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-800 flex items-center">
                        {tag}
                        <button 
                          className="ml-1 text-gray-400 hover:text-gray-600"
                          onClick={() => {
                            const newTags = selectedIssue.tags.filter(t => t !== tag);
                            setSelectedIssue({
                              ...selectedIssue,
                              tags: newTags,
                              updatedAt: new Date()
                            });
                            setIssues(issues.map(issue => 
                              issue.id === selectedIssue.id 
                                ? { ...issue, tags: newTags, updatedAt: new Date() } 
                                : issue
                            ));
                          }}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      className="text-xs border border-gray-300 rounded-full px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Add tag"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                          const newTag = e.currentTarget.value.trim();
                          if (!selectedIssue.tags.includes(newTag)) {
                            const newTags = [...selectedIssue.tags, newTag];
                            setSelectedIssue({
                              ...selectedIssue,
                              tags: newTags,
                              updatedAt: new Date()
                            });
                            setIssues(issues.map(issue => 
                              issue.id === selectedIssue.id 
                                ? { ...issue, tags: newTags, updatedAt: new Date() } 
                                : issue
                            ));
                          }
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                  </div>
                </div>
                
                {/* Actions Section */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Actions</h4>
                  <div className="space-y-2">
                    <button className="w-full px-3 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 rounded-lg flex items-center">
                      <Paperclip className="w-4 h-4 mr-2 text-gray-400" />
                      Add attachment
                    </button>
                    <button className="w-full px-3 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 rounded-lg flex items-center">
                      <Tag className="w-4 h-4 mr-2 text-gray-400" />
                      Add label
                    </button>
                    <button className="w-full px-3 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 rounded-lg flex items-center">
                      <List className="w-4 h-4 mr-2 text-gray-400" />
                      Add to sprint
                    </button>
                    <button className="w-full px-3 py-2 text-sm text-left text-red-600 hover:bg-red-50 rounded-lg flex items-center">
                      <X className="w-4 h-4 mr-2" />
                      Delete issue
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

      {/* Create Issue Modal */}
  {isCreateModalOpen && (
  <div className="fixed inset-0 z-50 overflow-hidden">
    {/* Overlay */}
    <div 
      className="absolute inset-0 bg-[rgba(0,0,0,0.5)] transition-opacity"
      onClick={() => setIsCreateModalOpen(false)}
    ></div>
    
    {/* Drawer */}
    <div className="absolute inset-y-0 right-0 flex">
      <div className="relative w-full max-w-2xl">
        <div className="h-full flex flex-col bg-white shadow-xl overflow-y-auto">
          <div className="flex justify-between items-center border-b p-4">
            <h3 className="text-lg font-medium text-gray-900">Create New Issue</h3>
            <button 
              onClick={() => setIsCreateModalOpen(false)}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="issue-title" className="block text-sm font-medium text-gray-700 mb-1">
                Title*
              </label>
              <input
                type="text"
                id="issue-title"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={newIssue.title}
                onChange={(e) => setNewIssue({...newIssue, title: e.target.value})}
                placeholder="Brief description of the issue"
              />
            </div>
            
            <div>
              <label htmlFor="issue-description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="issue-description"
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={newIssue.description}
                onChange={(e) => setNewIssue({...newIssue, description: e.target.value})}
                placeholder="Detailed description of the issue"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="issue-project" className="block text-sm font-medium text-gray-700 mb-1">
                  Project*
                </label>
                <select
                  id="issue-project"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={newIssue.projectId}
                  onChange={(e) => setNewIssue({...newIssue, projectId: e.target.value})}
                >
                  <option value="">Select project</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="issue-task" className="block text-sm font-medium text-gray-700 mb-1">
                  Related Task (optional)
                </label>
                <select
                  id="issue-task"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={newIssue.taskId}
                  onChange={(e) => setNewIssue({...newIssue, taskId: e.target.value})}
                >
                  <option value="">Select task</option>
                  {tasks.filter(task => task.projectId === newIssue.projectId).map(task => (
                    <option key={task.id} value={task.id}>{task.title}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="issue-type" className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  id="issue-type"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={newIssue.type}
                  onChange={(e) => setNewIssue({...newIssue, type: e.target.value as IssueType})}
                >
                  <option value="bug">Bug</option>
                  <option value="feature">Feature</option>
                  <option value="task">Task</option>
                  <option value="improvement">Improvement</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="issue-priority" className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  id="issue-priority"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={newIssue.priority}
                  onChange={(e) => setNewIssue({...newIssue, priority: e.target.value as Priority})}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="issue-status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="issue-status"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={newIssue.status}
                  onChange={(e) => setNewIssue({...newIssue, status: e.target.value as IssueStatus})}
                >
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="issue-assignee" className="block text-sm font-medium text-gray-700 mb-1">
                  Assignee (optional)
                </label>
                <select
                  id="issue-assignee"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={newIssue.assignee?.id || ''}
                  onChange={(e) => {
                    const assignee = users.find(user => user.id === e.target.value);
                    setNewIssue({...newIssue, assignee});
                  }}
                >
                  <option value="">Unassigned</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="issue-due-date" className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date (optional)
                </label>
                <input
                  type="date"
                  id="issue-due-date"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={newIssue.dueDate ? newIssue.dueDate.toISOString().split('T')[0] : ''}
                  onChange={(e) => setNewIssue({...newIssue, dueDate: e.target.value ? new Date(e.target.value) : undefined})}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="issue-tags" className="block text-sm font-medium text-gray-700 mb-1">
                Tags (optional)
              </label>
              <input
                type="text"
                id="issue-tags"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Comma-separated tags (e.g., frontend, bug, ui)"
                onChange={(e) => {
                  const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
                  setNewIssue({...newIssue, tags});
                }}
              />
            </div>
          </div>
          
          <div className="border-t px-4 py-3 flex justify-end space-x-3 mt-auto">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateIssue}
              disabled={!newIssue.title || !newIssue.projectId}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              Create Issue
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

export default IssuesManagement;