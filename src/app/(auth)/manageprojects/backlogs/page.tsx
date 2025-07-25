"use client"
import React, { useState } from 'react';
import {
  ClipboardList,
  Search,
  ChevronDown,
  Plus,
  Filter,
  ChevronsUpDown,
  Calendar,
  User,
  Flag,
  List,
  MessageSquare,
  Paperclip,
  Tag,
  X,
  Check,
  Circle,
  GanttChart,
  ChevronRight
} from 'lucide-react';

type BacklogStatus = 'backlog' | 'todo' | 'in-progress' | 'completed';
type Priority = 'high' | 'medium' | 'low';
type TaskType = 'feature' | 'bug' | 'chore' | 'research';

interface Comment {
  id: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  text: string;
  createdAt: Date;
}

interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  uploadedAt: Date;
}

interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

interface BacklogTask {
  id: string;
  title: string;
  description?: string;
  status: BacklogStatus;
  priority: Priority;
  type: TaskType;
  dueDate: Date;
  assignee: {
    id: string;
    name: string;
    avatar?: string;
  };
  subTasks?: SubTask[];
  comments?: Comment[];
  attachments?: Attachment[];
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const Backlogs: React.FC = () => {
    const users = [
        {
          id: '1',
          name: 'Alex Johnson',
          avatar: 'https://i.pravatar.cc/150?img=1'
        },
        {
          id: '2',
          name: 'Sarah Williams',
          avatar: 'https://i.pravatar.cc/150?img=2'
        },
        {
          id: '3',
          name: 'Michael Chen',
          avatar: 'https://i.pravatar.cc/150?img=3'
        }
      ];
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<TaskType | 'all'>('all');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<BacklogTask | null>(null);
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [newTask, setNewTask] = useState<Partial<BacklogTask>>({
    title: '',
    status: 'backlog',
    priority: 'medium',
    type: 'feature',
    dueDate: new Date(),
    assignee: { id: '', name: '' },
    createdAt: new Date(),
    updatedAt: new Date()
  });

  // Sample data
  const tasks: BacklogTask[] = [
    {
      id: '1',
      title: 'Implement user authentication',
      description: 'Set up JWT authentication for the API endpoints',
      status: 'backlog',
      priority: 'high',
      type: 'feature',
      dueDate: new Date('2023-09-30'),
      assignee: {
        id: '1',
        name: 'Alex Johnson',
        avatar: 'https://i.pravatar.cc/150?img=1'
      },
      subTasks: [
        { id: '1-1', title: 'Create login endpoint', completed: false },
        { id: '1-2', title: 'Setup token refresh', completed: false }
      ],
      tags: ['api', 'security'],
      createdAt: new Date('2023-08-01'),
      updatedAt: new Date('2023-08-05')
    },
    {
      id: '2',
      title: 'Fix mobile layout issues',
      description: 'Address responsive design problems on mobile devices',
      status: 'backlog',
      priority: 'medium',
      type: 'bug',
      dueDate: new Date('2023-09-25'),
      assignee: {
        id: '2',
        name: 'Sarah Williams',
        avatar: 'https://i.pravatar.cc/150?img=2'
      },
      tags: ['ui', 'mobile'],
      createdAt: new Date('2023-08-03'),
      updatedAt: new Date('2023-08-07')
    },
    {
      id: '3',
      title: 'Research new database solutions',
      description: 'Evaluate alternatives to our current database system',
      status: 'backlog',
      priority: 'low',
      type: 'research',
      dueDate: new Date('2023-10-15'),
      assignee: {
        id: '3',
        name: 'Michael Chen',
        avatar: 'https://i.pravatar.cc/150?img=3'
      },
      createdAt: new Date('2023-08-05'),
      updatedAt: new Date('2023-08-10')
    }
  ];

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    const matchesType = typeFilter === 'all' || task.type === typeFilter;
    
    return matchesSearch && matchesPriority && matchesType && task.status === 'backlog';
  });

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
    }
  };

  const getTypeColor = (type: TaskType) => {
    switch (type) {
      case 'feature': return 'bg-blue-100 text-blue-800';
      case 'bug': return 'bg-purple-100 text-purple-800';
      case 'chore': return 'bg-gray-100 text-gray-800';
      case 'research': return 'bg-indigo-100 text-indigo-800';
    }
  };

  const openTaskDrawer = (task: BacklogTask) => {
    setSelectedTask(task);
    setIsDrawerOpen(true);
  };

  const handleCreateTask = () => {
    // In a real app, you would add the task to your state or API here
    const completeTask: BacklogTask = {
      ...newTask,
      id: `task-${Date.now()}`,
      title: newTask.title || 'New Task',
      status: 'backlog',
      priority: newTask.priority || 'medium',
      type: newTask.type || 'feature',
      assignee: newTask.assignee || { id: '', name: '' },
      subTasks: [],
      comments: [],
      attachments: [],
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date()
    } as BacklogTask;
    
    console.log('New task created:', completeTask);
    setIsNewTaskOpen(false);
    setNewTask({
      title: '',
      status: 'backlog',
      priority: 'medium',
      type: 'feature',
      dueDate: new Date(),
      assignee: { id: '', name: '' },
      createdAt: new Date(),
      updatedAt: new Date()
    });
  };

  const toggleSubTask = (taskId: string, subTaskId: string) => {
    // In a real app, you would update your state or API here
    console.log(`Toggled subtask ${subTaskId} for task ${taskId}`);
  };

  const addComment = (taskId: string, commentText: string) => {
    // In a real app, you would update your state or API here
    console.log(`Added comment to task ${taskId}: ${commentText}`);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg min-h-screen ">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <ClipboardList className="w-6 h-6 mr-3 text-indigo-600" />
            Backlogs
          </h2>
          <p className="text-sm text-gray-500 mt-1 ml-9">
            Manage your pending tasks and upcoming work
          </p>
        </div>

        {/* Search and Controls */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search backlog tasks..."
              className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <select
                className="appearance-none bg-white pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as Priority | 'all')}
              >
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            <div className="relative">
              <select
                className="appearance-none bg-white pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as TaskType | 'all')}
              >
                <option value="all">All Types</option>
                <option value="feature">Feature</option>
                <option value="bug">Bug</option>
                <option value="chore">Chore</option>
                <option value="research">Research</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            <button 
              className="px-4 py-2 bg-indigo-600 rounded-lg text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              onClick={() => setIsNewTaskOpen(true)}
            >
              New Task
            </button>
          </div>
        </div>

        {/* Task Table */}
        <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          {/* Table Header */}
          <div className="grid grid-cols-12 bg-gray-100 px-6 py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">
            <div className="col-span-4 flex items-center">
              <span>Task</span>
              <ChevronsUpDown className="ml-1 w-4 h-4 text-gray-400" />
            </div>
            <div className="col-span-2 flex items-center">
              <span>Assignee</span>
              <ChevronsUpDown className="ml-1 w-4 h-4 text-gray-400" />
            </div>
            <div className="col-span-2 flex items-center">
              <span>Due Date</span>
              <ChevronsUpDown className="ml-1 w-4 h-4 text-gray-400" />
            </div>
            <div className="col-span-2 flex items-center">
              <span>Priority</span>
              <ChevronsUpDown className="ml-1 w-4 h-4 text-gray-400" />
            </div>
            <div className="col-span-2 flex items-center">
              <span>Type</span>
              <ChevronsUpDown className="ml-1 w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Task List */}
          <div className="divide-y divide-gray-200">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-12 bg-white">
                <ClipboardList className="mx-auto h-14 w-14 text-gray-300" />
                <h3 className="mt-3 text-lg font-medium text-gray-900">
                  No backlog tasks found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchQuery ? "Try changing your search query" : "Create a new task to get started"}
                </p>
                <button 
                  className="mt-4 px-4 py-2 bg-indigo-600 rounded-lg text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  onClick={() => setIsNewTaskOpen(true)}
                >
                  Add Task
                </button>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="grid grid-cols-12 px-6 py-4 hover:bg-gray-50 transition-colors bg-white cursor-pointer"
                  onClick={() => openTaskDrawer(task)}
                >
                  <div className="col-span-4">
                    <div className="font-medium text-gray-900 flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-indigo-600 rounded border-gray-300 mr-3 focus:ring-indigo-500"
                        checked={task.status === 'completed'}
                        onChange={(e) => e.stopPropagation()}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <span>{task.title}</span>
                    </div>
                    {task.description && (
                      <div className="text-sm text-gray-500 mt-1 line-clamp-1 ml-7">
                        {task.description}
                      </div>
                    )}
                  </div>
                  <div className="col-span-2 flex items-center">
                    <div className="flex items-center">
                      {task.assignee.avatar ? (
                        <img 
                          className="h-8 w-8 rounded-full mr-2" 
                          src={task.assignee.avatar} 
                          alt={task.assignee.name}
                        />
                      ) : (
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center mr-2">
                          <span className="text-indigo-800 text-xs font-medium">
                            {task.assignee.name.split(" ").map(n => n[0]).join("")}
                          </span>
                        </div>
                      )}
                      <span className="text-sm text-gray-700">{task.assignee.name}</span>
                    </div>
                  </div>
                  <div className="col-span-2 flex items-center">
                    <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">
                      {new Date(task.dueDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="col-span-2 flex items-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}
                    >
                      {task.priority}
                    </span>
                  </div>
                  <div className="col-span-2 flex items-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(task.type)}`}
                    >
                      {task.type}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredTasks.length}</span> of{" "}
            <span className="font-medium">{tasks.length}</span> results
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">
              Previous
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Task Detail Drawer */}
      {isDrawerOpen && selectedTask && (
        <div className="fixed inset-0 overflow-hidden z-50 bg-[rgba(0,0,0,0.4)] bg-opacity-40">
          <div className="absolute inset-0 overflow-hidden">
            <div 
              className="absolute inset-0 transition-opacity" 
              onClick={() => setIsDrawerOpen(false)}
            ></div>
            <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
              <div className="w-screen max-w-md">
                <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
                  <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-lg font-medium text-gray-900">{selectedTask.title}</h2>
                        <div className="flex items-center mt-2 space-x-2">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(selectedTask.priority)}`}>
                            {selectedTask.priority} priority
                          </span>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${getTypeColor(selectedTask.type)}`}>
                            {selectedTask.type}
                          </span>
                        </div>
                      </div>
                      <div className="ml-3 h-7 flex items-center">
                        <button
                          type="button"
                          className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          onClick={() => setIsDrawerOpen(false)}
                        >
                          <span className="sr-only">Close panel</span>
                          <X className="h-6 w-6" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-6 space-y-6">
                      {/* Description */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 mb-2">Description</h3>
                        <p className="text-sm text-gray-600">
                          {selectedTask.description || 'No description provided'}
                        </p>
                      </div>

                      {/* Details */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 mb-2">Assignee</h3>
                          <div className="flex items-center">
                            {selectedTask.assignee.avatar ? (
                              <img 
                                className="h-8 w-8 rounded-full mr-2" 
                                src={selectedTask.assignee.avatar} 
                                alt={selectedTask.assignee.name}
                              />
                            ) : (
                              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center mr-2">
                                <span className="text-indigo-800 text-xs font-medium">
                                  {selectedTask.assignee.name.split(" ").map(n => n[0]).join("")}
                                </span>
                              </div>
                            )}
                            <span className="text-sm text-gray-700">{selectedTask.assignee.name}</span>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 mb-2">Due Date</h3>
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                            {new Date(selectedTask.dueDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Sub Tasks */}
                      {selectedTask.subTasks && selectedTask.subTasks.length > 0 && (
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 mb-2">Sub Tasks</h3>
                          <div className="space-y-2">
                            {selectedTask.subTasks.map((subTask) => (
                              <div key={subTask.id} className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={subTask.completed}
                                  onChange={() => toggleSubTask(selectedTask.id, subTask.id)}
                                  className="h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 mr-2"
                                />
                                <span className={`text-sm ${subTask.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                                  {subTask.title}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Tags */}
                      {selectedTask.tags && selectedTask.tags.length > 0 && (
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 mb-2">Tags</h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedTask.tags.map((tag) => (
                              <span key={tag} className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Comments */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 mb-2">Comments</h3>
                        {selectedTask.comments && selectedTask.comments.length > 0 ? (
                          <div className="space-y-4">
                            {selectedTask.comments.map((comment) => (
                              <div key={comment.id} className="flex">
                                {comment.author.avatar ? (
                                  <img 
                                    className="h-8 w-8 rounded-full mr-3" 
                                    src={comment.author.avatar} 
                                    alt={comment.author.name}
                                  />
                                ) : (
                                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                                    <span className="text-indigo-800 text-xs font-medium">
                                      {comment.author.name.split(" ").map(n => n[0]).join("")}
                                    </span>
                                  </div>
                                )}
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {comment.author.name}
                                    <span className="ml-2 text-xs text-gray-500">
                                      {new Date(comment.createdAt).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-600 mt-1">{comment.text}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">No comments yet</p>
                        )}
                        <div className="mt-4">
                          <textarea
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            rows={3}
                            placeholder="Add a comment..."
                          ></textarea>
                          <button
                            className="mt-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            onClick={() => {
                              const textarea = document.querySelector('textarea');
                              if (textarea && textarea.value) {
                                addComment(selectedTask.id, textarea.value);
                                textarea.value = '';
                              }
                            }}
                          >
                            Post Comment
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 px-4 py-4 sm:px-6">
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        onClick={() => setIsDrawerOpen(false)}
                      >
                        Close
                      </button>
                      <button
                        type="button"
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Task Drawer */}
      {isNewTaskOpen && (
        <div className="fixed inset-0 overflow-hidden z-50 bg-[rgba(0,0,0,0.4)] bg-opacity-40">
          <div className="absolute inset-0 overflow-hidden">
            <div 
              className="absolute inset-0 transition-opacity" 
              onClick={() => setIsNewTaskOpen(false)}
            ></div>
            <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
              <div className="w-screen max-w-md">
                <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
                  <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                    <div className="flex items-start justify-between">
                      <h2 className="text-lg font-medium text-gray-900">New Backlog Task</h2>
                      <div className="ml-3 h-7 flex items-center">
                        <button
                          type="button"
                          className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          onClick={() => setIsNewTaskOpen(false)}
                        >
                          <span className="sr-only">Close panel</span>
                          <X className="h-6 w-6" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-6 space-y-6">
                      {/* Task Title */}
                      <div>
                        <label htmlFor="task-title" className="block text-sm font-medium text-gray-700 mb-1">
                          Title*
                        </label>
                        <input
                          type="text"
                          id="task-title"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          value={newTask.title}
                          onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                        />
                      </div>

                      {/* Description */}
                      <div>
                        <label htmlFor="task-description" className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          id="task-description"
                          rows={3}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          value={newTask.description}
                          onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                        ></textarea>
                      </div>

                      {/* Details */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="task-priority" className="block text-sm font-medium text-gray-700 mb-1">
                            Priority
                          </label>
                          <select
                            id="task-priority"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            value={newTask.priority}
                            onChange={(e) => setNewTask({...newTask, priority: e.target.value as Priority})}
                          >
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="task-type" className="block text-sm font-medium text-gray-700 mb-1">
                            Type
                          </label>
                          <select
                            id="task-type"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            value={newTask.type}
                            onChange={(e) => setNewTask({...newTask, type: e.target.value as TaskType})}
                          >
                            <option value="feature">Feature</option>
                            <option value="bug">Bug</option>
                            <option value="chore">Chore</option>
                            <option value="research">Research</option>
                          </select>
                        </div>
                      </div>

                      {/* Due Date */}
                      <div>
                        <label htmlFor="task-due-date" className="block text-sm font-medium text-gray-700 mb-1">
                          Due Date
                        </label>
                        <input
                          type="date"
                          id="task-due-date"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          value={newTask.dueDate ? new Date(newTask.dueDate).toISOString().split('T')[0] : ''}
                          onChange={(e) => setNewTask({...newTask, dueDate: new Date(e.target.value)})}
                        />
                      </div>

                      {/* Assignee */}
                      <div>
                        <label htmlFor="task-assignee" className="block text-sm font-medium text-gray-700 mb-1">
                          Assignee
                        </label>
                        <select
                          id="task-assignee"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          value={newTask.assignee?.id}
                          onChange={(e) => {
                            const selectedUser = users.find(user => user.id === e.target.value);
                            if (selectedUser) {
                              setNewTask({...newTask, assignee: selectedUser});
                            }
                          }}
                        >
                          <option value="">Unassigned</option>
                          {users?.map((user: { id: React.Key | readonly string[] | null | undefined; name: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }) => (
                            <option key={user.id} value={user.id}>{user.name}</option>
                          ))}
                        </select>
                      </div>

                      {/* Tags */}
                      <div>
                        <label htmlFor="task-tags" className="block text-sm font-medium text-gray-700 mb-1">
                          Tags
                        </label>
                        <input
                          type="text"
                          id="task-tags"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Enter tags separated by commas"
                          onChange={(e) => {
                            const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
                            setNewTask({...newTask, tags});
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 px-4 py-4 sm:px-6">
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        onClick={() => setIsNewTaskOpen(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        onClick={handleCreateTask}
                        disabled={!newTask.title}
                      >
                        Create Task
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Backlogs;